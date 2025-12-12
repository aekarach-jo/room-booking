import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/booking.service';
import { Booking } from '../types';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userBookings = await bookingService.getAllBookings(); // Service filters by user
        setBookings(userBookings);
      } catch (err) {
        setError('Failed to fetch bookings.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(id);
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
      } catch (err) {
        setError('Failed to cancel booking.');
      }
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-200 text-yellow-800';
      case 'APPROVED': return 'bg-green-200 text-green-800';
      case 'REJECTED': return 'bg-red-200 text-red-800';
      case 'CANCELLED': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  }

  if (isLoading) return <div>Loading bookings...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
      <div className="bg-white p-8 rounded-lg shadow-md">
        {bookings.length === 0 ? (
          <p>You have no bookings.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.room?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.status === 'PENDING' || booking.status === 'APPROVED' ? (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
