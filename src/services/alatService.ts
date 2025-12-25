import { db } from "../database/db";

/* =======================
   GET
======================= */
export const getAllAlat = () => {
  return db.getAllSync(`
    SELECT id, nama, stok, harga
    FROM alat
    ORDER BY nama ASC
  `);
};

/* =======================
   ADD
======================= */
export const addAlat = (
  nama: string,
  stok: number,
  harga: number
) => {
  db.execSync(`
    INSERT INTO alat (nama, stok, harga)
    VALUES ('${nama}', ${stok}, ${harga});
  `);
};

/* =======================
   UPDATE
======================= */
export const updateAlat = (
  id: number,
  nama: string,
  stok: number,
  harga: number
) => {
  db.execSync(`
    UPDATE alat
    SET 
      nama='${nama}',
      stok=${stok},
      harga=${harga}
    WHERE id=${id};
  `);
};

/* =======================
   DELETE
======================= */
export const deleteAlat = (id: number) => {
  db.execSync(`
    DELETE FROM alat
    WHERE id=${id};
  `);
};
