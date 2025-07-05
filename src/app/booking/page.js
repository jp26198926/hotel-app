"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle, CreditCard, Printer } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import PaymentForm from "@/components/PaymentForm";
import Stepper from "@/components/Stepper";
import TangMowLogo from "@/components/TangMowLogo";
import { useToast } from "@/components/Toast";

function BookingPageContent() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState("booking"); // 'booking', 'payment', 'confirmation'
  const [bookingData, setBookingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [homePageBookingData, setHomePageBookingData] = useState(null);
  const [preselectedRoomType, setPreselectedRoomType] = useState(null);
  const { showError, showSuccess, ToastComponent } = useToast();

  // Define main booking steps
  const mainSteps = [
    {
      title: "Book Your Stay",
      description: "Select dates, room, and guest details",
    },
    {
      title: "Payment",
      description: "Secure payment processing",
    },
    {
      title: "Confirmation",
      description: "Booking confirmed and ready",
    },
  ];

  // Get current step index for stepper
  const getCurrentStepIndex = () => {
    switch (currentStep) {
      case "booking":
        return 0;
      case "payment":
        return 1;
      case "confirmation":
        return 2;
      default:
        return 0;
    }
  };

  // Check for booking data from home page
  useEffect(() => {
    const pendingBooking = sessionStorage.getItem("pendingBooking");
    if (pendingBooking) {
      try {
        const bookingInfo = JSON.parse(pendingBooking);
        setHomePageBookingData(bookingInfo);
        // Clear the session storage after using it
        sessionStorage.removeItem("pendingBooking");
      } catch (error) {
        console.error("Error parsing booking data:", error);
      }
    }
  }, []);

  // Check for preselected room type from URL parameters
  useEffect(() => {
    const roomType = searchParams.get("roomType");
    if (roomType) {
      setPreselectedRoomType(roomType);
    }
  }, [searchParams]);

  const handleBookingSubmit = async (data) => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/guest-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setBookingData({
          ...data,
          ...result.data,
          bookingReference: result.data.bookingReference,
          totalAmount: result.data.paymentRequired,
          subtotal: result.data.booking.pricing.subtotal,
          taxes: result.data.booking.pricing.taxes,
        });
        setCurrentStep("payment");
        showSuccess(
          "Booking created successfully! Please proceed with payment."
        );
      } else {
        showError(
          result.error || "Failed to create booking. Please try again."
        );
      }
    } catch (error) {
      console.error("Booking error:", error);
      showError(
        "Failed to create booking. Please check your connection and try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (payment) => {
    setPaymentData(payment);
    setCurrentStep("confirmation");
    showSuccess("Payment completed successfully! Your booking is confirmed.");
  };

  const handleBackToBooking = () => {
    setCurrentStep("booking");
  };

  // Print booking confirmation function
  const handlePrintConfirmation = () => {
    const printWindow = window.open("", "_blank");
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Booking Confirmation - Tang Mow</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: white;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .header { 
            text-align: center; 
            border-bottom: 3px solid #C63527; 
            padding-bottom: 30px; 
            margin-bottom: 40px; 
          }
          
          .hotel-name { 
            color: #C63527; 
            font-size: 36px; 
            font-weight: bold; 
            margin-bottom: 10px; 
            letter-spacing: 1px;
          }
          
          .hotel-tagline { 
            color: #666; 
            font-size: 16px; 
            margin-bottom: 20px; 
            font-style: italic;
          }
          
          .confirmation-badge { 
            background: linear-gradient(135deg, #C63527, #E85A2B); 
            color: white; 
            padding: 15px 25px; 
            border-radius: 12px; 
            display: inline-block; 
            font-weight: bold; 
            font-size: 18px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          
          .section { 
            margin-bottom: 35px; 
            background: #fafafa;
            border-radius: 12px;
            padding: 25px;
            border: 1px solid #e5e5e5;
          }
          
          .section-title { 
            font-size: 20px; 
            font-weight: bold; 
            color: #C63527; 
            margin-bottom: 20px; 
            border-bottom: 2px solid #E85A2B; 
            padding-bottom: 8px; 
            display: flex;
            align-items: center;
          }
          
          .section-icon {
            width: 24px;
            height: 24px;
            margin-right: 10px;
            fill: #C63527;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
          }
          
          .info-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 12px 0; 
            border-bottom: 1px solid #e5e5e5; 
          }
          
          .info-label { 
            font-weight: 600; 
            color: #555; 
            flex: 1;
          }
          
          .info-value { 
            font-weight: 700; 
            color: #222; 
            flex: 1;
            text-align: right;
          }
          
          .total-section {
            background: linear-gradient(135deg, #FFE4E1, #F4A460);
            border: 2px solid #C63527;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
          }
          
          .total-row { 
            display: flex; 
            justify-content: space-between; 
            font-size: 20px; 
            font-weight: bold; 
            color: #C63527; 
            margin-bottom: 10px;
          }
          
          .payment-status {
            background: #dcfce7;
            border: 2px solid #16a34a;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
          }
          
          .payment-status h4 {
            color: #16a34a;
            font-size: 18px;
            margin-bottom: 10px;
          }
          
          .payment-status p {
            color: #166534;
            font-size: 14px;
          }
          
          .footer { 
            text-align: center; 
            margin-top: 50px; 
            padding-top: 30px; 
            border-top: 2px solid #e5e5e5; 
            color: #666; 
            font-size: 14px; 
          }
          
          .contact-info {
            background: #f1f5f9;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
          }
          
          .thank-you {
            color: #C63527;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 10px;
          }
          
          @media print { 
            body { padding: 20px; }
            .no-print { display: none; }
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hotel-name">Tang Mow</div>
          <div class="hotel-tagline">Luxury Accommodation & Fine Dining</div>
          <div class="confirmation-badge">✓ BOOKING CONFIRMED</div>
        </div>

        <div class="section">
          <div class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Booking Reference
          </div>
          <div style="text-align: center; font-size: 24px; font-weight: bold; color: #f97316; font-family: monospace; letter-spacing: 2px; background: white; padding: 15px; border-radius: 8px; border: 2px dashed #f97316;">
            ${bookingData.bookingReference || "N/A"}
          </div>
        </div>

        <div class="section">
          <div class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Guest Information
          </div>
          <div class="info-row">
            <span class="info-label">Guest Name:</span>
            <span class="info-value">${bookingData.guestName || "N/A"}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email Address:</span>
            <span class="info-value">${bookingData.guestEmail || "N/A"}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone Number:</span>
            <span class="info-value">${bookingData.guestPhone || "N/A"}</span>
          </div>
          ${
            bookingData.additionalGuests &&
            bookingData.additionalGuests.length > 0
              ? `
          <div class="info-row" style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px;">
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
          <div class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            Accommodation Details
          </div>
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
          <div class="info-row">
            <span class="info-label">Duration:</span>
            <span class="info-value">${Math.ceil(
              (new Date(bookingData.checkOutDate) -
                new Date(bookingData.checkInDate)) /
                (1000 * 60 * 60 * 24)
            )} nights</span>
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
          <div class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Payment Summary
          </div>
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
          <div class="total-section">
            <div class="total-row">
              <span>Total Amount:</span>
              <span>$${bookingData.totalAmount?.toFixed(2) || "0.00"}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
            Payment Information
          </div>
          <div class="info-row">
            <span class="info-label">Transaction ID:</span>
            <span class="info-value" style="font-family: monospace;">${
              paymentData.transactionId
            }</span>
          </div>
          <div class="info-row">
            <span class="info-label">Payment Method:</span>
            <span class="info-value">${
              paymentData.method === "Credit Card"
                ? `Credit Card ending in ${paymentData.last4}`
                : paymentData.method
            }</span>
          </div>
          <div class="info-row">
            <span class="info-label">Amount Paid:</span>
            <span class="info-value">$${paymentData.amount?.toFixed(2)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Payment Status:</span>
            <span class="info-value" style="color: #16a34a;">✓ CONFIRMED</span>
          </div>
        </div>

        <div class="payment-status">
          <h4>🎉 Payment Successfully Processed</h4>
          <p>Your booking is confirmed and you will receive a confirmation email shortly.</p>
        </div>

        <div class="footer">
          <div class="thank-you">Thank you for choosing Tang Mow!</div>
          <div class="contact-info">
            <strong>Tang Mow</strong><br>
            123 Luxury Avenue, City, State 12345<br>
            Phone: (555) 123-4567 | Email: reservations@grandhotel.com<br>
            Website: www.grandhotel.com
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            Generated on: ${new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Small delay to ensure content is loaded before printing
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link
              href="/"
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium text-sm sm:text-base">
                Back to Home
              </span>
            </Link>
            <TangMowLogo
              variant="compact"
              showText={true}
              textClassName="text-lg sm:text-2xl font-bold gradient-text hidden sm:block"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {currentStep === "booking" && "Book Your Stay"}
              {currentStep === "payment" && "Complete Payment"}
              {currentStep === "confirmation" && "Booking Confirmed!"}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {currentStep === "booking" &&
                "Find and reserve the perfect room for your stay"}
              {currentStep === "payment" &&
                "Secure payment to confirm your reservation"}
              {currentStep === "confirmation" &&
                "Your reservation has been successfully confirmed"}
            </p>
          </div>

          {/* Main Progress Stepper */}
          <div className="mb-8 sm:mb-12">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-orange-100">
              <Stepper
                steps={mainSteps}
                currentStep={getCurrentStepIndex()}
                className="max-w-2xl mx-auto"
              />
            </div>
          </div>

          {/* Booking Form */}
          {currentStep === "booking" && (
            <BookingForm
              onSubmit={handleBookingSubmit}
              isLoading={isProcessing}
              initialData={homePageBookingData}
              preselectedRoomType={preselectedRoomType}
            />
          )}

          {/* Payment Form */}
          {currentStep === "payment" && bookingData && (
            <PaymentForm
              bookingData={bookingData}
              onPaymentSuccess={handlePaymentSuccess}
              onBack={handleBackToBooking}
              isProcessing={isProcessing}
            />
          )}

          {/* Confirmation */}
          {currentStep === "confirmation" && bookingData && paymentData && (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 text-center animate-scale-in">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4 sm:mb-6">
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Booking Confirmed!
              </h2>

              <p className="text-base sm:text-lg text-gray-800 mb-6 sm:mb-8 px-2">
                Thank you for choosing Tang Mow. Your reservation has been
                confirmed and a confirmation email has been sent to{" "}
                <span className="font-semibold text-gray-900 break-all">
                  {bookingData.guestEmail}
                </span>
                .
              </p>

              {/* Booking Details */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-left shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-3 sm:mb-4 text-center sm:text-left border-b border-gray-200 pb-2">
                  Booking Details
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-700 text-sm sm:text-base font-medium">
                      Booking Reference:
                    </span>
                    <span className="font-mono font-bold text-sm sm:text-base break-all text-gray-900">
                      {bookingData.bookingReference}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-700 text-sm sm:text-base font-medium">
                      Guest:
                    </span>
                    <span className="font-semibold text-sm sm:text-base text-gray-900">
                      {bookingData.guestName}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-700 text-sm sm:text-base font-medium">
                      Check-in:
                    </span>
                    <span className="font-semibold text-sm sm:text-base text-gray-900">
                      {new Date(bookingData.checkInDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-700 text-sm sm:text-base font-medium">
                      Check-out:
                    </span>
                    <span className="font-semibold text-sm sm:text-base text-gray-900">
                      {new Date(bookingData.checkOutDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-700 text-sm sm:text-base font-medium">
                      Room:
                    </span>
                    <span className="font-semibold text-sm sm:text-base text-gray-900">
                      {bookingData.roomType}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-700 text-sm sm:text-base font-medium">
                      Guests:
                    </span>
                    <span className="font-semibold text-sm sm:text-base text-gray-900">
                      {bookingData.numberOfGuests}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 pt-2 border-t">
                    <span className="text-gray-700 text-sm sm:text-base font-medium">
                      Total Paid:
                    </span>
                    <span className="font-bold text-green-600 text-base sm:text-lg">
                      ${bookingData.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-left shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-3 sm:mb-4 text-center sm:text-left border-b border-gray-200 pb-2">
                  Payment Information
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-700 text-sm sm:text-base font-medium">
                      Transaction ID:
                    </span>
                    <span className="font-mono text-xs sm:text-sm break-all text-gray-900">
                      {paymentData.transactionId}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-700 text-sm sm:text-base font-medium">
                      Payment Method:
                    </span>
                    <span className="font-semibold text-sm sm:text-base text-gray-900">
                      {paymentData.method === "Credit Card"
                        ? `Credit Card ending in ${paymentData.last4}`
                        : paymentData.method}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-700 text-sm sm:text-base font-medium">
                      Amount:
                    </span>
                    <span className="font-semibold text-sm sm:text-base text-gray-900">
                      ${paymentData.amount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 text-center text-sm sm:text-base"
                >
                  Return to Home
                </Link>
                <button
                  onClick={handlePrintConfirmation}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base flex items-center justify-center space-x-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Confirmation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastComponent />
    </div>
  );
}

// Loading component for Suspense fallback
function BookingLoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading booking page...</p>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function BookingPage() {
  return (
    <Suspense fallback={<BookingLoadingFallback />}>
      <BookingPageContent />
    </Suspense>
  );
}
