import { useState } from "react";
import DotDotLogo from "../../../../components/imgs/DotDot";
import Input from "../../../../components/common/Input";
import { CiHashtag, CiKeyboard, CiWarning } from "react-icons/ci";

const LoginForm = ({ login, isPending, isError, error }) => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		login(formData);
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
			<h1 className="text-2xl input-bordered mb-4">
				{"Let's"} Jump Right In ..
			</h1>
			<Input
				Icon={<CiHashtag />}
				type="text"
				className="grow"
				placeholder="Username"
				name="username"
				autoComplete="true"
				onChange={handleInputChange}
				value={formData.username}
			/>
			<Input
				Icon={<CiKeyboard />}
				type="password"
				className="grow"
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
				{isPending ? "Loading ..." : "Login"}
			</button>
			{isError && (
				<p className="text-red-500">
					<CiWarning className="inline text-2xl" /> {error.message}
				</p>
			)}
		</form>
	);
};

export default LoginForm;
