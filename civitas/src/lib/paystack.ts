import { PAYSTACK_PUBLIC_KEY, API_URL } from '../config/env';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface ChargeOptions {
  email: string;
  amountNaira: number; // in Naira — this helper converts to kobo for Paystack
  metadata?: Record<string, any>;
}

interface VerifiedTransaction {
  verified: boolean;
  status: string;
  amount: number;
  currency: string;
  reference: string;
  paidAt?: string;
  customerEmail?: string;
}

/**
 * Opens the real Paystack payment popup, then verifies the resulting
 * transaction server-side (via /api/paystack-verify) before resolving.
 * Never trust a "successful" client-side callback alone — Paystack's own
 * docs warn the popup's callback can be spoofed; server verification with
 * the secret key is the only trustworthy confirmation that money moved.
 */
export function chargeWithPaystack(options: ChargeOptions): Promise<VerifiedTransaction> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.PaystackPop) {
      reject(new Error('Payment system is still loading. Please try again in a moment.'));
      return;
    }

    const reference = `MEA-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: options.email,
      amount: Math.round(options.amountNaira * 100), // Paystack expects kobo
      currency: 'NGN',
      ref: reference,
      metadata: options.metadata || {},
      callback: (response: any) => {
        // Popup reported success — now verify for real, server-side.
        fetch(`${API_URL}/paystack-verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: response.reference }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.verified) {
              resolve(result as VerifiedTransaction);
            } else {
              reject(new Error(result.error || 'Payment could not be verified. Please contact support before retrying.'));
            }
          })
          .catch(() => {
            reject(new Error('Payment was made but verification failed. Please contact support with reference: ' + response.reference));
          });
      },
      onClose: () => {
        reject(new Error('Payment window closed before completing.'));
      },
    });

    handler.openIframe();
  });
}
