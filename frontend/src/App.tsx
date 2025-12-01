import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<CartProvider>
				<Navbar />
				<Routes>
					<Route path='/login' element={<Login />} />
					<Route
						path='/products'
						element={
							<ProtectedRoute>
								<Products />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/products/:id'
						element={
							<ProtectedRoute>
								<ProductDetail />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/cart'
						element={
							<ProtectedRoute>
								<Cart />
							</ProtectedRoute>
						}
					/>
					<Route path='/' element={<Navigate to='/login' replace />} />
				</Routes>
			</CartProvider>
		</BrowserRouter>
	);
}

export default App;
