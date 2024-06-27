import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../../atoms/authAtom.js";
import axios from "axios";
import userAtom from "../../atoms/userAtom.js";
import useCustomToast from "../../Hooks/useCustomTost.js";

function LoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading , setLoading] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post("/api/users/login", data);
      
      localStorage.setItem("user-threads", JSON.stringify(response.data));
      setUser(response.data);
      showSuccessToast("Login successful");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        // Business logic error from the server
        showErrorToast(error.response.data.error);
      } else {
        // Network or other technical error
        showErrorToast("User invalid");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-full w-full bg-cover bg-center mt-20">
      <div className="flex flex-col gap-4 w-4/5 p-10 bg-black bg-opacity-80 rounded-xl sm:w-4/5 md:w-3/5 lg:w-4/5 xl:w-4/5">
        <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="username"
            required
            className="w-full px-4 py-2 bg-transparent border-b border-white outline-none text-center text-white placeholder-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            required
            className="w-full px-4 py-2 bg-transparent border-b border-white outline-none text-center text-white placeholder-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-1/2 px-4 py-2 bg-pink-500 border-none font-semibold cursor-pointer transition duration-300 ease-in-out text-white rounded-md hover:shadow-lg"
          >
            LOG IN 
          </button>
        </form>
        <div className="text-white text-lg font-semibold text-center">
          Don't have an account?{" "}
          <span className="underline cursor-pointer" onClick={() => setAuthScreen("signup")}>
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginCard;
