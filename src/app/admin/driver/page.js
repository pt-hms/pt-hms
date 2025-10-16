"use client"
import TableView from "@/components/dashboard/driver/TableView"
import GlobalLoader from "@/components/GlobalLoader";
import { getDriver } from "@/utils/api/driver";
import { useEffect, useState } from "react";
export default function page() {
  return (
    <div className="bg-white rounded-xl shadow w-full p-6">
      <TableView />
    </div>
  )
} 