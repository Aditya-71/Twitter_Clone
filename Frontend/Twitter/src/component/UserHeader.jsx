import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { BsInstagram } from "react-icons/bs";
import { HiOutlineLink } from "react-icons/hi";
import useCustomToast from "../../Hooks/useCustomTost";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import useFollowUnfollow from "../../Hooks/useFollowUnfollow";

function UserHeader({ user }) {
  console.log("useHeader");
  console.log("userheader" , user);
  const { showInfoToast } = useCustomToast();
  const currentUser = useRecoilValue(userAtom);
  const {handleFollowUnfollow,updating,following} = useFollowUnfollow({user});

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showInfoToast("Profile link copied.");
    });
  };

  return (
    <div className="flex flex-col gap-4 items-start mt-8">
      <div className="flex justify-between w-full ">
        <div>
          <div className="text-2xl font-bold mb-2">{user.name}</div>
          <div className="flex gap-2 items-center">
            <div className="text-sm">{user.username}</div>
            <div className="text-xs bg-gray-800 text-gray-200 p-1 rounded-full">
              threads.net
            </div>
          </div>
        </div>
        <div>
          {user.profilePic ? (
            <img
              className="w-28 h-28 sm:w-22 sm:h-22 md:w-26 md:h-26 lg:w-30 lg:h-30 rounded-full shadow-md"
              src={user.profilePic}
              alt={user.name || "User"}
            />
          ) : (
            <img
              className="w-28 h-28 sm:w-22 sm:h-22 md:w-26 md:h-26 lg:w-30 lg:h-30 rounded-full shadow-md"
              src="/profile.png"
              alt={user.name}
            />
          )}
        </div>
      </div>

      <div>{user.bio}</div>

      {currentUser?._id === user._id ? (
        <RouterLink to="/update">
          <button className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full">
            Update Profile
          </button>
        </RouterLink>
      ) : (
        <button
          className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full"
          onClick={handleFollowUnfollow}
          disabled={updating}
        >
          {following ? "Unfollow" : "Follow"}
        </button>
      )}
      <div className="flex w-full justify-between">
        <div className="flex gap-2 items-center">
          <div className="text-gray-200">{user.followers.length} followers</div>
          <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
          <a href="#" className="text-gray-200">
            instagram.com
          </a>
        </div>
        <div className="flex gap-6 ml-2">
          <div className="icon-container">
            <BsInstagram size={24} className="cursor-pointer" />
          </div>
          <div className="icon-container relative">
            <HiOutlineLink
              size={24}
              className="cursor-pointer"
              onClick={copyURL}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full">
        <div className="flex-1 border-b-2 border-white flex justify-center pb-3 cursor-pointer">
          <div className="font-bold">Threads</div>
        </div>
        <div className="flex-1 border-b border-gray-600 flex justify-center text-gray-400 pb-3 cursor-pointer">
          <div className="font-bold">Replies</div>
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
