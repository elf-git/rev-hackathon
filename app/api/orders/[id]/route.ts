import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();
        const { status } = body;

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
