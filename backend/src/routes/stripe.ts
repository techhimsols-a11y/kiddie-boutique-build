import { Router } from 'express';
import Stripe from 'stripe';
import { supabase } from '../lib/supabase';
import { requireAuth } from '../middleware/auth';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });

// Create Stripe Checkout Session from current cart
router.post('/checkout', requireAuth, async (req, res, next) => {
  try {
    const userId = req.authUser!.id;
    const { data: cart, error: cartError } = await supabase
      .from('cart_items')
      .select('product:products(id,name,price,images,image_url),quantity')
      .eq('user_id', userId);
    if (cartError) throw cartError;
    if (!cart || cart.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    const line_items = cart.map((ci) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: ci.product?.name || 'Item' },
        unit_amount: Math.round(Number(ci.product?.price || 0) * 100),
      },
      quantity: ci.quantity,
    }));

    const successUrl = (process.env.FRONTEND_URL || 'http://localhost:5173') + '/orders?success=1';
    const cancelUrl = (process.env.FRONTEND_URL || 'http://localhost:5173') + '/cart?canceled=1';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { user_id: userId },
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    next(err);
  }
});

// Webhook to update order status
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig as string, webhookSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      // Optionally, you can look up an order by metadata or create one here.
      // For simplicity, we won't auto-create here since we create order separately in /orders.
    }
    res.json({ received: true });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    res.status(500).json({ error: 'Webhook handling error' });
  }
});

export default router;


