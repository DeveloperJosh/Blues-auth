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
import { Transition } from '@headlessui/react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('You need to log in first');
      router.push('/');
    } else {
      setLoading(true); // Start loading
      fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: '/user/me',
          token,
          data: {},
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.message);
          }
          setUser(data);
          setTwoFactorEnabled(data.twoFactorEnabled);
          setLoading(false); // Stop loading
        })
        .catch((err) => {
          toast.error(err.message);
          setLoading(false); // Stop loading on error
          router.push('/');
        });
    }
  }, [router]);

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    setTimeout(() => {
      router.push('/auth/logout');
    }, 1500);
  };

  const setup2FA = () => {
    setIsSettingUp2FA(true);
    const token = localStorage.getItem('token');

    fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: '/auth/2fa/enable',
        token,
        email: user.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.secret) {
          setTwoFactorSecret(data.secret);
          toast.success(
            '2FA setup successful! Scan the QR code or enter the secret key in your authenticator app.'
          );
        } else {
          toast.error('Failed to setup 2FA');
        }
        setIsSettingUp2FA(false);
      })
      .catch(() => {
        toast.error('An unexpected error occurred');
        setIsSettingUp2FA(false);
      });
  };

  const disable2FA = () => {
    const token = localStorage.getItem('token');

    fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: '/auth/2fa/disable',
        token,
        email: user.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.staus === 'success') {
          setTwoFactorEnabled(false);
          setTwoFactorSecret('');
          toast.success('2FA disabled successfully');
        } else {
          console.log(data);
          toast.error('Failed to disable 2FA');
        }
      })
      .catch(() => {
        toast.error('An unexpected error occurred');
      });
  };

  const handleSetupRedirect = () => {
    router.push('/auth/setup');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div>
            <div>Welcome to the Home section!</div>
            <button
              onClick={handleSetupRedirect}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Create New Application
            </button>
          </div>
        );
      case 'profile':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p>Username: {user?.username}</p>
            <p>Email: {user?.email}</p>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            {twoFactorEnabled ? (
              <div>
                <p>Two-Factor Authentication is enabled.</p>
                <button
                  onClick={disable2FA}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  Disable 2FA
                </button>
              </div>
            ) : (
              <div>
                <p>Two-Factor Authentication is not enabled.</p>
                <button
                  onClick={setup2FA}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
                  disabled={isSettingUp2FA}
                >
                  {isSettingUp2FA ? 'Setting up 2FA...' : 'Enable 2FA'}
                </button>
                {twoFactorSecret && (
                  <div className="mt-4">
                    <p>Secret Key:</p>
                    <code>{twoFactorSecret}</code>
                    <p className="text-sm text-gray-400">
                      Enter this key in your authenticator app. Once you refresh
                      the page, you will be able to disable 2FA, but you
                      won&apos;t be able to see the secret key again.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
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
        <Transition
          as="div" // Render as a div instead of a Fragment
          show={loading}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {loading && (
            <div className="flex justify-center items-center h-full">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent border-t-4 border-t-solid rounded-full animate-spin"></div>
              </div>
            </div>
          )}
        </Transition>

        {!loading && (
          <>
            <h1 className="text-3xl font-bold">
              Welcome, {user?.username || 'User'}!
            </h1>
            <p className="mt-4">
              Welcome to the dashboard! Here you can manage your account settings.
            </p>
            <div className="mt-8">{renderContent()}</div>
          </>
        )}
      </main>
      <ToastContainer />
    </div>
  );
}
