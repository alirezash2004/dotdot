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

const Sidebar = () => {
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
						<Link
							to="/setting"
							className="flex items-center gap-3 hover:bg-stone-600 transition-all rounded-full duration-300 py-2 px-2 max-w-fit cursor-pointer justify-center md:pr-4"
						>
							<CiSettings className="w-8 h-8" />
							<span className="text-lg hidden md:block">Setting</span>
						</Link>
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
