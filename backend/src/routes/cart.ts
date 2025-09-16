import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Get current user's cart items
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.authUser!.id;
    const { data, error } = await supabase
      .from('cart_items')
      .select('id,product_id,quantity,size,color,product:products(id,name,price,image_url,stock)')
      .eq('user_id', userId)
      .order('inserted_at', { ascending: false });
    if (error) throw error;
    res.json(data ?? []);
  } catch (err) {
    next(err);
  }
});

// Add or update cart item (upsert by unique constraint)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.authUser!.id;
    const { product_id, quantity, size, color } = req.body as { product_id: string; quantity: number; size?: string; color?: string };
    const { data, error } = await supabase
      .from('cart_items')
      .upsert({ user_id: userId, product_id, quantity, size, color }, { onConflict: 'user_id,product_id,size,color' })
      .select('*')
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// Update quantity
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = req.authUser!.id;
    const { id } = req.params;
    const { quantity } = req.body as { quantity: number };
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Remove item
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const userId = req.authUser!.id;
    const { id } = req.params;
    const { error } = await supabase.from('cart_items').delete().eq('id', id).eq('user_id', userId);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;


