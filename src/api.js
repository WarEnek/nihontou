import axios from "axios";

const API_BASE_URL = "/api";

console.log(process.env);
console.log(process.env.API_BASE_ADDRESS);

const api = axios.create({
	baseURL: import.meta.env.API_BASE_ADDRESS,
});

// Функция для получения токена из localStorage
const getToken = () => {
	return localStorage.getItem("token");
};

// Добавляем интерцептор для установки токена в заголовок каждого запроса
api.interceptors.request.use(
	(config) => {
		const token = getToken();
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export const apiService = {
	// Authentication
	register: async (data) => {
		const response = await api.post("/api/Authentication", data);
		return response.data;
	},

	login: async (data) => {
		const response = await api.put("/api/Authentication", data);
		return response.data;
	},

	// ProcessedText
	processText: async (data) => {
		const response = await api.post("/api/ProcessedText", data);
		return response.data;
	},

	// Prompts
	getAllPrompts: async () => {
		const response = await api.get("/api/Prompts");
		return response.data;
	},

	createPrompt: async (data) => {
		const response = await api.post("/api/Prompts", data);
		return response.data;
	},

	updatePrompt: async (id, data) => {
		const response = await api.put(`/api/Prompts/${id}`, data);
		return response.data;
	},

	deletePrompt: async (id) => {
		await api.delete(`/api/Prompts/${id}`);
	},

	// User
	getAllUsers: async () => {
		const response = await api.get("/api/User/all");
		return response.data;
	},

	getCurrentUser: async () => {
		const response = await api.get("/api/User");
		return response.data;
	},

	updateUser: async (data) => {
		const response = await api.put("/api/User", data);
		return response.data;
	},

	// Users
	getUserById: async (id) => {
		const response = await api.get(`/api/Users/${id}`);
		return response.data;
	},

	getUsers: async () => {
		const response = await api.get("/api/Users");
		return response.data;
	},
};
