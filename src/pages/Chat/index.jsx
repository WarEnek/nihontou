import { MantineProvider } from "@mantine/core";
import clsx from "clsx";
import { useState } from "react";
import PromptField from "../../components/PromptField";
import $ from "./index.module.css";

const Chat = () => {
	const [loading, setLoading] = useState(false);
	const process = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};
	return (
		<MantineProvider>
			<div className={$.container}>
				<header>
					<div className={$.logo} />
					<select className={$.select}>
						<option value="">Commit</option>
						<option value="">Task description</option>
						<option value="">Task title</option>
					</select>
					<a href="#">Sign out</a>
				</header>
				<div className={$.chatContainer}>
					<PromptField placeholder="Type something interesting" left />
					<button
						type="submit"
						className={clsx($.btn, loading && $.isLoading)}
						onClick={() => process()}
					>
						<span className={$.textInBtn}>Translate</span>
						<div className={$.shiba} />
					</button>
					<PromptField />
				</div>
			</div>
		</MantineProvider>
	);
};

export default Chat;
