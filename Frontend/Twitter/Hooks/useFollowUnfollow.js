import axios from "axios";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useCustomToast from "./useCustomTost.js";

function useFollowUnfollow({ user }) {
  const currentUser = useRecoilValue(userAtom);
  const [updating, setUpdating] = useState(false);
  const [following, setFollowing] = useState(
  currentUser.following?.includes(user._id)
  );
  const { showErrorToast, showSuccessToast } = useCustomToast();

  const handleFollowUnfollow = async () => {

    if (!currentUser) {
			showErrorToast( "Please login to follow");
			return;
		}

    if (updating) return;
    setUpdating(true);
    try {
      console.log("Starting follow/unfollow request");
      const response = await axios.post(`/api/users/follow/${user._id}`);
      console.log("Response data:", response.data);

      if (following) {
        showSuccessToast(`Unfollowed ${user.name}`);
        user.followers.pop(); // simulate removing from followers
      } else {
        showSuccessToast(`Followed ${user.name}`);
        user.followers.push(currentUser?._id); // simulate adding to followers
      }
      // Update the state based on the response
      setFollowing(!following);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log("Error response data:", error.response.data.error);
        showErrorToast(error.response.data.error);
      } else {
        console.log("Error:", error);
        showErrorToast("Network Error");
      }
    } finally {
      setUpdating(false);
    }
  };

  return { handleFollowUnfollow, updating, following };
}

export default useFollowUnfollow;
