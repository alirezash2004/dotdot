import { useEffect, useState } from "react";

export function useUsername({ username, authUsername }) {
	const [usernameValidate, setUsernameValidate] = useState(false);
	const [isMyProfile, setIsMyProfile] = useState(false);
	const [isValidatingUsername, setIsValidatingUsername] = useState(true);

	useEffect(() => {
		setIsValidatingUsername(true);
		const usernameRegx =
			/^(?![0-9.])(?=[a-zA-Z0-9._]{6,16}$)[a-zA-Z][a-zA-Z0-9_.]*[^.]$/;
		const usernameValid = usernameRegx.test(username) && username !== undefined;
		setUsernameValidate(usernameValid);
		if (!usernameValid) {
			setIsValidatingUsername(false);
			return;
		}

		setIsMyProfile(authUsername === username);
		setIsValidatingUsername(false);
	}, [username, authUsername]);

	return {
		isValidUsername: usernameValidate,
		isMyProfile,
		isValidatingUsername,
	};
}
