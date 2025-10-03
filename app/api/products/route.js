import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    return Response.json({ success: true, products: result.rows });
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}
