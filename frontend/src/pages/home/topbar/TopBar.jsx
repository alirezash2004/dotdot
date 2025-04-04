import { useEffect } from "react";
import { Link } from "react-router-dom";
import { animate } from "framer-motion";

import DotDotLogo from "../../../components/imgs/DotDot";

import { CiLocationArrow1, CiSearch } from "react-icons/ci";

const TopBar = () => {
	useEffect(() => {
		setTimeout(() => {
			animate([[".topbar", { top: 0 }, { delay: 0, duration: 0.3 }]]);
		}, 100);
	});

	return (
		<div className="fixed left-0 -top-20 w-full flex md:hidden justify-between px-4 py-2 border-b border-gray-700 z-50 shadow-2xl bg-gray-300 dark:bg-slate-900  topbar delay-0">
			<div className="flex gap-2">
				<Link to="/" className="flex justify-start md:mt-2">
					<DotDotLogo className="px-2 w-16 hover:bg-stone-600 rounded" />
				</Link>
				<Link
					className="flex justify-start md:mt-2 relative top-1 transition-all duration-100"
					onClick={() =>
						document.getElementById("searchpage_modal").showModal()
					}
				>
					<CiSearch className="w-10 h-10" />
				</Link>
			</div>

			<Link
				to="/chat"
				className="flex justify-start md:mt-2 relative top-1 transition-all duration-100"
			>
				<CiLocationArrow1 className="w-10 h-10" />
			</Link>
		</div>
	);
};

export default TopBar;
