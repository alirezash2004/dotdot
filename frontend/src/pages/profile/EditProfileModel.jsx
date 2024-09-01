import { useEffect, useRef, useState } from "react";
import useUpdatePageProfile from "../../components/Hooks/useUpdatePageProfile";
import Input from "../../components/common/Input";
import {
	CiAt,
	CiEdit,
	CiGlobe,
	CiLock,
	CiMail,
	CiUnlock,
	CiUser,
} from "react-icons/ci";

const EditProfileModel = ({ authPage }) => {
	const closeModalRef = useRef();
	const [formData, setFormData] = useState({
		username: "",
		fullName: "",
		email: "",
		password: "",
		newpassword: "",
		pageType: "",
		bio: "",
		website: "",
		theme: "",
		language: "",
		// country: "",
		// birthdate: "",
	});

	const { updateProfile, isUpdateProfilePending, isError, error } =
		useUpdatePageProfile();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if (authPage) {
			setFormData({
				username: authPage.username,
				fullName: authPage.fullName,
				email: authPage.email,
				password: "",
				newpassword: "",
				pageType: authPage.pageType,
				bio: authPage.pageProfile.bio,
				website: authPage.pageProfile.website,
				// birthdate: authPage.pageProfile.birthdate,
				theme: authPage.pageSetting.theme,
				language: authPage.pageSetting.language,
				// country: authPage.pageSetting.country,
			});
		}
	}, [authPage]);
	// console.log(authPage);

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		await updateProfile(formData);
		closeModalRef.current.submit();
	};

	return (
		<>
			<button
				className={`btn w-48 md:w-auto md:px-16 btn-outline btn-primary`}
				onClick={() =>
					document.getElementById("edit_profile_modal").showModal()
				}
			>
				Edit Profile
			</button>
			<dialog id="edit_profile_modal" className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Edit Profile</h3>
					<form
						className="flex flex-col gap-4 mt-7"
						onSubmit={handleFormSubmit}
					>
						<span className="text-red-500">{isError && error.message}</span>
						<div className="flex flex-wrap gap-2">
							<Input
								Icon={<CiAt />}
								type="text"
								name="username"
								placeholder="Username"
								value={formData.username}
								onChange={handleInputChange}
								className="flex-1"
							/>
							<Input
								Icon={<CiUser />}
								type="text"
								name="fullName"
								placeholder="Fullname"
								value={formData.fullName}
								onChange={handleInputChange}
								className="flex-1"
							/>
						</div>
						<div className="flex flex-wrap gap-2">
							<div className="flex-1 relative">
								<CiEdit className="absolute top-4 left-4" />
								<textarea
									className="input w-full input-bordered flex items-center gap-2 pt-3 indent-6"
									name="bio"
									placeholder="Bio"
									value={formData.bio}
									onChange={handleInputChange}
								></textarea>
							</div>
						</div>
						<div className="flex flex-wrap gap-2">
							<Input
								Icon={<CiUnlock />}
								type="text"
								name="password"
								placeholder="Password"
								value={formData.password}
								onChange={handleInputChange}
								className="flex-1"
							/>
							<Input
								Icon={<CiLock />}
								type="text"
								name="newpassword"
								placeholder="Newpassword"
								value={formData.newpassword}
								onChange={handleInputChange}
								className="flex-1"
							/>
						</div>
						<div className="flex flex-wrap gap-2">
							<select
								className="flex-1 select input input-bordered"
								onChange={handleInputChange}
								value={formData.theme}
								name="theme"
							>
								<option disabled>Select Theme</option>
								<option value="dark">Dark</option>
								<option value="light">Light</option>
							</select>
							<select
								className="flex-1 select input input-bordered"
								onChange={handleInputChange}
								value={formData.pageType}
								name="pageType"
							>
								<option disabled>Select Page Type</option>
								<option value="public">Public</option>
								<option value="private">Private</option>
							</select>
						</div>
						<div className="flex flex-wrap gap-2">
							{" "}
							<Input
								Icon={<CiMail />}
								type="text"
								name="email"
								placeholder="Email"
								value={formData.email}
								onChange={handleInputChange}
								className="flex-1"
							/>
							<Input
								Icon={<CiGlobe />}
								type="text"
								name="website"
								placeholder="Website"
								value={formData.website}
								onChange={handleInputChange}
								className="flex-1"
							/>
						</div>
						<button
							className={`btn btn-primary rounded-full mt-2 ${
								isUpdateProfilePending ? "btn-disabled" : ""
							}`}
						>
							{isUpdateProfilePending ? "Updating Profile ..." : "Update"}
						</button>
					</form>
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop" ref={closeModalRef}>
					<button>close</button>
				</form>
			</dialog>
		</>
	);
};

export default EditProfileModel;
