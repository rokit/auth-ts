import React, { useState, useEffect } from "react";
import jwt from 'jsonwebtoken';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Signin from "./pages/Signin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import "normalize.css";
import "./App.css";

function App() {
  const [username, usernameSet] = useState("");
  const [authenticated, authenticatedSet] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("authapp");
    if (!token) return;
    try {
      let decodedToken = jwt.decode(token);
      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        usernameSet(decodedToken.sub);
        authenticatedSet(true);
      }
    } catch (err) { }
  }, [authenticated]);

  return (
    <Router>
      <div className="app">
        <Header username={username} authenticated={authenticated} authenticatedSet={authenticatedSet} />
        <Switch>
          <Route exact path="/">
            Home
          </Route>
          <Route exact path="/sign-in">
            <Signin authenticated={authenticated} authenticatedSet={authenticatedSet} />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route path="/reset-password">
            <ResetPassword authenticatedSet={authenticatedSet} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
