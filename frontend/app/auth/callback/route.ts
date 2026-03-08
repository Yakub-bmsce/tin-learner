import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);

    // Check if user exists in our users table
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingUser) {
        // New user, redirect to onboarding
        return NextResponse.redirect(new URL('/onboarding', requestUrl.origin));
      }

      // Existing user, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
