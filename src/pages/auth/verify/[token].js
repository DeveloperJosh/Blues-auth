// pages/auth/verify/[token].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Verify() {
    const router = useRouter();
    const { token } = router.query;

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch('/api/auth/verification/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setMessage(data.message);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setMessage(data.message);
                toast.success(data.message);
            } catch (err) {
                setError(err.message || 'An error occurred');
                toast.error(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            verifyToken();
        }
    }, [token]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-black">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-8 text-center text-white">
                    {loading ? 'Verifying...' : 'Account Verification'}
                </h2>
                {loading ? (
                    <p className="text-gray-400 text-center">Please wait while we verify your account...</p>
                ) : error ? (
                    <div className="text-red-500 text-center">
                        <p>{message}</p>
                        <br />
                        <button onClick={() => router.push('/')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Go Home
                        </button>
                    </div>
                ) : (
                    <div className="text-green-500 text-center">
                        <p>{message}</p>
                        <br />
                        <button onClick={() => router.push('/')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" >
                           Login
                        </button>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}
