import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Login() {
  const navigate = useNavigate();
  const setToken = useAuthStore(state => state.setToken);
  const [email, setEmail] = useState('operator@falconz.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use URLSearchParams for application/x-www-form-urlencoded expected by OAuth2PasswordRequestForm
      const formData = new URLSearchParams();
      formData.append('username', email); // FastAPI OAuth expects 'username'
      formData.append('password', password);

      const res = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (!res.ok) {
        throw new Error('Invalid credentials or backend offline');
      }

      const data = await res.json();
      setToken(data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-falcon-dark flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      <div className="absolute w-[500px] h-[500px] bg-falcon-blue/20 rounded-full blur-[150px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Plane className="mx-auto text-falcon-blue mb-4 drop-shadow-[0_0_15px_rgba(0,123,255,0.8)]" size={48} />
          <h2 className="text-3xl font-bold text-white tracking-wider">FALCONZ</h2>
          <p className="text-gray-400 mt-2">Ground Control Authorization</p>
        </div>

        <form onSubmit={handleLogin} className="glass-panel p-8 rounded-2xl relative">
          <div className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Operator Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-falcon-blue focus:ring-1 focus:ring-falcon-blue transition-all"
                placeholder="operator@falconz.com"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-300">Passcode</label>
                <a href="#" className="text-xs text-falcon-blue hover:text-falcon-accent transition-colors">Forgot?</a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-falcon-blue focus:ring-1 focus:ring-falcon-blue transition-all"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 text-lg mt-4 flex justify-center items-center gap-2">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Authenticate'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Unauthorized access is strictly prohibited. <br/> <Link to="/" className="text-falcon-blue hover:underline">Return to surface</Link>
        </p>
      </div>
    </div>
  );
}
