import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useUsername } from "../../components/Hooks/useUsername";
import { usePageProfile } from "../../components/Hooks/usePageProfile";

import { CiEdit, CiLock } from "react-icons/ci";

import ProfileTopSkeleton from "../../components/skeletons/ProfileTopSkeleton";

import Loading from "../../components/common/Loading";

import Posts from "./ProfilePosts";

const ProfilePage = () => {
	let { username: paramUsername } = useParams();

	const { data: authPage } = useQuery({ queryKey: ["authPage"] });

	const { isValidUsername, isMyProfile } = useUsername({
		username: paramUsername,
		authUsername: authPage.username,
	});

	const {
		targetPage,
		isFetching: isPageProfileFetching,
		isFollowing,
		ChangeFollowingStatus,
	} = usePageProfile({
		username: paramUsername,
		isValidUsername: isValidUsername,
		isMyProfile: isMyProfile,
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

				ChangeFollowingStatus();
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});

	const handleFollowUnfollow = () => {
		followUnfollow();
	};

	const handleEditProfile = () => {
		console.log("Edit");
	};

	if (!isValidUsername) {
		return (
			<>
				<div className="flex-[4_4_0] border-r border-gray-700 min-h-screen w-full items-center justify-center text-center pt-14 text-5xl text-rose-600">
					Invalid username
				</div>
			</>
		);
	}

	// console.log(targetPage);
	// console.log(authPage);

	return (
		<div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
			<div className="pb-7 border-b border-gray-700">
				{isPageProfileFetching && !isMyProfile && <ProfileTopSkeleton />}

				{(!isPageProfileFetching || isMyProfile) && (
					<>
						<div className="flex items-center flex-col gap-7 md:gap-0 md:flex-row w-full justify-around mt-8">
							<div className="flex flex-col md:flex-row items-center gap-4">
								<div className="avatar">
									<div className="w-20 md:w-32 rounded-full relative group/avatar">
										<img
											src={
												isMyProfile
													? authPage.profilePicture
													: targetPage?.profilePicture ||
													  "/avatar-placeholder.png"
											}
										/>
										{/* <img src={"/avatar-placeholder.png"} /> */}
										{isMyProfile && (
											<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:transform-none md:top-7 md:right-5 md:left-auto p-1 text-black bg-white rounded-full group-hover/avatar:opacity-100 opacity-50 md:opacity-100 transition-all cursor-pointer">
												<CiEdit
													className="w-4 h-4 cursor-pointer"
													onClick={() => {}}
												/>
											</div>
										)}
									</div>
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
								<div className="btn btn-outline border-slate-700 px-3 md:px-7 h-14 md:h-20 no-animation join-item flex flex-col md:gap-4 hover:bg-slate-800 hover:border-slate-800 hover:text-slate-100">
									<span>FOLLOWERS</span>
									<span>
										{isMyProfile
											? authPage.followersCount
											: targetPage?.followersCount}
									</span>
								</div>
								<div className="btn btn-outline border-slate-700 px-3 md:px-7 h-14 md:h-20 no-animation join-item flex flex-col md:gap-4 hover:bg-slate-800 hover:border-slate-800 hover:text-slate-100">
									<span>FOLLOWINGS</span>
									<span>
										{isMyProfile
											? authPage.followingCount
											: targetPage?.followingCount}
									</span>
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
								<button
									onClick={
										isMyProfile ? handleEditProfile : handleFollowUnfollow
									}
									className={`btn w-48 md:w-auto md:px-16 ${
										isMyProfile ? "btn-outline" : ""
									} ${
										!isMyProfile && isFollowing
											? "btn-secondary"
											: "btn-primary"
									} ${
										(isPageProfileFetching && !isMyProfile) ||
										isFollowUnfollowPending
											? "btn-disabled"
											: ""
									}`}
								>
									{(isPageProfileFetching && !isMyProfile) ||
										(isFollowUnfollowPending && <Loading />)}
									{isMyProfile && "Edit Profile"}
									{!isMyProfile && !isPageProfileFetching && (
										<>
											{!isMyProfile && !isFollowing && "Follow"}
											{!isMyProfile && isFollowing && "Following"}
										</>
									)}
								</button>
								{isMyProfile && (
									<button className="btn w-48 md:w-auto px-8 btn-primary">
										Update
									</button>
								)}
							</div>
						</div>
					</>
				)}
			</div>
			{isMyProfile && <Posts pageUsername={paramUsername} />} {/* Fucking 3 days for this */}
			{!isMyProfile && (
				<>
					{targetPage?.pageType === "private" &&
					!isFollowing &&
					!isPageProfileFetching ? (
						<div className="flex w-full items-center justify-center h-1/3">
							<div className="flex flex-col gap-3 items-center justify-center px-4 py-12 shadow-2xl rounded-2xl">
								<CiLock className="w-10 h-10 md:w-12 md:h-12" />
								<h3 className="text-xl md:text-3xl">This Page Is Private</h3>
								<h4 className="text-sm text-slate-500">
									You Have To First Follow To See Posts
								</h4>
							</div>
						</div>
					) : (
						<Posts pageUsername={paramUsername} />
					)}
				</>
			)}
		</div>
	);
};

export default ProfilePage;
