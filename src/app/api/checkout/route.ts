import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token) as { id: string } | null;
        if (!decoded || !decoded.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        await connectDB();
         
         
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { items, shippingAddress, paymentMethod, subtotal, tax, shipping, total } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        if (!shippingAddress) {
            return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const today = new Date();
        const year = today.getFullYear().toString().slice(-2);
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59);

        const count = await Order.countDocuments({
            createdAt: { $gte: startOfYear, $lte: endOfYear }
        });

        const orderNumber = (count + 1).toString().padStart(5, '0');
        const customOrderId = `EC-${year}-${orderNumber}`;

        // Create Order
        const newOrder = new Order({
            orderId: customOrderId,
            user: user._id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items: items.map((item: any) => ({
                product: item.productId,
                variantId: item.id,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount: total,
            status: 'Pending',
            shippingAddress: {
                street: `${shippingAddress.flat}, ${shippingAddress.area}`,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zipCode: shippingAddress.pincode,
                country: 'India',
            },
            paymentInfo: {
                id: paymentMethod === 'online' ? 'dummy_txn_id' : undefined,
                status: paymentMethod === 'online' ? 'Completed' : 'Pending',
                method: paymentMethod,
            }
        });

        await newOrder.save();

        // Clear user cart in DB
        user.cart = [];
        await user.save();

        return NextResponse.json({ message: 'Order placed successfully', orderId: newOrder._id }, { status: 201 });

    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
