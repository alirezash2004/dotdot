import { Link } from "react-router-dom";

const ChangePage = ({ to, desc, title, isPending }) => {
	return (
		<div className="flex flex-col w-full lg:w-2/3 gap-2 mt-5">
			<p className="text-white text-md">{desc}</p>
			<Link to={to} onClick={isPending && ((e) => e.preventDefault())}>
				<button
					className={`btn rounded-full btn-primary btn-outline text-white w-full ${
						isPending ? "btn-disabled" : ""
					}`}
				>
					{title}
				</button>
			</Link>
		</div>
	);
};

export default ChangePage;
