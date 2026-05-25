import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db-local';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// PUT - Update announcement
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await request.json();
    const { title, content, category, image, is_important } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await query(
      `UPDATE announcements 
       SET title = ?, content = ?, category = ?, image = ?, is_important = ?
       WHERE id = ?`,
      [
        title,
        content,
        category,
        image || null,
        is_important !== undefined ? is_important : false,
        resolvedParams.id,
      ]
    );

    return NextResponse.json({ message: 'Announcement updated successfully' });
  } catch (error: any) {
    console.error('Error updating announcement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete announcement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    await query('DELETE FROM announcements WHERE id = ?', [resolvedParams.id]);

    return NextResponse.json({ message: 'Announcement deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
