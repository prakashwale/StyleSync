import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage: React.FC = () => {
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sign up state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);

  // Dummy login handler (replace with Firebase email login if needed)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    // You can implement email/password login here if needed
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoginError('');
      setSignUpError('');
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error: any) {
      setLoginError(error.message || 'Failed to sign in with Google');
      setSignUpError(error.message || 'Failed to sign in with Google');
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setLoginError('');
      setSignUpError('');
      await signInWithGithub();
      navigate('/dashboard');
    } catch (error: any) {
      setLoginError(error.message || 'Failed to sign in with GitHub');
      setSignUpError(error.message || 'Failed to sign in with GitHub');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');
    setSignUpLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`.trim(),
      });
      navigate('/dashboard');
    } catch (err: any) {
      setSignUpError(err.message || 'Failed to sign up');
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      {/* Left: Logo and tagline */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2">
        <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8">
          StyleSync
        </div>
        <div className="text-2xl text-gray-300 font-light text-center">
          Where teams create visually
        </div>
      </div>
      {/* Right: Auth card */}
      <div className="flex-1 flex justify-center items-center">
        <div className="bg-[#18181b] rounded-2xl shadow-2xl p-12 w-full max-w-lg min-h-[480px]">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
                <div className="max-w-sm mx-auto w-full">
                  <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        {/* Email icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="text-blue-400"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M38.735 15.224L24 26.072L9.265 15.224" strokeWidth="1"/><rect width="39" height="26.582" x="4.5" y="10.709" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" rx="4" ry="4" strokeWidth="1"/></svg>
                      </span>
                      <input
                        type="email"
                        className="w-full pl-10 pr-3 py-2 rounded-md bg-[#23232b] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="designer@email.com"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        {/* Password icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none"><path fill="url(#tokenBrandedKey0)" d="M11.5 16.5a1 1 0 1 0 0-2a1 1 0 0 0 0 2"/><path fill="url(#tokenBrandedKey1)" fillRule="evenodd" d="M12 3L4 7.485v8.99L12 21l8-4.525v-8.99zm2.045 3.5H11.54c-.19.005-.53.14-.54.615v6.448a2 2 0 1 0 1 0V9.5h1.58c.15 0 .42-.17.42-.5c0-.325-.265-.5-.42-.5H12v-1h2.05c.175 0 .45-.195.45-.5a.48.48 0 0 0-.455-.5" clipRule="evenodd"/><defs><linearGradient id="tokenBrandedKey0" x1="12.001" x2="12.001" y1="3" y2="21" gradientUnits="userSpaceOnUse"><stop stopColor="#4ab0e1"/><stop offset="1" stopColor="#58b9cf"/></linearGradient><linearGradient id="tokenBrandedKey1" x1="12" x2="12" y1="3" y2="21" gradientUnits="userSpaceOnUse"><stop stopColor="#4ab0e1"/><stop offset="1" stopColor="#58b9cf"/></linearGradient></defs></g></svg>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full pl-10 pr-8 py-2 rounded-md bg-[#23232b] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
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
                      type="submit"
                      className="w-full py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-base shadow-md hover:from-blue-600 hover:to-purple-600 transition"
                    >
                      Login
                    </button>
                  </form>
                  {loginError && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
                      <span className="block sm:inline">{loginError}</span>
                    </div>
                  )}
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                        <path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"/>
                        <path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"/>
                        <path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"/>
                        <path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"/>
                      </svg>
                    </button>
                    <span className="text-gray-400 text-sm">or</span>
                    <button
                      onClick={handleGithubSignIn}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-gray-100 shadow-md"
                    >
                      {/* GitHub icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/>
                      </svg>
                    </button>
                  </div>
                  <div className="mt-8 text-center text-gray-400 text-xs">
                    Don't have an account?{' '}
                    <button type="button" className="text-purple-400 cursor-pointer" onClick={() => setIsLogin(false)}>
                      Sign up
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
              >
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
                      value={signUpEmail}
                      onChange={e => setSignUpEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                    <input
                      type="password"
                      className="w-full px-3 py-2 rounded-md bg-[#23232b] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Password"
                      value={signUpPassword}
                      onChange={e => setSignUpPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-base shadow-md hover:from-blue-600 hover:to-purple-600 transition"
                      disabled={signUpLoading}
                    >
                      {signUpLoading ? 'Signing up...' : 'Sign up'}
                    </button>
                  </form>
                  {signUpError && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
                      <span className="block sm:inline">{signUpError}</span>
                    </div>
                  )}
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                        <path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"/>
                        <path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"/>
                        <path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"/>
                        <path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"/>
                      </svg>
                    </button>
                    <span className="text-gray-400 text-sm">OR</span>
                    <button
                      onClick={handleGithubSignIn}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-gray-100 shadow-md"
                    >
                      {/* GitHub icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/>
                      </svg>
                    </button>
                  </div>
                  <div className="mt-8 text-center text-gray-400 text-xs">
                    Already have an account?{' '}
                    <button type="button" className="text-purple-400 cursor-pointer" onClick={() => setIsLogin(true)}>
                      Login
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 