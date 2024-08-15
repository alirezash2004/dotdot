import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClinet, QueryClientProvider } from "@tanstack/react-query";

const queryClinet = new QueryClinet();

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClinet}>
				<App />
			</QueryClientProvider>
		</BrowserRouter>
	</StrictMode>
);
