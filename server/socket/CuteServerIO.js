import { Server, Socket } from "socket.io";
import { verifyJwt } from "../services/jwtHelper.js";
import event from 'events'

/**
 * [Full documentation](https://www.google.com)
 */
export default class CuteServerIO {
  /**
   * A wrapped reference to socket.io "Server".
   * @type Server<DefaultEventsMap, DefaultEventsMap>?
   */
  #io = null;

  /**
   * @deprecated Just in case you really need to access the real socket.io's API, I provide this to you. But try to use the supported methods or contact CuteTN first, thank you.
   */
  get io() {
    return this.#io;
  }

  #ANONYMOUS_ROOM_PREFIX = "ANONYMOUS~";
  #USER_ROOM_PREFIX = "USER~";
  #TOKEN_ROOM_PREFIX = "TOKEN~";
  #BROWSER_ROOM_PREFIX = "BROWSER~";

  /**
   * onReceiveCallbacks Define a set of tasks to handle when server receive something from client
   * @type [{eventName: string?, handleFunction: OnReceiveDelegate}]
   */
  #onReceiveCallbacks = [];

  /**
   * @param {Server<DefaultEventsMap, DefaultEventsMap>} io
   */
  constructor(io) {
    this.#io = io;
    this.#onReceiveCallbacks = [];
  }

  /**
   * extract token and userId from a socket.
   * @param {Socket} socket
   * @returns {{socket: string, token: string, userId: string, username: string, browserId: string}}
   */
  #extractInfoSocket = (socket) => {
    // user must provide a token in order to connect to this server.
    const token = socket.handshake.query.token;
    const browserId = socket.handshake.query.browserId;

    const tokenPayload = verifyJwt(token).payload ?? {};
    const userId = tokenPayload.id;
    const { username } = tokenPayload;

    return { socket, token, userId, username, browserId };
  };

  /** @param {string} id */
  #getSocket = (id) => this.#io.sockets.sockets.get(id);

  /** 
   * @type {(userId: string) => Promise<Boolean>}
  */
  verifyUser


  /**
   * @param {Socket} socket
   * @param {any} msg custom object
   * @returns {OnReceiveParams}
   */
  #createCuteParameter = (socket, msg) => {
    if (typeof socket === "string") socket = this.#getSocket(socket);
    const { userId, token, browserId } = this.#extractInfoSocket(socket);

    return {
      userId,
      token,
      socket,
      browserId,
      msg,
      cuteServerIo: this,
    }
  }

  /**
   * Add handlers when receiving a message from specific client (by its socket Id). Subscribe immediately
   * @param {Socket | string} socket
   * @param {string} eventName
   * @param {OnReceiveDelegate} handleFunction
   */
  onReceive = (socket, eventName, handleFunction) => {
    socket.on(eventName, (msg) => {
      handleFunction(this.#createCuteParameter(socket, msg));
    });
  };

  /**
   * Add handlers when receiving a message from client. automatically subscribe to client's socket ON CONNECTION
   * @param {string} eventName
   * @param {OnReceiveDelegate} handleFunction
   */
  queueReceiveHandler = (eventName, handleFunction) => {
    this.#onReceiveCallbacks.push({
      eventName,
      handleFunction,
    });
  };

  /**
   * start waiting for new clients to connect to this server. The more the merrier!
   */
  start = () => {
    this.#io.on("connection", async (socket) => {
      let { token, userId, browserId, username } = this.#extractInfoSocket(socket);
      let logOutTask;

      if (!browserId) {
        browserId = socket.id + "-" + Date.now().toString();
      }

      this.sendToSocket(socket, "System-AcceptBrowserId", { browserId });

      // force user to log out if the token is not valid
      if (token)
        this.verifyUser?.(userId).then(res => {
          if (!res)
            this.sendToSocket(socket, "System-InvalidToken", {
              enableAlert: true,
            })
        })

      try {
        if (!token || !userId) {
          // signed in anonymously
          socket.join([
            this.#ANONYMOUS_ROOM_PREFIX,
            this.#BROWSER_ROOM_PREFIX + browserId,
          ]);
        } else {
          // Add this socket to a room with id User. every socket here belongs to this user only.
          socket.join([
            this.#USER_ROOM_PREFIX + userId,
            this.#TOKEN_ROOM_PREFIX + token,
            this.#BROWSER_ROOM_PREFIX + browserId,
          ]);

          const { exp } = verifyJwt(token);
          // auto logout on expiration
          if (exp) {
            logOutTask = setTimeout(() => {
              this.sendToSocket(socket, "System-InvalidToken", {
                enableAlert: true,
              });
            }, exp * 1000 - Date.now());
          }
        }

        // add handlers to call whenever this client send something to the server
        if (this.#onReceiveCallbacks) {
          this.#onReceiveCallbacks.forEach((cb) => {
            this.onReceive(socket, cb.eventName, cb.handleFunction);
          });
        }

        socket.on("disconnect", (reason) => {
          if (logOutTask) clearTimeout(logOutTask);

          console.info(
            `[IO] Disconnected from ${socket.id}. Reason: ${reason}`
          );

          this.#connectionEventEmitter.emit("disconnection", this.#createCuteParameter(socket, {}));
        });

        if (username)
          console.info(`[IO] Connected to ${socket.id}: User ${username}.`);
        else console.info(`[IO] Connected to ${socket.id}: Anonymous.`);

        this.#connectionEventEmitter.emit("connection", this.#createCuteParameter(socket, {}));
      } catch (error) {
        // CuteTN TODO: send something back to client maybe
        console.error(
          `[IO] Connection Error on ${socket.id}. Reason: ${error}`
        );
        socket.disconnect();
      }
    });
  };

  /**
   *
   * @param {Socket?} toSocket
   * @param {string?} event Convention: Action_Receiver
   * @param {object} msg
   */
  sendToSocket = (toSocket, event, msg) => {
    toSocket.emit(event, msg);
  };

  /**
   *
   * @param {string?} toTokenId
   * @param {string?} event Convention: Action_Receiver
   * @param {any} msg
   * @param {Socket?} excludedSocket sometimes we dont wanna send some message back to the sender (client). That's when this is helpful :)
   */
  sendToToken = (toTokenId, event, msg, excludedSocket) => {
    const roomName = this.#TOKEN_ROOM_PREFIX + toTokenId;

    if (
      excludedSocket &&
      excludedSocket.broadcast &&
      excludedSocket.rooms.has(roomName)
    ) {
      excludedSocket.broadcast.to(roomName).emit(event, msg);
    } else this.#io.in(roomName).emit(event, msg);
  };

  /**
   *
   * @param {string?} toBrowserId
   * @param {string?} event Convention: Action_Receiver
   * @param {any} msg
   * @param {Socket?} excludedSocket sometimes we dont wanna send some message back to the sender (client). That's when this is helpful :)
   */
  sendToBrowser = (toBrowserId, event, msg, excludedSocket) => {
    const roomName = this.#BROWSER_ROOM_PREFIX + toBrowserId;

    if (
      excludedSocket &&
      excludedSocket.broadcast &&
      excludedSocket.rooms.has(roomName)
    ) {
      excludedSocket.broadcast.to(roomName).emit(event, msg);
    } else this.#io.in(roomName).emit(event, msg);
  };

  /**
   *
   * @param {string?} toUserId
   * @param {string?} event Convention: Action_Receiver
   * @param {any} msg
   * @param {Socket?} excludedSocket sometimes we dont wanna send some message back to the sender (client). That's when this is helpful :)
   */
  sendToUser = (toUserId, event, msg, excludedSocket) => {
    const roomName = this.#USER_ROOM_PREFIX + toUserId;

    if (excludedSocket && excludedSocket.broadcast) {
      excludedSocket.broadcast.to(roomName).emit(event, msg);
    } else this.#io.in(roomName).emit(event, msg);
  };

  /**
   *
   * @param {string?} event
   * @param {any} msg
   * @param {string?} excludedSocket sometimes we dont wanna send some message back to the sender (client). That's when this is helpful :)
   */
  sendToAll = (event, msg, excludedSocket) => {
    if (excludedSocket && excludedSocket.broadcast) {
      excludedSocket.broadcast.emit(event, msg);
    } else this.#io.emit(event, msg);
  };

  countUserSockets = (userId) => {
    userId = userId.toString();
    const room = this.#io?.sockets.adapter.rooms.get(
      this.#USER_ROOM_PREFIX + userId
    );
    if (room) return room.size;

    return 0;
  };

  /** @type {event} */
  #connectionEventEmitter = new event.EventEmitter();

  /**
   * An event that emits each time a new socket is connected
   * @param {(params: OnReceiveParams) => void} listener 
   */
  onConnection = (listener) => {
    this.#connectionEventEmitter.addListener("connection", listener)
  }

  /**
   * An event that emits each time a socket is disconnected
   * @param {(params: OnReceiveParams) => void} listener 
   */
  onDisconnection = (listener) => {
    this.#connectionEventEmitter.addListener("disconnection", listener)
  }
}

// test

//#region typedefs
////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @typedef {object} OnReceiveParams
 * @property {string?} userId
 * @property {string?} token
 * @property {string?} browserId
 * @property {Socket?} socket
 * @property {string?} eventName
 * @property {CuteServerIO} cuteServerIo
 * @property {object?} msg The data/message that was provided by the client
 */

/**
 * A kind of function to handle any messages that are emitted from the clients
 * @callback OnReceiveDelegate
 * @param {OnReceiveParams} params
 * @returns {any}
 */
//#endregion
