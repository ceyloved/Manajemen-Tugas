import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Siswa } from '../../types';
import { DAFTAR_KELAS } from '../../data/mockData';
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  IdCard,
  X,
  Check,
  GraduationCap,
  Printer,
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const {
    siswaList,
    addSiswa,
    updateSiswa,
    deleteSiswa,
    presensiList,
    nilaiList,
    sppList,
    profilSekolah,
    currentRole,
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [activeSiswa, setActiveSiswa] = useState<Siswa | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Siswa, 'id'>>({
    nisn: '',
    nis: '',
    nama: '',
    jenisKelamin: 'L',
    kelas: 'X-1',
    jurusan: 'Fase E (Umum)',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    namaWali: '',
    kontakWali: '',
    status: 'Aktif',
    angkatan: '2025',
  });

  const filteredStudents = siswaList.filter((siswa) => {
    const matchSearch =
      siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      siswa.nisn.includes(searchTerm) ||
      siswa.nis.includes(searchTerm);
    const matchClass = selectedClass === 'Semua' || siswa.kelas === selectedClass;
    const matchStatus = selectedStatus === 'Semua' || siswa.status === selectedStatus;
    return matchSearch && matchClass && matchStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      nisn: `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      nis: `2526${Math.floor(1000 + Math.random() * 9000)}`,
      nama: '',
      jenisKelamin: 'L',
      kelas: 'X-1',
      jurusan: 'Fase E (Umum)',
      tempatLahir: 'Jakarta',
      tanggalLahir: '2009-05-15',
      alamat: '',
      namaWali: '',
      kontakWali: '0812-',
      status: 'Aktif',
      angkatan: '2025',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (siswa: Siswa) => {
    setActiveSiswa(siswa);
    setFormData({
      nisn: siswa.nisn,
      nis: siswa.nis,
      nama: siswa.nama,
      jenisKelamin: siswa.jenisKelamin,
      kelas: siswa.kelas,
      jurusan: siswa.jurusan,
      tempatLahir: siswa.tempatLahir,
      tanggalLahir: siswa.tanggalLahir,
      alamat: siswa.alamat,
      namaWali: siswa.namaWali,
      kontakWali: siswa.kontakWali,
      status: siswa.status,
      angkatan: siswa.angkatan,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) return;
    addSiswa(formData);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSiswa || !formData.nama.trim()) return;
    updateSiswa(activeSiswa.id, formData);
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string, nama: string) => {
    if (confirm(`Hapus data peserta didik ${nama}?`)) {
      deleteSiswa(id);
    }
  };

  const exportCSV = () => {
    const headers = 'NISN,NIS,Nama Lengkap,L/P,Kelas,Jurusan,Nama Wali,Kontak Wali,Status\n';
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.nisn}","${s.nis}","${s.nama}","${s.jenisKelamin}","${s.kelas}","${s.jurusan}","${s.namaWali}","${s.kontakWali}","${s.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `data_siswa_cendekia_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Data Induk Kesiswaan</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen buku induk siswa, mutasi, dan pencatatan biodata peserta didik aktif
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={exportCSV}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
          {currentRole === 'admin' && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Siswa Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan Nama, NISN, atau NIS..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Semua">Semua Rombel</option>
              {DAFTAR_KELAS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Alumni">Alumni</option>
              <option value="Pindah">Pindah / Mutasi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Data Siswa */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">NISN / NIS</th>
                <th className="py-3 px-4">Nama Lengkap Siswa</th>
                <th className="py-3 px-4">L/P</th>
                <th className="py-3 px-4">Kelas & Jurusan</th>
                <th className="py-3 px-4">Wali Murid</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data siswa yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((siswa) => (
                  <tr key={siswa.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                      <div>{siswa.nisn}</div>
                      <div className="text-[10px] text-slate-400">NIS: {siswa.nis}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {siswa.nama.charAt(0)}
                        </div>
                        <div>
                          <div>{siswa.nama}</div>
                          <div className="text-[11px] text-slate-400">{siswa.tempatLahir}, {siswa.tanggalLahir}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {siswa.jenisKelamin === 'L' ? 'L (Laki-laki)' : 'P (Perempuan)'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{siswa.kelas}</div>
                      <div className="text-[11px] text-slate-400">{siswa.jurusan}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{siswa.namaWali}</div>
                      <div className="text-[10px] text-slate-400 font-mono tabular-nums">{siswa.kontakWali}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-medium text-emerald-700">
                        {siswa.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSiswa(siswa);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                          title="Lihat Profil Lengkap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSiswa(siswa);
                            setIsCardModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                          title="Cetak Kartu Pelajar"
                        >
                          <IdCard className="w-3.5 h-3.5" />
                        </button>
                        {currentRole === 'admin' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(siswa)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors"
                              title="Edit Biodata Siswa"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(siswa.id, siswa.nama)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                              title="Hapus Siswa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <span>Menampilkan <strong className="font-mono tabular-nums text-slate-700">{filteredStudents.length}</strong> dari <strong className="font-mono tabular-nums text-slate-700">{siswaList.length}</strong> siswa</span>
          <span className="font-mono tabular-nums text-[11px]">Database EMIS & Dapodik Terintegrasi</span>
        </div>
      </div>

      {/* Modal Detail Siswa */}
      {isDetailModalOpen && activeSiswa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {activeSiswa.nama.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activeSiswa.nama}</h3>
                  <p className="text-xs text-slate-500">NISN: {activeSiswa.nisn} · Kelas {activeSiswa.kelas}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Biodata Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Tempat & Tanggal Lahir</span>
                <span className="font-semibold text-slate-800">{activeSiswa.tempatLahir}, {activeSiswa.tanggalLahir}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Jenis Kelamin</span>
                <span className="font-semibold text-slate-800">{activeSiswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Nama Orang Tua / Wali</span>
                <span className="font-semibold text-slate-800">{activeSiswa.namaWali}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">No. Kontak Wali</span>
                <span className="font-semibold text-slate-800 font-mono tabular-nums">{activeSiswa.kontakWali}</span>
              </div>
              <div className="col-span-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Alamat Tinggal</span>
                <span className="font-semibold text-slate-800">{activeSiswa.alamat}</span>
              </div>
            </div>

            {/* Riwayat Nilai Singkat */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Riwayat Nilai Terbaru</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Mata Pelajaran</th>
                      <th className="p-2.5 text-center">UTS</th>
                      <th className="p-2.5 text-center">UAS</th>
                      <th className="p-2.5 text-center">Nilai Akhir</th>
                      <th className="p-2.5 text-center">Predikat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {nilaiList.filter((n) => n.siswaId === activeSiswa.id).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-3 text-center text-slate-400">
                          Belum ada nilai terinput untuk peserta didik ini.
                        </td>
                      </tr>
                    ) : (
                      nilaiList
                        .filter((n) => n.siswaId === activeSiswa.id)
                        .map((n) => (
                          <tr key={n.id}>
                            <td className="p-2.5 font-medium text-slate-800">{n.mataPelajaran}</td>
                            <td className="p-2.5 text-center font-mono tabular-nums">{n.uts}</td>
                            <td className="p-2.5 text-center font-mono tabular-nums">{n.uas}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-slate-900 tabular-nums">{n.nilaiAkhir}</td>
                            <td className="p-2.5 text-center font-bold text-indigo-600">{n.predikat}</td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
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

      {/* Modal Cetak Kartu Pelajar */}
      {isCardModalOpen && activeSiswa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Kartu Tanda Pelajar Digital</h3>
              <button
                type="button"
                onClick={() => setIsCardModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Kartu Pelajar Visual Container (Standard Indonesian Student ID Card) */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-lg relative overflow-hidden border border-indigo-700/50">
              {/* Header Kartu */}
              <div className="flex items-center gap-3 border-b border-indigo-400/30 pb-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-indigo-200 font-semibold">
                    KARTU TANDA PELAJAR
                  </div>
                  <div className="text-sm font-bold tracking-wide">
                    {profilSekolah.nama}
                  </div>
                  <div className="text-[10px] text-indigo-300">
                    NPSN: {profilSekolah.npsn} · Terakreditasi A
                  </div>
                </div>
              </div>

              {/* Body Kartu */}
              <div className="flex gap-4">
                {/* Foto Box */}
                <div className="w-24 h-32 rounded-lg bg-slate-800/80 border border-indigo-400/30 flex flex-col items-center justify-center shrink-0 overflow-hidden relative">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/30 flex items-center justify-center text-xl font-bold mb-1">
                    {activeSiswa.nama.charAt(0)}
                  </div>
                  <span className="text-[9px] text-slate-300">FOTO 3x4</span>
                  <div className="absolute bottom-0 inset-x-0 bg-indigo-950/90 text-[8px] text-center py-0.5 text-indigo-300 uppercase">
                    {activeSiswa.kelas}
                  </div>
                </div>

                {/* Info Text */}
                <div className="flex-1 space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-indigo-300 block text-[9px] uppercase">Nama Lengkap</span>
                    <span className="font-bold text-white text-xs">{activeSiswa.nama}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-indigo-300 block text-[9px] uppercase">NISN</span>
                      <span className="font-mono tabular-nums text-white">{activeSiswa.nisn}</span>
                    </div>
                    <div>
                      <span className="text-indigo-300 block text-[9px] uppercase">NIS</span>
                      <span className="font-mono tabular-nums text-white">{activeSiswa.nis}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-indigo-300 block text-[9px] uppercase">Tempat, Tgl Lahir</span>
                    <span className="text-white">{activeSiswa.tempatLahir}, {activeSiswa.tanggalLahir}</span>
                  </div>
                  <div>
                    <span className="text-indigo-300 block text-[9px] uppercase">Jurusan / Fase</span>
                    <span className="text-white">{activeSiswa.jurusan}</span>
                  </div>
                </div>
              </div>

              {/* Barcode & Signature Footer */}
              <div className="mt-4 pt-3 border-t border-indigo-400/30 flex items-end justify-between text-[10px]">
                <div className="space-y-1">
                  <div className="font-mono tracking-widest text-xs text-indigo-200">
                    ||| | |||| | ||||| ||| ||||
                  </div>
                  <div className="font-mono text-[9px] text-indigo-300">{activeSiswa.nisn}</div>
                </div>
                <div className="text-right text-[9px] text-indigo-200">
                  <div>Kepala Sekolah,</div>
                  <div className="font-bold mt-2 text-white">{profilSekolah.kepalaSekolah}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">Format standar ISO CR80 (Kartu Siswa)</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Kartu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Siswa */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isAddModalOpen ? 'Pendaftaran Peserta Didik Baru' : 'Edit Biodata Siswa'}
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
                  <label className="block text-slate-600 font-medium mb-1">NISN (10 Digit)*</label>
                  <input
                    type="text"
                    required
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">NIS Sekolah*</label>
                  <input
                    type="text"
                    required
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Nama Lengkap Siswa*</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Farhan Pratama"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
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
                  <label className="block text-slate-600 font-medium mb-1">Status Siswa</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Pindah">Pindah</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.tempatLahir}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Nama jalan, RT/RW, kelurahan, kecamatan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={formData.namaWali}
                    onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nomor WhatsApp / HP Wali</label>
                  <input
                    type="text"
                    value={formData.kontakWali}
                    onChange={(e) => setFormData({ ...formData, kontakWali: e.target.value })}
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
                  <span>Simpan Data Siswa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
