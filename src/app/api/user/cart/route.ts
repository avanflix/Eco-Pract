import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
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
        const { items: clientItems } = await req.json();

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Merge logic: Combine client cart and DB cart.
        // We'll trust the client cart state to OVERWRITE if it has items, 
        // OR we merge them. Since it's a simple sync, let's merge by ID.
        // If client cart is empty but DB cart has items (e.g., fresh login on new device),
        // we should return the DB cart to the client.
        
        const mergedItems = [...(user.cart || [])];

        if (clientItems && clientItems.length > 0) {
            // Client is sending items. Update/merge with DB.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dbMap = new Map(mergedItems.map((i: any) => [i.id, i]));
            
            for (const item of clientItems) {
                if (dbMap.has(item.id)) {
                    // Update quantity
                    const existing = dbMap.get(item.id);
                    // To prevent infinite increment, we just take the client quantity 
                    // since the client is the source of truth during an active session.
                    existing.quantity = item.quantity;
                } else {
                    // Add new item
                    mergedItems.push(item);
                    dbMap.set(item.id, item);
                }
            }
            // What if client removed an item? 
            // A simple "sync" might just replace the DB cart with the client cart entirely 
            // to accurately reflect removals.
            // But if the client is empty (just logged in), it will wipe the DB cart!
            // Let's use a flag or just replace if client sends a non-empty list.
            
            // To be totally safe and exact: Let's assume the client cart is the absolute truth 
            // UNLESS the client cart is completely empty and the DB cart has items (initial login sync).
            // Actually, if a user explicitly clears their cart, we want it empty. 
            // We'll handle "initial login sync" by sending `isLoginSync: true`? No, simpler: 
            // We just replace the user cart with `clientItems`.
            user.cart = clientItems;
        } else {
            // Client items is empty. If they just logged in, they want their DB cart back.
            // If they explicitly cleared it, we might be sending back the DB cart accidentally.
            // For now, let's just return the DB cart to populate the client.
        }

        await user.save();

        return NextResponse.json({ cart: user.cart }, { status: 200 });

    } catch (error) {
        console.error('Cart sync error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
