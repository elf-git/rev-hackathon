'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function Login() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ code }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            router.push('/vendor');
            router.refresh();
        } else {
            setError('Invalid Access Code');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-slate-800 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Vendor Login</h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Access Code</label>
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter admin code"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Unlock Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}
