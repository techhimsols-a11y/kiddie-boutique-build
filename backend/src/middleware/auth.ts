import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

export type AuthUser = {
  id: string;
  email?: string | null;
  is_admin: boolean;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      authUser?: AuthUser | null;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data: userData, error } = await supabase.auth.getUser(token);
    if (error || !userData?.user) return res.status(401).json({ error: 'Unauthorized' });

    const userId = userData.user.id;
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id,email:email,full_name,is_admin')
      .eq('id', userId)
      .single();
    if (profileError) return res.status(401).json({ error: 'Unauthorized' });

    req.authUser = { id: profile.id, email: profile.email, is_admin: Boolean(profile.is_admin) };
    next();
  } catch (e) {
    next(e);
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.authUser?.is_admin) return res.status(403).json({ error: 'Forbidden' });
  next();
}


