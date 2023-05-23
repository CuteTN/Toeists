import React, { useEffect } from "react";
import styles from "./styles.js";
import { Switch, Route, Redirect } from "react-router-dom";

import {
  UserInfoPage,
  SignInPage,
  SignUpPage,
  ErrorPage,
  HomePage,
  SettingsPage,
  ChatPage,
  CreatePostPage,
  SpecificForumPage,
  SpecificContestPage,
  FeedPage,
  ContestPage,
  CreateContestPage,
  CreateContestPart5,
  CreateContestPart6,
  CreateContestPart7,
  CreateContestPart1,
  CreateContestPart2,
  CreateContestPart3,
  CreateContestPart4,
} from "./pages/index";

import { CuteClientIOProvider } from "./socket/CuteClientIOProvider.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import DemoSocket from "./socket/DemoComponent/DemoSocket.js";
// import { useToken } from "./context/TokenContext.js";
import PrivateRoute from "./utils/PrivateRoute.js";
// import ActivationPage from "./pages/ActivationPage/ActivationPage.js";
// import AdminDashboardPage from "./pages/SystemAdmin/AdminDashboardPage/AdminDashboardPage.js";
// import { FriendsStatusProvider } from "./context/FriendsStatusContext.js";
import { BACKEND_URL } from "./constants/config.js";
import { useDispatch } from "react-redux";
import { getUser } from "./redux/actions/user.js";
import { useAuth } from "./contexts/authenticationContext.js";
import EmailConfirmationPage from "./pages/EmailConfirmationPage/EmailConfirmationPage.js";
import DictionaryProvider from "./components/DictionaryProvider/DictionaryProvider.js";

// import * as apiAuth from "./api/auth";

// import UserInfoPage from "./pages/UserInfoPage/UserInfoPage.js";

// import * as apiUser from "./api/user_info";
// import * as apiGroup from "./api/group";

// import { useCurrentUser } from "./context/CurrentUserContext.js";
// import { useGroupsOfUser } from "./context/GroupsOfUserContext.js";

function App() {
  const { accessToken } = useAuth();

  return (
    <div className={styles.App}>
      <DictionaryProvider>
        <CuteClientIOProvider serverUri={BACKEND_URL} token={accessToken}>
          {/*<FriendsStatusProvider userId={user?.result?._id}> */}
          <Switch>
            <Route exact path="/" component={HomePage}><Redirect to={"/feed"}/></Route>
            <Route exact path="/signin">
              <SignInPage />
            </Route>
            <Route exact path="/signup">
              <SignUpPage />
            </Route>
            <Route exact path="/feed" component={FeedPage} />
            <Route exact path="/contests" component={ContestPage} />
            <PrivateRoute
              exact
              path="/forum/create"
              component={CreatePostPage}
            />
            <PrivateRoute
              exact
              path="/contest/create"
              component={CreateContestPage}
            />
            <PrivateRoute
              exact
              path="/contest/create/part1"
              component={CreateContestPart1}
            />
            <PrivateRoute
              exact
              path="/contest/create/part2"
              component={CreateContestPart2}
            />
            <PrivateRoute
              exact
              path="/contest/create/part3"
              component={CreateContestPart3}
            />
            <PrivateRoute
              exact
              path="/contest/create/part4"
              component={CreateContestPart4}
            />
            <PrivateRoute
              exact
              path="/contest/create/part5"
              component={CreateContestPart5}
            />
            <PrivateRoute
              exact
              path="/contest/create/part6"
              component={CreateContestPart6}
            />
            <PrivateRoute
              exact
              path="/contest/create/part7"
              component={CreateContestPart7}
            />
            <Route path="/userinfo/:id" exact component={UserInfoPage} />
            <Route exact path="/forums/:id" component={SpecificForumPage} />
            <Route exact path="/contest/:id" component={SpecificContestPage} />
            <Route
              exact
              path="/email-confirmation/:token"
              component={EmailConfirmationPage}
            />
            <PrivateRoute exact path="/settings" component={SettingsPage} />
            <PrivateRoute path="/chat/:conversationId?" component={ChatPage} />
            <Route exact path="/error403">
              <ErrorPage code="403" />
            </Route>
            <Route exact path="/error404">
              <ErrorPage code="404" />
            </Route>
          </Switch>
          {/* </FriendsStatusProvider> */}
        </CuteClientIOProvider>
      </DictionaryProvider>
    </div>
  );
}

export default App;
