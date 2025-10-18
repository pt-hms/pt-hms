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
  Select,
  Image,
  Pagination,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Icon } from "@iconify/react";
import RitaseModal from "./RitaseModal";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { exportToExcel } from "@/components/Export";
import { deleteRitase, getAllRitase } from "@/utils/api/ritase";
import { nprogress } from "@mantine/nprogress";
import { notifications } from "@mantine/notifications";

export default function TableView() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [opened, setOpened] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [ssPreview, setSsPreview] = useState(null);
  const [page, setPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [timeFilter, setTimeFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null); // ⬅️ Tanggal filter (range)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  // Fetch data ritase
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllRitase();
      setData(res.ritase);
    } catch (err) {
      console.error("Gagal ambil data driver:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const normalizedData = Array.isArray(data) ? data : [];

  // Jam filter (07:00 - 23:00)
  const hours = Array.from({ length: 18 }, (_, i) => {
    const hour = 7 + i;
    const label = `${hour.toString().padStart(2, "0")}:00`;
    return { value: label, label };
  });

   useEffect(() => {
    const searchText = search.toLowerCase().trim();

    const filtered = data?.filter((d) => {
      const nama = d?.user?.nama?.toLowerCase() || "";
      const plat = d?.user?.no_pol?.toLowerCase() || "";
      const pickup = d?.pickup_point?.toLowerCase() || "";
      const tujuan = d?.tujuan?.toLowerCase() || "";

      const matchSearch =
        nama.includes(searchText) ||
        plat.includes(searchText) ||
        pickup.includes(searchText) ||
        tujuan.includes(searchText);

      let matchTime = true;
      if (timeFilter && d?.createdAt) {
        const dataHour = dayjs(d.createdAt).format("HH");
        const filterHour = timeFilter.split(":")[0];
        matchTime = dataHour === filterHour;
      }

      let matchDate = true;
      if (dateFilter && d?.createdAt) {
        matchDate =
          dayjs(d.createdAt).format("YYYY-MM-DD") ===
          dayjs(dateFilter).format("YYYY-MM-DD");
      }

      return matchSearch && matchTime && matchDate;
    });

    setFilteredData(filtered);
    setPage(1);
  }, [search, timeFilter, dateFilter, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const toggleCheck = (id) => {
    setCheckedRows((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    await fetchData();
    setOpened(false);
  };

  const openDeleteConfirm = (ids) => {
    modals.openConfirmModal({
      title: "Konfirmasi Hapus Data",
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
      labels: { confirm: "Ya, Hapus", cancel: "Batal" },
      confirmProps: { color: "red" },
      cancelProps: { variant: "subtle" },
      onConfirm: () => handleDelete(ids),
    });
  };

  const handleDelete = async (ids) => {
    try {
      nprogress.start();
      const idArray = Array.isArray(ids) ? ids : [ids];
      const res = await deleteRitase(idArray);
      setData((prev) => prev.filter((item) => !idArray.includes(String(item.id))));

      notifications.show({
        title: "Berhasil",
        message: res.message || "Berhasil menghapus data",
        color: "green",
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Gagal",
        message:
          error.response?.data?.message ||
          "Terjadi Kesalahan Saat Menghapus Data",
        color: "red",
      });
    } finally {
      setCheckedRows([]);
      modals.closeAll();
      await fetchData();
      nprogress.complete();
    }
  };

  const platNo = data?.map((item) => ({
    value: item.user.no_pol,
    label: item.user.no_pol,
  }));

  const headers = {
    id: "No",
    name: "Nama Driver",
    plate: "Plat Nomor",
    category: "Kategori",
    destination: "Tujuan",
    pickup: "Titik Jemput",
    date: "Tanggal",
    time: "Jam",
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="w-full relative">
      {/* 🔍 Filter Bar & Actions */}
      <Group justify="space-between" className="p-4 flex-wrap gap-3">
        <TextInput
          placeholder="Cari..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          leftSection={<Icon icon="mdi:magnify" />}
          className="w-full lg:w-1/4"
        />

        <Select
          placeholder="Filter Jam"
          value={timeFilter}
          onChange={setTimeFilter}
          data={hours}
          className="w-full lg:w-32"
        />

        {/* 🗓️ Filter Tanggal */}
        <DatePickerInput
         value={dateFilter}
          onChange={setDateFilter}
          placeholder="Pilih rentang tanggal"
          clearable
          locale="id"
          size="md"
          className="w-full lg:w-64"
        />

        <Group>
          <Button
            color="yellow"
            leftSection={<Icon icon="mdi:download" />}
            onClick={() =>
              exportToExcel(filteredData, "Ritase HMS.xlsx", headers)
            }
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

      {/* Table Section */}
      <Box className="w-full bg-white shadow-sm rounded-xl overflow-x-auto border border-gray-100">
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
                          (id) =>
                            !paginatedData.map((d) => d.id).includes(id)
                        )
                      );
                    }
                  }}
                />
              </Table.Th>
              <Table.Th>NAMA</Table.Th>
              <Table.Th>PLAT</Table.Th>
              <Table.Th>JENIS</Table.Th>
              <Table.Th>PICKUP POINT</Table.Th>
              <Table.Th>TUJUAN</Table.Th>
              <Table.Th>JAM</Table.Th>
              <Table.Th>TANGGAL</Table.Th>
              <Table.Th>AKSI</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {paginatedData.map((row, i) => (
              <Table.Tr key={row.id}>
                <Table.Td>
                  <Checkbox
                    checked={checkedRows.includes(row.id)}
                    onChange={() => toggleCheck(row.id)}
                  />
                </Table.Td>
                <Table.Td>{row.user.nama}</Table.Td>
                <Table.Td>{row.user.no_pol}</Table.Td>
                <Table.Td>
                  <Badge
                    color={
                      row.user.kategori === "PREMIUM" ? "#e10b16" : "gray"
                    }
                    fullWidth
                    size="md"
                  >
                    {row.user.kategori}
                  </Badge>
                </Table.Td>
                <Table.Td>{row.pickup_point}</Table.Td>
                <Table.Td>{row.tujuan}</Table.Td>
                <Table.Td>
                  {dayjs(row.createdAt).locale("id").format("HH:mm")}
                </Table.Td>
                <Table.Td>
                  {dayjs(row.createdAt).locale("id").format("D MMMM YYYY")}
                </Table.Td>
                <Table.Td className="text-center">
                  <Group justify="center" gap="xs">
                    <Button
                                              variant="subtle"
                                              color="green"
                                              radius="xl"
                                              size="xs"
                                              onClick={() => setSsPreview(row.ss_order)}
                                            >
                                              <Icon icon="mdi:image-outline" width={18} />
                                            </Button>
                    <Button
                      variant="subtle"
                      color="blue"
                      radius="xl"
                      size="xs"
                      onClick={() => {
                        setEditData(row);
                        setOpened(true);
                      }}
                    >
                      <Icon icon="mdi:open-in-new" width={18} />
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

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
      </Box>

      <RitaseModal
        opened={opened}
        onClose={() => setOpened(false)}
        data={editData}
        plat={platNo}
        onSubmit={handleSubmit}
        closeOnClickOutside={false}
      />
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
    </div>
  );
}
