"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "@/lib/validations";
import {
  CreditCard,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Shield,
  Printer,
} from "lucide-react";

const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
];

export default function PaymentForm({
  bookingData,
  onPaymentSuccess,
  onBack,
  isProcessing = false,
}) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
  });

  const watchedValues = watch();

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const getCardType = (number) => {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(number)) {
        return type;
      }
    }
    return null;
  };

  const cardType = getCardType(watchedValues.cardNumber || "");

  // Print booking invoice function
  const handlePrintBooking = () => {
    const printWindow = window.open("", "_blank");
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Booking Confirmation - Tang Mow</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #C63527; padding-bottom: 20px; margin-bottom: 30px; }
          .hotel-name { color: #C63527; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .booking-ref { background: #C63527; color: white; padding: 10px; border-radius: 8px; display: inline-block; font-weight: bold; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; font-weight: bold; color: #C63527; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
          .info-label { font-weight: 600; color: #666; }
          .info-value { font-weight: 500; color: #333; }
          .total-box { background: #FFE4E1; border: 2px solid #C63527; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #C63527; }
          .payment-info { background: #FFE4E1; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .payment-info h4 { color: #8B1538; margin-bottom: 10px; }
          .payment-info ul { margin: 10px 0; padding-left: 20px; }
          .payment-info li { margin: 5px 0; color: #8B1538; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hotel-name">Tang Mow</div>
          <p>Luxury Accommodation & Fine Dining</p>
          <div class="booking-ref">Booking Reference: ${
            bookingData.bookingReference || "N/A"
          }</div>
        </div>

        <div class="section">
          <div class="section-title">Guest Information</div>
          <div class="info-row">
            <span class="info-label">Guest Name:</span>
            <span class="info-value">${bookingData.guestName || "N/A"}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${bookingData.guestEmail || "N/A"}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value">${bookingData.guestPhone || "N/A"}</span>
          </div>
          ${
            bookingData.additionalGuests &&
            bookingData.additionalGuests.length > 0
              ? `
          <div class="info-row" style="border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px;">
            <span class="info-label">Additional Guests:</span>
            <span class="info-value">
              ${bookingData.additionalGuests
                .map(
                  (guest, index) =>
                    `${guest.name}${guest.age ? ` (Age: ${guest.age})` : ""}`
                )
                .join("<br>")}
            </span>
          </div>
          `
              : ""
          }
        </div>

        <div class="section">
          <div class="section-title">Booking Details</div>
          <div class="info-row">
            <span class="info-label">Room Type:</span>
            <span class="info-value">${bookingData.roomType || "N/A"}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Check-in Date:</span>
            <span class="info-value">${new Date(
              bookingData.checkInDate
            ).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Check-out Date:</span>
            <span class="info-value">${new Date(
              bookingData.checkOutDate
            ).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Number of Guests:</span>
            <span class="info-value">${
              bookingData.numberOfGuests || "N/A"
            }</span>
          </div>
          ${
            bookingData.specialRequests
              ? `
          <div class="info-row">
            <span class="info-label">Special Requests:</span>
            <span class="info-value">${bookingData.specialRequests}</span>
          </div>
          `
              : ""
          }
        </div>

        <div class="section">
          <div class="section-title">Pricing Summary</div>
          <div class="info-row">
            <span class="info-label">Subtotal:</span>
            <span class="info-value">$${
              bookingData.subtotal?.toFixed(2) || "0.00"
            }</span>
          </div>
          <div class="info-row">
            <span class="info-label">Taxes & Fees (12%):</span>
            <span class="info-value">$${
              bookingData.taxes?.toFixed(2) || "0.00"
            }</span>
          </div>
          <div class="total-box">
            <div class="total-row">
              <span>Total Booking Cost:</span>
              <span>$${bookingData.totalAmount?.toFixed(2) || "0.00"}</span>
            </div>
          </div>
        </div>

        <div class="payment-info">
          <h4>Payment Instructions - Pay at Hotel Counter</h4>
          <ul>
            <li>Present this confirmation at the hotel reception during check-in</li>
            <li>Pay the deposit amount of $${
              bookingData.paymentRequired?.toFixed(2) || "0.00"
            } (${bookingData.pricing?.depositPercentage || 50}% of total)</li>
            <li>Remaining balance of $${
              bookingData.pricing?.remainingAmount?.toFixed(2) || "0.00"
            } due at check-in</li>
            <li>Accepted payment methods: Cash, Credit Card, Debit Card</li>
            <li>Booking will be confirmed upon payment at the counter</li>
          </ul>
        </div>

        <div class="footer">
          <p>Thank you for choosing Tang Mow. We look forward to your stay!</p>
          <p>Hotel Address: 123 Luxury Avenue, City, State 12345 | Phone: (555) 123-4567</p>
          <p>Generated on: ${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handlePaymentSubmit = async (data) => {
    setIsProcessingPayment(true);

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let paymentResult;

      if (paymentMethod === "card") {
        // Process card payment
        paymentResult = {
          success: true,
          transactionId:
            "TXN" +
            Date.now() +
            Math.random().toString(36).substr(2, 5).toUpperCase(),
          amount:
            bookingData.paymentRequired || bookingData.pricing?.depositRequired,
          method: "Credit Card",
          last4: data.cardNumber?.slice(-4) || "****",
          status: "paid",
        };
      } else if (paymentMethod === "counter") {
        // Counter payment - booking confirmed but payment pending
        paymentResult = {
          success: true,
          transactionId:
            "CNT" +
            Date.now() +
            Math.random().toString(36).substr(2, 5).toUpperCase(),
          amount:
            bookingData.paymentRequired || bookingData.pricing?.depositRequired,
          method: "Counter Payment",
          status: "pending_counter",
          note: "Please pay at hotel counter during check-in",
        };
      } else if (paymentMethod === "receipt") {
        // Receipt upload - booking confirmed but payment pending verification
        paymentResult = {
          success: true,
          transactionId:
            "RCT" +
            Date.now() +
            Math.random().toString(36).substr(2, 5).toUpperCase(),
          amount:
            bookingData.paymentRequired || bookingData.pricing?.depositRequired,
          method: "Bank Transfer",
          status: "pending_verification",
          note: "Payment receipt uploaded. Awaiting verification (24-48 hours)",
        };
      }

      onPaymentSuccess && onPaymentSuccess(paymentResult);
    } catch (error) {
      console.error("Payment failed:", error);
      // Handle payment error
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isProcessingPayment) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Processing Payment
          </h2>
          <p className="text-gray-600 mb-6">
            Please wait while we securely process your payment. This may take a
            few moments.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
            <Shield className="h-4 w-4" />
            <span>256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Secure Payment</h1>
            <p className="text-orange-100">
              Complete your booking with secure payment
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="h-6 w-6" />
            <span className="text-sm">SSL Secured</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(handlePaymentSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payment Information
                </h2>
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {/* Online Payment */}
                  <div
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <div>
                          <span className="font-medium text-gray-900 block">
                            Online Payment (Credit/Debit Card)
                          </span>
                          <span className="text-sm text-gray-700">
                            Pay {bookingData?.pricing?.depositPercentage || 50}%
                            deposit now
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-5 w-8 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                          VISA
                        </div>
                        <div className="h-5 w-8 bg-red-600 rounded text-white text-xs flex items-center justify-center">
                          MC
                        </div>
                        <div className="h-5 w-8 bg-green-600 rounded text-white text-xs flex items-center justify-center">
                          AMEX
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Over-the-Counter Payment */}
                  <div
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "counter"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("counter")}
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-600" />
                      <div>
                        <span className="font-medium text-gray-900 block">
                          Pay at Hotel Counter
                        </span>
                        <span className="text-sm text-gray-700">
                          Pay {bookingData?.pricing?.depositPercentage || 50}%
                          deposit at check-in
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Transfer/Receipt Upload */}
                  <div
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "receipt"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("receipt")}
                  >
                    <div className="flex items-center space-x-3">
                      <Lock className="h-5 w-5 text-gray-600" />
                      <div>
                        <span className="font-medium text-gray-900 block">
                          Bank Transfer + Receipt Upload
                        </span>
                        <span className="text-sm text-gray-700">
                          Transfer{" "}
                          {bookingData?.pricing?.depositPercentage || 50}%
                          deposit and upload receipt
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Information - Only show for card payment */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        {...register("cardNumber")}
                        maxLength={19}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent pl-12 text-gray-900"
                        placeholder="1234 5678 9012 3456"
                        onChange={(e) => {
                          e.target.value = formatCardNumber(e.target.value);
                        }}
                      />
                      <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      {cardType && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <span className="text-xs font-medium text-gray-700 uppercase">
                            {cardType}
                          </span>
                        </div>
                      )}
                    </div>
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.cardNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Month *
                      </label>
                      <select
                        {...register("expiryMonth")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option
                            key={i + 1}
                            value={String(i + 1).padStart(2, "0")}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                      {errors.expiryMonth && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.expiryMonth.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year *
                      </label>
                      <select
                        {...register("expiryYear")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                      >
                        <option value="">YYYY</option>
                        {Array.from({ length: 20 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                      {errors.expiryYear && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.expiryYear.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        {...register("cvv")}
                        maxLength={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                        placeholder="123"
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.cvv.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      {...register("cardHolderName")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                      placeholder="Name as it appears on card"
                    />
                    {errors.cardHolderName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.cardHolderName.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Over-the-Counter Payment Info */}
              {paymentMethod === "counter" && (
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    Pay at Hotel Counter
                  </h3>
                  <div className="space-y-3 text-blue-800 mb-6">
                    <p>
                      • Present this booking confirmation at the hotel reception
                    </p>
                    <p>
                      • Pay the deposit amount of $
                      {bookingData.paymentRequired?.toFixed(2) || "0.00"} at
                      check-in
                    </p>
                    <p>
                      • Accepted payment methods: Cash, Credit Card, Debit Card
                    </p>
                    <p>
                      • Booking will be confirmed upon payment at the counter
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Confirm Booking Button */}
                    <button
                      type="button"
                      onClick={() => handlePaymentSubmit({})}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>Confirm Booking (Pay at Counter)</span>
                    </button>

                    {/* Print Button */}
                    <button
                      type="button"
                      onClick={handlePrintBooking}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Printer className="h-5 w-5" />
                      <span>Print Booking Confirmation</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Receipt Upload Payment Info */}
              {paymentMethod === "receipt" && (
                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">
                    Bank Transfer + Receipt Upload
                  </h3>
                  <div className="space-y-4">
                    <div className="text-green-800 space-y-2">
                      <p>
                        <strong>Bank Transfer Details:</strong>
                      </p>
                      <p>• Account Name: Tang Mow Ltd.</p>
                      <p>• Account Number: 1234-5678-9012</p>
                      <p>• Bank: Central Bank</p>
                      <p>
                        • Amount: $
                        {bookingData.paymentRequired?.toFixed(2) || "0.00"}
                      </p>
                      <p>• Reference: {bookingData.bookingReference}</p>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Payment Receipt *
                      </label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                      />
                      <p className="mt-1 text-sm text-gray-700">
                        Accepted formats: JPG, PNG, PDF (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Address - Only show for card payment */}
              {paymentMethod === "card" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Billing Address
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        {...register("billingAddress.street")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                        placeholder="123 Main Street"
                      />
                      {errors.billingAddress?.street && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.billingAddress.street.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          {...register("billingAddress.city")}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                          placeholder="New York"
                        />
                        {errors.billingAddress?.city && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.billingAddress.city.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          {...register("billingAddress.state")}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                          placeholder="NY"
                        />
                        {errors.billingAddress?.state && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.billingAddress.state.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          {...register("billingAddress.zipCode")}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                          placeholder="10001"
                        />
                        {errors.billingAddress?.zipCode && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.billingAddress.zipCode.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <select
                          {...register("billingAddress.country")}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                        {errors.billingAddress?.country && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.billingAddress.country.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-xl p-6 h-fit">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Summary
              </h3>

              {bookingData && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room:</span>
                    <span className="font-medium text-gray-900">
                      {bookingData.roomType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dates:</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {new Date(bookingData.checkInDate).toLocaleDateString()} -{" "}
                      {new Date(bookingData.checkOutDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium text-gray-900">
                      {bookingData.numberOfGuests}
                    </span>
                  </div>

                  <hr className="my-4" />

                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      ${bookingData.subtotal?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees:</span>
                    <span className="font-medium text-gray-900">
                      ${bookingData.taxes?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                    <span>Total Booking Cost:</span>
                    <span>
                      ${bookingData.totalAmount?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  <hr className="my-4" />

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-medium">
                        Deposit Required (
                        {bookingData.pricing?.depositPercentage || 50}%):
                      </span>
                      <span className="text-orange-700 font-bold text-xl">
                        $
                        {bookingData.paymentRequired?.toFixed(2) ||
                          bookingData.pricing?.depositRequired?.toFixed(2) ||
                          "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-orange-600 mt-2">
                      <span>Remaining Balance:</span>
                      <span>
                        $
                        {bookingData.pricing?.remainingAmount?.toFixed(2) ||
                          "0.00"}{" "}
                        (due at check-in)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-800">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Secure Payment</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Your payment information is encrypted and secure. We never
                  store your card details.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Booking</span>
            </button>

            {/* Only show Complete Payment button when NOT paying at counter */}
            {paymentMethod !== "counter" && (
              <button
                type="submit"
                disabled={isProcessing}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="h-5 w-5" />
                <span>Complete Payment</span>
              </button>
            )}

            {/* For counter payment, show booking completion message */}
            {paymentMethod === "counter" && (
              <div className="flex items-center space-x-2 px-8 py-3 bg-green-100 text-green-800 font-semibold rounded-xl">
                <CheckCircle className="h-5 w-5" />
                <span>Booking Ready - Print Confirmation Above</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
