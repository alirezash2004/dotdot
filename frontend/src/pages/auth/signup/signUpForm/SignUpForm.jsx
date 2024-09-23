import { useState } from "react";
import DotDotLogo from "../../../../components/imgs/DotDot";
import Input from "../../../../components/common/Input";
import { CiLock, CiMail, CiPen, CiUser, CiWarning } from "react-icons/ci";

const SignUpForm = ({ signup, isPending, isError, error }) => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		signup(formData);
	};

	const handleInputChange = (e) => {
		setFormData((prevFormData) => ({
			...prevFormData,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<form
			className="lg:w-2/3 mx-auto flex flex-col gap-4"
			onSubmit={handleSubmit}
		>
			<DotDotLogo className="w-32 lg:hidden" />
			<h1 className="text-4xl input-bordered mb-4">Join DotDot</h1>
			<Input
				Icon={<CiMail />}
				type="email"
				placeholder="Email"
				name="email"
				onChange={handleInputChange}
				value={formData.email}
			/>
			<div className="flex gap-4 flex-wrap">
				<Input
					Icon={<CiPen />}
					type="text"
					placeholder="Full name"
					name="fullName"
					onChange={handleInputChange}
					value={formData.fullName}
					className="flex-1"
				/>
				<Input
					Icon={<CiUser />}
					type="text"
					placeholder="Username"
					name="username"
					autoComplete="true"
					onChange={handleInputChange}
					value={formData.username}
					className="flex-1"
				/>
			</div>
			<Input
				Icon={<CiLock />}
				type="password"
				placeholder="Password"
				name="password"
				autoComplete="true"
				onChange={handleInputChange}
				value={formData.password}
			/>
			<button
				className={`btn btn-secondary rounded-full ${
					isPending ? "btn-disabled" : ""
				}`}
			>
				{isPending ? "Loading ..." : "Signup"}
			</button>
			{isError && (
				<p className="text-red-500">
					<CiWarning className="inline text-2xl" /> {error.message}
				</p>
			)}
		</form>
	);
};

export default SignUpForm;
