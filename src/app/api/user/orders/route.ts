import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = verifyToken(token) as { id: string } | null;
        if (!decoded || !decoded.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        await connectDB();
        
        // Ensure Product model is registered for populate
        Product.find().limit(1);

        const orders = await Order.find({ user: decoded.id })
            .populate('items.product', 'title')
            .sort({ createdAt: -1 })
            .lean();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedOrders = orders.map((order: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const itemsStrings = order.items.map((item: any) => {
                const title = item.product?.title || 'Unknown Product';
                return `${item.quantity}x ${title} (${item.size || ''})`.trim();
            });

            return {
                id: order._id.toString(),
                orderId: order.orderId || order._id.toString().slice(-8).toUpperCase(),
                date: new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                status: order.status,
                total: order.totalAmount,
                items: itemsStrings,
                fullItems: order.items,
                shippingAddress: order.shippingAddress,
            };
        });

        return NextResponse.json({ orders: formattedOrders }, { status: 200 });

    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
