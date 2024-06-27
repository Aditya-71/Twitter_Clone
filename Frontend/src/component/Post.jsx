import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { MdDelete } from "react-icons/md";
import Actions from "./Actions";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import axios from "axios";
import useCustomToast from "../../Hooks/useCustomTost";
import postsAtom from "../../atoms/postsAtom";

function Post({ post,postedBy }) {
  const [user,setUser] =useState(null);
  const currentUser = useRecoilValue(userAtom);
  const { showErrorToast, showSuccessToast } = useCustomToast();

  const navigate = useNavigate();
  const[posts, setPosts] = useRecoilState(postsAtom);

  useEffect(() => {
		const getUser = async () => {
			try {
				const response = await axios.get("/api/users/profile/" + postedBy);
				
				setUser(response.data);
			} catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          console.log(error.response.data.error);
          showErrorToast(error.response.data.error);
        } else {
          showErrorToast("Network Error");
        }
				setUser(null);
			}
		};

		getUser();
	}, [postedBy, showErrorToast]);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = axios.delete(`/api/posts/${post._id}`);

      showSuccessToast("Post deleted");
      setPosts(posts.filter((p)=> p._id !== post._id));
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log(error.response.data.error);
        showErrorToast(error.response.data.error);
      } else {
        showErrorToast("Network Error");
      }
    }
  };

  if(!user)return null;
  return (
    <>
      <Link
        to={`/${user.username}/post/${post._id}`}
        className="block mb-4 py-5"
      >
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-12 h-12 rounded-full cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            />
            <div className="w-px h-full bg-gray-300 my-2"></div>
            <div className="relative w-full">
              {post.replies.length === 0 && <p className="text-center">🥱</p>}
              {post.replies[0] && (
                <img
                  src={post.replies[0].userProfilePic}
                  alt="Reply User"
                  className="w-6 h-6 rounded-full absolute top-0 left-4 p-0.5"
                />
              )}
              {post.replies[1] && (
                <img
                  src={post.replies[1].userProfilePic}
                  alt="Reply User"
                  className="w-6 h-6 rounded-full absolute bottom-0 right-0.5 p-0.5"
                />
              )}
              {post.replies[2] && (
                <img
                  src={post.replies[2].userProfilePic}
                  alt="Reply User"
                  className="w-6 h-6 rounded-full absolute bottom-0 left-1 p-0.5"
                />
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between w-full">
              <div className="flex items-center">
                <p
                  className="text-sm font-bold cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${user.username}`);
                  }}
                >
                  {user?.username}
                </p>
                <img
                  src="/verified.png"
                  className="w-4 h-4 ml-1"
                  alt="Verified"
                />
              </div>
              <div className="flex gap-4 items-center">
                <p className="text-xs w-36 text-right text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </p>
                {currentUser?._id === user._id && (
                  <MdDelete
                    className="cursor-pointer"
                    size={20}
                    onClick={handleDeletePost}
                  />
                )}
              </div>
            </div>
            <p className="text-sm">{post.text}</p>
            {post.img && (
              <div className="rounded-md overflow-hidden border border-gray-300">
                <img src={post.img} alt="Post" className="w-full" />
              </div>
            )}
            <div className="flex gap-3 my-1">
              <Actions post={post} />
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default Post;
