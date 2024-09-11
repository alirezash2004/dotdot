import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { motion, animate } from "framer-motion";

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

				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Login");
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Logged in successfully");
			queryClient.invalidateQueries({
				queryKey: ["authPage"],
			});
		},
		onError: (error) => {
			toast.error(error.message, { duration: 6000 });
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

	useEffect(() => {
		animate([[".circle-animate", { scale: 1.5 }]]);
	}, []);

	return (
		<>
			<div className="w-screen h-screen absolute top-0 left-0 flex items-center justify-center z-0 overflow-hidden">
				<motion.div className="w-96 h-96 block rounded-full bg-secondary  circle-animate scale-0 opacity-10"></motion.div>
			</div>

			<Helmet>
				<title>Login - DotDot Social Media</title>
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
						<Link
							to="/signup"
							onClick={isPending && ((e) => e.preventDefault())}
						>
							<button
								className={`btn rounded-full btn-primary btn-outline text-white w-full ${
									isPending ? "btn-disabled" : ""
								}`}
							>
								Sign Up
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
