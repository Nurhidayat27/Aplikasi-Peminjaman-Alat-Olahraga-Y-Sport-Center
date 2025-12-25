import { openDatabaseSync, SQLiteDatabase } from "expo-sqlite";

export const db: SQLiteDatabase = openDatabaseSync("peminjaman.db");

export const initDB = () => {
  // ======================
  // TABLE ALAT
  // ======================
  db.execSync(`
    CREATE TABLE IF NOT EXISTS alat (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      stok INTEGER NOT NULL
    );
  `);

  // tambah kolom harga jika belum ada
  try {
    db.execSync(
      "ALTER TABLE alat ADD COLUMN harga INTEGER DEFAULT 0"
    );
  } catch (e) {
    // kolom sudah ada → aman
  }

  // ======================
  // TABLE PEMINJAMAN
  // ======================
  db.execSync(`
    CREATE TABLE IF NOT EXISTS peminjaman (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      alat_id INTEGER NOT NULL,
      jumlah INTEGER NOT NULL,
      tanggal_pinjam TEXT,
      tanggal_kembali TEXT,
      status TEXT,
      denda INTEGER DEFAULT 0
    );
  `);

  // 🔥 INI YANG KURANG SEBELUMNYA
  try {
    db.execSync(
      "ALTER TABLE peminjaman ADD COLUMN total_harga INTEGER DEFAULT 0"
    );
  } catch (e) {
    // kolom sudah ada → aman
  }

  // 🔧 MIGRASI DATABASE (UNTUK DB LAMA)
  try {
    db.execSync(`ALTER TABLE peminjaman ADD COLUMN tanggal_pinjam TEXT`);
  } catch {}

  try {
    db.execSync(`ALTER TABLE peminjaman ADD COLUMN tanggal_kembali TEXT`);
  } catch {}

  try {
    db.execSync(`ALTER TABLE peminjaman ADD COLUMN status TEXT`);
  } catch {}

  try {
    db.execSync(`ALTER TABLE peminjaman ADD COLUMN denda INTEGER DEFAULT 0`);
  } catch {}

  // ✅ TABEL USERS (FIX)
    db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
    );
    `);
    db.execSync(`
    INSERT OR IGNORE INTO users (id, username, password, role)
    VALUES (1, 'admin', 'admin123', 'admin');
    `); 

    const admin = db.getFirstSync(
        "SELECT * FROM users WHERE username = ?",
        ["admin"]
    );

    if (!admin) {
        db.execSync(`
        INSERT INTO users (username, password, role)
        VALUES ('admin', 'admin123', 'admin');
        `);
    }
};