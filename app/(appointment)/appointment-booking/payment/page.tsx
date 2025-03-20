import PaymentForm from "@/components/others/payment-form";

export default function PaymentPage() {
  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Payment</h1>
        <p className="text-muted-foreground">
          Complete your booking by making a payment
        </p>
      </div>
      <PaymentForm />
    </div>
  );
}
