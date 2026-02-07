'use client';

import { useState } from 'react';
import { ShoppingCart, Clock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderInterface({ menuItems }: { menuItems: any[] }) {
    const [cart, setCart] = useState<{ [key: number]: number }>({});
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState<any>(null);

    const addToCart = (id: number) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const removeFromCart = (id: number) => {
        setCart(prev => {
            const newCount = (prev[id] || 0) - 1;
            if (newCount <= 0) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: newCount };
        });
    };

    const getTotal = () => {
        return Object.entries(cart).reduce((total, [id, qty]) => {
            const item = menuItems.find(i => i.id === parseInt(id));
            return total + (item?.price || 0) * qty;
        }, 0);
    };

    const handleCheckout = async () => {
        const customerName = prompt("Enter your name:");
        if (!customerName) return;

        setLoading(true);
        try {
            const items = Object.entries(cart).map(([id, quantity]) => ({
                menuItemId: parseInt(id),
                quantity
            }));

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ customerName, items })
            });

            if (res.ok) {
                const order = await res.json();
                setOrderPlaced(order);
                setCart({});
            } else {
                alert('Failed to place order');
            }
        } catch (e) {
            alert('Error placing order');
        } finally {
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6 animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Order Confirmed!</h2>
                <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-md border border-slate-700">
                    <p className="text-slate-400">Your Token</p>
                    <p className="text-5xl font-mono font-bold text-blue-400 my-4">#{orderPlaced.id}</p>
                    <div className="h-px bg-slate-700 my-4" />
                    <p className="text-slate-400">Estimated Pickup Time</p>
                    <p className="text-2xl text-white font-semibold">
                        {new Date(orderPlaced.predictedReadyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <button
                    onClick={() => setOrderPlaced(null)}
                    className="text-blue-400 hover:text-blue-300 underline"
                >
                    Place another order
                </button>
            </div>
        );
    }

    return (
        <div className="pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                    <div key={item.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-white">{item.name}</h3>
                            <p className="text-slate-400 text-sm">₹{item.price} • {item.prepTime} min</p>
                        </div>
                        <div className="flex items-center space-x-3 bg-slate-900 rounded-lg p-1">
                            {cart[item.id] ? (
                                <>
                                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center text-white hover:bg-slate-700 rounded">-</button>
                                    <span className="text-white w-4 text-center">{cart[item.id]}</span>
                                    <button onClick={() => addToCart(item.id)} className="w-8 h-8 flex items-center justify-center text-white hover:bg-slate-700 rounded">+</button>
                                </>
                            ) : (
                                <button onClick={() => addToCart(item.id)} className="px-4 py-1 text-sm text-blue-400 font-medium">Add</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {Object.keys(cart).length > 0 && (
                <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-700 p-4 safe-area-bottom">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Total</p>
                            <p className="text-2xl font-bold text-white">₹{getTotal()}</p>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50"
                        >
                            <span>{loading ? 'Processing...' : 'Place Order'}</span>
                            {!loading && <ShoppingCart className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
