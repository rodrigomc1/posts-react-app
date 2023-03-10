import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import StateContext from "../StateContext";
import HeaderLoggedIn from "./HeaderLoggedIn";
import HeaderLoggedOut from "./HeaderLoggedOut";

function Header() {
  const appState = useContext(StateContext);

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            {" "}
            PostsApp{" "}
          </Link>
        </h4>
        {appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
      </div>
    </header>
  );
}

export default Header;
