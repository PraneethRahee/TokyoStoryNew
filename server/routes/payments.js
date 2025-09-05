const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CheckoutSnapshot = require('../models/CheckoutSnapshot');
const { auth } = require('../middleware/auth');

router.post('/snapshot', auth, async (req, res) => {
  try {
    const { items, meta } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items are required' });
    }
    const key = `${req.user._id}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    await CheckoutSnapshot.create({
      key,
      userId: req.user._id,
      items: items.map(i => ({
        storyId: i.id || i.storyId,
        title: i.title,
        price: Number(i.price),
        quantity: i.quantity || 1,
        imageUrl: i.imageUrl
      })),
      meta: meta || {},
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
    });
    res.json({ key });
  } catch (error) {
    console.error('Create snapshot error:', error);
    res.status(500).json({ message: 'Failed to create snapshot' });
  }
});

router.get('/snapshot/:key', auth, async (req, res) => {
  try {
    const snap = await CheckoutSnapshot.findOne({ key: req.params.key, userId: req.user._id });
    if (!snap) return res.status(404).json({ message: 'Snapshot not found' });
    res.json({ items: snap.items, meta: snap.meta });
  } catch (error) {
    console.error('Get snapshot error:', error);
    res.status(500).json({ message: 'Failed to get snapshot' });
  }
});

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ message: 'Invalid amount. Minimum $1.00 required.' });
    }

    // Resolve frontend URL smartly for dev/prod
    const frontendUrl = process.env.FRONTEND_URL
      || req.headers.origin
      || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://localhost:3000');
    
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
