import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/booking.service';
import { Booking } from '../types';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const API_URL = 'http://localhost:3000';

const AdminApprovalPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    setIsLoading(true);
    try {
      const allBookings = await bookingService.getAllBookings(); // Service returns all for admin
      setBookings(allBookings.filter(b => b.status === 'PENDING'));
    } catch (err) {
      setError('Failed to fetch bookings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await bookingService.approveBooking(id);
      fetchPendingBookings(); // Refresh the list
    } catch (err) {
      setError('Failed to approve booking.');
    }
  };

  const handleReject = async (id: string) => {
    // In a real app, you'd use a modal to get the rejection reason
    const adminNote = prompt('Reason for rejection (optional):');
    try {
      await bookingService.rejectBooking(id, adminNote || '');
      fetchPendingBookings(); // Refresh the list
    } catch (err) {
      setError('Failed to reject booking.');
    }
  };

  const toggleSelectBooking = (id: string) => {
    setSelectedBookings((prev) =>
      prev.includes(id) ? prev.filter((bookingId) => bookingId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(bookings.map((b) => b.id));
    }
  };

  const handleBatchApprove = async () => {
    if (selectedBookings.length === 0) {
      alert('กรุณาเลือกการจองที่ต้องการอนุมัติ');
      return;
    }

    if (!confirm(`ต้องการอนุมัติการจอง ${selectedBookings.length} รายการหรือไม่?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/bookings/batch-approve`,
        { bookingIds: selectedBookings },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('อนุมัติการจองสำเร็จ');
      setSelectedBookings([]);
      fetchPendingBookings();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to batch approve bookings.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">อนุมัติการจอง</h1>
          <p className="text-muted-foreground mt-1">
            รายการจองที่รออนุมัติ {bookings.length > 0 && `(${bookings.length} รายการ)`}
          </p>
        </div>
        {selectedBookings.length > 0 && (
          <Button onClick={handleBatchApprove} size="lg" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            อนุมัติที่เลือก ({selectedBookings.length})
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            รายการรออนุมัติ
          </CardTitle>
          <CardDescription>
            จัดการและอนุมัติการจองห้องเรียน
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">ไม่มีการจองที่รออนุมัติ</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedBookings.length === bookings.length && bookings.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>ผู้จอง</TableHead>
                    <TableHead>ห้อง</TableHead>
                    <TableHead>วันที่และเวลา</TableHead>
                    <TableHead>วัตถุประสงค์</TableHead>
                    <TableHead className="text-right">การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className={selectedBookings.includes(booking.id) ? 'bg-muted/50' : ''}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedBookings.includes(booking.id)}
                          onCheckedChange={() => toggleSelectBooking(booking.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{booking.user?.fullName}</TableCell>
                      <TableCell>{booking.room?.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(booking.startTime).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(booking.startTime).toLocaleTimeString('th-TH', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            -{' '}
                            {new Date(booking.endTime).toLocaleTimeString('th-TH', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{booking.purpose}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(booking.id)}
                            className="gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            อนุมัติ
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(booking.id)}
                            className="gap-1"
                          >
                            <XCircle className="h-3 w-3" />
                            ปฏิเสธ
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminApprovalPage;
