import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`.trim(),
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
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
      {/* Right: Sign up card */}
      <div className="flex-1 flex justify-center items-center ">
        <div className="bg-[#18181b] rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign up</h2>
          <div className="max-w-sm mx-auto w-full">
            <form className="space-y-4" onSubmit={handleSignUp}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="w-1/2 px-3 py-2 rounded-md bg-[#23232b] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="First Name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="w-1/2 px-3 py-2 rounded-md bg-[#23232b] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                />
              </div>
              <input
                type="email"
                className="w-full px-3 py-2 rounded-md bg-[#23232b] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <input
                type="password"
                className="w-full px-3 py-2 rounded-md bg-[#23232b] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-base shadow-md hover:from-blue-600 hover:to-purple-600 transition"
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
            </form>
          </div>
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="mt-8 text-center text-gray-400 text-xs">
            Already have an account?{' '}
            <a href="/login" className="text-purple-400 underline cursor-pointer">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 