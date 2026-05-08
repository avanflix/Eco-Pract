import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/emailTemplates';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const success = await sendContactEmail(name, email, phone, subject, message);

        if (success) {
            return NextResponse.json(
                { message: 'Message sent successfully' },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: 'Failed to send message. Please try again later.' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Contact API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
