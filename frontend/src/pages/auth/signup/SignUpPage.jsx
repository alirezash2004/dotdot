import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";

import Input from "../../../components/common/Input";
import DotDotLogo from "../../../components/imgs/DotDot";

import { CiLock, CiMail, CiPen, CiUser, CiWarning } from "react-icons/ci";
import { animate, motion } from "framer-motion";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const {
		mutate: signUpMutation,
		isError,
		isPending,
		error,
	} = useMutation({
		mutationFn: async ({ email, username, fullName, password }) => {
			try {
				const res = await fetch("/api/v1.0/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullName, password }),
				});

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Create Account!");
			} catch (error) {
				toast.error(error.message, { duration: 6000 });
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authPage"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		signUpMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData((prevFormData) => ({
			...prevFormData,
			[e.target.name]: e.target.value,
		}));
	};

	useEffect(() => {
		animate([[".circle-animate", { scale: 1.5 }]]);
	}, []);

	return (
		<>
			<div className="w-screen h-screen absolute top-0 left-0 flex items-center justify-center z-0">
				<motion.div className="w-96 h-96 block rounded-full bg-secondary  circle-animate scale-0 opacity-10"></motion.div>
			</div>

			<Helmet>
				<title>Signup - DotDot Social Media</title>
			</Helmet>

			<div className="max-w-screen-xl mx-auto flex h-screen px-11 z-20">
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
					<div className="flex flex-col w-full lg:w-2/3 gap-2 mt-5">
						<p className="text-white text-md">Already have an account?</p>
						<Link
							to="/login"
							onClick={isPending && ((e) => e.preventDefault())}
						>
							<button
								className={`btn rounded-full btn-primary btn-outline text-white w-full ${
									isPending ? "btn-disabled" : ""
								}`}
							>
								Sign in
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default SignUpPage;
