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

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Logout");
			} catch (error) {
				toast.error(error.message, { duration: 6000 });
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Logout Successfully");
			queryClient.invalidateQueries({ queryKey: ["authPage"] });
		},
		onError: () => {
			toast.error("Logout Failed!");
		},
	});

	return {
		logout: logoutMutation,
		isLoggingOut,
		loggedOut,
	};
}
