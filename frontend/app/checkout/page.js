"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Icons } from "@/components/Icons";
import Link from "next/link";
import Modal from "@/components/ui/Modal";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  // Load saved cards from localStorage
  useEffect(() => {
    const cards = localStorage.getItem('savedCards');
    if (cards) {
      setSavedCards(JSON.parse(cards));
    }
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Shipping Address
    addressLine1: "",
    addressLine2: "",
    city: "",
    emirate: "Dubai",
    country: "UAE",
    zipCode: "",
    
    // Payment Method
    paymentMethod: "cod", // card, cod (cash on delivery)
    
    // Additional
    orderNotes: "",
  });

  // Card form state (separate for modal)
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;
    
    if (type === 'checkbox') {
      setCardData((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substr(0, 5);
    }
    
    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substr(0, 4);
    }
    
    setCardData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Personal Information
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s-]{8,}$/.test(formData.phone)) newErrors.phone = "Phone number is invalid";

    // Shipping Address
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";

    // Payment validation (card validation handled in modal)
    if (formData.paymentMethod === "card" && !selectedCard) {
      newErrors.payment = "Please add a card to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCard = () => {
    const newErrors = {};
    
    if (!cardData.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
    else if (!/^\d{16}$/.test(cardData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }
    if (!cardData.cardName.trim()) newErrors.cardName = "Cardholder name is required";
    if (!cardData.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = "Format should be MM/YY";
    }
    if (!cardData.cvv.trim()) newErrors.cvv = "CVV is required";
    else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }

    return newErrors;
  };

  const handleSaveCard = () => {
    const cardErrors = validateCard();
    if (Object.keys(cardErrors).length > 0) {
      setErrors(cardErrors);
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      cardNumber: cardData.cardNumber,
      cardName: cardData.cardName,
      expiryDate: cardData.expiryDate,
      // Don't save CVV for security
    };

    let updatedCards = [...savedCards, newCard];
    if (cardData.saveCard) {
      setSavedCards(updatedCards);
      localStorage.setItem('savedCards', JSON.stringify(updatedCards));
    }
    
    setSelectedCard(newCard);
    setShowCardModal(false);
    setCardData({
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      saveCard: false,
    });
    setErrors({});
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    handleSaveCard();
  };

  const handleSelectSavedCard = (card) => {
    setSelectedCard(card);
    setShowCardModal(false);
  };

  const handleDeleteCard = (cardId) => {
    const updatedCards = savedCards.filter(card => card.id !== cardId);
    setSavedCards(updatedCards);
    localStorage.setItem('savedCards', JSON.stringify(updatedCards));
    if (selectedCard?.id === cardId) {
      setSelectedCard(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Prepare order data
      const orderData = {
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          emirate: formData.emirate,
          country: formData.country,
          zipCode: formData.zipCode
        },
        items: cart.map(item => {
          const productId = item._id || item.id;
          const itemData = {
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.images?.[0] || item.image
          };
          
          // Only add product ID if it's a valid MongoDB ObjectId (24 hex characters)
          if (productId && typeof productId === 'string' && productId.length === 24) {
            itemData.product = productId;
          }
          
          return itemData;
        }),
        paymentMethod: formData.paymentMethod,
        subtotal,
        tax,
        shipping,
        total,
        orderNotes: formData.orderNotes
      };

      // If card payment, create payment intent first
      if (formData.paymentMethod === 'card') {
        const paymentResponse = await fetch(`${apiUrl}/api/orders/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: total,
            currency: 'aed'
          })
        });

        const paymentData = await paymentResponse.json();
        
        if (paymentData.success) {
          orderData.paymentId = paymentData.data.id;
          orderData.paymentStatus = 'paid';
        } else {
          throw new Error('Payment processing failed');
        }
      }

      // Create order
      const orderResponse = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const orderResult = await orderResponse.json();

      if (orderResult.success) {
        setOrderPlaced(true);
        clearCart();
        
        // Redirect to order confirmation after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        throw new Error(orderResult.message || 'Order creation failed');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.05; // 5% VAT
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + tax + shipping;

  // If cart is empty
  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icons.ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to checkout</p>
          <Link
            href="/"
            className="inline-block bg-[#002579] text-white px-8 py-3 rounded-lg hover:bg-[#001850] transition-colors font-medium"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Order placed success
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-2">Thank you for your order.</p>
          <p className="text-gray-600 mb-6">We'll send you a confirmation email shortly.</p>
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Redirecting to homepage...
          </div>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gray-50 py-4 md:py-6 px-2 md:px-4">
      <div className="max-w-5xl mx-auto">
        {/* Minimal Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-[#002579] mb-1">Checkout</h1>
          <p className="text-xs md:text-sm text-gray-500">Complete your order securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left - Form */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              {/* Personal Information */}
              <div className="bg-white p-4 md:p-5 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <Icons.User className="w-3 h-3 md:w-4 md:h-4 text-[#002579]" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579] transition-all ${
                        errors.firstName ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579] transition-all ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579] ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="john.doe@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579] ${
                        errors.phone ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="+971 50 123 4567"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-4 md:p-5 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <Icons.MapPin className="w-3 h-3 md:w-4 md:h-4 text-[#002579]" />
                  Shipping Address
                </h2>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579] ${
                        errors.addressLine1 ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Street address, P.O. box"
                    />
                    {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579]"
                      placeholder="Apartment, suite, unit"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579] ${
                          errors.city ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="Dubai"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Emirate *
                      </label>
                      <select
                        name="emirate"
                        value={formData.emirate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579]"
                      >
                        <option value="Dubai">Dubai</option>
                        <option value="Abu Dhabi">Abu Dhabi</option>
                        <option value="Sharjah">Sharjah</option>
                        <option value="Ajman">Ajman</option>
                        <option value="Umm Al Quwain">Umm Al Quwain</option>
                        <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                        <option value="Fujairah">Fujairah</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icons.CreditCard className="w-4 h-4 text-[#002579]" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer flex-1 transition-all ${
                      formData.paymentMethod === 'card' ? 'border-[#002579] bg-blue-50' : 'border-gray-200 hover:border-[#002579]'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#002579]"
                      />
                      <Icons.CreditCard className="w-5 h-5 text-[#002579]" />
                      <span className="text-sm font-medium">Credit/Debit Card</span>
                    </label>
                    <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer flex-1 transition-all ${
                      formData.paymentMethod === 'cod' ? 'border-[#002579] bg-blue-50' : 'border-gray-200 hover:border-[#002579]'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#002579]"
                      />
                      <Icons.Truck className="w-5 h-5 text-[#002579]" />
                      <span className="text-sm font-medium">Cash on Delivery</span>
                    </label>
                  </div>

                  {/* Card Payment Button */}
                  {formData.paymentMethod === "card" && (
                    <button
                      type="button"
                      onClick={() => setShowCardModal(true)}
                      className="w-full p-4 border-2 border-dashed border-[#002579] rounded-lg text-[#002579] hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Icons.CreditCard className="w-5 h-5" />
                      {selectedCard ? `Card ending in ${selectedCard.cardNumber.slice(-4)}` : 'Add Card Details'}
                    </button>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white p-4 md:p-5 rounded-lg shadow-sm border border-gray-100">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 text-xs md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579]"
                  placeholder="Any special instructions for delivery"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || (formData.paymentMethod === 'card' && !selectedCard)}
                className="w-full bg-[#002579] text-white py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-[#001845] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Icons.Loader className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Icons.CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                    Place Order - AED {(getCartTotal() + (getCartTotal() * 0.05) + (getCartTotal() > 50 ? 0 : 5.99)).toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 md:p-5 rounded-lg shadow-sm border border-gray-100 lg:sticky lg:top-24">
              <h2 className="text-sm md:text-base font-semibold text-gray-900 mb-3 md:mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-2 md:space-y-3 mb-3 md:mb-4 max-h-48 md:max-h-60 overflow-y-auto">
                {cart.map((item) => {
                  // Handle both image formats: array (backend) or string (homepage)
                  const productImage = item.images && item.images[0] 
                    ? item.images[0] 
                    : item.image 
                    ? item.image 
                    : '/placeholder-product.png';
                  
                  return (
                  <div key={item.id} className="flex gap-2 md:gap-3 text-xs md:text-sm">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={productImage} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate text-xs md:text-sm">{item.name}</h4>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      <p className="font-semibold text-[#002579] text-xs md:text-sm">AED {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  );
                })}
              </div>

              <div className="border-t pt-2 md:pt-3 space-y-1.5 md:space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">AED {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">VAT (5%)</span>
                  <span className="font-medium text-gray-900">AED {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shipping === 0 ? <span className="text-green-600">FREE</span> : `AED ${shipping.toFixed(2)}`}
                  </span>
                </div>
                {subtotal < 50 && (
                  <p className="text-xs text-gray-500 italic">
                    💡 Free shipping on orders over AED 50
                  </p>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#002579]">AED {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Payment Modal */}
      {showCardModal && (
        <Modal isOpen={showCardModal} onClose={() => setShowCardModal(false)} title="Add Card Details">
          <form onSubmit={handleCardSubmit} className="space-y-4">
            {/* Demo Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800 font-medium mb-1">💳 Demo Mode - Test Card</p>
              <p className="text-xs text-blue-600">
                Card: <span className="font-mono font-bold">4242 4242 4242 4242</span><br />
                Expiry: Any future date | CVV: Any 3 digits
              </p>
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Card Number *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={cardData.cardNumber}
                onChange={handleCardInputChange}
                maxLength="19"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579]"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Cardholder Name *
              </label>
              <input
                type="text"
                name="cardName"
                value={cardData.cardName}
                onChange={handleCardInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579]"
                placeholder="JOHN DOE"
                required
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardData.expiryDate}
                  onChange={handleCardInputChange}
                  maxLength="5"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579]"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  CVV *
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={cardData.cvv}
                  onChange={handleCardInputChange}
                  maxLength="4"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002579]"
                  placeholder="123"
                  required
                />
              </div>
            </div>

            {/* Save Card */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="saveCard"
                checked={cardData.saveCard}
                onChange={handleCardInputChange}
                className="w-4 h-4 text-[#002579] rounded"
              />
              <span className="text-xs text-gray-600">Save card for future purchases</span>
            </label>

            {/* Saved Cards */}
            {savedCards.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-xs font-medium text-gray-700 mb-2">Or select a saved card:</p>
                <div className="space-y-2">
                  {savedCards.map((card, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSelectedCard(card);
                        setShowCardModal(false);
                      }}
                      className="w-full p-2 border border-gray-200 rounded-lg hover:border-[#002579] hover:bg-blue-50 transition-all text-left text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Icons.CreditCard className="w-4 h-4 text-[#002579]" />
                        <span className="font-mono">•••• •••• •••• {card.cardNumber.slice(-4)}</span>
                        <span className="text-gray-500">{card.cardName}</span>
                      </div>
                      <span className="text-gray-400">{card.expiryDate}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#002579] text-white rounded-lg hover:bg-[#001845] transition-colors text-sm font-medium"
              >
                Save Card
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
