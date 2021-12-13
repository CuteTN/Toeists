import io, { Socket } from "socket.io-client";
import jwtDecode from 'jwt-decode'
import events from 'events'

/**
 * [Full documentation](https://www.google.com)
 */
export default class CuteClientIO {
  /**
   * @type Socket<DefaultEventsMap, DefaultEventsMap>?
   */
  #socket = null;
  #onRejectedDueToTokenExpiredEvent = new events.EventEmitter();

  /** @type {[{event: string, msg: any}]} */
  #rejectedDueToTokenExpiredMesages = []

  /**
   * @deprecated Just in case you really need to access the real socket.io's API, I provide this to you. But try to use the supported methods or contact CuteTN first, thank you.
   */
  get socket() {
    return this.#socket;
  }

  /** @type string */
  #socketId = null;

  get socketId() {
    return this.#socketId;
  }

  #uri = null;
  #oldToken = null;
  #token = null;
  #browserId = null;

  /**
   * this is to store a list of event handlers in case you might try to subscribe onReceive to socket before connection :)
   * @type [{event: string, handleFunction: OnReceiveDelegate}]
   */
  #queueEventHandlersOnConnection = [];
  #queueAnyEventHandlersOnConnection = [];

  /**
   * set socket with new serverUri and token and connect to server
   * @param {string} serverUri The address of the server.
   * @param {string} token
   * @param {(socket: Socket<DefaultEventsMap, DefaultEventsMap>) => void} onConnected
   * @returns {CuteClientIO}
   */
  connect = (serverUri, token, onConnected) => {
    if (serverUri === this.#uri && token === this.#token) return this;

    this.#uri = serverUri;
    this.#oldToken = this.#token;
    this.#token = token;
    this.#browserId = JSON.parse(localStorage.getItem("browser"))?.id;

    this.close();

    const query = {};
    if (this.#token)
      query.token = this.#token;

    if (this.#browserId)
      query.browserId = this.#browserId;

    this.#socket = io(this.#uri, { query });

    this.#socket.on("connect", () => {
      this.#socketId = this.#socket.id;
      onConnected?.(this.#socket);
      console.info(
        `[IO] Connected to socket ${this.#socketId}`
      );

      this.socket.once("System-AcceptBrowserId", (msg) => {
        // DANGER: async accross tabs here

        // fetch again to ensure the last update...
        this.#browserId = JSON.parse(localStorage.getItem("browser"))?.id;

        // if the browser is not yet assigned an ID, then do it and reconnect
        if (!this.#browserId) {
          localStorage.setItem("browser", JSON.stringify({ id: msg.browserId }));
          this.connect(serverUri, token);
          return;
        }

        // if there's a conflict between the browser's current ID and the one assign by server, reconnect
        if (this.#browserId !== msg.browserId) {
          this.connect(serverUri, token);
          return;
        }
      })

      this.#resendAfterTokenRefreshed(this.#oldToken, this.#token);

      this.socket.on("System-TokenExpired", ({ rejectedEvent }) => {
        this.#onRejectedDueToTokenExpiredEvent.emit("");
        if (rejectedEvent?.event !== null && rejectedEvent?.event !== "connection")
          this.#rejectedDueToTokenExpiredMesages.push(rejectedEvent);
      })

      this.onReceiveMulti(this.#queueEventHandlersOnConnection);
      this.#queueEventHandlersOnConnection = [];

      this.#queueAnyEventHandlersOnConnection.forEach(h => this.onReceiveAny(h));
      this.#queueAnyEventHandlersOnConnection = [];

      // this.#socket.on("disconnect", (reason) => {
      //   console.info(
      //     `[IO] Disconnected from ${this.#socketId}. Reason: ${reason}`
      //   );
      // });
    });

    return this;
  };

  /** stop connection to server */
  close = () => {
    this.#socket?.close();
    return this;
  };

  /**
   *
   * @param {string} event
   * @param {any} msg
   */
  send = (event, msg) => {
    this.#socket?.emit(event, msg);
  };

  /**
   * @param {string} event
   * @param {OnReceiveDelegate} handleFunction
   */
  onReceive = (event, handleFunction) => {
    if (this.#socket) this.#socket.on(event, handleFunction);
    else this.#queueEventHandlersOnConnection.push({ event, handleFunction });

    return () => this.stopReceive(event, handleFunction);
  };

  /**
   * @param {OnReceiveAnyDelegate} handleFunction
   */
  onReceiveAny = (handleFunction) => {
    if (this.#socket) this.#socket.onAny(handleFunction);
    else this.#queueAnyEventHandlersOnConnection.push(handleFunction)

    return () => this.stopReceiveAny(handleFunction);
  }

  /**
   * Add multiple event handlers at once because you'll need it :)
   * @param {[{event: string, handleFunction: OnReceiveDelegate}]} eventHandlers
   */
  onReceiveMulti = (eventHandlers) => {
    eventHandlers.forEach((e) => this.onReceive(e.event, e.handleFunction));

    return () => this.stopReceiveMulti(eventHandlers);
  };

  /**
   * @param {() => void} listener 
   */
  onRejectedDueToTokenExpired = (listener) => {
    this.#onRejectedDueToTokenExpiredEvent.on("", listener);
    return () => this.#onRejectedDueToTokenExpiredEvent.off("", listener);
  }

  /**
   * @param {string} event
   * @param {OnReceiveDelegate} handleFunction
   */
  stopReceive = (event, handleFunction) => {
    this.#socket?.off(event, handleFunction);
  };


  /**
   * @param {OnReceiveAnyDelegate} handleFunction 
   */
  stopReceiveAny = (handleFunction) => {
    this.#socket.offAny(handleFunction);
  }


  /**
   * Stop multiple event handlers at once because you'll need it :)
   * @param {[{event: string, handleFunction: OnReceiveDelegate}]} eventHandlers
   */
  stopReceiveMulti = (eventHandlers) => {
    eventHandlers.forEach((e) => this.stopReceive(e.event, e.handleFunction));
  };

  /**
   * DIRTY: should be decoupled 
   * @param {string} oldToken 
   * @param {string} newToken 
   */
  #checkAccessTokensOfSameUser = (oldToken, newToken) => {
    if (!(oldToken && newToken))
      return true;

    const oldPayload = jwtDecode(oldToken);
    const newPayload = jwtDecode(newToken);

    if (oldPayload.type !== 'a')
      return false;
    if (newPayload.type !== 'a')
      return false;

    return newPayload.userId === oldPayload.userId;
  }

  #resendAfterTokenRefreshed = (oldToken, newToken) => {
    this.#rejectedDueToTokenExpiredMesages.forEach(message => {
      this.send(message.event, message.msg);
    })

    this.#rejectedDueToTokenExpiredMesages = [];
  }
}

//#region typedefs
////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * A kind of function to handle any messages that are emitted from the clients
 * @callback OnReceiveDelegate
 * @param {any} msg
 * @returns {any}
 */

/**
 * A kind of function to handle any messages that are emitted from the clients
 * @callback OnReceiveAnyDelegate
 * @param {string} event
 * @param {any} msg
 * @returns {any}
 */

//#endregion
