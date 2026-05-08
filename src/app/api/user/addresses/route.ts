import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

// Helper
async function checkAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    return verifyToken(token);
}

// GET all addresses for the user
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const userPayload = await checkAuth();

        if (!userPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = await User.findById((userPayload as any).id).select('addresses');

        return NextResponse.json({ addresses: user?.addresses || [] }, { status: 200 });

    } catch (error) {
        console.error('Fetch addresses error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST a new address
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const userPayload = await checkAuth();

        if (!userPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        // Find user
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = await User.findById((userPayload as any).id);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // If this is set as default, unset others
        if (body.isDefault && user.addresses) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user.addresses.forEach((addr: any) => {
                addr.isDefault = false;
            });
        }

        // Add ID via push (Mongoose automatically assigns _id for subdocuments)
        user.addresses.push(body);
        await user.save();

        return NextResponse.json(
            { message: 'Address added successfully', addresses: user.addresses },
            { status: 201 }
        );

    } catch (error) {
        console.error('Add address error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
