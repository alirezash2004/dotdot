import { useEffect, useState } from "react";
import {
	CiBellOn,
	CiChat1,
	CiCirclePlus,
	CiHome,
	CiUser,
} from "react-icons/ci";
import { Link } from "react-router-dom";

const SideBarList = ({ authPage }) => {
	const [islight, setIslight] = useState(
		JSON.parse(localStorage.getItem("islight"))
	);
	useEffect(() => {
		localStorage.setItem("islight", JSON.stringify(islight));
		if (islight) {
			document.documentElement.setAttribute("data-theme", "light");
		} else {
			document.documentElement.setAttribute("data-theme", "black");
		}
	}, [islight]);

	return (
		<ul className="flex flex-row gap-6 w-full justify-around my-3 md:flex-col md:mt-10 md:mb-0 md:justify-start">
			<li className="flex justify-center md:justify-start">
				<Link
					to="/"
					className="flex items-center gap-3 hover:bg-stone-600 transition-all rounded-full duration-300 py-2 px-2 max-w-fit cursor-pointer justify-center md:pr-4"
				>
					<CiHome className="w-8 h-8" />
					<span className="text-lg hidden md:block">Home</span>
				</Link>
			</li>
			<li className="hidden md:flex justify-center md:justify-start">
				<Link
					to="/chat"
					className="flex items-center gap-3 hover:bg-stone-600 transition-all rounded-full duration-300 py-2 px-2 max-w-fit cursor-pointer justify-center md:pr-4"
				>
					<CiChat1 className="w-8 h-8" />
					<span className="text-lg hidden md:block">Chat</span>
				</Link>
			</li>
			<li className="flex justify-center md:justify-start">
				<Link
					to="/newpost"
					className="flex items-center gap-3 hover:bg-stone-600 transition-all rounded-full duration-300 py-2 px-2 max-w-fit cursor-pointer justify-center md:pr-4"
				>
					<CiCirclePlus className="w-8 h-8" />
					<span className="text-lg hidden md:block">New</span>
				</Link>
			</li>
			<li className="flex justify-center md:justify-start md:hidden">
				<Link
					to={`/profile/${authPage.username}`}
					className="flex items-center gap-3 hover:bg-stone-600 transition-all rounded-full duration-300 py-2 px-2 max-w-fit cursor-pointer justify-center md:pr-4"
				>
					<CiUser className="w-8 h-8" />
					<span className="text-lg hidden md:block">Profile</span>
				</Link>
			</li>
			<li className="flex justify-center md:justify-start indicator">
				{authPage.notifications !== 0 && (
					<span className="indicator-item badge badge-secondary indicator-middle">
						{authPage.notifications}
					</span>
				)}
				<Link
					to="/notifications"
					className="flex items-center gap-3 hover:bg-stone-600 transition-all rounded-full duration-300 py-2 px-2 max-w-fit cursor-pointer justify-center md:pr-4"
				>
					<CiBellOn className="w-8 h-8" />
					<span className="text-lg hidden md:block">Notifications</span>
				</Link>
			</li>
			<li className="flex justify-center md:justify-start">
				<div className="flex items-center gap-3 transition-all rounded-full duration-300 py-2 px-2 max-w-fit cursor-pointer justify-center md:pr-4">
					<label className="swap swap-rotate rounded-full w-8 h-8">
						{/* this hidden checkbox controls the state */}
						<input
							type="checkbox"
							className="theme-controller"
							onChange={() => setIslight((prevData) => !prevData)}
							checked={islight}
						/>

						{/* sun icon */}
						<svg
							className="swap-on h-7 w-7 fill-current"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
						</svg>

						{/* moon icon */}
						<svg
							className="swap-off h-7 w-7 fill-current"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
						</svg>
					</label>
					<span
						className="text-lg hidden md:block"
						onClick={() => setIslight((prevData) => !prevData)}
					>
						Theme
					</span>
				</div>
			</li>
		</ul>
	);
};

export default SideBarList;
