import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Cookie name for access grant
const ACCESS_COOKIE_NAME = 'access_granted';

// Cookie expiration time (24 hours in seconds)
const COOKIE_MAX_AGE = 24 * 60 * 60;

// Get password from environment variable, default to a secure password
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || 'defaultPassword123';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    // Verify password
    if (password !== ACCESS_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Set access cookie
    const cookieStore = await cookies();
    cookieStore.set(ACCESS_COOKIE_NAME, 'true', {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
