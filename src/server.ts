import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";

// run it by npx nodemon src/server.ts

const prisma = new PrismaClient();
const app = express();
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", async (req, res) => {
  res.send(`Server is running`);
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.m_user.findUnique({ where: { username } });
    if (!user) {
      res.status(404).json({ pesan: "User not found" });
      return;
    }

    const passwordMatch = password == user?.password;
    if (!passwordMatch) {
      res.status(401).json({ pesan: "Invalid password" });
      return;
    }

    res.json({ pesan: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});

// pesanan
app.get("/pesanan/daftar", async (req: Request, res: Response) => {
  try {
    const daftarData = await prisma.t_pesanan.findMany({
      orderBy: [{ id: "desc" }],
      include: { pelanggan: true, jenis_pakaian: true, tahap_objek: true },
    });

    res.json({
      pesan: "Success",
      hasil: daftarData.map((row) => {
        return {
          ...row,
          id: Number(row.id.toString()),
          pelanggan_id: Number(row.pelanggan_id.toString()),
          jenis_pakaian_id: Number(row.jenis_pakaian_id.toString()),
          penerima_tugas: Number(row.penerima_tugas?.toString()),
          pelanggan: {
            ...row.pelanggan,
            id: Number(row.pelanggan?.id.toString()),
          },
          jenis_pakaian: {
            ...row.jenis_pakaian,
            id: Number(row.jenis_pakaian?.id.toString()),
          },
          tahap_objek: {
            ...row.tahap_objek,
            id: Number(row.tahap_objek?.id.toString()),
          },
        };
      }),
    });
  } catch (error) {
    console.error("error get list pesanan", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.get("/pesanan/ambil", async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const data = await prisma.t_pesanan.findUnique({
      where: { id: Number(id) },
      include: {
        pelanggan: true,
        jenis_pakaian: true,
        tahap_objek: true,
        pegawai: true,
        dokumen: true,
        pengukuran: true,
        bahan: true,
      },
    });

    res.json({
      pesan: "Success",
      hasil: {
        ...data,
        id: Number(data?.id.toString()),
        pelanggan_id: Number(data?.pelanggan_id.toString()),
        jenis_pakaian_id: Number(data?.jenis_pakaian_id.toString()),
        penerima_tugas: Number(data?.penerima_tugas?.toString()),
        pelanggan: {
          ...data?.pelanggan,
          id: Number(data?.pelanggan?.id.toString()),
        },
        jenis_pakaian: {
          ...data?.jenis_pakaian,
          id: Number(data?.jenis_pakaian?.id.toString()),
        },
        tahap_objek: {
          ...data?.tahap_objek,
          id: Number(data?.tahap_objek?.id.toString()),
        },
        pegawai: {
          ...data?.pegawai,
          id: Number(data?.pegawai?.id.toString()),
        },
        dokumen: data?.dokumen.map((row) => {
          return {
            ...row,
            id: Number(row.id.toString()),
            pesanan_id: Number(row.pesanan_id.toString()),
          };
        }),
        bahan: data?.bahan.map((row) => {
          return {
            ...row,
            id: Number(row.id.toString()),
            pesanan_id: Number(row.pesanan_id.toString()),
            bahan_id: Number(row.bahan_id.toString()),
          };
        }),
        pengukuran: data?.pengukuran.map((row) => {
          return {
            ...row,
            id: Number(row.id.toString()),
            pesanan_id: Number(row.pesanan_id.toString()),
            pengukuran_id: Number(row.pengukuran_id.toString()),
          };
        }),
      },
    });
  } catch (error) {
    console.error("error get detail pesanan", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.post("/pesanan/tambah", async (req: Request, res: Response) => {
  const {
    pelanggan_id,
    jenis_pakaian_id,
    target_tanggal,
    catatan,
    dokumen,
    pengukuran,
  } = req.body;

  try {
    const pesanan = await prisma.t_pesanan.create({
      data: {
        pelanggan_id,
        jenis_pakaian_id,
        tahap: "PESAN",
        target_tanggal,
        catatan,
        dokumen: { createMany: { data: dokumen } },
        pengukuran: { createMany: { data: pengukuran } },
      },
    });

    res.json({
      pesan: "Success",
    });
  } catch (error) {
    console.error("error tambah pesanan", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.put("/pesanan/ubah", async (req: Request, res: Response) => {
  const {
    id,
    pelanggan_id,
    jenis_pakaian_id,
    target_tanggal,
    catatan,
    tahap,
    penerima_tugas,
    dokumen,
    pengukuran,
    oleh,
  } = req.body;

  try {
    const pesanan = await prisma.t_pesanan.update({
      data: {
        // pelanggan_id: pelanggan_id,
        // jenis_pakaian_id: jenis_pakaian_id,
        tahap,
        penerima_tugas,
        // target_tanggal: target_tanggal,
        // catatan: catatan,
        // dokumen: { createMany: { data: dokumen } },
        // pengukuran: { createMany: { data: pengukuran } },
      },
      where: { id },
    });
    const aktivitas = await prisma.t_riwayat_aktivitas.create({
      data: {
        tabel: "t_pesanan",
        data_id: id,
        aktivitas: "Mengubah tahap pesanan " + id + " ke " + tahap,
        tanggal: new Date().toISOString(),
        oleh,
      },
    });

    res.json({ pesan: "Success" });
  } catch (error) {
    console.error("error ubah pesanan", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.delete("/pesanan/hapus", async (req: Request, res: Response) => {
  const { id, oleh } = req.query;

  try {
    const pesanan = await prisma.t_pesanan.delete({
      where: { id: Number(id) },
    });
    const aktivitas = await prisma.t_riwayat_aktivitas.create({
      data: {
        tabel: "t_pesanan",
        data_id: Number(id),
        aktivitas: "Menghapus pesanan " + id,
        tanggal: new Date().toISOString(),
        oleh: oleh ? oleh.toString() : "System",
      },
    });

    res.json({ pesan: "Success" });
  } catch (error) {
    console.error("error hapus pesanan", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});

// pelanggan
app.get("/pelanggan/daftar", async (req: Request, res: Response) => {
  try {
    const daftarData = await prisma.m_pelanggan.findMany({
      orderBy: [{ id: "desc" }],
    });

    res.json({
      pesan: "Success",
      hasil: daftarData.map((row) => {
        return { ...row, id: Number(row.id.toString()) };
      }),
    });
  } catch (error) {
    console.error("error get list pelanggan", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.get("/pelanggan/ambil", async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const data = await prisma.m_pelanggan.findUnique({
      where: { id: Number(id) },
    });

    res.json({
      pesan: "Success",
      hasil: { ...data, id: Number(data?.id.toString()) },
    });
  } catch (error) {
    console.error("error get detail pelanggan", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.post("/pelanggan/tambah", async (req: Request, res: Response) => {
  const { nama, no_hp, jenis_kelamin, tanggal_lahir, alamat } = req.body;

  try {
    const pelanggan = await prisma.m_pelanggan.create({
      data: { nama, no_hp, jenis_kelamin, tanggal_lahir, alamat },
    });

    res.json({
      pesan: "Success",
    });
  } catch (error) {
    console.error("error tambah pelanggan", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.put("/pelanggan/ubah", async (req: Request, res: Response) => {
  const { id, nama, no_hp, jenis_kelamin, tanggal_lahir, alamat } = req.body;

  try {
    const pelanggan = await prisma.m_pelanggan.update({
      data: { nama, no_hp, jenis_kelamin, tanggal_lahir, alamat },
      where: { id },
    });

    res.json({ pesan: "Success" });
  } catch (error) {
    console.error("error ubah pelanggan", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.delete("/pelanggan/hapus", async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const pelanggan = await prisma.m_pelanggan.delete({
      where: { id: Number(id) },
    });

    res.json({ pesan: "Success" });
  } catch (error) {
    console.error("error hapus pelanggan", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});

// model
app.get("/model/daftar", async (req: Request, res: Response) => {
  try {
    const daftarData = await prisma.m_jenis_pakaian.findMany({
      orderBy: [{ id: "desc" }],
    });

    res.json({
      pesan: "Success",
      hasil: daftarData.map((row) => {
        return { ...row, id: Number(row.id.toString()) };
      }),
    });
  } catch (error) {
    console.error("error get list model", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.get("/model/ambil", async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const data = await prisma.m_jenis_pakaian.findUnique({
      where: { id: Number(id) },
    });

    res.json({
      pesan: "Success",
      hasil: { ...data, id: Number(data?.id.toString()) },
    });
  } catch (error) {
    console.error("error get detail model", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.post("/model/tambah", async (req: Request, res: Response) => {
  const { nama, jenis_kelamin, deskripsi, gambar_base64 } = req.body;

  try {
    const data = await prisma.m_jenis_pakaian.create({
      data: { nama, jenis_kelamin, deskripsi, gambar_base64 },
    });

    res.json({
      pesan: "Success",
    });
  } catch (error) {
    console.error("error tambah model", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.put("/model/ubah", async (req: Request, res: Response) => {
  const { id, nama, jenis_kelamin, deskripsi, gambar_base64 } = req.body;

  try {
    const data = await prisma.m_jenis_pakaian.update({
      data: { nama, jenis_kelamin, deskripsi, gambar_base64 },
      where: { id },
    });

    res.json({ pesan: "Success" });
  } catch (error) {
    console.error("error ubah model", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.delete("/model/hapus", async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const data = await prisma.m_jenis_pakaian.delete({
      where: { id: Number(id) },
    });

    res.json({ pesan: "Success" });
  } catch (error) {
    console.error("error hapus model", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});

// pegawai
app.get("/pegawai/daftar", async (req: Request, res: Response) => {
  try {
    const daftarData = await prisma.m_pegawai.findMany({
      orderBy: [{ id: "desc" }],
    });

    res.json({
      pesan: "Success",
      hasil: daftarData.map((row) => {
        return { ...row, id: Number(row.id.toString()) };
      }),
    });
  } catch (error) {
    console.error("error get list pegawai", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.get("/pegawai/ambil", async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const data = await prisma.m_pegawai.findUnique({
      where: { id: Number(id) },
    });

    res.json({
      pesan: "Success",
      hasil: { ...data, id: Number(data?.id.toString()) },
    });
  } catch (error) {
    console.error("error get detail pegawai", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.post("/pegawai/tambah", async (req: Request, res: Response) => {
  const { nama, nip, no_hp } = req.body;

  try {
    const data = await prisma.m_pegawai.create({
      data: { nama, nip, no_hp },
    });

    res.json({
      pesan: "Success",
    });
  } catch (error) {
    console.error("error tambah pegawai", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.put("/pegawai/ubah", async (req: Request, res: Response) => {
  const { id, nama, nip, no_hp } = req.body;

  try {
    const data = await prisma.m_pegawai.update({
      data: { nama, nip, no_hp },
      where: { id },
    });

    res.json({ pesan: "Success" });
  } catch (error) {
    console.error("error ubah pegawai", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.delete("/pegawai/hapus", async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const data = await prisma.m_pegawai.delete({
      where: { id: Number(id) },
    });

    res.json({ pesan: "Success" });
  } catch (error) {
    console.error("error hapus pegawai", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});

// pengguna
app.get("/pengguna/daftar", async (req: Request, res: Response) => {
  try {
    const daftarData = await prisma.m_user.findMany({
      orderBy: [{ id: "desc" }],
    });

    res.json({
      pesan: "Success",
      hasil: daftarData.map((row) => {
        return {
          ...row,
          id: Number(row.id.toString()),
          pegawai_id: Number(row.pegawai_id?.toString()),
          password: null,
        };
      }),
    });
  } catch (error) {
    console.error("error get list pengguna", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.get("/pengguna/ambil", async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const data = await prisma.m_user.findUnique({
      where: { id: Number(id) },
    });

    res.json({
      pesan: "Success",
      hasil: {
        ...data,
        id: Number(data?.id.toString()),
        pegawai_id: Number(data?.pegawai_id?.toString()),
      },
    });
  } catch (error) {
    console.error("error get detail pengguna", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.post("/pengguna/tambah", async (req: Request, res: Response) => {
  const { username, pegawai_id, password } = req.body;

  try {
    const data = await prisma.m_user.create({
      data: { username, pegawai_id, password, role: "PEGAWAI" },
    });

    res.json({
      pesan: "Success",
    });
  } catch (error) {
    console.error("error tambah pengguna", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.put("/pengguna/ubah", async (req: Request, res: Response) => {
  const { id, username, pegawai_id, password } = req.body;

  try {
    const data = await prisma.m_user.update({
      data: { username, pegawai_id, password },
      where: { id },
    });

    res.json({ pesan: "Success" });
  } catch (error) {
    console.error("error ubah pengguna", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.delete("/pengguna/hapus", async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const data = await prisma.m_user.delete({
      where: { id: Number(id) },
    });

    res.json({ pesan: "Success" });
  } catch (error) {
    console.error("error hapus pengguna", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});

// aktivitas
app.get("/aktivitas/daftar", async (req: Request, res: Response) => {
  try {
    const daftarData = await prisma.t_riwayat_aktivitas.findMany({
      orderBy: [{ id: "desc" }],
    });
    const daftarPegawai = await prisma.m_pegawai.findMany({
      orderBy: [{ id: "desc" }],
    });

    res.json({
      pesan: "Success",
      hasil: daftarData.map((row) => {
        const pegawai = daftarPegawai.filter((pRow) => pRow.nip == row.oleh);
        return {
          ...row,
          id: Number(row.id.toString()),
          data_id: row.data_id ? Number(row.data_id.toString()) : null,
          oleh_nama: pegawai.length > 0 ? pegawai[0].nama : null,
        };
      }),
    });
  } catch (error) {
    console.error("error get list aktivitas", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});

// pengukuran
app.get("/pengukuran/daftar", async (req: Request, res: Response) => {
  try {
    const daftarData = await prisma.m_pengukuran.findMany({
      orderBy: [{ id: "desc" }],
    });

    res.json({
      pesan: "Success",
      hasil: daftarData.map((row) => {
        return { ...row, id: Number(row.id.toString()) };
      }),
    });
  } catch (error) {
    console.error("error get list pengukuran", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});

// tahap
app.get("/tahap/daftar", async (req: Request, res: Response) => {
  try {
    const daftarData = await prisma.m_proses_tahap.findMany({
      orderBy: [{ urutan: "asc" }],
    });

    res.json({
      pesan: "Success",
      hasil: daftarData.map((row) => {
        return { ...row, id: Number(row.id.toString()) };
      }),
    });
  } catch (error) {
    console.error("error get list tahap", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});

// bahan
app.get("/bahan/daftar", async (req: Request, res: Response) => {
  try {
    const daftarData = await prisma.m_bahan.findMany({
      orderBy: [{ id: "desc" }],
    });

    res.json({
      pesan: "Success",
      hasil: daftarData.map((row) => {
        return { ...row, id: Number(row.id.toString()) };
      }),
    });
  } catch (error) {
    console.error("error get list bahan", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.get("/bahan/ambil", async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const data = await prisma.m_bahan.findUnique({
      where: { id: Number(id) },
      include: {
        pesanan_bahan: {
          include: {
            pesanan: { include: { pelanggan: true, jenis_pakaian: true } },
          },
        },
      },
    });
    console.log("data.pesanan_bahan", data?.pesanan_bahan);

    res.json({
      pesan: "Success",
      hasil: {
        ...data,
        id: Number(data?.id.toString()),
        pesanan_bahan: data?.pesanan_bahan.map((row) => {
          console.log("row.pesanan", row.pesanan);
          return {
            ...row,
            id: Number(row.id.toString()),
            pesanan_id: Number(row.pesanan_id.toString()),
            bahan_id: Number(row.bahan_id.toString()),
            pelanggan_nama: row.pesanan?.pelanggan?.nama,
            model_nama: row.pesanan?.jenis_pakaian?.nama,
            pesanan: {
              ...row.pesanan,
              id: Number(row.pesanan?.id.toString()),
              pelanggan_id: Number(row.pesanan?.pelanggan_id.toString()),
              jenis_pakaian_id: Number(
                row.pesanan?.jenis_pakaian_id.toString()
              ),
              penerima_tugas: Number(row.pesanan?.penerima_tugas?.toString()),
              pelanggan: {
                ...row.pesanan?.pelanggan,
                id: Number(row.pesanan?.pelanggan?.id.toString()),
              },
              jenis_pakaian: {
                ...row.pesanan?.jenis_pakaian,
                id: Number(row.pesanan?.jenis_pakaian?.id.toString()),
              },
            },
          };
        }),
      },
    });
  } catch (error) {
    console.error("error get detail bahan", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.post("/bahan/tambah", async (req: Request, res: Response) => {
  const { nama, satuan, stok, harga, deskripsi } = req.body;

  try {
    const data = await prisma.m_bahan.create({
      data: { nama, satuan, stok, harga, deskripsi },
    });

    res.json({
      pesan: "Success",
    });
  } catch (error) {
    console.error("error tambah bahan", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});
app.put("/bahan/ubah", async (req: Request, res: Response) => {
  const { id, nama, satuan, stok, harga, deskripsi } = req.body;

  try {
    const data = await prisma.m_bahan.update({
      data: { nama, satuan, stok, harga, deskripsi },
      where: { id },
    });

    res.json({ pesan: "Success" });
  } catch (error) {
    console.error("error ubah bahan", error);
    res.status(500).json({ pesan: "Internal server error", hasil: error });
  }
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
