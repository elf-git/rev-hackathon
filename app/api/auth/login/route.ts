import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const body = await request.json();
    const { code } = body;
    console.log(`[AUTH] Login attempt with code: ${code}`);

    // Hardcoded password for Hackathon MVP
    if (code === 'admin123') {
        // Set cookie
        (await cookies()).set('vendor_auth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
}
