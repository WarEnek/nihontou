import { useState } from "react";
import { MantineProvider, Notification } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import $ from "./index.module.css";
import ShibaIcon from "../../assets/cute-shiba-inu-face.svg?react";
import { apiService } from "../../api";
import "@mantine/core/styles.css";

const Login = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [successNotificationOpened, successNotificationHandlers] =
		useDisclosure(false);
	const [errorNotificationOpened, errorNotificationHandlers] =
		useDisclosure(false);
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await apiService.login(formData);
			console.log("Login successful", response);

			// Сохранение токена в localStorage
			localStorage.setItem("token", response.token);
			localStorage.setItem("tokenExpireDate", response.expireDate);

			successNotificationHandlers.open();

			// Обнуление полей ввода
			setFormData({
				username: "",
				password: "",
			});

			setTimeout(() => {
				successNotificationHandlers.close();
				// Перенаправление на страницу /chat
				navigate("/chat");
			}, 1500); // Уменьшили время до 1.5 секунд, чтобы пользователь успел увидеть уведомление
		} catch (error) {
			console.error("Login failed", error);
			setErrorMessage(
				error.response?.data?.message || "Login failed. Please try again.",
			);
			errorNotificationHandlers.open();
			setTimeout(() => {
				errorNotificationHandlers.close();
			}, 3000);
		}
	};

	return (
		<MantineProvider>
			<div className={$.container}>
				<div className={$.box}>
					<div className={$.shiba}>
						<ShibaIcon />
					</div>
					<form onSubmit={handleSubmit} className={$.form}>
						<input
							type="text"
							name="username"
							placeholder="Username"
							value={formData.username}
							onChange={handleChange}
							required
						/>
						<input
							type="password"
							name="password"
							placeholder="Password"
							value={formData.password}
							onChange={handleChange}
							required
						/>
						<button type="submit">Sign In</button>
					</form>
				</div>
				{successNotificationOpened && (
					<Notification
						title="Success!"
						classNames={{
							root: $.notification,
						}}
						color="green"
						onClose={successNotificationHandlers.close}
					>
						Login was successful. Redirecting to chat...
					</Notification>
				)}
				{errorNotificationOpened && (
					<Notification
						title="Error!"
						classNames={{
							root: $.notification,
						}}
						color="red"
						onClose={errorNotificationHandlers.close}
					>
						{errorMessage}
					</Notification>
				)}
			</div>
		</MantineProvider>
	);
};

export default Login;