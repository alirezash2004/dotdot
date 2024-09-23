import SetPageTitle from "../../../components/common/SetPageTitle";

import AuthUiBgCircle from "../../../components/auth/AuthUiBgCircle";
import ChangePage from "../../../components/auth/ChangePage";
import Logo from "../../../components/auth/Logo";

import useSignup from "./useSignup";
import SignUpForm from "./signUpForm/SignUpForm";

const SignUpPage = () => {
	const { signup, isPending, isError, error } = useSignup();

	return (
		<>
			<SetPageTitle title="Signup - DotDot Social Media" />

			<AuthUiBgCircle />

			<div className="max-w-screen-xl mx-auto flex h-screen px-11 z-20">
				<Logo />
				
				<div className="flex-1 flex flex-col justify-center items-center">
					<SignUpForm
						signup={signup}
						isPending={isPending}
						isError={isError}
						error={error}
					/>

					<ChangePage
						to="/login"
						title="Sign In"
						desc="Already have an account?"
						isPending={isPending}
					/>
				</div>
			</div>
		</>
	);
};

export default SignUpPage;
