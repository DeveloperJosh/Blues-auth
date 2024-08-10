import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  HomeIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You need to log in first');
      router.push('/');
    } else {
      // Fetch user data
      fetch('/api/user/me', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setUser(data);
          } else {
            toast.error('Failed to fetch user data');
          }
        })
        .catch(() => {
          toast.error('An unexpected error occurred');
        });
    }
  }, [router]);

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    setTimeout(() => {
      router.push('/auth/logout');
    }, 1500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <div>Welcome to the Home section!</div>;
      case 'profile':
        return <div>Coming Soon</div>;
      case 'settings':
        return <div>Coming Soon</div>;
      default:
        return <div>Welcome to the Home section!</div>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-gray-900 to-black text-white">
      {/* Mobile Header */}
      <header className="flex items-center justify-between lg:hidden p-4 bg-gray-800">
        <div className="text-2xl font-bold">Dashboard</div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white focus:outline-none"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`lg:w-64 bg-gray-800 p-6 lg:block ${
          isSidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="text-2xl font-bold mb-8 hidden lg:block">Dashboard</div>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md w-full text-left ${
              activeTab === 'home' ? 'bg-gray-700' : ''
            }`}
          >
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md w-full text-left ${
              activeTab === 'profile' ? 'bg-gray-700' : ''
            }`}
          >
            <UserCircleIcon className="h-5 w-5" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md w-full text-left ${
              activeTab === 'settings' ? 'bg-gray-700' : ''
            }`}
          >
            <CogIcon className="h-5 w-5" />
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md w-full text-left"
          >
            <ArrowRightIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.username || 'User'}!</h1>
        <p className="mt-4">
          Welcome to the dashboard! Here you can manage your account settings.
        </p>
        <div className="mt-8">{renderContent()}</div>
      </main>
      <ToastContainer />
    </div>
  );
}
