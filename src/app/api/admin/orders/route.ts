import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import User from '@/lib/models/User'; // Ensure User model is registered
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Product from '@/lib/models/Product'; // Ensure Product model is registered
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
        const isAdmin = await checkAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Pagination
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('items.product', 'title images')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments({});

        return NextResponse.json({ orders, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
