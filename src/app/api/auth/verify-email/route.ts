import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { signToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, otp } = await req.json();

        // 1. Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ error: 'Email is already verified. Please login.' }, { status: 400 });
        }

        // 2. Validate OTP existence and expiration
        if (!user.otp || !user.otpExpires) {
            return NextResponse.json({ error: 'No OTP found. Please request a new one.' }, { status: 400 });
        }

        if (new Date() > user.otpExpires) {
            return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
        }

        // 3. Verify OTP Hash
        const isMatch = await bcrypt.compare(otp, user.otp);

        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid OTP code' }, { status: 400 });
        }

        // 4. Update user to verified and clear OTP
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // 5. Automatically log the user in by generating a JWT
        const token = signToken({ id: user._id, role: user.role });

        const response = NextResponse.json(
            {
                message: 'Email verified successfully. You are now logged in.',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }
            },
            { status: 200 }
        );

        // Prevent cross-site scripting attacks via httpOnly: true
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days (standard customer session)
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('OTP Verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
