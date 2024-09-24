import SetPageTitle from "../../components/common/SetPageTitle";
import TopBar from "./topbar/TopBar";
import SearchpageDialog from "../../components/common/sidebar/searchpageDialog/SearchpageDialog";
import Posts from "./posts/Posts";

const HomePage = () => {
	return (
		<>
			<SetPageTitle title="Home - DotDot Social Media" />

			<TopBar />

			<SearchpageDialog />

			<Posts />
		</>
	);
};

export default HomePage;
