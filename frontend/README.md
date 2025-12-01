# Marketplace Frontend

A React + TypeScript application built with Vite for the Marketplace e-commerce platform.

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Backend API** running on `http://localhost:3000` (see backend README for setup)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

## Environment Variables

The app uses environment variables for configuration. Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
```

For production, update `VITE_API_URL` to your production API URL.

> **Note:** If no `.env` file is provided, the app defaults to `http://localhost:3000/api`

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### Build for Production

Create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality

## Features

- ✅ User authentication (Login/Logout)
- ✅ Product browsing with search and sorting
- ✅ Product detail pages
- ✅ Shopping cart functionality
- ✅ Protected routes
- ✅ Responsive design
- ✅ Error handling and loading states

## Test Credentials

- **Email:** `john.doe@example.com`
- **Password:** `password123`

## Project Structure

```
src/
├── components/       # Reusable components (Navbar, ProtectedRoute)
├── context/          # React Context providers (CartContext)
├── pages/            # Page components (Login, Products, ProductDetail, Cart)
├── services/         # API service layer
├── App.tsx           # Main app component with routing
└── main.tsx          # Application entry point
```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## Troubleshooting

### Backend Connection Issues

If you see API errors:

1. Ensure the backend server is running on `http://localhost:3000`
2. Check that `VITE_API_URL` in `.env` matches your backend URL
3. Verify CORS is enabled on the backend

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port. Check the terminal output for the actual URL.

## License

ISC
