import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { BsFillChatQuoteFill } from "react-icons/bs";
import authScreenAtom from "../../atoms/authAtom";
import useLogout from "../../Hooks/useLogout";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSettings } from "react-icons/md";

function Header() {
  const user = useRecoilValue(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const Logout = useLogout();
  // switch the theme
  const [colormode, setColormode] = useState(
    localStorage.getItem("theme") === "light" ? "light" : "dark"
  );

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleColorMode = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
    setColormode(localStorage.getItem("theme") === "dark" ? "dark" : "light");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-12">
        {user && (
          <Link to="/">
            <AiFillHome size={24} className="cursor-pointer mt-5 " />
          </Link>
        )}
        {!user && (
          <Link to="/auth" onClick={() => setAuthScreen("login")}>
            Login
          </Link>
        )}

        <img
          className="cursor-pointer w-6 mt-1"
          alt="logo"
          src={colormode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
          onClick={toggleColorMode}
        />

        {user && (
          <div className="flex items-center gap-4">
            <Link to={`/${user.username}`}>
              <RxAvatar size={24} className="cursor-pointer" />
            </Link>
            <Link to={"/chat"}>
              <BsFillChatQuoteFill size={24} className="cursor-pointer" />
            </Link>
            <Link to={`/settings`}>
              <MdOutlineSettings size={24} className="cursor-pointer" />
            </Link>
            <button onClick={Logout} className="cursor-pointer text-sm bg-slate-500 rounded-md p-1">
              <FiLogOut size={24} className="cursor-pointer" />
            </button>
          </div>
        )}

        {!user && (
          <Link to="/auth" onClick={() => setAuthScreen("signup")}>
            Sign up
          </Link>
        )}
      </div>
    </>
  );
}

export default Header;
