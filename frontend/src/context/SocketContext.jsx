import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import changeHost from "../utils/changeHost.js";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlinePages, setOnlinePages] = useState([]);
	const { data: authPage } = useQuery({ queryKey: ["authPage"] });

	useEffect(() => {
		if (authPage) {
			const socketConnection = io(changeHost("http://localhost:5000"), {
				query: {
					pageId: authPage._id,
				},
				withCredentials: true,
			});

			setSocket(socketConnection);

			socketConnection.on("onlinePages", (data) => {
				setOnlinePages(data);
			});

			return () => socketConnection.close();
		}
	}, [authPage]);

	return (
		<SocketContext.Provider value={{ socket, onlinePages }}>
			{children}
		</SocketContext.Provider>
	);
};
