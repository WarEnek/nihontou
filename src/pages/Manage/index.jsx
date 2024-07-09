import clsx from "clsx";
import { MantineProvider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Modal, ScrollArea, Notification, Tooltip } from "@mantine/core";
import EditIcon from "../../assets/edit.svg?react";
import DeleteIcon from "../../assets/delete.svg?react";
import PlusIcon from "../../assets/plus.svg?react";
import "@mantine/core/styles.css";

import $ from "./index.module.css";

const Manage = () => {
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

	return (
		<MantineProvider>
			<div className={$.container}>
				<header>
					<div className={$.logo} />
					<a href="#">Sign out</a>
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
					<div className={$.formContainer}>
						<div className={$.formRow}>
							<label htmlFor="title">Title</label>
							<input type="text" id="title" placeholder="Title of Prompt" />
						</div>
						<div className={$.formRow}>
							<label htmlFor="title">Prompt</label>
							<textarea id="prompt" placeholder="Prompt" />
						</div>
						<div className={$.formActions}>
							<button
								type="button"
								onClick={close}
								className={clsx([$.btnClose, $.btn])}
							>
								Close
							</button>
							<button
								type="button"
								className={clsx([$.btnCreate, $.btn])}
								onClick={() => createPrompt()}
							>
								Create
							</button>
						</div>
					</div>
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
					<div className={$.formContainer}>
						<div className={$.formRow}>
							<label htmlFor="title">Title</label>
							<input
								type="text"
								id="title"
								placeholder="Title of Prompt"
								value="Commit"
							/>
						</div>
						<div className={$.formRow}>
							<label htmlFor="title">Prompt</label>
							<textarea
								id="prompt"
								placeholder="Prompt"
								value="Translate the following GitHub commit message from English
											to Japanese, ensuring that IT and technical terms are
											accurately translated and understandable for a Japanese
											developer. The translation should be clear, concise, and
											maintain the original intent and technical accuracy of the
											commit message. Use appropriate Japanese technical
											terminology and context. Here is the commit message:"
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
							<button
								type="button"
								className={clsx([$.btnCreate, $.btn])}
								onClick={() => savePrompt()}
							>
								Save
							</button>
						</div>
					</div>
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
							onClick={close}
							className={clsx([$.btnClose, $.btn])}
						>
							Close
						</button>
						<button
							type="button"
							className={clsx([$.btnDelete, $.btn])}
							onClick={() => deletePrompt()}
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
							<ul>
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
