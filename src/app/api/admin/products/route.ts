import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

// Helper to check admin auth
async function checkAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return false;
    const payload = verifyToken(token);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return payload && (payload as any).role === 'admin';
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        // Allow public access to GET products, or restrict based on query param if needed
        // For admin dashboard, we might want all fields. For frontend, maybe filtered.
        // For now, return all.

        // Pagination
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const products = await Product.find({})
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments({});

        return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const isAdmin = await checkAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();

        // Basic validation could go here, but Mongoose will also validate
        const newProduct = await Product.create(body);

        return NextResponse.json(newProduct, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: error.message || 'Error creating product' }, { status: 500 });
    }
}
