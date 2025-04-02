
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // In the future, this would be connected to Supabase authentication
  const isAuthenticated = true; // Placeholder for authentication check
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-whatsapp" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
                <path d="M12 6L11.06 11.06L6 12L11.06 12.94L12 18L12.94 12.94L18 12L12.94 11.06L12 6Z" />
              </svg>
              <span className="ml-2 text-xl font-bold">WhatsAPI</span>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="ml-3 relative">
                <div>
                  <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      JD
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome to your WhatsAPI management dashboard.
          </p>
        </div>
        
        {/* Stats */}
        <div className="mt-4 px-4 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Stat 1 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,248</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none">
                    <path d="M3 9L6 6L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>
            
            {/* Stat 2 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">843</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none">
                    <path d="M3 9L6 6L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  +8.2% from last month
                </p>
              </CardContent>
            </Card>
            
            {/* Stat 3 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">92%</div>
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1 transform rotate-180" viewBox="0 0 12 12" fill="none">
                    <path d="M3 9L6 6L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  -2.3% from last month
                </p>
              </CardContent>
            </Card>
            
            {/* Stat 4 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">API Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">64%</div>
                <p className="text-xs text-gray-500 mt-1">
                  of monthly quota
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="mt-8 px-4 sm:px-0">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <li key={item}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-whatsapp truncate">
                        New message received from User #{item}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Delivered
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          John Doe
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <p>
                          <time dateTime="2020-01-07">January 7, 2020</time>
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8 px-4 sm:px-0">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
                <CardDescription>Send a message to your customers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-whatsapp hover:bg-whatsapp-dark w-full">Compose Message</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Create Template</CardTitle>
                <CardDescription>Create a new message template</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-whatsapp hover:bg-whatsapp-dark w-full">New Template</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>View Analytics</CardTitle>
                <CardDescription>Check your messaging performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-whatsapp hover:bg-whatsapp-dark w-full">View Reports</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
