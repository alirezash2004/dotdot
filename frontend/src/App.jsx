import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import Sidebar from "./components/common/sidebar/Sidebar";
import Loading from "./components/common/Loading";

import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";

import HomePage from "./pages/home/HomePage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import PostPage from "./pages/post/PostPage";
import NewpostPage from "./pages/newpost/NewpostPage";
import ChatPage from "./pages/chat/ChatPage";
import ExplorePage from "./pages/explore/ExplorePage";

function App() {
	if (JSON.parse(localStorage.getItem("islight"))) {
		document.documentElement.setAttribute("data-theme", "light");
	} else {
		document.documentElement.setAttribute("data-theme", "black");
	}

	const { data: authPage, isLoading } = useQuery({
		queryKey: ["authPage"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/v1.0/auth/me");
				const data = await res.json();

				if (res.status === 401) return null;

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Something went wrong!");

				return data.page;
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
		<>
			<div className="flex max-w-6xl mx-auto flex-col-reverse md:flex-row font-[Vazir]">
				{authPage && <Sidebar />}
				<Routes>
					<Route
						path="/"
						element={authPage ? <HomePage /> : <Navigate to="/login" />}
					/>
					<Route
						path="/explore"
						element={authPage ? <ExplorePage /> : <Navigate to="/login" />}
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
					<Route
						path="/profile/:username"
						element={authPage ? <ProfilePage /> : <Navigate to="/login" />}
					/>
					<Route
						path="/post/:id"
						element={authPage ? <PostPage /> : <Navigate to="/login" />}
					/>
					<Route
						path="/newpost"
						element={authPage ? <NewpostPage /> : <Navigate to="/login" />}
					/>
					<Route
						path="/chat"
						element={authPage ? <ChatPage /> : <Navigate to="/login" />}
					/>
					<Route
						path="/chat/:username"
						element={authPage ? <ChatPage /> : <Navigate to="/login" />}
					/>
				</Routes>
				<Toaster />
			</div>
		</>
	);
}

export default App;
