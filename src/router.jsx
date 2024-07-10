import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./pages/Chat";
import Manage from "./pages/Manage";

// Функция для проверки наличия токена
const isAuthenticated = () => {
	const token = localStorage.getItem("token");
	const expireDate = localStorage.getItem("tokenExpireDate");
	if (!token || !expireDate) return false;

	// Проверка срока действия токена
	return new Date(expireDate) > new Date();
};

// Компонент для защищенных маршрутов
const ProtectedRoute = () => {
	if (!isAuthenticated()) {
		return <Navigate to="/login" replace />;
	}
	return <Outlet />;
};

// Компонент для публичных маршрутов (перенаправляет на /chat, если пользователь авторизован)
const PublicRoute = ({ element }) => {
	if (isAuthenticated()) {
		return <Navigate to="/chat" replace />;
	}
	return element;
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <PublicRoute element={<Login />} />,
	},
	{
		path: "/login",
		element: <PublicRoute element={<Login />} />,
	},
	{
		path: "/signup",
		element: <PublicRoute element={<Register />} />,
	},
	{
		path: "/",
		element: <ProtectedRoute />,
		children: [
			{
				path: "chat",
				element: <Chat />,
			},
			{
				path: "manage",
				element: <Manage />,
			},
		],
	},
]);

export default router;