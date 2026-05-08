import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { sendOrderConfirmationEmail } from '@/lib/emailTemplates';

// Helper to check auth
async function checkAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    const payload = verifyToken(token);
    return payload;
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Ensure user is logged in
        const user = await checkAuth();
        if (!user) {
            return NextResponse.json({ error: 'Please login to place an order.' }, { status: 401 });
        }

        const body = await req.json();

        const today = new Date();
        const year = today.getFullYear().toString().slice(-2);
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59);

        const count = await Order.countDocuments({
            createdAt: { $gte: startOfYear, $lte: endOfYear }
        });

        const orderNumber = (count + 1).toString().padStart(5, '0');
        const customOrderId = `EC-${year}-${orderNumber}`;

        // This is a simplified Create Order implementation.
        // It saves the order to DB and immediately sends the confirmation email.
        const newOrder = await Order.create({
            orderId: customOrderId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user: (user as any).id,
            items: body.items,
            shippingAddress: body.shippingAddress,
            paymentMethod: body.paymentMethod || 'Cash On Delivery',
            subtotal: body.subtotal,
            shippingFee: body.shippingFee,
            taxInfo: body.taxInfo,
            totalAmount: body.totalAmount,
            status: 'Processing'
        });

        // Fire off email asynchronously
        const orderDetails = {
            orderId: newOrder._id.toString().slice(-6).toUpperCase(), // short visual ID
            customerName: body.customerName,
            customerEmail: body.customerEmail,
            items: body.items,
            subtotal: body.subtotal,
            shipping: body.shippingFee,
            tax: body.taxInfo?.amount || 0,
            total: body.totalAmount,
            address: `${body.shippingAddress.street}, ${body.shippingAddress.city}, ${body.shippingAddress.state} - ${body.shippingAddress.zip}`
        };

        await sendOrderConfirmationEmail(body.customerEmail, orderDetails);

        return NextResponse.json(
            { message: 'Order placed successfully', orderId: newOrder._id },
            { status: 201 }
        );

    } catch (error) {
        console.error('Create Order error:', error);
        return NextResponse.json(
            { error: 'Internal server error while placing order.' },
            { status: 500 }
        );
    }
}
