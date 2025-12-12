# 🏫 Back Office Plan: ระบบจองห้องเรียนสำหรับตึกสาขาวิชา

**สร้างเมื่อ:** 5 ธันวาคม 2025
**บริบท:** ระบบใช้ภายในตึกสาขาวิชาเดียวในมหาวิทยาลัย

---

## 📋 สารบัญ

1. [สรุปภาพรวม](#สรุปภาพรวม)
2. [User Roles ที่ต้องปรับปรุง](#user-roles-ที่ต้องปรับปรุง)
3. [ฟีเจอร์ที่ทำไปแล้ว](#ฟีเจอร์ที่ทำไปแล้ว)
4. [ฟีเจอร์ที่ต้องเพิ่ม Priority 1](#ฟีเจอร์ที่ต้องเพิ่ม-priority-1)
5. [ฟีเจอร์ที่ต้องเพิ่ม Priority 2](#ฟีเจอร์ที่ต้องเพิ่ม-priority-2)
6. [ฟีเจอร์ที่ต้องเพิ่ม Priority 3](#ฟีเจอร์ที่ต้องเพิ่ม-priority-3)
7. [Database Schema ที่ต้องปรับปรุง](#database-schema-ที่ต้องปรับปรุง)
8. [API Endpoints ที่ต้องเพิ่ม](#api-endpoints-ที่ต้องเพิ่ม)
9. [Roadmap การพัฒนา](#roadmap-การพัฒนา)

---

## สรุปภาพรวม

### ✅ สถานะปัจจุบัน
โปรเจคมีระบบพื้นฐานครบแล้ว:
- Authentication (JWT)
- User/Room/Booking CRUD
- Admin approval system
- Frontend pages ครบทุกหน้า

### ⚠️ ปัญหาที่พบ
1. **ไม่มีหน้า User Management** - มี API แล้วแต่ไม่มี UI
2. **Role จำกัด** - มีแค่ USER/ADMIN ไม่เหมาะกับมหาวิทยาลัย
3. **ไม่มี Calendar View** - ดูตารางการจองยาก
4. **ไม่มีปฏิทินวิชาการ** - ไม่สามารถบล็อกวันสอบ/วันหยุด
5. **Dashboard ไม่มีสถิติ** - ข้อมูลน้อยเกินไป
6. **ไม่มีระบบ Recurring Booking** - อาจารย์จองซ้ำยาก

---

## User Roles ที่ต้องปรับปรุง

### 🔴 ปัจจุบัน (2 roles)
```typescript
enum Role {
  USER   // นักศึกษา
  ADMIN  // เจ้าหน้าที่
}
```

### 🟢 ควรเป็น (4 roles)
```typescript
enum Role {
  STUDENT          // นักศึกษา - จองต้องรอ approve
  TEACHER          // อาจารย์ - auto-approve, priority booking
  STAFF            // เจ้าหน้าที่ - approve bookings
  DEPARTMENT_HEAD  // หัวหน้าภาควิชา - view reports only
}
```

### สิทธิ์การใช้งาน

| ฟีเจอร์ | STUDENT | TEACHER | STAFF | DEPARTMENT_HEAD |
|---------|---------|---------|-------|-----------------|
| จองห้อง | ✅ (รอ approve) | ✅ (auto-approve) | ✅ | ❌ |
| ยกเลิกการจอง | ✅ (ของตัวเอง) | ✅ (ของตัวเอง) | ✅ (ทั้งหมด) | ❌ |
| อนุมัติการจอง | ❌ | ❌ | ✅ | ❌ |
| จัดการห้อง | ❌ | ❌ | ✅ | ❌ |
| จัดการผู้ใช้ | ❌ | ❌ | ✅ | ❌ |
| ดูรายงาน | ❌ | ❌ | ✅ | ✅ |
| Recurring Booking | ❌ | ✅ | ✅ | ❌ |
| Priority Booking | ❌ | ✅ | ✅ | ❌ |

---

## ฟีเจอร์ที่ทำไปแล้ว

### ✅ Backend
- [x] Authentication (Login/Register/JWT)
- [x] User CRUD API
- [x] Room CRUD API
- [x] Booking CRUD API
- [x] Approve/Reject/Cancel booking
- [x] Check available rooms
- [x] Role-based access control (USER/ADMIN)

### ✅ Frontend
- [x] Login/Register pages
- [x] Dashboard (basic)
- [x] Booking page
- [x] My bookings page
- [x] Admin approval page
- [x] Room management page
- [x] History page
- [x] Protected routes

### ⚠️ ส่วนที่ขาดหายไป
- [ ] **User Management UI** - มี API แล้วแต่ไม่มีหน้า
- [ ] Calendar view
- [ ] Advanced dashboard with statistics
- [ ] Reports & Export
- [ ] Academic calendar
- [ ] Recurring booking

---

## ฟีเจอร์ที่ต้องเพิ่ม Priority 1

### 1. 👥 User Management Page (จำเป็นมาก!)

**ปัญหา:** มี API แล้ว (`GET/POST/PATCH/DELETE /users`) แต่ไม่มีหน้า UI

**ต้องสร้าง:**
- หน้าแสดงรายชื่อผู้ใช้ทั้งหมด (Table)
- Search by name, username, studentId
- Filter by role, year, department
- View/Edit/Delete user
- Change user role
- Active/Inactive status
- **Bulk Import** - Import นักศึกษาจาก CSV

**UI Components ที่ต้องสร้าง:**
```
/frontend/src/pages/
  └── UserManagementPage.tsx        (ใหม่)

/frontend/src/components/
  └── UserTable.tsx                 (ใหม่)
  └── UserFormModal.tsx             (ใหม่)
  └── ImportCSVModal.tsx            (ใหม่)
```

**API ที่มีอยู่แล้ว:**
- ✅ `GET /users` - Get all users
- ✅ `GET /users/:id` - Get user by ID
- ✅ `PATCH /users/:id` - Update user
- ✅ `DELETE /users/:id` - Delete user

**API ที่ต้องเพิ่ม:**
- ❌ `POST /users/import` - Bulk import from CSV

---

### 2. 📅 Weekly Calendar View (สำคัญมาก!)

**ปัญหา:** ตอนนี้ดูการจองแบบ list/table ยาก ไม่เห็นภาพรวม

**ต้องสร้าง:**
- ตารางรายสัปดาห์ (Weekly Grid)
- แสดงทุกห้อง แบ่งตามช่วงเวลา
- Color coding:
  - 🟢 Available (ว่าง)
  - 🟡 Pending (รอ approve)
  - 🔵 Approved (อนุมัติแล้ว)
  - 🔴 Occupied (กำลังใช้งาน)
  - ⚫ Maintenance (ปิดปรับปรุง)
- Click เพื่อดูรายละเอียด
- Print/Export ตาราง

**UI ตัวอย่าง:**
```
┌─────────────────────────────────────────────┐
│ 📅 ตารางการจองห้อง | สัปดาห์ 1-7 ธ.ค. 2025 │
├─────────────────────────────────────────────┤
│      │ จันทร์│ อังคาร│ พุธ   │ พฤหัส│ ศุกร์│
├──────┼───────┼───────┼───────┼──────┼─────┤
│ห้อง  │       │       │       │      │     │
│301   │🔵 8-12│🟡 8-10│🔵 8-12│🟢    │🔴 9-13│
│      │อ.สมชาย│รอapprove│อ.สมหญิง│  │นักศึกษา│
├──────┼───────┼───────┼───────┼──────┼─────┤
│ห้อง  │       │       │       │      │     │
│302   │🔵 8-16│🔵 8-12│⚫ ปิด │🟢    │🟢   │
│      │Lab    │Lab    │Maint. │      │     │
└──────┴───────┴───────┴───────┴──────┴─────┘
```

**UI Components ที่ต้องสร้าง:**
```
/frontend/src/pages/
  └── CalendarViewPage.tsx          (ใหม่)

/frontend/src/components/
  └── WeeklyCalendar.tsx            (ใหม่)
  └── CalendarCell.tsx              (ใหม่)
  └── BookingPopup.tsx              (ใหม่)
```

**API ที่ต้องเพิ่ม:**
- ❌ `GET /bookings/calendar?startDate=xxx&endDate=xxx` - Get bookings for calendar view

---

### 3. ✅ Quick Approval Dashboard (ปรับปรุงหน้าเดิม)

**ปัญหา:** หน้า Admin Approval มีอยู่แล้ว แต่ต้องปรับให้ใช้งานง่ายขึ้น

**ต้องปรับปรุง:**
- เพิ่ม **Batch Approval** - เลือกหลายรายการอนุมัติพร้อมกัน
- แสดงข้อมูลผู้จอง (ชื่อ, รหัสนักศึกษา, สาขา, ชั้นปี)
- แจ้งเตือน **Conflict** - ถ้าเวลาทับซ้อน
- เรียงตาม **Priority:**
  1. URGENT (วันนี้/พรุ่งนี้)
  2. Pending นานที่สุด
- เพิ่ม Quick Actions:
  - ✅ อนุมัติ
  - ❌ ปฏิเสธ
  - 💬 ถามข้อมูลเพิ่มเติม (comment)
  - 📞 ติดต่อผู้จอง

**UI Components ที่ต้องปรับปรุง:**
```
/frontend/src/pages/
  └── AdminApprovalPage.tsx         (ปรับปรุง)
```

**Features ที่ต้องเพิ่ม:**
- Checkbox สำหรับ batch selection
- Filter: Today, Tomorrow, This Week
- Sort: Urgent first, Oldest first
- Conflict warning badge

---

### 4. 🎓 Role: TEACHER (ต้องเพิ่ม!)

**ปัญหา:** ตอนนี้มีแค่ USER/ADMIN อาจารย์ถูกจัดเป็น USER ไม่เหมาะสม

**ต้องปรับ Database Schema:**
```prisma
// backend/prisma/schema.prisma
enum Role {
  STUDENT          // เดิมคือ USER
  TEACHER          // ใหม่
  STAFF            // เดิมคือ ADMIN
  DEPARTMENT_HEAD  // ใหม่
}

model User {
  id          String   @id @default(cuid())
  username    String   @unique
  password    String
  fullName    String
  studentId   String?  // สำหรับ STUDENT
  teacherId   String?  // ใหม่ - สำหรับ TEACHER
  department  String?  // ใหม่ - ภาควิชา/สาขา
  year        Int?     // ใหม่ - ชั้นปี (สำหรับ STUDENT)
  role        Role     @default(STUDENT)
  isActive    Boolean  @default(true)  // ใหม่
  createdAt   DateTime @default(now())
  bookings    Booking[]
}
```

**Business Logic ที่ต้องเพิ่ม:**
- TEACHER จอง → **Auto-approve** (ไม่ต้องรอ STAFF)
- TEACHER มี **Priority booking** (จองล่วงหน้าได้นานกว่า)
- TEACHER สามารถ **Recurring booking** (จองซ้ำรายสัปดาห์)

**Backend ที่ต้องแก้:**
```
/backend/src/bookings/bookings.service.ts
  - แก้ logic: ถ้า user.role === TEACHER → status = APPROVED

/backend/src/auth/guards/roles.guard.ts
  - เพิ่ม roles: TEACHER, DEPARTMENT_HEAD
```

---

### 5. 📆 Academic Calendar (สำคัญมาก!)

**ปัญหา:** ไม่มีปฏิทินวิชาการ ไม่สามารถบล็อกวันสอบ/วันหยุดได้

**ต้องสร้าง:**
- **Semester Management**
  - เทอม 1/2025, เทอม 2/2025, Summer 2025
  - วันเปิด-ปิดเทอม

- **Special Dates**
  - วันสอบกลางภาค (บางห้องปิด)
  - วันสอบปลายภาค (บางห้องปิด)
  - วันหยุดนักขัตฤกษ์
  - วันพิธีการ/งานพิเศษ

- **Block Booking**
  - STAFF สามารถบล็อกห้อง/วันทั้งหมด
  - ระบุเหตุผล (เช่น "สอบปลายภาค", "งานสัมมนา")

**Database Schema ที่ต้องเพิ่ม:**
```prisma
model Semester {
  id        String   @id @default(cuid())
  name      String   // "เทอม 1/2025"
  startDate DateTime
  endDate   DateTime
  isActive  Boolean  @default(false)
  createdAt DateTime @default(now())
}

model SpecialDate {
  id          String   @id @default(cuid())
  name        String   // "สอบกลางภาค"
  date        DateTime
  type        SpecialDateType  // HOLIDAY, EXAM, EVENT
  description String?
  semesterId  String?
  semester    Semester? @relation(fields: [semesterId], references: [id])
}

enum SpecialDateType {
  HOLIDAY  // วันหยุด - ปิดทั้งหมด
  EXAM     // วันสอบ - บางห้องปิด
  EVENT    // งานพิเศษ - block booking
}
```

**UI Components ที่ต้องสร้าง:**
```
/frontend/src/pages/
  └── AcademicCalendarPage.tsx      (ใหม่)
  └── SemesterManagementPage.tsx    (ใหม่)

/frontend/src/components/
  └── CalendarMonth.tsx             (ใหม่)
  └── SpecialDateForm.tsx           (ใหม่)
```

**API ที่ต้องเพิ่ม:**
```
Semesters:
  POST   /semesters              - Create semester
  GET    /semesters              - Get all semesters
  PATCH  /semesters/:id          - Update semester
  DELETE /semesters/:id          - Delete semester
  PATCH  /semesters/:id/activate - Set as active semester

Special Dates:
  POST   /special-dates          - Create special date
  GET    /special-dates          - Get all special dates
  GET    /special-dates?month=12&year=2025  - Get by month
  PATCH  /special-dates/:id      - Update special date
  DELETE /special-dates/:id      - Delete special date
```

---

## ฟีเจอร์ที่ต้องเพิ่ม Priority 2

### 6. 📊 Advanced Dashboard

**ต้องปรับปรุง Dashboard ปัจจุบันให้มีสถิติ:**

**สำหรับ STAFF:**
- **Quick Stats Cards:**
  - 📊 Total bookings (ทั้งหมด)
  - ⏳ Pending (รอ approve)
  - ✅ Approved today (วันนี้)
  - 🟢 Available rooms (ห้องว่างตอนนี้)

- **Charts:**
  - 📈 Booking trend (7 วันล่าสุด) - Line chart
  - 🏆 Top 5 rooms (ห้องที่ถูกใช้บ่อย) - Bar chart
  - ⏰ Peak hours (ช่วงเวลาที่จองบ่อย) - Bar chart
  - 👥 Booking by role (STUDENT/TEACHER) - Pie chart

- **Recent Activity:**
  - 5 รายการล่าสุด (bookings/approvals/cancellations)

**สำหรับ DEPARTMENT_HEAD:**
- **Monthly Summary:**
  - จำนวนการจองรายเดือน
  - อัตราการใช้งานห้อง (%)
  - Top users

- **Semester Comparison:**
  - เปรียบเทียบกับภาคเรียนก่อน

**API ที่ต้องเพิ่ม:**
```
GET /analytics/dashboard-stats
  Response: {
    totalBookings: number,
    pendingBookings: number,
    approvedToday: number,
    availableRooms: number,
    bookingTrend: { date: string, count: number }[],
    topRooms: { roomName: string, count: number }[],
    peakHours: { hour: string, count: number }[],
    bookingByRole: { role: string, count: number }[]
  }
```

---

### 7. 🏫 Room Categories & Details

**ต้องปรับปรุง Room Management:**

**เพิ่มข้อมูลห้อง:**
- **Room Type:**
  - 📚 Lecture Room (ห้องบรรยาย)
  - 💻 Computer Lab (ห้องปฏิบัติการคอมพิวเตอร์)
  - 🔬 Laboratory (ห้องปฏิบัติการวิทยาศาสตร์)
  - 👥 Meeting Room (ห้องประชุม)
  - 📖 Study Room (ห้องสมุดย่อย)

- **Details:**
  - Floor (ชั้น) - 3, 4, 5
  - Building (ตึก) - ถ้ามีหลายตึก
  - Equipment (อุปกรณ์):
    - ✅ Projector (โปรเจคเตอร์)
    - ✅ Sound System (เครื่องเสียง)
    - ✅ Air Conditioner (แอร์)
    - ✅ Whiteboard (กระดาน)
    - ✅ Computers (คอมพิวเตอร์)

- **Availability Rules:**
  - เวลาเปิด-ปิด (เช่น 08:00-20:00)
  - วันหยุด (เสาร์-อาทิตย์)
  - Max booking duration (สูงสุดกี่ชั่วโมง/ครั้ง)
  - Advance booking limit (จองล่วงหน้าได้กี่วัน)

- **Maintenance Mode:**
  - ปิดห้องชั่วคราว
  - กำหนดวันที่ปิด-เปิด
  - ระบุเหตุผล

**Database Schema ที่ต้องปรับ:**
```prisma
model Room {
  id          String   @id @default(cuid())
  name        String   // "ห้อง 301"
  type        RoomType @default(LECTURE)      // ใหม่
  floor       Int?                            // ใหม่
  building    String?                         // ใหม่
  capacity    Int
  equipment   Json?    // ["projector", "ac", "whiteboard"]
  description String?                         // ใหม่

  // Availability
  openTime    String?  @default("08:00")      // ใหม่
  closeTime   String?  @default("20:00")      // ใหม่
  isActive    Boolean  @default(true)

  // Booking Rules
  maxBookingHours Int? @default(3)            // ใหม่
  advanceBookingDays Int? @default(7)         // ใหม่
  requireApproval Boolean @default(true)      // ใหม่

  bookings    Booking[]
  maintenances RoomMaintenance[]              // ใหม่
}

enum RoomType {
  LECTURE       // ห้องบรรยาย
  COMPUTER_LAB  // ห้องคอมพิวเตอร์
  LABORATORY    // ห้องปฏิบัติการ
  MEETING       // ห้องประชุม
  STUDY         // ห้องสมุดย่อย
}

model RoomMaintenance {
  id        String   @id @default(cuid())
  roomId    String
  room      Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)
  startDate DateTime
  endDate   DateTime
  reason    String
  createdAt DateTime @default(now())
}
```

---

### 8. 📄 Reports & Export

**ต้องสร้างหน้ารายงาน:**

**Types of Reports:**
1. **Booking Summary Report**
   - Date range: วันที่ x - วันที่ y
   - Total bookings
   - Approved/Rejected/Cancelled
   - By room, by user, by role

2. **Room Utilization Report**
   - อัตราการใช้งานแต่ละห้อง (%)
   - Available hours vs Booked hours
   - Peak hours per room

3. **User Activity Report**
   - Top 10 users (จองบ่อยที่สุด)
   - By department/year
   - No-show statistics

4. **Monthly/Semester Report**
   - สรุปรายเดือน/ภาคเรียน
   - Comparison with previous period
   - Trends and insights

**Export Formats:**
- 📥 CSV
- 📥 Excel (.xlsx)
- 📄 PDF (print-friendly)

**UI Components ที่ต้องสร้าง:**
```
/frontend/src/pages/
  └── ReportsPage.tsx               (ใหม่)

/frontend/src/components/
  └── ReportFilters.tsx             (ใหม่)
  └── ReportTable.tsx               (ใหม่)
  └── ExportButtons.tsx             (ใหม่)
```

**API ที่ต้องเพิ่ม:**
```
GET /reports/bookings?startDate=xxx&endDate=xxx&format=json
GET /reports/rooms-utilization?startDate=xxx&endDate=xxx
GET /reports/users-activity?startDate=xxx&endDate=xxx
GET /reports/export?type=bookings&format=csv|xlsx|pdf
```

---

### 9. 🔄 Recurring Booking (สำหรับอาจารย์)

**Use Case:** อาจารย์สอนวิชา X ต้องการห้อง 301 ทุกวันจันทร์ 09:00-12:00 ตลอดภาคเรียน

**ต้องสร้าง:**
- UI สำหรับสร้าง Recurring Booking
- เลือก Pattern:
  - Daily (ทุกวัน)
  - Weekly (ทุกสัปดาห์ - เลือกวัน)
  - Custom
- เลือก End Date หรือ Number of occurrences
- Auto-generate bookings
- Edit/Delete options:
  - ครั้งเดียว (This occurrence)
  - ทั้งหมด (All occurrences)
  - ตั้งแต่นี้ไป (This and following)

**Database Schema ที่ต้องเพิ่ม:**
```prisma
model RecurringBooking {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  roomId        String
  room          Room     @relation(fields: [roomId], references: [id])

  startDate     DateTime
  endDate       DateTime?

  pattern       RecurringPattern  // DAILY, WEEKLY, CUSTOM
  daysOfWeek    Json?    // [1,3,5] = จันทร์, พุธ, ศุกร์

  startTime     String
  endTime       String
  purpose       String

  createdAt     DateTime @default(now())
  bookings      Booking[] // Generated bookings
}

enum RecurringPattern {
  DAILY
  WEEKLY
  CUSTOM
}

model Booking {
  // ... existing fields ...

  recurringBookingId String?              // ใหม่
  recurringBooking   RecurringBooking? @relation(fields: [recurringBookingId], references: [id])
}
```

**API ที่ต้องเพิ่ม:**
```
POST   /recurring-bookings          - Create recurring booking
GET    /recurring-bookings          - Get all recurring bookings
GET    /recurring-bookings/:id      - Get recurring booking details
PATCH  /recurring-bookings/:id      - Update recurring booking
DELETE /recurring-bookings/:id      - Delete recurring booking (and all future occurrences)
```

---

## ฟีเจอร์ที่ต้องเพิ่ม Priority 3

### 10. ✅ Check-in/Check-out System

**Use Case:** ตรวจสอบว่านักศึกษามาใช้ห้องจริงหรือไม่

**ต้องสร้าง:**
- QR Code per booking
- Scan to check-in (ผ่าน mobile)
- Button check-in (ในหน้า My Bookings)
- แจ้งเตือนถ้า No-show (จองแล้วไม่มา)
- Report No-show statistics

**Database Schema ที่ต้องเพิ่ม:**
```prisma
model Booking {
  // ... existing fields ...

  checkInTime  DateTime?  // ใหม่
  checkOutTime DateTime?  // ใหม่
  isNoShow     Boolean @default(false)  // ใหม่
}
```

---

### 11. 🔔 Notification System

**Types of Notifications:**
- 📧 Email notifications
- 🔔 In-app notifications

**Events:**
- Booking approved
- Booking rejected (with admin note)
- Reminder 1 hour before booking
- Booking cancelled
- Room maintenance scheduled
- New announcement

**Database Schema ที่ต้องเพิ่ม:**
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  type      NotificationType
  title     String
  message   String

  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}

enum NotificationType {
  BOOKING_APPROVED
  BOOKING_REJECTED
  BOOKING_REMINDER
  BOOKING_CANCELLED
  ROOM_MAINTENANCE
  ANNOUNCEMENT
}
```

---

### 12. 📢 Announcements

**Use Case:** STAFF ต้องการประกาศข่าวสำคัญ เช่น "วันที่ 20 ธ.ค. ปิดระบบเพื่อปรับปรุง"

**ต้องสร้าง:**
- หน้าจัดการประกาศ (STAFF)
- แสดงประกาศบน Dashboard
- Schedule announcements (เผยแพร่ในวันที่กำหนด)
- Pin important announcements

**Database Schema ที่ต้องเพิ่ม:**
```prisma
model Announcement {
  id          String   @id @default(cuid())
  title       String
  content     String
  type        AnnouncementType @default(INFO)
  isPinned    Boolean  @default(false)
  publishDate DateTime @default(now())
  expiryDate  DateTime?
  createdBy   String
  creator     User     @relation(fields: [createdBy], references: [id])
  createdAt   DateTime @default(now())
}

enum AnnouncementType {
  INFO      // ข่าวสาร
  WARNING   // คำเตือน
  URGENT    // เร่งด่วน
}
```

---

### 13. ⚠️ No-show Penalty System

**Use Case:** นักศึกษาจองแล้วไม่มาบ่อย ต้องมีมาตรการ

**ต้องสร้าง:**
- ระบบนับ No-show
- Warning ที่ 3 ครั้ง
- Suspend การจอง 7 วัน ที่ 5 ครั้ง
- แสดงประวัติ No-show

**Database Schema ที่ต้องเพิ่ม:**
```prisma
model User {
  // ... existing fields ...

  noShowCount     Int      @default(0)      // ใหม่
  isSuspended     Boolean  @default(false)  // ใหม่
  suspendedUntil  DateTime?                 // ใหม่
}
```

**Business Logic:**
- No-show count >= 3 → Warning
- No-show count >= 5 → Suspend 7 days
- No-show count reset ทุกภาคเรียน

---

## Database Schema ที่ต้องปรับปรุง

### 📝 สรุปการเปลี่ยนแปลง Schema

```prisma
// backend/prisma/schema.prisma

// 1. Update User model
model User {
  id              String    @id @default(cuid())
  username        String    @unique
  password        String
  fullName        String

  // Role-specific IDs
  studentId       String?   // สำหรับ STUDENT
  teacherId       String?   // ใหม่ - สำหรับ TEACHER

  // Additional Info
  department      String?   // ใหม่ - ภาควิชา/สาขา
  year            Int?      // ใหม่ - ชั้นปี (1-4) สำหรับ STUDENT

  role            Role      @default(STUDENT)
  isActive        Boolean   @default(true)    // ใหม่

  // No-show tracking
  noShowCount     Int       @default(0)       // ใหม่
  isSuspended     Boolean   @default(false)   // ใหม่
  suspendedUntil  DateTime?                   // ใหม่

  createdAt       DateTime  @default(now())

  // Relations
  bookings          Booking[]
  recurringBookings RecurringBooking[]        // ใหม่
  notifications     Notification[]            // ใหม่
  announcements     Announcement[]            // ใหม่
}

// 2. Update Role enum
enum Role {
  STUDENT          // เดิมคือ USER
  TEACHER          // ใหม่
  STAFF            // เดิมคือ ADMIN
  DEPARTMENT_HEAD  // ใหม่
}

// 3. Update Room model
model Room {
  id                String    @id @default(cuid())
  name              String
  type              RoomType  @default(LECTURE)    // ใหม่
  floor             Int?                           // ใหม่
  building          String?                        // ใหม่
  capacity          Int
  equipment         Json?     // ["projector", "ac", "whiteboard"]
  description       String?                        // ใหม่

  // Availability
  openTime          String?   @default("08:00")    // ใหม่
  closeTime         String?   @default("20:00")    // ใหม่
  isActive          Boolean   @default(true)

  // Booking Rules
  maxBookingHours   Int?      @default(3)          // ใหม่
  advanceBookingDays Int?     @default(7)          // ใหม่
  requireApproval   Boolean   @default(true)       // ใหม่

  // Relations
  bookings          Booking[]
  recurringBookings RecurringBooking[]             // ใหม่
  maintenances      RoomMaintenance[]              // ใหม่
}

// 4. New RoomType enum
enum RoomType {
  LECTURE       // ห้องบรรยาย
  COMPUTER_LAB  // ห้องคอมพิวเตอร์
  LABORATORY    // ห้องปฏิบัติการ
  MEETING       // ห้องประชุม
  STUDY         // ห้องสมุดย่อย
}

// 5. Update Booking model
model Booking {
  id          String        @id @default(cuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id])
  roomId      String
  room        Room          @relation(fields: [roomId], references: [id])

  date        DateTime
  startTime   String
  endTime     String
  purpose     String
  attendees   Int

  status      BookingStatus @default(PENDING)
  adminNote   String?

  // Check-in tracking
  checkInTime  DateTime?                          // ใหม่
  checkOutTime DateTime?                          // ใหม่
  isNoShow     Boolean      @default(false)       // ใหม่

  // Recurring booking
  recurringBookingId String?                      // ใหม่
  recurringBooking   RecurringBooking? @relation(fields: [recurringBookingId], references: [id])

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

// 6. New RecurringBooking model
model RecurringBooking {
  id          String           @id @default(cuid())
  userId      String
  user        User             @relation(fields: [userId], references: [id])
  roomId      String
  room        Room             @relation(fields: [roomId], references: [id])

  startDate   DateTime
  endDate     DateTime?

  pattern     RecurringPattern  // DAILY, WEEKLY, CUSTOM
  daysOfWeek  Json?    // [1,3,5] = จันทร์, พุธ, ศุกร์

  startTime   String
  endTime     String
  purpose     String

  createdAt   DateTime         @default(now())

  // Generated bookings
  bookings    Booking[]
}

enum RecurringPattern {
  DAILY
  WEEKLY
  CUSTOM
}

// 7. New RoomMaintenance model
model RoomMaintenance {
  id        String   @id @default(cuid())
  roomId    String
  room      Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)
  startDate DateTime
  endDate   DateTime
  reason    String
  createdAt DateTime @default(now())
}

// 8. New Semester model
model Semester {
  id          String        @id @default(cuid())
  name        String        // "เทอม 1/2025"
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean       @default(false)
  createdAt   DateTime      @default(now())
  specialDates SpecialDate[]
}

// 9. New SpecialDate model
model SpecialDate {
  id          String          @id @default(cuid())
  name        String          // "สอบกลางภาค"
  date        DateTime
  type        SpecialDateType
  description String?
  semesterId  String?
  semester    Semester?       @relation(fields: [semesterId], references: [id])
}

enum SpecialDateType {
  HOLIDAY  // วันหยุด - ปิดทั้งหมด
  EXAM     // วันสอบ - บางห้องปิด
  EVENT    // งานพิเศษ - block booking
}

// 10. New Notification model
model Notification {
  id        String           @id @default(cuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id])

  type      NotificationType
  title     String
  message   String

  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())
}

enum NotificationType {
  BOOKING_APPROVED
  BOOKING_REJECTED
  BOOKING_REMINDER
  BOOKING_CANCELLED
  ROOM_MAINTENANCE
  ANNOUNCEMENT
}

// 11. New Announcement model
model Announcement {
  id          String           @id @default(cuid())
  title       String
  content     String
  type        AnnouncementType @default(INFO)
  isPinned    Boolean          @default(false)
  publishDate DateTime         @default(now())
  expiryDate  DateTime?
  createdBy   String
  creator     User             @relation(fields: [createdBy], references: [id])
  createdAt   DateTime         @default(now())
}

enum AnnouncementType {
  INFO      // ข่าวสาร
  WARNING   // คำเตือน
  URGENT    // เร่งด่วน
}
```

---

## API Endpoints ที่ต้องเพิ่ม

### 📋 สรุป API ใหม่ทั้งหมด

```typescript
// ===== Users Management =====
POST   /users/import                    // Bulk import from CSV

// ===== Bookings =====
GET    /bookings/calendar?startDate=xxx&endDate=xxx  // For calendar view
PATCH  /bookings/batch-approve          // Batch approval
POST   /bookings/:id/check-in           // Check-in
POST   /bookings/:id/check-out          // Check-out

// ===== Recurring Bookings =====
POST   /recurring-bookings              // Create recurring booking
GET    /recurring-bookings              // Get all
GET    /recurring-bookings/:id          // Get by ID
PATCH  /recurring-bookings/:id          // Update
DELETE /recurring-bookings/:id          // Delete (+ future bookings)

// ===== Rooms =====
POST   /rooms/:id/maintenance           // Schedule maintenance
GET    /rooms/:id/maintenance           // Get maintenance schedule
DELETE /rooms/:id/maintenance/:maintenanceId  // Cancel maintenance

// ===== Semesters =====
POST   /semesters                       // Create semester
GET    /semesters                       // Get all
GET    /semesters/active                // Get active semester
PATCH  /semesters/:id                   // Update
DELETE /semesters/:id                   // Delete
PATCH  /semesters/:id/activate          // Set as active

// ===== Special Dates =====
POST   /special-dates                   // Create special date
GET    /special-dates                   // Get all
GET    /special-dates?month=12&year=2025  // Get by month
PATCH  /special-dates/:id               // Update
DELETE /special-dates/:id               // Delete

// ===== Analytics & Reports =====
GET    /analytics/dashboard-stats       // Dashboard statistics
GET    /reports/bookings?startDate=xxx&endDate=xxx
GET    /reports/rooms-utilization?startDate=xxx&endDate=xxx
GET    /reports/users-activity?startDate=xxx&endDate=xxx
GET    /reports/export?type=bookings&format=csv|xlsx|pdf

// ===== Notifications =====
GET    /notifications                   // Get user's notifications
PATCH  /notifications/:id/read          // Mark as read
PATCH  /notifications/read-all          // Mark all as read
DELETE /notifications/:id               // Delete notification

// ===== Announcements =====
POST   /announcements                   // Create announcement (STAFF only)
GET    /announcements                   // Get all active announcements
GET    /announcements/:id               // Get by ID
PATCH  /announcements/:id               // Update (STAFF only)
DELETE /announcements/:id               // Delete (STAFF only)
PATCH  /announcements/:id/pin           // Pin announcement
```

---

## Roadmap การพัฒนา

### 🎯 Phase 1: Critical Features (สัปดาห์ที่ 1-2)

**Week 1:**
- [ ] ปรับ Database Schema (User roles, Room details)
- [ ] Run migration
- [ ] Update Backend APIs สำหรับ Role ใหม่
- [ ] สร้าง User Management Page (Frontend)
- [ ] ทดสอบ User CRUD

**Week 2:**
- [ ] สร้าง Academic Calendar (Backend + Frontend)
- [ ] สร้าง Semester & Special Dates management
- [ ] สร้าง Weekly Calendar View
- [ ] ปรับปรุง Approval Dashboard (Batch approval)
- [ ] ทดสอบการทำงานร่วมกัน

---

### 🎯 Phase 2: Enhanced Features (สัปดาห์ที่ 3-4)

**Week 3:**
- [ ] ปรับปรุง Room Management (Types, Equipment, Rules)
- [ ] สร้าง Room Maintenance system
- [ ] สร้าง Advanced Dashboard with Charts
- [ ] Implement Analytics API
- [ ] ทดสอบ Dashboard

**Week 4:**
- [ ] สร้าง Reports & Export system
- [ ] Implement CSV/Excel/PDF export
- [ ] สร้าง Recurring Booking (Backend + Frontend)
- [ ] ทดสอบ Recurring Booking
- [ ] Integration testing

---

### 🎯 Phase 3: Polish & Optional Features (สัปดาห์ที่ 5-6)

**Week 5:**
- [ ] Notification System (Backend + Frontend)
- [ ] Announcement System
- [ ] Check-in/Check-out System
- [ ] No-show Penalty System
- [ ] Email integration

**Week 6:**
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] Documentation
- [ ] User training

---

## 🎨 UI/UX Guidelines

### Sidebar Navigation (Admin/Staff)

```
┌─────────────────────────────┐
│ 🏫 ระบบจองห้องเรียน         │
├─────────────────────────────┤
│ 📊 Dashboard                │
├─────────────────────────────┤
│ การจอง                      │
│  ├─ ✅ อนุมัติการจอง         │
│  ├─ 📅 ตารางรายสัปดาห์       │
│  └─ 📋 ประวัติการจอง         │
├─────────────────────────────┤
│ จัดการ                      │
│  ├─ 👥 จัดการผู้ใช้          │
│  ├─ 🏫 จัดการห้อง           │
│  └─ 📆 ปฏิทินวิชาการ        │
├─────────────────────────────┤
│ รายงาน                      │
│  ├─ 📊 สถิติ                │
│  └─ 📄 ส่งออกรายงาน          │
├─────────────────────────────┤
│ ระบบ                        │
│  ├─ 🔔 การแจ้งเตือน         │
│  ├─ 📢 ประกาศ               │
│  └─ ⚙️ ตั้งค่า              │
└─────────────────────────────┘
```

### Color Coding

**Booking Status:**
- 🟢 `#10B981` - Available/Approved
- 🟡 `#F59E0B` - Pending
- 🔵 `#3B82F6` - In Progress
- 🔴 `#EF4444` - Rejected/Occupied
- ⚫ `#6B7280` - Maintenance/Inactive

**Priority Badges:**
- 🔴 `URGENT` - วันนี้/พรุ่งนี้
- 🟡 `HIGH` - 3 วันข้างหน้า
- 🟢 `NORMAL` - มากกว่า 3 วัน

---

## 📝 Notes

### สิ่งสำคัญที่ต้องจำ

1. **Role TEACHER เป็น Priority สูง** - อาจารย์ต้องสามารถจองได้สะดวก
2. **Academic Calendar จำเป็นมาก** - เพื่อบล็อกวันสอบ/วันหยุด
3. **User Management ต้องทำก่อน** - มี API แล้วแค่ขาด UI
4. **Calendar View ช่วยให้ดูภาพรวมได้ดี** - สำคัญสำหรับเจ้าหน้าที่
5. **Recurring Booking สำคัญสำหรับอาจารย์** - ลดงานซ้ำซ้อน

### ข้อควรระวัง

- ⚠️ ต้อง Migrate Database อย่างระมัดระวัง (backup ก่อน)
- ⚠️ Role เปลี่ยนจาก USER → STUDENT, ADMIN → STAFF (ต้องแก้ Code ทั้งหมด)
- ⚠️ Recurring Booking ต้องมี Logic ป้องกันการจองซ้อน
- ⚠️ Check-in/Check-out ต้องใช้ Mobile-friendly UI
- ⚠️ Reports ที่มีข้อมูลเยอะต้อง Optimize query

---

## ✅ Checklist ก่อนเริ่มพัฒนา

- [ ] Backup Database ปัจจุบัน
- [ ] Review PROGRESS.md และ BACKOFFICE_PLAN.md
- [ ] ทำความเข้าใจ Use Case ของแต่ละ Role
- [ ] วางแผน Database Migration
- [ ] เตรียม Test Data (users, rooms, bookings)
- [ ] Setup Development Environment
- [ ] สร้าง Git Branch สำหรับแต่ละ Phase

---

**สร้างโดย:** Claude Code
**วันที่:** 5 ธันวาคม 2025
**เวอร์ชัน:** 1.0
