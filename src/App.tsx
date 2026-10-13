import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Student Screens
import { LoginScreen } from './screens/student/LoginScreen';
import { FoodListScreen } from './screens/student/FoodListScreen';
import { FoodDetailScreen } from './screens/student/FoodDetailScreen';
import { CartScreen } from './screens/student/CartScreen';
import { PaymentScreen } from './screens/student/PaymentScreen';
import { OrderTrackingScreen } from './screens/student/OrderTrackingScreen';
import { OrderHistoryScreen } from './screens/student/OrderHistoryScreen';
import { FeedbackScreen } from './screens/student/FeedbackScreen';

// Staff Screens
import { StaffDashboardScreen } from './screens/staff/StaffDashboardScreen';
import { StaffOrdersScreen } from './screens/staff/StaffOrdersScreen';
import { StaffInventoryScreen } from './screens/staff/StaffInventoryScreen';
import { StaffHistoryScreen } from './screens/staff/StaffHistoryScreen';

// Demo Bar
import { DemoSwitcherBar } from './components/common/DemoSwitcherBar';

const AppShell: React.FC = () => {
  const location = useLocation();
  const isStaffRoute = location.pathname.startsWith('/staff');

  return (
    <div className="app-viewport">
      <div className={`mobile-device-shell ${isStaffRoute ? 'staff-layout-wide' : ''}`}>
        <DemoSwitcherBar />
        <Routes>
          {/* Default Login */}
          <Route path="/" element={<LoginScreen />} />

          {/* Student Flow */}
          <Route path="/student/home" element={<FoodListScreen />} />
          <Route path="/student/item/:id" element={<FoodDetailScreen />} />
          <Route path="/student/cart" element={<CartScreen />} />
          <Route path="/student/payment" element={<PaymentScreen />} />
          <Route path="/student/order/:id" element={<OrderTrackingScreen />} />
          <Route path="/student/orders" element={<OrderHistoryScreen />} />
          <Route path="/student/feedback/:id" element={<FeedbackScreen />} />

          {/* Staff Flow */}
          <Route path="/staff/dashboard" element={<StaffDashboardScreen />} />
          <Route path="/staff/orders" element={<StaffOrdersScreen />} />
          <Route path="/staff/menu" element={<StaffInventoryScreen />} />
          <Route path="/staff/history" element={<StaffHistoryScreen />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
