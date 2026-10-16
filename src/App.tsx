/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { StudentsView } from './components/students/StudentsView';
import { TeachersView } from './components/teachers/TeachersView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { GradesView } from './components/grades/GradesView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { FinanceView } from './components/finance/FinanceView';
import { AnnouncementsView } from './components/announcements/AnnouncementsView';
import { SchoolProfileView } from './components/school-profile/SchoolProfileView';

const MainLayout: React.FC = () => {
  const { activeTab } = useSchool();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'siswa':
        return <StudentsView />;
      case 'guru':
        return <TeachersView />;
      case 'presensi':
        return <AttendanceView />;
      case 'nilai':
        return <GradesView />;
      case 'jadwal':
        return <ScheduleView />;
      case 'spp':
        return <FinanceView />;
      case 'pengumuman':
        return <AnnouncementsView />;
      case 'profil':
        return <SchoolProfileView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainLayout />
    </SchoolProvider>
  );
}
