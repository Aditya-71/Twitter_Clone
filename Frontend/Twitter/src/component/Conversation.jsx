import React from "react";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { useRecoilValue, useRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import { selectedConversationAtom } from "../../atoms/messageAtom";

const Conversation = ({ conversation, isOnline }) => {
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const colorMode = "light"; // Replace with your logic for determining color mode
  const currentUser = useRecoilValue(userAtom);
  console.log(conversation);
  const user = conversation.participants[0];
  const lastMessage = conversation.lastMessage;

  console.log(selectedConversation);

  return (
    <div
      className={`flex gap-4 items-center p-1 rounded-md cursor-pointer hover:bg-gray-700
      ${
        selectedConversation._id === conversation._id
          ? colorMode === "dark"
            ? "bg-gray-400"
            : "bg-gray-600"
          : ""
      }`}
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          userProfilePic: user.profilePic,
          username: user.username,
          mock : conversation.mock
        })
      }
    >
      {user.profilePic ? (
        <div className="relative mr-3">
          <img
            src={user.profilePic}
            alt={`${user.username}'s profile`}
            style={{ width: "2.5rem", height: "2.5rem" }}
            className="w-24 h-24 rounded-full border-2 border-gray-300 "
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full"></div>
          )}
        </div>
      ) : (
        <div className="relative">
          <svg
            className="w-10 h-10 me-3 text-gray-200 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" 
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
          {isOnline && (
            <div className="absolute bottom-0 right-2.5 w-3 h-3 bg-green-500 border-2 rounded-full"></div>
          )}
        </div> 
      )}

      <div className="flex flex-col text-sm">
        <div className="flex items-center font-bold">
          {user.username}
          <img src="/verified.png" alt="Verified" className="w-4 h-4 ml-1" />
        </div>
        <div className="flex items-center text-xs gap-1">
          {currentUser?._id === lastMessage.sender ? (
            <div className={` ${lastMessage.seen ? "text-blue-400" : ""}`}>
              <BsCheck2All size={16} />
            </div>
          ) : (
            ""
          )}
          {lastMessage.text.length > 18
            ? lastMessage.text.substring(0, 18) + "..."
            : lastMessage.text || <BsFillImageFill size={16} />}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
