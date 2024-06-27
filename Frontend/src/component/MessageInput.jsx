import { IoSendSharp } from "react-icons/io5";
import { BsFillImageFill } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import useCustomToast from "../../Hooks/useCustomTost";
import usePreviewImg from "../../Hooks/usePreviewImg";
import { useState, useRef } from "react";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  selectedConversationAtom,
  conversationsAtom,
} from "../../atoms/messageAtom";
import Loader from "./Loader";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const { showErrorToast } = useCustomToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [isSending, setIsSending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleModal = () => {
    setIsOpen(() => !isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imgUrl) return;
    if (isSending) return;

    setIsSending(true);

    try {
      const response = await axios.post("/api/messages", {
        message: messageText,
        recipientId: selectedConversation.userId,
        img: imgUrl,
      });

      console.log(response.data);
      setMessages((messages) => [...messages, response.data]);
      console.log(1);
      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: response.data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });

      setMessageText("");
      setImgUrl("");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log(error.response.data.error);
        showErrorToast(error.response.data.error);
      } else {
        showErrorToast("Network Error");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <form onSubmit={handleSendMessage} className="flex-grow mt-auto">
          <div className="relative w-full h-6">
            <input
              type="text"
              className="w-full  pr-10 border rounded text-black font-medium bg-slate-200"
              placeholder="Type a message"
              onChange={(e) => setMessageText(e.target.value)}
              value={messageText}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={handleSendMessage}
            >
              <IoSendSharp />
            </button>
          </div>
        </form>
        <div className="flex-shrink-0 cursor-pointer">
          <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
          <input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={handleImageChange}
          />
        </div>
        {imgUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
            <div className="relative w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg">
              <div className="flex justify-end p-2">
                <button
                 className="cursor-pointer text-gray-700 hover:text-gray-900"
                  onClick={() => {
                    setImgUrl("");
                  }}
                >
                  <MdClose />
                </button>
              </div>
              <div className="p-2">
                <div className="flex justify-center mb-5">
                  <img
                    src={imgUrl}
                    alt="Selected"
                    className="rounded-md w-40 h-40"
                  />
                </div>
                <div className="flex justify-end">
                  {!isSending ? (
                    <IoSendSharp
                      size={24}
                      className="cursor-pointer text-gray-700 hover:text-gray-900"
                      onClick={handleSendMessage}
                    />
                  ) : (
                    <div className="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full text-gray-700"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MessageInput;
