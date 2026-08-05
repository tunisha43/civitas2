// Vercel serverless function — auto-deployed at POST /api/paystack-verify
// No server setup needed: Vercel detects any file under /api and runs it
// as its own endpoint automatically.
//
// This is the ONLY place that should ever touch PAYSTACK_SECRET_KEY.
// It must never be sent to, or used in, the frontend.

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reference } = req.body || {};
  if (!reference || typeof reference !== 'string') {
    return res.status(400).json({ error: 'Missing transaction reference.' });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error('PAYSTACK_SECRET_KEY is not set in the server environment.');
    return res.status(500).json({ error: 'Payment verification is not configured.' });
  }

  try {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const result = await paystackRes.json();

    if (!paystackRes.ok || !result.status) {
      return res.status(400).json({ error: result.message || 'Could not verify transaction with Paystack.' });
    }

    const tx = result.data;
    const isSuccessful = tx.status === 'success';

    return res.status(200).json({
      verified: isSuccessful,
      status: tx.status,
      amount: tx.amount / 100, // Paystack returns amount in kobo
      currency: tx.currency,
      reference: tx.reference,
      paidAt: tx.paid_at,
      customerEmail: tx.customer?.email,
    });
  } catch (err: any) {
    console.error('Paystack verification error:', err);
    return res.status(500).json({ error: 'Failed to reach Paystack. Please try again.' });
  }
}
