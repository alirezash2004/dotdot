import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import changeHost from "../../utils/changeHost.js";

import { useLogout } from "../Hooks/useLogout";

import DotDotLogo from "../../components/imgs/DotDot";

import {
	CiBellOn,
	CiChat1,
	CiCirclePlus,
	CiHome,
	CiLogout,
	CiUser,
} from "react-icons/ci";
import Loading from "./Loading";

const Sidebar = () => {
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

	const { logout, isLoggingOut, loggedOut } = useLogout();

	const { data: authPage } = useQuery({ queryKey: ["authPage"] });

	return (
		<div className="md:flex-[2_2_0] md:w-18 md:max-w-52">
			<div className="fixed bg-gray-300 mt-auto w-full bottom-0 left-0 flex flex-row border-t border-gray-700 z-50 justify-between px-2 md:w-full md:sticky md:top-0 md:bottom-auto md:h-screen md:flex-col md:border-r md:border-t-0 md:backdrop-filter-none dark:bg-slate-900 md:bg-inherit">
				<Link to="/" className="hidden md:flex justify-start md:mt-2">
					<DotDotLogo className="px-2 w-16 hover:bg-stone-600 rounded" />
				</Link>
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
				{authPage && (
					<Link
						to={`/profile/${authPage.username}`}
						className="md:flex gap-2 items-center transition-all duration-300 hover:bg-slate-700 py-2 rounded-full px-3 justify-center hidden md:mt-auto"
					>
						<div className="avatar hidden md:inline-flex">
							<div className="w-8 rounded-full">
								<img
									className="pointer-events-none"
									src={
										authPage.profilePicture
											? changeHost(authPage.profilePicture)
											: `https://avatar.iran.liara.run/username?username=${authPage?.username}`
									}
								/>
							</div>
						</div>
						<div className="flex justify-between flex-1">
							<div className="hidden md:block">
								<p className="text-primary font-bold text-sm w-20 truncate">
									{authPage?.fullName}
								</p>
								<p className="text-slate-500 text-sm">@{authPage?.username}</p>
							</div>
							{/* TODO: add a dialog for sign out */}
							{(isLoggingOut || loggedOut) && (
								<Loading className="w-9 h-9 p-1 cursor-pointer md:mr-2 md:ml-6 mx-auto mt-auto mb-auto border border-spacing-16 rounded-full border-slate-50 hover:bg-slate-50 hover:fill-black transition-all duration-300" />
							)}
							{!isLoggingOut && !loggedOut && (
								<CiLogout
									className="w-9 h-9 p-1 cursor-pointer md:mr-2 md:ml-6 mx-auto mt-auto mb-auto border border-spacing-16 rounded-full border-slate-50 hover:bg-slate-50 hover:fill-black transition-all duration-300"
									onClick={(e) => {
										e.preventDefault();
										logout();
									}}
								/>
							)}
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
