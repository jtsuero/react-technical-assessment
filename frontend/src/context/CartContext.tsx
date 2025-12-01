import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import {
	getCart,
	addToCart as addToCartAPI,
	updateCartItem as updateCartItemAPI,
	removeFromCart as removeFromCartAPI,
} from "../services/api";

interface CartItem {
	id: string;
	productId: string;
	quantity: number;
	product?: {
		id: string;
		name: string;
		price: number;
		images: string[];
		stock: number;
	};
}

interface CartContextType {
	cartItems: CartItem[];
	cartItemCount: number;
	subtotal: number;
	loading: boolean;
	addToCart: (productId: string, quantity?: number) => Promise<void>;
	updateQuantity: (productId: string, quantity: number) => Promise<void>;
	removeFromCart: (productId: string) => Promise<void>;
	refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [cartItemCount, setCartItemCount] = useState(0);
	const [subtotal, setSubtotal] = useState(0);
	const [loading, setLoading] = useState(false);

	const fetchCart = async () => {
		try {
			setLoading(true);
			const response = await getCart();
			if (response.data.success) {
				setCartItems(response.data.data.items || []);
				setCartItemCount(response.data.data.items?.length || 0);
				setSubtotal(response.data.data.subtotal || 0);
			}
		} catch (error) {
			console.error("Failed to fetch cart:", error);
			// If unauthorized, clear cart
			setCartItems([]);
			setCartItemCount(0);
			setSubtotal(0);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			fetchCart();
		}
	}, []);

	const addToCart = async (productId: string, quantity: number = 1) => {
		try {
			await addToCartAPI(productId, quantity);
			await fetchCart(); // Refresh cart after adding
		} catch (error: any) {
			throw new Error(
				error.response?.data?.message || "Failed to add item to cart"
			);
		}
	};

	const updateQuantity = async (productId: string, quantity: number) => {
		try {
			await updateCartItemAPI(productId, quantity);
			await fetchCart(); // Refresh cart after updating
		} catch (error: any) {
			throw new Error(
				error.response?.data?.message || "Failed to update cart item"
			);
		}
	};

	const removeFromCart = async (productId: string) => {
		try {
			await removeFromCartAPI(productId);
			await fetchCart(); // Refresh cart after removing
		} catch (error: any) {
			throw new Error(
				error.response?.data?.message || "Failed to remove item from cart"
			);
		}
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				cartItemCount,
				subtotal,
				loading,
				addToCart,
				updateQuantity,
				removeFromCart,
				refreshCart: fetchCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
