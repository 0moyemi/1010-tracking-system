
'use client';

import Navigation from './components/Navigation';
import NotificationPermissionPrompt from './components/NotificationPermissionPrompt';
import BroadcastsSection from './components/BroadcastsSection';
import DailyStatusSection from './components/DailyStatusSection';
import FollowUpsSection from './components/FollowUpsSection';
import OrdersSection from './components/OrdersSection';
import ScheduleSection from './components/ScheduleSection';
import ShortcutTemplatesSection from './components/ShortcutTemplatesSection';


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NotificationPermissionPrompt />
      <Navigation isDark={false} toggleTheme={() => { }} />
      <div className="max-w-4xl mx-auto p-4 grid gap-8">
        <DailyStatusSection />
        <BroadcastsSection />
        <FollowUpsSection />
        <OrdersSection />
        <ScheduleSection />
        <ShortcutTemplatesSection />
      </div>
    </main>
  );
}

