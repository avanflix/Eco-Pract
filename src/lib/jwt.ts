import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "";

export function signToken(payload: object, expiresIn: string = '2h') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null;
    }
}
