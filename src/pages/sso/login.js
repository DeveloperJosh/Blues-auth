import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SSOLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [twoFactorToken, setTwoFactorToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [requires2FA, setRequires2FA] = useState(false);
    const router = useRouter();
    const { client_id, callback_url } = router.query;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await axios.post('/api/sso/login', {
                email,
                password,
                twoFactorToken, // This might be empty if 2FA is not required
                callback_url,
                client_id,
            });
    
            if (response.status === 200 && response.data.requires2FA) {
                setRequires2FA(true);
                toast.info('Please enter your 2FA token');
            } else if (response.status === 200 && response.data.redirectUrl) {
                window.location.href = response.data.redirectUrl;
            }
        } catch (err) {
            console.error(err.response?.data?.message || 'Login failed');
            toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">SSO Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {requires2FA && (
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">2FA Token</label>
                            <input
                                type="text"
                                value={twoFactorToken}
                                onChange={(e) => setTwoFactorToken(e.target.value)}
                                className="w-full p-3 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-500"
                                placeholder="Enter your 2FA token"
                                required
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}
