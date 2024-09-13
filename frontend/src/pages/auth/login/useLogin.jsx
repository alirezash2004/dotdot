import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useLogin = () => {
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

    return {
        login: loginMutation,
        isError,
        isPending,
        error,
    }
};

export default useLogin;
