import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolImages } from '../../assets/images';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Edit2,
  X,
  Check,
  GraduationCap,
  Users,
} from 'lucide-react';

export const SchoolProfileView: React.FC = () => {
  const { profilSekolah, updateProfilSekolah, currentRole, siswaList, guruList } = useSchool();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...profilSekolah });

  const handleOpenEdit = () => {
    setFormData({ ...profilSekolah });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfilSekolah(formData);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Profil Lembaga & Identitas Satuan Pendidikan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Data pokok pendidikan (Dapodik / Kemendikbudristek), legalitas akreditasi, dan sarana prasarana
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            type="button"
            onClick={handleOpenEdit}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profil Sekolah</span>
          </button>
        )}
      </div>

      {/* Hero Campus Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={SchoolImages.campus}
            alt="Gedung Kampus SMA Cendekia Nusantara"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-1">
                Satuan Pendidikan Menengah Atas
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {profilSekolah.nama}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                NPSN: <span className="font-mono tabular-nums">{profilSekolah.npsn}</span> · Akreditasi: {profilSekolah.akreditasi}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-xs">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Sekolah Adiwiyata & Rujukan Digital</span>
            </div>
          </div>
        </div>

        {/* Identity Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-b border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block mb-1">Alamat Kampus</span>
            <span className="font-semibold text-slate-800 leading-snug block">
              {profilSekolah.alamat}, {profilSekolah.kota}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block mb-1">Kepala Sekolah</span>
            <span className="font-semibold text-slate-800 block">
              {profilSekolah.kepalaSekolah}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">NIP: {profilSekolah.nipKepalaSekolah}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block mb-1">Tahun Ajaran Aktif</span>
            <span className="font-semibold text-slate-800 font-mono tabular-nums block">
              {profilSekolah.tahunAjaranAktif} ({profilSekolah.semesterAktif})
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">Kalender Pendidikan Berjalan</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block mb-1">Kontak & Portal</span>
            <span className="font-mono tabular-nums text-slate-800 block">{profilSekolah.telepon}</span>
            <span className="text-[11px] text-indigo-600 hover:underline block truncate font-mono">
              {profilSekolah.email}
            </span>
          </div>
        </div>
      </div>

      {/* Photos & Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lab Sains & Fasilitas */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            <div className="relative h-56 w-full overflow-hidden">
              <img
                src={SchoolImages.lab}
                alt="Laboratorium Sains Terpadu"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <span className="text-[11px] font-semibold text-indigo-300">Fasilitas Unggulan</span>
                <h4 className="text-sm font-bold">Laboratorium Sains Terpadu & Riset Siswa</h4>
              </div>
            </div>
            <div className="p-5 text-xs text-slate-600 leading-relaxed">
              Dilengkapi instrumen biologi molekuler, spektrofotometer, mikroskop optik trinokuler, serta fasilitas pengujian kimia berstandar keselamatan laboratorium nasional. Menunjang riset mandiri dan pembinaan olimpiade sains.
            </div>
          </div>
          <div className="px-5 pb-5 pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
            <span>Daya Tampung: 40 Siswa / Sesi</span>
            <span className="text-emerald-600 font-medium">Terverifikasi Standar BSNP</span>
          </div>
        </div>

        {/* Visi, Misi & Tujuan Satuan Pendidikan */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <div>
            <span className="text-indigo-600 font-bold uppercase tracking-wider text-[11px] block mb-1">
              Visi Satuan Pendidikan
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              "Terwujudnya insan cendekia yang beriman dan bertakwa, cerdas komprehensif, berkarakter Pancasila, serta berdaya saing global."
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-indigo-600 font-bold uppercase tracking-wider text-[11px] block">
              Misi Satuan Pendidikan
            </span>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>Menyelenggarakan pembelajaran berdiferensiasi yang memerdekakan potensi siswa.</li>
              <li>Mengembangkan budaya riset, penalaran kritis, dan inovasi teknologi digital.</li>
              <li>Menanamkan nilai-nilai integritas, kejujuran, dan kepedulian sosial lingkungan.</li>
              <li>Membangun kemitraan strategis dengan perguruan tinggi terkemuka dalam dan luar negeri.</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Ruang Kelas</span>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">24 Ruang</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Konektivitas Internet</span>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">1 Gbps FO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Profil Sekolah */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Edit Profil & Identitas Sekolah</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nama Resmi Sekolah*</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">NPSN (Nomor Pokok Sekolah)</label>
                  <input
                    type="text"
                    required
                    value={formData.npsn}
                    onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Akreditasi</label>
                  <input
                    type="text"
                    required
                    value={formData.akreditasi}
                    onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Alamat Kampus</label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Kota / Kabupaten</label>
                  <input
                    type="text"
                    value={formData.kota}
                    onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nama Kepala Sekolah</label>
                  <input
                    type="text"
                    value={formData.kepalaSekolah}
                    onChange={(e) => setFormData({ ...formData, kepalaSekolah: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">NIP Kepala Sekolah</label>
                  <input
                    type="text"
                    value={formData.nipKepalaSekolah}
                    onChange={(e) => setFormData({ ...formData, nipKepalaSekolah: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Tahun Ajaran Aktif</label>
                  <input
                    type="text"
                    value={formData.tahunAjaranAktif}
                    onChange={(e) => setFormData({ ...formData, tahunAjaranAktif: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Semester</label>
                  <select
                    value={formData.semesterAktif}
                    onChange={(e) => setFormData({ ...formData, semesterAktif: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
