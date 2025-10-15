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
import { exportToExcel } from "@/components/Export";

export default function TableView({ data }) {
  const [selectedCollapse, setSelectedCollapse] = useState(null);
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

  // format tanggal lokal
  function localDate(date) {
    return dayjs(date).locale("id").format("HH:mm - D MMMM YYYY");
  }

  // filter pencarian
  useEffect(() => {
    setFilteredData(
      data.filter((d) => {
        const matchSearch =
          d.no_pol.toLowerCase().includes(search.toLowerCase()) ||
          d.nama.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
      })
    );
    setPage(1);
  }, [search, data]);

  // pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // checkbox handler
  const toggleCheck = (id) => {
    setCheckedRows((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // collapse toggle
  const toggleCollapse = (id) => {
    setSelectedCollapse(selectedCollapse === id ? null : id);
  };

  // konfirmasi hapus
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
    value: item.no_pol,
    label: item.no_pol,
  }));

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const headers = {
    nama: "NAMA DRIVER",
    no_pol: "PLAT NOMOR",
    kategori: "JENIS",
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

        <Group justify="space-between">
          <Button
            color="yellow"
            leftSection={<Icon icon="mdi:download" />}
            onClick={() => exportToExcel(filteredData, "SIJ PT HMS.xlsx", headers)}
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

      {/* Table utama */}
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
                        ...new Set([...prev, ...paginatedData.map((d) => d.id)]),
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
              </Table.Th>
              <Table.Th>NAMA</Table.Th>
              <Table.Th>PLAT NOMOR</Table.Th>
              <Table.Th>JENIS</Table.Th>
              <Table.Th>BUKTI TF</Table.Th>
              <Table.Th className="text-center">DETAIL</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {paginatedData.map((row, i) => (
              <>
                <Table.Tr
                  key={row.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <Table.Td>
                    <Checkbox
                      checked={checkedRows.includes(row.id)}
                      onChange={() => toggleCheck(row.id)}
                    />
                  </Table.Td>
                  <Table.Td>{row.nama}</Table.Td>
                  <Table.Td>{row.no_pol}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={row.kategori === "PREMIUM" ? "#e10b16" : "gray"}
                      fullWidth
                      size="md"
                    >
                      {row.kategori}
                    </Badge>
                  </Table.Td>
                  <Table.Td className="text-center">
                    {row.sij && row.sij[0]?.bukti_tf ? (
                      <Button
                        variant="subtle"
                        color="green"
                        radius="xl"
                        size="xs"
                        onClick={() => setSsPreview(row.sij[0].bukti_tf)}
                      >
                        <Icon icon="mdi:image-outline" width={18} />
                      </Button>
                    ) : (
                      "-"
                    )}
                  </Table.Td>
                  <Table.Td className="text-center">
                    <Button
                      variant="subtle"
                      color="gray"
                      radius="xl"
                      size="xs"
                      onClick={() => toggleCollapse(row.id)}
                    >
                      <Icon
                        icon={
                          selectedCollapse === row.id
                            ? "mdi:chevron-up"
                            : "mdi:chevron-down"
                        }
                        width={18}
                      />
                    </Button>
                  </Table.Td>
                </Table.Tr>

                {selectedCollapse === row.id && (
                  <Table.Tr>
                    <Table.Td colSpan={6} className="bg-gray-50">
                      <Box className="p-3 rounded-lg border border-gray-200">
                        <Text fw={600} mb={8}>
                          Daftar SIJ
                        </Text>
                        <Table
                          striped
                          highlightOnHover
                          withColumnBorders
                          className="mt-2"
                        >
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>NO. SIJ</Table.Th>
                              <Table.Th>WAKTU</Table.Th>
                              <Table.Th className="text-center">AKSI</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {row.sij?.map((s) => (
                              <Table.Tr key={s.id}>
                                <Table.Td>{s.no_sij}</Table.Td>
                                <Table.Td>{localDate(s.createdAt)}</Table.Td>
                                <Table.Td className="text-center">
                                  <Group justify="center" gap="xs">
                                    <Button
                                      size="xs"
                                      color="blue"
                                      leftSection={
                                        <Icon icon="mdi:pencil" width={16} />
                                      }
                                      onClick={() => {
                                        setEditData( {
                                          id: row.id,
                                          no_pol: row.no_pol,
                                          createdAt: s.createdAt,
                                          bukti_tf: s.bukti_tf,
                                          no_sij: s.no_sij
                                        });
                                        setOpened(true);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      size="xs"
                                      color="red"
                                      leftSection={
                                        <Icon icon="mdi:trash-can" width={16} />
                                      }
                                      onClick={() => openDeleteConfirm(s.id)}
                                    >
                                      Hapus
                                    </Button>
                                  </Group>
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </Box>
                    </Table.Td>
                  </Table.Tr>
                )}
              </>
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

        {/* Modal Form */}
        <RitaseModal
          opened={opened}
          onClose={() => setOpened(false)}
          data={editData}
          plat={platNo}
        />

        {/* Modal Bukti TF */}
        <Modal
          opened={!!ssPreview}
          onClose={() => setSsPreview(null)}
          title="Bukti Transfer"
          size="md"
          centered
          radius="lg"
        >
          {ssPreview ? (
            <Image src={ssPreview} alt="Bukti TF" width="100%" radius="md" />
          ) : (
            <Text c="dimmed" ta="center">
              Tidak ada gambar untuk ditampilkan.
            </Text>
          )}
        </Modal>
      </Box>
    </div>
  );
}
