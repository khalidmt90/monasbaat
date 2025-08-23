Manual migration placeholder: run `prisma migrate dev --name add_order_customer_fields_and_payment_proof` locally to generate SQL.

Adds columns to Order: customer_name, customer_email, customer_phone.
Adds columns to PaymentIntent: proof_submitted_at, proof_meta.