import { useContext } from "react";
import { SocketContext } from "./SocketContext";

const useSocketContext = () => {
	return useContext(SocketContext);
};

export default useSocketContext;
