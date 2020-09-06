import React from "react";
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import "./Header.css";

function Header(props) {
  const location = useLocation();
  let history = useHistory();

  const signOut = () => {
    localStorage.removeItem("authapp");
    props.authenticatedSet(false);
    if (location.pathname !== "/sign-in") {
      history.push("/sign-in");
    }
  }

  const protectedRoute = e => {
    if (props.authenticated) return;
    e.preventDefault();
    if (location.pathname !== "/sign-in") {
      history.push("/sign-in");
    }
  }

  return (
    <>
      <header>
        <h1><NavLink exact
          to="/"
          activeClassName="active">Auth App</NavLink></h1>
        <nav id="auth">
          {props.authenticated && <span>{props.username}</span>}
          {props.authenticated && <button onClick={signOut}>Sign Out</button>}
          {!props.authenticated && <NavLink activeClassName="active" to="/sign-in">Sign In</NavLink>}
        </nav>
        <nav id="main-nav">
          <NavLink exact
            to="/protected"
            activeClassName="active"
            onClick={protectedRoute}>Protected</NavLink>
        </nav>
      </header>
    </>
  );
}

export default Header;
