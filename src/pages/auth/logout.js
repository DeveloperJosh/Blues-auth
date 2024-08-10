import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    
    // Redirect to the login page
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <h1>Logging out...</h1>
    </div>
  );
}
