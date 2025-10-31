"use client";
import { useState, useMemo, useEffect } from "react";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/id";
import { Icon } from "@iconify/react";
import { Button, Loader } from "@mantine/core";
import { getMyRitase } from "@/utils/api/ritase";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

// Set default timezone ke Asia/Jakarta
dayjs.tz.setDefault("Asia/Jakarta");

export default function Page() {
  const [range, setRange] = useState([null, null]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getMyRitase();
      setData(result.ritase);
    } catch (err) {
      console.error("Gagal ambil data driver:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === 🔒 Batasi rentang maksimal 7 hari ===
  const excludeDate = (date) => {
    if (!range[0]) return false;
    const start = dayjs(range[0]);
    const diff = dayjs(date).diff(start, "day");
    return diff > 7 || diff < 0;
  };

  const today = dayjs().tz().format("YYYY-MM-DD");

  // ✅ Konversi waktu UTC backend ke waktu lokal (WIB)
  const processedData = data.map((item) => ({
    tanggal: dayjs.utc(item.date).tz("Asia/Jakarta").format("YYYY-MM-DD"),
    jumlah: item.count ?? 1,
  }));

  // === 🔍 Filter berdasarkan pilihan ===
  const filteredData = useMemo(() => {
    if (!range[0]) {
      return processedData
        .filter((d) => d.tanggal === today)
        .map((d) => ({
          ...d,
          hari: dayjs(d.tanggal).locale("id").format("dddd"),
        }));
    }

    if (range[0] && !range[1]) {
      const selected = dayjs(range[0]).format("YYYY-MM-DD");
      return processedData
        .filter((d) => d.tanggal === selected)
        .map((d) => ({
          ...d,
          hari: dayjs(d.tanggal).locale("id").format("dddd"),
        }));
    }

    return processedData
      .filter((d) =>
        dayjs(d.tanggal).isBetween(range[0], range[1], "day", "[]")
      )
      .map((d) => ({
        ...d,
        hari: dayjs(d.tanggal).locale("id").format("dddd"),
      }));
  }, [range, today, processedData]);

  const total = filteredData.reduce((a, b) => a + b.jumlah, 0);
  const max = Math.max(...filteredData.map((d) => d.jumlah), 0);

  const hanyaSatuTanggal = range[0] && !range[1];
  const rentangTanggal = range[0] && range[1];

  // === 🗓️ Label tanggal ===
  const labelTanggal = (() => {
    if (!range[0]) {
      return `Hari ini, ${dayjs().tz().locale("id").format("dddd, D MMMM YYYY")}`;
    }
    if (hanyaSatuTanggal) {
      return `${dayjs(range[0]).locale("id").format("dddd, D MMMM YYYY")}`;
    }
    if (rentangTanggal) {
      return `${dayjs(range[0]).locale("id").format("D MMMM YYYY")} - ${dayjs(range[1])
        .locale("id")
        .format("D MMMM YYYY")}`;
    }
    return "";
  })();

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-all duration-300">
        <Loader size="lg" color="red" />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center min-h-screen pb-[100px] lg:pb-[120px] bg-gray-50 relative">
      <div className="fixed left-2 top-0 p-2" onClick={fetchData}>
        <Button
          color="blue"
          leftSection={<Icon icon="material-symbols:refresh-rounded" height={24} width={24} />}
          onClick={fetchData}
          loading={loading}
          size="md"
        >
          Refresh
        </Button>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-xl w-full max-w-[420px] h-full">
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
              input: { cursor: "pointer", borderColor: "#e10b16" },
            }}
          />
        </div>

        {(!range[0] || hanyaSatuTanggal) && (
          <div className="flex flex-col items-center p-4 rounded-lg bg-[#FFF5F5] shadow-md mb-4">
            <div className="flex items-center gap-2">
              <Icon icon="lets-icons:order-light" width={28} className="text-[#e10b16]" />
              <span className="text-2xl font-bold text-[#333333]">
                {total > 0 ? `${total} Ritase` : "Tidak Ada Data"}
              </span>
            </div>
          </div>
        )}

        <div className="text-center mb-4">
          <span className="text-[#616161] text-sm font-semibold">{labelTanggal}</span>
        </div>

        {rentangTanggal && filteredData.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-2xl text-[#e10b16]">Grafik Ritase</h2>
            </div>

            <div className="flex flex-col gap-3 mb-4">
              {filteredData.map((item) => (
                <div key={item.tanggal} className="flex items-center gap-2">
                  <span className="w-20 text-[#e10b16] font-medium capitalize text-sm">
                    {item.hari}
                  </span>
                  <div className="flex-1 bg-white h-10 rounded-lg relative overflow-hidden border border-gray-200">
                    <div
                      className="h-full transition-all duration-500 bg-gradient-to-r from-[#e10b16] to-[#ff4d4d] shadow-md"
                      style={{ width: `${(item.jumlah / max) * 100}%` }}
                    ></div>
                    <span className="absolute inset-0 flex justify-center items-center text-white font-semibold text-sm">
                      {item.jumlah}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[#333333] font-semibold text-center mt-6 p-2 border-t border-gray-200">
              Total Ritase:{" "}
              <span className="font-bold text-[#e10b16]">{total} Ritase</span>
            </p>
          </div>
        )}

        {rentangTanggal && filteredData.length === 0 && (
          <p className="text-center text-[#616161] italic mb-4">
            Tidak ada data dalam rentang tanggal ini
          </p>
        )}
      </div>
    </div>
  );
}
