import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import Sidebar from "./components/common/Sidebar";
import NotificationPage from "./pages/notification/NotificationPage";
import Loading from "./components/common/Loading";

function App() {
	const { data: authPage, isLoading } = useQuery({
		queryKey: ["authPage"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/v1.0/auth/me");
				const data = await res.json();
				
				if (res.status === 401) return null;

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Something went wrong!");

				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	});

	if (isLoading) {
		return (
			<div className="h-screen flex justify-center items-center">
				<Loading size="lg" />
			</div>
		);
	}

	return (
		<div className="flex max-w-6xl mx-auto">
			{authPage && <Sidebar />}
			<Routes>
				<Route
					path="/"
					element={authPage ? <HomePage /> : <Navigate to="/login" />}
				/>
				<Route
					path="/login"
					element={!authPage ? <LoginPage /> : <Navigate to="/" />}
				/>
				<Route
					path="/signup"
					element={!authPage ? <SignUpPage /> : <Navigate to="/" />}
				/>
				<Route
					path="/notifications"
					element={authPage ? <NotificationPage /> : <Navigate to="/login" />}
				/>
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
