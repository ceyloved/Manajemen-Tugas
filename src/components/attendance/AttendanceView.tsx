import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { StatusPresensi } from '../../types';
import { DAFTAR_KELAS } from '../../data/mockData';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Check,
  Download,
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    siswaList,
    presensiList,
    setPresensiStatus,
    bulkMarkClassAttendance,
    currentRole,
  } = useSchool();

  const [selectedDate, setSelectedDate] = useState('2026-10-15');
  const [selectedClass, setSelectedClass] = useState('XII MIPA 1');
  const [viewMode, setViewMode] = useState<'input' | 'rekap'>('input');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const studentsInClass = siswaList.filter((s) => s.kelas === selectedClass && s.status === 'Aktif');

  // Cari status presensi untuk masing-masing siswa pada tanggal terpilih
  const getStudentAttendance = (siswaId: string) => {
    return presensiList.find(
      (p) => p.siswaId === siswaId && p.tanggal === selectedDate
    );
  };

  // Hitung metrik kelas
  let hadirCount = 0;
  let sakitCount = 0;
  let izinCount = 0;
  let alpaCount = 0;

  studentsInClass.forEach((s) => {
    const record = getStudentAttendance(s.id);
    const status = record?.status || 'Hadir'; // Default hadir jika belum tercatat
    if (status === 'Hadir') hadirCount++;
    else if (status === 'Sakit') sakitCount++;
    else if (status === 'Izin') izinCount++;
    else if (status === 'Alpa') alpaCount++;
  });

  const totalStudents = studentsInClass.length || 1;
  const attendanceRate = Math.round((hadirCount / totalStudents) * 100);

  const handleBulkAllPresent = () => {
    bulkMarkClassAttendance(selectedClass, 'Hadir', selectedDate);
  };

  const handleStatusChange = (siswaId: string, status: StatusPresensi) => {
    const existing = getStudentAttendance(siswaId);
    setPresensiStatus(siswaId, status, existing?.keterangan, selectedDate);
  };

  const handleSaveNote = (siswaId: string) => {
    const existing = getStudentAttendance(siswaId);
    setPresensiStatus(siswaId, existing?.status || 'Hadir', noteInput, selectedDate);
    setEditingNoteId(null);
    setNoteInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Presensi & Kehadiran Peserta Didik
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan daftar hadir kelas, rekapitulasi kehadiran berkala, dan surat izin
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('input')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'input'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Input Harian
          </button>
          <button
            type="button"
            onClick={() => setViewMode('rekap')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              viewMode === 'rekap'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rekap Bulanan
          </button>
        </div>
      </div>

      {/* Filter Rombel & Tanggal */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-slate-600">Pilih Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {DAFTAR_KELAS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-slate-600">Tanggal:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {currentRole !== 'wali_murid' && viewMode === 'input' && (
          <button
            type="button"
            onClick={handleBulkAllPresent}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Tandai Semua Hadir</span>
          </button>
        )}
      </div>

      {/* Stats Summary Strip for the selected class & date */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Siswa Terdaftar</div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">{studentsInClass.length}</div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-emerald-700 font-medium">Hadir (H)</div>
          <div className="text-xl font-bold text-emerald-800 font-mono tabular-nums mt-0.5">{hadirCount}</div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-blue-700 font-medium">Sakit (S)</div>
          <div className="text-xl font-bold text-blue-800 font-mono tabular-nums mt-0.5">{sakitCount}</div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-amber-700 font-medium">Izin (I)</div>
          <div className="text-xl font-bold text-amber-800 font-mono tabular-nums mt-0.5">{izinCount}</div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-xs text-rose-700 font-medium">Alpa (A)</div>
          <div className="text-xl font-bold text-rose-800 font-mono tabular-nums mt-0.5">{alpaCount}</div>
        </div>
      </div>

      {viewMode === 'input' ? (
        /* Presensi Input Table */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-12 text-center">No.</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">NISN</th>
                  <th className="py-3 px-4 text-center">Status Kehadiran</th>
                  <th className="py-3 px-4">Keterangan / Alasan</th>
                  <th className="py-3 px-4 text-right">Waktu Presensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentsInClass.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Tidak ada peserta didik di rombel {selectedClass}.
                    </td>
                  </tr>
                ) : (
                  studentsInClass.map((siswa, idx) => {
                    const record = getStudentAttendance(siswa.id);
                    const currentStatus: StatusPresensi = record?.status || 'Hadir';

                    return (
                      <tr key={siswa.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {siswa.nama}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-500">
                          {siswa.nisn}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {(['Hadir', 'Sakit', 'Izin', 'Alpa'] as StatusPresensi[]).map((st) => {
                              const isSelected = currentStatus === st;
                              const colors = {
                                Hadir: isSelected
                                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700',
                                Sakit: isSelected
                                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700',
                                Izin: isSelected
                                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700',
                                Alpa: isSelected
                                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700',
                              };

                              return (
                                <button
                                  key={st}
                                  type="button"
                                  disabled={currentRole === 'wali_murid'}
                                  onClick={() => handleStatusChange(siswa.id, st)}
                                  className={`px-2.5 py-1 rounded text-xs transition-colors font-medium ${colors[st]} ${
                                    currentRole === 'wali_murid' ? 'cursor-default opacity-80' : 'cursor-pointer'
                                  }`}
                                  title={`Tandai ${st}`}
                                >
                                  {st.charAt(0)}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {editingNoteId === siswa.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                autoFocus
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                placeholder="Tuliskan keterangan..."
                                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveNote(siswa.id)}
                                className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                if (currentRole !== 'wali_murid') {
                                  setEditingNoteId(siswa.id);
                                  setNoteInput(record?.keterangan || '');
                                }
                              }}
                              className={`cursor-pointer hover:underline text-[11px] ${
                                record?.keterangan ? 'text-slate-800' : 'text-slate-400 italic'
                              }`}
                            >
                              {record?.keterangan || (currentRole === 'wali_murid' ? '-' : '+ Tambah catatan')}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400 text-[11px]">
                          {record?.waktuCatat || '07:00'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Rekapitulasi Presensi Table */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Rekapitulasi Kehadiran Kelas {selectedClass} - Bulan Berjalan
            </h3>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Cetak Rekap Absensi</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-4 w-12 text-center">No.</th>
                  <th className="py-2.5 px-4">Nama Siswa</th>
                  <th className="py-2.5 px-3 text-center text-emerald-800">Hadir</th>
                  <th className="py-2.5 px-3 text-center text-blue-800">Sakit</th>
                  <th className="py-2.5 px-3 text-center text-amber-800">Izin</th>
                  <th className="py-2.5 px-3 text-center text-rose-800">Alpa</th>
                  <th className="py-2.5 px-4 text-center">Persentase (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentsInClass.map((siswa, idx) => {
                  // Simulasi data agregat kehadiran bulan ini
                  const h = 20 - (idx % 3);
                  const s = idx % 2 === 0 ? 1 : 0;
                  const i = idx === 1 ? 1 : 0;
                  const a = idx === 2 ? 1 : 0;
                  const total = h + s + i + a;
                  const pct = Math.round((h / total) * 100);

                  return (
                    <tr key={siswa.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 text-center font-mono tabular-nums text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{siswa.nama}</td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums text-emerald-700 font-bold">{h}</td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums text-blue-700">{s}</td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums text-amber-700">{i}</td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums text-rose-700">{a}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="font-mono tabular-nums font-bold text-slate-900">{pct}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
