'use client';

import { useState, useEffect } from 'react';
import { RefreshCcw, CheckCircle, Flame, Clock } from 'lucide-react';

export default function VendorDashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                setOrders(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (orderId: number, status: string) => {
        // Optimistic update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

        // In a real app, call API to update status
        // For now, we need an API endpoint for this. 
        // I'll create /api/orders/[id]/route.ts next.
        await fetch(`/api/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        fetchOrders();
    };

    const pendingOrders = orders.filter(o => o.status === 'PENDING');
    const preparingOrders = orders.filter(o => o.status === 'PREPARING');
    const readyOrders = orders.filter(o => o.status === 'READY');

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Flame className="text-orange-500" />
                    Kitchen Dashboard
                </h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={async () => {
                            await fetch('/api/auth/logout', { method: 'POST' });
                            window.location.href = '/vendor/login';
                        }}
                        className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-sm transition-colors"
                    >
                        Logout
                    </button>
                    <button onClick={fetchOrders} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
                        <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* PENDING */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 h-full">
                    <h2 className="text-xl font-semibold mb-4 text-slate-300 flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Pending ({pendingOrders.length})
                    </h2>
                    <div className="space-y-4">
                        {pendingOrders.map(order => (
                            <div key={order.id} className="bg-slate-800 p-4 rounded-lg border-l-4 border-slate-500 animate-in fade-in slide-in-from-left-2">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-lg">#{order.id}</span>
                                    <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <p className="font-medium text-slate-200 mb-2">{order.customerName}</p>
                                <div className="space-y-1 mb-4">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="text-sm text-slate-300 flex justify-between">
                                            <span>{item.menuItem.name}</span>
                                            <span className="font-mono">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => updateStatus(order.id, 'PREPARING')}
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded font-medium transition-colors"
                                >
                                    Start Cooking
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PREPARING */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 h-full">
                    <h2 className="text-xl font-semibold mb-4 text-orange-400 flex items-center gap-2">
                        <Flame className="w-5 h-5" /> Preparing ({preparingOrders.length})
                    </h2>
                    <div className="space-y-4">
                        {preparingOrders.map(order => (
                            <div key={order.id} className="bg-slate-800 p-4 rounded-lg border-l-4 border-orange-500">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-lg">#{order.id}</span>
                                    <span className="text-xs text-slate-400">Due: {new Date(order.predictedReadyTime).toLocaleTimeString()}</span>
                                </div>
                                <p className="font-medium text-slate-200 mb-2">{order.customerName}</p>
                                <div className="space-y-1 mb-4">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="text-sm text-slate-300 flex justify-between">
                                            <span>{item.menuItem.name}</span>
                                            <span className="font-mono">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => updateStatus(order.id, 'READY')}
                                    className="w-full py-2 bg-green-600 hover:bg-green-500 rounded font-medium transition-colors"
                                >
                                    Mark Ready
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* READY */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 h-full">
                    <h2 className="text-xl font-semibold mb-4 text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Ready ({readyOrders.length})
                    </h2>
                    <div className="space-y-4">
                        {readyOrders.map(order => (
                            <div key={order.id} className="bg-slate-800 p-4 rounded-lg border-l-4 border-green-500 opacity-75 hover:opacity-100 transition-opacity">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-lg strike">#{order.id}</span>
                                    <span className="text-xs text-green-400 font-bold">READY</span>
                                </div>
                                <p className="font-medium text-slate-200 mb-2">{order.customerName}</p>
                                <button
                                    onClick={() => updateStatus(order.id, 'COMPLETED')}
                                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded font-medium text-slate-300 transition-colors text-sm"
                                >
                                    Picked Up (Complete)
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
