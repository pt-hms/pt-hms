"use client";
import { useState, useMemo } from "react";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import "dayjs/locale/id";
import isBetween from "dayjs/plugin/isBetween";
import { Icon } from "@iconify/react";

dayjs.extend(isBetween);

export default function Page() {
  const [range, setRange] = useState([null, null]);

  // === 🗓️ DATA STATIS ===
  const dataRitase = [
    { tanggal: "2025-10-01", jumlah: 10 },
    { tanggal: "2025-10-02", jumlah: 12 },
    { tanggal: "2025-10-03", jumlah: 8 },
    { tanggal: "2025-10-04", jumlah: 14 },
    { tanggal: "2025-10-05", jumlah: 15 },
    { tanggal: "2025-10-06", jumlah: 11 },
    { tanggal: "2025-10-07", jumlah: 13 },
    { tanggal: "2025-10-08", jumlah: 17 },
    { tanggal: "2025-10-09", jumlah: 19 },
    { tanggal: "2025-10-10", jumlah: 9 }, // hari ini
    { tanggal: "2025-10-11", jumlah: 7 },
    { tanggal: "2025-10-12", jumlah: 20 },
  ];

  // === 🔒 Batasi rentang maksimal 7 hari ===
  const excludeDate = (date) => {
    if (!range[0]) return false;
    const start = dayjs(range[0]);
    const diff = dayjs(date).diff(start, "day");
    return diff > 7 || diff < 0;
  };

  const today = dayjs().format("YYYY-MM-DD");

  // === 🔍 Tentukan data berdasarkan pilihan ===
  const filteredData = useMemo(() => {
    if (!range[0]) {
      // belum pilih → tampil hari ini
      return dataRitase
        .filter((d) => d.tanggal === today)
        .map((d) => ({
          ...d,
          hari: dayjs(d.tanggal).locale("id").format("dddd"),
        }));
    }

    if (range[0] && !range[1]) {
      // hanya satu tanggal
      const selected = dayjs(range[0]).format("YYYY-MM-DD");
      return dataRitase
        .filter((d) => d.tanggal === selected)
        .map((d) => ({
          ...d,
          hari: dayjs(d.tanggal).locale("id").format("dddd"),
        }));
    }

    // rentang tanggal
    return dataRitase
      .filter((d) =>
        dayjs(d.tanggal).isBetween(range[0], range[1], "day", "[]")
      )
      .map((d) => ({
        ...d,
        hari: dayjs(d.tanggal).locale("id").format("dddd"),
      }));
  }, [range, today]);

  const total = filteredData.reduce((a, b) => a + b.jumlah, 0);
  const max = Math.max(...filteredData.map((d) => d.jumlah), 0);

  const hanyaSatuTanggal = range[0] && !range[1];
  const rentangTanggal = range[0] && range[1];

  // === 🗓️ Format tanggal tampil di label ===
  const labelTanggal = (() => {
    if (!range[0]) {
      return `Hari ini, ${dayjs().locale("id").format("dddd, D MMMM YYYY")}`;
    }
    if (hanyaSatuTanggal) {
      return `${dayjs(range[0]).locale("id").format("dddd, D MMMM YYYY")}`;
    }
    if (rentangTanggal) {
      return `${dayjs(range[0])
        .locale("id")
        .format("D MMMM YYYY")} - ${dayjs(range[1])
          .locale("id")
          .format("D MMMM YYYY")}`;
    }
    return "";
  })();

  return (
    // Latar belakang keseluruhan dibuat abu-abu muda lembut
    <div className="w-full flex justify-center items-center min-h-screen pb-[100px] lg:pb-[120px] bg-gray-50"> 
      {/* Meningkatkan bayangan kartu utama */}
      <div className="bg-white p-5 rounded-2xl shadow-xl w-full max-w-[420px] h-full"> 
        {/* === PILIH RENTANG TANGGAL === */}
        <div className="flex flex-col mb-6">
          <label className="text-[#333333] font-semibold mb-2 text-center">
            Pilih Rentang Tanggal (Max 7 Hari)
          </label>
          <DatePickerInput
            clearable
            type="range"
            locale="id"
            value={range}
            onChange={setRange}
            excludeDate={excludeDate}
            valueFormat="DD MMM YYYY"
            placeholder="Pilih tanggal mulai dan akhir"
            styles={{
              // Tetap warna aksen merah
              input: { cursor: "pointer", borderColor: "#e10b16" }, 
            }}
          />
        </div>

        {/* === KONDISI 1 & 2: HARI INI atau SATU HARI === */}
        {(!range[0] || hanyaSatuTanggal) && (
          // Container ritase diberi warna latar belakang merah muda lembut dan shadow yang menonjol
          <div className="flex flex-col items-center p-4 rounded-lg bg-[#FFF5F5] shadow-md mb-4"> 
            <div className="flex items-center gap-2">
              <Icon
                icon="lets-icons:order-light"
                width={28}
                className="text-[#e10b16]"
              />
              <span className="text-2xl font-bold text-[#333333]">
                {total > 0 ? `${total} Ritase` : "Tidak Ada Data"}
              </span>
            </div>
          </div>
        )}

        {/* === LABEL TANGGAL === */}
        <div className="text-center mb-4">
          <span className="text-[#616161] text-sm font-semibold">
            {labelTanggal}
          </span>
        </div>

        {/* === KONDISI 3: RENTANG TANGGAL (BAR GRAFIK) === */}
        {rentangTanggal && filteredData.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-2xl text-[#e10b16]">Grafik Ritase</h2>
            </div>

            <div className="flex flex-col gap-3 mb-4"> {/* Menambahkan gap agar tidak terlalu rapat */}
              {filteredData.map((item) => (
                <div key={item.tanggal} className="flex items-center gap-2">
                  <span className="w-20 text-[#e10b16] font-medium capitalize text-sm"> {/* Teks hari dibuat sedikit lebih kecil */}
                    {item.hari}
                  </span>
                  {/* Latar belakang bar diubah menjadi putih dengan border tipis dan rounded-lg */}
                  <div className="flex-1 bg-white h-10 rounded-lg relative overflow-hidden border border-gray-200"> 
                    <div
                      // Isi bar diubah menjadi gradien merah cerah
                      className="h-full transition-all duration-500 bg-gradient-to-r from-[#e10b16] to-[#ff4d4d] shadow-md" 
                      style={{ width: `${(item.jumlah / max) * 100}%` }}
                    ></div>
                    <span className="absolute inset-0 flex justify-center items-center text-white font-semibold text-sm">
                      {/* Teks di atas gradien diubah menjadi putih agar kontras */}
                      {item.jumlah}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <p className="text-[#333333] font-semibold text-center mt-6 p-2 border-t border-gray-200"> 
              Total Ritase:{" "}
              <span className="font-bold text-[#e10b16]">{total} Ritase</span>
            </p>
          </div>
        )}

        {/* === Jika filter aktif tapi kosong === */}
        {rentangTanggal && filteredData.length === 0 && (
          <p className="text-center text-[#616161] italic mb-4">
            Tidak ada data dalam rentang tanggal ini
          </p>
        )}
      </div>
    </div>
  );
}