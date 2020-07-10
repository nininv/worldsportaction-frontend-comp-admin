import React from "react";
import {
  // MemoryRouter,
  Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { Skeleton } from "antd";
// import FullStory from "react-fullstory';

import Routes from "./pages/routes";
import history from "./util/history";
import PrivateRoute from "./util/protectedRoute";
import Login from "./components/login";
import ForgotPassword from "./components/forgot-password";

import "./App.css";
import "./customStyles/customStyles.css";
import "./customStyles/antdStyles.css";

// const ORG_ID = 'Netball';

function App() {
  const lazyLoad = Component => {
    return (props) => {
      return (
        <React.Suspense fallback={<Skeleton avatar paragraph={{ rows: 4 }} />}>
          <Component {...props} />
        </React.Suspense>
      );
    };
  };

  return (
    <div className="App">
      {/* <FullStory org={ORG_ID} /> */}
      {/* <MemoryRouter> */}
      <Router history={history} >
        <Switch>
          <Route
            exact
            path="/"
            render={() =>
              localStorage.token ? (
                <Redirect to="/homeDashboard" />
              ) : (
                  <Redirect to="/login" />
                )
            }
          />
          <Route path="/login" component={lazyLoad(Login)} />
          <Route path="/forgotPassword" component={lazyLoad(ForgotPassword)} />
          <PrivateRoute path="/" component={lazyLoad(Routes)} />
        </Switch>
      </Router>
      {/* </MemoryRouter> */}
    </div>
  );
}

export default App;
