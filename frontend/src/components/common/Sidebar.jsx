import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import DotDotLogo from "../../components/imgs/DotDot";

import {
	CiBellOn,
	CiCirclePlus,
	CiHome,
	CiLogout,
	CiSettings,
	CiUser,
} from "react-icons/ci";
import { useEffect, useState } from "react";

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

	const queryClient = useQueryClient();

	const { mutate: logoutMutation } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/v1.0/auth/logout", {
					method: "POST",
				});

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Logout");
			} catch (error) {
				toast.error(error.message, { duration: 6000 });
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Logout Successfully");
			queryClient.invalidateQueries({ queryKey: ["authPage"] });
		},
		onError: () => {
			toast.error("Logout Failed!");
		},
	});

	const { data: authPage } = useQuery({ queryKey: ["authPage"] });

	return (
		<div className="md:flex-[2_2_0] w-18 max-w-52">
			<div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
				<Link to="/" className="flex justify-center md:justify-start mt-2">
					<DotDotLogo className="px-2 w-16 hover:bg-stone-600 rounded" />
				</Link>
				<ul className="flex flex-col gap-6 mt-10">
					<li className="flex justify-center md:justify-start">
						<Link
							to="/"
							className="flex items-center gap-3 hover:bg-stone-600 transition-all rounded-full duration-300 py-2 px-2 max-w-fit cursor-pointer justify-center md:pr-4"
						>
							<CiHome className="w-8 h-8" />
							<span className="text-lg hidden md:block">Home</span>
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
					<li className="flex justify-center md:justify-start">
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
						className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-slate-700 py-2 rounded-full px-3"
					>
						<div className="avatar hidden md:inline-flex">
							<div className="w-8 rounded-full">
								<img
									src={
										authPage?.profileImg ||
										`https://avatar.iran.liara.run/username?username=${authPage?.username}`
									}
								/>
							</div>
						</div>
						<div className="flex justify-between flex-1">
							<div className="hidden md:block">
								<p className="text-white font-bold text-sm w-20 truncate">
									{authPage?.fullName}
								</p>
								<p className="text-slate-500 text-sm">@{authPage?.username}</p>
							</div>
							<CiLogout
								className="w-9 h-9 p-1 cursor-pointer md:mr-2 md:ml-6 mx-auto mt-auto mb-auto border border-spacing-16 rounded-full border-slate-50 hover:bg-slate-50 hover:fill-black transition-all duration-300"
								onClick={(e) => {
									e.preventDefault();
									logoutMutation();
								}}
							/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
