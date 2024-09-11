import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useLogout() {
	const queryClient = useQueryClient();

	const {
		mutate: logoutMutation,
		isPending: isLoggingOut,
		isSuccess: loggedOut,
	} = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/v1.0/auth/logout", {
					method: "POST",
				});

				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Logout");
			} catch (error) {
				throw new Error(error);
			}
		},

		onSuccess: () => {
			toast.success("Logout Successfully");
			queryClient.invalidateQueries({ queryKey: ["authPage"] });
		},
		onError: (error) => {
			toast.error(`Logout Failed! ${error.message}`);
		},
	});

	return {
		logout: logoutMutation,
		isLoggingOut,
		loggedOut,
	};
}
