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
  FeedPage,
  CreateContestPage,
  CreatContestPart5,
  CreatContestPart6,
  CreatContestPart7,
  CreatContestPart1,
  CreatContestPart2,
  CreatContestPart3,
  CreatContestPart4,
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
            <Route exact path="/feed" component={FeedPage} />
            <PrivateRoute
              exact
              path="/forum/create"
              component={CreatePostPage}
            />
            <PrivateRoute
              exact
              path="/content/create"
              component={CreateContestPage}
            />
            <PrivateRoute
              exact
              path="/content/create/part1"
              component={CreatContestPart1}
            />
            <PrivateRoute
              exact
              path="/content/create/part2"
              component={CreatContestPart2}
            />
            <PrivateRoute
              exact
              path="/content/create/part3"
              component={CreatContestPart3}
            />
            <PrivateRoute
              exact
              path="/content/create/part4"
              component={CreatContestPart4}
            />
            <PrivateRoute
              exact
              path="/content/create/part5"
              component={CreatContestPart5}
            />
            <PrivateRoute
              exact
              path="/content/create/part6"
              component={CreatContestPart6}
            />
            <PrivateRoute
              exact
              path="/content/create/part7"
              component={CreatContestPart7}
            />
            <Route path="/userinfo/:id" exact component={UserInfoPage} />
            <Route exact path="/forums/:id" component={SpecificForumPage} />
            <Route
              exact
              path="/email-confirmation/:token"
              component={EmailConfirmationPage}
            />
            {/*   <Route
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
      </DictionaryProvider>
    </div>
  );
}

export default App;
