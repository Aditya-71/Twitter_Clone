import React, { useEffect, useState } from "react";
import useGetUserProfile from "../../Hooks/useGetUserProfile";
import Actions from "../component/Actions"
import Loader from "../component/Loader";
import Comment from "../component/Comment";
import { useNavigate, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import useCustomToast from "../../Hooks/useCustomTost";
import userAtom from "../../atoms/userAtom";
import { useRecoilValue ,useRecoilState} from "recoil";
import postsAtom from "../../atoms/postsAtom";

function PostPage() {

  const {user , loading} = useGetUserProfile();
  const [posts , setPosts] = useRecoilState(postsAtom);
  const {showErrorToast,showSuccessToast} = useCustomToast();
  const {pid} = useParams();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);

  const currentPost = posts[0];

  useEffect(()=>{
    const getPost = async () =>{
      try{
       const response = await axios.get(`/api/posts/${pid}`)
       console.log(response.data);
       setPosts([response.data]);
      }catch(error){
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
      }
     }
    getPost();
},[pid,setPosts,showErrorToast])

const handleDeletePost = async () =>{
  if (!window.confirm("Are you sure you want to delete this post?")) return;
  try{

   const response = axios.delete(`/api/posts/${currentPost._id}`);
 
   showSuccessToast( "Post deleted");
   navigate(`/${user.username}`);
  }catch(error){
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
  }
}

  if(!user && loading){
    return <Loader/>
  }

  if(!currentPost)return null;
  return (
    <>
      <div className="flex  w-full gap-3">
        <div className="flex w-full items-center gap-3">
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex items-center">
            <span className="text-sm font-bold">{user.username}</span>
            <img src="/verified.png" className="w-4 h-4 ml-4" />
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-xs w-36 text-right text-gray-400">
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </span>
          {currentUser?._id === user._id && (
            <MdDelete
              className="cursor-pointer"
              size={20}
              onClick={handleDeletePost}
            />
          )}
        </div>
      </div>

      <p className="my-3">{currentPost.text}</p>

      {currentPost.img && (
        <div className="rounded-md overflow-hidden border border-gray-400">
          <img src={currentPost.img} className="w-full" />
        </div>
      )}

      <div className="flex gap-3 my-3">
        <Actions post={currentPost} />
      </div>

      <hr className="my-4 border-gray-700" />

      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span className="text-2xl">👋</span>
          <span className="text-gray-400">
            Get the app to like, reply and post.
          </span>
        </div>
        <button className="px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-300">Get</button>
      </div>

      <hr className="my-4 border-gray-700" />

      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
}

export default PostPage;
