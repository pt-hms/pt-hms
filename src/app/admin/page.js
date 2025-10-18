"use client";
import { Icon } from "@iconify/react";
import Card from "@/components/dashboard/Card";
import { useEffect, useState } from "react";
import { getDashboard } from "@/utils/api/dashboard";
import { Button } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import GlobalLoader from "@/components/GlobalLoader";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewText, setPreviewText] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // default hari ini

  const fetchData = async (date) => {
    setLoading(true);
    try {
      // format tanggal untuk request
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const res = await getDashboard(formattedDate); // misal backend: /dashboard?date=YYYY-MM-DD
      setData(res);


      if (res && Array.isArray(res.report)) {
        const today = dayjs(date).format("dddd, DD MMMM YYYY").toUpperCase();
        let report = `*Flash Report*\n${today}\n\n_Daily Ritase by Hours_\nPT. ( HMS )\n\n`;

        res.report.forEach((d) => {
          report += `*Jam ${d.jam}*\n`;
          report += `*GCA* Rides : ${d.rides}\n`;
          report += `*GCA* Daily Active Driver : ${d.dailyActiveDriver}\n`;
          report += `*GCA* Driver Standby : \n\n`;
        });

        report += `*TOTAL DAD : ${res.total.totalDailyActiveDriver}*\n`;
        report += `*TOTAL RIDES : ${res.total.totalRides}*\n`;
        report += `*STANDBY POOL : *\n`;

        setPreviewText(report);
      } else {
        setPreviewText("Tidak ada data laporan untuk tanggal ini.");
      }
    } catch (err) {
      console.error("Gagal ambil data dashboard:", err);
      setPreviewText("Gagal memuat data laporan.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch saat komponen pertama kali render
  useEffect(() => {
    fetchData(selectedDate);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal copy:", err);
    }
  };

  // if (loading) return <GlobalLoader />;

  const card = [
    {
      nama: "DAD",
      data: data?.total?.totalDailyActiveDriver,
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: "mdi:users",
    },
    {
      nama: "Ritase",
      data: data?.total?.totalRides,
      bg: "bg-green-100",
      text: "text-green-800",
      icon: "lets-icons:order-light",
    },
  ];

  return (
    <div>
      {/* Filter Tanggal */}
      <div className="flex justify-end mb-4">
        <DatePickerInput
          placeholder="Pilih tanggal laporan"
          value={selectedDate}
          onChange={(val) => {
            setSelectedDate(val);
            fetchData(val);
          }}
          valueFormat="DD MMMM YYYY"
          locale="id"
          clearable={false}
        />
      </div>

      {/* Card Ringkasan */}
      <div className="flex flex-wrap gap-2 lg:gap-4 w-full justify-center">
        {card.map((menu) => (
          <Card
            key={menu.nama}
            nama={menu.nama}
            data={menu.data}
            bg={menu.bg}
            text={menu.text}
            icon={menu.icon}
          />
        ))}
      </div>

      {/* Preview Laporan */}
      {previewText && (
        <div className="relative mt-6 w-full max-w-xl mx-auto">
          <pre className="p-4 border rounded bg-gray-50 whitespace-pre-wrap w-full overflow-auto max-h-[70vh] relative">
            <Button
              onClick={handleCopy}
              variant="transparent"
              color="black"
              leftSection={<Icon icon="solar:copy-bold" />}
              className="sticky top-1 right-1 float-right rounded text-sm transition"
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
            {previewText}
          </pre>
        </div>
      )}
    </div>
  );
}
