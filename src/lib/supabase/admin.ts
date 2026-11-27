import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

/**
 * Service-role Supabase client for server routes. Never import this from a
 * client component: it is the only place the secret key is used.
 */
export function getAdminClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) return null;
  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getUserFromRequest(request: Request): Promise<User | null> {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  const admin = getAdminClient();
  if (!admin) return null;
  try {
    const { data } = await admin.auth.getUser(header.slice(7));
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function getUsername(admin: SupabaseClient, userId: string): Promise<string | null> {
  const { data, error } = await admin
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data?.username) return null;
  return String(data.username);
}

/** True when Postgres reports that the table/column has not been created yet. */
export function isMissingSchema(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === 'PGRST205' || error.code === 'PGRST204' || error.code === '42P01') return true;
  const message = error.message ?? '';
  return /schema cache|does not exist|Could not find the table/i.test(message);
}

export function appOrigin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (configured) return configured;
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') ?? 'http';
  return host ? `${proto}://${host}` : new URL(request.url).origin;
}
