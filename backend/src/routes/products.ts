import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id,name,description,price,original_price,category,age_group,rating,review_count,featured,image_url,images,sizes,colors,stock')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data ?? []);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('products')
      .select('id,name,description,price,original_price,category,age_group,rating,review_count,featured,image_url,images,sizes,colors,stock')
      .eq('id', id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Admin: create product
router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const payload = req.body as Record<string, any>;
    const { data, error } = await supabase.from('products').insert(payload).select('*').single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// Admin: update product
router.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body as Record<string, any>;
    const { data, error } = await supabase.from('products').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Admin: delete product
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Admin: generate signed upload URL for product images
router.post('/upload-url', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { filePath } = req.body as { filePath: string };
    if (!filePath) return res.status(400).json({ error: 'filePath required' });
    const bucket = process.env.SUPABASE_PRODUCT_IMAGES_BUCKET || 'product-images';
    const { data, error } = await supabase.storage.createSignedUploadUrl(bucket, filePath);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;


