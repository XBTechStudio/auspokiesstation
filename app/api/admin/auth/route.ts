import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db-local';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { authenticated: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    if (!token || token.length === 0) {
      return NextResponse.json(
        { authenticated: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    try {
      // Decode token to get user info
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [userId, username] = decoded.split(':');
      
      if (!userId || !username) {
        return NextResponse.json(
          { authenticated: false, error: 'Invalid token format' },
          { status: 401 }
        );
      }

      // Verify user exists in database
      const sql = 'SELECT id, username FROM admin_users WHERE id = ? AND username = ?';
      const results = await query(sql, [userId, username]) as any[];

      if (results.length === 0) {
        return NextResponse.json(
          { authenticated: false, error: 'User not found' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        authenticated: true,
        message: 'Token is valid',
        user: {
          id: results[0].id,
          username: results[0].username,
        },
      });
    } catch (decodeError) {
      // If token decode fails, it's invalid
      return NextResponse.json(
        { authenticated: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false, error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
