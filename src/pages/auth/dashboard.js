import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaHome, FaWallet, FaCreditCard, FaExchangeAlt, FaLayerGroup, FaPuzzlePiece, FaUserFriends, FaFileInvoiceDollar } from 'react-icons/fa';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
      } else {
        try {
          const res = await fetch('/api/user/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            localStorage.removeItem('token');
            router.push('/');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          router.push('/');
        }
      }
    };

    fetchUserData();
  }, [router]);

  if (!user) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Fake data for the chart
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Balance',
        data: [1200, 900, 1500, 800, 1700, 1600, 1900],
        fill: false,
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
        tension: 0.4,
      },
    ],
  };

  const more_data = {
    // spead money data
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Spend',
        data: [1600, 700, 1500, 400, 1500, 1300, 2000],
        fill: false,
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
        tension: 0.4,
      },
    ],
 };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-white">{user.username[0].toUpperCase()}</span>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold">{user.username}</h4>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>
        <nav className="space-y-4">
          <a href="#" className="flex items-center text-gray-400 hover:text-white space-x-3">
            <FaHome />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center text-gray-400 hover:text-white space-x-3">
            <FaWallet />
            <span>Accounts</span>
          </a>
          <a href="#" className="flex items-center text-gray-400 hover:text-white space-x-3">
            <FaCreditCard />
            <span>Cards</span>
          </a>
          <a href="#" className="flex items-center text-gray-400 hover:text-white space-x-3">
            <FaExchangeAlt />
            <span>Transaction</span>
          </a>
          <a href="#" className="flex items-center text-gray-400 hover:text-white space-x-3">
            <FaLayerGroup />
            <span>Spend Groups</span>
          </a>
          <a href="#" className="flex items-center text-gray-400 hover:text-white space-x-3">
            <FaPuzzlePiece />
            <span>Integrations</span>
          </a>
          <a href="#" className="flex items-center text-gray-400 hover:text-white space-x-3">
            <FaUserFriends />
            <span>Payees</span>
          </a>
          <a href="#" className="flex items-center text-gray-400 hover:text-white space-x-3">
            <FaFileInvoiceDollar />
            <span>Invoices</span>
          </a>
          <a href="/auth/logout" className="flex items-center text-gray-400 hover:text-white space-x-3">
            <FaFileInvoiceDollar />
            <span>Logout</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-900 p-6">
        <div className="mb-6">
          <h2 className="text-white text-3xl font-semibold">Hey, {user.username.split(' ')[0]}!</h2>
          <p className="text-gray-400">{today}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Available Balance */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white">Available Balance</h3>
            <div className="mt-4">
              <p className="text-4xl font-bold text-white">$19,453.43</p>
              <p className="text-green-400 mt-2">▲ 3% vs last month</p>
            </div>
            <div className="mt-6">
              <Line data={data} options={options} />
            </div>
          </div>

          {/* Spend Activity */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white">Spend Activity</h3>
            <div className="mt-4">
              <p className="text-4xl font-bold text-white">1.2k</p>
              <p className="text-gray-400 mt-2">Spend this month</p>
            </div>
            <div className="mt-6">
              {/* Another chart or placeholder for additional data */}
                <Line data={more_data} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
