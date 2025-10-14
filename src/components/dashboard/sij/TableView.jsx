"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Checkbox,
  Button,
  Badge,
  Group,
  Box,
  Text,
  TextInput,
  Modal,
  Image,
  Pagination,
  Select,
} from "@mantine/core";
import { Icon } from "@iconify/react";
import RitaseModal from "./SIJModal";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { exportToExcel } from "@/components/Export"; // 👈️ Import fungsi ekspor

export default function TableView({ data }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [opened, setOpened] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [ssPreview, setSsPreview] = useState(null);
  const [page, setPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);
  const [timeFilter, setTimeFilter] = useState(null);

  const itemsPerPage = 10;

  const hours = Array.from({ length: 18 }, (_, i) => {
    const hour = 7 + i;
    const label = hour.toString().padStart(2, "0") + ":00";
    return { value: label, label };
  });

  // Filter pencarian & waktu
  useEffect(() => {
    setFilteredData(
      data.filter((d) => {
        const matchSearch =
          d.plate.toLowerCase().includes(search.toLowerCase()) ||
          d.name.toLowerCase().includes(search.toLowerCase());

        let matchTime = true;
        if (timeFilter && d.time) {
          const rowHour = parseInt(d.time.split(":")[0], 10);
          const filterHour = parseInt(timeFilter.split(":")[0], 10);
          matchTime = rowHour === filterHour;
        }

        return matchSearch && matchTime;
      })
    );
    setPage(1);
  }, [search, data, timeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Checkbox
  const toggleCheck = (id) => {
    setCheckedRows((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // Detail panel
  const handleShowDetail = (row) => {
    if (selectedRow && selectedRow.id === row.id) setSelectedRow(null);
    else setSelectedRow(row);
  };

  // Submit form (tambah/edit)
  const handleSubmit = (form) => {
    if (editData) console.log("Update data:", form);
    else console.log("Create data:", form);
  };

  // Konfirmasi hapus
  const openDeleteConfirm = (ids) => {
    modals.openConfirmModal({
      title: "Konfirmasi Hapus",
      centered: true,
      children: (
        <Text size="sm">
          Apakah kamu yakin ingin menghapus{" "}
          <strong>
            {Array.isArray(ids) ? `${ids.length} data terpilih` : "data ini"}
          </strong>
          ?
        </Text>
      ),
      labels: { confirm: "Ya", cancel: "Tidak" },
      confirmProps: { color: "red" },
      onConfirm: () => handleDelete(ids),
    });
  };

  // Handle hapus data
  const handleDelete = (ids) => {
    if (Array.isArray(ids)) {
      console.log("Menghapus beberapa ID:", ids);
      setCheckedRows([]);
    } else {
      console.log("Menghapus ID:", ids);
    }
    modals.closeAll();
  };

  const platNo = data.map((item) => ({
    value: item.plate,
    label: item.plate,
  }));

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // 👇️ Header untuk Ekspor Excel
  const headers = {
    no: "NO. SIJ",
    name: "NAMA DRIVER",
    plate: "PLAT NOMOR",
    category: "JENIS",
    time: "JAM MASUK",
    date: "TANGGAL",
  };

  return (
    <div className="w-full relative">
      {/* Header */}
      <Group justify="space-between" className="p-4">
        <TextInput
          placeholder="Cari"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          leftSection={<Icon icon="mdi:magnify" />}
          className="w-full lg:w-1/3"
        />
        <Select
          placeholder="Filter Jam"
          value={timeFilter}
          onChange={setTimeFilter}
          data={hours}
          className="w-full lg:w-40"
        />
        <Group justify="space-between">
          <Button
            color="yellow"
            leftSection={<Icon icon="mdi:download" />}
            onClick={() =>
              exportToExcel(
                filteredData,
                "SIJ PT HMS.xlsx",
                headers
              )
            } // 👈️ Logic Unduh Ditambahkan
          >
            Unduh
          </Button>
          <Button
            color="orange"
            leftSection={<Icon icon="mdi:plus" />}
            onClick={() => {
              setEditData(null);
              setOpened(true);
            }}
          >
            Tambah
          </Button>
        </Group>
      </Group>

      {/* 🧾 Tabel */}
      <Box className="w-full bg-white shadow-sm rounded-xl overflow-x-auto border border-gray-100">
        {checkedRows.length > 0 && (
          <Box className="flex items-center justify-between bg-red-50 border-b border-red-200 px-4 py-2">
            <Text size="sm" className="text-red-700 font-medium">
              {checkedRows.length} data terpilih
            </Text>
            <Button
              color="red"
              size="xs"
              leftSection={<Icon icon="mdi:trash-can" width={16} />}
              onClick={() => openDeleteConfirm(checkedRows)}
            >
              Hapus Data Terpilih
            </Button>
          </Box>
        )}

        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead className="bg-gray-50">
            {/* 👇️ Perhatikan tidak ada spasi/newline antar <Table.Th> untuk mencegah hydration error */}
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  checked={
                    paginatedData.length > 0 &&
                    paginatedData.every((row) => checkedRows.includes(row.id))
                  }
                  indeterminate={
                    paginatedData.some((row) => checkedRows.includes(row.id)) &&
                    !paginatedData.every((row) => checkedRows.includes(row.id))
                  }
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      setCheckedRows((prev) => [
                        ...new Set([
                          ...prev,
                          ...paginatedData.map((d) => d.id),
                        ]),
                      ]);
                    } else {
                      setCheckedRows((prev) =>
                        prev.filter(
                          (id) => !paginatedData.map((d) => d.id).includes(id)
                        )
                      );
                    }
                  }}
                />
              </Table.Th><Table.Th>NO. SIJ</Table.Th><Table.Th>NAMA</Table.Th><Table.Th>PLAT NOMOR</Table.Th><Table.Th>JENIS</Table.Th><Table.Th>JAM</Table.Th><Table.Th>TANGGAL</Table.Th><Table.Th>AKSI</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {paginatedData.map((row, i) => (
              <Table.Tr
                key={row.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {/* 👇️ Perhatikan tidak ada spasi/newline antar <Table.Td> untuk mencegah hydration error */}
                <Table.Td>
                  <Checkbox
                    checked={checkedRows.includes(row.id)}
                    onChange={() => toggleCheck(row.id)}
                  />
                </Table.Td>

                <Table.Td>
                  {String((page - 1) * itemsPerPage + i + 1).padStart(3, "0")}
                </Table.Td><Table.Td>{row.name}</Table.Td><Table.Td>{row.plate}</Table.Td><Table.Td>
                  <Badge
                    color={row.category === "PREMIUM" ? "#e10b16" : "gray"}
                    fullWidth
                    size="md"
                  >
                    {row.category}
                  </Badge>
                </Table.Td><Table.Td>{row.time}</Table.Td><Table.Td>
                  {row.date
                    ? dayjs(row.date).locale("id").format("D MMMM YYYY")
                    : "-"}
                </Table.Td><Table.Td className="text-center">
                  <Group justify="center" gap="xs">
                    <Button
                      variant="subtle"
                      color="green"
                      radius="xl"
                      size="xs"
                      onClick={() =>
                        row.ss
                          ? setSsPreview(
                              typeof row.ss === "string"
                                ? row.ss
                                : URL.createObjectURL(row.ss)
                            )
                          : alert("Bukti SS belum tersedia")
                      }
                    >
                      <Icon icon="mdi:image-outline" width={18} />
                    </Button>
                    <Button
                      variant="subtle"
                      color="blue"
                      radius="xl"
                      size="xs"
                      onClick={() => handleShowDetail(row)}
                    >
                      <Icon icon="mdi:open-in-new" width={18} />
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Group justify="center" className="p-4 border-t border-gray-100">
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
              color="orange"
              size="sm"
              radius="xl"
            />
          </Group>
        )}

        {/* Modal Create/Edit */}
        <RitaseModal
          opened={opened}
          onClose={() => setOpened(false)}
          data={editData}
          plat={platNo}
          onSubmit={handleSubmit}
        />

        {/* Modal Preview SS */}
        <Modal
          opened={!!ssPreview}
          onClose={() => setSsPreview(null)}
          title="Bukti SS"
          size="md"
          centered
          radius="lg"
        >
          {ssPreview ? (
            <Image src={ssPreview} alt="Bukti SS" width="100%" radius="md" />
          ) : (
            <Text c="dimmed" ta="center">
              Tidak ada gambar untuk ditampilkan.
            </Text>
          )}
        </Modal>
      </Box>

      {/* Detail Panel */}
      {selectedRow && (
        <Box className="p-4 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between sticky bottom-0 w-full">
          <Text size="sm" className="text-gray-700">
            Data Driver Terpilih dengan Plat Nomor:{" "}
            <span className="font-semibold">{selectedRow.plate}</span>
          </Text>

          <Group gap="xs">
            <Button
              size="xs"
              color="blue"
              leftSection={<Icon icon="mdi:pencil" width={16} />}
              onClick={() => {
                setEditData(selectedRow);
                setOpened(true);
              }}
            >
              Edit
            </Button>
            <Button
              size="xs"
              color="red"
              leftSection={<Icon icon="mdi:trash-can" width={16} />}
              onClick={() => openDeleteConfirm(selectedRow.id)}
            >
              Hapus
            </Button>
            <Button
              size="xs"
              color="gray"
              variant="default"
              leftSection={<Icon icon="mdi:close" width={16} />}
              onClick={() => setSelectedRow(null)}
            >
              Tutup
            </Button>
          </Group>
        </Box>
      )}
    </div>
  );
}