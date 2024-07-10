import { MantineProvider, Select } from "@mantine/core";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PromptField from "../../components/PromptField";
import { apiService } from "../../api";
import {
	IconLogout,
	IconLanguageHiragana,
	IconAdjustmentsHorizontal,
} from "@tabler/icons-react";
import $ from "./index.module.css";

const Translate = () => {
	const [loading, setLoading] = useState(false);
	const [inputText, setInputText] = useState("");
	const [outputText, setOutputText] = useState("");
	const [promptType, setPromptType] = useState("");
	const [prompts, setPrompts] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchPrompts();
	}, []);

	const fetchPrompts = async () => {
		try {
			const fetchedPrompts = await apiService.getAllPrompts();
			setPrompts(fetchedPrompts);
			if (fetchedPrompts.prompts.length > 0) {
				setPromptType(fetchedPrompts.prompts[0].id);
			}
		} catch (error) {
			console.error("Failed to fetch prompts", error);
		}
	};

	const process = async () => {
		setLoading(true);
		try {
			const response = await apiService.processText({
				text: inputText,
				promptId: promptType,
			});
			setOutputText(response.processedText);
		} catch (error) {
			console.error("Processing failed", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSignOut = () => {
		// Удаление всех данных авторизации из localStorage
		localStorage.removeItem("token");
		localStorage.removeItem("tokenExpireDate");

		// Очистка состояния приложения
		setInputText("");
		setOutputText("");
		setPromptType("");
		setPrompts([]);

		// Перенаправление на страницу входа
		navigate("/login");
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
						{prompts.length !== 0 && (
							<Select
								label="Select prompt"
								className={$.select}
								placeholder="Pick value"
								value={promptType}
								onChange={setPromptType}
								data={prompts.prompts.map((prompt) => ({
									value: prompt.id,
									label: prompt.title,
								}))}
							/>
						)}
					</div>
					<button type="button" onClick={handleSignOut} className={$.btnHeader}>
						Sign out <IconLogout style={{ width: "18px" }} />
					</button>
				</header>
				<div className={$.chatContainer}>
					<PromptField
						placeholder="Type something interesting"
						left
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
					/>
					<button
						type="submit"
						className={clsx($.btn, loading && $.isLoading)}
						onClick={process}
						disabled={loading || inputText.length === 0}
					>
						<span className={$.textInBtn}>Translate</span>
						<div className={$.shiba} />
					</button>
					<PromptField value={outputText} readOnly />
				</div>
			</div>
		</MantineProvider>
	);
};

export default Translate;
