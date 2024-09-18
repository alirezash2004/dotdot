import { Helmet } from "react-helmet-async";

import Posts from "../../components/common/Posts";
import TopBar from "../../components/common/TopBar";

const HomePage = () => {
	return (
		<>
			<Helmet>
				<title>Home - DotDot Social Media</title>
			</Helmet>
			<TopBar />
			<Posts />
		</>
	);
};

export default HomePage;
