import { Link } from "react-router-dom";
import { useState } from "react";

import DotDotLogo from "../../../components/imgs/DotDot";

import { CiHashtag, CiKeyboard, CiWarning } from "react-icons/ci";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
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
					<h1 className="text-2xl input-bordered mb-4">
						{"Let's"} Jump Right In ..
					</h1>
					<label className="input input-bordered flex items-center gap-2">
						<CiHashtag />
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
					<label className="input input-bordered flex items-center gap-2">
						<CiKeyboard />
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
					<button className="btn btn-secondary rounded-full">Login</button>
					{isError && (
						<p className="text-red-500">
							<CiWarning className="inline text-2xl" /> Something went wrong
						</p>
					)}
				</form>
				<div className="flex flex-col w-full lg:w-2/3 gap-2 mt-5">
					<p className="text-white text-md">{"Don't"} have an account?</p>
					<Link to="/signup">
						<button className="btn rounded-full btn-primary btn-outline text-white w-full">
							Sign Up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
