import { Link } from "react-router-dom";

import DotDotLogo from "../../components/imgs/DotDot";
import { CiLocationArrow1 } from "react-icons/ci";
import { useEffect } from "react";
import { animate } from "framer-motion";

const TopBar = () => {
	useEffect(() => {
		animate([[".topbar", { top: 0 }]]);
	});

	return (
		<div className="fixed -top-20 w-full flex md:hidden justify-between px-4 py-2 border-b border-gray-700 z-50 shadow-2xl bg-gray-300 dark:bg-slate-900 transition-all duration-300 topbar delay-0">
			<Link to="/" className="flex justify-start md:mt-2">
				<DotDotLogo className="px-2 w-16 hover:bg-stone-600 rounded" />
			</Link>

			<Link
				to="/chat"
				className="flex justify-start md:mt-2 relative top-1 transition-all duration-200"
			>
				<CiLocationArrow1 className="w-10 h-10" />
			</Link>
		</div>
	);
};

export default TopBar;
