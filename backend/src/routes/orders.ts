import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// List current user's orders (or all if admin via query ?all=1)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const isAdmin = Boolean(req.authUser?.is_admin);
    const listAll = isAdmin && (req.query.all === '1' || req.query.all === 'true');
    const query = supabase
      .from('orders')
      .select('id,status,total,currency,created_at,user_id,order_items:order_items(id,product_id,quantity,price,product:products(id,name,image_url))')
      .order('created_at', { ascending: false });
    const { data, error } = listAll ? await query : await query.eq('user_id', req.authUser!.id);
    if (error) throw error;
    res.json(data ?? []);
  } catch (err) {
    next(err);
  }
});

// Create order from user's cart (pending status); totals computed server-side
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.authUser!.id;
    const { data: cart, error: cartError } = await supabase
      .from('cart_items')
      .select('id,product_id,quantity,product:products(id,price,stock)')
      .eq('user_id', userId);
    if (cartError) throw cartError;
    if (!cart || cart.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    // Validate stock and calculate total
    let total = 0;
    for (const item of cart) {
      if (!item.product || item.product.stock < item.quantity) {
        return res.status(400).json({ error: 'Insufficient stock for an item' });
      }
      total += Number(item.product.price) * item.quantity;
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id: userId, total, status: 'pending', currency: 'usd' })
      .select('*')
      .single();
    if (orderError) throw orderError;

    // Create order items
    const orderItemsPayload = cart.map((ci) => ({
      order_id: order.id,
      product_id: ci.product_id,
      quantity: ci.quantity,
      price: ci.product!.price,
    }));
    const { error: oiError } = await supabase.from('order_items').insert(orderItemsPayload);
    if (oiError) throw oiError;

    // Optionally reserve stock (decrement)
    for (const ci of cart) {
      // using RPC or simple update with check could be better, for simplicity direct update
      const { error: stockError } = await supabase
        .from('products')
        .update({ stock: (ci.product!.stock as number) - ci.quantity })
        .eq('id', ci.product_id);
      if (stockError) throw stockError;
    }

    // Clear cart
    const { error: clearError } = await supabase.from('cart_items').delete().eq('user_id', userId);
    if (clearError) throw clearError;

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// Admin: update order status
router.put('/:id/status', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: string };
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select('*').single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;


