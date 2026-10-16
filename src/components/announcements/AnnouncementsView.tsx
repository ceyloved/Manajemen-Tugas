import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { PengumumanSekolah } from '../../types';
import {
  BellRing,
  Plus,
  Search,
  Calendar,
  User,
  Trash2,
  X,
  Check,
  AlertCircle,
  Tag,
} from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const { pengumumanList, addPengumuman, deletePengumuman, currentRole } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedTarget, setSelectedTarget] = useState('Semua');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState<PengumumanSekolah | null>(null);

  const [formData, setFormData] = useState<Omit<PengumumanSekolah, 'id' | 'tanggal'>>({
    judul: '',
    konten: '',
    kategori: 'Akademik',
    target: 'Semua',
    penulis: 'Humas Sekolah',
    isPenting: false,
  });

  const filteredList = pengumumanList.filter((item) => {
    const matchSearch =
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.konten.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === 'Semua' || item.kategori === selectedCategory;
    const matchTarget =
      selectedTarget === 'Semua' || item.target === selectedTarget;
    return matchSearch && matchCategory && matchTarget;
  });

  const handleOpenAdd = () => {
    setFormData({
      judul: '',
      konten: '',
      kategori: 'Akademik',
      target: 'Semua',
      penulis: 'Bidang Kesiswaan & Kurikulum',
      isPenting: false,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.konten.trim()) return;
    addPengumuman(formData);
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, judul: string) => {
    if (confirm(`Hapus pengumuman "${judul}"?`)) {
      deletePengumuman(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Warta, Pengumuman & Agenda Sekolah
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Papan informasi resmi terpadu untuk segenap sivitas akademika, dewan guru, dan wali murid
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Terbitkan Pengumuman</span>
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari pengumuman atau agenda..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Akademik">Akademik</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Keuangan">Keuangan</option>
              <option value="Informasi">Informasi</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Sasaran:</span>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Semua">Semua Target</option>
              <option value="Semua">Umum (Semua)</option>
              <option value="Guru">Khusus Dewan Guru</option>
              <option value="Siswa">Peserta Didik</option>
              <option value="Orang Tua">Orang Tua / Wali</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
            Tidak ada pengumuman yang sesuai dengan filter pencarian.
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-5 shadow-xs transition-all ${
                item.isPenting ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-indigo-700">{item.kategori}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500">Target: {item.target}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500 font-mono tabular-nums">{item.tanggal}</span>
                  {item.isPenting && (
                    <span className="font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                      Pemberitahuan Penting
                    </span>
                  )}
                </div>

                {currentRole === 'admin' && (
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.judul)}
                    className="self-end sm:self-auto p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                    title="Hapus Pengumuman"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2">
                {item.judul}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {item.konten}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Diterbitkan oleh: <strong className="text-slate-700">{item.penulis}</strong></span>
                </div>
                <div className="font-mono text-slate-400">
                  ID: {item.id}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Terbitkan Pengumuman */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Terbitkan Pengumuman Sekolah</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Judul Pengumuman*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jadwal Libur Awal Semester Ganjil"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Keuangan">Keuangan</option>
                    <option value="Informasi">Informasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Sasaran Audiens</label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Semua">Semua (Umum)</option>
                    <option value="Guru">Khusus Guru & Staf</option>
                    <option value="Siswa">Siswa</option>
                    <option value="Orang Tua">Orang Tua / Wali Murid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Isi Lengkap Pengumuman*</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan detail agenda atau pengumuman secara lengkap dan jelas..."
                  value={formData.konten}
                  onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nama Penerbit / Penulis</label>
                  <input
                    type="text"
                    value={formData.penulis}
                    onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPenting}
                      onChange={(e) => setFormData({ ...formData, isPenting: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                    />
                    <span className="font-semibold text-slate-800">Tandai Sangat Penting</span>
                  </label>
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
                  <span>Siarkan Pengumuman</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
