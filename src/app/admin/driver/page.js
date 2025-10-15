"use client"
import TableView from "@/components/dashboard/driver/TableView"
import GlobalLoader from "@/components/GlobalLoader";
import { getDriver } from "@/utils/api/driver";
import { useEffect, useState } from "react";
export default function page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getDriver();
        setData(data.drivers);
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
      <GlobalLoader />
    );
  }

  console.log(data);

  return (
    <div className="bg-white rounded-xl shadow w-full p-6">
      <TableView data={data} />
    </div>
  )
} 