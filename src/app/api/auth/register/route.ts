import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { sendOTPEmail } from '@/lib/emailTemplates';

// Generate a random 6-digit number string
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { firstName, lastName, email, phone, password } = await req.json();

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.isVerified) {
                return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
            }
            // User exists but is unverified, we can update them and send a new OTP below
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Generate plain OTP and expiration (15 minutes from now)
        const plainOTP = generateOTP();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

        // 4. Save/Update user in DB (unverified state with OTP)
        // Note: For extra security, OTP should theoretically be hashed too, but since its short lived, plain can be acceptable in DB. Let's hash it strictly.
        const hashedOTP = await bcrypt.hash(plainOTP, 10);

        let user;
        if (existingUser && !existingUser.isVerified) {
            // Update the unverified user with potentially new details and new OTP
            existingUser.name = `${firstName} ${lastName}`;
            existingUser.phone = phone;
            existingUser.password = hashedPassword;
            existingUser.otp = hashedOTP;
            existingUser.otpExpires = otpExpires;
            await existingUser.save();
            user = existingUser;
        } else {
            // Create new record
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            user = await User.create({
                name: `${firstName} ${lastName}`,
                email,
                phone,
                password: hashedPassword,
                role: 'user',
                isVerified: false,
                otp: hashedOTP,
                otpExpires: otpExpires,
            });
        }

        // 5. Send Email via NodeMailer
        const emailSent = await sendOTPEmail(email, plainOTP, firstName);

        if (!emailSent) {
            return NextResponse.json(
                { error: 'Failed to send verification email. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Registration successful. Please check your email for the OTP.' },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
