
'use client';

import Navigation from './components/Navigation';
import DailyStatusSection from './components/DailyStatusSection';
import FollowUpsSection from './components/FollowUpsSection';
import ScheduleSection from './components/ScheduleSection';
import ShortcutTemplatesSection from './components/ShortcutTemplatesSection';


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation isDark={false} toggleTheme={() => { }} />
      <div className="max-w-4xl mx-auto p-4 grid gap-8">
        <DailyStatusSection />
        <FollowUpsSection />
        <ScheduleSection />
        <ShortcutTemplatesSection />
      </div>
    </main>
  );
}

