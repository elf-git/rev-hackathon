async function main() {
    try {
        const prismaModule: any = await import('@prisma/client');
        const PrismaClient = prismaModule.PrismaClient || prismaModule.default?.PrismaClient;

        if (!PrismaClient) {
            console.log('PrismaClient not found, skipping seed.');
            return;
        }

        const prisma = new PrismaClient();

        // Clear existing
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.menuItem.deleteMany();

        // Seed Menu
        const menuItems = [
            { name: 'Masala Dosa', price: 60, prepTime: 5, category: 'South Indian' },
            { name: 'Idli Vada', price: 40, prepTime: 2, category: 'South Indian' },
            { name: 'Veg Noodles', price: 80, prepTime: 8, category: 'Chinese' },
            { name: 'Fried Rice', price: 80, prepTime: 8, category: 'Chinese' },
            { name: 'Tea', price: 15, prepTime: 1, category: 'Beverages' },
            { name: 'Coffee', price: 20, prepTime: 1, category: 'Beverages' },
            { name: 'Samosa', price: 20, prepTime: 0, category: 'Snacks' },
            { name: 'Sandwich', price: 50, prepTime: 4, category: 'Snacks' },
        ];

        for (const item of menuItems) {
            await prisma.menuItem.create({ data: item });
        }

        console.log('Seeding completed.');
        await prisma.$disconnect();
    } catch (e) {
        console.error('Seeding failed or skipped:', e);
    }
}

main();
