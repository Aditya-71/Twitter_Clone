import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../component/MessageContainer";
import Conversation from "../component/Conversation";
import useCustomToast from "../../Hooks/useCustomTost";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../../atoms/messageAtom";
import userAtom from "../../atoms/userAtom";
import { useSocket } from "../../context/socketContext.jsx";

const ChatPage = () => {
  const { showErrorToast } = useCustomToast();
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchingUser, setSearchingUser] = useState(false);
  const [searchText, setSearchText] = useState("");
  const currentUser = useRecoilValue(userAtom);
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
  }, [socket, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    if (searchingUser) return;
    setSearchingUser(true);
    try {
      const response = await axios(`/api/users/profile/${searchText}`);
      const searchedUser = response.data;

      const messagingYourself = searchedUser._id === currentUser._id;
      if (messagingYourself) {
        showErrorToast("You cannot message yourself");
        return;
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );

      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log(error.response.data.error);
        showErrorToast(error.response.data.error);
      } else {
        showErrorToast("Network Error");
      }
    } finally {
      setSearchingUser(false);
    }
  };

  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await axios.get("/api/messages/conversations");

        console.log(response.data);
        setConversations(response.data);
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
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [showErrorToast, setConversations]);
  return (
    <div className="absolute left-1/2 w-full md:w-4/5 lg:w-[750px] p-4 transform -translate-x-1/2">
      <div className="flex flex-col md:flex-row gap-4 mx-auto max-w-full">
        <div className="flex flex-col gap-2 w-full md:w-1/3 max-w-[250px] mx-auto">
          <p className="font-bold text-gray-600">Your Conversations</p>
          <form onSubmit={handleConversationSearch}>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search for a user"
                className="p-2 border rounded text-black font-normal"
                onChange={(e) => setSearchText(e.target.value)}
                name="search" 
                id="search-input" 
              />
              <button
                type="submit" 
                className="p-2 bg-gray-300 rounded"
              >
                <IoSearch />
              </button>
            </div>
          </form>

          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center mt-4">
                <svg
                  className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
                <div>
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                  <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
              </div>
            ))}

          {!loadingConversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(
                  conversation.participants[0]._id
                )}
                conversation={conversation}
              />
            ))}
        </div>

        <div className="flex flex-col items-center justify-center flex-1 border  rounded-md h-[500px]">
          {!selectedConversation._id ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <GiConversation size={100} />
              <p className="text-lg">
                Select a conversation to start messaging
              </p>
            </div>
          ) : (
            <MessageContainer />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
