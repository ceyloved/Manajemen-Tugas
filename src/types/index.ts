export type UserRole = 'admin' | 'guru' | 'wali_murid';

export interface Siswa {
  id: string;
  nisn: string;
  nis: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  kelas: string;
  jurusan: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  namaWali: string;
  kontakWali: string;
  status: 'Aktif' | 'Alumni' | 'Pindah';
  angkatan: string;
}

export interface Guru {
  id: string;
  nip: string;
  nuptk: string;
  nama: string;
  gelar: string;
  mataPelajaran: string;
  jabatan: string;
  statusKepegawaian: 'PNS' | 'PPPK' | 'GTT' | 'Guru Tetap Yayasan';
  email: string;
  noHp: string;
  pendidikanTerakhir: string;
}

export type StatusPresensi = 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';

export interface PresensiRecord {
  id: string;
  siswaId: string;
  siswaNama: string;
  kelas: string;
  tanggal: string; // YYYY-MM-DD
  status: StatusPresensi;
  keterangan?: string;
  waktuCatat: string;
}

export interface NilaiSiswa {
  id: string;
  siswaId: string;
  siswaNama: string;
  kelas: string;
  mataPelajaran: string;
  semester: 'Ganjil' | 'Genap';
  tahunAjaran: string;
  tugas: number;
  formatif: number;
  uts: number;
  uas: number;
  nilaiAkhir: number;
  predikat: 'A' | 'B' | 'C' | 'D';
  capaianKompetensi: string;
}

export interface JadwalKBM {
  id: string;
  kelas: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamKe: number;
  waktu: string;
  mataPelajaran: string;
  guruNama: string;
  ruang: string;
}

export interface TransaksiSPP {
  id: string;
  noKuitansi: string;
  siswaId: string;
  siswaNama: string;
  kelas: string;
  bulan: string;
  tahun: number;
  jumlah: number;
  status: 'Lunas' | 'Tertunggak';
  tanggalBayar?: string;
  metodePembayaran?: 'Virtual Account' | 'Tunai di Kasir' | 'Transfer Bank' | 'QRIS';
  petugas?: string;
}

export interface PengumumanSekolah {
  id: string;
  judul: string;
  konten: string;
  kategori: 'Akademik' | 'Kegiatan' | 'Keuangan' | 'Informasi';
  tanggal: string;
  target: 'Semua' | 'Guru' | 'Siswa' | 'Orang Tua';
  penulis: string;
  isPenting: boolean;
}

export interface ProfilSekolah {
  nama: string;
  npsn: string;
  status: string;
  akreditasi: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kodepos: string;
  telepon: string;
  email: string;
  website: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  tahunAjaranAktif: string;
  semesterAktif: 'Ganjil' | 'Genap';
}
