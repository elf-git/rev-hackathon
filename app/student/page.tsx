import db from '@/app/lib/db';
import OrderInterface from './OrderInterface';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function StudentPage() {
    const menuItems = await db.menuItem.findMany({
        orderBy: { category: 'asc' }
    });

    return (
        <main className="min-h-screen bg-slate-950 text-white p-4">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center mb-8 pt-4">
                    <Link href="/" className="mr-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Canteen Menu</h1>
                        <p className="text-slate-400 text-sm">Pre-order to skip the line</p>
                    </div>
                </header>

                <OrderInterface menuItems={menuItems} />
            </div>
        </main>
    );
}
