import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/api";
import "./Products.css";

interface Product {
	id: string;
	name: string;
	price: number;
	images: string[];
	description: string;
	rating: number;
	reviewCount: number;
	stock: number;
}

function Products() {
	const navigate = useNavigate();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("");

	useEffect(() => {
		fetchProducts();
	}, [sortBy]);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			setError("");
			const params: any = {};
			if (searchTerm) params.search = searchTerm;
			if (sortBy) params.sort = sortBy;

			const response = await getProducts(params);

			if (response.data.success) {
				setProducts(response.data.data.products || []);
			} else {
				setError("Failed to load products");
			}
		} catch (err: any) {
			setError(
				err.response?.data?.message ||
					"An error occurred while loading products. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		fetchProducts();
	};

	if (loading) {
		return (
			<div className='products-container'>
				<div className='loading-spinner'>
					<div className='spinner'></div>
					<p>Loading products...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='products-container'>
				<div className='error-container'>
					<p className='error-message'>{error}</p>
					<button onClick={fetchProducts} className='retry-button'>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='products-container'>
			<div className='products-header'>
				<h1>Products</h1>
				<div className='products-controls'>
					<form onSubmit={handleSearch} className='search-form'>
						<input
							type='text'
							placeholder='Search products...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='search-input'
						/>
						<button type='submit' className='search-button'>
							Search
						</button>
						{searchTerm && (
							<button
								type='button'
								onClick={() => {
									setSearchTerm("");
									setTimeout(() => fetchProducts(), 0);
								}}
								className='clear-button'
							>
								Clear
							</button>
						)}
					</form>
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
						className='sort-select'
					>
						<option value=''>Sort by...</option>
						<option value='price_asc'>Price: Low to High</option>
						<option value='price_desc'>Price: High to Low</option>
						<option value='rating'>Highest Rated</option>
						<option value='newest'>Newest First</option>
					</select>
				</div>
			</div>
			{products.length === 0 ? (
				<div className='empty-state'>
					<p>
						{searchTerm
							? `No products found matching "${searchTerm}"`
							: "No products available"}
					</p>
					{searchTerm && (
						<button
							onClick={() => {
								setSearchTerm("");
								setTimeout(() => fetchProducts(), 0);
							}}
							className='clear-search-button'
						>
							Clear Search
						</button>
					)}
				</div>
			) : (
				<div className='products-grid'>
					{products.map((product) => (
						<div
							key={product.id}
							className='product-card'
							onClick={() => navigate(`/products/${product.id}`)}
						>
							<div className='product-image'>
								{product.images?.[0] ? (
									<img
										src={product.images[0]}
										alt={product.name}
										onError={(e) => {
											// If image fails to load, show placeholder
											const target = e.target as HTMLImageElement;
											target.style.display = "none";
											const placeholder =
												target.nextElementSibling as HTMLElement;
											if (placeholder) {
												placeholder.style.display = "flex";
											}
										}}
									/>
								) : null}
								<div
									className='product-image-placeholder'
									style={{ display: product.images?.[0] ? "none" : "flex" }}
								>
									<span>Image not available</span>
								</div>
							</div>
							<div className='product-info'>
								<h3 className='product-name'>{product.name}</h3>
								<p className='product-description'>
									{product.description?.substring(0, 100)}
									{product.description?.length > 100 ? "..." : ""}
								</p>
								<div className='product-rating'>
									<span className='stars'>
										{"⭐".repeat(Math.floor(product.rating || 0))}
									</span>
									<span className='rating-text'>
										{product.rating?.toFixed(1) || "0.0"} (
										{product.reviewCount || 0} reviews)
									</span>
								</div>
								<div className='product-footer'>
									<div className='product-price'>
										${product.price.toFixed(2)}
									</div>
									{product.stock > 0 ? (
										<span className='stock-badge in-stock'>In Stock</span>
									) : (
										<span className='stock-badge out-of-stock'>
											Out of Stock
										</span>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default Products;
