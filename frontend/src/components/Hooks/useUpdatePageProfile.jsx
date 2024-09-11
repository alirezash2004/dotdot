import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useUpdatePageProfile = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const {
		mutateAsync: updateProfile,
		isPending: isUpdateProfilePending,
		isError,
		error,
	} = useMutation({
		mutationFn: async (formData) => {
			try {
				const res = await fetch(`/api/v1.0/pages/update`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});

				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Update Profile");

				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (returnData) => {
			toast.success("Profile Updated Successfully.");

			if (returnData.usernameChange)
				navigate(`/profile/${returnData.username}`, { replace: false });

			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authPage"] }),
				queryClient.invalidateQueries({ queryKey: ["pageprofile"] }),
			]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { updateProfile, isUpdateProfilePending, isError, error };
};

export default useUpdatePageProfile;
