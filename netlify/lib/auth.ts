import { getUser, verifyRequestOrigin } from '@netlify/identity';

// Returns an error Response unless the caller is logged in with the "admin" role
export async function requireAdmin(req: Request): Promise<Response | null> {
  if (req.method !== 'GET') {
    try {
      verifyRequestOrigin(req);
    } catch {
      return new Response('Forbidden', { status: 403 });
    }
  }
  const user = await getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });
  if (!user.roles?.includes('admin')) return new Response('Forbidden', { status: 403 });
  return null;
}
