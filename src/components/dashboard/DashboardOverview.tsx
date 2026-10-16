import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolImages } from '../../assets/images';
import {
  Users,
  Briefcase,
  UserCheck,
  CreditCard,
  Calendar,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    profilSekolah,
    siswaList,
    guruList,
    presensiList,
    sppList,
    pengumumanList,
    jadwalList,
    setActiveTab,
    currentRole,
  } = useSchool();

  const todayStr = '2026-10-15';
  const todayPresensi = presensiList.filter((p) => p.tanggal === todayStr);

  const hadirCount = todayPresensi.filter((p) => p.status === 'Hadir').length;
  const sakitCount = todayPresensi.filter((p) => p.status === 'Sakit').length;
  const izinCount = todayPresensi.filter((p) => p.status === 'Izin').length;
  const alpaCount = todayPresensi.filter((p) => p.status === 'Alpa').length;
  const totalRecorded = todayPresensi.length || 1;
  const attendanceRate = Math.round((hadirCount / totalRecorded) * 100);

  // SPP stats
  const currentMonthSpp = sppList.filter((s) => s.bulan.includes('Oktober'));
  const totalSppNominal = currentMonthSpp.reduce((acc, curr) => acc + curr.jumlah, 0);
  const paidSppNominal = currentMonthSpp
    .filter((s) => s.status === 'Lunas')
    .reduce((acc, curr) => acc + curr.jumlah, 0);
  const paidSppCount = currentMonthSpp.filter((s) => s.status === 'Lunas').length;

  // Jadwal Hari ini (Kamis)
  const jadwalHariIni = jadwalList.filter((j) => j.hari === 'Kamis').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Hero School Campus Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs">
        <div className="absolute inset-0 z-0">
          <img
            src={SchoolImages.campus}
            alt="Kampus SMA Cendekia Nusantara"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl text-white space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <span>Kurikulum Merdeka Mandiri Berbagi</span>
              <span aria-hidden="true">·</span>
              <span>NPSN {profilSekolah.npsn}</span>
              <span aria-hidden="true">·</span>
              <span>Terakreditasi {profilSekolah.akreditasi}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white text-balance">
              {profilSekolah.nama}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Mewujudkan generasi unggul berkarakter luhur, berwawasan global, dan terampil dalam penguasaan sains, teknologi, serta seni budaya bangsa.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col items-start gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('presensi')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <UserCheck className="w-4 h-4" />
              <span>Input Presensi Hari Ini</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('spp')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/20 flex items-center gap-2 whitespace-nowrap"
            >
              <CreditCard className="w-4 h-4" />
              <span>Cek Tagihan SPP</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Siswa */}
        <div
          onClick={() => setActiveTab('siswa')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Siswa Aktif</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {siswaList.filter((s) => s.status === 'Aktif').length}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-600">12 Rombel</span>
            <span>· Fase E & F</span>
          </div>
        </div>

        {/* Guru */}
        <div
          onClick={() => setActiveTab('guru')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Tenaga Pendidik (GTK)</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {guruList.length}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
            <span>PNS, PPPK, & GTY</span>
            <span>· 100% S1/S2</span>
          </div>
        </div>

        {/* Kehadiran Hari Ini */}
        <div
          onClick={() => setActiveTab('presensi')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Kehadiran Hari Ini</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {attendanceRate}%
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-700 font-medium">{hadirCount} Hadir</span>
            <span>·</span>
            <span className="text-amber-700 font-medium">{sakitCount + izinCount} Sakit/Izin</span>
            <span>·</span>
            <span className="text-rose-700 font-medium">{alpaCount} Alpa</span>
          </div>
        </div>

        {/* SPP Bulan Ini */}
        <div
          onClick={() => setActiveTab('spp')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">SPP Oktober 2026</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            Rp {paidSppNominal.toLocaleString('id-ID')}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
            <span>{paidSppCount} dari {currentMonthSpp.length} Siswa Terbayar</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col (2 spans): Kehadiran Breakdown & Jadwal Terdekat */}
        <div className="lg:col-span-2 space-y-6">
          {/* Kehadiran Harian Monitoring */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Rekapitulasi Presensi Hari Ini</h2>
                <p className="text-xs text-slate-500">Kamis, 15 Oktober 2026 · Realtime SIMS Presensi</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('presensi')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Kelola Presensi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual Attendance Progress */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex mb-4">
              <div
                style={{ width: `${(hadirCount / totalRecorded) * 100}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Hadir: ${hadirCount}`}
              />
              <div
                style={{ width: `${(sakitCount / totalRecorded) * 100}%` }}
                className="bg-blue-400 h-full transition-all"
                title={`Sakit: ${sakitCount}`}
              />
              <div
                style={{ width: `${(izinCount / totalRecorded) * 100}%` }}
                className="bg-amber-400 h-full transition-all"
                title={`Izin: ${izinCount}`}
              />
              <div
                style={{ width: `${(alpaCount / totalRecorded) * 100}%` }}
                className="bg-rose-500 h-full transition-all"
                title={`Alpa: ${alpaCount}`}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                <div className="text-emerald-700 font-medium">Hadir Tepat Waktu</div>
                <div className="text-lg font-bold text-emerald-900 font-mono tabular-nums">{hadirCount}</div>
                <div className="text-[11px] text-emerald-600">Presensi Fingerprint/SIMS</div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="text-blue-700 font-medium">Sakit (Keterangan)</div>
                <div className="text-lg font-bold text-blue-900 font-mono tabular-nums">{sakitCount}</div>
                <div className="text-[11px] text-blue-600">Surat Dokter Valid</div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="text-amber-700 font-medium">Izin Resmi</div>
                <div className="text-lg font-bold text-amber-900 font-mono tabular-nums">{izinCount}</div>
                <div className="text-[11px] text-amber-600">Dispensasi & Lomba</div>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                <div className="text-rose-700 font-medium">Alpa / Tanpa Kabar</div>
                <div className="text-lg font-bold text-rose-900 font-mono tabular-nums">{alpaCount}</div>
                <div className="text-[11px] text-rose-600">Notifikasi WA Terkirim</div>
              </div>
            </div>
          </div>

          {/* Jadwal Pelajaran Hari Ini */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Agenda KBM Hari Ini (Kamis)</h2>
                <p className="text-xs text-slate-500">Jadwal tatap muka kelas unggulan</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('jadwal')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Lihat Semua Jadwal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {jadwalHariIni.map((jadwal) => (
                <div key={jadwal.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex flex-col items-center justify-center font-mono text-slate-700 text-xs font-semibold shrink-0">
                      <span>J-{jadwal.jamKe}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{jadwal.mataPelajaran}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-medium text-slate-700">{jadwal.guruNama}</span>
                        <span>·</span>
                        <span className="text-indigo-600">{jadwal.ruang}</span>
                        <span>·</span>
                        <span>{jadwal.kelas}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-mono tabular-nums text-slate-500 whitespace-nowrap bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                    {jadwal.waktu}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col (1 span): Kepala Sekolah Message & Pengumuman */}
        <div className="space-y-6">
          {/* Sambutan Kepala Sekolah */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
            <div className="relative mb-3">
              <img
                src={SchoolImages.principal}
                alt={profilSekolah.kepalaSekolah}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Kepala Sekolah Bertugas" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{profilSekolah.kepalaSekolah}</h3>
            <p className="text-xs text-slate-500 mb-2">Kepala Sekolah · NIP: {profilSekolah.nipKepalaSekolah}</p>
            <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed text-balance">
              "Pendidikan bukan sekadar mengisi bejana, melainkan menyalakan api keingintahuan dan integritas setiap generasi masa depan."
            </p>
          </div>

          {/* Pengumuman Terkini */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-900">Warta & Pengumuman</h2>
              <button
                type="button"
                onClick={() => setActiveTab('pengumuman')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Semua
              </button>
            </div>

            <div className="space-y-3">
              {pengumumanList.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveTab('pengumuman')}
                  className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-semibold text-indigo-600">{item.kategori}</span>
                    <span className="font-mono tabular-nums">{item.tanggal}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 line-clamp-2">
                    {item.judul}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {item.konten}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
