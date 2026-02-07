import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function PATCH(
    request: Request,
    { params }: any
) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        const body = await request.json();
        const { status } = body;

        console.log(`[ORDER UPDATE] ID: ${id}, New Status: ${status}`);

        const updatedOrder = await db.order.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error(`[ORDER UPDATE ERROR]`, error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
