import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../Loading";
import { CiSearch } from "react-icons/ci";
import changeHost from "../../../../utils/changeHost.js";
import { Link } from "react-router-dom";
import SearchPageItemSkeleton from "../../../skeletons/SearchPageItemSkeleton.jsx";

const SearchpageDialog = () => {
	const [searchPageUsername, setSearchPageUsername] = useState("");

	const {
		data: searchPageData,
		refetch: fetchSearchPage,
		isFetching: isSearchPageFetching,
	} = useQuery({
		queryKey: ["searchPage"],
		queryFn: async () => {
			try {
				if (!searchPageUsername || searchPageUsername === "") {
					toast.error("Search Parameter Can Not Be Empty");
					return [];
				}

				const usernameRegex = /^(?![0-9.])[a-zA-Z][a-zA-Z0-9_.]*[^.]$/;

				if (!usernameRegex.test(searchPageUsername)) {
					toast.error(
						"Username can only contains . and _ Username can't start with ."
					);
					return [];
				}

				const res = await fetch(`/api/v1.0/pages/search/${searchPageUsername}`);

				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Search Pages");

				return data.data;
			} catch (error) {
				toast.error(error.message);
				throw new Error(error);
			}
		},
		enabled: false,
		retry: false,
	});

	const handleSearchByUsername = async (e) => {
		e.preventDefault();

		if (isSearchPageFetching) return;

		await fetchSearchPage();
	};

	return (
		<dialog id={`searchpage_modal`} className="modal border-none outline-none">
			<div className="modal-box rounded border border-gray-700">
				<h3 className="font-bold text-lg mb-4">Search Pages</h3>

				<form className="overflow-x-auto">
					<div className="flex items-center justify-around">
						<label className="input input-bordered flex items-center gap-4 w-3/4">
							@
							<input
								type="text"
								className="grow"
								placeholder="usersame"
								value={searchPageUsername}
								onChange={(e) => setSearchPageUsername(e.target.value)}
							/>
						</label>

						<button
							className={`btn btn-secondary rounded-full flex md:ml-4 btn-square`}
							onClick={handleSearchByUsername}
						>
							{isSearchPageFetching && <Loading />}
							{!isSearchPageFetching && <CiSearch className="text-3xl" />}
						</button>
					</div>
					<table className="table mt-3">
						<tbody>
							{isSearchPageFetching && (
								<>
									<SearchPageItemSkeleton />
									<SearchPageItemSkeleton />
									<SearchPageItemSkeleton hideDivider={true} />
								</>
							)}
							{!isSearchPageFetching &&
								searchPageData &&
								searchPageData.length === 0 && (
									<tr className="flex justify-between border-none pointer-events-none select-none">
										<td className="flex-1 ">
											<div className="flex items-center gap-3">
												<div className="avatar">
													<div className="mask mask-squircle h-12 w-12 ">
														<img
															src="https://placehold.co/400/EEE/31343C?font=montserrat&text=Not+\n+Found"
															alt="Page Profile"
														/>
													</div>
												</div>
												<div className="flex flex-col gap-2">
													Page Not Found!
												</div>
											</div>
										</td>
									</tr>
								)}
							{!isSearchPageFetching &&
								searchPageData &&
								searchPageData.length !== 0 &&
								searchPageData.map((page, idx) => (
									<tr key={idx} className="flex justify-between border-none">
										<td className="flex-1 ">
											<Link to={`/profile/${page.username}`}>
												<div className="flex items-center gap-3">
													<div className="avatar">
														<div className="mask mask-squircle h-12 w-12">
															<img
																src={changeHost(page.profilePicture)}
																alt="Page Profile"
															/>
														</div>
													</div>
													<div>
														<div className="font-bold">{page.fullName}</div>
														<div className="text-sm opacity-50">
															@{page.username}
														</div>
													</div>
												</div>
											</Link>
											{idx !== searchPageData.length - 1 && (
												<div className="divider my-0 mt-4 py-0 h-1" />
											)}
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</form>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button id={`searchpage_modal_close`} className="outline-none">
					close
				</button>
			</form>
		</dialog>
	);
};

export default SearchpageDialog;
