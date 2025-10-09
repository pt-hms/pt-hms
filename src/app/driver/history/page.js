"use client";
import { useState, useMemo } from "react";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import "dayjs/locale/id";
import isBetween from "dayjs/plugin/isBetween";
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
    { tanggal: "2025-10-10", jumlah: 9 },
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

  // === 🔍 Filter data berdasarkan tanggal terpilih ===
  const filteredData = useMemo(() => {
    if (!range[0] || !range[1]) return [];
    return dataRitase
      .filter((d) =>
        dayjs(d.tanggal).isBetween(range[0], range[1], "day", "[]")
      )
      .map((d) => ({
        ...d,
        hari: dayjs(d.tanggal).locale("id").format("dddd"),
      }));
  }, [range]);

  // === 📊 Hitung total dan maksimum untuk grafik ===
  const total = filteredData.reduce((a, b) => a + b.jumlah, 0);
  const max = Math.max(...filteredData.map((d) => d.jumlah), 0);

  return (
    <div className="w-full flex justify-center items-center min-h-screen pb-[94px]">
      <div className="bg-[#FFF9F0] p-5 rounded-2xl shadow-md w-full max-w-[420px]">
        {/* PILIH RENTANG TANGGAL */}
        <div className="flex flex-col mb-6">
          <label className="text-[#704E1C] font-semibold mb-2">
            Pilih Rentang Tanggal (Max 7 Hari)
          </label>
          <DatePickerInput
            type="range"
            locale="id"
            value={range}
            onChange={setRange}
            excludeDate={excludeDate}
            valueFormat="DD MMM YYYY"
            placeholder="Pilih tanggal mulai dan akhir"
            styles={{
              input: { cursor: "pointer", borderColor: "#AE8B56" },
            }}
          />
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-2xl text-[#AE8B56]">Grafik Ritase</h2>
          {range[0] && range[1] && (
            <span className="text-[#704E1C] text-sm font-medium">
              {dayjs(range[0]).format("DD MMM")} -{" "}
              {dayjs(range[1]).format("DD MMM YYYY")}
            </span>
          )}
        </div>

        {/* GRAFIK */}
        {filteredData.length > 0 ? (
          <div className="flex flex-col gap-2 mb-4">
            {filteredData.map((item) => (
              <div key={item.tanggal} className="flex items-center gap-2">
                <span className="w-20 text-[#B8791B] font-medium capitalize">
                  {item.hari}
                </span>
                <div className="flex-1 bg-[#FCE6BE] h-12 rounded-md relative overflow-hidden">
                  <div
                    className="bg-[#E4B778] h-full transition-all duration-500"
                    style={{ width: `${(item.jumlah / max) * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex justify-center items-center text-[#704E1C] font-semibold">
                    {item.jumlah}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#704E1C] italic mb-4">
            Pilih rentang tanggal untuk melihat data ritase
          </p>
        )}

        {/* TOTAL */}
        <p className="text-[#704E1C] font-semibold text-center">
          Total Ritase:{" "}
          <span className="font-bold text-[#4B2E0B]">{total} Ritase</span>
        </p>
      </div>
    </div>
  );
}
