import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useSignup = () => {
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

				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Create Account!");
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authPage"] });
		},
		onError: (error) => {
			toast.error(error.message, { duration: 6000 });
		},
	});

    return {
        signup: signUpMutation,
        isError,
        isPending,
        error,
    }
};

export default useSignup;
