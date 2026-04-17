import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md p-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-indigo-500 font-bold text-3xl mb-6">
            <Shield className="w-10 h-10" />
            <span>DAPS</span>
          </Link>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Welcome back</h2>
          <p className="text-[var(--text-secondary)] mt-2">Log in to your account to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[var(--text-secondary)]" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                placeholder="you@company.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[var(--text-secondary)]" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 bg-[var(--background)] border-[var(--border)] rounded text-indigo-600 focus:ring-indigo-500" />
              <label className="ml-2 block text-sm text-[var(--text-secondary)]">Remember me</label>
            </div>
            <a href="#" className="text-sm font-medium text-indigo-500 hover:text-indigo-400">Forgot password?</a>
          </div>
          <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[var(--surface)]">
            Sign in
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-500 hover:text-indigo-400">
            Sign up
          </Link>
        </p>
      </div>
      
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[var(--text-secondary)]">
        <Shield className="w-4 h-4 text-green-500" />
        <span>Secured by Google Identity Platform & Firebase App Check</span>
      </div>
    </div>
  );
}
