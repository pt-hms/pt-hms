"use client"
import Image from "next/image"
import { Icon } from "@iconify/react"
import { getUser } from "@/utils/useAuth";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { getProfile } from "@/utils/api/profil";
import { useEffect, useState } from "react";
import { Loader } from "@mantine/core"

export default function page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProfile();
        setData(data.driver);
      } catch (err) {
        console.error("Gagal ambil data driver:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-all duration-300">
        <Loader size="lg" color="red" />
      </div>
    );
  }

  const dateIndo = dayjs(data.exp_kep).locale("id").format("dddd, D MMMM YYYY");
  return (
    // Latar belakang layar dibuat bersih (misalnya bg-gray-50)
    <div className="w-full flex items-center justify-center min-h-screen pb-[62px] bg-gray-50">
      {/* Kontainer profil diubah menjadi putih dengan shadow yang jelas */}
      <div className="mx-auto w-fit h-full px-8 flex flex-col items-center justify-center gap-6 bg-white shadow-xl rounded-xl pt-[62px] pb-[62px] max-w-sm">
        <div className="w-[240px] h-[240px] relative">
          {data.foto_profil &&
            <Image
              src={data.foto_profil || ""}
              alt="Foto Profil Driver"
              fill={true}
              // Border Merah sebagai aksen
              className="border-4 border-[#e10b16] object-top rounded-full"
              style={{ objectFit: "cover" }}
            />
          }
        </div>
        <div className="flex flex-col justify-center w-full gap-6">
          {/* Nama driver menggunakan warna aksen Merah */}
          <h1 className="text-4xl text-center font-bold text-[#e10b16]">
            {data.nama}
          </h1>
          <div className="flex flex-col justify-start gap-4 w-full"> {/* Gap ditingkatkan menjadi 4 */}
            {/* ITEM DETAIL 1: Kategori/Mobil */}
            <div className="flex gap-3 items-center">
              {/* Ikon Merah sebagai aksen */}
              <Icon icon="mdi:car" width={26} height={26} color="#e10b16" />
              {/* Latar belakang abu-abu muda lembut (bg-gray-100) */}
              <div className="bg-gray-100 py-2 px-4 rounded-lg w-full">
                <p className="text-lg text-black font-medium capitalize">{data.kategori}/{data.mobil}</p> {/* Text diubah menjadi font-medium dan ukuran sedikit kecil */}
              </div>
            </div>

            {/* ITEM DETAIL 2: Plat Nomor */}
            <div className="flex gap-3 items-center">
              <Icon icon="solar:plate-bold" width={26} height={26} color="#e10b16" />
              <div className="bg-gray-100 py-2 px-4 rounded-lg w-full">
                <p className="text-lg text-black font-medium">{data.no_pol}</p>
              </div>
            </div>

            {/* ITEM DETAIL 3: ID Karyawan */}
            <div className="flex gap-3 items-center">
              <Icon icon="solar:card-bold" width={26} height={26} color="#e10b16" />
              <div className="bg-gray-100 py-2 px-4 rounded-lg w-full">
                <p className="text-lg text-black font-medium">{data.no_kep}</p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <Icon icon="pajamas:expire" width={26} height={26} color="#e10b16" />
              <div className="bg-gray-100 py-2 px-4 rounded-lg w-full">
                <p className="text-lg text-black font-medium">{dateIndo}</p>
              </div>
            </div>

            {/* ITEM DETAIL 4: Nomor Telepon (Utama) */}
            <div className="flex gap-3 items-center">
              <Icon icon="bi:phone-fill" width={26} height={26} color="#e10b16" />
              <div className="bg-gray-100 py-2 px-4 rounded-lg w-full">
                <p className="text-lg text-black font-medium">{data.no_hp}</p>
              </div>
            </div>

            {/* ITEM DETAIL 5: Kontak Darurat */}
            <div className="flex gap-3 items-center">
              <Icon icon="gg:danger" width={26} height={26} color="#e10b16" />
              {/* Menggunakan warna abu-abu sedikit lebih gelap untuk membedakan kontak darurat */}
              <div className="bg-gray-200 py-2 px-4 rounded-lg w-full">
                <p className="text-lg text-black font-medium">{data.no_darurat}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}