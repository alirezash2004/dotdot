import { useQuery } from "@tanstack/react-query";

import useConversation from "../../../zustand/useConversation";

import SideBarLogo from "./logo/SideBarLogo";
import SideBarList from "./list/SideBarList";
import SideBarProfile from "./profile/SideBarProfile";


const Sidebar = () => {
	const { data: authPage } = useQuery({ queryKey: ["authPage"] });
	
	const { selectedConversation } = useConversation();

	return (
		<div className="md:flex-[2_2_0] md:w-18 md:max-w-52">
			<div
				className={`fixed bg-gray-300 mt-auto w-full left-0 flex flex-row border-t border-gray-700 z-50 justify-between px-2 md:w-full md:sticky md:top-0 md:bottom-auto md:h-screen md:flex-col md:border-r md:border-t-0 md:backdrop-filter-none dark:bg-slate-900 md:bg-inherit ${
					selectedConversation ? "-bottom-20" : "-bottom-0"
				} transition-all duration-500`}
			>
				<SideBarLogo />

				<SideBarList authPage={authPage} />

				<SideBarProfile authPage={authPage} />
			</div>
		</div>
	);
};

export default Sidebar;
