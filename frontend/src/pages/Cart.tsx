import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
	const { cartItems, subtotal, loading, updateQuantity, removeFromCart } =
		useCart();
	const navigate = useNavigate();

	if (loading) {
		return (
			<div className='cart-container'>
				<div className='loading-spinner'>
					<div className='spinner'></div>
					<p>Loading cart...</p>
				</div>
			</div>
		);
	}

	if (cartItems.length === 0) {
		return (
			<div className='cart-container'>
				<h1>Your Cart</h1>
				<div className='empty-cart'>
					<p>Your cart is empty</p>
					<button onClick={() => navigate("/products")} className='shop-button'>
						Continue Shopping
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='cart-container'>
			<h1>Your Cart</h1>
			<div className='cart-content'>
				<div className='cart-items'>
					{cartItems.map((item) => (
						<div key={item.id} className='cart-item'>
							<div className='cart-item-image'>
								{item.product?.images?.[0] ? (
									<img
										src={item.product.images[0]}
										alt={item.product.name}
										onClick={() => navigate(`/products/${item.productId}`)}
									/>
								) : (
									<div className='image-placeholder'>
										<span>Image not available</span>
									</div>
								)}
							</div>
							<div className='cart-item-info'>
								<h3 onClick={() => navigate(`/products/${item.productId}`)}>
									{item.product?.name || "Product"}
								</h3>
								<p className='cart-item-price'>
									${item.product?.price.toFixed(2) || "0.00"}
								</p>
							</div>
							<div className='cart-item-actions'>
								<div className='quantity-controls'>
									<button
										onClick={() =>
											updateQuantity(
												item.productId,
												Math.max(1, item.quantity - 1)
											)
										}
										disabled={item.quantity <= 1}
									>
										−
									</button>
									<span>{item.quantity}</span>
									<button
										onClick={() =>
											updateQuantity(item.productId, item.quantity + 1)
										}
										disabled={
											item.product && item.quantity >= item.product.stock
										}
									>
										+
									</button>
								</div>
								<button
									onClick={() => removeFromCart(item.productId)}
									className='remove-button'
								>
									Remove
								</button>
							</div>
							<div className='cart-item-total'>
								${((item.product?.price || 0) * item.quantity).toFixed(2)}
							</div>
						</div>
					))}
				</div>
				<div className='cart-summary'>
					<h2>Order Summary</h2>
					<div className='summary-row'>
						<span>Subtotal</span>
						<span>${subtotal.toFixed(2)}</span>
					</div>
					<div className='summary-row total'>
						<span>Total</span>
						<span>${subtotal.toFixed(2)}</span>
					</div>
					<button className='checkout-button'>Proceed to Checkout</button>
				</div>
			</div>
		</div>
	);
}

export default Cart;
