import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Setup() {
    const [url, setUrl] = useState('');
    const [redirect, setRedirect] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('You need to log in first');
            router.push('/');
            return;
        }

        // make a request to the /user/me endpoint
        if (token) {
            axios.get('/api/user/me', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then((res) => {
                console.log(res.data);
            }).catch((err) => {
                console.log(err);
                toast.error('Invalid token. Please log in again.');
                localStorage.removeItem('token');
                router.push('/');
            });
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/sso/add', {
                url,
                redirect,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                setMessage('Website setup successfully');
                toast.success('Website setup successfully!');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
                toast.error(err.response.data.message);
            } else {
                setError('Something went wrong. Please try again.');
                toast.error('Something went wrong. Please try again.');
            }
        }
    };

    const handleBackToDashboard = () => {
        router.push('/auth/dashboard');
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 rounded-lg shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Setup Your Website</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Website URL</label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full p-3 border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-500"
                        placeholder="https://yourwebsite.com"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Redirect URL</label>
                    <input
                        type="text"
                        value={redirect}
                        onChange={(e) => setRedirect(e.target.value)}
                        className="w-full p-3 border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-500"
                        placeholder="https://yourwebsite.com/callback"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold mb-4"
                >
                    Setup Website
                </button>
            </form>
            <button
                onClick={handleBackToDashboard}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg font-semibold"
            >
                Back to Dashboard
            </button>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}
