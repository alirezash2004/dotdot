import { Link } from "react-router-dom";
import { useState } from "react";

import DotDotLogo from "../../../components/imgs/DotDot";

import { CiLock, CiMail, CiPen, CiUser, CiWarning } from "react-icons/ci";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
	};

	const handleInputChange = (e) => {
		setFormData((prevFormData) => ({
			...prevFormData,
			[e.target.name]: e.target.value,
		}));
	};

	const isError = false;

	return (
		<div className="max-w-screen-xl mx-auto flex h-screen px-11">
			<div className="flex-1 hidden lg:flex items-center justify-center">
				<DotDotLogo className="lg:w-2/3" />
			</div>
			<div className="flex-1 flex flex-col justify-center items-center">
				<form
					className="lg:w-2/3 mx-auto flex flex-col gap-4"
					onSubmit={handleSubmit}
				>
					<DotDotLogo className="w-32 lg:hidden" />
					<h1 className="text-4xl input-bordered mb-4">Join DotDot</h1>
					<label className="input input-bordered flex items-center gap-2">
						<CiMail />
						<input
							type="email"
							className="grow"
							placeholder="Email"
							name="email"
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					<div className="flex gap-4 flex-wrap">
						<label className="input input-bordered flex items-center gap-2 flex-1">
							<CiPen />
							<input
								type="text"
								className="grow"
								placeholder="Full name"
								name="fullName"
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
						<label className="input input-bordered flex items-center gap-2 flex-1">
							<CiUser />
							<input
								type="text"
								className="grow"
								placeholder="Username"
								name="username"
								autoComplete="true"
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
					</div>
					<label className="input input-bordered flex items-center gap-2">
						<CiLock />
						<input
							type="password"
							className="grow"
							placeholder="Password"
							name="password"
							autoComplete="true"
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className="btn btn-secondary rounded-full">Sign Up</button>
					{isError && <p className="text-red-500"><CiWarning className="inline text-2xl" /> Something went wrong</p>}
				</form>
				<div className="flex flex-col w-full lg:w-2/3 gap-2 mt-5">
					<p className="text-white text-md">Already have an account?</p>
					<Link to="/login">
						<button className="btn rounded-full btn-primary btn-outline text-white w-full">
							Sign in
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
