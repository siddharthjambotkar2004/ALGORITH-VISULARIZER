import React, { useState } from 'react';
import { Sparkles, Code, BarChart3, Network, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Simple animated algorithm visual components
const SortingBars = () => (
  <div className="flex items-end gap-1 h-24">
    {[3, 5, 2, 7, 1, 4, 6].map((height, i) => (
      <motion.div
        key={i}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: `${height * 20}px`, opacity: 1 }}
        transition={{ delay: i * 0.1, repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
        className="w-4 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg shadow-lg shadow-blue-500/30"
      />
    ))}
  </div>
);

const GraphNodes = () => (
  <div className="relative h-32 w-40">
    {[
      { x: 20, y: 80 },
      { x: 80, y: 20 },
      { x: 140, y: 80 },
      { x: 60, y: 120 },
      { x: 120, y: 120 },
    ].map((pos, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, x: pos.x, y: pos.y }}
        animate={{ scale: [0.8, 1.2, 0.8], x: pos.x, y: pos.y }}
        transition={{ delay: i * 0.15, repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 shadow-lg shadow-cyan-500/40"
      />
    ))}
  </div>
);

const LandingPage: React.FC = () => {
  const { signIn, signUp, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'ADMIN' ? '/admin' : '/app');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let result;
      if (isLogin) {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.username, formData.email, formData.password);
      }

      if (!result.success) {
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ x: -100, y: 100, rotate: 0 }}
          animate={{ x: 50, y: 50, rotate: 10 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute top-16 left-16"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl shadow-blue-500/20">
            <SortingBars />
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 100, y: -100, rotate: 0 }}
          animate={{ x: -50, y: 50, rotate: -10 }}
          transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute top-32 right-32"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl shadow-cyan-500/20">
            <GraphNodes />
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: 30, y: -30, rotate: 15 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute bottom-32 left-24"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl shadow-teal-500/20">
            <SortingBars />
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -50, y: 50, rotate: 0 }}
          animate={{ x: 0, y: 0, rotate: -5 }}
          transition={{ duration: 9, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute bottom-24 right-20"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl shadow-purple-500/20">
            <GraphNodes />
          </div>
        </motion.div>
      </div>

      <div className="relative z-10">
        <nav className="px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">AlgoVisual</span>
          </div>
        </nav>

        <div className="container mx-auto px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl font-black text-white leading-tight">
                  Visualize Algorithms
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                    Like Never Before
                  </span>
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Interactive step-by-step animations for sorting and graph algorithms.
                  Learn, experiment, and master complex concepts with beautiful visualizations.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                  <BarChart3 className="mx-auto text-blue-400 mb-3" size={32} />
                  <div className="text-2xl font-bold text-white">6</div>
                  <div className="text-sm text-slate-400 font-medium">Sorting</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                  <Network className="mx-auto text-cyan-400 mb-3" size={32} />
                  <div className="text-2xl font-bold text-white">6</div>
                  <div className="text-sm text-slate-400 font-medium">Graph</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                  <Code className="mx-auto text-teal-400 mb-3" size={32} />
                  <div className="text-2xl font-bold text-white">∞</div>
                  <div className="text-sm text-slate-400 font-medium">Possibilities</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-slate-400">
                  {isLogin ? 'Sign in to continue your journey' : 'Start visualizing algorithms today'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                      placeholder="algorithm_master"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">
                    {isLogin ? 'Email or Username' : 'Email'}
                  </label>
                  <input
                    type={isLogin ? 'text' : 'email'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                      {isLogin ? 'Sign In' : 'Sign Up'}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-slate-400 text-sm">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(null);
                      setFormData({ username: '', email: '', password: '' });
                    }}
                    className="ml-2 text-blue-400 hover:text-blue-300 font-bold transition-colors"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
