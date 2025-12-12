import React, { useState, useEffect } from 'react';
import { roomService } from '../services/room.service';
import { bookingService } from '../services/booking.service';
import { Room } from '../types';

const BookingPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const allRooms = await roomService.getAllRooms();
        setRooms(allRooms.filter(r => r.isActive));
      } catch (err) {
        setError('Failed to fetch rooms.');
      }
    };
    fetchRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!selectedRoom || !startTime || !endTime || !purpose) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      await bookingService.createBooking({
        roomId: selectedRoom,
        date: startTime, // Date is derived from startTime
        startTime,
        endTime,
        purpose,
        attendees,
      });
      setSuccess('Booking created successfully!');
      // Reset form
      setSelectedRoom('');
      setStartTime('');
      setEndTime('');
      setPurpose('');
      setAttendees(1);
    } catch (err) {
      setError('Failed to create booking. The room might be unavailable at this time.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Book a Room</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>}
          {success && <p className="text-green-500 bg-green-100 p-3 rounded">{success}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Room</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a room</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name} (Capacity: {room.capacity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Attendees</label>
            <input type="number" min="1" value={attendees} onChange={(e) => setAttendees(parseInt(e.target.value, 10))} className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Purpose</label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              rows={3}
              required
            ></textarea>
          </div>

          <button type="submit" className="w-full py-2 px-4 bg-primary text-white font-bold rounded-md hover:bg-blue-800">
            Submit Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
