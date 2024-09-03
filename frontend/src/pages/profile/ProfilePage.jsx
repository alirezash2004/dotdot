import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

import { useUsername } from "../../components/Hooks/useUsername";
import { usePageProfile } from "../../components/Hooks/usePageProfile";
import { useLogout } from "../../components/Hooks/useLogout";

import {
	CiBookmark,
	CiEdit,
	CiHeart,
	CiLock,
	CiLogout,
	CiUser,
} from "react-icons/ci";

import ProfileTopSkeleton from "../../components/skeletons/ProfileTopSkeleton";

import Loading from "../../components/common/Loading";

import Posts from "./ProfilePosts";
import EditProfileModel from "./EditProfileModel";
import useUploadFiles from "../../components/Hooks/useUploadFiles";
import changeHost from "../../utils/changeHost.js";

const ProfilePage = () => {
	const [postFeedType, setPostFeedType] = useState("me");
	const [profileImg, setProfileImg] = useState({});

	let { username: paramUsername } = useParams();

	const { logout, isLoggingOut, loggedOut } = useLogout();

	const { data: authPage } = useQuery({ queryKey: ["authPage"] });

	const profileImageInputRef = useRef(null);

	const queryClinet = useQueryClient();

	const { isValidUsername, isMyProfile } = useUsername({
		username: paramUsername,
		authUsername: authPage.username,
	});

	const {
		targetPage,
		isFetching: isPageProfileFetching,
		isFollowing,
		refetch: refetchProfilePage,
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

				refetchProfilePage();
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});

	const {
		isUploadError,
		isUploaded,
		isUploaing,
		setIsUploaded,
		upload,
		uploadError,
	} = useUploadFiles({ destination: "profilePic" });

	const { mutateAsync: ChangeProfile, isPending: isChangeProfilePending } =
		useMutation({
			mutationFn: async (fileAccesstoken) => {
				const res = await fetch(`/api/v1.0/pages/updatepageprofile`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						fileAccesstoken,
					}),
				});
				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Update Profile");

				return data;
			},
			onSuccess: () => {
				toast.success("profile pic updated successfully");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});

	const handleFollowUnfollow = () => {
		followUnfollow();
	};

	const renderPosts = useMemo(() => {
		if (isValidUsername) {
			return <Posts pageUsername={paramUsername} />;
		} else {
			return <></>;
		}
	}, [paramUsername, isValidUsername]);

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

	return (
		<>
			<Helmet>
				<title>
					Profile {isValidUsername && `- ${paramUsername}`} - DotDot Social
					Media
				</title>
			</Helmet>
			<div className="flex-[4_4_0] border-r border-gray-700 min-h-screen relative mb-20">
				{isMyProfile && (
					<div
						className={`absolute h-fit top-0 right-0 md:hidden p-1 cursor-pointer md:mr-2 md:ml-6 border border-spacing-16 rounded-none border-l-slate-600 border-b-slate-600 hover:bg-slate-600 hover:fill-black transition-all duration-300 flex items-center justify-center btn ${
							isLoggingOut || loggedOut ? "btn-disabled" : ""
						}`}
						onClick={(e) => {
							e.preventDefault();
							logout();
						}}
					>
						{(isLoggingOut || loggedOut) && (
							<Loading className="w-full h-full" />
						)}
						{!isLoggingOut && !loggedOut && (
							<div className="flex items-center gap-2 px-3">
								<CiLogout className="text-2xl" />
								<span>Logout</span>
							</div>
						)}
					</div>
				)}
				<div
					className={`pb-16 ${!isMyProfile ? "border-b border-gray-700" : ""}`}
				>
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
											onChange={(e) =>
												handleProfileImageChange(e.target.files[0])
											}
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
											{isMyProfile
												? authPage.postsCount
												: targetPage?.postsCount}
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
									{isMyProfile && <EditProfileModel authPage={authPage} />}
									{!isMyProfile && (
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
									)}

									{isMyProfile && profileImg.file && (
										<button
											className={`btn w-48 md:w-auto px-8 btn-primary ${
												isChangeProfilePending || isUploaing
													? "btn-disabled"
													: ""
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
				</div>
				{isMyProfile && (
					<>
						<div role="tablist" className="tabs tabs-bordered tabs-lg">
							<a
								role="tab"
								className={`tab flex gap-2 ${
									postFeedType === "me" ? "tab-active" : ""
								}`}
								onClick={() => setPostFeedType("me")}
							>
								<span>Me</span>
								<CiUser className="w-6 h-6" />
							</a>
							<a
								role="tab"
								className={`tab flex gap-2 ${
									postFeedType === "saved" ? "tab-active" : ""
								}`}
								onClick={() => setPostFeedType("saved")}
							>
								<span>Saved</span>
								<CiBookmark className="w-6 h-6" />
							</a>
							<a
								role="tab"
								className={`tab flex gap-2 ${
									postFeedType === "liked" ? "tab-active" : ""
								}`}
								onClick={() => setPostFeedType("liked")}
							>
								<span>Liked</span>
								<CiHeart className="w-6 h-6" />
							</a>
						</div>
						<Posts pageUsername={paramUsername} postFeedType={postFeedType} />
						{/* {renderPosts} */}
					</>
				)}{" "}
				{/* Fucking 3 days for this */}
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
							renderPosts
						)}
					</>
				)}
			</div>
		</>
	);
};

export default ProfilePage;
