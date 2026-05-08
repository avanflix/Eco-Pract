import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function checkAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    return verifyToken(token);
}

// PUT to update a specific address
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const userPayload = await checkAuth();

        if (!userPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = await User.findById((userPayload as any).id);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const addressData = user.addresses.id(id);
        if (!addressData) {
            return NextResponse.json({ error: 'Address not found' }, { status: 404 });
        }

        // Handle default toggle logic
        if (body.isDefault) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user.addresses.forEach((addr: any) => {
                if (addr._id.toString() !== id) {
                    addr.isDefault = false;
                }
            });
        }

        // Update fields
        Object.assign(addressData, body);
        await user.save();

        return NextResponse.json(
            { message: 'Address updated successfully', addresses: user.addresses },
            { status: 200 }
        );

    } catch (error) {
        console.error('Update address error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE an address
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const userPayload = await checkAuth();

        if (!userPayload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = await User.findById((userPayload as any).id);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        user.addresses.pull({ _id: id });
        await user.save();

        return NextResponse.json(
            { message: 'Address deleted successfully', addresses: user.addresses },
            { status: 200 }
        );

    } catch (error) {
        console.error('Delete address error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
