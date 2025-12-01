import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
	const navigate = useNavigate();
	const { cartItemCount } = useCart();
	const token = localStorage.getItem("token");

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/login");
	};

	if (!token) {
		return null;
	}

	return (
		<nav className='navbar'>
			<div className='navbar-content'>
				<div className='navbar-brand' onClick={() => navigate("/products")}>
					Marketplace
				</div>
				<div className='navbar-actions'>
					<button className='cart-button' onClick={() => navigate("/cart")}>
						Cart
						{cartItemCount > 0 && (
							<span className='cart-badge'>{cartItemCount}</span>
						)}
					</button>
					<button className='logout-button' onClick={handleLogout}>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
