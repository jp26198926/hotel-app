"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  Clock,
  Users,
  UtensilsCrossed,
  User,
  Phone,
  Mail,
  MapPin,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Toast";

// Menu data
const menuItems = [
  {
    id: "grilled-lobster",
    name: "Grilled Lobster with Herbs",
    price: 350,
    category: "Seafood",
    description:
      "Fresh Atlantic lobster grilled to perfection with aromatic herbs, served with garlic butter and seasonal vegetables.",
    image:
      "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 5,
    reviews: 127,
    cookingTime: "20-25 min",
    badge: "#1 Best Seller",
    badgeColor: "bg-orange-500",
  },
  {
    id: "wagyu-beef",
    name: "Wagyu Beef Tenderloin",
    price: 485,
    category: "Beef",
    description:
      "Premium Japanese Wagyu beef tenderloin with truffle sauce, roasted potatoes, and market vegetables.",
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 5,
    reviews: 98,
    cookingTime: "15-20 min",
    badge: "Chef's Choice",
    badgeColor: "bg-yellow-500",
  },
  {
    id: "seafood-paella",
    name: "Traditional Seafood Paella",
    price: 255,
    category: "Seafood",
    description:
      "Authentic Spanish paella with fresh seafood, saffron rice, and a medley of Mediterranean flavors. Perfect for sharing.",
    image:
      "https://images.unsplash.com/photo-1534080564583-6be75777b70a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 5,
    reviews: 156,
    cookingTime: "25-30 min",
    badge: "Traditional",
    badgeColor: "bg-orange-500",
  },
  {
    id: "tuna-tartare",
    name: "Yellowfin Tuna Tartare",
    price: 165,
    category: "Appetizers",
    description:
      "Fresh yellowfin tuna with avocado, citrus, and microgreens. Served with crispy wonton chips and sesame oil drizzle.",
    image:
      "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 5,
    reviews: 89,
    cookingTime: "10-15 min",
    badge: "Light & Fresh",
    badgeColor: "bg-green-500",
  },
  {
    id: "chocolate-souffle",
    name: "Dark Chocolate Soufflé",
    price: 110,
    category: "Desserts",
    description:
      "Decadent dark chocolate soufflé with vanilla bean ice cream and berry compote. The perfect sweet ending to your meal.",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
    rating: 5,
    reviews: 201,
    cookingTime: "15-20 min",
    badge: "Signature Dessert",
    badgeColor: "bg-pink-500",
  },
  {
    id: "wine-pairing",
    name: "Premium Wine Pairing",
    price: 375,
    category: "Beverages",
    description:
      "Curated selection of three premium wines perfectly paired with your dining experience, guided by our expert sommelier.",
    image:
      "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rating: 5,
    reviews: 74,
    cookingTime: "Available now",
    badge: "Sommelier's Pick",
    badgeColor: "bg-indigo-500",
  },
];

const categories = [
  "All",
  "Seafood",
  "Beef",
  "Appetizers",
  "Desserts",
  "Beverages",
];

function RestaurantOrderPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess, ToastComponent } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    roomNumber: "",
    deliveryType: "room", // "room" or "dine-in"
    specialInstructions: "",
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Handle URL parameters for highlighting specific items
  useEffect(() => {
    const itemId = searchParams.get("item");
    if (itemId) {
      setHighlightedItem(itemId);
      // Auto-scroll to the item after a short delay
      setTimeout(() => {
        const element = document.getElementById(itemId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [searchParams]);

  // Filter menu items by category
  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  // Add item to cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    showSuccess(`${item.name} added to cart!`);
  };

  // Update cart item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Handle customer details form submission
  const handlePlaceOrder = async () => {
    setIsSubmittingOrder(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate order reference
      const orderRef = `TM-${Date.now().toString().slice(-6)}`;

      showSuccess(`Order placed successfully! Reference: ${orderRef}`);

      // Reset form and cart
      setCart([]);
      setCustomerDetails({
        name: "",
        email: "",
        phone: "",
        roomNumber: "",
        deliveryType: "room",
        specialInstructions: "",
      });
      setShowOrderForm(false);
    } catch (error) {
      showError("Failed to place order. Please try again.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Handle customer details input change
  const handleCustomerDetailsChange = (field, value) => {
    setCustomerDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate customer details
  const isCustomerDetailsValid = () => {
    return (
      customerDetails.name.trim() &&
      customerDetails.email.trim() &&
      customerDetails.phone.trim() &&
      (customerDetails.deliveryType === "dine-in" ||
        customerDetails.deliveryType === "pickup" ||
        customerDetails.roomNumber.trim())
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastComponent />

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>

            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                The Grand Restaurant
              </h1>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <UtensilsCrossed className="h-8 w-8 mr-3" />
            <h2 className="text-3xl font-bold">
              Order from The Grand Restaurant
            </h2>
          </div>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Experience our award-winning cuisine from the comfort of your room
            or dining area
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  id={item.id}
                  className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    highlightedItem === item.id
                      ? "ring-4 ring-orange-500 ring-opacity-50 shadow-2xl"
                      : ""
                  }`}
                >
                  <div className="relative h-48">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <div
                        className={`${item.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {item.badge}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <span className="text-xl font-bold text-orange-600">
                        K{item.price}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">
                          ({item.reviews})
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {item.cookingTime}
                      </div>
                    </div>

                    <Button
                      onClick={() => addToCart(item)}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className={`lg:w-80 ${showCart ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Order
              </h3>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Your cart is empty
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {item.name}
                          </h4>
                          <p className="text-orange-600 font-medium">
                            K{item.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-gray-900">
                        Total: K{cartTotal.toFixed(2)}
                      </span>
                    </div>

                    <Button
                      onClick={() => {
                        if (cart.length === 0) {
                          showError("Your cart is empty!");
                          return;
                        }
                        setShowOrderForm(true);
                      }}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    >
                      Place Order
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Customer Details
                </h2>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Customer Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                      Personal Information
                    </h3>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        <User className="h-4 w-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={customerDetails.name}
                        onChange={(e) =>
                          handleCustomerDetailsChange("name", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={customerDetails.email}
                        onChange={(e) =>
                          handleCustomerDetailsChange("email", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customerDetails.phone}
                        onChange={(e) =>
                          handleCustomerDetailsChange("phone", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    {/* Delivery Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        <MapPin className="h-4 w-4 inline mr-2" />
                        Delivery Option *
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="deliveryType"
                            value="room"
                            checked={customerDetails.deliveryType === "room"}
                            onChange={(e) =>
                              handleCustomerDetailsChange(
                                "deliveryType",
                                e.target.value
                              )
                            }
                            className="mr-3 text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-gray-900 font-medium">
                            Room Service Delivery
                          </span>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="deliveryType"
                            value="dine-in"
                            checked={customerDetails.deliveryType === "dine-in"}
                            onChange={(e) =>
                              handleCustomerDetailsChange(
                                "deliveryType",
                                e.target.value
                              )
                            }
                            className="mr-3 text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-gray-900 font-medium">
                            Dine-in at Restaurant
                          </span>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="deliveryType"
                            value="pickup"
                            checked={customerDetails.deliveryType === "pickup"}
                            onChange={(e) =>
                              handleCustomerDetailsChange(
                                "deliveryType",
                                e.target.value
                              )
                            }
                            className="mr-3 text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-gray-900 font-medium">
                            Pick up at Restaurant
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Room Number (conditional) */}
                    {customerDetails.deliveryType === "room" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Room Number *
                        </label>
                        <input
                          type="text"
                          value={customerDetails.roomNumber}
                          onChange={(e) =>
                            handleCustomerDetailsChange(
                              "roomNumber",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                          placeholder="Enter your room number"
                          required
                        />
                      </div>
                    )}

                    {/* Special Instructions */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Special Instructions
                      </label>
                      <textarea
                        value={customerDetails.specialInstructions}
                        onChange={(e) =>
                          handleCustomerDetailsChange(
                            "specialInstructions",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none"
                        rows="4"
                        placeholder="Any special requests or dietary requirements..."
                      />
                    </div>
                  </div>

                  {/* Right Column - Order Summary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                      Order Summary
                    </h3>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                K{item.price} × {item.quantity}
                              </p>
                            </div>
                            <span className="font-semibold text-gray-900">
                              K{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}

                        <div className="border-t pt-4 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-900">
                              Total:
                            </span>
                            <span className="text-xl font-bold text-orange-600">
                              K{cartTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Order Information
                      </h4>
                      <div className="space-y-1 text-sm text-blue-800">
                        <p>• Estimated preparation time: 20-30 minutes</p>
                        <p>
                          •{" "}
                          {customerDetails.deliveryType === "room"
                            ? "Room service delivery included"
                            : customerDetails.deliveryType === "pickup"
                            ? "Please arrive 10 minutes after preparation time for pickup"
                            : "Please arrive 10 minutes before your order is ready"}
                        </p>
                        <p>• Payment can be made upon delivery/pickup</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={!isCustomerDetailsValid() || isSubmittingOrder}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white font-semibold"
                  >
                    {isSubmittingOrder ? "Processing..." : "Confirm Order"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading component for Suspense fallback
function RestaurantLoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading restaurant menu...</p>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function RestaurantOrderPage() {
  return (
    <Suspense fallback={<RestaurantLoadingFallback />}>
      <RestaurantOrderPageContent />
    </Suspense>
  );
}
