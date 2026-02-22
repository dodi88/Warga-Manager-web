import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("warga_manager.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS warga (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    nik TEXT UNIQUE NOT NULL,
    alamat TEXT,
    telepon TEXT,
    status TEXT,
    tanggal_input DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS keuangan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tanggal DATE NOT NULL,
    tipe TEXT NOT NULL,
    kategori TEXT NOT NULL,
    jumlah REAL NOT NULL,
    keterangan TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS tagihan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    warga_id INTEGER NOT NULL,
    nomor_tagihan TEXT UNIQUE NOT NULL,
    tanggal DATE NOT NULL,
    jatuh_tempo DATE,
    status TEXT DEFAULT 'Belum Bayar', -- 'Belum Bayar', 'Lunas'
    total REAL DEFAULT 0,
    FOREIGN KEY (warga_id) REFERENCES warga(id)
  );

  CREATE TABLE IF NOT EXISTS tagihan_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tagihan_id INTEGER NOT NULL,
    deskripsi TEXT NOT NULL,
    jumlah REAL NOT NULL,
    FOREIGN KEY (tagihan_id) REFERENCES tagihan(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS billing_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    hari_tagihan INTEGER NOT NULL, -- 1-31
    jumlah REAL NOT NULL,
    deskripsi TEXT
  );

  CREATE TABLE IF NOT EXISTS ronda_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL -- Group 1, Group 2, etc.
  );

  CREATE TABLE IF NOT EXISTS ronda_members (
    warga_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    PRIMARY KEY (warga_id, group_id),
    FOREIGN KEY (warga_id) REFERENCES warga(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES ronda_groups(id) ON DELETE CASCADE
  );
`);

// Insert default ronda groups if not exists
const insertRondaGroup = db.prepare("INSERT OR IGNORE INTO ronda_groups (id, nama) VALUES (?, ?)");
insertRondaGroup.run(1, "Group 1");
insertRondaGroup.run(2, "Group 2");
insertRondaGroup.run(3, "Group 3");
insertRondaGroup.run(4, "Group 4");

// Insert default settings if not exists
const insertSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
insertSetting.run("app_name", "Merpati Lima");
insertSetting.run("app_logo", "");
insertSetting.run("gang_logo", "");
insertSetting.run("primary_color", "#4f46e5");
insertSetting.run("invoice_header", "Informasi Penting");
insertSetting.run("invoice_footer", "Terima kasih atas partisipasi Anda.");
insertSetting.run("marquee_text", "Selamat Datang di Sistem Informasi Warga Merpati Lima. Jaga Kebersihan dan Keamanan Lingkungan Kita.");
insertSetting.run("marquee_enabled", "true");
insertSetting.run("dark_mode_default", "false");
insertSetting.run("show_stats_to_user", "true");

// Insert default users if not exists
const insertUser = db.prepare("INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)");
insertUser.run("admin", "admin123", "admin");
insertUser.run("user", "user123", "user");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password) as any;
    if (user) {
      res.json({ success: true, user: { username: user.username, role: user.role } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Warga API
  app.get("/api/warga", (req, res) => {
    const warga = db.prepare("SELECT * FROM warga ORDER BY tanggal_input DESC").all();
    res.json(warga);
  });

  app.post("/api/warga", (req, res) => {
    const { nama, nik, alamat, telepon, status } = req.body;
    try {
      const result = db.prepare("INSERT INTO warga (nama, nik, alamat, telepon, status) VALUES (?, ?, ?, ?, ?)").run(nama, nik, alamat, telepon, status);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.put("/api/warga/:id", (req, res) => {
    const { id } = req.params;
    const { nama, nik, alamat, telepon, status } = req.body;
    try {
      db.prepare("UPDATE warga SET nama = ?, nik = ?, alamat = ?, telepon = ?, status = ? WHERE id = ?").run(nama, nik, alamat, telepon, status, id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.delete("/api/warga/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM warga WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Keuangan API
  app.get("/api/keuangan", (req, res) => {
    const keuangan = db.prepare("SELECT * FROM keuangan ORDER BY tanggal DESC").all();
    res.json(keuangan);
  });

  app.post("/api/keuangan", (req, res) => {
    const { tanggal, tipe, kategori, jumlah, keterangan } = req.body;
    try {
      const result = db.prepare("INSERT INTO keuangan (tanggal, tipe, kategori, jumlah, keterangan) VALUES (?, ?, ?, ?, ?)").run(tanggal, tipe, kategori, jumlah, keterangan);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.delete("/api/keuangan/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM keuangan WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.get("/api/stats", (req, res) => {
    const totalWarga = db.prepare("SELECT COUNT(*) as count FROM warga").get() as any;
    const stats = db.prepare(`
      SELECT 
        SUM(CASE WHEN tipe = 'pemasukan' THEN jumlah ELSE 0 END) as totalPemasukan,
        SUM(CASE WHEN tipe = 'pengeluaran' THEN jumlah ELSE 0 END) as totalPengeluaran
      FROM keuangan
    `).get() as any;

    res.json({
      totalWarga: totalWarga.count,
      totalPemasukan: stats.totalPemasukan || 0,
      totalPengeluaran: stats.totalPengeluaran || 0,
      saldo: (stats.totalPemasukan || 0) - (stats.totalPengeluaran || 0)
    });
  });

  // Settings API
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all() as any[];
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.post("/api/settings", (req, res) => {
    const { 
      app_name, app_logo, gang_logo, primary_color, 
      invoice_header, invoice_footer, 
      marquee_text, marquee_enabled, dark_mode_default, show_stats_to_user 
    } = req.body;
    try {
      if (app_name !== undefined) db.prepare("UPDATE settings SET value = ? WHERE key = 'app_name'").run(app_name);
      if (app_logo !== undefined) db.prepare("UPDATE settings SET value = ? WHERE key = 'app_logo'").run(app_logo);
      if (gang_logo !== undefined) db.prepare("UPDATE settings SET value = ? WHERE key = 'gang_logo'").run(gang_logo);
      if (primary_color !== undefined) db.prepare("UPDATE settings SET value = ? WHERE key = 'primary_color'").run(primary_color);
      if (invoice_header !== undefined) db.prepare("UPDATE settings SET value = ? WHERE key = 'invoice_header'").run(invoice_header);
      if (invoice_footer !== undefined) db.prepare("UPDATE settings SET value = ? WHERE key = 'invoice_footer'").run(invoice_footer);
      if (marquee_text !== undefined) db.prepare("UPDATE settings SET value = ? WHERE key = 'marquee_text'").run(marquee_text);
      if (marquee_enabled !== undefined) db.prepare("UPDATE settings SET value = ? WHERE key = 'marquee_enabled'").run(String(marquee_enabled));
      if (dark_mode_default !== undefined) db.prepare("UPDATE settings SET value = ? WHERE key = 'dark_mode_default'").run(String(dark_mode_default));
      if (show_stats_to_user !== undefined) db.prepare("UPDATE settings SET value = ? WHERE key = 'show_stats_to_user'").run(String(show_stats_to_user));
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  // Tagihan API
  app.get("/api/tagihan", (req, res) => {
    const tagihan = db.prepare(`
      SELECT t.*, w.nama as nama_warga, w.alamat as alamat_warga
      FROM tagihan t
      JOIN warga w ON t.warga_id = w.id
      ORDER BY t.tanggal DESC
    `).all();
    res.json(tagihan);
  });

  app.get("/api/tagihan/:id", (req, res) => {
    const { id } = req.params;
    const t = db.prepare(`
      SELECT t.*, w.nama as nama_warga, w.alamat as alamat_warga, w.nik as nik_warga
      FROM tagihan t
      JOIN warga w ON t.warga_id = w.id
      WHERE t.id = ?
    `).get(id) as any;
    
    if (t) {
      const items = db.prepare("SELECT * FROM tagihan_items WHERE tagihan_id = ?").all(id);
      res.json({ ...t, items });
    } else {
      res.status(404).json({ message: "Tagihan not found" });
    }
  });

  app.post("/api/tagihan", (req, res) => {
    const { warga_id, nomor_tagihan, tanggal, jatuh_tempo, items } = req.body;
    const total = items.reduce((sum: number, item: any) => sum + parseFloat(item.jumlah), 0);
    
    const transaction = db.transaction(() => {
      const result = db.prepare("INSERT INTO tagihan (warga_id, nomor_tagihan, tanggal, jatuh_tempo, total) VALUES (?, ?, ?, ?, ?)").run(warga_id, nomor_tagihan, tanggal, jatuh_tempo, total);
      const tagihanId = result.lastInsertRowid;
      
      const insertItem = db.prepare("INSERT INTO tagihan_items (tagihan_id, deskripsi, jumlah) VALUES (?, ?, ?)");
      for (const item of items) {
        insertItem.run(tagihanId, item.deskripsi, item.jumlah);
      }
      return tagihanId;
    });

    try {
      const id = transaction();
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.put("/api/tagihan/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      db.prepare("UPDATE tagihan SET status = ? WHERE id = ?").run(status, id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.delete("/api/tagihan/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM tagihan WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Billing Schedules API
  app.get("/api/billing-schedules", (req, res) => {
    const schedules = db.prepare("SELECT * FROM billing_schedules").all();
    res.json(schedules);
  });

  app.post("/api/billing-schedules", (req, res) => {
    const { nama, hari_tagihan, jumlah, deskripsi } = req.body;
    const result = db.prepare("INSERT INTO billing_schedules (nama, hari_tagihan, jumlah, deskripsi) VALUES (?, ?, ?, ?)").run(nama, hari_tagihan, jumlah, deskripsi);
    res.json({ success: true, id: result.lastInsertRowid });
  });

  app.delete("/api/billing-schedules/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM billing_schedules WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.post("/api/tagihan/generate-monthly", (req, res) => {
    const { month, year } = req.body; // e.g., 2, 2026
    const schedules = db.prepare("SELECT * FROM billing_schedules").all() as any[];
    const warga = db.prepare("SELECT id FROM warga").all() as any[];
    
    const transaction = db.transaction(() => {
      let count = 0;
      for (const s of schedules) {
        for (const w of warga) {
          const tanggal = `${year}-${String(month).padStart(2, '0')}-${String(s.hari_tagihan).padStart(2, '0')}`;
          const nomor_tagihan = `AUTO/${year}${String(month).padStart(2, '0')}/${s.id}/${w.id}`;
          
          // Check if already exists
          const exists = db.prepare("SELECT id FROM tagihan WHERE nomor_tagihan = ?").get(nomor_tagihan);
          if (!exists) {
            const result = db.prepare("INSERT INTO tagihan (warga_id, nomor_tagihan, tanggal, total) VALUES (?, ?, ?, ?)").run(w.id, nomor_tagihan, tanggal, s.jumlah);
            db.prepare("INSERT INTO tagihan_items (tagihan_id, deskripsi, jumlah) VALUES (?, ?, ?)").run(result.lastInsertRowid, s.nama, s.jumlah);
            count++;
          }
        }
      }
      return count;
    });

    try {
      const count = transaction();
      res.json({ success: true, count });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  // Ronda API
  app.get("/api/ronda/groups", (req, res) => {
    const groups = db.prepare("SELECT * FROM ronda_groups").all();
    res.json(groups);
  });

  app.get("/api/ronda/members", (req, res) => {
    const members = db.prepare(`
      SELECT m.*, w.nama as nama_warga, g.nama as nama_group
      FROM ronda_members m
      JOIN warga w ON m.warga_id = w.id
      JOIN ronda_groups g ON m.group_id = g.id
    `).all();
    res.json(members);
  });

  app.post("/api/ronda/members", (req, res) => {
    const { warga_id, group_id } = req.body;
    try {
      // Remove from other groups first (one warga one group)
      db.prepare("DELETE FROM ronda_members WHERE warga_id = ?").run(warga_id);
      db.prepare("INSERT INTO ronda_members (warga_id, group_id) VALUES (?, ?)").run(warga_id, group_id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.delete("/api/ronda/members/:warga_id", (req, res) => {
    const { warga_id } = req.params;
    db.prepare("DELETE FROM ronda_members WHERE warga_id = ?").run(warga_id);
    res.json({ success: true });
  });

  // Backup & Restore API
  app.get("/api/database/backup", (req, res) => {
    const dbPath = path.join(__dirname, "warga_manager.db");
    res.download(dbPath, `backup_merpati5_${new Date().toISOString().split('T')[0]}.db`);
  });

  // Note: Restore is complex because we need to close the DB connection.
  // We'll use a simple approach: accept the file, but the user might need to restart.
  // In a real cPanel env, replacing the file might trigger a restart anyway.
  app.post("/api/database/restore", express.raw({ type: 'application/octet-stream', limit: '50mb' }), (req, res) => {
    try {
      db.close();
      fs.writeFileSync(path.join(__dirname, "warga_manager.db"), req.body);
      res.json({ success: true });
      // Force restart, the process manager (PM2/cPanel) will bring it back
      setTimeout(() => process.exit(0), 1000);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
