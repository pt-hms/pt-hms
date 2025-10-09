"use client";
import { useState } from "react";

export default function Page() {
  // Data berdasarkan bulan
  const dataPerBulan = {
    Januari: [
      { hari: "Senin", jumlah: 8 },
      { hari: "Selasa", jumlah: 10 },
      { hari: "Rabu", jumlah: 12 },
      { hari: "Kamis", jumlah: 9 },
      { hari: "Jumat", jumlah: 11 },
      { hari: "Sabtu", jumlah: 13 },
      { hari: "Minggu", jumlah: 7 },
    ],
    Februari: [
      { hari: "Senin", jumlah: 14 },
      { hari: "Selasa", jumlah: 11 },
      { hari: "Rabu", jumlah: 14 },
      { hari: "Kamis", jumlah: 14 },
      { hari: "Jumat", jumlah: 14 },
      { hari: "Sabtu", jumlah: 14 },
      { hari: "Minggu", jumlah: 100 },
    ],
    Maret: [
      { hari: "Senin", jumlah: 15 },
      { hari: "Selasa", jumlah: 18 },
      { hari: "Rabu", jumlah: 20 },
      { hari: "Kamis", jumlah: 19 },
      { hari: "Jumat", jumlah: 16 },
      { hari: "Sabtu", jumlah: 17 },
      { hari: "Minggu", jumlah: 21 },
    ],
  };

  const bulanList = Object.keys(dataPerBulan);

  const [bulan, setBulan] = useState(bulanList[0]);

  const data = dataPerBulan[bulan];
  const total = data.reduce((a, b) => a + b.jumlah, 0);
  const max = Math.max(...data.map((d) => d.jumlah));

  return (
    <div className="w-full flex justify-center items-center min-h-screen pb-[94px]">
      <div className="bg-[#FFF9F0] p-5 rounded-2xl shadow-md w-full max-w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-2xl text-[#AE8B56]">Grafik Ritase</h2>
          <select
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
            className="bg-[#FFF9F0] border border-slate-600 rounded-lg text-[#704E1C] text-sm px-2 py-1"
          >
            {bulanList.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          {data.map((item) => (
            <div key={item.hari} className="flex items-center gap-2">
              <span className="w-16 text-[#B8791B] font-medium">{item.hari}</span>
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

        <p className="text-[#704E1C] font-semibold text-center">
          Total Ritase Minggu Ini:{" "}
          <span className="font-bold text-[#4B2E0B]">{total} Ritase</span>
        </p>
      </div>
    </div>
  );
}
