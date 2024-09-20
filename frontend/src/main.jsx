import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { SocketContextProvider } from "./context/SocketContext.jsx";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<HelmetProvider>
					<SocketContextProvider>
						<App />
					</SocketContextProvider>
				</HelmetProvider>
			</QueryClientProvider>
		</BrowserRouter>
	</StrictMode>
);
