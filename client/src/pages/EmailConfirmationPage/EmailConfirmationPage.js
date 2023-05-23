import { message } from 'antd';
import jwtDecode from 'jwt-decode';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { activateAccount } from '../../services/api/user';

const EmailConfirmationPage = () => {
  const { token } = useParams();
  const history = useHistory();

  React.useEffect(() => {
    let payload = null;
    try { payload = jwtDecode(token); } 
    catch { handleInvalidConfirmation("Invalid token.") }

    if (payload?.type === "AccountActivation") {
      activateAccount(payload.userId, token)
        .then(() => {
          message.success("Your account has been activated. You can now sign in.", 1, () => history.replace("/signin/"));
        })
    }
  }, [token])

  const handleInvalidConfirmation = (msg) => {
    if (msg) 
      message.error(msg, 1, () => history.replace("/"));
    else
      history.replace("/");
  }

  return <></>
}

export default EmailConfirmationPage