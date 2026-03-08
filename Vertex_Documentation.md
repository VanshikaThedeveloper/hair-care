# 🌟 Vertex Hair Care - Thorough Technical Documentation 🌟

Welcome to the **Vertex** project! This document is a complete, beginner-friendly, and technically deep guide to how the entire MERN stack (MongoDB, Express.js, React.js, Node.js) application is structured, how it works, and how the different pieces communicate with each other. 

If you are new to the project, reading this file will give you a complete understanding of the architecture, from the moment a user clicks a button to how the database saves the data.

---

## 1️⃣ CLIENT (Frontend) - React.js (Vite)

The `client` folder contains the entire frontend of the application, built with React and Vite. It is responsible for rendering the UI, handling user interactions, managing local state, and communicating with the backend API.

### 📂 Folder Structure Overview

```text
client/
├── public/           # Static files like favicon that are served directly
├── src/
│   ├── components/   # Reusable UI building blocks (Navbar, Footer, ProductCard, etc.)
│   ├── context/      # Global state management using React Context API (Auth, Cart)
│   ├── data/         # Static fallback or mock data
│   ├── images/       # Local image assets
│   ├── pages/        # Full page components representing different routes (Home, Cart, etc.)
│   ├── services/     # API connection logic (Axios config)
│   ├── styles/       # Global CSS styles
│   ├── App.jsx       # Main component handling Routing and Global Providers
│   └── main.jsx      # Application entry point
├── package.json      # Frontend dependencies and scripts
└── vite.config.js    # Vite configuration
```

### 🧠 Purpose of Each Folder
- **`components/`**: Contains small, reusable sections of the UI. For instance, `ProductCard.jsx` is used multiple times on the Products page and the Home page.
- **`pages/`**: Contains the main views. Each file here usually corresponds to a single URL route (e.g., `/cart` maps to `CartPage.jsx`).
- **`context/`**: This is where global state lives. If multiple components need to know if a user is logged in, that data is stored here so we don't have to pass props through every component layer.
- **`services/`**: Holds `api.js`, which configures Axios for making HTTP requests to our backend.
- **`styles/`**: Global CSS files.

### 📄 Important Files Explained One by One

- **`src/main.jsx`**: The foundational entry point. It imports `App.jsx`, grabs the `div` with ID `root` from the HTML, and renders the React App inside it using `ReactDOM.createRoot`.
- **`src/App.jsx`**: The core layout and routing configuration file. It wraps the entire app in Providers (`AuthProvider`, `CartProvider`) and defines all the URL routes using React Router (like `/login`, `/home`, `/cart`). It also uses Code Splitting (`React.lazy` and `Suspense`) to load pages only when necessary, which makes the initial app load much faster.
- **`src/context/AuthContext.jsx`**: Manages user authentication state globally. It remembers if a user is logged in, holds user details, and provides functions to log in, log out, and register. 
- **`src/context/CartContext.jsx`**: Manages the user's shopping cart. It fetches the cart from the backend, provides functions like `addToCart`, `removeFromCart`, evaluates totals, and shares this data with any component that needs it.
- **`src/services/api.js`**: An Axios instance pre-configured to point to our backend (`/api`). It automatically attaches login tokens to every request and handles silent token refreshing if a token expires.

### 🔀 How Routing Works (React Router)
Routing is handled in `App.jsx` using `react-router-dom`.
- We define routes using `<Route path="/some-path" element={<SomePage />} />`.
- **Protection**: We have custom wrapper components like `<PrivateRoute>` and `<AdminRoute>`. If a user tries to access `/cart` (which requires logging in), `<PrivateRoute>` checks the `AuthContext`. If there is no user, it automatically redirects them to `/login`.
- **Lazy Loading**: Pages are imported dynamically using `lazy(() => import('./pages/HomePage'))`. This means the user only downloads the code for the Home page when they visit it.

### 🌐 How API Calls Are Made
We use **Axios**, configured in `services/api.js`.
Instead of writing full URLs (`http://localhost:5000/api/products`), components just use the `api` instance:
```javascript
const response = await api.get('/products');
```
This is because `api.js` has a `baseURL` set to `/api`. It also acts as an "interceptor"—every time we make a request, it silently stops it for a millisecond, attaches our saved `accessToken` (from `localStorage`) to the Request Headers, and then sends it to the server.

### 🏗️ State Management
We use the **Context API** (not Redux) for managing global state.
For example, the Navbar needs to display the number of items in the cart, but the Add To Cart button is deep inside the `ProductCard` component. The `CartContext` holds the cart array. Both components "subscribe" to this context. When `ProductCard` adds an item, `CartContext` updates, and React instantly re-renders the Navbar to show the new count.

### 🛍️ How Product Data is Fetched and Displayed
When a user visits the `/products` page, a `useEffect` hook runs as soon as the component loads.
1. It calls the backend using `api.get('/products')`.
2. The backend returns an array of product objects (name, price, image url, description).
3. The component saves this array into its local state (`useState`).
4. React maps over this array, rendering a reusable `<ProductCard />` component for each product.

### 🛒 How Cart Functionality Works
1. A user clicks "Add to Cart" on a product.
2. The `addToCart` function from `CartContext` is triggered.
3. This function makes an API `POST` request to the backend (`/cart`) with the product ID.
4. The backend updates the database and responds with success.
5. `CartContext` immediately fetches the updated cart from the backend to ensure the frontend is perfectly synced with the database.

### 🔐 Authentication Flow (Frontend)
1. User logs in. The backend returns an `accessToken` (short-lived) and sets a `refreshToken` as an HttpOnly secure cookie.
2. The frontend saves the `accessToken` in `localStorage`.
3. If an API request fails with a `401 Unauthorized` error (token expired), our Axios interceptor catches it, pauses the request, calls `/auth/refresh` to get a new `accessToken` using the cookie, saves it, and silently retries the original request. The user never notices!

### 🖼️ How Images Are Handled
Images are sourced from two places:
1. **Local Assets**: Small icons or placeholder images stored in `src/images/`.
2. **Cloud/Database Links**: The MongoDB database stores URL strings for product images (often hosted on external services like Cloudinary). The `<img src={product.image} />` tag simply renders these remote URLs.

### 🌍 Environment Variables
We use `.env` files in the client root to store variables that might change depending on where the app is hosted. Vite requires env variables to be prefixed with `VITE_` (e.g., `VITE_API_URL`).

### 🔌 Connecting Frontend to Backend
The frontend connects to the backend specifically through the `api.js` Axios instance. During development, Vite's proxy configurations (or standard CORS defined in the backend) allow the React app (running on port 5173) to talk to the Node server (running on port 5000).

---

## 2️⃣ SERVER (Backend) - Node.js & Express & MongoDB

The `server` folder is the brain of the application. It receives requests from the frontend, securely validates them, interacts with the MongoDB database, and sends processed JSON data back.

### 📂 Folder Structure Overview

```text
server/
├── config/       # Configuration files (Database connection)
├── controllers/  # Core logic handlers for each route
├── middleware/   # Functions that intercept requests (Auth verification, Error handling)
├── models/       # Mongoose schemas (Structure of our Database tables)
├── routes/       # Mapping of URL endpoints to controller functions
├── utils/        # Helper functions (Token generation, Email sending)
├── .env          # Secrets (Database passwords, JWT secrets)
└── server.js     # The main Express application wrapper and entry point
```

### 🧠 Purpose of Each Folder
- **`routes/`**: Think of this as the traffic cop. It sees an incoming request and decides which controller function should handle it based on the URL.
- **`controllers/`**: These contain the actual brain's logic. If a route says "Get all products", the controller goes to the database, fetches them, handles any errors, and packages the JSON response.
- **`models/`**: Defines what our data looks like. It dictates that every Product must have a `name` (String), `price` (Number), and `category`.
- **`middleware/`**: Functions that run *in the middle* of a request. For example, before allowing someone to delete a product, an Auth Middleware will run to check if they are logged in and if they are an admin.

### 📄 Important Files Explained One by One

- **`server.js`**: The absolute core of the backend. It brings everything together. It initializes Express, sets up security (Helmet, CORS, Rate Limiters), defines the base URLs for routes (e.g., `/api/products`), and starts the server listening on a port.
- **`config/db.js`**: Contains the code that connects our application to the MongoDB cloud database using the `mongoose` library.
- **`middleware/auth.js`**: Contains the `protect` function. It looks at the incoming memory token, verifies it, extracts the User ID, fetches the user from the database, and attaches it to the `req` object so downstream functions know exactly who is making the request.
- **`models/Product.js`**: The blueprint for a product. Defines required fields, data types, and default values.
- **`controllers/authController.js`**: Contains functions for `login`, `register`, `refreshToken`, and `forgotPassword`.

### 🚀 How the Express Server Starts
When you run `npm start`, Node executes `server.js`.
1. It loads environment variables (`dotenv`).
2. It connects to MongoDB (`connectDB()`).
3. It sets up middlewares for security and JSON parsing.
4. It hooks up all the route files.
5. It runs `app.listen(PORT)` to start accepting internet traffic.

### 🗄️ How MongoDB Connection & Models Work
We use **Mongoose**, an Object Data Modeling (ODM) library.
Instead of writing complex raw database queries, Mongoose lets us interact with the database using JavaScript objects. 
We define a "Schema" in the `models/` folder. When we want to insert data, we just do `const newProduct = await Product.create({ name: 'Shampoo' })`. Mongoose ensures the data matches the schema and saves it to MongoDB.

### 🛣️ How Routes are Defined & Controllers Handle Logic
In `routes/productRoutes.js`, you'll see:
```javascript
router.get('/', getProducts);
```
When a GET request hits `/api/products/`, the router hands it off to the `getProducts` function found in `controllers/productController.js`.
The controller then uses Mongoose to find data (`await Product.find()`) and sends it back to the client (`res.json(products)`). We wrap controllers in `express-async-handler` so we don't have to write messy `try/catch` blocks for every database call.

### 🛡️ Middleware Explained
Middleware intercepts requests.
- **`protect` (Auth)**: Checks if the user provided a valid JWT. If not, it rejects the request before it even reaches the controller.
- **`isAdmin` (Role)**: Runs after `protect`. It checks if the identified user has `role === 'admin'`. If not, it blocks them.
- **`errorHandler`**: Found in `server.js` at the very bottom. If any controller throws an error, Express hands it to this middleware to format a nice, predictable JSON error message for the frontend instead of crashing the server.

### 💽 Data Operations (CRUD)
- **Create**: `Model.create(req.body)`
- **Read**: `Model.find()` or `Model.findById(req.params.id)`
- **Update**: `Model.findByIdAndUpdate(id, data)`
- **Delete**: `Model.findByIdAndDelete(id)`

### 🛂 CORS (Cross-Origin Resource Sharing)
Since the React frontend runs on port 5173 and the Express backend runs on 5000, browsers natively block communication between them for security. We configure the `cors` middleware in `server.js` to explicitly tell the browser: *"It's okay, allow the frontend at port 5173 to talk to me, and allow it to send cookies."*

### 🔑 JWT Authentication Process
1. User logs in.
2. Server verifies password.
3. Server generates a **JSON Web Token (JWT)**. This is a scrambled string that securely encodes the user's ID. 
4. Server signs this token using a secret `.env` key so it cannot be tampered with.
5. When the user makes future requests, they send this token back. The server verifies the signature, decodes the User ID, and knows exactly who to serve.

---

## 3️⃣ FULL REQUEST FLOW (Step-by-Step Examples)

Let's demystify exactly what happens when a user performs common actions.

### 🖱️ Scenario 1: User Clicks a Product to View Details

1. **Browser**: User clicks a product card (e.g., ID `12345`).
2. **React Router**: `App.jsx` sees the URL change to `/products/12345` and renders the `<ProductDetailPage />` component.
3. **React `useEffect`**: As the page loads, React triggers a fetch function.
4. **Axios**: The frontend calls `api.get('/products/12345')`.
5. **Express Route**: The backend receives it at `/api/products/:id`. `productRoutes.js` passes it to the `getProduct` controller.
6. **Controller & Mongoose**: The `getProduct` function runs `await Product.findById("12345")`.
7. **MongoDB**: The database searches for the ID and returns the document representing that specific Shampoo.
8. **Controller Response**: The controller packages it and sends `res.json({ success: true, product })`.
9. **React State**: The Axios call finishes, and React saves the `product` data into local state.
10. **UI Update**: React immediately updates the HTML visually, showing the image, title, and price to the user constraint!

### 🛒 Scenario 2: User Adds an Item to the Cart

1. **Browser**: User clicks "Add to Cart".
2. **React Context**: The `addToCart` function from `CartContext` is triggered.
3. **Axios (Interceptor)**: `api.post('/cart', { productId })` is called. The interceptor silently attaches the user's JWT `accessToken` to the header.
4. **Express Route**: The backend receives a POST request to `/api/cart`.
5. **Middleware**: Before it hits the controller, the `protect` middleware runs. It grabs the JWT, decodes it to prove the user is logged in, and attaches the user's details to the `req` object (`req.user = user`).
6. **Controller**: The `addToCart` controller is executed. It looks up the user's cart in the database, checks if the product is already there (increases quantity) or pushes the new product into the cart array.
7. **Mongoose**: Saves the updated cart to MongoDB.
8. **Controller Response**: Sends back a success message.
9. **React Context**: The context sees the success, triggers an immediate re-fetch of the cart data using `api.get('/cart')` to ensure perfectly accurate sync.
10. **UI Update**: The cart icon in the Navbar dynamically updates the little number badge from `0` to `1`.

---

## 4️⃣ OVERALL ARCHITECTURE LOGIC

How everything is interconnected:

- **Separation of Concerns**: The Frontend (Client) knows absolutely *nothing* about databases, SQL, or local disk management. It only knows how to paint pretty pictures on the screen and make HTTP phone calls. The Backend (Server) knows *nothing* about HTML, CSS, or buttons. It only knows how to process raw logic and database reads/writes. 
- **The Bridge**: **Axios** on the frontend and **Routes/CORS** on the backend act as the bridge over which data flows in the form of **JSON** (JavaScript Object Notation). 
- **Technology Roles**:
  - **MongoDB**: The hard drive (Long-term data storage).
  - **Express.js**: The traffic controller (Routing paths to specific logic).
  - **React.js**: The painter (Rendering UI and managing user clicks).
  - **Node.js**: The engine (Running the backend JavaScript code on the server instead of the browser).

If someone changes database fields in a Model, the Controller needs to be updated to handle it, the Route stays the same, Axios sends/requests the new fields, and React changes its UI to show the new fields. **Data always flows from DB -> Model -> Controller -> Axios -> Context -> Component.**

---
### 🎉 Welcome to Vertex!
With this guide, you now understand the complete anatomy of the Vertex MERN application. You know where routing happens, how security intercepts bad actors, how global state powers the UI, and exactly how data travels on its journey from a local database file all the way to a user's screen.
