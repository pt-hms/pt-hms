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
                setData(data.sij);
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
    const dummyData =
        [
            {
                id: 1,
                name: "Nia Rahma",
                plate: "F 4455 TU",
                category: "REGULER",
                time: "10:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
                no_sij: "SIJ-001",
            },
            {
                id: 2,
                name: "Aryo Machfudz",
                plate: "F 1234 AB",
                category: "PREMIUM",
                time: "11:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
                no_sij: "SIJ-002",
            },
            {
                id: 3,
                name: "Budi Santoso",
                plate: "F 5678 CD",
                category: "REGULER",
                time: "12:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
                no_sij: "SIJ-003",
            },
            {
                id: 4,
                name: "Siti Aminah",
                plate: "F 9101 EF",
                category: "PREMIUM",
                time: "13:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
                no_sij: "SIJ-004",
            },
            {
                id: 5,
                name: "Rizky Pratama",
                plate: "F 1121 GH",
                category: "REGULER",
                time: "14:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
                no_sij: "SIJ-005",
            },
            {
                id: 6,
                name: "Dewi Lestari",
                plate: "F 3141 IJ",
                category: "PREMIUM",
                time: "15:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
                no_sij: "SIJ-006",
            },
            {
                id: 7,
                name: "Ahmad Fauzi",
                plate: "F 5161 KL",
                category: "REGULER",
                time: "16:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
                no_sij: "SIJ-007",
            },
            {
                id: 8,
                name: "Maya Sari",
                plate: "F 7181 MN",
                category: "PREMIUM",
                time: "17:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
                no_sij: "SIJ-008",
            },
            {
                id: 9,
                name: "Rian Saputra",
                plate: "F 9202 OP",
                category: "REGULER",
                time: "18:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
                no_sij: "SIJ-009",
            },
            {
                id: 10,
                name: "Lina Putri",
                plate: "F 2232 QR",
                category: "PREMIUM",
                time: "19:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
                no_sij: "SIJ-010",
            },

        ];
    return (
        <div className='bg-white rounded-xl shadow p-6'><TableView data={data} /></div>
    )
}
