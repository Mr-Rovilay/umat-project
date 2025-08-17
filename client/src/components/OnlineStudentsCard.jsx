// components/admin/OnlineStudentsCard.jsx
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Wifi, WifiOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartmentOnlineStudentsCount } from '@/redux/slice/departmentAdminSlice';

const OnlineStudentsCard = () => {
  const dispatch = useDispatch();
  const { onlineStudents, isLoading } = useSelector((state) => state.departmentAdmin);
  
  useEffect(() => {
    dispatch(getDepartmentOnlineStudentsCount());
  }, [dispatch]);
  
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          Online Students
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Wifi className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-sm font-medium">Online Now</span>
              </div>
              <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                {onlineStudents.onlineStudentsCount}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-gray-600" />
                <span className="text-sm font-medium">Total Students</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
                {onlineStudents.totalStudentsCount}
              </Badge>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Online Percentage</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                    <div 
                      className="h-2 bg-green-600 rounded-full" 
                      style={{ width: `${onlineStudents.onlinePercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {onlineStudents.onlinePercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OnlineStudentsCard;