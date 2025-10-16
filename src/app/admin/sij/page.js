"use client"
import React, { useEffect, useState } from 'react'
import TableView from '@/components/dashboard/sij/TableView'
import { getSIJ } from '@/utils/api/sij';
import GlobalLoader from '@/components/GlobalLoader';
export default function page() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getSIJ();
                setData(data.drivers);
            } catch (err) {
                console.error("Gagal ambil data driver:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='bg-white rounded-xl shadow p-6'><TableView data={data} /></div>
    )
}
