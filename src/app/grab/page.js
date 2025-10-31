"use client"

import React, { useEffect, useState } from "react";
// PATH DIPERBAIKI: Kembali ke path relatif tanpa ekstensi
import { getAllRitase } from "../../utils/api/ritase";
// PATH DIPERBAIKI: Kembali ke path relatif tanpa ekstensi
import TableView from "../../components/dashboard/grab/TableView";



export default function RitasePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedRitaseData = await getAllRitase();
        setData(fetchedRitaseData); // ✅ sekarang array, aman untuk filter/map
      } catch (err) {
        console.error("Gagal mengambil data ritase:", err);
      }
    }
    fetchData();
  }, []);



  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-semibold text-red-700">❌ Error Fetching Data</h2>
          <p className="text-gray-700 mt-2">{error}</p>
          <p className="text-sm text-gray-500 mt-1">Cek console browser untuk detail error.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow w-full p-6">
      <TableView data={data} />
    </div>
  );
}