# Hotel Management System

A modern hotel and restaurant management application built with Next.js 14, JavaScript, MongoDB, and Tailwind CSS.

## Features

### 🏨 Hotel Management

- **Room Management**: Comprehensive room inventory with availability tracking
- **Booking System**: Real-time reservation system with automated confirmations
- **Guest Services**: Complete guest profile management and service tracking
- **Check-in/Check-out**: Streamlined front desk operations

### 🍽️ Restaurant Management

- **Table Reservations**: Efficient table booking and management system
- **Menu Management**: Dynamic menu with categories and pricing
- **Order Tracking**: Real-time order status and kitchen coordination

### 📊 Analytics & Reporting

- **Dashboard**: Real-time metrics and key performance indicators
- **Revenue Tracking**: Financial reporting and analytics
- **Occupancy Reports**: Room utilization and forecasting
- **Guest Analytics**: Customer insights and preferences

### 🔐 Security & Administration

- **User Management**: Role-based access control (Admin, Manager, Staff, Guest)
- **Secure Authentication**: Enterprise-grade security with NextAuth.js
- **Data Protection**: Encrypted data storage and secure API endpoints

## Technology Stack

- **Frontend**: Next.js 14 with App Router, React, JavaScript
- **Styling**: Tailwind CSS with custom components
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hotel-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── rooms/            # Room management
│   ├── bookings/         # Booking management
│   └── restaurant/       # Restaurant management
├── components/            # Reusable React components
│   └── ui/               # UI component library
├── lib/                  # Utility functions and configurations
│   ├── mongoose.js       # Database connection
│   ├── utils.js          # Helper functions
│   └── validations.js    # Zod schemas
└── models/               # MongoDB/Mongoose models
    ├── User.js
    ├── Room.js
    ├── Booking.js
    └── Restaurant.js
```

## API Endpoints

### Rooms

- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/[id]` - Update room
- `DELETE /api/rooms/[id]` - Delete room

### Bookings

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking

### Restaurant

- `GET /api/restaurant/reservations` - Get reservations
- `POST /api/restaurant/reservations` - Create reservation
- `GET /api/restaurant/menu` - Get menu items
- `POST /api/restaurant/menu` - Add menu item

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Code Style

This project follows:

- ESLint configuration for code quality
- Prettier for code formatting
- Conventional commits for git messages
- Modern React patterns with hooks
- Tailwind CSS for styling

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Manual Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@hotelms.com or join our Slack channel.

## Roadmap

- [ ] Mobile app integration
- [ ] Advanced analytics dashboard
- [ ] Multi-property management
- [ ] Integration with external booking platforms
- [ ] Automated housekeeping management
- [ ] Guest communication system
- [ ] Loyalty program management
