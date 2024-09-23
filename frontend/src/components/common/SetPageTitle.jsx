import { Helmet } from "react-helmet-async";

const SetPageTitle = ({ title }) => {
	return (
		<Helmet>
			<title>{title}</title>
		</Helmet>
	);
};

export default SetPageTitle;
