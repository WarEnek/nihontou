import { useState, useEffect } from "react";
import clsx from "clsx";
import { MantineProvider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Modal, ScrollArea, Notification, Tooltip } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import EditIcon from "../../assets/edit.svg?react";
import DeleteIcon from "../../assets/delete.svg?react";
import PlusIcon from "../../assets/plus.svg?react";
import { apiService } from "../../api"; // Импортируем apiService

import "@mantine/core/styles.css";
import $ from "./index.module.css";

const Manage = () => {
	const [newPrompt, setNewPrompt] = useState({ title: "", content: "" });
	const [prompts, setPrompts] = useState([]);
	const [loading, setLoading] = useState(true); // Add loading state
	const [error, setError] = useState(null); // Add error state

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
	const navigate = useNavigate();

	useEffect(() => {
		fetchPrompts();
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

	return (
		<MantineProvider>
			<div className={$.container}>
				<header>
					<div className={$.logo} />
					<div className={$.middle}>
						<nav className={$.nav}>
							<a href="/chat">Chat</a>
							<a href="/manage">Manage</a>
						</nav>
					</div>
					<button type="button" onClick={handleSignOut} className={$.btnHeader}>
						Sign out
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
									<PlusIcon />
								</button>
							</Tooltip>
						</div>
						<div className={$.listWrapper}>
							{/* <ul>
								<li className={$.listItem}>
									<div className={$.listItemContent}>
										<strong>Commit</strong>
										<p>
											Translate the following GitHub commit message from English
											to Japanese, ensuring that IT and technical terms are
											accurately translated and understandable for a Japanese
											developer. The translation should be clear, concise, and
											maintain the original intent and technical accuracy of the
											commit message. Use appropriate Japanese technical
											terminology and context. Here is the commit message:
										</p>
									</div>
									<div className={$.listActions}>
										<Tooltip label="Edit Prompt">
											<button type="button" className={$.icon}>
												<EditIcon />
											</button>
										</Tooltip>
										<Tooltip label="Delete Prompt">
											<button type="button" className={$.icon}>
												<DeleteIcon className={$.deleteIcon} />
											</button>
										</Tooltip>
									</div>
								</li>
								<li className={$.listItem}>
									<div className={$.listItemContent}>
										<strong>Task description</strong>
										<p>
											Translate the following Jira task description from English
											to Japanese, ensuring that IT and technical terms are
											accurately translated and understandable for a Japanese
											developer. The translation should be clear, concise, and
											maintain the original intent and technical accuracy of the
											task description. Use appropriate Japanese technical
											terminology and context.
										</p>
									</div>
									<div className={$.listActions}>
										<Tooltip label="Edit Prompt">
											<button
												type="button"
												className={$.icon}
												onClick={editOpen}
											>
												<EditIcon />
											</button>
										</Tooltip>
										<Tooltip label="Delete Prompt">
											<button
												type="button"
												className={$.icon}
												onClick={deleteOpen}
											>
												<DeleteIcon className={$.deleteIcon} />
											</button>
										</Tooltip>
									</div>
								</li>
							</ul> */}
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
		</MantineProvider>
	);
};

export default Manage;
