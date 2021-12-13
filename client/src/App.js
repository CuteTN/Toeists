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

// import * as apiAuth from "./api/auth";

// import UserInfoPage from "./pages/UserInfoPage/UserInfoPage.js";

// import * as apiUser from "./api/user_info";
// import * as apiGroup from "./api/group";

// import { useCurrentUser } from "./context/CurrentUserContext.js";
// import { useGroupsOfUser } from "./context/GroupsOfUserContext.js";

const loggedIn = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user;
};

function App() {
  const { accessToken } = useAuth();

  return (
    <div className={styles.App}>
      <CuteClientIOProvider
        serverUri={BACKEND_URL} //TODO: change all localhost to deploy link
        token={accessToken}
        // onNewConnection={}
      >
        {/*<FriendsStatusProvider userId={user?.result?._id}> */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/signin">
            <SignInPage />
          </Route>
          <Route exact path="/signup">
            <SignUpPage />
          </Route>
          {/* <Route exact path="/userinfo">
          <UserInfoPage />
        </Route> */}
          {/* <PrivateRoute exact path="/feed" component={FeedPage} /> */}
          {/* <PrivateRoute
            exact
            path="/post/create"
            // component={CreatePostPage}
          />*/}
          <PrivateRoute path="/userinfo/my">
            <Redirect to={`/userinfo/${loggedIn()?.result?._id}`} />
          </PrivateRoute>
          <Route path="/userinfo/:id" exact component={UserInfoPage} />
          {/* <Route exact path="/post/:id" component={SpecificPostPage} />
            <Route
              path="/post/:id/:focusedCommentId"
              component={SpecificPostPage}
            /> */}
          {/* <Route exact path="/search" component={UserResultSearchPage} /> */}
          {/* <PrivateRoute
              exact
              path="/group/:id/requests"
              component={GroupPage}
            /> */}
          {/* <Route path="/userinfo/:id/about" component={AboutPage} /> */}
          {/* <PrivateRoute
              exact
              path="/friends"
              component={FriendManagementPage}
            /> */}
          {/* <PrivateRoute
              exact
              path="/mutualFriends/:id"
              component={MutualFriendPage}
            /> */}
          {/* <Route exact path="/groups" component={GroupManagementPage} /> */}
          {/* <PrivateRoute
              exact
              path="/group/create"
              component={CreateGroupPage}
            /> */}
          {/* <Route exact path="/group/:id/:menu" component={GroupPage} /> */}
          {/* <Route exact path="/group/:id">
            <Redirect to="/group/:id/main" />
          </Route> */}
          <PrivateRoute exact path="/settings" component={SettingsPage} />
          <PrivateRoute path="/chat/:conversationId?" component={ChatPage} />
          {/* <Route exact path="/activate/:token" component={ActivationPage} /> */}
          {/* <PrivateRoute exact path="/message" component={MessagePage} /> */}
          {/* <Route path="/group/:id/about" component={GroupPage} />
            <Route path="/group/:id/members" component={GroupPage} /> */}
          {/* <PrivateRoute exact path="/admin">
            <Redirect to="/admin/dashboard" />
          </PrivateRoute> */}
          {/* <PrivateRoute
            exact
            path="/admin/:menu"
            component={AdminDashboardPage}
          /> */}
          {/* <PrivateRoute
              exact
              path="/admin/user"
              component={UserAdminManagement}
            />
            <PrivateRoute
              exact
              path="/admin/group"
              component={GroupAdminManagement}
            /> */}
          {/* <PrivateRoute exact path="/statistics" component={StatisticsPage} /> */}
          {/* <Route path="/demoSocketIO" component={DemoSocket} /> */}
          <Route exact path="/error403">
            <ErrorPage code="403" />
          </Route>
          <Route exact path="/error404">
            <ErrorPage code="404" />
          </Route>
        </Switch>
        {/* </FriendsStatusProvider> */}
      </CuteClientIOProvider>
    </div>
  );
}

export default App;
