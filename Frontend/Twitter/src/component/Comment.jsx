import React from "react";

function Comment({reply,lastReply}) {
  return (
    <>
      <div className="flex gap-4 py-2 my-2 w-full">
        <img
          src={reply.userProfilePic}
          alt = "profile"
           className="w-12 h-12 rounded-full cursor-pointer"
        />
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between items-center w-full">
            <span className="text-sm font-bold">{reply.username}</span>
          </div>
          <span>{reply.text}</span>
        </div>
      </div>
      {!lastReply && <hr className="border-gray-700" />}
    </>
  );
}

export default Comment;
