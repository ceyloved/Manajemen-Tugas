import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Siswa,
  Guru,
  PresensiRecord,
  NilaiSiswa,
  JadwalKBM,
  TransaksiSPP,
  PengumumanSekolah,
  ProfilSekolah,
  UserRole,
  StatusPresensi,
} from '../types';
import {
  INITIAL_SISWA,
  INITIAL_GURU,
  INITIAL_PRESENSI,
  INITIAL_NILAI,
  INITIAL_JADWAL,
  INITIAL_TRANSAKSI_SPP,
  INITIAL_PENGUMUMAN,
  PROFIL_SEKOLAH_DEFAULT,
} from '../data/mockData';

interface SchoolContextType {
  // Navigation & Role
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Siswa
  siswaList: Siswa[];
  addSiswa: (siswa: Omit<Siswa, 'id'>) => void;
  updateSiswa: (id: string, siswa: Partial<Siswa>) => void;
  deleteSiswa: (id: string) => void;

  // Guru
  guruList: Guru[];
  addGuru: (guru: Omit<Guru, 'id'>) => void;
  updateGuru: (id: string, guru: Partial<Guru>) => void;
  deleteGuru: (id: string) => void;

  // Presensi
  presensiList: PresensiRecord[];
  setPresensiStatus: (siswaId: string, status: StatusPresensi, keterangan?: string, tanggal?: string) => void;
  bulkMarkClassAttendance: (kelas: string, status: StatusPresensi, tanggal: string) => void;

  // Nilai
  nilaiList: NilaiSiswa[];
  saveOrUpdateNilai: (data: Omit<NilaiSiswa, 'id' | 'nilaiAkhir' | 'predikat'>) => void;

  // Jadwal
  jadwalList: JadwalKBM[];
  addJadwal: (jadwal: Omit<JadwalKBM, 'id'>) => void;
  deleteJadwal: (id: string) => void;

  // SPP
  sppList: TransaksiSPP[];
  bayarSPP: (id: string, metode: TransaksiSPP['metodePembayaran'], petugas: string) => void;
  tambahTransaksiSPP: (transaksi: Omit<TransaksiSPP, 'id' | 'noKuitansi'>) => void;

  // Pengumuman
  pengumumanList: PengumumanSekolah[];
  addPengumuman: (pengumuman: Omit<PengumumanSekolah, 'id' | 'tanggal'>) => void;
  deletePengumuman: (id: string) => void;

  // Profil
  profilSekolah: ProfilSekolah;
  updateProfilSekolah: (data: Partial<ProfilSekolah>) => void;

  // Reset
  resetData: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SISWA: 'sims_cendekia_siswa_v1',
  GURU: 'sims_cendekia_guru_v1',
  PRESENSI: 'sims_cendekia_presensi_v1',
  NILAI: 'sims_cendekia_nilai_v1',
  JADWAL: 'sims_cendekia_jadwal_v1',
  SPP: 'sims_cendekia_spp_v1',
  PENGUMUMAN: 'sims_cendekia_pengumuman_v1',
  PROFIL: 'sims_cendekia_profil_v1',
  ROLE: 'sims_cendekia_role_v1',
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'admin';
  });

  const [siswaList, setSiswaList] = useState<Siswa[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SISWA);
    return saved ? JSON.parse(saved) : INITIAL_SISWA;
  });

  const [guruList, setGuruList] = useState<Guru[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GURU);
    return saved ? JSON.parse(saved) : INITIAL_GURU;
  });

  const [presensiList, setPresensiList] = useState<PresensiRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRESENSI);
    return saved ? JSON.parse(saved) : INITIAL_PRESENSI;
  });

  const [nilaiList, setNilaiList] = useState<NilaiSiswa[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NILAI);
    return saved ? JSON.parse(saved) : INITIAL_NILAI;
  });

  const [jadwalList, setJadwalList] = useState<JadwalKBM[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JADWAL);
    return saved ? JSON.parse(saved) : INITIAL_JADWAL;
  });

  const [sppList, setSppList] = useState<TransaksiSPP[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SPP);
    return saved ? JSON.parse(saved) : INITIAL_TRANSAKSI_SPP;
  });

  const [pengumumanList, setPengumumanList] = useState<PengumumanSekolah[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PENGUMUMAN);
    return saved ? JSON.parse(saved) : INITIAL_PENGUMUMAN;
  });

  const [profilSekolah, setProfilSekolah] = useState<ProfilSekolah>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFIL);
    return saved ? JSON.parse(saved) : PROFIL_SEKOLAH_DEFAULT;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SISWA, JSON.stringify(siswaList));
  }, [siswaList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GURU, JSON.stringify(guruList));
  }, [guruList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESENSI, JSON.stringify(presensiList));
  }, [presensiList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NILAI, JSON.stringify(nilaiList));
  }, [nilaiList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JADWAL, JSON.stringify(jadwalList));
  }, [jadwalList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPP, JSON.stringify(sppList));
  }, [sppList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PENGUMUMAN, JSON.stringify(pengumumanList));
  }, [pengumumanList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFIL, JSON.stringify(profilSekolah));
  }, [profilSekolah]);

  // Actions: Siswa
  const addSiswa = (newSiswa: Omit<Siswa, 'id'>) => {
    const id = `sis-${Date.now().toString().slice(-4)}`;
    setSiswaList((prev) => [ { ...newSiswa, id }, ...prev ]);
  };

  const updateSiswa = (id: string, updated: Partial<Siswa>) => {
    setSiswaList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteSiswa = (id: string) => {
    setSiswaList((prev) => prev.filter((item) => item.id !== id));
  };

  // Actions: Guru
  const addGuru = (newGuru: Omit<Guru, 'id'>) => {
    const id = `gur-${Date.now().toString().slice(-4)}`;
    setGuruList((prev) => [ { ...newGuru, id }, ...prev ]);
  };

  const updateGuru = (id: string, updated: Partial<Guru>) => {
    setGuruList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteGuru = (id: string) => {
    setGuruList((prev) => prev.filter((item) => item.id !== id));
  };

  // Actions: Presensi
  const setPresensiStatus = (
    siswaId: string,
    status: StatusPresensi,
    keterangan?: string,
    targetTanggal?: string
  ) => {
    const today = targetTanggal || new Date().toISOString().split('T')[0];
    const siswa = siswaList.find((s) => s.id === siswaId);
    if (!siswa) return;

    setPresensiList((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.siswaId === siswaId && p.tanggal === today
      );
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          status,
          keterangan: keterangan ?? next[existingIndex].keterangan,
        };
        return next;
      } else {
        const newRecord: PresensiRecord = {
          id: `pres-${Date.now()}-${siswaId}`,
          siswaId,
          siswaNama: siswa.nama,
          kelas: siswa.kelas,
          tanggal: today,
          status,
          keterangan,
          waktuCatat: new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        return [newRecord, ...prev];
      }
    });
  };

  const bulkMarkClassAttendance = (kelas: string, status: StatusPresensi, tanggal: string) => {
    const studentsInClass = siswaList.filter((s) => s.kelas === kelas);
    setPresensiList((prev) => {
      let updated = [...prev];
      studentsInClass.forEach((s) => {
        const idx = updated.findIndex((p) => p.siswaId === s.id && p.tanggal === tanggal);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], status };
        } else {
          updated.push({
            id: `pres-${Date.now()}-${s.id}`,
            siswaId: s.id,
            siswaNama: s.nama,
            kelas: s.kelas,
            tanggal,
            status,
            waktuCatat: '07:00',
          });
        }
      });
      return updated;
    });
  };

  // Actions: Nilai
  const saveOrUpdateNilai = (
    data: Omit<NilaiSiswa, 'id' | 'nilaiAkhir' | 'predikat'>
  ) => {
    // Hitung Nilai Akhir: 20% tugas + 20% formatif + 30% uts + 30% uas
    const calculatedFinal = Math.round(
      data.tugas * 0.2 + data.formatif * 0.2 + data.uts * 0.3 + data.uas * 0.3
    );
    let predikat: 'A' | 'B' | 'C' | 'D' = 'D';
    if (calculatedFinal >= 88) predikat = 'A';
    else if (calculatedFinal >= 76) predikat = 'B';
    else if (calculatedFinal >= 65) predikat = 'C';

    setNilaiList((prev) => {
      const idx = prev.findIndex(
        (n) =>
          n.siswaId === data.siswaId &&
          n.mataPelajaran === data.mataPelajaran &&
          n.semester === data.semester &&
          n.tahunAjaran === data.tahunAjaran
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          ...data,
          nilaiAkhir: calculatedFinal,
          predikat,
        };
        return next;
      } else {
        const newNilai: NilaiSiswa = {
          ...data,
          id: `nil-${Date.now()}`,
          nilaiAkhir: calculatedFinal,
          predikat,
        };
        return [newNilai, ...prev];
      }
    });
  };

  // Actions: Jadwal
  const addJadwal = (newJadwal: Omit<JadwalKBM, 'id'>) => {
    const id = `jad-${Date.now()}`;
    setJadwalList((prev) => [...prev, { ...newJadwal, id }]);
  };

  const deleteJadwal = (id: string) => {
    setJadwalList((prev) => prev.filter((j) => j.id !== id));
  };

  // Actions: SPP
  const bayarSPP = (
    id: string,
    metode: TransaksiSPP['metodePembayaran'] = 'Virtual Account',
    petugas: string = 'Loket Kasir SIMS'
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const generatedNo = `KW/${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${Math.floor(10000 + Math.random() * 90000)}`;

    setSppList((prev) =>
      prev.map((trx) =>
        trx.id === id
          ? {
              ...trx,
              status: 'Lunas',
              tanggalBayar: today,
              metodePembayaran: metode,
              petugas,
              noKuitansi: trx.noKuitansi.startsWith('TAG/') ? generatedNo : trx.noKuitansi,
            }
          : trx
      )
    );
  };

  const tambahTransaksiSPP = (data: Omit<TransaksiSPP, 'id' | 'noKuitansi'>) => {
    const id = `spp-${Date.now()}`;
    const noKuitansi =
      data.status === 'Lunas'
        ? `KW/${data.tahun}/${Math.floor(10000 + Math.random() * 90000)}`
        : `TAG/${data.tahun}/${Math.floor(10000 + Math.random() * 90000)}`;
    setSppList((prev) => [{ ...data, id, noKuitansi }, ...prev]);
  };

  // Actions: Pengumuman
  const addPengumuman = (data: Omit<PengumumanSekolah, 'id' | 'tanggal'>) => {
    const id = `peng-${Date.now()}`;
    const tanggal = new Date().toISOString().split('T')[0];
    setPengumumanList((prev) => [{ ...data, id, tanggal }, ...prev]);
  };

  const deletePengumuman = (id: string) => {
    setPengumumanList((prev) => prev.filter((p) => p.id !== id));
  };

  // Actions: Profil
  const updateProfilSekolah = (data: Partial<ProfilSekolah>) => {
    setProfilSekolah((prev) => ({ ...prev, ...data }));
  };

  // Reset
  const resetData = () => {
    localStorage.removeItem(STORAGE_KEYS.SISWA);
    localStorage.removeItem(STORAGE_KEYS.GURU);
    localStorage.removeItem(STORAGE_KEYS.PRESENSI);
    localStorage.removeItem(STORAGE_KEYS.NILAI);
    localStorage.removeItem(STORAGE_KEYS.JADWAL);
    localStorage.removeItem(STORAGE_KEYS.SPP);
    localStorage.removeItem(STORAGE_KEYS.PENGUMUMAN);
    localStorage.removeItem(STORAGE_KEYS.PROFIL);

    setSiswaList(INITIAL_SISWA);
    setGuruList(INITIAL_GURU);
    setPresensiList(INITIAL_PRESENSI);
    setNilaiList(INITIAL_NILAI);
    setJadwalList(INITIAL_JADWAL);
    setSppList(INITIAL_TRANSAKSI_SPP);
    setPengumumanList(INITIAL_PENGUMUMAN);
    setProfilSekolah(PROFIL_SEKOLAH_DEFAULT);
  };

  return (
    <SchoolContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentRole,
        setCurrentRole,
        siswaList,
        addSiswa,
        updateSiswa,
        deleteSiswa,
        guruList,
        addGuru,
        updateGuru,
        deleteGuru,
        presensiList,
        setPresensiStatus,
        bulkMarkClassAttendance,
        nilaiList,
        saveOrUpdateNilai,
        jadwalList,
        addJadwal,
        deleteJadwal,
        sppList,
        bayarSPP,
        tambahTransaksiSPP,
        pengumumanList,
        addPengumuman,
        deletePengumuman,
        profilSekolah,
        updateProfilSekolah,
        resetData,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
