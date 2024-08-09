import React, { useState } from "react";
import { AiOutlineClose,AiFillHeart, AiOutlineHeart, AiOutlineComment } from 'react-icons/ai';
import { FaRetweet, FaShare } from 'react-icons/fa';
import { useRecoilValue , useRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import useCustomToast from "../../Hooks/useCustomTost";
import axios from "axios";
import postsAtom from "../../atoms/postsAtom";


function Action({post}) {

  const user = useRecoilValue(userAtom);
  const {showErrorToast,showSuccessToast} = useCustomToast();

  const [isLiking , setIsLiking] = useState(false); // while fetching if you clicked multiple time we cant fetch whenever first request is not executed
  const [posts , setPosts] = useRecoilState(postsAtom);
  const [liked , setLiked] = useState(post.likes.includes(user?._id));
  const [isReplying, setIsReplying] = useState(false);
	const [reply, setReply] = useState("");


  const handleLikeAndUnlike = async () => {
		if (!user) return showErrorToast( "You must be logged in to like a post");
		if (isLiking) return;
		setIsLiking(true);
		try {
			const response = await axios.put("/api/posts/like/" + post._id);

			if (!liked) {
				// add the id of the current user to post.likes array
        const updatedPosts = posts.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: [...p.likes, user._id] };
					}
          return p;
				});
				setPosts(updatedPosts);
			} else {
				// remove the id of the current user from post.likes array
        const updatedPosts = posts.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: p.likes.filter((id) => id !== user._id) };
					}
					return p;
				});
				setPosts(updatedPosts);
			}
		} catch (error) {
			if (error.response && error.response.data && error.response.data.error) {
        // Business logic error from the server
        showErrorToast(error.response.data.error);
      } else {
        // Network or other technical error
        showErrorToast("User invalid");
      }

		} finally {
			setIsLiking(false);
      setLiked(!liked);
		}
	};
  
  const [isOpen, setIsOpen] = useState(false);
  const handleModal = () => {
    setIsOpen(() => !isOpen);
  };

 
  const handleReply = async () => {
		if (!user) return showToast("Error", "You must be logged in to reply to a post", "error");
		if (isReplying) return;
		setIsReplying(true);
		try {
			const response = await axios.put("/api/posts/reply/" + post._id , { text: reply });

			
			const updatedPosts = posts.map((p) => {
				if (p._id === post._id) {
					return { ...p, replies: [ response.data ,...p.replies] };
				}
				return p;
			});
			setPosts(updatedPosts);
			showSuccessToast("Reply posted successfully");
			handleModal();
		} catch (error) {
		 if (error.response && error.response.data && error.response.data.error) {
        // Business logic error from the server
        showErrorToast(error.response.data.error);
      } else {
        // Network or other technical error
        showErrorToast("User invalid");
      }
		} finally {
			setIsReplying(false);
      setReply("");
		}
	};
  return (
    <div>
      <div className="flex gap-3 my-2" onClick={(e) => e.preventDefault()}>
        <div onClick={handleLikeAndUnlike} className="cursor-pointer">
          {liked ? (
            <AiFillHeart size={20} color="rgb(237, 73, 86)" />
          ) : (
            <AiOutlineHeart size={20} color="currentColor" />
          )}
        </div>

        <div onClick={handleModal} className="cursor-pointer">
          <AiOutlineComment size={20} color="currentColor" />
        </div>

        <FaRetweet />
        <FaShare />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm">
          {post.replies.length} replies
        </span>
        <div className="w-1 h-1 rounded-full bg-gray-500"></div>
        <span className="text-gray-500 text-sm">{post.likes.length} likes</span>
      </div>

      {/* modal code  */}
      {isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className=" bg-gray-700  rounded-lg shadow-lg w-full max-w-md mx-4" >
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Reply</h3>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={handleModal}
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
          <div className="p-4">
            <input
              type="text"
              className="w-full text-black  bg-gray-400 font-medium p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Reply goes here.."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
          </div>
          <div className="flex justify-end p-4 border-t">
            <button
              className={`bg-blue-500 text-white px-4 py-2 rounded ${
                isReplying
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
              onClick={handleReply}
              disabled={isReplying}
            >
              {isReplying ? "Replying..." : "Reply"}
            </button>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default Action;
