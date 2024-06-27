import React, { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../../atoms/authAtom.js';
import axios from 'axios';
import useCustomToast from '../../Hooks/useCustomTost.js';
import userAtom from '../../atoms/userAtom.js';

function SignupCard() {
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword ||
      formData.confirmPassword === ""
    );
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password
    };
  
    try {
      const response = await axios.post("/api/users/signup", data);

      localStorage.setItem("user-threads", JSON.stringify(response.data));
      setUser(response.data);
      showSuccessToast("Signup successful!");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        // Business logic error from the server
        showErrorToast(error.response.data.error);
      } else {
        // Network or other technical error
        showErrorToast("User invalid");
      }
    }
  };

  return (
    <div className="register bg-cover bg-center">
      <div className="register_content flex justify-center items-center flex-col">
        <form
          className="register_content_form mt-5 w-3/5 md:w-4/5 lg:w-3/5 flex flex-col items-center gap-6 p-10 bg-black bg-opacity-80 rounded-lg"
          onSubmit={handleSubmit}
        >
          <input
            placeholder="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 bg-transparent border-b border-white outline-none text-white placeholder-white"
          />
          <input
            placeholder="username"
            name="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            className="w-full px-4 py-2 bg-transparent border-b border-white outline-none text-white placeholder-white"
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-2 bg-transparent border-b border-white outline-none text-white placeholder-white"
          />
          <input
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            type="password"
            required
            className="w-full px-4 py-2 bg-transparent border-b border-white outline-none text-white placeholder-white"
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            type="password"
            required
            className="w-full px-4 py-2 bg-transparent border-b border-white outline-none text-white placeholder-white"
          />

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords do not match!</p>
          )}
          <button
            type="submit"
            disabled={!passwordMatch}
            className="w-1/2 px-4 py-2 bg-pink-500 border-none font-semibold cursor-pointer transition duration-300 ease-in-out text-white rounded-md disabled:opacity-50"
          >
            REGISTER
          </button>
          <a href="#" className="text-white text-xs mt-4">
            Already have an account?{" "}
            <span className="underline cursor-pointer" onClick={() => setAuthScreen("login")}>Log In Here</span>
          </a>
        </form>
      </div>
    </div>
  );
}

export default SignupCard;
