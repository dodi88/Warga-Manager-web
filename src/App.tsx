/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Wallet, 
  LayoutDashboard, 
  LogOut, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight,
  Filter,
  X,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Settings as SettingsIcon,
  Printer,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  MessageCircle,
  Calendar,
  Shield,
  ArrowRightLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface User {
  username: string;
  role: 'admin' | 'user';
}

interface Warga {
  id: number;
  nama: string;
  nik: string;
  alamat: string;
  telepon: string;
  status: string;
  tanggal_input: string;
}

interface Keuangan {
  id: number;
  tanggal: string;
  tipe: 'pemasukan' | 'pengeluaran';
  kategori: string;
  jumlah: number;
  keterangan: string;
}

interface Stats {
  totalWarga: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  saldo: number;
}

interface AppSettings {
  app_name: string;
  app_logo: string;
  gang_logo: string;
  primary_color: string;
  invoice_header: string;
  invoice_footer: string;
}

interface Tagihan {
  id: number;
  warga_id: number;
  nama_warga: string;
  alamat_warga: string;
  nik_warga?: string;
  nomor_tagihan: string;
  tanggal: string;
  jatuh_tempo: string;
  status: 'Belum Bayar' | 'Lunas';
  total: number;
  items?: TagihanItem[];
}

interface TagihanItem {
  id?: number;
  deskripsi: string;
  jumlah: number;
}

interface BillingSchedule {
  id: number;
  nama: string;
  hari_tagihan: number;
  jumlah: number;
  deskripsi: string;
}

interface RondaGroup {
  id: number;
  nama: string;
}

interface RondaMember {
  warga_id: number;
  group_id: number;
  nama_warga: string;
  nama_group: string;
}

// --- Components ---

const Login = ({ onLogin, settings }: { onLogin: (user: User) => void, settings: AppSettings }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError('Username atau password salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px]" style={{ backgroundColor: settings.primary_color }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px]" style={{ backgroundColor: settings.primary_color }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            {settings.app_logo ? (
              <img src={settings.app_logo} alt="Logo" className="w-20 h-20 object-contain rounded-2xl shadow-lg" />
            ) : (
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Users className="text-white w-8 h-8" />
              </div>
            )}
          </div>
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">{settings.app_name}</h2>
          <p className="text-center text-slate-500 mb-8">Informasi Penting</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Masukkan username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Masukkan password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              Masuk
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ stats }: { stats: Stats }) => {
  const cards = [
    { title: 'Total Warga', value: stats.totalWarga, icon: Users, color: 'bg-blue-500', text: 'Orang' },
    { title: 'Pemasukan', value: stats.totalPemasukan, icon: TrendingUp, color: 'bg-emerald-500', text: 'IDR', isCurrency: true },
    { title: 'Pengeluaran', value: stats.totalPengeluaran, icon: TrendingDown, color: 'bg-rose-500', text: 'IDR', isCurrency: true },
    { title: 'Saldo Kas', value: stats.saldo, icon: Wallet, color: 'bg-primary', text: 'IDR', isCurrency: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
              <card.icon size={24} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.text}</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">{card.title}</h3>
          <p className="text-2xl font-bold text-slate-800">
            {card.isCurrency ? `Rp ${card.value.toLocaleString('id-ID')}` : card.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

const WargaList = ({ role, onUpdate }: { role: string, onUpdate: () => void }) => {
  const [warga, setWarga] = useState<Warga[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWarga, setEditingWarga] = useState<Warga | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    alamat: '',
    telepon: '',
    status: 'Tetap'
  });

  const fetchWarga = async () => {
    const res = await fetch('/api/warga');
    const data = await res.json();
    setWarga(data);
  };

  useEffect(() => { fetchWarga(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingWarga ? `/api/warga/${editingWarga.id}` : '/api/warga';
    const method = editingWarga ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (res.ok) {
      setShowModal(false);
      setEditingWarga(null);
      setFormData({ nama: '', nik: '', alamat: '', telepon: '', status: 'Tetap' });
      fetchWarga();
      onUpdate();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus data warga ini?')) {
      await fetch(`/api/warga/${id}`, { method: 'DELETE' });
      fetchWarga();
      onUpdate();
    }
  };

  const filteredWarga = warga.filter(w => 
    w.nama.toLowerCase().includes(search.toLowerCase()) || 
    w.nik.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama atau NIK..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {role === 'admin' && (
          <button 
            onClick={() => { setEditingWarga(null); setShowModal(true); }}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Plus size={20} /> Tambah Warga
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredWarga.map((w) => (
            <motion.div 
              key={w.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-800">{w.nama}</h4>
                  <p className="text-xs font-mono text-slate-400">NIK: {w.nik}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  w.status === 'Tetap' ? 'bg-emerald-100 text-emerald-700' : 
                  w.status === 'Kontrak' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {w.status}
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="text-sm">{w.alamat || '-'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-sm">{w.telepon || '-'}</span>
                </div>
              </div>

              {role === 'admin' && (
                <div className="flex gap-2 pt-4 border-t border-slate-50">
                  <button 
                    onClick={() => {
                      setEditingWarga(w);
                      setFormData({
                        nama: w.nama,
                        nik: w.nik,
                        alamat: w.alamat || '',
                        telepon: w.telepon || '',
                        status: w.status
                      });
                      setShowModal(true);
                    }}
                    className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(w.id)}
                    className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">{editingWarga ? 'Edit Data Warga' : 'Tambah Warga Baru'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">NIK</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                    value={formData.nik}
                    onChange={(e) => setFormData({...formData, nik: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option>Tetap</option>
                    <option>Kontrak</option>
                    <option>Kost</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat</label>
                  <textarea 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                    rows={2}
                    value={formData.alamat}
                    onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Telepon</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                    value={formData.telepon}
                    onChange={(e) => setFormData({...formData, telepon: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20"
                >
                  Simpan
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const KeuanganList = ({ role, onUpdate }: { role: string, onUpdate: () => void }) => {
  const [keuangan, setKeuangan] = useState<Keuangan[]>([]);
  const [filter, setFilter] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'pemasukan' | 'pengeluaran'>('pemasukan');
  const [formData, setFormData] = useState({
    kategori: '',
    jumlah: '',
    keterangan: '',
    tanggal: new Date().toISOString().split('T')[0]
  });

  const fetchKeuangan = async () => {
    const res = await fetch('/api/keuangan');
    const data = await res.json();
    setKeuangan(data);
  };

  useEffect(() => { fetchKeuangan(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/keuangan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        tipe: modalType,
        jumlah: parseFloat(formData.jumlah)
      }),
    });
    
    if (res.ok) {
      setShowModal(false);
      setFormData({ kategori: '', jumlah: '', keterangan: '', tanggal: new Date().toISOString().split('T')[0] });
      fetchKeuangan();
      onUpdate();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus transaksi ini?')) {
      await fetch(`/api/keuangan/${id}`, { method: 'DELETE' });
      fetchKeuangan();
      onUpdate();
    }
  };

  const filteredData = keuangan.filter(k => 
    filter === 'Semua' || k.tipe === filter.toLowerCase()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
          {['Semua', 'Pemasukan', 'Pengeluaran'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === f ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {role === 'admin' && (
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => { setModalType('pemasukan'); setShowModal(true); }}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95"
            >
              <TrendingUp size={18} /> Pemasukan
            </button>
            <button 
              onClick={() => { setModalType('pengeluaran'); setShowModal(true); }}
              className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-rose-200 transition-all active:scale-95"
            >
              <TrendingDown size={18} /> Pengeluaran
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Jumlah</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Keterangan</th>
                {role === 'admin' && <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((k) => (
                <tr key={k.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{k.tanggal}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        k.tipe === 'pemasukan' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {k.tipe === 'pemasukan' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      </div>
                      <span className="text-sm font-bold text-slate-800">{k.kategori}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${
                    k.tipe === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {k.tipe === 'pemasukan' ? '+' : '-'} Rp {k.jumlah.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 italic">{k.keterangan || '-'}</td>
                  {role === 'admin' && (
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleDelete(k.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">
                {modalType === 'pemasukan' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tanggal</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
                <select 
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.kategori}
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {modalType === 'pemasukan' ? (
                    <>
                      <option>Iuran Bulanan</option>
                      <option>Iuran Keamanan</option>
                      <option>Sumbangan</option>
                      <option>Lain-lain</option>
                    </>
                  ) : (
                    <>
                      <option>Kebersihan</option>
                      <option>Keamanan</option>
                      <option>Perbaikan</option>
                      <option>Listrik/Air</option>
                      <option>Lain-lain</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Jumlah (Rp)</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                  value={formData.jumlah}
                  onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Keterangan</label>
                <textarea 
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                  value={formData.keterangan}
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className={`flex-1 py-3 text-white font-bold rounded-xl shadow-lg ${
                    modalType === 'pemasukan' ? 'bg-emerald-600 shadow-emerald-200' : 'bg-rose-600 shadow-rose-200'
                  }`}
                >
                  Simpan
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const TagihanList = ({ role, settings }: { role: string, settings: AppSettings }) => {
  const [tagihan, setTagihan] = useState<Tagihan[]>([]);
  const [warga, setWarga] = useState<Warga[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState<Tagihan | null>(null);
  const [schedules, setSchedules] = useState<BillingSchedule[]>([]);
  const [formData, setFormData] = useState({
    warga_id: '',
    nomor_tagihan: `INV/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`,
    tanggal: new Date().toISOString().split('T')[0],
    jatuh_tempo: '',
    items: [{ deskripsi: '', jumlah: '' }]
  });

  const [scheduleForm, setScheduleForm] = useState({
    nama: '',
    hari_tagihan: 1,
    jumlah: '',
    deskripsi: ''
  });

  const fetchTagihan = async () => {
    const res = await fetch('/api/tagihan');
    const data = await res.json();
    setTagihan(data);
  };

  const fetchWarga = async () => {
    const res = await fetch('/api/warga');
    const data = await res.json();
    setWarga(data);
  };

  const fetchSchedules = async () => {
    const res = await fetch('/api/billing-schedules');
    const data = await res.json();
    setSchedules(data);
  };

  useEffect(() => {
    fetchTagihan();
    fetchWarga();
    fetchSchedules();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tagihan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (res.ok) {
      setShowModal(false);
      setFormData({
        warga_id: '',
        nomor_tagihan: `INV/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`,
        tanggal: new Date().toISOString().split('T')[0],
        jatuh_tempo: '',
        items: [{ deskripsi: '', jumlah: '' }]
      });
      fetchTagihan();
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/billing-schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scheduleForm),
    });
    if (res.ok) {
      setScheduleForm({ nama: '', hari_tagihan: 1, jumlah: '', deskripsi: '' });
      fetchSchedules();
    }
  };

  const deleteSchedule = async (id: number) => {
    if (confirm('Hapus jadwal tagihan ini?')) {
      await fetch(`/api/billing-schedules/${id}`, { method: 'DELETE' });
      fetchSchedules();
    }
  };

  const generateMonthly = async () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    
    if (confirm(`Generate tagihan otomatis untuk bulan ${month}/${year}?`)) {
      const res = await fetch('/api/tagihan/generate-monthly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, year }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`${data.count} tagihan berhasil di-generate!`);
        fetchTagihan();
      }
    }
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/tagihan/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchTagihan();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus tagihan ini?')) {
      await fetch(`/api/tagihan/${id}`, { method: 'DELETE' });
      fetchTagihan();
    }
  };

  const openInvoice = async (id: number) => {
    const res = await fetch(`/api/tagihan/${id}`);
    const data = await res.json();
    setShowInvoice(data);
  };

  const sendWhatsApp = (t: Tagihan) => {
    const message = `Halo Bapak/Ibu ${t.nama_warga},\n\nBerikut adalah rincian tagihan Anda dari ${settings.app_name}:\n\nNomor: ${t.nomor_tagihan}\nTanggal: ${t.tanggal}\nTotal: Rp ${t.total.toLocaleString('id-ID')}\nStatus: ${t.status}\n\nMohon segera melakukan pembayaran. Terima kasih.`;
    const encoded = encodeURIComponent(message);
    // Remove non-numeric from phone
    const phone = t.nik_warga || ''; // Using NIK as placeholder if phone not available, but ideally we use phone
    // In real app we'd have a phone field. Let's assume we use the phone from warga if available.
    // Since we don't have the phone in the Tagihan join easily without more queries, 
    // let's just open the WA with the message.
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-bold text-slate-800">Manajemen Tagihan</h3>
        {role === 'admin' && (
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setShowScheduleModal(true)}
              className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-slate-200 transition-all active:scale-95 text-sm"
            >
              <SettingsIcon size={18} /> Atur Jadwal
            </button>
            <button 
              onClick={generateMonthly}
              className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-amber-200 transition-all active:scale-95 text-sm"
            >
              <Clock size={18} /> Auto Generate
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 text-sm"
            >
              <Plus size={18} /> Buat Tagihan
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">No. Tagihan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Warga</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tagihan.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-primary">{t.nomor_tagihan}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-800">{t.nama_warga}</div>
                    <div className="text-xs text-slate-400">{t.alamat_warga}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{t.tanggal}</td>
                  <td className="px-6 py-4 text-sm font-bold text-right text-slate-800">
                    Rp {t.total.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      t.status === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openInvoice(t.id)}
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                        title="Lihat Invoice"
                      >
                        <FileText size={18} />
                      </button>
                      <button 
                        onClick={() => sendWhatsApp(t)}
                        className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Kirim WhatsApp"
                      >
                        <MessageCircle size={18} />
                      </button>
                      {role === 'admin' && (
                        <>
                          {t.status === 'Belum Bayar' && (
                            <button 
                              onClick={() => updateStatus(t.id, 'Lunas')}
                              className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                              title="Tandai Lunas"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(t.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Tagihan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Buat Tagihan Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Warga</label>
                  <select 
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                    value={formData.warga_id}
                    onChange={(e) => setFormData({...formData, warga_id: e.target.value})}
                  >
                    <option value="">Pilih Warga</option>
                    {warga.map(w => (
                      <option key={w.id} value={w.id}>{w.nama} - {w.nik}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor Tagihan</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                    value={formData.nomor_tagihan}
                    onChange={(e) => setFormData({...formData, nomor_tagihan: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">Item Tagihan</label>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, items: [...formData.items, { deskripsi: '', jumlah: '' }]})}
                    className="text-primary text-xs font-bold hover:underline"
                  >
                    + Tambah Item
                  </button>
                </div>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        placeholder="Deskripsi (e.g. Iuran Kebersihan)"
                        required
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        value={item.deskripsi}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[index].deskripsi = e.target.value;
                          setFormData({...formData, items: newItems});
                        }}
                      />
                    </div>
                    <div className="w-32">
                      <input 
                        type="number" 
                        placeholder="Jumlah"
                        required
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        value={item.jumlah}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[index].jumlah = e.target.value;
                          setFormData({...formData, items: newItems});
                        }}
                      />
                    </div>
                    {formData.items.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => {
                          const newItems = formData.items.filter((_, i) => i !== index);
                          setFormData({...formData, items: newItems});
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-6">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20"
                >
                  Simpan Tagihan
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Billing Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Konfigurasi Tagihan Otomatis</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-8">
              <form onSubmit={handleScheduleSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Tambah Jadwal Baru</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nama Tagihan</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Iuran Kebersihan"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary text-sm"
                      value={scheduleForm.nama}
                      onChange={(e) => setScheduleForm({...scheduleForm, nama: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Hari Tagihan (1-31)</label>
                    <input 
                      type="number" 
                      min="1" max="31"
                      required
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary text-sm"
                      value={scheduleForm.hari_tagihan}
                      onChange={(e) => setScheduleForm({...scheduleForm, hari_tagihan: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Jumlah (Rp)</label>
                    <input 
                      type="number" 
                      required
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary text-sm"
                      value={scheduleForm.jumlah}
                      onChange={(e) => setScheduleForm({...scheduleForm, jumlah: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Deskripsi</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary text-sm"
                      value={scheduleForm.deskripsi}
                      onChange={(e) => setScheduleForm({...scheduleForm, deskripsi: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-primary text-white py-2 rounded-xl font-bold text-sm shadow-md">
                  Simpan Jadwal
                </button>
              </form>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Jadwal Aktif</h4>
                <div className="grid grid-cols-1 gap-3">
                  {schedules.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div>
                        <p className="font-bold text-slate-800">{s.nama}</p>
                        <p className="text-xs text-slate-500">Setiap tanggal {s.hari_tagihan} • Rp {s.jumlah.toLocaleString('id-ID')}</p>
                      </div>
                      <button onClick={() => deleteSchedule(s.id)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {schedules.length === 0 && <p className="text-center text-slate-400 text-sm py-8 italic">Belum ada jadwal tagihan otomatis.</p>}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen py-8 w-full flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-6 right-6 flex gap-3 no-print">
                <button 
                  onClick={() => window.print()}
                  className="p-3 bg-primary text-white rounded-2xl shadow-lg hover:bg-primary-dark transition-all"
                >
                  <Printer size={20} />
                </button>
                <button 
                  onClick={() => setShowInvoice(null)}
                  className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div id="printable-invoice" className="p-12">
                <div className="flex justify-between items-start mb-12">
                  <div>
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center">
                      {settings.app_logo ? (
                        <img src={settings.app_logo} alt="Logo" className="w-24 h-24 object-contain mb-2" />
                      ) : (
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-2">
                          <Users size={32} />
                        </div>
                      )}
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Logo Aplikasi</p>
                    </div>
                    
                    {settings.gang_logo && (
                      <div className="flex flex-col items-center">
                        <img src={settings.gang_logo} alt="Logo Gang" className="w-24 h-24 object-contain mb-2" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Logo Gang</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h2 className="text-3xl font-bold text-slate-800">{settings.app_name}</h2>
                    <p className="text-slate-500 font-medium">{settings.invoice_header}</p>
                  </div>
                  </div>
                  <div className="text-right">
                    <h1 className="text-4xl font-black text-slate-200 uppercase tracking-tighter mb-2">INVOICE</h1>
                    <p className="text-primary font-bold text-lg">{showInvoice.nomor_tagihan}</p>
                    <p className="text-slate-400 text-sm">Tanggal: {showInvoice.tanggal}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Ditujukan Kepada:</h4>
                    <p className="text-xl font-bold text-slate-800">{showInvoice.nama_warga}</p>
                    <p className="text-slate-500 leading-relaxed">{showInvoice.alamat_warga}</p>
                    <p className="text-slate-400 text-sm mt-2">NIK: {showInvoice.nik_warga}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Status Pembayaran:</h4>
                    <span className={`inline-block px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest ${
                      showInvoice.status === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {showInvoice.status}
                    </span>
                  </div>
                </div>

                <div className="mb-12">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-100">
                        <th className="py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Deskripsi Layanan / Iuran</th>
                        <th className="py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {showInvoice.items?.map((item, i) => (
                        <tr key={i}>
                          <td className="py-6 text-slate-700 font-medium">{item.deskripsi}</td>
                          <td className="py-6 text-right text-slate-800 font-bold">Rp {item.jumlah.toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-800">
                        <td className="py-6 text-xl font-black text-slate-800 uppercase tracking-widest">Total Tagihan</td>
                        <td className="py-6 text-right text-2xl font-black text-primary">Rp {showInvoice.total.toLocaleString('id-ID')}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-slate-600 italic text-center text-sm">"{settings.invoice_footer}"</p>
                </div>
                
                <div className="mt-12 pt-12 border-t border-slate-100 flex justify-between items-end">
                  <div className="text-xs text-slate-300">
                    Generated by {settings.app_name} System<br />
                    {new Date().toLocaleString()}
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-32 border border-slate-100 rounded-2xl mb-2 mx-auto flex items-center justify-center text-[10px] text-slate-200 uppercase font-bold">Cap / Tanda Tangan</div>
                    <p className="text-xs font-bold text-slate-400">Bendahara RT</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

const Settings = ({ settings, onUpdate }: { settings: AppSettings, onUpdate: () => void }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, app_logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        onUpdate();
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 79, g: 70, b: 229 };
  };

  const rgb = hexToRgb(formData.primary_color);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <SettingsIcon className="text-primary" /> Pengaturan Aplikasi
          </h3>
          <p className="text-sm text-slate-500 mt-1">Kustomisasi identitas aplikasi dan format invoice Anda.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Aplikasi</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={formData.app_name}
                  onChange={(e) => setFormData({...formData, app_name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Logo Aplikasi</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group relative">
                    {formData.app_logo ? (
                      <img src={formData.app_logo} alt="Logo Preview" className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="text-slate-300" size={32} />
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Plus className="text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                    </label>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Logo utama aplikasi.
                    </p>
                    {formData.app_logo && (
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, app_logo: ''})}
                        className="text-rose-500 text-xs font-bold mt-2 hover:underline"
                      >
                        Hapus Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Logo Gang (Khusus Invoice)</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group relative">
                    {formData.gang_logo ? (
                      <img src={formData.gang_logo} alt="Gang Logo Preview" className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="text-slate-300" size={32} />
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Plus className="text-white" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, gang_logo: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Logo tambahan yang akan muncul di samping logo aplikasi pada invoice.
                    </p>
                    {formData.gang_logo && (
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, gang_logo: ''})}
                        className="text-rose-500 text-xs font-bold mt-2 hover:underline"
                      >
                        Hapus Logo Gang
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-4">Warna Utama Aplikasi</label>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-2xl shadow-lg border-4 border-white"
                        style={{ backgroundColor: formData.primary_color }}
                      ></div>
                      <div className="flex-1">
                        <input 
                          type="color" 
                          className="w-full h-12 rounded-xl cursor-pointer border-none bg-transparent"
                          value={formData.primary_color}
                          onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase text-center block">R</label>
                        <input 
                          type="number" min="0" max="255"
                          className="w-full bg-white border border-slate-200 rounded-lg py-2 text-center font-bold text-sm"
                          value={rgb.r}
                          onChange={(e) => {
                            const val = Math.min(255, Math.max(0, parseInt(e.target.value) || 0));
                            setFormData({...formData, primary_color: rgbToHex(val, rgb.g, rgb.b)});
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase text-center block">G</label>
                        <input 
                          type="number" min="0" max="255"
                          className="w-full bg-white border border-slate-200 rounded-lg py-2 text-center font-bold text-sm"
                          value={rgb.g}
                          onChange={(e) => {
                            const val = Math.min(255, Math.max(0, parseInt(e.target.value) || 0));
                            setFormData({...formData, primary_color: rgbToHex(rgb.r, val, rgb.b)});
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase text-center block">B</label>
                        <input 
                          type="number" min="0" max="255"
                          className="w-full bg-white border border-slate-200 rounded-lg py-2 text-center font-bold text-sm"
                          value={rgb.b}
                          onChange={(e) => {
                            const val = Math.min(255, Math.max(0, parseInt(e.target.value) || 0));
                            setFormData({...formData, primary_color: rgbToHex(rgb.r, rgb.g, val)});
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Header Invoice (Informasi Penting)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={formData.invoice_header}
                  onChange={(e) => setFormData({...formData, invoice_header: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Footer Invoice</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary transition-all"
                  rows={4}
                  value={formData.invoice_footer}
                  onChange={(e) => setFormData({...formData, invoice_footer: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2 text-emerald-600 font-bold text-sm"
                >
                  <CheckCircle2 size={18} /> Pengaturan berhasil disimpan!
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              type="submit"
              disabled={loading}
              className="ml-auto bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
            >
              {loading ? <Clock className="animate-spin" size={20} /> : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Ronda = ({ role }: { role: string }) => {
  const [groups, setGroups] = useState<RondaGroup[]>([]);
  const [members, setMembers] = useState<RondaMember[]>([]);
  const [warga, setWarga] = useState<Warga[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedWarga, setSelectedWarga] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const fetchData = async () => {
    const [gRes, mRes, wRes] = await Promise.all([
      fetch('/api/ronda/groups'),
      fetch('/api/ronda/members'),
      fetch('/api/warga')
    ]);
    setGroups(await gRes.json());
    setMembers(await mRes.json());
    setWarga(await wRes.json());
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/ronda/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ warga_id: selectedWarga, group_id: selectedGroup }),
    });
    if (res.ok) {
      setShowModal(false);
      setSelectedWarga('');
      setSelectedGroup('');
      fetchData();
    }
  };

  const handleRemoveMember = async (wargaId: number) => {
    if (confirm('Hapus warga dari jadwal ronda?')) {
      await fetch(`/api/ronda/members/${wargaId}`, { method: 'DELETE' });
      fetchData();
    }
  };

  // Generate Schedule for 1 Year (Weekly Rotation)
  const generateSchedule = () => {
    const schedule = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Start of current week (Monday)
    
    for (let i = 0; i < 52; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (i * 7));
      const groupIndex = i % 4; // 4 week rotation
      schedule.push({
        week: i + 1,
        date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        group: groups[groupIndex]
      });
    }
    return schedule;
  };

  const schedule = groups.length > 0 ? generateSchedule() : [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Jadwal Ronda</h3>
        {role === 'admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Plus size={20} /> Atur Anggota
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {groups.map(g => (
          <div key={g.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-primary text-white font-bold text-center">
              {g.nama}
            </div>
            <div className="p-4 space-y-2">
              {members.filter(m => m.group_id === g.id).map(m => (
                <div key={m.warga_id} className="flex justify-between items-center p-2 bg-slate-50 rounded-xl text-sm font-medium text-slate-700">
                  {m.nama_warga}
                  {role === 'admin' && (
                    <button onClick={() => handleRemoveMember(m.warga_id)} className="text-rose-400 hover:text-rose-600">
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              {members.filter(m => m.group_id === g.id).length === 0 && (
                <p className="text-center text-xs text-slate-400 py-4 italic">Belum ada anggota.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <Calendar className="text-primary" />
          <h4 className="font-bold text-slate-800">Putaran Ronda 1 Tahun (Mingguan)</h4>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Minggu Ke-</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Mulai Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Petugas Ronda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {schedule.map((s, i) => (
                <tr key={i} className={i < 4 ? "bg-primary/5" : ""}>
                  <td className="px-6 py-4 text-sm font-bold text-slate-500">{s.week}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{s.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                      s.group?.nama === 'Group 1' ? 'bg-blue-100 text-blue-700' :
                      s.group?.nama === 'Group 2' ? 'bg-emerald-100 text-emerald-700' :
                      s.group?.nama === 'Group 3' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {s.group?.nama}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Atur Anggota Ronda</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Warga</label>
                <select 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                  value={selectedWarga}
                  onChange={(e) => setSelectedWarga(e.target.value)}
                >
                  <option value="">Pilih Warga</option>
                  {warga.map(w => (
                    <option key={w.id} value={w.id}>{w.nama}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Group</label>
                <select 
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  <option value="">Pilih Group</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.nama}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20"
                >
                  Simpan
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState<AppSettings>({
    app_name: 'Merpati Lima',
    app_logo: '',
    invoice_header: 'Informasi Penting',
    invoice_footer: 'Terima kasih atas partisipasi Anda.'
  });
  const [stats, setStats] = useState<Stats>({
    totalWarga: 0,
    totalPemasukan: 0,
    totalPengeluaran: 0,
    saldo: 0
  });

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    const data = await res.json();
    setSettings(data);
  };

  const fetchStats = async () => {
    const res = await fetch('/api/stats');
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  useEffect(() => {
    if (settings.primary_color) {
      document.documentElement.style.setProperty('--primary-color', settings.primary_color);
      // Generate a darker version for hover states (simplified)
      const hex = settings.primary_color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const darkR = Math.max(0, r - 20);
      const darkG = Math.max(0, g - 20);
      const darkB = Math.max(0, b - 20);
      const darkHex = "#" + ((1 << 24) + (darkR << 16) + (darkG << 8) + darkB).toString(16).slice(1);
      document.documentElement.style.setProperty('--primary-color-dark', darkHex);
    }
  }, [settings.primary_color]);

  if (!user) {
    return <Login onLogin={setUser} settings={settings} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'warga', label: 'Data Warga', icon: Users },
    { id: 'keuangan', label: 'Keuangan', icon: CreditCard },
    { id: 'tagihan', label: 'Tagihan', icon: FileText },
    { id: 'ronda', label: 'Ronda', icon: Shield },
    { id: 'settings', label: 'Pengaturan', icon: SettingsIcon, adminOnly: true },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || user.role === 'admin');

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          {settings.app_logo ? (
            <img src={settings.app_logo} alt="Logo" className="w-10 h-10 object-contain rounded-xl shadow-md" />
          ) : (
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Users size={20} />
            </div>
          )}
          <h1 className="text-xl font-bold text-slate-800 truncate">{settings.app_name}</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
              {activeTab === item.id && <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{user.username}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={() => setUser(null)}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 transition-all"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 sticky top-0 z-30">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {menuItems.find(m => m.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-slate-400">Selamat datang kembali, {user.username}!</p>
            </div>
            
            {/* Mobile Menu Toggle (simplified) */}
            <div className="lg:hidden flex gap-4">
              {filteredMenuItems.map(m => (
                <button key={m.id} onClick={() => setActiveTab(m.id)} className={`p-2 rounded-xl ${activeTab === m.id ? 'bg-primary/10 text-primary' : 'text-slate-400'}`}>
                  <m.icon size={20} />
                </button>
              ))}
              <button onClick={() => setUser(null)} className="p-2 text-rose-500"><LogOut size={20} /></button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard stats={stats} />}
              {activeTab === 'warga' && <WargaList role={user.role} onUpdate={fetchStats} />}
              {activeTab === 'keuangan' && <KeuanganList role={user.role} onUpdate={fetchStats} />}
              {activeTab === 'tagihan' && <TagihanList role={user.role} settings={settings} />}
              {activeTab === 'ronda' && <Ronda role={user.role} />}
              {activeTab === 'settings' && <Settings settings={settings} onUpdate={fetchSettings} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
