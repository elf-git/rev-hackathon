import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

// GET: Fetch active orders (for Vendor Dashboard & Polling)
export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            where: {
                status: { in: ['PENDING', 'PREPARING', 'READY'] }
            },
            include: {
                items: {
                    include: {
                        menuItem: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

// POST: Create a new order (Student)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerName, items } = body; // items: [{ menuItemId, quantity }]

        if (!customerName || !items || items.length === 0) {
            return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
        }

        // 1. Calculate Total Amount & Prep Time
        let totalAmount = 0;
        let maxPrepTime = 0; // Simplified prediction: max individual item time
        // In advanced version: Sum of times / Concurrency

        // Fetch item details to calculate
        const itemIds = items.map((i: any) => i.menuItemId);
        const dbItems = await prisma.menuItem.findMany({
            where: { id: { in: itemIds } }
        });

        const dbItemsMap = new Map(dbItems.map(i => [i.id, i]));

        for (const item of items) {
            const dbItem = dbItemsMap.get(item.menuItemId);
            if (dbItem) {
                totalAmount += dbItem.price * item.quantity;
                if (dbItem.prepTime > maxPrepTime) {
                    maxPrepTime = dbItem.prepTime;
                }
            }
        }

        // Simple Queue Impact Calculation
        // Get count of PENDING orders to add a "One minute per order ahead" factor
        const activeOrdersCount = await prisma.order.count({
            where: { status: { in: ['PENDING', 'PREPARING'] } }
        });

        const predictedDelayMinutes = maxPrepTime + activeOrdersCount; // 1 min per order ahead + cook time
        const predictedReadyTime = new Date(Date.now() + predictedDelayMinutes * 60000);

        // 2. Create Order
        const order = await prisma.order.create({
            data: {
                customerName,
                status: 'PENDING',
                totalAmount,
                predictedReadyTime,
                items: {
                    create: items.map((i: any) => ({
                        menuItemId: i.menuItemId,
                        quantity: i.quantity
                    }))
                }
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
