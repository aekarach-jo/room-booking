import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/booking.service';
import { Booking } from '../types';

const HistoryPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllBookings = async () => {
      setIsLoading(true);
      try {
        const allBookings = await bookingService.getAllBookings();
        setBookings(allBookings);
      } catch (err) {
        setError('Failed to fetch booking history.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllBookings();
  }, []);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-200 text-yellow-800';
      case 'APPROVED': return 'bg-green-200 text-green-800';
      case 'REJECTED': return 'bg-red-200 text-red-800';
      case 'CANCELLED': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  }

  if (isLoading) return <div>Loading booking history...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Booking History</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.user?.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.room?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(booking.startTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.adminNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
