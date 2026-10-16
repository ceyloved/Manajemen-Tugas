import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { JadwalKBM } from '../../types';
import { DAFTAR_KELAS, DAFTAR_MAPEL } from '../../data/mockData';
import {
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  Printer,
  X,
  Check,
  User,
  MapPin,
} from 'lucide-react';

const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const;

export const ScheduleView: React.FC = () => {
  const { jadwalList, addJadwal, deleteJadwal, guruList, currentRole } = useSchool();

  const [selectedClass, setSelectedClass] = useState('XII MIPA 1');
  const [selectedDay, setSelectedDay] = useState<string>('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<JadwalKBM, 'id'>>({
    kelas: selectedClass,
    hari: 'Senin',
    jamKe: 1,
    waktu: '07.00 - 08.30',
    mataPelajaran: 'Matematika Peminatan',
    guruNama: 'Drs. Hendro Wibowo, M.Pd.',
    ruang: 'R. 301',
  });

  const filteredJadwal = jadwalList.filter((j) => {
    const matchClass = j.kelas === selectedClass;
    const matchDay = selectedDay === 'Semua' || j.hari === selectedDay;
    return matchClass && matchDay;
  });

  const handleOpenAdd = () => {
    setFormData({
      kelas: selectedClass,
      hari: 'Senin',
      jamKe: 1,
      waktu: '07.00 - 08.30',
      mataPelajaran: DAFTAR_MAPEL[0],
      guruNama: guruList[0]?.nama || 'Guru Pengampu',
      ruang: 'R. 301',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addJadwal(formData);
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, mapel: string) => {
    if (confirm(`Hapus jadwal ${mapel}?`)) {
      deleteJadwal(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Jadwal Pelajaran KBM (Roster)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan alokasi jam mengajar, ruang kelas, dan pembagian mata pelajaran mingguan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Jadwal</span>
          </button>
          {currentRole === 'admin' && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Class & Day Filter */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-slate-600">Pilih Rombel:</span>
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

        {/* Days segmented control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setSelectedDay('Semua')}
            className={`px-3 py-1 rounded-md transition-colors ${
              selectedDay === 'Semua'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Hari
          </button>
          {HARI_LIST.map((hari) => (
            <button
              key={hari}
              type="button"
              onClick={() => setSelectedDay(hari)}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedDay === hari
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {hari}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of days */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(selectedDay === 'Semua' ? HARI_LIST : [selectedDay as any]).map((hari) => {
          const list = filteredJadwal
            .filter((j) => j.hari === hari)
            .sort((a, b) => a.jamKe - b.jamKe);

          return (
            <div
              key={hari}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col"
            >
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{hari}</span>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  {list.length} Sesi KBM
                </span>
              </div>

              <div className="p-3 space-y-2.5 flex-1 divide-y divide-slate-100">
                {list.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Belum ada jadwal KBM pada hari {hari}.
                  </div>
                ) : (
                  list.map((item) => (
                    <div key={item.id} className="pt-2.5 first:pt-0 group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-bold text-slate-700">
                            Jam {item.jamKe}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.waktu}
                          </span>
                        </div>
                        {currentRole === 'admin' && (
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.mataPelajaran)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                            title="Hapus sesi ini"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="mt-1.5">
                        <div className="text-xs font-bold text-slate-900">{item.mataPelajaran}</div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.guruNama}</span>
                        </div>
                        <div className="text-[10px] text-indigo-600 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span>{item.ruang}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tambah Jadwal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Tambah Jadwal KBM Baru</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Kelas Rombel</label>
                  <select
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {DAFTAR_KELAS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Hari KBM</label>
                  <select
                    value={formData.hari}
                    onChange={(e) => setFormData({ ...formData, hari: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {HARI_LIST.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Jam Ke-</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    required
                    value={formData.jamKe}
                    onChange={(e) => setFormData({ ...formData, jamKe: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Alokasi Waktu</label>
                  <input
                    type="text"
                    placeholder="Contoh: 07.00 - 08.30"
                    required
                    value={formData.waktu}
                    onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Mata Pelajaran</label>
                <select
                  value={formData.mataPelajaran}
                  onChange={(e) => setFormData({ ...formData, mataPelajaran: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {DAFTAR_MAPEL.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Guru Pengajar</label>
                  <select
                    value={formData.guruNama}
                    onChange={(e) => setFormData({ ...formData, guruNama: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {guruList.map((g) => (
                      <option key={g.id} value={`${g.nama}, ${g.gelar}`}>
                        {g.nama}, {g.gelar}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Ruang Pembelajaran</label>
                  <input
                    type="text"
                    placeholder="Contoh: R. 301 / Lab Komputer"
                    required
                    value={formData.ruang}
                    onChange={(e) => setFormData({ ...formData, ruang: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Jadwal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
