import { useState } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./component/Header";
import CreatePost from "./component/CreatePost.jsx";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage.jsx";
import ChatPage from "./pages/ChatPage.jsx"
import UpdateProfilePage from "./pages/UpdateProfilePage.jsx";
import { useRecoilValue } from "recoil";
import  {SettingsPage } from "./pages/SettingPage.jsx";
import userAtom from "../atoms/userAtom.js";

function App() {
  const { pathname } = useLocation();
  const user = useRecoilValue(userAtom);
  return (
    <>
      <div className="relative w-full">
        <div className={`max-w-screen-md mx-auto`}>
          <Header />
          <Routes>
            <Route
              path="/"
              element={user ? <HomePage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/auth"
              element={!user ? <AuthPage /> : <Navigate to="/" />}
            />
            <Route
              path="/update"
              element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/:username"
              element={
                user ? (
                  <>
                    <UserPage />
                    <CreatePost />
                  </>
                ) : (
                  <UserPage />
                )
              }
            />
            <Route path="/:username/post/:pid" element={<PostPage />}></Route>
            <Route path='/chat' element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
            <Route path='/settings' element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
