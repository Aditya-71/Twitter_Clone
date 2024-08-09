import io from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import {useRecoilValue} from "recoil";
import userAtom from "../atoms/userAtom"
import dotenv from "dotenv";

dotenv.config();


const SocketContext = createContext();

export const useSocket = () =>{
    return useContext(SocketContext);
} 

export const SocketContextProvider = ({children}) =>{
    const [socket, setSocket] = useState(null);
	const [onlineUsers , setOnlineUsers] = useState([]);
	const user = useRecoilValue(userAtom);

	useEffect(() => {
		const socket = io(process.env.BASE_URL, {
			query: {
				userId: user?._id,
			},
		});

		setSocket(socket);

		socket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});
		return () => socket && socket.close();
	}, [user?._id]);

	return <SocketContext.Provider value={{ socket,onlineUsers}}>{children}</SocketContext.Provider>;
};
