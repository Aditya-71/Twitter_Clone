import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom.js";
import useCustomToast from "../../Hooks/useCustomTost";
import axios from "axios";
import usePreviewImg from "../../Hooks/usePreviewImg.js";

function UpdateProfilePage() {
  const fileRef = useRef(null);
  const [user, setUser] = useRecoilState(userAtom);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const { showErrorToast, showSuccessToast } = useCustomToast();
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
  });

  const { handleImageChange, imgUrl } = usePreviewImg();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);
    try {
      console.log(imgUrl);
      console.log({ ...inputs, profilePic: imgUrl });
      const response = await axios.put(`/api/users/update/${user._id}`, {
        ...inputs,
        profilePic: imgUrl,
      });
      console.log(response.data);

      showSuccessToast("Profile updated successfully");
      setUser(response.data);
      localStorage.setItem("user-threads", JSON.stringify(response.data));
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        // Business logic error from the server
        showErrorToast(error.response.data.error);
      } else {
        // Network or other technical error
        showErrorToast("network error");
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center my-6">
        <div className="space-y-4 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            User Profile Edit
          </h2>
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:space-x-6">
              <div className="flex justify-center">
                <div className="flex justify-center">
                  <img
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full shadow-md"
                    src={imgUrl || user.profilePic}
                    alt="Avatar"
                  />
                </div>
              </div>
              <div className="flex w-full justify-center sm:justify-start">
                <button
                  type="button"
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-md"
                  onClick={() => fileRef.current.click()}
                >
                  Change Avatar
                </button>
                <input
                  type="file"
                  className="hidden"
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Full name</label>
                <input
                  placeholder="name"
                  value={inputs.name}
                  onChange={(e) =>
                    setInputs({ ...inputs, name: e.target.value })
                  }
                  className="py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-md outline-none"
                  type="text"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">User name</label>
                <input
                  placeholder="username"
                  value={inputs.username}
                  onChange={(e) =>
                    setInputs({ ...inputs, username: e.target.value })
                  }
                  className="py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-md outline-none"
                  type="text"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Email address</label>
                <input
                  placeholder="your-email@example.com"
                  value={inputs.email}
                  onChange={(e) =>
                    setInputs({ ...inputs, email: e.target.value })
                  }
                  className="py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-md outline-none"
                  type="email"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Bio</label>
                <input
                  placeholder="Your bio."
                  value={inputs.bio}
                  onChange={(e) =>
                    setInputs({ ...inputs, bio: e.target.value })
                  }
                  className="py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-md outline-none"
                  type="text"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Password</label>
                <input
                  placeholder="password"
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                  className="py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-md outline-none"
                  type="password"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => navigate(`/${user.username}`)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 ${
                  updating ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={updating}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default UpdateProfilePage;
