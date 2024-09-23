import SetPageTitle from "../../../components/common/SetPageTitle";

import AuthUiBgCircle from "../../../components/auth/AuthUiBgCircle";
import ChangePage from "../../../components/auth/ChangePage";
import Logo from "../../../components/auth/Logo";

import useLogin from "./useLogin";
import LoginForm from "./loginForm/LoginForm";

const LoginPage = () => {
	const { login, isPending, error, isError } = useLogin();

	return (
		<>
			<SetPageTitle title="Login - DotDot Social Media" />

			<AuthUiBgCircle />

			<div className="max-w-screen-xl mx-auto flex h-screen px-11 z-20">
				<Logo />

				<div className="flex-1 flex flex-col justify-center items-center">
					<LoginForm
						login={login}
						isPending={isPending}
						isError={isError}
						error={error}
					/>

					<ChangePage
						to="/signup"
						title="Sign Up"
						desc="Don't have an account?"
						isPending={isPending}
					/>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
