import axios from "axios";

// Use environment variable with fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
	baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const login = (email: string, password: string) =>
	api.post("/auth/login", { email, password });

export const getProducts = (params?: {
	search?: string;
	sort?: string;
	featured?: boolean;
	minPrice?: number;
	maxPrice?: number;
}) => {
	const queryParams = new URLSearchParams();
	if (params?.search) queryParams.append("search", params.search);
	if (params?.sort) queryParams.append("sort", params.sort);
	if (params?.featured) queryParams.append("featured", "true");
	if (params?.minPrice)
		queryParams.append("minPrice", params.minPrice.toString());
	if (params?.maxPrice)
		queryParams.append("maxPrice", params.maxPrice.toString());

	const queryString = queryParams.toString();
	return api.get(`/products${queryString ? `?${queryString}` : ""}`);
};

export const getProduct = (id: string) => api.get(`/products/${id}`);

// Cart endpoints
export const getCart = () => api.get("/cart");
export const addToCart = (productId: string, quantity: number = 1) =>
	api.post("/cart", { productId, quantity });
export const updateCartItem = (productId: string, quantity: number) =>
	api.put(`/cart/${productId}`, { quantity });
export const removeFromCart = (productId: string) =>
	api.delete(`/cart/${productId}`);
export const clearCart = () => api.delete("/cart");

export default api;
