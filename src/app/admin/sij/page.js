import React from 'react'
import TableView from '@/components/dashboard/sij/TableView'
export default function page() {
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
            },
            {
                id: 2,
                name: "Aryo Machfudz",
                plate: "F 1234 AB",
                category: "PREMIUM",
                time: "11:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 3,
                name: "Budi Santoso",
                plate: "F 5678 CD",
                category: "REGULER",
                time: "12:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 4,
                name: "Siti Aminah",
                plate: "F 9101 EF",
                category: "PREMIUM",
                time: "13:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 5,
                name: "Rizky Pratama",
                plate: "F 1121 GH",
                category: "REGULER",
                time: "14:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 6,
                name: "Dewi Lestari",
                plate: "F 3141 IJ",
                category: "PREMIUM",
                time: "15:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 7,
                name: "Ahmad Fauzi",
                plate: "F 5161 KL",
                category: "REGULER",
                time: "16:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 8,
                name: "Maya Sari",
                plate: "F 7181 MN",
                category: "PREMIUM",
                time: "17:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 9,
                name: "Rian Saputra",
                plate: "F 9202 OP",
                category: "REGULER",
                time: "18:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 10,
                name: "Lina Putri",
                plate: "F 2232 QR",
                category: "PREMIUM",
                time: "19:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
        ];
    return (
        <div className='bg-white rounded-xl shadow p-6'><TableView data={dummyData} /></div>
    )
}
