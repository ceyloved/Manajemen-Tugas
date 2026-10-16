import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Siswa, NilaiSiswa } from '../../types';
import { DAFTAR_KELAS, DAFTAR_MAPEL } from '../../data/mockData';
import {
  Award,
  Search,
  Printer,
  Check,
  Edit2,
  FileText,
  X,
  GraduationCap,
} from 'lucide-react';

export const GradesView: React.FC = () => {
  const {
    siswaList,
    nilaiList,
    saveOrUpdateNilai,
    profilSekolah,
    currentRole,
  } = useSchool();

  const [selectedClass, setSelectedClass] = useState('XII MIPA 1');
  const [selectedMapel, setSelectedMapel] = useState('Matematika Peminatan');
  const [selectedSemester, setSelectedSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');

  // Modal Cetak Rapor
  const [isRaporModalOpen, setIsRaporModalOpen] = useState(false);
  const [selectedStudentForRapor, setSelectedStudentForRapor] = useState<Siswa | null>(null);

  // Edit Nilai Modal
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [activeSiswaForScore, setActiveSiswaForScore] = useState<Siswa | null>(null);
  const [scoreForm, setScoreForm] = useState({
    tugas: 85,
    formatif: 85,
    uts: 80,
    uas: 85,
    capaianKompetensi: 'Menunjukkan penguasaan materi yang baik.',
  });

  const studentsInClass = siswaList.filter((s) => s.kelas === selectedClass && s.status === 'Aktif');

  const getStudentScore = (siswaId: string): NilaiSiswa | undefined => {
    return nilaiList.find(
      (n) =>
        n.siswaId === siswaId &&
        n.mataPelajaran === selectedMapel &&
        n.semester === selectedSemester
    );
  };

  const handleOpenScoreInput = (siswa: Siswa) => {
    setActiveSiswaForScore(siswa);
    const existing = getStudentScore(siswa.id);
    if (existing) {
      setScoreForm({
        tugas: existing.tugas,
        formatif: existing.formatif,
        uts: existing.uts,
        uas: existing.uas,
        capaianKompetensi: existing.capaianKompetensi,
      });
    } else {
      setScoreForm({
        tugas: 80,
        formatif: 80,
        uts: 80,
        uas: 80,
        capaianKompetensi: 'Memahami konsep dasar mata pelajaran dengan baik.',
      });
    }
    setIsInputModalOpen(true);
  };

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSiswaForScore) return;

    saveOrUpdateNilai({
      siswaId: activeSiswaForScore.id,
      siswaNama: activeSiswaForScore.nama,
      kelas: selectedClass,
      mataPelajaran: selectedMapel,
      semester: selectedSemester,
      tahunAjaran: profilSekolah.tahunAjaranAktif,
      tugas: Number(scoreForm.tugas),
      formatif: Number(scoreForm.formatif),
      uts: Number(scoreForm.uts),
      uas: Number(scoreForm.uas),
      capaianKompetensi: scoreForm.capaianKompetensi,
    });
    setIsInputModalOpen(false);
  };

  const handleOpenRapor = (siswa: Siswa) => {
    setSelectedStudentForRapor(siswa);
    setIsRaporModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Penilaian Akademik & E-Rapor Digital
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengolahan nilai formatif, sumatif tengah semester, akhir semester, dan pencetakan buku rapor Kurikulum Merdeka
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium">Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {DAFTAR_KELAS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium">Mata Pelajaran:</span>
            <select
              value={selectedMapel}
              onChange={(e) => setSelectedMapel(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {DAFTAR_MAPEL.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as 'Ganjil' | 'Genap')}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Ganjil">Semester Ganjil</option>
              <option value="Genap">Semester Genap</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono tabular-nums">
          Bobot: Tugas (20%) + Formatif (20%) + UTS (30%) + UAS (30%)
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">No.</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">NISN</th>
                <th className="py-3 px-3 text-center">Tugas (20%)</th>
                <th className="py-3 px-3 text-center">Formatif (20%)</th>
                <th className="py-3 px-3 text-center">UTS (30%)</th>
                <th className="py-3 px-3 text-center">UAS (30%)</th>
                <th className="py-3 px-3 text-center font-bold text-slate-900">Nilai Akhir</th>
                <th className="py-3 px-3 text-center">Predikat</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentsInClass.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Tidak ada siswa pada rombel {selectedClass}.
                  </td>
                </tr>
              ) : (
                studentsInClass.map((siswa, idx) => {
                  const score = getStudentScore(siswa.id);

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
                      <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-600">
                        {score ? score.tugas : '-'}
                      </td>
                      <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-600">
                        {score ? score.formatif : '-'}
                      </td>
                      <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-600">
                        {score ? score.uts : '-'}
                      </td>
                      <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-600">
                        {score ? score.uas : '-'}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 tabular-nums">
                        {score ? score.nilaiAkhir : '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {score ? (
                          <span
                            className={`font-mono font-bold ${
                              score.predikat === 'A'
                                ? 'text-emerald-700'
                                : score.predikat === 'B'
                                ? 'text-indigo-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {score.predikat}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {currentRole !== 'wali_murid' && (
                            <button
                              type="button"
                              onClick={() => handleOpenScoreInput(siswa)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium rounded transition-colors flex items-center gap-1"
                              title="Input / Edit Nilai"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>{score ? 'Ubah' : 'Input'}</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenRapor(siswa)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded transition-colors flex items-center gap-1"
                            title="Cetak Lembar E-Rapor"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Rapor</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Nilai */}
      {isInputModalOpen && activeSiswaForScore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Input Nilai Siswa</h3>
                <p className="text-xs text-slate-500">
                  {activeSiswaForScore.nama} · {selectedMapel} ({selectedClass})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInputModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScore} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nilai Tugas (20%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scoreForm.tugas}
                    onChange={(e) => setScoreForm({ ...scoreForm, tugas: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Asesmen Formatif (20%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scoreForm.formatif}
                    onChange={(e) => setScoreForm({ ...scoreForm, formatif: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nilai UTS / ASTS (30%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scoreForm.uts}
                    onChange={(e) => setScoreForm({ ...scoreForm, uts: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nilai UAS / ASAS (30%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scoreForm.uas}
                    onChange={(e) => setScoreForm({ ...scoreForm, uas: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Deskripsi Capaian Kompetensi</label>
                <textarea
                  rows={3}
                  value={scoreForm.capaianKompetensi}
                  onChange={(e) => setScoreForm({ ...scoreForm, capaianKompetensi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Live Calculated Final Score */}
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
                <span className="text-indigo-900 font-medium">Estimasi Nilai Akhir:</span>
                <span className="text-base font-bold font-mono text-indigo-700">
                  {Math.round(scoreForm.tugas * 0.2 + scoreForm.formatif * 0.2 + scoreForm.uts * 0.3 + scoreForm.uas * 0.3)}
                </span>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInputModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Nilai</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cetak Lembar E-Rapor Siswa Resmi */}
      {isRaporModalOpen && selectedStudentForRapor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
            {/* Header Dialog Controls */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 no-print">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pratinjau Lembar Hasil Belajar Siswa (E-Rapor)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsRaporModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Indonesian School Report Header (Kop Surat Resmi) */}
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <div className="text-xs uppercase tracking-widest text-slate-600 font-bold">
                PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-600 font-bold">
                DINAS PENDIDIKAN DAN KEBUDAYAAN
              </div>
              <h2 className="text-lg font-bold uppercase tracking-tight text-slate-900 mt-1">
                {profilSekolah.nama}
              </h2>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {profilSekolah.alamat}, Kec. {profilSekolah.kecamatan}, {profilSekolah.kota} | Telp: {profilSekolah.telepon}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                NPSN: {profilSekolah.npsn} · Akreditasi: {profilSekolah.akreditasi} · Website: {profilSekolah.website}
              </p>
            </div>

            {/* Student Metadata Table */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Nama Peserta Didik:</span>
                <span className="font-bold text-slate-900">{selectedStudentForRapor.nama}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Kelas / Fase:</span>
                <span className="font-bold text-slate-900">{selectedStudentForRapor.kelas} ({selectedStudentForRapor.jurusan})</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Nomor Induk Siswa Nasional (NISN):</span>
                <span className="font-mono tabular-nums text-slate-900">{selectedStudentForRapor.nisn}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Semester / Tahun Ajaran:</span>
                <span className="font-semibold text-slate-900">{selectedSemester} / {profilSekolah.tahunAjaranAktif}</span>
              </div>
            </div>

            {/* Report Grade Table */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                A. Nilai Capaian Kompetensi Kurikulum Merdeka
              </div>
              <table className="w-full text-left border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800 text-[11px]">
                    <th className="p-2 border-r border-slate-300 w-10 text-center">No</th>
                    <th className="p-2 border-r border-slate-300">Mata Pelajaran</th>
                    <th className="p-2 border-r border-slate-300 text-center w-20">Nilai Akhir</th>
                    <th className="p-2 border-r border-slate-300 text-center w-16">Predikat</th>
                    <th className="p-2">Capaian Kompetensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {DAFTAR_MAPEL.slice(0, 8).map((mapel, index) => {
                    const score = nilaiList.find(
                      (n) => n.siswaId === selectedStudentForRapor.id && n.mataPelajaran === mapel
                    );
                    const nilaiFinal = score?.nilaiAkhir || (85 + (index % 8));
                    const predikat = nilaiFinal >= 88 ? 'A' : 'B';
                    const deskripsi =
                      score?.capaianKompetensi ||
                      `Menunjukkan penguasaan materi yang sangat baik dalam memahami konsep serta penerapannya pada tugas terstruktur.`;

                    return (
                      <tr key={mapel}>
                        <td className="p-2 border-r border-slate-300 text-center font-mono tabular-nums text-slate-500">
                          {index + 1}
                        </td>
                        <td className="p-2 border-r border-slate-300 font-semibold text-slate-900">
                          {mapel}
                        </td>
                        <td className="p-2 border-r border-slate-300 text-center font-mono font-bold text-slate-900 tabular-nums">
                          {nilaiFinal}
                        </td>
                        <td className="p-2 border-r border-slate-300 text-center font-bold text-indigo-700">
                          {predikat}
                        </td>
                        <td className="p-2 text-[11px] text-slate-700 leading-snug">
                          {deskripsi}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Signatures Footer */}
            <div className="grid grid-cols-3 gap-6 pt-6 text-xs text-center">
              <div>
                <p className="text-slate-600">Mengetahui,</p>
                <p className="text-slate-600">Orang Tua / Wali Murid</p>
                <div className="h-16" />
                <p className="font-bold border-t border-slate-400 pt-1 text-slate-900">
                  {selectedStudentForRapor.namaWali}
                </p>
              </div>

              <div>
                <p className="text-slate-600">Jakarta, 15 Oktober 2026</p>
                <p className="text-slate-600">Wali Kelas,</p>
                <div className="h-16" />
                <p className="font-bold border-t border-slate-400 pt-1 text-slate-900">
                  Ratna Sari Kusuma, S.Pd.
                </p>
                <p className="text-[10px] text-slate-500 font-mono">NIP: 19920405 201903 2 021</p>
              </div>

              <div>
                <p className="text-slate-600">Mengetahui,</p>
                <p className="text-slate-600">Kepala Sekolah</p>
                <div className="h-16" />
                <p className="font-bold border-t border-slate-400 pt-1 text-slate-900">
                  {profilSekolah.kepalaSekolah}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">NIP: {profilSekolah.nipKepalaSekolah}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
