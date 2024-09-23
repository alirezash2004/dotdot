import { Link } from "react-router-dom";

import DotDotLogo from "../../../imgs/DotDot";

const SideBarLogo = () => {
	return (
		<Link to="/" className="hidden md:flex justify-start md:mt-2">
			<DotDotLogo className="px-2 w-16 hover:bg-stone-600 rounded" />
		</Link>
	);
};

export default SideBarLogo;
