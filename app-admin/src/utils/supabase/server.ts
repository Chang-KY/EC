import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
import {Database} from '@/supabase.types';

export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    db: {schema: 'ec'},
    auth: {persistSession: true, autoRefreshToken: true},
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({name, value, options}) => cookieStore.set(name, value, options));
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
