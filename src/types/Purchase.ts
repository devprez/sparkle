export interface Purchase {
  eventId: string;
  userId: string;
  // when the user opens the PaymentForm, the status is PENDING
  // when the user clicks on Pay and the result of the paymentIntent is "succeeded", the status is CONFIRMATION_FROM_STRIPE_PENDING
  // when we receive the confirmation from Stripe that the payment is a success, the status is COMPLETE
  status:
    | "PENDING"
    | "COMPLETE"
    | "CONFIRMATION_FROM_STRIPE_PENDING"
    | "FAILED";
  venueId: string;
}
