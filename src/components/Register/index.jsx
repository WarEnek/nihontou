import { useState } from "react";
import { MantineProvider, Notification } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import $ from "./index.module.css";
import shiba from "../../assets/cute-shiba-inu-face.svg";
import { apiService } from "../../api";
import "@mantine/core/styles.css";

const Register = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		firstName: "",
		lastName: "",
	});
	const [successNotificationOpened, successNotificationHandlers] =
		useDisclosure(false);
	const [errorNotificationOpened, errorNotificationHandlers] =
		useDisclosure(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await apiService.register(formData);
			console.log("Registration successful", response);
			successNotificationHandlers.open();
			// Обнуление полей ввода
			setFormData({
				username: "",
				password: "",
				firstName: "",
				lastName: "",
			});
			setTimeout(() => {
				successNotificationHandlers.close();
			}, 3000);
			// Здесь вы можете добавить логику для перенаправления пользователя или сохранения токена
		} catch (error) {
			console.error("Registration failed", error);
			setErrorMessage(
				error.response?.data?.message ||
					"Registration failed. Please try again.",
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
					<img src={shiba} alt="Shiba Inu" />
					<h1 className={$.title}>Sign Up</h1>
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
						<input
							type="text"
							name="firstName"
							placeholder="First Name"
							value={formData.firstName}
							onChange={handleChange}
							required
						/>
						<input
							type="text"
							name="lastName"
							placeholder="Last Name"
							value={formData.lastName}
							onChange={handleChange}
							required
						/>
						<button type="submit">Create</button>
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
						Registration was successful
					</Notification>
				)}
			</div>
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
		</MantineProvider>
	);
};

export default Register;
