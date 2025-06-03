import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, X, Plus, Minus, User, Menu } from 'lucide-react';
import './index.css';
const EcommerceProductPage = () => {
  // Product data
  const product = {
    id: 1,
    name: "Premium Cotton T-Shirt",
    brand: "StyleCraft",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.5,
    reviews: 127,
    description: "Experience ultimate comfort with our premium cotton t-shirt. Made from 100% organic cotton, this versatile piece offers exceptional softness and durability.",
    features: ["100% Organic Cotton", "Pre-shrunk Fabric", "Reinforced Seams", "Eco-friendly Dyes"],
    colors: [
      {
        name: "Black",
        code: "#000000",
        image: "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/C90184s.jpg?im=Resize,width=750"
      },
      {
        name: "White",
        code: "#FFFFFF",
        image: "https://i.pinimg.com/564x/c1/1d/16/c11d164de692594acf53c9a855093139.jpg"
      },
      {
        name: "Navy",
        code: "#1E3A8A",
        image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTd8FUpRiyDtZmxvAqAUfQy-zIQYg4Y9m1nK-uePrfFd8JRYT2dYtjYLlCygoxVrRVGv5RkuaCGpMLRDxcg_O42S2OSjISoNrNepi_pE2ZpmbSuWkJTLqM0Xw"
      },
      {
        name: "Gray",
        code: "#6B7280",
        image: "https://magnetclub.in/cdn/shop/files/BEB4F078-3485-4200-834B-3B40653E62BD.jpg?v=1725776693"
      }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  };

  // State management
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [hoveredColor, setHoveredColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    const loginStatus = localStorage.getItem('isLoggedIn');
    
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
    if (loginStatus) {
      setIsLoggedIn(JSON.parse(loginStatus));
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Get current display image
  const getCurrentImage = () => {
    if (hoveredColor) {
      return product.colors.find(c => c.name === hoveredColor)?.image;
    }
    if (selectedColor) {
      return product.colors.find(c => c.name === selectedColor)?.image;
    }
    return product.colors[0].image;
  };

  // Add to cart function
  const addToCart = () => {
    if (!selectedColor || !selectedSize) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    const cartItem = {
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      image: product.colors.find(c => c.name === selectedColor)?.image
    };

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === cartItem.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, cartItem];
    });

    // Reset selections after adding to cart
    setSelectedColor(null);
    setSelectedSize(null);
    setQuantity(1);
  };

  // Remove from cart
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Update cart item quantity
  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Toggle wishlist
  const toggleWishlist = () => {
    const isInWishlist = wishlist.includes(product.id);
    if (isInWishlist) {
      setWishlist(prev => prev.filter(id => id !== product.id));
    } else {
      setWishlist(prev => [...prev, product.id]);
    }
  };

  // Login function
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', JSON.stringify(true));
    // Guest cart persists automatically since we're using the same cartItems state
  };

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', JSON.stringify(false));
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Menu className="h-6 w-6 text-gray-600 mr-4 md:hidden" />
              <h1 className="text-2xl font-bold text-gray-900">StyleCraft</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <button
                  onClick={handleLogin}
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <User className="h-5 w-5 mr-1" />
                  Login
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <User className="h-5 w-5 mr-1" />
                  Logout
                </button>
              )}
              
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative flex items-center text-gray-700 hover:text-gray-900"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={getCurrentImage()}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.colors.map((color) => (
                <div
                  key={color.name}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer border-2 border-transparent hover:border-gray-300"
                >
                  <img
                    src={color.image}
                    alt={`${product.name} in ${color.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </span>
            </div>

            <p className="text-gray-600">{product.description}</p>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Color: {selectedColor && <span className="font-normal">{selectedColor}</span>}
              </h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    onMouseEnter={() => setHoveredColor(color.name)}
                    onMouseLeave={() => setHoveredColor(null)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? 'border-gray-900 scale-110'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  >
                    {color.code === '#FFFFFF' && (
                      <div className="w-full h-full rounded-full border border-gray-200"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Size: {selectedSize && <span className="font-normal">{selectedSize}</span>}
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 border rounded-md text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={addToCart}
                  className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors font-medium"
                >
                  Add to Cart
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`p-3 border rounded-md transition-colors ${
                    wishlist.includes(product.id)
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 text-gray-700 hover:border-gray-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">2 Year Warranty</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-5 w-5 text-orange-600" />
                  <span className="text-sm text-gray-600">30 Day Returns</span>
                </div>
              </div>
              
              <div className="mt-4">
                <ul className="text-sm text-gray-600 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium">Shopping Cart ({cartItemCount})</h2>
              <button onClick={() => setShowCart(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.color} • {item.size}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 border rounded flex items-center justify-center"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 border rounded flex items-center justify-center"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total: ${cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition-colors">
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popup Message */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="bg-white p-6 rounded-lg shadow-xl z-10 max-w-sm mx-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-full">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium">Selection Required</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Please select color and size to add product into cart.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcommerceProductPage;