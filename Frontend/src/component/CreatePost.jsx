import React, { useState, useRef } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../../Hooks/usePreviewImg";
import useCustomToast from "../../Hooks/useCustomTost";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import postsAtom from "../../atoms/postsAtom";
import { useParams } from "react-router-dom";

function CreatePost() {

  const MAX_CHAR = 500;
 
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postText, setPostText] = useState("");
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();

  const {username} = useParams();
  const imageRef = useRef();

  const currentuser = useRecoilValue(userAtom);
  const { showErrorToast, showSuccessToast } = useCustomToast();

  const handleModal = () => {
    setIsOpen(() => !isOpen);
  };

  const handleTextChange = (e) => {
    const inputText = e.target.value;

		if (inputText.length > MAX_CHAR) {
			const truncatedText = inputText.slice(0, MAX_CHAR);
			setPostText(truncatedText);
			setRemainingChar(0);
		} else {
			setPostText(inputText);
			setRemainingChar(MAX_CHAR - inputText.length);
		}
  };

  const handleCreatePost = async() => {
    setLoading(true);
    try{
      const response = await axios.post("/api/posts/create",
        {postedBy : currentuser._id , text : postText , img : imgUrl}
      );
      showSuccessToast("Post created successfully");
      handleModal();
      if (username === currentuser.username) {
				setPosts([response.data, ...posts]);
			}
    }
    catch(error){
        if (error.response && error.response.data && error.response.data.error) {
            // Business logic error from the server
            console.log(error.response.data.error)
            showErrorToast(error.response.data.error);
          } else {
            // Network or other technical error
            showErrorToast("network error");
          }
    }
    finally{
        setLoading(false);
        setPostText("");
        setImgUrl("");
        setRemainingChar(MAX_CHAR);
    }
  };

  return (
    <>
      <button
        className="fixed bottom-5 right-5 bg-gray-300 dark:bg-gray-dark p-2 rounded-md shadow-md hover:bg-gray-400 dark:hover:bg-gray-700"
        onClick={handleModal}
      >
        <MdAdd className="w-6 h-6" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="relative w-full max-w-lg mx-auto bg-gray-700 rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold ">
                Create Post
              </h3>
              <button
                className="text-gray-200 hover:text-gray-500"
                onClick={handleModal}
              >
                <MdClose />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <textarea
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Post content goes here.."
                  value = {postText}
                  onChange={handleTextChange}
                ></textarea>

                <div className="text-xs font-bold text-right text-gray-800 mt-1">
                  {remainingChar}/{MAX_CHAR}
                </div>
              </div>

              <div className="mb-4">
                <input
                  type="file"
                  hidden
                  ref={imageRef}
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  className="flex items-center"
                  onClick={() => imageRef.current.click()}
                >
                  <BsFillImageFill className="mr-2 bg-slate-600" size={16} />
                </button>
              </div>

              {imgUrl && (
                <div className="relative mt-5">
                  <img
                    className="w-full rounded-md"
                    src={imgUrl}
                    alt="Selected img"
                  />
                  <button
                    className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
                    onClick={() => setImgUrl("")}
                  >
                    <MdClose />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end p-4 border-t">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleCreatePost}
                disabled={loading}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreatePost;
