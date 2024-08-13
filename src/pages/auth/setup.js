import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Transition } from '@headlessui/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Setup() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [redirect, setRedirect] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('You need to log in first');
            router.push('/');
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('/api/sso/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description, url, redirect }),
            });

            if (response.status === 201) {
                setShowForm(false);
                setShowPopup(true);
                setTimeout(() => {
                    handleClosePopup();
                }, 3000);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        router.push('/auth/dashboard');
    };

    return (
        <div className="max-w-lg mx-auto mt-12 p-8 bg-gray-900 rounded-xl shadow-2xl text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">Setup Your Website</h2>
            <Transition
                show={showForm}
                enter="transition-opacity duration-700"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-700"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 font-semibold">Website Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter website name"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 font-semibold">Website Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Describe your website"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 font-semibold">Website URL</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="https://yourwebsite.com"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 font-semibold">Redirect URL</label>
                        <input
                            type="text"
                            value={redirect}
                            onChange={(e) => setRedirect(e.target.value)}
                            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="https://yourwebsite.com/callback"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold mb-4 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        Setup Website
                    </button>
                </form>
            </Transition>
            <button onClick={() => router.push('/auth/dashboard')} className="w-full bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg font-semibold transition-colors duration-200 focus:ring-2 focus:ring-gray-500 focus:outline-none">
                Back to Dashboard
            </button>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

            <Transition
                show={showPopup}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-gray-800 p-6 text-white">
                                <h3 className="text-lg font-medium text-white">Site Added Successfully!</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-300">
                                        Your application has been added successfully. Please check your email for the client credentials.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    onClick={handleClosePopup}
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    );
}
