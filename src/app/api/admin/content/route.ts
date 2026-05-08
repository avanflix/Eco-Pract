import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Content from '@/lib/models/Content';
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
        const section = searchParams.get('section');

        if (section) {
            const content = await Content.findOne({ section });
            return NextResponse.json(content || {});
        }

        const allContent = await Content.find({});
        return NextResponse.json(allContent);
    } catch (error) {
        console.error('Error fetching content:', error);
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
        const { section, data } = await req.json();

        if (!section || !data) {
            return NextResponse.json({ error: 'Section and data are required' }, { status: 400 });
        }

        const updatedContent = await Content.findOneAndUpdate(
            { section },
            { data, lastUpdated: new Date() },
            { new: true, upsert: true } // Create if not exists
        );

        return NextResponse.json(updatedContent);
    } catch (error) {
        console.error('Error updating content:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
