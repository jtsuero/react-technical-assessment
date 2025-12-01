import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../services/api";
import { useCart } from "../context/CartContext";
import "./ProductDetail.css";

interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	compareAtPrice?: number;
	images: string[];
	stock: number;
	rating: number;
	reviewCount: number;
	specifications?: Record<string, string>;
}

function ProductDetail() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { addToCart } = useCart();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [addingToCart, setAddingToCart] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	useEffect(() => {
		if (id) {
			fetchProduct();
		}
	}, [id]);

	const fetchProduct = async () => {
		try {
			setLoading(true);
			setError("");
			const response = await getProduct(id!);

			if (response.data.success) {
				setProduct(response.data.data);
			} else {
				setError("Product not found");
			}
		} catch (err: any) {
			setError(
				err.response?.data?.message ||
					"An error occurred while loading the product."
			);
		} finally {
			setLoading(false);
		}
	};

	const handleAddToCart = async () => {
		if (!product) return;

		try {
			setAddingToCart(true);
			await addToCart(product.id, quantity);
			// Show success message (you could add a toast notification here)
			alert("Item added to cart!");
		} catch (err: any) {
			alert(err.message || "Failed to add item to cart");
		} finally {
			setAddingToCart(false);
		}
	};

	if (loading) {
		return (
			<div className='product-detail-container'>
				<div className='loading-spinner'>
					<div className='spinner'></div>
					<p>Loading product...</p>
				</div>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className='product-detail-container'>
				<div className='error-container'>
					<p className='error-message'>{error || "Product not found"}</p>
					<button onClick={() => navigate("/products")} className='back-button'>
						Back to Products
					</button>
				</div>
			</div>
		);
	}

	const currentImage = product.images?.[selectedImageIndex] || null;

	return (
		<div className='product-detail-container'>
			<button onClick={() => navigate("/products")} className='back-button'>
				← Back to Products
			</button>

			<div className='product-detail-content'>
				<div className='product-images'>
					<div className='main-image'>
						{currentImage ? (
							<img
								src={currentImage}
								alt={product.name}
								onError={(e) => {
									(e.target as HTMLImageElement).style.display = "none";
									const placeholder = (e.target as HTMLImageElement)
										.nextElementSibling as HTMLElement;
									if (placeholder) {
										placeholder.style.display = "flex";
									}
								}}
							/>
						) : null}
						<div
							className='image-placeholder'
							style={{ display: currentImage ? "none" : "flex" }}
						>
							<span>Image not available</span>
						</div>
					</div>
					{product.images && product.images.length > 1 && (
						<div className='image-thumbnails'>
							{product.images.map((image, index) => (
								<button
									key={index}
									className={`thumbnail ${
										selectedImageIndex === index ? "active" : ""
									}`}
									onClick={() => setSelectedImageIndex(index)}
								>
									<img src={image} alt={`${product.name} ${index + 1}`} />
								</button>
							))}
						</div>
					)}
				</div>

				<div className='product-info-detail'>
					<h1>{product.name}</h1>

					<div className='product-rating-detail'>
						<span className='stars'>
							{"⭐".repeat(Math.floor(product.rating || 0))}
						</span>
						<span className='rating-text'>
							{product.rating?.toFixed(1) || "0.0"} ({product.reviewCount || 0}{" "}
							reviews)
						</span>
					</div>

					<div className='product-price-detail'>
						<span className='current-price'>${product.price.toFixed(2)}</span>
						{product.compareAtPrice &&
							product.compareAtPrice > product.price && (
								<span className='compare-price'>
									${product.compareAtPrice.toFixed(2)}
								</span>
							)}
					</div>

					<div className='product-description-detail'>
						<h3>Description</h3>
						<p>{product.description}</p>
					</div>

					{product.specifications &&
						Object.keys(product.specifications).length > 0 && (
							<div className='product-specifications'>
								<h3>Specifications</h3>
								<ul>
									{Object.entries(product.specifications).map(
										([key, value]) => (
											<li key={key}>
												<strong>{key}:</strong> {value}
											</li>
										)
									)}
								</ul>
							</div>
						)}

					<div className='product-actions'>
						<div className='quantity-selector'>
							<label htmlFor='quantity'>Quantity:</label>
							<input
								type='number'
								id='quantity'
								min='1'
								max={product.stock}
								value={quantity}
								onChange={(e) =>
									setQuantity(
										Math.max(
											1,
											Math.min(product.stock, parseInt(e.target.value) || 1)
										)
									)
								}
							/>
						</div>

						{product.stock > 0 ? (
							<button
								onClick={handleAddToCart}
								disabled={addingToCart}
								className='add-to-cart-button'
							>
								{addingToCart ? "Adding..." : "Add to Cart"}
							</button>
						) : (
							<button disabled className='add-to-cart-button out-of-stock'>
								Out of Stock
							</button>
						)}
					</div>

					<div className='stock-info'>
						{product.stock > 0 ? (
							<span className='stock-badge in-stock'>
								{product.stock} in stock
							</span>
						) : (
							<span className='stock-badge out-of-stock'>Out of Stock</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProductDetail;
