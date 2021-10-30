import React, { useContext, useEffect, useState } from 'react'
import { AuthenticationService } from '../services/AuthenticationService';
import CuteClientIO from './CuteClientIO'

const CuteClientIOContext = React.createContext();

/**
 * provide a context variable to work with CuteClientIO
 * @returns {CuteClientIO}
 */
export const useCuteClientIO = () => {
  return useContext(CuteClientIOContext)
}

const CuteClientIOInstance = new CuteClientIO();
CuteClientIOInstance.onRejectedDueToTokenExpired(
  () => AuthenticationService.refreshToken()
);

export const CuteClientIOProvider = ({ serverUri, token, children, onNewConnection }) => {
  /** @type [CuteClientIO, any] */
  const [cuteIO, setCuteIO] = useState(() => CuteClientIOInstance);

  useEffect(() => {
    setCuteIO(
      /**
       * @param {CuteClientIO} cuteIO
       */
      cuteIO => {
        cuteIO.connect(serverUri, token);

        onNewConnection?.(cuteIO);
        return cuteIO;
      }
    );
  }, [token, serverUri])

  return (
    <CuteClientIOContext.Provider value={cuteIO}>
      {children}
    </CuteClientIOContext.Provider>
  )
}
