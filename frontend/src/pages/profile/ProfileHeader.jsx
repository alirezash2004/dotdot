import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import useGetFollowingRelations from "../../components/Hooks/useGetFollowingRelations";
import useUploadFiles from "../../components/Hooks/useUploadFiles";

import changeHost from "../../utils/changeHost.js";

import usePageProfile from "../../components/Hooks/usePageProfile";

import Loading from "../../components/common/Loading";
import ProfileTopSkeleton from "../../components/skeletons/ProfileTopSkeleton";

import EditProfileModel from "./EditProfileModel";

import { CiEdit } from "react-icons/ci";
import { Link } from "react-router-dom";

const ProfileHeader = ({ pageUsername }) => {
	const [profileImg, setProfileImg] = useState({});

	const profileImageInputRef = useRef(null);

	const { data: authPage } = useQuery({ queryKey: ["authPage"] });

	const queryClinet = useQueryClient();

	const isMyProfile = authPage.username === pageUsername;

	const {
		targetPage,
		isFetching: isPageProfileFetching,
		isFollowing,
		fetchProfilePage,
	} = usePageProfile({
		username: pageUsername,
		authPageId: authPage._id,
	});

	const { mutate: followUnfollow, isPending: isFollowUnfollowPending } =
		useMutation({
			mutationFn: async () => {
				try {
					const res = await fetch(`/api/v1.0/followingRelationships`, {
						method: isFollowing ? "DELETE" : "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							pageId: authPage._id,
							followedPageId: targetPage._id,
						}),
					});

					if (res.status === 500) {
						throw new Error("Internal Server Error");
					}

					const data = await res.json();

					if (!res.ok || data.success === false)
						throw new Error(data.msg || "Failed to follow/unfollow");

					return data;
				} catch (error) {
					throw new Error(error);
				}
			},
			onSuccess: () => {
				toast.success(
					isFollowing
						? `UnFollowed ${targetPage.username}`
						: `You are now following ${targetPage.username}`
				);

				fetchProfilePage();
				// queryClinet.invalidateQueries({
				// 	queryKey: ["profilePosts", pageUsername],
				// });
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});

	const { isUploadError, isUploaing, upload, uploadError } = useUploadFiles({
		destination: "profilePic",
	});

	const { mutateAsync: ChangeProfile, isPending: isChangeProfilePending } =
		useMutation({
			mutationFn: async (fileAccesstoken) => {
				try {
					const res = await fetch(`/api/v1.0/pages/updatepageprofile`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							fileAccesstoken,
						}),
					});

					if (res.status === 500) {
						throw new Error("Internal Server Error");
					}

					const data = await res.json();

					if (!res.ok || data.success === false)
						throw new Error(data.msg || "Failed To Update Profile");

					return data;
				} catch (error) {
					throw new Error(error);
				}
			},
			onSuccess: () => {
				toast.success("profile pic updated successfully");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});

	const {
		followingRelationData,
		isFollowingRelationLoading,
		fetchFollowingRelation,
		changeFollowingRelationType,
		reset,
	} = useGetFollowingRelations({
		targetPageId: isMyProfile ? authPage._id : targetPage?._id,
	});

	const handleFollowUnfollow = () => {
		followUnfollow();
	};
	const handleProfileImageChange = (file) => {
		if (file) {
			setProfileImg({ file: file, blob: URL.createObjectURL(file) });
		}
	};

	const handleUpdateProfileImage = async () => {
		if (!profileImg.file || isUploaing) return;
		try {
			const token = await upload([profileImg]);
			if (isUploadError) throw new Error(uploadError);
			await ChangeProfile(token[0]);
			await queryClinet.invalidateQueries(["pageprofile"]);
			setProfileImg({});
			profileImageInputRef.current.value = "";
		} catch (error) {
			toast.error(error.message);
		}
	};

	const delay = (ms) => {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	};

	const loadFollowingRelation = async (type) => {
		if (isFollowingRelationLoading) return;
		changeFollowingRelationType(type);
		await delay(100);
		await reset();
		await fetchFollowingRelation();

		document.getElementById("followitems_modal").showModal();
	};

	return (
		<div className={`pb-16 ${!isMyProfile ? "border-b border-gray-700" : ""}`}>
			{isPageProfileFetching && !isMyProfile && <ProfileTopSkeleton />}

			{(!isPageProfileFetching || isMyProfile) && (
				<>
					<div className="flex items-center flex-col gap-7 md:gap-0 md:flex-row w-full justify-around mt-8">
						<div className="flex flex-col md:flex-row items-center gap-4">
							<div className="avatar">
								<div className="w-20 md:w-32 rounded-full relative group/avatar">
									<img
										src={
											profileImg.blob
												? profileImg.blob
												: isMyProfile
												? changeHost(authPage.profilePicture)
												: changeHost(targetPage?.profilePicture) ||
												  "/avatar-placeholder.png"
										}
										className="pointer-events-none"
									/>
									{/* <img src={"/avatar-placeholder.png"} /> */}
									{isMyProfile && (
										<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:transform-none md:top-7 md:right-5 md:left-auto p-1 text-black bg-white rounded-full group-hover/avatar:opacity-100 opacity-50 md:opacity-100 transition-all cursor-pointer">
											<CiEdit
												className="w-4 h-4 cursor-pointer"
												onClick={() => {
													profileImageInputRef.current.click();
												}}
											/>
										</div>
									)}
								</div>
								<input
									type="file"
									accept=".png,.jpeg,.jpg"
									hidden
									ref={profileImageInputRef}
									onChange={(e) => handleProfileImageChange(e.target.files[0])}
								/>
							</div>
							<div className="flex flex-col items-center md:items-start">
								<span className="text-lg text-primary">
									{isMyProfile ? authPage.username : targetPage?.username}
								</span>
								<span className="text-slate-500">
									{isMyProfile ? authPage.fullName : targetPage?.fullName}
								</span>
							</div>
						</div>
						<div className="join justify-around">
							<div className="btn btn-outline border-slate-700 px-3 md:px-7 h-14 md:h-20 no-animation join-item flex flex-col md:gap-4 hover:bg-slate-800 hover:border-slate-800 hover:text-slate-100">
								<span>POSTS</span>
								<span>
									{isMyProfile ? authPage.postsCount : targetPage?.postsCount}
								</span>
							</div>
							<div
								className="btn btn-outline border-slate-700 px-3 md:px-7 h-14 md:h-20 no-animation join-item flex flex-col md:gap-4 hover:bg-slate-800 hover:border-slate-800 hover:text-slate-100"
								onClick={() => loadFollowingRelation("followers")}
							>
								{isFollowingRelationLoading ? (
									<Loading />
								) : (
									<>
										<span>FOLLOWERS</span>
										<span>
											{isMyProfile
												? authPage.followersCount
												: targetPage?.followersCount}
										</span>
									</>
								)}
							</div>
							<div
								className="btn btn-outline border-slate-700 px-3 md:px-7 h-14 md:h-20 no-animation join-item flex flex-col md:gap-4 hover:bg-slate-800 hover:border-slate-800 hover:text-slate-100"
								onClick={() => loadFollowingRelation("followers")}
							>
								{isFollowingRelationLoading ? (
									<Loading />
								) : (
									<>
										<span>FOLLOWINGS</span>
										<span>
											{isMyProfile
												? authPage.followersCount
												: targetPage?.followersCount}
										</span>
									</>
								)}
							</div>
						</div>
					</div>
					<div className="flex flex-col md:flex-row items-center w-full justify-around mt-5 gap-5 md:gap-0">
						<div className="flex flex-col gap-3 items-start">
							{" "}
							<span className="text-2xl">
								{isMyProfile
									? authPage.pageProfile.bio
									: targetPage?.pageProfile.bio}
							</span>
							<a
								href={
									isMyProfile
										? authPage.pageProfile.website
										: targetPage?.pageProfile.website
								}
								className="text-cyan-600 cursor-pointer"
							>
								{isMyProfile
									? authPage.pageProfile.website
									: targetPage?.pageProfile.website}
							</a>
						</div>
						<div className="flex flex-col md:flex-row items-center gap-4">
							{isMyProfile && <EditProfileModel authPage={authPage} />}
							{!isMyProfile && (
								<>
									<button
										onClick={handleFollowUnfollow}
										className={`btn w-48 md:w-auto md:px-16 ${
											isFollowing ? "btn-secondary" : "btn-primary"
										} ${
											isPageProfileFetching || isFollowUnfollowPending
												? "btn-disabled"
												: ""
										}`}
									>
										{(isPageProfileFetching || isFollowUnfollowPending) && (
											<Loading />
										)}
										{!isPageProfileFetching && isFollowing
											? "Following"
											: "Follow"}
									</button>
									<Link
										to={`/chat/${targetPage?.username}`}
										className={`btn w-48 md:w-auto md:px-16 btn-secondary btn-outline`}
									>
										Message
									</Link>
								</>
							)}

							{isMyProfile && profileImg.file && (
								<button
									className={`btn w-48 md:w-auto px-8 btn-primary ${
										isChangeProfilePending || isUploaing ? "btn-disabled" : ""
									}`}
									onClick={handleUpdateProfileImage}
								>
									{isUploaing && !isChangeProfilePending && "Uploading ..."}
									{isChangeProfilePending && "Changing Profile ..."}
									{!isUploaing && !isChangeProfilePending && "Update"}
								</button>
							)}
						</div>
					</div>
				</>
			)}

			<dialog id="followitems_modal" className="modal outline-none">
				<div className="modal-box">
					<div>{followingRelationData?.relationType}</div>
					<div className="overflow-x-auto mt-6">
						<table className="table">
							<tbody>
								{followingRelationData.data?.map((followingRelation, idx) => (
									<tr key={idx}>
										<td>
											<div
												className="flex items-center gap-3 cursor-pointer"
												onClick={() =>
													window.location.replace(
														`/profile/${followingRelation.pageId.username}`
													)
												}
											>
												<div className="avatar">
													<div className="mask mask-squircle h-12 w-12">
														<img
															src={changeHost(
																followingRelation.pageId.profilePicture
															)}
															alt="Pgae Profile Image"
														/>
													</div>
												</div>
												<div>
													<div className="font-bold">
														{followingRelation.pageId.fullName}
													</div>
													<div className="text-sm opacity-50">
														{followingRelation.pageId.username}
													</div>
												</div>
											</div>
										</td>
										<th className="flex justify-center">
											{followingRelation.isFollowing && (
												<button className="btn btn-secondary w-11/12 md:w-2/3">
													Following
												</button>
											)}
											{!followingRelation.isFollowing && (
												<button className="btn btn-primary btn-outline w-11/12 md:w-2/3">
													Follow
												</button>
											)}
										</th>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button className="outline-none">close</button>
				</form>
			</dialog>
		</div>
	);
};

export default ProfileHeader;
