import { Link } from "react-router-dom";
import changeHost from "../../../../utils/changeHost.js";
import { useLogout } from "../../../Hooks/useLogout";
import Loading from "../../Loading";
import { CiLogout } from "react-icons/ci";

const SideBarProfile = ({ authPage }) => {
	const { logout, isLoggingOut, loggedOut } = useLogout();
    
	return (
		<Link
			to={`/profile/${authPage?.username}`}
			className="md:flex gap-2 items-center transition-all duration-300 hover:bg-slate-700 py-2 rounded-full px-3 justify-center hidden md:mt-auto"
		>
			<div className="avatar hidden md:inline-flex">
				<div className="w-8 rounded-full">
					<img
						className="pointer-events-none"
						src={
							authPage?.profilePicture
								? changeHost(authPage?.profilePicture)
								: `https://avatar.iran.liara.run/username?username=${authPage?.username}`
						}
						alt="Profile Picture"
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
	);
};

export default SideBarProfile;
