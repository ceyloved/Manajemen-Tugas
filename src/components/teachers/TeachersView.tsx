import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Guru } from '../../types';
import { DAFTAR_MAPEL } from '../../data/mockData';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Briefcase,
  X,
  Check,
  Award,
} from 'lucide-react';

export const TeachersView: React.FC = () => {
  const { guruList, addGuru, updateGuru, deleteGuru, currentRole } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeGuru, setActiveGuru] = useState<Guru | null>(null);

  const [formData, setFormData] = useState<Omit<Guru, 'id'>>({
    nip: '',
    nuptk: '',
    nama: '',
    gelar: 'S.Pd.',
    mataPelajaran: 'Matematika Wajib',
    jabatan: 'Guru Mata Pelajaran',
    statusKepegawaian: 'PNS',
    email: '',
    noHp: '0812-',
    pendidikanTerakhir: 'S1 Pendidikan',
  });

  const filteredTeachers = guruList.filter((guru) => {
    const matchSearch =
      guru.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guru.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guru.nip.includes(searchTerm);
    const matchStatus =
      selectedStatus === 'Semua' || guru.statusKepegawaian === selectedStatus;
    return matchSearch && matchStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      nip: `1985${Math.floor(1000 + Math.random() * 9000)} 201001 1 00${Math.floor(1 + Math.random() * 9)}`,
      nuptk: `88${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
      nama: '',
      gelar: 'S.Pd., M.Pd.',
      mataPelajaran: 'Matematika Wajib',
      jabatan: 'Guru Mata Pelajaran & Wali Kelas',
      statusKepegawaian: 'PNS',
      email: '',
      noHp: '0812-3456-7890',
      pendidikanTerakhir: 'S2 Pendidikan Universitas Negeri Jakarta',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (guru: Guru) => {
    setActiveGuru(guru);
    setFormData({
      nip: guru.nip,
      nuptk: guru.nuptk,
      nama: guru.nama,
      gelar: guru.gelar,
      mataPelajaran: guru.mataPelajaran,
      jabatan: guru.jabatan,
      statusKepegawaian: guru.statusKepegawaian,
      email: guru.email,
      noHp: guru.noHp,
      pendidikanTerakhir: guru.pendidikanTerakhir,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) return;
    const email = formData.email || `${formData.nama.toLowerCase().replace(/\s+/g, '.')}@cendekianusantara.sch.id`;
    addGuru({ ...formData, email });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGuru || !formData.nama.trim()) return;
    updateGuru(activeGuru.id, formData);
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string, nama: string) => {
    if (confirm(`Hapus data pendidik ${nama}?`)) {
      deleteGuru(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Tenaga Pendidik & Tenaga Kependidikan (GTK)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar dewan guru, jabatan struktural, kualifikasi akademik, dan data kepegawaian
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Guru Baru</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan Nama, NIP, atau Mata Pelajaran..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Status Kepegawaian:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="PNS">PNS</option>
            <option value="PPPK">PPPK</option>
            <option value="Guru Tetap Yayasan">Guru Tetap Yayasan</option>
          </select>
        </div>
      </div>

      {/* Teachers Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((guru) => (
          <div
            key={guru.id}
            className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 text-indigo-700 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                    {guru.nama.replace(/(Drs\.|Dra\.|Ir\.)/g, '').trim().charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {guru.nama}, {guru.gelar}
                    </h3>
                    <div className="text-[11px] text-indigo-600 font-medium">
                      {guru.mataPelajaran}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {guru.statusKepegawaian}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 my-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-[11px]">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{guru.jabatan}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{guru.pendidikanTerakhir}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums text-slate-500">
                  <span>NIP: {guru.nip}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <a
                  href={`mailto:${guru.email}`}
                  className="p-1 hover:text-indigo-600 transition-colors"
                  title={guru.email}
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`tel:${guru.noHp}`}
                  className="p-1 hover:text-indigo-600 transition-colors"
                  title={guru.noHp}
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveGuru(guru);
                    setIsDetailModalOpen(true);
                  }}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                  title="Lihat Detail Pendidik"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                {currentRole === 'admin' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(guru)}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors"
                      title="Edit Guru"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(guru.id, guru.nama)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                      title="Hapus Guru"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Guru */}
      {isDetailModalOpen && activeGuru && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{activeGuru.nama}, {activeGuru.gelar}</h3>
                <p className="text-xs text-slate-500">{activeGuru.jabatan}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">NIP:</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-800">{activeGuru.nip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">NUPTK:</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-800">{activeGuru.nuptk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Kepegawaian:</span>
                  <span className="font-semibold text-slate-800">{activeGuru.statusKepegawaian}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bidang Pengampu:</span>
                  <span className="font-semibold text-indigo-700">{activeGuru.mataPelajaran}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pendidikan Terakhir:</span>
                  <span className="font-semibold text-slate-800">{activeGuru.pendidikanTerakhir}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Email Kedinasan:</span>
                  <span className="font-mono text-slate-800">{activeGuru.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nomor Telepon/WA:</span>
                  <span className="font-mono tabular-nums text-slate-800">{activeGuru.noHp}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Guru */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isAddModalOpen ? 'Tambah Tenaga Pendidik Baru' : 'Edit Data Pendidik'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nama Lengkap (Tanpa Gelar)*</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Gelar Akademik*</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: S.Pd., M.Pd."
                    value={formData.gelar}
                    onChange={(e) => setFormData({ ...formData, gelar: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">NUPTK (16 Digit)</label>
                  <input
                    type="text"
                    value={formData.nuptk}
                    onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Mata Pelajaran Diampu</label>
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
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Status Kepegawaian</label>
                  <select
                    value={formData.statusKepegawaian}
                    onChange={(e) => setFormData({ ...formData, statusKepegawaian: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                    <option value="PPPK">PPPK</option>
                    <option value="Guru Tetap Yayasan">Guru Tetap Yayasan / Tetap</option>
                    <option value="GTT">GTT (Guru Tidak Tetap)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Jabatan / Tugas Tambahan</label>
                <input
                  type="text"
                  placeholder="Contoh: Wali Kelas XII MIPA 1 / Pembina OSIS"
                  value={formData.jabatan}
                  onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Pendidikan Terakhir & Kampus</label>
                <input
                  type="text"
                  placeholder="Contoh: S2 Pendidikan Matematika UNJ"
                  value={formData.pendidikanTerakhir}
                  onChange={(e) => setFormData({ ...formData, pendidikanTerakhir: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Email Kedinasan</label>
                  <input
                    type="email"
                    placeholder="nama.guru@cendekianusantara.sch.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nomor WhatsApp / HP</label>
                  <input
                    type="text"
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Data Guru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
