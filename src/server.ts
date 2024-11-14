import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";

const prisma = new PrismaClient();
const app = express();
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(bodyParser.json());
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
    res.status(500).json({ pesan: "Internal server error" });
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
    res.status(500).json({ pesan: "Internal server error" });
  }
});
app.get("/pesanan/ambil", async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const data = await prisma.t_pesanan.findUnique({
      where: { id: Number(id) },
    });

    res.json({
      pesan: "Success",
      hasil: {
        ...data,
        id: Number(data?.id.toString()),
        pelanggan_id: Number(data?.pelanggan_id.toString()),
        jenis_pakaian_id: Number(data?.jenis_pakaian_id.toString()),
        penerima_tugas: Number(data?.penerima_tugas?.toString()),
      },
    });
  } catch (error) {
    console.error("error get detail pesanan", error);
    res.status(500).json({ pesan: "Internal server error" });
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
    res.status(500).json({ pesan: "Internal server error" });
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
    res.status(500).json({ pesan: "Internal server error" });
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
    res.status(500).json({ pesan: "Internal server error" });
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
    res.status(500).json({ pesan: "Internal server error" });
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
    res.status(500).json({ pesan: "Internal server error" });
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
    res.status(500).json({ pesan: "Internal server error" });
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
    res.status(500).json({ pesan: "Internal server error" });
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
    res.status(500).json({ pesan: "Internal server error" });
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
    res.status(500).json({ pesan: "Internal server error" });
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
    res.status(500).json({ pesan: "Internal server error" });
  }
});

// aktivitas
app.get("/aktivitas/daftar", async (req: Request, res: Response) => {
  try {
    const daftarData = await prisma.t_riwayat_aktivitas.findMany({
      orderBy: [{ id: "desc" }],
    });

    res.json({
      pesan: "Success",
      hasil: daftarData.map((row) => {
        return {
          ...row,
          id: Number(row.id.toString()),
          data_id: row.data_id ? Number(row.data_id.toString()) : null,
        };
      }),
    });
  } catch (error) {
    console.error("error get list aktivitas", error);
    res.status(500).json({ pesan: "Internal server error" });
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
    res.status(500).json({ pesan: "Internal server error" });
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
    res.status(500).json({ pesan: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
