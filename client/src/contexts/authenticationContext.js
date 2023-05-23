import React, { useContext } from 'react'
import { getUserById } from '../services/api/user';
import { AuthenticationService } from '../services/AuthenticationService';
import { TokenService } from '../services/TokenService';
import { AxiosResponse } from 'axios'

const AuthenticationContext = React.createContext();

/**
 * provide authenticating functions and signed in user information
 * @returns {AuthProviderValue}
 */
export const useAuth = () => {
  return useContext(AuthenticationContext);
}

export const AuthenticationProvider = ({ children }) => {
  const [signedInUser, setSignedInUser] = React.useState(null);
  const [accessToken, setAccessToken] = React.useState(undefined);

  React.useEffect(() => {
    refreshSignedInUser();
    setAccessToken(TokenService.accessToken);

    const signedInListener = AuthenticationService.onSignedIn(() => {
      refreshSignedInUser();
    })

    const signedOutListener = AuthenticationService.onSignedOut(() => {
      setSignedInUser(null);
    });

    const accessTokenChangeListener = TokenService.onAccessTokenChange(
      (newAccessToken) => setAccessToken(newAccessToken)
    )

    return () => {
      AuthenticationService.offSignedIn(signedInListener);
      AuthenticationService.offSignedOut(signedOutListener);
      TokenService.offAccessTokenChange(accessTokenChangeListener);
    }
  }, []);

  const signIn = React.useCallback((identifier, password) => {
    return AuthenticationService.signIn(identifier, password);
  }, []);

  const signOut = React.useCallback(() => {
    return AuthenticationService.signOut();
  }, [])

  const refreshSignedInUser = React.useCallback(() => {
    try { var { userId } = TokenService.decodeAccessToken(); }
    catch { return; }

    getUserById(userId).then(res => {
      const user = res.data;
      setSignedInUser(user);
    });
  }, [])

  return (
    <AuthenticationContext.Provider value={{
      // list of values and functions to be exposed
      signIn,
      signOut,
      refreshSignedInUser,
      signedInUser,
      accessToken,
    }}>
      {children}
    </AuthenticationContext.Provider>
  )
}

/**
 * @typedef {Object} AuthProviderValue
 * @property {(identifier: string, password: string) => Promise<AxiosResponse<any>>} signIn
 * @property {() => Promise<AxiosResponse<any>>} signOut
 * @property {() => void } refreshSignedInUser
 * @property { object? } signedInUser
 * @property { string? } accessToken
 */