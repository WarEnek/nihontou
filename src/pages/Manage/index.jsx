import { useState, useEffect } from "react";
import clsx from "clsx";
import { MantineProvider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Modal, ScrollArea, Notification, Tooltip } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import EditIcon from "../../assets/edit.svg?react";
import DeleteIcon from "../../assets/delete.svg?react";
import {
	IconLogout,
	IconLanguageHiragana,
	IconAdjustmentsHorizontal,
	IconSquareRoundedPlus,
	IconUserPlus,
} from "@tabler/icons-react";
import { apiService } from "../../api"; // Импортируем apiService

import "@mantine/core/styles.css";
import $ from "./index.module.css";

const Manage = () => {
	const [newPrompt, setNewPrompt] = useState({ title: "", content: "" });
	const [prompts, setPrompts] = useState([]);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true); // Add loading state
	const [error, setError] = useState(null); // Add error state
	const [userModalOpened, { open: openUserModal, close: closeUserModal }] =
		useDisclosure(false);
	const [newUser, setNewUser] = useState({
		username: "",
		password: "",
		firstName: "",
		lastName: "",
	});
	const [editingPrompt, setEditingPrompt] = useState(null);
	const [deletingPromptId, setDeletingPromptId] = useState(null);

	const [opened, { open, close }] = useDisclosure(false);
	const [editOpened, { open: editOpen, close: editClose }] =
		useDisclosure(false);
	const [deleteOpened, { open: deleteOpen, close: deleteClose }] =
		useDisclosure(false);
	const [notificationIsOpened, notificationHandlers] = useDisclosure(false);
	const [notificationSaveIsOpened, notificationSaveHandlers] =
		useDisclosure(false);
	const [notificationDeleteIsOpened, notificationDeleteHandlers] =
		useDisclosure(false);
	const [userNotificationIsOpened, userNotificationHandlers] =
		useDisclosure(false);

	const navigate = useNavigate();

	useEffect(() => {
		fetchPrompts();
		fetchUsers();
	}, []);

	const fetchPrompts = async () => {
		setLoading(true);
		setError(null);
		try {
			const fetchedPrompts = await apiService.getAllPrompts();
			setPrompts(fetchedPrompts);
		} catch (error) {
			console.error("Failed to fetch prompts:", error);
			setError("Failed to fetch prompts");
		} finally {
			setLoading(false);
		}
	};

	const fetchUsers = async () => {
		try {
			const fetchedUsers = await apiService.getAllUsers();
			setUsers(fetchedUsers);
		} catch (error) {
			console.error("Failed to fetch users:", error);
		}
	};

	const handleInputChange = (e) => {
		const { id, value } = e.target;
		setNewPrompt((prev) => ({ ...prev, [id]: value }));
	};

	const createPrompt = () => {
		notificationHandlers.open();
		close();

		setTimeout(() => {
			notificationHandlers.close();
		}, 3000);
	};
	const savePrompt = () => {
		notificationSaveHandlers.open();
		editClose();

		setTimeout(() => {
			notificationSaveHandlers.close();
		}, 3000);
	};
	const deletePrompt = () => {
		notificationDeleteHandlers.open();
		deleteClose();

		setTimeout(() => {
			notificationDeleteHandlers.close();
		}, 3000);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await apiService.createPrompt(newPrompt);
			createPrompt();
			setNewPrompt({ title: "", content: "" });
			fetchPrompts(); // Обновляем список промптов после создания
		} catch (error) {
			console.error("Failed to create prompt:", error);
			// Здесь можно добавить обработку ошибки, например, показать уведомление об ошибке
		}
	};

	const handleEdit = (prompt) => {
		setEditingPrompt(prompt);
		editOpen();
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		try {
			await apiService.updatePrompt(editingPrompt.id, editingPrompt);
			savePrompt();
			setEditingPrompt(null);
			fetchPrompts(); // Обновляем список промптов после редактирования
		} catch (error) {
			console.error("Failed to update prompt:", error);
			// Здесь можно добавить обработку ошибки
		}
	};

	const handleDelete = (id) => {
		setDeletingPromptId(id);
		deleteOpen();
	};

	const confirmDelete = async () => {
		try {
			await apiService.deletePrompt(deletingPromptId);
			deletePrompt();
			setDeletingPromptId(null);
			fetchPrompts(); // Обновляем список промптов после удаления
		} catch (error) {
			console.error("Failed to delete prompt:", error);
			// Здесь можно добавить обработку ошибки
		}
	};

	const handleSignOut = () => {
		// Удаление всех данных авторизации из localStorage
		localStorage.removeItem("token");
		localStorage.removeItem("tokenExpireDate");
		// Перенаправление на страницу входа
		navigate("/login");
	};

	const handleUserSubmit = async (e) => {
		e.preventDefault();
		try {
			await apiService.register(newUser);
			closeUserModal();
			fetchUsers(); // Refresh the user list
			setNewUser({
				username: "",
				password: "",
				firstName: "",
				lastName: "",
			});
			notificationHandlers.open(); // You can create a separate notification for user creation if needed
		} catch (error) {
			console.error("Failed to create user:", error);
			// Handle error (e.g., show error notification)
		}
	};

	return (
		<MantineProvider>
			<div className={$.container}>
				<header>
					<a className={$.logo} href="/" />
					<div className={$.middle}>
						<nav className={$.nav}>
							<a href="/translate">
								Translate{" "}
								<IconLanguageHiragana
									style={{ width: "18px" }}
									className={$.headIcon}
								/>
							</a>
							<a href="/manage">
								Manage{" "}
								<IconAdjustmentsHorizontal
									style={{ width: "18px" }}
									className={$.headIcon}
								/>
							</a>
						</nav>
					</div>
					<button type="button" onClick={handleSignOut} className={$.btnHeader}>
						Sign out <IconLogout style={{ width: "18px" }} />
					</button>
				</header>
				<Modal
					opened={opened}
					onClose={close}
					title="Create new Prompt"
					overlayProps={{
						backgroundOpacity: 0.55,
						blur: 3,
					}}
					scrollAreaComponent={ScrollArea.Autosize}
					className={$.modal}
				>
					<form onSubmit={handleSubmit} className={$.formContainer}>
						<div className={$.formRow}>
							<label htmlFor="title">Title</label>
							<input
								type="text"
								id="title"
								placeholder="Title of Prompt"
								value={newPrompt.title}
								onChange={handleInputChange}
								required
							/>
						</div>
						<div className={$.formRow}>
							<label htmlFor="prompt">Prompt</label>
							<textarea
								id="content"
								placeholder="Prompt"
								value={newPrompt.content}
								onChange={handleInputChange}
								required
							/>
						</div>
						<div className={$.formActions}>
							<button
								type="button"
								onClick={close}
								className={clsx([$.btnClose, $.btn])}
							>
								Close
							</button>
							<button type="submit" className={clsx([$.btnCreate, $.btn])}>
								Create
							</button>
						</div>
					</form>
				</Modal>
				<Modal
					opened={editOpened}
					onClose={editClose}
					title="Edit Prompt"
					overlayProps={{
						backgroundOpacity: 0.55,
						blur: 3,
					}}
					scrollAreaComponent={ScrollArea.Autosize}
					className={$.modal}
				>
					<form onSubmit={handleEditSubmit} className={$.formContainer}>
						<div className={$.formRow}>
							<label htmlFor="editTitle">Title</label>
							<input
								type="text"
								id="editTitle"
								placeholder="Title of Prompt"
								value={editingPrompt?.title || ""}
								onChange={(e) =>
									setEditingPrompt({ ...editingPrompt, title: e.target.value })
								}
								required
							/>
						</div>
						<div className={$.formRow}>
							<label htmlFor="editPrompt">Prompt</label>
							<textarea
								id="editPrompt"
								placeholder="Prompt"
								value={editingPrompt?.content || ""}
								onChange={(e) =>
									setEditingPrompt({
										...editingPrompt,
										content: e.target.value,
									})
								}
								required
							/>
						</div>
						<div className={$.formActions}>
							<button
								type="button"
								onClick={editClose}
								className={clsx([$.btnClose, $.btn])}
							>
								Close
							</button>
							<button type="submit" className={clsx([$.btnCreate, $.btn])}>
								Save
							</button>
						</div>
					</form>
				</Modal>
				<Modal
					opened={deleteOpened}
					onClose={deleteClose}
					title="Delete Prompt"
					overlayProps={{
						backgroundOpacity: 0.55,
						blur: 3,
					}}
					scrollAreaComponent={ScrollArea.Autosize}
					className={$.modal}
				>
					<p>
						Are you sure you want to delete your prompt? This action is
						destructive.
					</p>
					<div className={$.formActions}>
						<button
							type="button"
							onClick={deleteClose}
							className={clsx([$.btnClose, $.btn])}
						>
							Close
						</button>
						<button
							type="button"
							className={clsx([$.btnDelete, $.btn])}
							onClick={confirmDelete}
						>
							Delete
						</button>
					</div>
				</Modal>
				<Modal
					opened={userModalOpened}
					onClose={closeUserModal}
					title="Create new User"
					overlayProps={{
						backgroundOpacity: 0.55,
						blur: 3,
					}}
					scrollAreaComponent={ScrollArea.Autosize}
					className={$.modal}
				>
					<form onSubmit={handleUserSubmit} className={$.formContainer}>
						<div className={$.formRow}>
							<label htmlFor="username">Username</label>
							<input
								type="text"
								id="username"
								placeholder="Username"
								value={newUser.username}
								onChange={(e) =>
									setNewUser({ ...newUser, username: e.target.value })
								}
								required
							/>
						</div>
						<div className={$.formRow}>
							<label htmlFor="password">Password</label>
							<input
								type="password"
								id="password"
								placeholder="Password"
								value={newUser.password}
								onChange={(e) =>
									setNewUser({ ...newUser, password: e.target.value })
								}
								required
							/>
						</div>
						<div className={$.formRow}>
							<label htmlFor="firstName">First Name</label>
							<input
								type="text"
								id="firstName"
								placeholder="First Name"
								value={newUser.firstName}
								onChange={(e) =>
									setNewUser({ ...newUser, firstName: e.target.value })
								}
								required
							/>
						</div>
						<div className={$.formRow}>
							<label htmlFor="lastName">Last Name</label>
							<input
								type="text"
								id="lastName"
								placeholder="Last Name"
								value={newUser.lastName}
								onChange={(e) =>
									setNewUser({ ...newUser, lastName: e.target.value })
								}
								required
							/>
						</div>
						<div className={$.formActions}>
							<button
								type="button"
								onClick={closeUserModal}
								className={clsx([$.btnClose, $.btn])}
							>
								Close
							</button>
							<button type="submit" className={clsx([$.btnCreate, $.btn])}>
								Create
							</button>
						</div>
					</form>
				</Modal>
				<div className={$.contentWrapper}>
					<div className={$.list}>
						<div className={$.listHeader}>
							<h2>List of Prompts</h2>
							<Tooltip label="Create Prompt">
								<button
									type="button"
									className={$.btnCreatePrompt}
									onClick={open}
								>
									<IconSquareRoundedPlus
										style={{ width: "48px" }}
										color="green"
									/>
								</button>
							</Tooltip>
						</div>
						<div className={$.listWrapper}>
							<ul>
								{prompts.length !== 0
									? prompts.prompts.map((prompt) => (
											<li key={prompt.id} className={$.listItem}>
												<div className={$.listItemContent}>
													<strong>{prompt.title}</strong>
													<p>{prompt.content}</p>
												</div>
												<div className={$.listActions}>
													<Tooltip label="Edit Prompt">
														<button
															type="button"
															className={$.icon}
															onClick={() => handleEdit(prompt)}
														>
															<EditIcon />
														</button>
													</Tooltip>
													<Tooltip label="Delete Prompt">
														<button
															type="button"
															className={$.icon}
															onClick={() => handleDelete(prompt.id)}
														>
															<DeleteIcon className={$.deleteIcon} />
														</button>
													</Tooltip>
												</div>
											</li>
										))
									: "Loading"}
							</ul>
						</div>
					</div>
					<div className={clsx([$.list, $.listUsers])}>
						<div className={$.listHeader}>
							<h2>List of Users</h2>
							<Tooltip label="Create User">
								<button
									type="button"
									className={$.btnCreatePrompt}
									onClick={openUserModal}
								>
									<IconUserPlus style={{ width: "48px" }} color="green" />
								</button>
							</Tooltip>
						</div>
						<div className={$.listWrapper}>
							<ul>
								{users.map((user) => (
									<li key={user.id} className={$.listItem}>
										<div className={$.listItemContent}>
											<div>
												Username: <strong>{user.username}</strong>
											</div>
											<div>
												First Name: <strong>{user.firstName}</strong>
											</div>
											<div>
												Last Name: <strong>{user.lastName}</strong>
											</div>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
			{notificationIsOpened && (
				<Notification
					title="Success!"
					classNames={{
						root: $.notification,
					}}
					color="green"
				>
					Prompt was successfully created
				</Notification>
			)}
			{notificationSaveIsOpened && (
				<Notification
					title="Success!"
					classNames={{
						root: $.notification,
					}}
					color="green"
				>
					Prompt was successfully saved
				</Notification>
			)}
			{notificationDeleteIsOpened && (
				<Notification
					title="Success!"
					classNames={{
						root: $.notification,
					}}
					color="green"
				>
					Prompt was successfully delete
				</Notification>
			)}
			{userNotificationIsOpened && (
				<Notification
					title="Success!"
					classNames={{
						root: $.notification,
					}}
					color="green"
				>
					User was successfully created
				</Notification>
			)}
		</MantineProvider>
	);
};

export default Manage;
