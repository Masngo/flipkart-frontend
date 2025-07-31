import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

// --- Contexts ---

// AuthContext: Manages user authentication state
const AuthContext = createContext();

// CartContext: Manages shopping cart state
const CartContext = createContext();

// --- Auth Provider Component ---
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Effect to load user and token from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    if (storedToken && storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setAuthToken(storedToken);
    }
  }, []);

  // Function to handle user signup
  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Signup failed.' };
      }
    } catch (error) {
      console.error('Signup API error:', error);
      return { success: false, message: 'Network error or server unavailable.' };
    }
  };

  // Function to handle user login
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setCurrentUser(data.user);
        setAuthToken(data.token);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Login failed.' };
      }
    } catch (error) {
      console.error('Login API error:', error);
      return { success: false, message: 'Network error or server unavailable.' };
    }
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, authToken, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Cart Provider Component ---
const CartProvider = ({ children }) => {
  const { currentUser, authToken } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Function to fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!currentUser || !authToken) {
      setCartItems([]);
      return;
    }
    setCartLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      } else {
        console.error('Failed to fetch cart:', response.statusText);
        setCartItems([]);
      }
    } catch (error) {
      console.error('Fetch cart API error:', error);
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, [currentUser, authToken]);

  // Effect to fetch cart when user or token changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Function to add an item to the cart
  const addToCart = async (product) => {
    if (!currentUser || !authToken) {
      alert('Please sign in to add items to your cart.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          productId: product.id, // Backend expects productId
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1, // Always add 1 when clicking 'Add to Cart'
        }),
      });
      if (response.ok) {
        // After successful add, re-fetch the updated cart
        fetchCart();
        alert(`${product.name} added to cart!`);
      } else {
        const errorData = await response.json();
        alert(`Failed to add to cart: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Add to cart API error:', error);
      alert('Network error or server unavailable.');
    }
  };

  // Function to update the quantity of an item in the cart
  const updateQuantity = async (productId, newQuantity) => {
    if (!currentUser || !authToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (response.ok) {
        fetchCart(); // Re-fetch updated cart
      } else {
        const errorData = await response.json();
        alert(`Failed to update quantity: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Update quantity API error:', error);
      alert('Network error or server unavailable.');
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = async (productId) => {
    if (!currentUser || !authToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        fetchCart(); // Re-fetch updated cart
        alert('Item removed from cart.');
      } else {
        const errorData = await response.json();
        alert(`Failed to remove item: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Remove from cart API error:', error);
      alert('Network error or server unavailable.');
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, cartLoading }}>
      {children}
    </CartContext.Provider>
  );
};

// --- Components ---

// Navbar Component
const Navbar = ({ navigate }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <nav className="bg-blue-600 p-4 shadow-md rounded-b-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold cursor-pointer" onClick={() => navigate('home')}>
          Flipkart <span className="text-yellow-300">Clone</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {/* Cart Icon */}
          <div className="relative cursor-pointer" onClick={() => navigate('cart')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>

          {/* User Info / Sign In Button */}
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">Hello, {currentUser.name}</span>
              <button
                onClick={() => {
                  logout();
                  navigate('home'); // Redirect to home after logout
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('signin')}
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

// Sign Up Page Component
const SignUp = ({ navigate }) => {
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => { // Made async
    e.preventDefault();
    setMessage(''); // Clear previous messages

    // Basic input validation
    if (!name || !email || !password || !confirmPassword) {
      setMessage('All fields are required.');
      setMessageType('error');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setMessageType('error');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }

    const result = await signup(name, email, password); // Await signup
    setMessage(result.message);
    setMessageType(result.success ? 'success' : 'error');

    if (result.success) {
      // Optionally redirect to sign-in page after successful registration
      setTimeout(() => {
        navigate('signin');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign Up</h2>
        {message && (
          <div
            className={`p-3 mb-4 rounded-lg text-center ${
              messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <span
            onClick={() => navigate('signin')}
            className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

// Sign In Page Component
const SignIn = ({ navigate }) => {
  const { login, currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('home');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => { // Made async
    e.preventDefault();
    setMessage(''); // Clear previous messages

    if (!email || !password) {
      setMessage('Email and password are required.');
      setMessageType('error');
      return;
    }

    const result = await login(email, password); // Await login
    setMessage(result.message);
    setMessageType(result.success ? 'success' : 'error');

    if (result.success) {
      // Redirect to home page after successful login
      setTimeout(() => {
        navigate('home');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign In</h2>
        {message && (
          <div
            className={`p-3 mb-4 rounded-lg text-center ${
              messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('signup')}
            className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

// Landing Page (Product List) Component
const ProductList = () => {
  const { addToCart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (response.ok) {
          const data = await response.json();
          // Ensure product IDs are strings if backend returns numbers, to match frontend expectations
          setProducts(data.map(p => ({ ...p, id: p.id.toString() })));
        } else {
          console.error('Failed to fetch products:', response.statusText);
          setProducts([]); // Fallback to empty if fetch fails
        }
      } catch (error) {
        console.error('Fetch products API error:', error);
        setProducts([]); // Fallback to empty on network error
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!currentUser) {
      alert('Please sign in to add items to your cart.');
      return;
    }
    addToCart(product);
  };

  if (loadingProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading products...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.length === 0 ? (
          <div className="lg:col-span-4 text-center text-gray-600 text-xl py-10">
            No products available.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id} // Use product.id from backend, if available, otherwise fallback
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden border border-gray-200 flex flex-col"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover object-center rounded-t-lg"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x300/E0F2F7/000000?text=${product.name.replace(/\s/g, '+')}`; }}
              />
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-blue-700 mb-4">₹{product.price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Cart Page Component
const CartPage = ({ navigate }) => {
  const { cartItems, updateQuantity, removeFromCart, cartLoading } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      alert('Please sign in to view your cart.');
      navigate('signin');
    }
  }, [currentUser, navigate]);

  // Calculate total price
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!currentUser) {
    return null; // Don't render cart content if not logged in
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600 text-xl py-10">
          Your cart is empty. <br />
          <button
            onClick={() => navigate('home')}
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-xl p-6 border border-gray-200">
            {cartItems.map((item) => (
              <div
                key={item.productId} // Use productId as key for cart items
                className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 py-4 last:border-b-0"
              >
                <div className="flex items-center space-x-4 w-full sm:w-auto mb-4 sm:mb-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg shadow"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/E0F2F7/000000?text=${item.name.replace(/\s/g, '+')}`; }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">₹{item.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-l-lg"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                      className="w-16 text-center border-x border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-xl p-6 border border-gray-200 h-fit sticky top-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Price Details</h2>
            <div className="space-y-3 text-lg">
              <div className="flex justify-between">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t-2 border-gray-300 pt-4 mt-4">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg mt-8 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
export default function App() {
  // State to manage current page/view (simulating routing)
  const [currentPage, setCurrentPage] = useState('home');

  // Function to navigate between pages
  const navigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar navigate={navigate} />
          <main className="flex-grow">
            {currentPage === 'home' && <ProductList />}
            {currentPage === 'signin' && <SignIn navigate={navigate} />}
            {currentPage === 'signup' && <SignUp navigate={navigate} />}
            {currentPage === 'cart' && <CartPage navigate={navigate} />}
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
