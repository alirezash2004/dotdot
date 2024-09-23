import SetPageTitle from "../../components/common/SetPageTitle";
import TopBar from "./topbar/TopBar";
import Posts from "./posts/Posts";

const HomePage = () => {
	return (
		<>
			<SetPageTitle title="Home - DotDot Social Media" />

			<TopBar />

			<Posts />
		</>
	);
};

export default HomePage;
