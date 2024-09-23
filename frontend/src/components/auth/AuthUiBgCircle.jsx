import { animate, motion } from "framer-motion";
import { useEffect } from "react";

const AuthUiBgCircle = () => {
	useEffect(() => {
		animate([[".circle-animate", { scale: 1.5 }]]);
	}, []);

	return (
		<div className="w-screen h-screen absolute top-0 left-0 flex items-center justify-center z-0 overflow-hidden">
			<motion.div className="w-96 h-96 block rounded-full bg-secondary circle-animate scale-0 opacity-10"></motion.div>
		</div>
	);
};

export default AuthUiBgCircle;
