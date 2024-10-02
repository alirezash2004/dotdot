import { CiGrid41 } from "react-icons/ci";
import SetPageTitle from "../../components/common/SetPageTitle";
import SearchpageDialog from "../../components/common/sidebar/searchpageDialog/SearchpageDialog";
import TopBar from "../home/topbar/TopBar";
import Posts from "../profile/ProfilePosts";

const ExplorePage = () => {
	return (
		<>
			<SetPageTitle title="Explore - DotDot Social Media" />

			<TopBar />

			<SearchpageDialog />

			<div className="w-full relative">
				<div className="p-4 text-2xl items-center gap-2 fixed left-1/2 -translate-x-1/2 top-0 justify-center z-50 bg-gray-300 dark:bg-slate-900 md:flex rounded md:left-0 md:-translate-x-0 md:sticky hidden">
					<CiGrid41 />
					<span>Explore</span>
				</div>

				<div className="flex flex-col mt-16 md:mt-0">
					<Posts postFeedType="explore" />
				</div>
			</div>
		</>
	);
};

export default ExplorePage;
