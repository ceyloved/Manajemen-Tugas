import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  CalendarCheck,
  Award,
  CalendarDays,
  CreditCard,
  BellRing,
  Building2,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: ('admin' | 'guru' | 'wali_murid')[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Ringkasan Utama',
    icon: LayoutDashboard,
    roles: ['admin', 'guru', 'wali_murid'],
  },
  {
    id: 'siswa',
    label: 'Data Siswa & Kelas',
    icon: GraduationCap,
    roles: ['admin', 'guru', 'wali_murid'],
  },
  {
    id: 'guru',
    label: 'Tenaga Pendidik',
    icon: Briefcase,
    roles: ['admin', 'guru', 'wali_murid'],
  },
  {
    id: 'presensi',
    label: 'Presensi Harian',
    icon: CalendarCheck,
    roles: ['admin', 'guru', 'wali_murid'],
  },
  {
    id: 'nilai',
    label: 'Nilai & E-Rapor',
    icon: Award,
    roles: ['admin', 'guru', 'wali_murid'],
  },
  {
    id: 'jadwal',
    label: 'Jadwal Pelajaran',
    icon: CalendarDays,
    roles: ['admin', 'guru', 'wali_murid'],
  },
  {
    id: 'spp',
    label: 'Administrasi & SPP',
    icon: CreditCard,
    roles: ['admin', 'guru', 'wali_murid'],
  },
  {
    id: 'pengumuman',
    label: 'Pengumuman & Agenda',
    icon: BellRing,
    roles: ['admin', 'guru', 'wali_murid'],
  },
  {
    id: 'profil',
    label: 'Profil Sekolah',
    icon: Building2,
    roles: ['admin', 'guru', 'wali_murid'],
  },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentRole, profilSekolah, sppList } = useSchool();

  // Hitung notifikasi belum lunas untuk badge iuran
  const pendingSppCount = sppList.filter((s) => s.status === 'Tertunggak').length;

  const filteredNavItems = NAV_ITEMS.filter((item) => item.roles.includes(currentRole));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-61px)]">
      {/* Institution Mini Info */}
      <div className="px-5 py-4 border-b border-slate-800">
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
          Lembaga Pendidikan
        </div>
        <div className="text-sm font-semibold text-white truncate">
          {profilSekolah.nama}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          Akreditasi {profilSekolah.akreditasi}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.id === 'spp' && pendingSppCount > 0 && currentRole === 'admin' && (
                <span className="text-xs font-mono tabular-nums px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  {pendingSppCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom User Role Badge */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">
          Peran Terpilih
        </div>
        <div className="flex items-center justify-between text-white font-medium">
          <span className="capitalize">
            {currentRole === 'admin'
              ? 'Administrator'
              : currentRole === 'guru'
              ? 'Dewan Pendidik'
              : 'Siswa / Wali Murid'}
          </span>
          <span className="text-[10px] text-indigo-400 font-mono">SIMS v2.4</span>
        </div>
      </div>
    </aside>
  );
};
