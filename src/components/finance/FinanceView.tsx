import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { TransaksiSPP } from '../../types';
import { DAFTAR_KELAS } from '../../data/mockData';
import {
  CreditCard,
  Plus,
  Printer,
  Search,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  X,
  Check,
  Send,
  Building,
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const {
    sppList,
    bayarSPP,
    tambahTransaksiSPP,
    siswaList,
    profilSekolah,
    currentRole,
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [classFilter, setClassFilter] = useState('Semua');

  // Modals
  const [isBayarModalOpen, setIsBayarModalOpen] = useState(false);
  const [isKwitansiModalOpen, setIsKwitansiModalOpen] = useState(false);
  const [isNewTagihanModalOpen, setIsNewTagihanModalOpen] = useState(false);
  const [activeTrx, setActiveTrx] = useState<TransaksiSPP | null>(null);

  // Form Bayar
  const [metodeBayar, setMetodeBayar] = useState<TransaksiSPP['metodePembayaran']>('Virtual Account');
  const [petugasNama, setPetugasNama] = useState('Siti Aminah, S.E. (Bendahara)');

  // Form Tagihan Baru
  const [newTagihan, setNewTagihan] = useState({
    siswaId: siswaList[0]?.id || '',
    bulan: 'November 2026',
    tahun: 2026,
    jumlah: 450000,
  });

  const filteredSPP = sppList.filter((trx) => {
    const matchSearch =
      trx.siswaNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trx.noKuitansi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Semua' || trx.status === statusFilter;
    const matchClass = classFilter === 'Semua' || trx.kelas === classFilter;
    return matchSearch && matchStatus && matchClass;
  });

  // Metrik Keuangan
  const totalNominal = sppList.reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalLunas = sppList
    .filter((s) => s.status === 'Lunas')
    .reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalTunggakan = sppList
    .filter((s) => s.status === 'Tertunggak')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const handleOpenBayar = (trx: TransaksiSPP) => {
    setActiveTrx(trx);
    setIsBayarModalOpen(true);
  };

  const handleConfirmBayar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrx) return;
    bayarSPP(activeTrx.id, metodeBayar, petugasNama);
    setIsBayarModalOpen(false);
  };

  const handleOpenKwitansi = (trx: TransaksiSPP) => {
    setActiveTrx(trx);
    setIsKwitansiModalOpen(true);
  };

  const handleCreateTagihan = (e: React.FormEvent) => {
    e.preventDefault();
    const siswa = siswaList.find((s) => s.id === newTagihan.siswaId);
    if (!siswa) return;

    tambahTransaksiSPP({
      siswaId: siswa.id,
      siswaNama: siswa.nama,
      kelas: siswa.kelas,
      bulan: newTagihan.bulan,
      tahun: Number(newTagihan.tahun),
      jumlah: Number(newTagihan.jumlah),
      status: 'Tertunggak',
    });
    setIsNewTagihanModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Administrasi Iuran & SPP Sekolah
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan pembayaran SPP bulanan, rekonsiliasi kas, dan kuitansi pembayaran resmi
          </p>
        </div>

        {currentRole === 'admin' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsNewTagihanModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Tagihan Baru</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Total Target Iuran Bulan Ini
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            Rp {totalNominal.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-slate-500 mt-1">Alokasi operasional sarpras & KBM</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-emerald-700">
            Penerimaan Kas (Lunas)
          </div>
          <div className="text-2xl font-bold text-emerald-800 font-mono tabular-nums mt-1">
            Rp {totalLunas.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-emerald-600 mt-1">
            {sppList.filter((s) => s.status === 'Lunas').length} Transaksi Terverifikasi
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-rose-700">
            Piutang / Tertunggak
          </div>
          <div className="text-2xl font-bold text-rose-800 font-mono tabular-nums mt-1">
            Rp {totalTunggakan.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-rose-600 mt-1">
            {sppList.filter((s) => s.status === 'Tertunggak').length} Peserta Didik
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa atau no kuitansi..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Semua">Semua Status</option>
              <option value="Lunas">Lunas</option>
              <option value="Tertunggak">Tertunggak</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Kelas:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
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
        </div>
      </div>

      {/* Table SPP Transactions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">No. Kuitansi / Bukti</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Bulan Tagihan</th>
                <th className="py-3 px-4 font-mono">Jumlah (Rp)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSPP.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ditemukan catatan transaksi SPP.
                  </td>
                </tr>
              ) : (
                filteredSPP.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                      {trx.noKuitansi}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {trx.siswaNama}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {trx.kelas}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {trx.bulan}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold tabular-nums text-slate-900">
                      Rp {trx.jumlah.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-semibold ${
                          trx.status === 'Lunas' ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {trx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {trx.metodePembayaran ? (
                        <span>{trx.metodePembayaran}</span>
                      ) : (
                        <span className="text-slate-400 italic">Menunggu bayar</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {trx.status === 'Tertunggak' ? (
                          <>
                            {currentRole !== 'wali_murid' ? (
                              <button
                                type="button"
                                onClick={() => handleOpenBayar(trx)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors"
                              >
                                Bayar
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => alert(`Instruksi transfer Virtual Account BNI: 9880-2010-${trx.siswaId.replace(/\D/g, '')} sebesar Rp ${trx.jumlah.toLocaleString('id-ID')}`)}
                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded transition-colors"
                              >
                                Bayar VA
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenKwitansi(trx)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-medium rounded transition-colors flex items-center gap-1"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Kwitansi</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Bayar SPP */}
      {isBayarModalOpen && activeTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Pembayaran SPP</h3>
              <button
                type="button"
                onClick={() => setIsBayarModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBayar} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Siswa:</span>
                  <span className="font-semibold text-slate-900">{activeTrx.siswaNama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kelas:</span>
                  <span className="font-semibold text-slate-900">{activeTrx.kelas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Periode Tagihan:</span>
                  <span className="font-semibold text-slate-900">{activeTrx.bulan}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-700 font-bold">Nominal Pembayaran:</span>
                  <span className="font-bold text-indigo-700 font-mono text-sm">
                    Rp {activeTrx.jumlah.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Kanal / Metode Pembayaran</label>
                <select
                  value={metodeBayar}
                  onChange={(e) => setMetodeBayar(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Virtual Account">Virtual Account Bank (BNI / Mandiri)</option>
                  <option value="Tunai di Kasir">Kasir Loket Tata Usaha (Tunai)</option>
                  <option value="QRIS">QRIS Standar Nasional</option>
                  <option value="Transfer Bank">Transfer Rekening Giro Sekolah</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Petugas Penerima Kas</label>
                <input
                  type="text"
                  value={petugasNama}
                  onChange={(e) => setPetugasNama(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBayarModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Validasi Lunas & Cetak</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Kwitansi Resmi Pembayaran */}
      {isKwitansiModalOpen && activeTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 no-print">
              <h3 className="text-sm font-bold text-slate-900">Kwitansi Pembayaran Resmi</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Kwitansi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsKwitansiModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Kuitansi Container */}
            <div className="p-6 border-2 border-slate-300 rounded-xl bg-amber-50/20 text-xs space-y-4">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <div className="font-bold text-slate-900 uppercase tracking-wide text-sm">
                    {profilSekolah.nama}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Unit Pengelola Administrasi & Keuangan Siswa
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-indigo-700">
                    {activeTrx.noKuitansi}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Tanggal: {activeTrx.tanggalBayar || '15 Oktober 2026'}
                  </div>
                </div>
              </div>

              <div className="text-center font-bold text-base tracking-wider uppercase text-slate-900 my-1 underline decoration-slate-300">
                KWITANSI TANDA TERIMA
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex">
                  <span className="w-36 text-slate-500">Telah Terima Dari:</span>
                  <span className="font-bold text-slate-900">{activeTrx.siswaNama} ({activeTrx.kelas})</span>
                </div>
                <div className="flex">
                  <span className="w-36 text-slate-500">Uang Sejumlah:</span>
                  <span className="font-semibold text-slate-900 italic bg-slate-100 px-2 py-0.5 rounded">
                    "Empat Ratus Lima Puluh Ribu Rupiah"
                  </span>
                </div>
                <div className="flex">
                  <span className="w-36 text-slate-500">Untuk Pembayaran:</span>
                  <span className="font-medium text-slate-800">
                    Iuran Penyelenggaraan Pendidikan (SPP) Bulan {activeTrx.bulan}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-36 text-slate-500">Metode Transaksi:</span>
                  <span className="font-semibold text-indigo-700">{activeTrx.metodePembayaran}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                <div className="p-2 border border-slate-300 bg-white rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Terbayar</span>
                  <span className="text-base font-bold font-mono text-emerald-800">
                    Rp {activeTrx.jumlah.toLocaleString('id-ID')}
                  </span>
                  <span className="block text-[9px] text-emerald-600 font-semibold mt-0.5">LUNAS / SAH</span>
                </div>

                <div className="text-center text-[11px]">
                  <p className="text-slate-500">Bendahara Penerima,</p>
                  <div className="h-12 flex items-center justify-center italic text-slate-400 text-xs">
                    ( Tanda Tangan & Cap )
                  </div>
                  <p className="font-bold text-slate-800">{activeTrx.petugas || 'Siti Aminah, S.E.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tagihan Baru */}
      {isNewTagihanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Buat Tagihan Iuran Siswa</h3>
              <button
                type="button"
                onClick={() => setIsNewTagihanModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTagihan} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Pilih Peserta Didik</label>
                <select
                  value={newTagihan.siswaId}
                  onChange={(e) => setNewTagihan({ ...newTagihan, siswaId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {siswaList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.kelas} - {s.nisn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Bulan Tagihan</label>
                  <input
                    type="text"
                    value={newTagihan.bulan}
                    onChange={(e) => setNewTagihan({ ...newTagihan, bulan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    value={newTagihan.jumlah}
                    onChange={(e) => setNewTagihan({ ...newTagihan, jumlah: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTagihanModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Terbitkan Tagihan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
