import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { clearError, getDashboardAnalytics } from '@/redux/slice/dashboardSlice';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { analytics, isLoading, error } = useSelector((state) => state.dashboard);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      dispatch(getDashboardAnalytics());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div className="text-center py-12 text-red-600">Access denied. Admins only.</div>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const chartData = {
    labels: analytics?.onlineUsersByDepartment?.map((item) => item.department) || [],
    datasets: [
      {
        label: 'Online Users',
        data: analytics?.onlineUsersByDepartment?.map((item) => item.userCount) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#1f2937',
        },
      },
      title: {
        display: true,
        text: 'Online Users by Department',
        color: '#1f2937',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#1f2937',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#1f2937',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Admin Dashboard
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : error ? (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        ) : !analytics ? (
          <p className="text-gray-600 dark:text-gray-400">No analytics data available.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Total Online Users: {analytics.onlineUsers || 0}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Online Users by Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.onlineUsersByDepartment?.length ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No online users data available.</p>
                )}
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Payment Statistics by Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.paymentStats?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-900 dark:text-white">Department</TableHead>
                        <TableHead className="text-right text-gray-900 dark:text-white">Total Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analytics.paymentStats.map((stat) => (
                        <TableRow key={stat.department}>
                          <TableCell className="text-gray-900 dark:text-white">{stat.department}</TableCell>
                          <TableCell className="text-right text-gray-900 dark:text-white">
                            {formatCurrency(stat.totalAmount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No payment data available.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;