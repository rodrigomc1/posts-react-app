import React, { lazy, Suspense, useEffect, useReducer } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";
Axios.defaults.baseURL =
  process.env.BACKENDURL || "https://posts-backend.onrender.com";

// Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
//import CreatePost from "./components/CreatePost";
const CreatePost = lazy(() => import("./components/CreatePost"));
//import ViewSinglePost from "./components/ViewSinglePost";
const ViewSinglePost = lazy(() => import("./components/ViewSinglePost"));
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
//import Search from "./components/Search";
const Search = lazy(() => import("./components/Search"));

import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";
//import Chat from "./components/Chat";
const Chat = lazy(() => import("./components/Chat"));
import LoadingDotsIcon from "./components/LoadingDotsIcon";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("postsappToken")),
    flashMessages: [],
    user: {
      username: localStorage.getItem("postsappUsername"),
      avatar: localStorage.getItem("postsappAvatar"),
      token: localStorage.getItem("postsappToken"),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user.username = action.data.username;
        draft.user.avatar = action.data.avatar;
        draft.user.token = action.data.token;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "addFlashMessage":
        draft.flashMessages.push(action.value);
        return;
      case "openSearch":
        draft.isSearchOpen = true;
        return;
      case "closeSearch":
        draft.isSearchOpen = false;
        return;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case "closeChat":
        draft.isChatOpen = false;
        return;
      case "incrementUnreadChatCount":
        draft.unreadChatCount++;
        return;
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0;
        return;
      default:
        return draft;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("postsappUsername", state.user.username);
      localStorage.setItem("postsappAvatar", state.user.avatar);
      localStorage.setItem("postsappToken", state.user.token);
    } else {
      localStorage.removeItem("postsappUsername");
      localStorage.removeItem("postsappAvatar");
      localStorage.removeItem("postsappToken");
    }
  }, [state.loggedIn]);

  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/checkToken",
            { token: state.user.token },
            { cancelToken: ourRequest.token }
          );
          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({
              type: "addFlashMessage",
              value: "Your session has expired. Please log in again",
            });
          }
        } catch (e) {
          console.log("There was a problem or the request was cancelled.");
        }
      }
      fetchResults();
      return () => {
        ourRequest.cancel();
      };
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Routes>
              <Route path="/profile/:username/*" element={<Profile />} />
              <Route
                path="/"
                element={state.loggedIn ? <Home /> : <HomeGuest />}
              />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/post/:id" element={<ViewSinglePost />} />
              <Route path="/post/:id/edit" element={<EditPost />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>

          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);
