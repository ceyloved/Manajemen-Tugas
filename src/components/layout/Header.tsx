import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { GraduationCap, ShieldCheck, UserCheck, Users, RefreshCw } from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { currentRole, setCurrentRole, activeTab, profilSekolah, resetData } = useSchool();

  const getBreadcrumbName = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Ringkasan Utama';
      case 'siswa':
        return 'Data Kesiswaan';
      case 'guru':
        return 'Tenaga Pendidik & Staf';
      case 'presensi':
        return 'Presensi Harian Siswa';
      case 'nilai':
        return 'Penilaian & E-Rapor';
      case 'jadwal':
        return 'Jadwal Pelajaran KBM';
      case 'spp':
        return 'Administrasi & SPP';
      case 'pengumuman':
        return 'Pengumuman & Agenda';
      case 'profil':
        return 'Profil Lembaga';
      default:
        return 'Dashboard';
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-3.5 bg-white border-b border-slate-200">
      {/* Zone 1: Single text element Brand wordmark with icon */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            SIMS Cendekia Nusantara
          </span>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            T.A {profilSekolah.tahunAjaranAktif} · Semester {profilSekolah.semesterAktif}
          </span>
        </div>
      </div>

      {/* Zone 2: Breadcrumb context & Quick System Indicator */}
      <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500">
        <span>Sistem Informasi Sekolah</span>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold">{getBreadcrumbName(activeTab)}</span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span className="font-mono tabular-nums text-slate-600">NPSN: {profilSekolah.npsn}</span>
      </div>

      {/* Zone 3: Role Switcher & Reset Button */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Role Switcher Segmented Control */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentRole === 'admin'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Akses Administrator Lengkap"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('guru')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentRole === 'guru'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Akses Pendidik & Wali Kelas"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Guru</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('wali_murid')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              currentRole === 'wali_murid'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Akses Siswa & Wali Murid"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Siswa / Wali</span>
          </button>
        </div>

        {/* Reset Data Helper */}
        <button
          type="button"
          onClick={() => {
            if (confirm('Kembalikan semua data ke pengaturan awal simulasi?')) {
              resetData();
            }
          }}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Reset Data Simulasi"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
