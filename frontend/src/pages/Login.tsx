import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import "./Login.css";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// Redirect to products if already logged in
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			navigate("/products", { replace: true });
		}
	}, [navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await login(email, password);

			if (response.data.success && response.data.data.token) {
				// Store JWT token
				localStorage.setItem("token", response.data.data.token);
				localStorage.setItem("user", JSON.stringify(response.data.data.user));

				// Redirect to products page
				navigate("/products");
			} else {
				setError("Login failed. Please check your credentials.");
			}
		} catch (err: any) {
			setError(
				err.response?.data?.message ||
					"An error occurred during login. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='login-container'>
			<div className='login-card'>
				<h1>Login</h1>
				<form onSubmit={handleSubmit}>
					<div className='form-group'>
						<label htmlFor='email'>Email</label>
						<input
							type='email'
							id='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder='john.doe@example.com'
						/>
					</div>
					<div className='form-group'>
						<label htmlFor='password'>Password</label>
						<input
							type='password'
							id='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							placeholder='Enter your password'
						/>
					</div>
					{error && <div className='error-message'>{error}</div>}
					<button type='submit' disabled={loading} className='login-button'>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
