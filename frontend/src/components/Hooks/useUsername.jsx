import { useEffect, useState } from "react";

export function useUsername({ username, authUsername }) {
	const [usernameValidate, setUsernameValidate] = useState(false);
	const [isMyProfile, setIsMyProfile] = useState(false);

	useEffect(() => {
		const usernameRegx =
			/^(?![0-9.])(?=[a-zA-Z0-9._]{6,16}$)[a-zA-Z][a-zA-Z0-9_.]*[^.]$/;
		const usernameValid = usernameRegx.test(username);
		setUsernameValidate(usernameValid);
		if (!usernameValid) {
			return;
		}

		setIsMyProfile(authUsername === username);
	}, [username, authUsername]);

	return {
		isValidUsername: usernameValidate,
        isMyProfile
	};
}
