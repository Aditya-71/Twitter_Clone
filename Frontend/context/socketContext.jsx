import io from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import {useRecoilValue} from "recoil";
import userAtom from "../atoms/userAtom";


const SocketContext = createContext();

export const useSocket = () =>{
    return useContext(SocketContext);
} 

export const SocketContextProvider = ({children}) =>{
    const [socket, setSocket] = useState(null);
	const [onlineUsers , setOnlineUsers] = useState([]);
	const user = useRecoilValue(userAtom);

	useEffect(() => {
<<<<<<< HEAD
		const socket = io( import.meta.env.VITE_BASE_URL, {
=======
		const socket = io(import.meta.env.VITE_BASE_URL, {
>>>>>>> 986a6e6898b1cc591487ad2ef4edc8e70af772b6
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
