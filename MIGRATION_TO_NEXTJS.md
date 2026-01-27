# Migration Plan: React + NestJS → Next.js

## Progress Tracker

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1: Setup | ⬜ Not Started | 0% |
| Phase 2: Core Infrastructure | ⬜ Not Started | 0% |
| Phase 3: API Routes | ⬜ Not Started | 0% |
| Phase 4: Frontend Pages | ⬜ Not Started | 0% |
| Phase 5: Components | ⬜ Not Started | 0% |
| Phase 6: Testing & Polish | ⬜ Not Started | 0% |

**Overall Progress: 0%**

---

## 1. Current Project Structure

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── pages/           # 14 page components
│   ├── components/      # Reusable UI components
│   ├── services/        # 9 API service files (Axios)
│   ├── context/         # AuthContext, ThemeContext
│   ├── layouts/         # Layout templates
│   ├── hooks/           # Custom hooks
│   └── lib/             # Utilities
```

### Backend (NestJS)
```
backend/
├── src/
│   ├── auth/            # Authentication module
│   ├── users/           # User management
│   ├── bookings/        # Booking CRUD
│   ├── recurring-bookings/
│   ├── rooms/           # Room management
│   ├── semesters/       # Semester management
│   ├── special-dates/   # Holidays, events
│   ├── notifications/   # User notifications
│   ├── announcements/   # System announcements
│   ├── analytics/       # Usage analytics
│   ├── prisma/          # Database service
│   └── shared/          # Shared enums
├── prisma/
│   └── schema.prisma    # Database schema
```

---

## 2. New Next.js Project Structure

```
room-booking-nextjs/
├── src/
│   ├── app/                      # App Router
│   │   ├── (auth)/               # Auth group (no layout)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/          # Dashboard group (with layout)
│   │   │   ├── layout.tsx        # Sidebar + Header layout
│   │   │   ├── page.tsx          # Dashboard home
│   │   │   ├── bookings/
│   │   │   │   ├── page.tsx      # Create booking
│   │   │   │   └── my/
│   │   │   │       └── page.tsx  # My bookings
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx
│   │   │   ├── history/
│   │   │   │   └── page.tsx
│   │   │   ├── recurring/
│   │   │   │   └── page.tsx
│   │   │   └── announcements/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (admin)/              # Admin group
│   │   │   ├── layout.tsx        # Admin layout with guard
│   │   │   ├── approval/
│   │   │   │   └── page.tsx
│   │   │   ├── rooms/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   ├── semesters/
│   │   │   │   └── page.tsx
│   │   │   └── special-dates/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   └── me/
│   │   │   │       └── route.ts
│   │   │   ├── users/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── rooms/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── bookings/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── my/
│   │   │   │   │   └── route.ts
│   │   │   │   └── check-in/
│   │   │   │       └── route.ts
│   │   │   ├── recurring-bookings/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── semesters/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── special-dates/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── notifications/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── announcements/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── analytics/
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx            # Root layout
│   │   ├── loading.tsx           # Global loading
│   │   ├── error.tsx             # Global error
│   │   └── not-found.tsx         # 404 page
│   │
│   ├── components/               # UI Components
│   │   ├── ui/                   # Shadcn components
│   │   ├── layout/               # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Notifications.tsx
│   │   ├── booking/              # Booking components
│   │   ├── room/                 # Room components
│   │   └── forms/                # Form components
│   │
│   ├── lib/                      # Utilities
│   │   ├── prisma.ts             # Prisma client
│   │   ├── auth.ts               # Auth utilities (JWT)
│   │   ├── utils.ts              # General utilities
│   │   └── validations/          # Zod schemas
│   │       ├── auth.ts
│   │       ├── booking.ts
│   │       ├── room.ts
│   │       └── user.ts
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useBookings.ts
│   │   └── useRooms.ts
│   │
│   ├── context/                  # React Context
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── types/                    # TypeScript types
│   │   ├── index.ts
│   │   ├── booking.ts
│   │   ├── room.ts
│   │   └── user.ts
│   │
│   └── middleware.ts             # Next.js middleware (auth)
│
├── prisma/
│   └── schema.prisma             # Copy from backend
│
├── public/                       # Static files
├── .env                          # Environment variables
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 3. Migration Steps (Detailed)

---

### Phase 1: Project Setup ⬜

#### 1.1 Create Next.js Project
- [ ] Run `npx create-next-app@latest room-booking-nextjs --typescript --tailwind --eslint --app --src-dir`
- [ ] Select options: Yes to App Router, Yes to `src/` directory
- [ ] Navigate to project directory

#### 1.2 Install Core Dependencies
- [ ] Install Prisma: `npm install prisma @prisma/client`
- [ ] Install Auth: `npm install bcrypt jsonwebtoken`
- [ ] Install Types: `npm install -D @types/bcrypt @types/jsonwebtoken`
- [ ] Install Validation: `npm install zod`

#### 1.3 Install UI Dependencies
- [ ] Initialize Shadcn: `npx shadcn-ui@latest init`
- [ ] Install Shadcn components:
  - [ ] `npx shadcn-ui@latest add button`
  - [ ] `npx shadcn-ui@latest add input`
  - [ ] `npx shadcn-ui@latest add label`
  - [ ] `npx shadcn-ui@latest add card`
  - [ ] `npx shadcn-ui@latest add dialog`
  - [ ] `npx shadcn-ui@latest add dropdown-menu`
  - [ ] `npx shadcn-ui@latest add select`
  - [ ] `npx shadcn-ui@latest add tabs`
  - [ ] `npx shadcn-ui@latest add toast`
  - [ ] `npx shadcn-ui@latest add avatar`
  - [ ] `npx shadcn-ui@latest add badge`
  - [ ] `npx shadcn-ui@latest add calendar`
  - [ ] `npx shadcn-ui@latest add table`
  - [ ] `npx shadcn-ui@latest add form`
  - [ ] `npx shadcn-ui@latest add separator`
  - [ ] `npx shadcn-ui@latest add progress`
- [ ] Install Icons: `npm install lucide-react`

#### 1.4 Setup Prisma
- [ ] Copy `backend/prisma/schema.prisma` to `prisma/schema.prisma`
- [ ] Create `.env` file with DATABASE_URL
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push` (or use existing database)

#### 1.5 Setup Environment Variables
- [ ] Create `.env.local` with:
  ```
  DATABASE_URL="postgresql://postgres:password@localhost:5432/room_booking"
  JWT_SECRET="your-super-secret-jwt-key"
  JWT_EXPIRES_IN="1d"
  ```

#### 1.6 Configure Project Structure
- [ ] Create folder structure:
  ```
  src/
  ├── app/
  │   ├── (auth)/
  │   ├── (dashboard)/
  │   ├── (admin)/
  │   └── api/
  ├── components/
  │   └── ui/
  ├── lib/
  ├── hooks/
  ├── context/
  └── types/
  ```

**Phase 1 Checklist: 0/30 tasks completed**

---

### Phase 2: Core Infrastructure ⬜

#### 2.1 Prisma Client Setup
- [ ] Create `src/lib/prisma.ts` (singleton pattern)
  ```typescript
  import { PrismaClient } from '@prisma/client';

  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

  export const prisma = globalForPrisma.prisma || new PrismaClient();

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
  ```

#### 2.2 Auth Utilities
- [ ] Create `src/lib/auth.ts`:
  - [ ] `hashPassword(password: string)` function
  - [ ] `comparePassword(password: string, hash: string)` function
  - [ ] `signToken(payload: object)` function
  - [ ] `verifyToken(token: string)` function
  - [ ] `getServerSession(request: NextRequest)` function
  - [ ] `getCurrentUser(request: NextRequest)` function

#### 2.3 Middleware Setup
- [ ] Create `src/middleware.ts`:
  - [ ] Protected routes matcher config
  - [ ] JWT verification for API routes
  - [ ] Redirect to login for unauthenticated users
  - [ ] Role-based route protection

#### 2.4 Zod Validation Schemas
- [ ] Create `src/lib/validations/auth.ts`:
  - [ ] `loginSchema`
  - [ ] `registerSchema`
- [ ] Create `src/lib/validations/user.ts`:
  - [ ] `createUserSchema`
  - [ ] `updateUserSchema`
- [ ] Create `src/lib/validations/room.ts`:
  - [ ] `createRoomSchema`
  - [ ] `updateRoomSchema`
- [ ] Create `src/lib/validations/booking.ts`:
  - [ ] `createBookingSchema`
  - [ ] `updateBookingSchema`
- [ ] Create `src/lib/validations/semester.ts`:
  - [ ] `createSemesterSchema`
  - [ ] `updateSemesterSchema`
- [ ] Create `src/lib/validations/special-date.ts`:
  - [ ] `createSpecialDateSchema`
- [ ] Create `src/lib/validations/recurring-booking.ts`:
  - [ ] `createRecurringBookingSchema`
- [ ] Create `src/lib/validations/announcement.ts`:
  - [ ] `createAnnouncementSchema`

#### 2.5 TypeScript Types
- [ ] Create `src/types/index.ts`:
  - [ ] Export all enums (UserRole, RoomType, BookingStatus, etc.)
  - [ ] Define common types
- [ ] Create `src/types/user.ts`
- [ ] Create `src/types/room.ts`
- [ ] Create `src/types/booking.ts`

#### 2.6 Utility Functions
- [ ] Create `src/lib/utils.ts`:
  - [ ] `cn()` function (clsx + tailwind-merge)
  - [ ] Date formatting utilities
  - [ ] Error handling utilities

**Phase 2 Checklist: 0/25 tasks completed**

---

### Phase 3: API Routes ⬜

#### 3.1 Auth API Routes
- [ ] `src/app/api/auth/login/route.ts`
  - [ ] POST: Validate credentials, return JWT
- [ ] `src/app/api/auth/register/route.ts`
  - [ ] POST: Create user, hash password, return JWT
- [ ] `src/app/api/auth/me/route.ts`
  - [ ] GET: Return current user from JWT

#### 3.2 Users API Routes
- [ ] `src/app/api/users/route.ts`
  - [ ] GET: List all users (admin only)
  - [ ] POST: Create user (admin only)
- [ ] `src/app/api/users/[id]/route.ts`
  - [ ] GET: Get user by ID
  - [ ] PATCH: Update user
  - [ ] DELETE: Delete user (admin only)

#### 3.3 Rooms API Routes
- [ ] `src/app/api/rooms/route.ts`
  - [ ] GET: List all rooms (with filters)
  - [ ] POST: Create room (admin only)
- [ ] `src/app/api/rooms/[id]/route.ts`
  - [ ] GET: Get room by ID
  - [ ] PATCH: Update room (admin only)
  - [ ] DELETE: Delete room (admin only)
- [ ] `src/app/api/rooms/[id]/availability/route.ts`
  - [ ] GET: Check room availability for date range

#### 3.4 Bookings API Routes
- [ ] `src/app/api/bookings/route.ts`
  - [ ] GET: List bookings (with filters)
  - [ ] POST: Create booking (with overlap check)
- [ ] `src/app/api/bookings/my/route.ts`
  - [ ] GET: Get current user's bookings
- [ ] `src/app/api/bookings/pending/route.ts`
  - [ ] GET: Get pending bookings (admin only)
- [ ] `src/app/api/bookings/[id]/route.ts`
  - [ ] GET: Get booking by ID
  - [ ] PATCH: Update booking status
  - [ ] DELETE: Cancel booking
- [ ] `src/app/api/bookings/[id]/approve/route.ts`
  - [ ] POST: Approve booking (admin only)
- [ ] `src/app/api/bookings/[id]/reject/route.ts`
  - [ ] POST: Reject booking (admin only)
- [ ] `src/app/api/bookings/[id]/check-in/route.ts`
  - [ ] POST: Check in to booking
- [ ] `src/app/api/bookings/[id]/check-out/route.ts`
  - [ ] POST: Check out from booking

#### 3.5 Recurring Bookings API Routes
- [ ] `src/app/api/recurring-bookings/route.ts`
  - [ ] GET: List recurring bookings
  - [ ] POST: Create recurring booking
- [ ] `src/app/api/recurring-bookings/[id]/route.ts`
  - [ ] GET: Get recurring booking by ID
  - [ ] DELETE: Delete recurring booking and generated bookings

#### 3.6 Semesters API Routes
- [ ] `src/app/api/semesters/route.ts`
  - [ ] GET: List all semesters
  - [ ] POST: Create semester (admin only)
- [ ] `src/app/api/semesters/current/route.ts`
  - [ ] GET: Get current active semester
- [ ] `src/app/api/semesters/[id]/route.ts`
  - [ ] GET: Get semester by ID
  - [ ] PATCH: Update semester (admin only)
  - [ ] DELETE: Delete semester (admin only)

#### 3.7 Special Dates API Routes
- [ ] `src/app/api/special-dates/route.ts`
  - [ ] GET: List special dates (with semester filter)
  - [ ] POST: Create special date (admin only)
- [ ] `src/app/api/special-dates/[id]/route.ts`
  - [ ] GET: Get special date by ID
  - [ ] PATCH: Update special date (admin only)
  - [ ] DELETE: Delete special date (admin only)

#### 3.8 Notifications API Routes
- [ ] `src/app/api/notifications/route.ts`
  - [ ] GET: Get user's notifications
- [ ] `src/app/api/notifications/unread-count/route.ts`
  - [ ] GET: Get unread notification count
- [ ] `src/app/api/notifications/[id]/route.ts`
  - [ ] PATCH: Mark notification as read
  - [ ] DELETE: Delete notification
- [ ] `src/app/api/notifications/mark-all-read/route.ts`
  - [ ] POST: Mark all notifications as read

#### 3.9 Announcements API Routes
- [ ] `src/app/api/announcements/route.ts`
  - [ ] GET: List announcements (active only for users)
  - [ ] POST: Create announcement (admin only)
- [ ] `src/app/api/announcements/[id]/route.ts`
  - [ ] GET: Get announcement by ID
  - [ ] PATCH: Update announcement (admin only)
  - [ ] DELETE: Delete announcement (admin only)

#### 3.10 Analytics API Routes
- [ ] `src/app/api/analytics/overview/route.ts`
  - [ ] GET: Get dashboard overview stats
- [ ] `src/app/api/analytics/room-usage/route.ts`
  - [ ] GET: Get room usage statistics
- [ ] `src/app/api/analytics/booking-trends/route.ts`
  - [ ] GET: Get booking trends over time

**Phase 3 Checklist: 0/45 tasks completed**

---

### Phase 4: Frontend Pages ⬜

#### 4.1 Root Layout & Providers
- [ ] Create `src/app/layout.tsx`:
  - [ ] Setup HTML structure
  - [ ] Add ThemeProvider
  - [ ] Add Toaster component
  - [ ] Add global styles
- [ ] Create `src/context/AuthContext.tsx`:
  - [ ] AuthProvider component
  - [ ] useAuth hook
  - [ ] Login/logout functions
  - [ ] User state management
- [ ] Create `src/context/ThemeContext.tsx`:
  - [ ] ThemeProvider component
  - [ ] useTheme hook
  - [ ] Dark/light mode toggle

#### 4.2 Auth Pages
- [ ] Create `src/app/(auth)/layout.tsx`:
  - [ ] Centered layout for auth pages
  - [ ] Redirect if already logged in
- [ ] Create `src/app/(auth)/login/page.tsx`:
  - [ ] Login form with validation
  - [ ] Error handling
  - [ ] Redirect to dashboard on success
- [ ] Create `src/app/(auth)/register/page.tsx`:
  - [ ] Registration form
  - [ ] Role selection (Student/Teacher)
  - [ ] Validation and error handling

#### 4.3 Dashboard Layout
- [ ] Create `src/app/(dashboard)/layout.tsx`:
  - [ ] Auth protection
  - [ ] Sidebar navigation
  - [ ] Header with user menu
  - [ ] Notifications area
- [ ] Create `src/components/layout/Sidebar.tsx`:
  - [ ] Navigation links
  - [ ] Role-based menu items
  - [ ] Active state styling
- [ ] Create `src/components/layout/Header.tsx`:
  - [ ] User avatar/dropdown
  - [ ] Theme toggle
  - [ ] Notifications bell
- [ ] Create `src/components/layout/Notifications.tsx`:
  - [ ] Notification list
  - [ ] Mark as read functionality
  - [ ] Real-time updates (optional)

#### 4.4 Dashboard Page
- [ ] Create `src/app/(dashboard)/page.tsx`:
  - [ ] Welcome message
  - [ ] Quick stats cards
  - [ ] Upcoming bookings
  - [ ] Recent announcements
  - [ ] Quick actions

#### 4.5 Booking Pages
- [ ] Create `src/app/(dashboard)/bookings/page.tsx`:
  - [ ] Room selection
  - [ ] Date/time picker
  - [ ] Availability check
  - [ ] Booking form
  - [ ] Purpose input
- [ ] Create `src/app/(dashboard)/bookings/my/page.tsx`:
  - [ ] List of user's bookings
  - [ ] Filter by status
  - [ ] Cancel booking action
  - [ ] Check-in/check-out actions
  - [ ] Pagination

#### 4.6 Calendar Page
- [ ] Create `src/app/(dashboard)/calendar/page.tsx`:
  - [ ] Calendar component
  - [ ] Room filter
  - [ ] Day/week/month views
  - [ ] Booking visualization
  - [ ] Click to book

#### 4.7 History Page
- [ ] Create `src/app/(dashboard)/history/page.tsx`:
  - [ ] Past bookings list
  - [ ] Date range filter
  - [ ] Export functionality (optional)

#### 4.8 Recurring Booking Page
- [ ] Create `src/app/(dashboard)/recurring/page.tsx`:
  - [ ] Pattern selection (daily, weekly, custom)
  - [ ] Day of week selection
  - [ ] Date range for recurrence
  - [ ] Room and time selection
  - [ ] Preview generated bookings

#### 4.9 Announcements Page
- [ ] Create `src/app/(dashboard)/announcements/page.tsx`:
  - [ ] List of active announcements
  - [ ] Filter by type
  - [ ] Pinned announcements first

#### 4.10 Admin Layout
- [ ] Create `src/app/(admin)/layout.tsx`:
  - [ ] Admin role check
  - [ ] Admin sidebar/navigation

#### 4.11 Admin Approval Page
- [ ] Create `src/app/(admin)/approval/page.tsx`:
  - [ ] Pending bookings list
  - [ ] Approve/reject actions
  - [ ] Booking details modal
  - [ ] Bulk actions (optional)

#### 4.12 Room Management Page
- [ ] Create `src/app/(admin)/rooms/page.tsx`:
  - [ ] Rooms table/list
  - [ ] Create room modal
  - [ ] Edit room modal
  - [ ] Delete room action
  - [ ] Room details (capacity, equipment, rules)

#### 4.13 User Management Page
- [ ] Create `src/app/(admin)/users/page.tsx`:
  - [ ] Users table
  - [ ] Search/filter
  - [ ] Edit user role
  - [ ] Suspend/unsuspend user
  - [ ] View user bookings

#### 4.14 Semester Management Page
- [ ] Create `src/app/(admin)/semesters/page.tsx`:
  - [ ] Semesters list
  - [ ] Create semester form
  - [ ] Edit semester
  - [ ] Set active semester
  - [ ] Delete semester

#### 4.15 Special Dates Page
- [ ] Create `src/app/(admin)/special-dates/page.tsx`:
  - [ ] Special dates list
  - [ ] Create special date form
  - [ ] Type selection (holiday, exam, event)
  - [ ] Edit/delete actions
  - [ ] Semester filter

**Phase 4 Checklist: 0/40 tasks completed**

---

### Phase 5: Components Migration ⬜

#### 5.1 Common UI Components
- [ ] Migrate/create `LoadingSpinner.tsx`
- [ ] Migrate/create `EmptyState.tsx`
- [ ] Migrate/create `ErrorBoundary.tsx`
- [ ] Migrate/create `ConfirmDialog.tsx`
- [ ] Migrate/create `DataTable.tsx` (reusable table)
- [ ] Migrate/create `Pagination.tsx`

#### 5.2 Form Components
- [ ] Migrate/create `FormInput.tsx`
- [ ] Migrate/create `FormSelect.tsx`
- [ ] Migrate/create `FormDatePicker.tsx`
- [ ] Migrate/create `FormTimePicker.tsx`
- [ ] Migrate/create `FormTextarea.tsx`

#### 5.3 Booking Components
- [ ] Migrate/create `BookingCard.tsx`
- [ ] Migrate/create `BookingList.tsx`
- [ ] Migrate/create `BookingForm.tsx`
- [ ] Migrate/create `BookingStatusBadge.tsx`
- [ ] Migrate/create `TimeSlotPicker.tsx`

#### 5.4 Room Components
- [ ] Migrate/create `RoomCard.tsx`
- [ ] Migrate/create `RoomList.tsx`
- [ ] Migrate/create `RoomForm.tsx`
- [ ] Migrate/create `RoomTypeBadge.tsx`
- [ ] Migrate/create `RoomAvailability.tsx`

#### 5.5 User Components
- [ ] Migrate/create `UserCard.tsx`
- [ ] Migrate/create `UserRoleBadge.tsx`
- [ ] Migrate/create `UserAvatar.tsx`

#### 5.6 Calendar Components
- [ ] Migrate/create `BookingCalendar.tsx`
- [ ] Migrate/create `CalendarDay.tsx`
- [ ] Migrate/create `CalendarEvent.tsx`

#### 5.7 Announcement Components
- [ ] Migrate/create `AnnouncementCard.tsx`
- [ ] Migrate/create `AnnouncementList.tsx`
- [ ] Migrate/create `AnnouncementTypeBadge.tsx`

**Phase 5 Checklist: 0/30 tasks completed**

---

### Phase 6: Testing & Polish ⬜

#### 6.1 API Route Testing
- [ ] Test auth endpoints (login, register, me)
- [ ] Test user CRUD endpoints
- [ ] Test room CRUD endpoints
- [ ] Test booking endpoints (including overlap check)
- [ ] Test recurring booking endpoints
- [ ] Test semester endpoints
- [ ] Test special date endpoints
- [ ] Test notification endpoints
- [ ] Test announcement endpoints
- [ ] Test analytics endpoints

#### 6.2 Page Testing
- [ ] Test login flow
- [ ] Test registration flow
- [ ] Test dashboard page
- [ ] Test booking creation
- [ ] Test my bookings page
- [ ] Test calendar view
- [ ] Test admin approval flow
- [ ] Test room management
- [ ] Test user management

#### 6.3 Auth & Security Testing
- [ ] Test JWT expiration
- [ ] Test protected routes
- [ ] Test role-based access (student vs admin)
- [ ] Test unauthorized access handling
- [ ] Test password hashing

#### 6.4 Edge Cases
- [ ] Test double booking prevention
- [ ] Test booking overlap scenarios
- [ ] Test no-show tracking
- [ ] Test user suspension
- [ ] Test recurring booking generation

#### 6.5 UI/UX Polish
- [ ] Test responsive design (mobile/tablet)
- [ ] Test dark mode
- [ ] Test loading states
- [ ] Test error states
- [ ] Test empty states
- [ ] Test form validations

#### 6.6 Deployment Preparation
- [ ] Update Docker compose for Next.js
- [ ] Create production build
- [ ] Test production build locally
- [ ] Update environment variables for production
- [ ] Create deployment documentation

**Phase 6 Checklist: 0/30 tasks completed**

---

## Summary

| Phase | Tasks | Completed |
|-------|-------|-----------|
| Phase 1: Setup | 30 | 0 |
| Phase 2: Core Infrastructure | 25 | 0 |
| Phase 3: API Routes | 45 | 0 |
| Phase 4: Frontend Pages | 40 | 0 |
| Phase 5: Components | 30 | 0 |
| Phase 6: Testing & Polish | 30 | 0 |
| **Total** | **200** | **0** |

---

## 4. File Mapping

### Pages Mapping

| React (Current) | Next.js (New) |
|-----------------|---------------|
| `pages/LoginPage.tsx` | `app/(auth)/login/page.tsx` |
| `pages/RegisterPage.tsx` | `app/(auth)/register/page.tsx` |
| `pages/Dashboard.tsx` | `app/(dashboard)/page.tsx` |
| `pages/BookingPage.tsx` | `app/(dashboard)/bookings/page.tsx` |
| `pages/MyBookingsPage.tsx` | `app/(dashboard)/bookings/my/page.tsx` |
| `pages/CalendarViewPage.tsx` | `app/(dashboard)/calendar/page.tsx` |
| `pages/HistoryPage.tsx` | `app/(dashboard)/history/page.tsx` |
| `pages/RecurringBookingPage.tsx` | `app/(dashboard)/recurring/page.tsx` |
| `pages/AnnouncementsPage.tsx` | `app/(dashboard)/announcements/page.tsx` |
| `pages/AdminApprovalPage.tsx` | `app/(admin)/approval/page.tsx` |
| `pages/RoomManagementPage.tsx` | `app/(admin)/rooms/page.tsx` |
| `pages/UserManagementPage.tsx` | `app/(admin)/users/page.tsx` |
| `pages/SemesterManagementPage.tsx` | `app/(admin)/semesters/page.tsx` |
| `pages/SpecialDatesPage.tsx` | `app/(admin)/special-dates/page.tsx` |

### API Routes Mapping

| NestJS (Current) | Next.js (New) |
|------------------|---------------|
| `POST /auth/login` | `POST /api/auth/login` |
| `POST /auth/register` | `POST /api/auth/register` |
| `GET /auth/me` | `GET /api/auth/me` |
| `GET /users` | `GET /api/users` |
| `GET /users/:id` | `GET /api/users/[id]` |
| `PATCH /users/:id` | `PATCH /api/users/[id]` |
| `DELETE /users/:id` | `DELETE /api/users/[id]` |
| `GET /rooms` | `GET /api/rooms` |
| `POST /rooms` | `POST /api/rooms` |
| `GET /rooms/:id` | `GET /api/rooms/[id]` |
| `PATCH /rooms/:id` | `PATCH /api/rooms/[id]` |
| `DELETE /rooms/:id` | `DELETE /api/rooms/[id]` |
| `GET /bookings` | `GET /api/bookings` |
| `POST /bookings` | `POST /api/bookings` |
| `GET /bookings/my` | `GET /api/bookings/my` |
| `PATCH /bookings/:id` | `PATCH /api/bookings/[id]` |
| `POST /bookings/:id/check-in` | `POST /api/bookings/check-in` |
| `GET /recurring-bookings` | `GET /api/recurring-bookings` |
| `POST /recurring-bookings` | `POST /api/recurring-bookings` |
| `DELETE /recurring-bookings/:id` | `DELETE /api/recurring-bookings/[id]` |
| `GET /semesters` | `GET /api/semesters` |
| `POST /semesters` | `POST /api/semesters` |
| `GET /semesters/current` | `GET /api/semesters?current=true` |
| `GET /special-dates` | `GET /api/special-dates` |
| `POST /special-dates` | `POST /api/special-dates` |
| `GET /notifications` | `GET /api/notifications` |
| `PATCH /notifications/:id/read` | `PATCH /api/notifications/[id]` |
| `GET /announcements` | `GET /api/announcements` |
| `POST /announcements` | `POST /api/announcements` |
| `GET /analytics/*` | `GET /api/analytics` |

---

## 5. Key Code Transformations

### 5.1 NestJS Controller → Next.js API Route

**Before (NestJS):**
```typescript
// backend/src/bookings/bookings.controller.ts
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateBookingDto, @CurrentUser() user: User) {
    return this.bookingsService.create(dto, user.id);
  }
}
```

**After (Next.js):**
```typescript
// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { createBookingSchema } from '@/lib/validations/booking';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createBookingSchema.parse(body);

    const booking = await prisma.booking.create({
      data: {
        ...validated,
        userId: user.id,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
```

### 5.2 class-validator → Zod

**Before (class-validator):**
```typescript
// backend/src/bookings/dto/create-booking.dto.ts
export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsString()
  purpose?: string;
}
```

**After (Zod):**
```typescript
// lib/validations/booking.ts
import { z } from 'zod';

export const createBookingSchema = z.object({
  roomId: z.number().int().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  purpose: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
```

### 5.3 React Router → Next.js App Router

**Before (React Router):**
```tsx
// frontend/src/App.tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Layout><Dashboard /></Layout>
    </ProtectedRoute>
  } />
  <Route path="/admin/rooms" element={
    <AdminRoute>
      <Layout><RoomManagementPage /></Layout>
    </AdminRoute>
  } />
</Routes>
```

**After (Next.js):**
```tsx
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';

export default async function DashboardLayout({ children }) {
  const session = await getServerSession();
  if (!session) redirect('/login');

  return <Layout>{children}</Layout>;
}

// app/(admin)/layout.tsx
export default async function AdminLayout({ children }) {
  const session = await getServerSession();
  if (!session) redirect('/login');
  if (!['STAFF', 'DEPARTMENT_HEAD'].includes(session.role)) {
    redirect('/dashboard');
  }

  return <Layout>{children}</Layout>;
}
```

### 5.4 Axios Service → Server Actions / fetch

**Before (Axios):**
```typescript
// frontend/src/services/booking.service.ts
export const bookingService = {
  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },
  createBooking: async (data: CreateBookingDto) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },
};
```

**After (Server Actions):**
```typescript
// app/actions/booking.ts
'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getMyBookings() {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  return prisma.booking.findMany({
    where: { userId: session.id },
    include: { room: true },
    orderBy: { startTime: 'desc' },
  });
}

export async function createBooking(data: CreateBookingInput) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const booking = await prisma.booking.create({
    data: {
      ...data,
      userId: session.id,
    },
  });

  revalidatePath('/bookings/my');
  return booking;
}
```

---

## 6. Dependencies

### Remove (NestJS specific)
```
@nestjs/*
passport
passport-jwt
class-validator
class-transformer
```

### Keep
```
prisma
@prisma/client
bcrypt
jsonwebtoken
```

### Add (Next.js specific)
```
next
react (keep)
react-dom (keep)
zod
next-auth (optional, or custom JWT)
```

### package.json (New)
```json
{
  "name": "room-booking-nextjs",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.0.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4",
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.300.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "typescript": "^5.3.0",
    "prisma": "^5.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

---

## 7. Environment Variables

```env
# .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/room_booking"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="1d"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 8. Notes & Considerations

### Pros of Migration
- Single codebase for frontend and backend
- Better DX with Next.js hot reload
- Server Components for better performance
- Easier deployment (Vercel, etc.)
- Built-in API routes
- Better SEO with SSR/SSG

### Cons / Challenges
- Loss of NestJS's structured architecture (DI, decorators)
- Need to implement auth guards manually
- API routes less organized than NestJS modules
- Testing setup needs reconfiguration

### Recommendations
1. Use Route Handlers for complex APIs
2. Consider Server Actions for mutations
3. Keep Prisma - it works great with Next.js
4. Use Zod for validation (type-safe)
5. Consider next-auth for auth (optional)
6. Keep the same database - no migration needed

---

## 9. Checklist Summary

- [ ] **Phase 1:** Project setup
- [ ] **Phase 2:** Core infrastructure (Prisma, Auth, Middleware)
- [ ] **Phase 3:** API routes (13 modules)
- [ ] **Phase 4:** Frontend pages (14 pages)
- [ ] **Phase 5:** Components migration
- [ ] **Phase 6:** Testing & deployment
