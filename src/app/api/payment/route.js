import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { paymentSchema } from "@/lib/validations";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { bookingReference, paymentData } = body;

    if (!bookingReference) {
      return NextResponse.json(
        { success: false, error: "Booking reference is required" },
        { status: 400 }
      );
    }

    // Validate payment data
    const validatedPayment = paymentSchema.parse(paymentData);

    // Find the booking
    const booking = await Booking.findOne({
      bookingId: bookingReference,
    }).populate("room", "roomNumber type");

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.paymentStatus === "paid") {
      return NextResponse.json(
        { success: false, error: "Booking is already paid" },
        { status: 400 }
      );
    }

    // Simulate payment processing
    // In a real application, you would integrate with:
    // - Stripe: https://stripe.com/docs/api
    // - Square: https://developer.squareup.com/
    // - PayPal: https://developer.paypal.com/
    // - Braintree: https://developers.braintreepayments.com/

    const paymentResult = await processPayment({
      amount: booking.totalAmount,
      currency: "USD",
      cardNumber: validatedPayment.cardNumber,
      expiryMonth: validatedPayment.expiryMonth,
      expiryYear: validatedPayment.expiryYear,
      cvv: validatedPayment.cvv,
      cardHolderName: validatedPayment.cardHolderName,
      billingAddress: validatedPayment.billingAddress,
    });

    if (paymentResult.success) {
      // Update booking with payment information
      booking.paymentStatus = "paid";
      booking.paidAmount = booking.totalAmount;
      booking.status = "confirmed";
      booking.transactionId = paymentResult.transactionId;
      booking.paymentMethod = "credit_card";
      booking.paymentProcessedAt = new Date();

      await booking.save();

      // Send confirmation email (in a real app)
      // await sendConfirmationEmail(booking);

      return NextResponse.json({
        success: true,
        data: {
          booking: booking,
          transactionId: paymentResult.transactionId,
          message: "Payment processed successfully. Booking confirmed!",
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: paymentResult.error || "Payment processing failed",
          code: "PAYMENT_FAILED",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing payment:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Payment processing failed" },
      { status: 500 }
    );
  }
}

// Mock payment processing function
// In a real application, replace this with actual payment processor integration
async function processPayment(paymentDetails) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate payment processing logic
  const { cardNumber, expiryMonth, expiryYear, cvv } = paymentDetails;

  // Basic validation (in real app, payment processor handles this)
  if (!cardNumber || cardNumber.length !== 16) {
    return {
      success: false,
      error: "Invalid card number",
    };
  }

  if (!cvv || cvv.length < 3) {
    return {
      success: false,
      error: "Invalid CVV",
    };
  }

  // Simulate random success/failure for demo
  const random = Math.random();

  if (random > 0.1) {
    // 90% success rate for demo
    return {
      success: true,
      transactionId:
        "TXN_" +
        Date.now() +
        "_" +
        Math.random().toString(36).substr(2, 8).toUpperCase(),
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      processedAt: new Date().toISOString(),
      last4: cardNumber.slice(-4),
    };
  } else {
    return {
      success: false,
      error: "Payment declined by bank",
    };
  }
}

// Get payment status
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const bookingReference = searchParams.get("reference");

    if (!bookingReference) {
      return NextResponse.json(
        { success: false, error: "Booking reference is required" },
        { status: 400 }
      );
    }

    const booking = await Booking.findOne({
      bookingId: bookingReference,
    }).select(
      "paymentStatus paidAmount totalAmount transactionId paymentProcessedAt"
    );

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentStatus: booking.paymentStatus,
        paidAmount: booking.paidAmount,
        totalAmount: booking.totalAmount,
        transactionId: booking.transactionId,
        paymentProcessedAt: booking.paymentProcessedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch payment status" },
      { status: 500 }
    );
  }
}
