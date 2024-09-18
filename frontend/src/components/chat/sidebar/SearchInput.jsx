import { CiSearch } from "react-icons/ci";

const SearchInput = () => {
	return (
		<form className="flex items-center justify-center md:justify-start gap-2">
			<input
				type="text"
				placeholder="search..."
				className="input input-bordered rounded-full"
			/>
            <button type="sumbit" className="btn btn-circle bg-accent text-white">
                <CiSearch className="text-3xl outline-none" />
            </button>
		</form>
	);
};

export default SearchInput;
