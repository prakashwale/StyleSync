import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  // Dummy state for email/password fields (not functional for MVP)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setError('');
      await signInWithGithub();
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with GitHub');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      {/* Left: Logo and tagline */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-[#1e293b] to-[#0f172a]">
        <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
          StyleSync
        </div>
        <div className="text-lg text-gray-300 font-light text-center">
          Where teams create visually
        </div>
      </div>
      {/* Right: Login card */}
      <div className="flex-1 flex justify-center items-center">
        <div className="bg-[#18181b] rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
          <div className="max-w-sm mx-auto w-full">
            <form className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {/* Email icon */}
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 0v.01L12 13 20 4.01V4H4zm16 2.243l-7.071 7.071a1 1 0 01-1.415 0L4 6.243V20h16V6.243z" />
                  </svg>
                </span>
                <input
                  type="email"
                  className="w-full pl-10 pr-3 py-2 rounded-md bg-[#23232b] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="designer@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {/* Password icon */}
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-7V7a6 6 0 10-12 0v3a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2zm-8-3a4 4 0 118 0v3H6V7z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-8 py-2 rounded-md bg-[#23232b] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {/* Eye icon */}
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </span>
              </div>
              <button
                type="button"
                className="w-full py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-base shadow-md hover:from-blue-600 hover:to-purple-600 transition"
              >
                Login
              </button>
            </form>
          </div>
          <div className="my-6 flex items-center justify-center text-gray-400">
            <span className="border-t border-gray-600 flex-1 mr-4"></span>
            or continue with
            <span className="border-t border-gray-600 flex-1 ml-4"></span>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-gray-100 shadow-md"
            >
              {/* Google icon */}
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 10.8V13.7h4.7c-.2 1.2-1.4 3.5-4.7 3.5-2.8 0-5-2.3-5-5s2.2-5 5-5c1.6 0 2.7.7 3.3 1.3l2.3-2.3C16.2 4.7 14.3 3.7 12 3.7c-4.6 0-8.3 3.7-8.3 8.3s3.7 8.3 8.3 8.3c4.8 0 8-3.4 8-8 0-.5-.1-.9-.2-1.2H12z"/>
              </svg>
            </button>
            <button
              onClick={handleGithubSignIn}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-gray-100 shadow-md"
            >
              {/* GitHub icon */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="mt-8 text-center text-gray-400 text-xs">
            Don't have an account?{' '}
            <a href="/signup" className="text-purple-400 underline cursor-pointer">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 