import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ComboPack from '@/lib/models/ComboPack';
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
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            const comboPack = await ComboPack.findById(id);
            if (!comboPack) return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
            return NextResponse.json(comboPack);
        }

        const comboPacks = await ComboPack.find({}).sort({ createdAt: 1 });
        return NextResponse.json(comboPacks);
    } catch (error) {
        console.error('Error fetching combo packs:', error);
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

        // Check if editing or creating
        if (body._id) {
            const updatedPack = await ComboPack.findByIdAndUpdate(
                body._id,
                body,
                { new: true, runValidators: true }
            );
            return NextResponse.json(updatedPack);
        } else {
            const newPack = await ComboPack.create(body);
            return NextResponse.json(newPack);
        }
    } catch (error) {
        console.error('Error saving combo pack:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const isAdmin = await checkAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        await ComboPack.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting combo pack:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
