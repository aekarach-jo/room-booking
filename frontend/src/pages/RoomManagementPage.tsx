import React, { useState, useEffect } from 'react';
import { roomService } from '../services/room.service';
import { Room } from '../types';

const RoomManagementPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the form (create/edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Partial<Room> | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const allRooms = await roomService.getAllRooms();
      setRooms(allRooms);
    } catch (err) {
      setError('Failed to fetch rooms.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (room: Partial<Room> | null = null) => {
    setCurrentRoom(room ? { ...room } : { name: '', capacity: 10, equipment: '', isActive: true });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRoom(null);
  };

  const handleSave = async () => {
    if (!currentRoom) return;
    
    try {
      if ('id' in currentRoom && currentRoom.id) {
        // Update
        await roomService.updateRoom(currentRoom.id, currentRoom);
      } else {
        // Create
        await roomService.createRoom(currentRoom);
      }
      fetchRooms();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save room.');
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
        try {
            await roomService.deleteRoom(id);
            fetchRooms();
        } catch (err) {
            setError('Failed to delete room. It might have active bookings.');
        }
    }
  }

  if (isLoading) return <div>Loading rooms...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Rooms</h1>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-primary text-white rounded">
          Add New Room
        </button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

      <div className="bg-white p-8 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map(room => (
              <tr key={room.id}>
                <td className="px-6 py-4 whitespace-nowrap">{room.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{room.capacity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${room.isActive ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                    {room.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleOpenModal(room)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentRoom && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{currentRoom.id ? 'Edit' : 'Create'} Room</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm">Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded" 
                      value={currentRoom.name} 
                      onChange={e => setCurrentRoom({...currentRoom, name: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Capacity</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded" 
                      value={currentRoom.capacity} 
                      onChange={e => setCurrentRoom({...currentRoom, capacity: parseInt(e.target.value)})} 
                     />
                  </div>
                  <div>
                    <label className="block text-sm">Equipment</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded" 
                      value={currentRoom.equipment || ''} 
                      onChange={e => setCurrentRoom({...currentRoom, equipment: e.target.value})} 
                    />
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded" 
                      checked={currentRoom.isActive} 
                      onChange={e => setCurrentRoom({...currentRoom, isActive: e.target.checked})}
                    />
                    <label className="ml-2 block text-sm">Active</label>
                  </div>
                </div>
                <div className="flex justify-end items-center px-4 py-3 mt-4">
                    <button onClick={handleSave} className="px-4 py-2 bg-success text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">Save</button>
                    <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-auto ml-2 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">Cancel</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagementPage;
