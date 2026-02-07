import Link from 'next/link';
import { ArrowRight, Clock, Users, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="z-10 text-center space-y-8 max-w-2xl">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Canteen Rush AI
        </h1>
        <p className="text-xl text-slate-300">
          Skip the queue. Predict the wait. Eat on time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-12">
          <Link
            href="/student"
            className="group relative p-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all hover:bg-slate-800/80"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">I'm a Student</h2>
              <p className="text-sm text-slate-400">Order ahead & check status</p>
            </div>
            <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </Link>

          <Link
            href="/vendor"
            className="group relative p-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-all hover:bg-slate-800/80"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold">I'm a Vendor</h2>
              <p className="text-sm text-slate-400">Manage orders & queue</p>
            </div>
            <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </Link>
        </div>

        <div className="pt-12 flex justify-center gap-8 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>AI Time Prediction</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Instant Coordination</span>
          </div>
        </div>
      </div>
    </main>
  );
}
