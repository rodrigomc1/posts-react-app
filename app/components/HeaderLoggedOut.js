import Axios from "axios";
import React, { useState, useContext } from "react";
import DispatchContext from "../DispatchContext";

const HeaderLoggedOut = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const appDispatch = useContext(DispatchContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/login", {
        username,
        password,
      });
      if (response.data) {
        console.log(response.data);
        appDispatch({ type: "login", data: response.data });
        appDispatch({
          type: "addFlashMessage",
          value: "You have successfully logged in.",
        });
      } else {
        console.log("Incorrect username / password");
        appDispatch({
          type: "addFlashMessage",
          value: "Invalid username / password",
        });
      }
    } catch (error) {
      console.dir("There was an error...");
    }
  }

  return (
    <form className="mb-0 pt-2 pt-md-0" onSubmit={handleSubmit}>
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
};

export default HeaderLoggedOut;
