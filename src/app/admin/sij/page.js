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
                clock: "10:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 2,
                name: "Aryo Machfudz",
                plate: "F 1234 AB",
                category: "PREMIUM",
                clock: "11:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 3,
                name: "Budi Santoso",
                plate: "F 5678 CD",
                category: "REGULER",
                clock: "12:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 4,
                name: "Siti Aminah",
                plate: "F 9101 EF",
                category: "PREMIUM",
                clock: "13:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 5,
                name: "Rizky Pratama",
                plate: "F 1121 GH",
                category: "REGULER",
                clock: "14:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 6,
                name: "Dewi Lestari",
                plate: "F 3141 IJ",
                category: "PREMIUM",
                clock: "15:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 7,
                name: "Ahmad Fauzi",
                plate: "F 5161 KL",
                category: "REGULER",
                clock: "16:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 8,
                name: "Maya Sari",
                plate: "F 7181 MN",
                category: "PREMIUM",
                clock: "17:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 9,
                name: "Rian Saputra",
                plate: "F 9202 OP",
                category: "REGULER",
                clock: "18:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
            {
                id: 10,
                name: "Lina Putri",
                plate: "F 2232 QR",
                category: "PREMIUM",
                clock: "19:00",
                date: "2025-09-30",
                ss: "/profil.jpeg",
            },
        ];
    return (
        <div><TableView data={dummyData} /></div>
    )
}
