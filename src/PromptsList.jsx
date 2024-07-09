import { useState, useEffect } from "react";
import { apiService } from "./api";

const PromptsList = () => {
	const [prompts, setPrompts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPrompts = async () => {
			try {
				const response = await apiService.getAllPrompts();
				setPrompts(response.prompts || []);
				setLoading(false);
			} catch (err) {
				setError("Failed to fetch prompts");
				setLoading(false);
			}
		};

		fetchPrompts();
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<ul>
			{prompts.map((prompt) => (
				<li key={prompt.id}>{prompt.content}</li>
			))}
		</ul>
	);
};

export default PromptsList;
