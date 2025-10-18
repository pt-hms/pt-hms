"use client";

import React, { useEffect, useState } from "react";
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
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Icon } from "@iconify/react";
import RitaseModal from "./SIJModal";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { exportToExcel } from "@/components/Export";
import { deleteSIJ, getSIJ } from "@/utils/api/sij";
import {notifications} from "@mantine/notifications"
import { nprogress } from "@mantine/nprogress";

dayjs.locale("id");

export default function TableView() {
  const [selectedCollapse, setSelectedCollapse] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [opened, setOpened] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [ssPreview, setSsPreview] = useState(null);
  const [page, setPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [dateFilter, setDateFilter] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchData = async (date) => {
      setLoading(true);
      nprogress.start()
      try {
         const formattedDate = dayjs(date).format("YYYY-MM-DD");
          const data = await getSIJ(formattedDate);
          setData(data.drivers);
      } catch (err) {
          console.error("Gagal ambil data driver:", err);
      } finally {
          setLoading(false);
          nprogress.complete()
      }
  };
      useEffect(() => {
          fetchData(selectedDate);
      }, []);

  const itemsPerPage = 10;

  // Format tanggal
  function localDate(date) {
    return dayjs(date).locale("id").format("HH:mm - D MMMM YYYY");
  }

  // Filter data (pencarian + tanggal)
  useEffect(() => {
    const searchText = search.toLowerCase().trim()

     const filtered = data?.filter((d) => {
          const nama = d?.nama?.toLowerCase() || "";
          const plat = d?.no_pol?.toLowerCase() || "";
          
          const matchSearch =
            nama.includes(searchText) ||
            plat.includes(searchText)
    
          let matchDate = true;
          if (dateFilter && d?.sij?.createdAt) {
            matchDate =
              dayjs(d.createdAt).format("YYYY-MM-DD") ===
              dayjs(dateFilter).format("YYYY-MM-DD");
          }
    
          return matchSearch
        });

    // if (dateFilter) {
    //   const selectedDate = dayjs(dateFilter).startOf("day");
    //   data = data
    //     .map((d) => ({
    //       ...d,
    //       sij: d.sij?.filter((s) =>
    //         dayjs(s.createdAt).isSame(selectedDate, "day")
    //       ),
    //     }))
    //     .filter((d) => d.sij && d.sij.length > 0);
    // }

    setFilteredData(filtered);
    setPage(1);
  }, [search, data]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Collapse toggle
  const toggleCollapse = (id) => {
    setSelectedCollapse(selectedCollapse === id ? null : id);
  };

  console.log(paginatedData);
  

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

 const handleDelete = async (ids) => {
  try {
    nprogress.start();
    if (!ids || (Array.isArray(ids) && ids.length === 0)) return;
    const idArray = Array.isArray(ids) ? ids : [ids];

    const res = await deleteSIJ(idArray);
    console.log("Berhasil menghapus di server:", res);

    // Hanya update UI jika server berhasil
    setFilteredData((prev) =>
      prev.map((d) => ({
        ...d,
        sij: d.sij?.filter((s) => !idArray.includes(s.id)),
      }))
    );
    notifications.show({
          title: "Berhasil",
          message: res.message || "Berhasil menghapus data",
          color: "green",
        });
  } catch (error) {
        console.error(error);
        notifications.show({
          title: "Gagal",
          message: error.response?.data?.message || "Terjadi Kesalahan Saat Mengunggah Gambar",
          color: "red",
        });
      } finally {
    setCheckedRows([]);
    modals.closeAll();
    nprogress.complete();
  }
};

  const headers = {
    nama: "NAMA DRIVER",
    no_pol: "PLAT NOMOR",
    kategori: "JENIS",
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="w-full relative">
      {/* Header */}
      <Group justify="space-between" className="p-4 flex-wrap gap-3">
        <TextInput
          placeholder="Cari nama atau plat nomor"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          leftSection={<Icon icon="mdi:magnify" />}
          className="w-full sm:w-1/3"
        />

        <DatePickerInput
          placeholder="Pilih tanggal"
          locale="id"
          value={selectedDate}
          onChange={(val) => {
            setSelectedDate(val);
            fetchData(val);
          }}
          valueFormat="DD MMMM YYYY"
          clearable={false}
        />

        <Group>
          <Button
            color="yellow"
            leftSection={<Icon icon="mdi:download" />}
            onClick={() =>
              exportToExcel(filteredData, "SIJ PT HMS.xlsx", headers)
            }
          >
            Unduh
          </Button>
        </Group>
      </Group>

      {/* Jika ada checkbox terpilih */}
      {checkedRows.length > 0 && (
        <Box className="flex items-center justify-between bg-red-50 border-b border-red-200 px-4 py-2 rounded-t-xl">
          <Text size="sm" className="text-red-700 font-medium">
            {checkedRows.length} SIJ terpilih
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

      {/* Table utama */}
      <Box className="w-full bg-white shadow-sm rounded-xl overflow-x-auto border border-gray-100">
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead className="bg-gray-50">
            <Table.Tr>
              <Table.Th>NAMA</Table.Th>
              <Table.Th>PLAT NOMOR</Table.Th>
              <Table.Th>JENIS</Table.Th>
              <Table.Th>BUKTI TF</Table.Th>
              <Table.Th className="text-center">DETAIL</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <React.Fragment key={row.id || i}>
                  {/* Baris utama */}
                  <Table.Tr className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <Table.Td>{row.nama}</Table.Td>
                    <Table.Td>{row.no_pol}</Table.Td>
                    <Table.Td>
                      <Badge
                        fullWidth
                        size="md"
                        variant="filled"
                        styles={{
                          root: {
                            backgroundColor:
                              row.kategori === "PREMIUM" ? "#e10b16" : "#9ca3af",
                            color: "white",
                          },
                        }}
                      >
                        {row.kategori}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="text-center">
                      {row.tf && row.tf[0]?.bukti_tf ? (
                        <Button
                          variant="subtle"
                          color="green"
                          radius="xl"
                          size="xs"
                          onClick={() => setSsPreview(row.tf[0].bukti_tf)}
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

                  {/* Collapse SIJ */}
                  {selectedCollapse === row.id && (
                    <Table.Tr key={`collapse-${row.id}`}>
                      <Table.Td colSpan={5} className="bg-gray-50">
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
                                <Table.Th>
                                  <Checkbox
                                    checked={
                                      row.sij?.length > 0 &&
                                      row.sij.every((s) =>
                                        checkedRows.includes(s.id)
                                      )
                                    }
                                    indeterminate={
                                      row.sij?.some((s) =>
                                        checkedRows.includes(s.id)
                                      ) &&
                                      !row.sij.every((s) =>
                                        checkedRows.includes(s.id)
                                      )
                                    }
                                    onChange={(e) => {
                                      if (e.currentTarget.checked) {
                                        setCheckedRows((prev) => [
                                          ...new Set([
                                            ...prev,
                                            ...row.sij.map((s) => s.id),
                                          ]),
                                        ]);
                                      } else {
                                        setCheckedRows((prev) =>
                                          prev.filter(
                                            (id) =>
                                              !row.sij
                                                .map((s) => s.id)
                                                .includes(id)
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </Table.Th>
                                <Table.Th>NO. SIJ</Table.Th>
                                <Table.Th>WAKTU</Table.Th>
                                <Table.Th className="text-center">AKSI</Table.Th>
                              </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                              {row.sij?.map((s) => (
                                <Table.Tr key={s.id}>
                                  <Table.Td>
                                    <Checkbox
                                      checked={checkedRows.includes(s.id)}
                                      onChange={() =>
                                        setCheckedRows((prev) =>
                                          prev.includes(s.id)
                                            ? prev.filter((v) => v !== s.id)
                                            : [...prev, s.id]
                                        )
                                      }
                                    />
                                  </Table.Td>
                                  <Table.Td>{s.no_sij}</Table.Td>
                                  <Table.Td>{localDate(s.createdAt)}</Table.Td>
                                  <Table.Td className="text-center">
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
                                  </Table.Td>
                                </Table.Tr>
                              ))}
                            </Table.Tbody>
                          </Table>
                        </Box>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} className="text-center text-gray-500 py-6">
                  Tidak ada data untuk tanggal ini
                </Table.Td>
              </Table.Tr>
            )}
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
          plat={data.map((item) => ({
            value: item.no_pol,
            label: item.no_pol,
          }))}
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
