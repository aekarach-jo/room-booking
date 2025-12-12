import React, { useState, useEffect } from 'react';
import { roomService } from '../services/room.service';
import { Room } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit2, Trash2, DoorOpen, Users, Package, AlertCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RoomManagementPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // State for the form (create/edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Partial<Room> | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredRooms(
        rooms.filter(room =>
          room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.equipment?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredRooms(rooms);
    }
  }, [searchQuery, rooms]);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const allRooms = await roomService.getAllRooms();
      setRooms(allRooms);
      setFilteredRooms(allRooms);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลห้องได้');
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลห้องได้"
      });
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
        await roomService.updateRoom(currentRoom.id, currentRoom);
        toast({
          title: "สำเร็จ",
          description: "อัพเดทข้อมูลห้องเรียบร้อยแล้ว"
        });
      } else {
        await roomService.createRoom(currentRoom);
        toast({
          title: "สำเร็จ",
          description: "เพิ่มห้องใหม่เรียบร้อยแล้ว"
        });
      }
      fetchRooms();
      handleCloseModal();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้"
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบห้องนี้?')) {
        try {
            await roomService.deleteRoom(id);
            toast({
              title: "สำเร็จ",
              description: "ลบห้องเรียบร้อยแล้ว"
            });
            fetchRooms();
        } catch (err) {
            toast({
              variant: "destructive",
              title: "เกิดข้อผิดพลาด",
              description: "ไม่สามารถลบห้องได้ อาจมีการจองที่ใช้งานอยู่"
            });
        }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดการห้องเรียน</h1>
          <p className="text-muted-foreground mt-1">จัดการข้อมูลห้องเรียนและอุปกรณ์</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 shadow-md">
          <Plus className="h-4 w-4" />
          เพิ่มห้องใหม่
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DoorOpen className="h-5 w-5" />
                รายการห้องเรียน
              </CardTitle>
              <CardDescription className="mt-1">
                จำนวนห้องทั้งหมด {rooms.length} ห้อง
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ค้นหาห้อง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อห้อง</TableHead>
                  <TableHead>ความจุ</TableHead>
                  <TableHead>อุปกรณ์</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      <DoorOpen className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      {searchQuery ? 'ไม่พบห้องที่ค้นหา' : 'ยังไม่มีข้อมูลห้อง'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRooms.map(room => (
                    <TableRow key={room.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <DoorOpen className="h-5 w-5 text-primary" />
                          </div>
                          {room.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{room.capacity} คน</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {room.equipment || 'ไม่ระบุ'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={room.isActive ? 'default' : 'secondary'}>
                          {room.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleOpenModal(room)}
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            แก้ไข
                          </Button>
                          <Button
                            onClick={() => handleDelete(room.id)}
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            ลบ
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DoorOpen className="h-5 w-5" />
              {currentRoom?.id ? 'แก้ไขข้อมูลห้อง' : 'เพิ่มห้องใหม่'}
            </DialogTitle>
            <DialogDescription>
              {currentRoom?.id ? 'แก้ไขข้อมูลห้องเรียน' : 'เพิ่มห้องเรียนใหม่เข้าสู่ระบบ'}
            </DialogDescription>
          </DialogHeader>
          {currentRoom && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อห้อง</Label>
                <Input
                  id="name"
                  value={currentRoom.name}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, name: e.target.value })}
                  placeholder="เช่น ห้อง 101"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">ความจุ (คน)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={currentRoom.capacity}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, capacity: parseInt(e.target.value) })}
                  placeholder="จำนวนที่นั่ง"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment">อุปกรณ์</Label>
                <Input
                  id="equipment"
                  value={currentRoom.equipment || ''}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, equipment: e.target.value })}
                  placeholder="เช่น โปรเจคเตอร์, ไมค์"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={currentRoom.isActive}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  เปิดใช้งานห้องนี้
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              ยกเลิก
            </Button>
            <Button onClick={handleSave}>
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomManagementPage;
