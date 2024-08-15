import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import Input from "../../../components/common/Input";
import DotDotLogo from "../../../components/imgs/DotDot";

import { CiHashtag, CiKeyboard, CiWarning } from "react-icons/ci";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const {
		mutate: loginMutation,
		isError,
		isPending,
		error,
	} = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("/api/v1.0/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Login");
			} catch (error) {
				toast.error(error.message, { duration: 6000 });
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Logged in successfully");
			queryClient.invalidateQueries({
				queryKey: ["authPage"],
			});
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData((prevFormData) => ({
			...prevFormData,
			[e.target.name]: e.target.value,
		}));
	};

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
