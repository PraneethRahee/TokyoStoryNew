const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ message: 'Invalid amount. Minimum $1.00 required.' });
    }

    // Use frontend domain for success/cancel URLs
    const frontendUrl = process.env.FRONTEND_URL || 'https://tokyo-story-h4ty.vercel.app';
    
    console.log('Payment session creation:', {
      frontendUrl,
      originalUrl: req.originalUrl
    });

    const sessionData = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Tokyo Lore Tickets',
              description: `${metadata.tickets || 1} ticket(s) for Tokyo Lore`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: metadata,
      success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/payment-cancelled`,
    };

    const session = await stripe.checkout.sessions.create(sessionData);

    res.json({ 
      checkoutUrl: session.url,
      sessionId: session.id,
      frontendUrl
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ message: 'Failed to retrieve session' });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', session);
      break;
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful:', paymentIntent);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
