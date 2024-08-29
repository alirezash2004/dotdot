import { Helmet } from "react-helmet-async";
import Posts from "../../components/common/Posts";

const HomePage = () => {
	return (
		<>
			<Helmet>
				<title>Home - DotDot Social Media</title>
			</Helmet>
			<Posts />
		</>
	);
};

export default HomePage;
