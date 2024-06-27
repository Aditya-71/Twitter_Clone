import React, { useEffect, useState } from "react";
import { BsCheck2All } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { selectedConversationAtom } from "../../atoms/messageAtom";



const Message = ({ ownMessage, message }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const user  = useRecoilValue(userAtom);
  const selectedConversation = useRecoilValue(selectedConversationAtom);

  

  return (
    <>
      {ownMessage ? (
        <div className="flex gap-2 self-end">
          {message.text && (
            <div className="flex bg-green-800 max-w-xs p-2 rounded-md">
              <span className="text-white">{message.text}</span>
              <div
                className={`self-end ml-1 font-bold ${
                  message.seen ? "text-blue-400" : ""
                }`}
              >
                <BsCheck2All size={16} />
              </div>
            </div>
          )}
          {message.img && !imgLoaded && (
            <div className="flex mt-5 w-52">
              <img
                src={message.img}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="Message"
                className="rounded-md"
              />
              <div className="w-52 h-52 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
          )}

          {message.img && imgLoaded && (
            <div className="flex mt-5 w-52">
              <img src={message.img} alt="Message" className="rounded-md" />
              <div
                className={`self-end ml-1 font-bold ${
                  message.seen ? "text-blue-400" : ""
                }`}
              >
                <BsCheck2All size={16} />
              </div>
            </div>
          )}

          <img
            src={user.profilePic}
            alt="User Avatar"
            className="w-7 h-7 rounded-full"
          />
        </div>
      ) : (
        <div className="flex gap-2">
          <img
            src={selectedConversation.userProfilePic}
            alt="User Avatar"
            className="w-7 h-7 rounded-full"
          />

          {message.text && (
            <span className="max-w-xs bg-gray-400 p-2 rounded-md text-black">
              {message.text}
            </span>
          )}
          {message.img && !imgLoaded && (
            <div className="flex mt-5 w-52">
              <img
                src={message.img}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="Message"
                className="rounded-md"
              />
              <div className="w-52 h-52 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
          )}

          {message.img && imgLoaded && (
            <div className="flex mt-5 w-52">
              <img src={message.img} alt="Message" className="rounded-md" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Message;

