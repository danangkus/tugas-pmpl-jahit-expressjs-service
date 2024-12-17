-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP SEQUENCE public.m_bahan_id_seq;

CREATE SEQUENCE public.m_bahan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.m_bahan_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.m_bahan_id_seq TO postgres;

-- DROP SEQUENCE public.m_jenis_pakaian_id_seq;

CREATE SEQUENCE public.m_jenis_pakaian_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.m_jenis_pakaian_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.m_jenis_pakaian_id_seq TO postgres;

-- DROP SEQUENCE public.m_pakaian_ukur_id_seq;

CREATE SEQUENCE public.m_pakaian_ukur_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.m_pakaian_ukur_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.m_pakaian_ukur_id_seq TO postgres;

-- DROP SEQUENCE public.m_pegawai_id_seq;

CREATE SEQUENCE public.m_pegawai_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.m_pegawai_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.m_pegawai_id_seq TO postgres;

-- DROP SEQUENCE public.m_pelanggan_id_seq;

CREATE SEQUENCE public.m_pelanggan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.m_pelanggan_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.m_pelanggan_id_seq TO postgres;

-- DROP SEQUENCE public.m_pengukuran_id_seq;

CREATE SEQUENCE public.m_pengukuran_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.m_pengukuran_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.m_pengukuran_id_seq TO postgres;

-- DROP SEQUENCE public.m_proses_tahap_id_seq;

CREATE SEQUENCE public.m_proses_tahap_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.m_proses_tahap_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.m_proses_tahap_id_seq TO postgres;

-- DROP SEQUENCE public.m_user_id_seq;

CREATE SEQUENCE public.m_user_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.m_user_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.m_user_id_seq TO postgres;

-- DROP SEQUENCE public.t_pesanan_bahan_bahan_id_seq;

CREATE SEQUENCE public.t_pesanan_bahan_bahan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.t_pesanan_bahan_bahan_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.t_pesanan_bahan_bahan_id_seq TO postgres;

-- DROP SEQUENCE public.t_pesanan_bahan_id_seq;

CREATE SEQUENCE public.t_pesanan_bahan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.t_pesanan_bahan_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.t_pesanan_bahan_id_seq TO postgres;

-- DROP SEQUENCE public.t_pesanan_dokumen_id_seq;

CREATE SEQUENCE public.t_pesanan_dokumen_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.t_pesanan_dokumen_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.t_pesanan_dokumen_id_seq TO postgres;

-- DROP SEQUENCE public.t_pesanan_id_seq;

CREATE SEQUENCE public.t_pesanan_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.t_pesanan_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.t_pesanan_id_seq TO postgres;

-- DROP SEQUENCE public.t_pesanan_ukur_id_seq;

CREATE SEQUENCE public.t_pesanan_ukur_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.t_pesanan_ukur_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.t_pesanan_ukur_id_seq TO postgres;

-- DROP SEQUENCE public.t_riwayat_aktivitas_id_seq;

CREATE SEQUENCE public.t_riwayat_aktivitas_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.t_riwayat_aktivitas_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.t_riwayat_aktivitas_id_seq TO postgres;
-- public.m_bahan definition

-- Drop table

-- DROP TABLE public.m_bahan;

CREATE TABLE public.m_bahan (
	id bigserial NOT NULL,
	nama varchar(50) NOT NULL,
	satuan varchar(20) NOT NULL,
	stok int4 NULL,
	harga numeric(7) NULL,
	deskripsi varchar(255) NULL,
	CONSTRAINT m_bahan_pk PRIMARY KEY (id),
	CONSTRAINT m_bahan_unique UNIQUE (nama)
);

-- Permissions

ALTER TABLE public.m_bahan OWNER TO postgres;
GRANT ALL ON TABLE public.m_bahan TO postgres;


-- public.m_jenis_pakaian definition

-- Drop table

-- DROP TABLE public.m_jenis_pakaian;

CREATE TABLE public.m_jenis_pakaian (
	id bigserial NOT NULL,
	nama varchar(50) NOT NULL,
	jenis_kelamin bpchar(1) NULL,
	deskripsi varchar(255) NULL,
	gambar_base64 text NULL,
	CONSTRAINT m_jenis_pakaian_pk PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.m_jenis_pakaian OWNER TO postgres;
GRANT ALL ON TABLE public.m_jenis_pakaian TO postgres;


-- public.m_pegawai definition

-- Drop table

-- DROP TABLE public.m_pegawai;

CREATE TABLE public.m_pegawai (
	id bigserial NOT NULL,
	nip varchar(20) NOT NULL,
	nama varchar(50) NOT NULL,
	no_hp varchar(15) NULL,
	CONSTRAINT m_pegawai_pk PRIMARY KEY (id),
	CONSTRAINT m_pegawai_unique UNIQUE (nip)
);

-- Permissions

ALTER TABLE public.m_pegawai OWNER TO postgres;
GRANT ALL ON TABLE public.m_pegawai TO postgres;


-- public.m_pelanggan definition

-- Drop table

-- DROP TABLE public.m_pelanggan;

CREATE TABLE public.m_pelanggan (
	id bigserial NOT NULL,
	nama varchar(50) NOT NULL,
	no_hp varchar(15) NULL,
	jenis_kelamin bpchar(1) NULL,
	tanggal_lahir date NULL,
	alamat text NULL,
	CONSTRAINT m_pelanggan_pk PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.m_pelanggan OWNER TO postgres;
GRANT ALL ON TABLE public.m_pelanggan TO postgres;


-- public.m_pengukuran definition

-- Drop table

-- DROP TABLE public.m_pengukuran;

CREATE TABLE public.m_pengukuran (
	id bigserial NOT NULL,
	nama varchar(50) NOT NULL,
	satuan varchar(20) NOT NULL,
	deskripsi varchar(255) NULL,
	CONSTRAINT m_pengukuran_pk PRIMARY KEY (id),
	CONSTRAINT m_pengukuran_unique UNIQUE (nama)
);

-- Permissions

ALTER TABLE public.m_pengukuran OWNER TO postgres;
GRANT ALL ON TABLE public.m_pengukuran TO postgres;


-- public.m_proses_tahap definition

-- Drop table

-- DROP TABLE public.m_proses_tahap;

CREATE TABLE public.m_proses_tahap (
	id bigserial NOT NULL,
	kode varchar(10) NOT NULL,
	nama varchar(50) NOT NULL,
	deskripsi varchar(255) NULL,
	urutan int4 NOT NULL,
	CONSTRAINT m_proses_tahap_pk PRIMARY KEY (id),
	CONSTRAINT m_proses_tahap_unique UNIQUE (kode),
	CONSTRAINT m_proses_tahap_unique_1 UNIQUE (nama),
	CONSTRAINT m_proses_tahap_unique_2 UNIQUE (urutan)
);

-- Permissions

ALTER TABLE public.m_proses_tahap OWNER TO postgres;
GRANT ALL ON TABLE public.m_proses_tahap TO postgres;


-- public.t_riwayat_aktivitas definition

-- Drop table

-- DROP TABLE public.t_riwayat_aktivitas;

CREATE TABLE public.t_riwayat_aktivitas (
	id bigserial NOT NULL,
	tabel varchar(50) NULL,
	data_id int8 NULL,
	aktivitas text NOT NULL,
	tanggal timestamp NOT NULL,
	oleh varchar(50) NOT NULL,
	CONSTRAINT t_riwayat_aktivitas_pk PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public.t_riwayat_aktivitas OWNER TO postgres;
GRANT ALL ON TABLE public.t_riwayat_aktivitas TO postgres;


-- public.m_jenis_pakaian_ukur definition

-- Drop table

-- DROP TABLE public.m_jenis_pakaian_ukur;

CREATE TABLE public.m_jenis_pakaian_ukur (
	id int8 DEFAULT nextval('m_pakaian_ukur_id_seq'::regclass) NOT NULL,
	jenis_pakaian_id int8 NOT NULL,
	pengukuran_id int8 NOT NULL,
	CONSTRAINT m_pakaian_ukur_pk PRIMARY KEY (id),
	CONSTRAINT m_jenis_pakaian_ukur_m_jenis_pakaian_fk FOREIGN KEY (jenis_pakaian_id) REFERENCES public.m_jenis_pakaian(id),
	CONSTRAINT m_jenis_pakaian_ukur_m_pengukuran_fk FOREIGN KEY (pengukuran_id) REFERENCES public.m_pengukuran(id)
);

-- Permissions

ALTER TABLE public.m_jenis_pakaian_ukur OWNER TO postgres;
GRANT ALL ON TABLE public.m_jenis_pakaian_ukur TO postgres;


-- public.m_user definition

-- Drop table

-- DROP TABLE public.m_user;

CREATE TABLE public.m_user (
	id bigserial NOT NULL,
	username varchar(50) NOT NULL,
	"role" varchar(20) NOT NULL,
	pegawai_id int8 NULL,
	"password" varchar(50) NOT NULL,
	"token" varchar(255) NULL,
	tanggal_login_terakhir timestamp NULL,
	CONSTRAINT m_user_pk PRIMARY KEY (id),
	CONSTRAINT m_user_unique UNIQUE (username),
	CONSTRAINT m_user_m_pegawai_fk FOREIGN KEY (pegawai_id) REFERENCES public.m_pegawai(id)
);

-- Permissions

ALTER TABLE public.m_user OWNER TO postgres;
GRANT ALL ON TABLE public.m_user TO postgres;


-- public.t_pesanan definition

-- Drop table

-- DROP TABLE public.t_pesanan;

CREATE TABLE public.t_pesanan (
	id bigserial NOT NULL,
	pelanggan_id int8 NOT NULL,
	jenis_pakaian_id int8 NOT NULL,
	tahap varchar(20) NOT NULL,
	target_tanggal date NULL,
	catatan text NULL,
	penerima_tugas int8 NULL,
	CONSTRAINT t_pesanan_pk PRIMARY KEY (id),
	CONSTRAINT t_pesanan_m_jenis_pakaian_fk FOREIGN KEY (jenis_pakaian_id) REFERENCES public.m_jenis_pakaian(id),
	CONSTRAINT t_pesanan_m_pegawai_fk FOREIGN KEY (penerima_tugas) REFERENCES public.m_pegawai(id),
	CONSTRAINT t_pesanan_m_pelanggan_fk FOREIGN KEY (pelanggan_id) REFERENCES public.m_pelanggan(id),
	CONSTRAINT t_pesanan_m_proses_tahap_fk FOREIGN KEY (tahap) REFERENCES public.m_proses_tahap(kode)
);

-- Permissions

ALTER TABLE public.t_pesanan OWNER TO postgres;
GRANT ALL ON TABLE public.t_pesanan TO postgres;


-- public.t_pesanan_bahan definition

-- Drop table

-- DROP TABLE public.t_pesanan_bahan;

CREATE TABLE public.t_pesanan_bahan (
	id bigserial NOT NULL,
	bahan_id bigserial NOT NULL,
	jumlah numeric(3) NULL,
	catatan varchar(255) NULL,
	pesanan_id int8 NOT NULL,
	CONSTRAINT t_pesanan_bahan_pk PRIMARY KEY (id),
	CONSTRAINT t_pesanan_bahan_m_bahan_fk FOREIGN KEY (bahan_id) REFERENCES public.m_bahan(id),
	CONSTRAINT t_pesanan_bahan_t_pesanan_fk FOREIGN KEY (pesanan_id) REFERENCES public.t_pesanan(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.t_pesanan_bahan OWNER TO postgres;
GRANT ALL ON TABLE public.t_pesanan_bahan TO postgres;


-- public.t_pesanan_dokumen definition

-- Drop table

-- DROP TABLE public.t_pesanan_dokumen;

CREATE TABLE public.t_pesanan_dokumen (
	id bigserial NOT NULL,
	pesanan_id int8 NOT NULL,
	"base64" text NOT NULL,
	deskripsi varchar(255) NULL,
	nama varchar(100) NOT NULL,
	CONSTRAINT t_pesanan_dokumen_pk PRIMARY KEY (id),
	CONSTRAINT t_pesanan_dokumen_t_pesanan_fk FOREIGN KEY (pesanan_id) REFERENCES public.t_pesanan(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.t_pesanan_dokumen OWNER TO postgres;
GRANT ALL ON TABLE public.t_pesanan_dokumen TO postgres;


-- public.t_pesanan_ukur definition

-- Drop table

-- DROP TABLE public.t_pesanan_ukur;

CREATE TABLE public.t_pesanan_ukur (
	id bigserial NOT NULL,
	pesanan_id int8 NOT NULL,
	nilai numeric(4, 1) NULL,
	catatan varchar(255) NULL,
	pengukuran_id int8 NOT NULL,
	CONSTRAINT t_pesanan_ukur_pk PRIMARY KEY (id),
	CONSTRAINT t_pesanan_ukur_m_pengukuran_fk FOREIGN KEY (pengukuran_id) REFERENCES public.m_pengukuran(id),
	CONSTRAINT t_pesanan_ukur_t_pesanan_fk FOREIGN KEY (pesanan_id) REFERENCES public.t_pesanan(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.t_pesanan_ukur OWNER TO postgres;
GRANT ALL ON TABLE public.t_pesanan_ukur TO postgres;




-- Permissions

GRANT ALL ON SCHEMA public TO pg_database_owner;
GRANT USAGE ON SCHEMA public TO public;