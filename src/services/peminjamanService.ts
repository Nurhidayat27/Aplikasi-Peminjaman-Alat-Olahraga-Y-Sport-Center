import { db } from "../database/db";

type Alat = {
  id: number;
  nama: string;
  stok: number;
  harga: number;
};

export function pinjamAlat(
  alatId: number,
  jumlah: number,
  totalHarga: number
) {
  const alat = db.getFirstSync(
    "SELECT * FROM alat WHERE id = ?",
    [alatId]
  ) as Alat | null;

  if (!alat) {
    return { success: false, message: "Alat tidak ditemukan" };
  }

  if (jumlah <= 0) {
    return { success: false, message: "Jumlah tidak valid" };
  }

  if (alat.stok < jumlah) {
    return { success: false, message: "Stok tidak mencukupi" };
  }

  // Kurangi stok alat
  db.execSync(`
    UPDATE alat 
    SET stok = stok - ${jumlah}
    WHERE id = ${alatId}
  `);

  // Simpan peminjaman + total harga
  db.execSync(`
    INSERT INTO peminjaman 
    (alat_id, jumlah, total_harga, tanggal_pinjam, status)
    VALUES (
      ${alatId},
      ${jumlah},
      ${totalHarga},
      '${new Date().toISOString()}',
      'dipinjam'
    )
  `);

  return { success: true, message: "Peminjaman berhasil" };
}

export const kembalikanAlat = (
  peminjamanId: number
): { success: boolean; message: string } => {
  const data = db.getFirstSync<any>(
    `SELECT alat_id, jumlah, status, tanggal_pinjam 
     FROM peminjaman WHERE id = ?`,
    [peminjamanId]
  );

  if (!data) {
    return { success: false, message: "Data tidak ditemukan" };
  }

  if (data.status === "dikembalikan") {
    return { success: false, message: "Sudah dikembalikan" };
  }

  const denda = hitungDenda(data.tanggal_pinjam);

  // Tambah stok
  db.runSync(
    "UPDATE alat SET stok = stok + ? WHERE id = ?",
    [data.jumlah, data.alat_id]
  );

  // Update peminjaman
  db.runSync(
    `UPDATE peminjaman 
     SET status = ?, tanggal_kembali = ?, denda = ?
     WHERE id = ?`,
    ["dikembalikan", new Date().toISOString(), denda, peminjamanId]
  );

  return {
    success: true,
    message:
      denda > 0
        ? `Dikembalikan dengan denda Rp ${denda}`
        : "Dikembalikan tanpa denda",
  };
};

export const getPeminjamanAktif = (): any[] => {
  try {
    return db.getAllSync(`
      SELECT 
        p.id,
        a.nama AS nama_alat,
        p.jumlah,
        p.tanggal_pinjam,
        p.status
      FROM peminjaman p
      INNER JOIN alat a ON a.id = p.alat_id
      WHERE p.status = 'dipinjam'
      ORDER BY p.tanggal_pinjam DESC
    `);
  } catch (error) {
    console.log("DB ERROR:", error);
    return [];
  }
};

export const getRiwayatPeminjaman = (): any[] => {
  try {
    return db.getAllSync(`
      SELECT
        p.id,
        a.nama AS nama_alat,
        p.jumlah,
        p.tanggal_pinjam,
        p.status
      FROM peminjaman p
      INNER JOIN alat a ON a.id = p.alat_id
      ORDER BY p.tanggal_pinjam DESC
    `);
  } catch (error) {
    console.log("ERROR RIWAYAT:", error);
    return [];
  }
};

const MAKS_HARI = 3;
const DENDA_PER_HARI = 5000;

const hitungDenda = (tanggalPinjam: string): number => {
  const pinjam = new Date(tanggalPinjam);
  const sekarang = new Date();

  const selisihHari = Math.floor(
    (sekarang.getTime() - pinjam.getTime()) / (1000 * 60 * 60 * 24)
  );

  const telat = selisihHari - MAKS_HARI;
  return telat > 0 ? telat * DENDA_PER_HARI : 0;
};
