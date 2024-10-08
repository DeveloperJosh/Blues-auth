import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import TwoFactorModal from '@/components/TwoFactorModal';
import dotenv from 'dotenv';
dotenv.config();

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { email, password };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requires2FA) {
          setIs2FAModalOpen(true);
          toast.info('Enter your 2FA code');
        } else {
          localStorage.setItem('token', data.token);
          toast.success('Login successful! Redirecting to dashboard...');
          setTimeout(() => {
            router.push('/auth/dashboard');
          }, 1000);
        }
      } else {
        toast.error(data.message || 'Failed to login');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, twoFactorToken }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        toast.success('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/auth/dashboard');
        }, 1000);
      } else {
        toast.error(data.message || 'Failed to verify 2FA code');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIs2FAModalOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-8 text-center text-white">Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white pr-10"
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white focus:outline-none justify-center"
              style={{ height: '144.5%' }} // Ensures the button takes the full height of the input
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/auth/forgot-password" className="text-sm text-gray-400 hover:text-white">Forgot Password?</Link>
        </div>
        <div className="mt-4 text-center">
          <Link href="/auth/signup" className="text-sm text-gray-400 hover:text-white">Sign Up</Link>
        </div>
      </div>
      <ToastContainer />

      <TwoFactorModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        onSubmit={handle2FASubmit}
        twoFactorToken={twoFactorToken}
        setTwoFactorToken={setTwoFactorToken}
      />
    </div>
  );
}
