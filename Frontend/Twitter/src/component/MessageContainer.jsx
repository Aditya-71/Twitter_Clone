import React, { useState, useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { selectedConversationAtom ,conversationsAtom } from "../../atoms/messageAtom";
import userAtom from "../../atoms/userAtom";
import useCustomToast from "../../Hooks/useCustomTost";
import Message from "./Message";
import MessageInput from "./MessageInput";
import messageSound from "../assets/sounds/message.mp3";
import { useSocket } from "../../context/socketContext.jsx";

const MessageContainer = () => {
  const { showErrorToast } = useCustomToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const messageEndRef = useRef(null); // reference of the last message

  useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

  useEffect(() => {
		const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;
		if (lastMessageIsFromOtherUser) {
			socket.emit("markMessagesAsSeen", {
				conversationId: selectedConversation._id,
				userId: selectedConversation.userId,
			});
		}

		socket.on("messagesSeen", ({ conversationId }) => {
			if (selectedConversation._id === conversationId) {
				setMessages((prev) => {
					const updatedMessages = prev.map((message) => {
						if (!message.seen) {
							return {
								...message,
								seen: true,
							};
						}
						return message;
					});
					return updatedMessages;
				});
			}
		});
	}, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    const handleMessage = (message) => {
      console.log("Received message:", message);
      if (selectedConversation._id === message.conversationId) {
        setMessages((prev) => {
          console.log("Updating messages state with new message.");
          return [...prev, message];
        });
      }

      // make a sound if the window is not focused
			if (!document.hasFocus()) {
				const sound = new Audio(messageSound);
				sound.play();
			}

      setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === message.conversationId) {
						return {
							...conversation,
							lastMessage: {
								text: message.text,
								sender: message.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			}); 
    };

    socket.on("newMessage", handleMessage);
    console.log("Listener attached for newMessage");

    // Cleanup function to remove the event listener
    return () => {
      console.log("Cleaning up listener for newMessage");
      socket.off("newMessage", handleMessage);
    };
  }, [socket, selectedConversation._id]);


  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (selectedConversation.mock) return;
        const response = await axios.get(
          `/api/messages/${selectedConversation.userId}`
        );

        console.log(response.data);
        setMessages(response.data);
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
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [showErrorToast, selectedConversation.userId]);

  return (
    <div className="flex flex-col flex-2 bg-white dark:bg-gray-800 rounded-md p-2 h-full w-full">
      <div className="flex items-center w-full h-12 gap-2">
        {selectedConversation.userProfilePic ? (
          <img
            src={selectedConversation.userProfilePic}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <svg
            className="w-10 h-10 me-3 text-gray-200 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
        )}

        <div className="flex items-center">
          <span>{selectedConversation.username}</span>
          <img
            src="/verified.png"
            className="w-4 h-4 ml-1"
            alt="Verified Icon"
          />
        </div>
      </div>

      <div className="border-b my-2"></div>

      <div className="flex flex-col gap-4 my-4 p-2 flex-1 overflow-y-auto">
        {loadingMessages &&
          [...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`flex gap-2 items-center p-1 rounded-md ${
                i % 2 === 0 ? "self-start" : "self-end"
              }`}
            >
              {i % 2 === 0 && (
                <svg
                  className="w-10 h-10 me-3 text-gray-200 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
              )}
              <div className="flex flex-col gap-2">
                <div>
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-32 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-600 w-32 mb-2"></div>
                </div>
              </div>
              {i % 2 !== 0 && (
                <svg
                  className="w-10 h-10 me-3 text-gray-200 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
              )}
            </div>
          ))}

        {!loadingMessages &&
          messages.map((message) => (
            <div
              key={message._id}
              className="flex flex-col"
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? messageEndRef
                  : null
              }
            >
              <Message
                message={message}
                ownMessage={currentUser._id === message.sender}
              />
            </div>
          ))}
      </div>

      <MessageInput setMessages={setMessages} />
    </div>
  );
};

export default MessageContainer;
