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
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id";
import { exportToExcel } from "@/components/Export";
import { deleteRitase, getAllRitase } from "@/utils/api/ritase";
import { nprogress } from "@mantine/nprogress";
import { notifications } from "@mantine/notifications";
import { getDriver } from "@/utils/api/driver";
import { downloadRitaseExcel } from "@/utils/api/export";

// 🕒 Setup timezone Indonesia (WIB)
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("id");
dayjs.tz.setDefault("Asia/Jakarta");

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
  const [dateFilter, setDateFilter] = useState(null);
  const [data, setData] = useState([]);
  const [driver, setDriver] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportModal, setExportModal] = useState(false);
  const [exportDate, setExportDate] = useState([null, null]);
  const [exportMode, setExportMode] = useState("");

  const itemsPerPage = 10;

  // 🔄 Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      nprogress.start();
      const res = await getAllRitase();
      const dr = await getDriver();
      setData(res.ritase);
      setDriver(dr.drivers || []);
    } catch (err) {
      console.error("Gagal ambil data driver:", err);
    } finally {
      nprogress.complete();
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const normalizedData = Array.isArray(data) ? data : [];

  // 🕓 List jam 07:00 - 23:00
  const hours = Array.from({ length: 18 }, (_, i) => {
    const hour = 7 + i;
    const label = `${hour.toString().padStart(2, "0")}:00`;
    return { value: label, label };
  });

  // 🔍 Filtering data berdasarkan search, jam, dan tanggal
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
        const dataHour = dayjs(d.createdAt).tz("Asia/Jakarta").format("HH");
        const filterHour = timeFilter.split(":")[0];
        matchTime = dataHour === filterHour;
      }

      let matchDate = true;
      if (dateFilter && d?.createdAt) {
        const created = dayjs(d.createdAt).tz("Asia/Jakarta");
        const filterDate = dayjs(dateFilter).tz("Asia/Jakarta");
        matchDate =
          created.format("YYYY-MM-DD") === filterDate.format("YYYY-MM-DD");
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

  const platNo = driver?.map((item) => ({
    value: item.no_pol,
    label: item.no_pol,
  }));

  const excludeDate = (date) => {
    if (!exportDate[0]) return false;
    const start = dayjs(exportDate[0]);
    const diff = dayjs(date).diff(start, "day");
    return diff > 7 || diff < 0;
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
            onClick={() => setExportModal(true)}
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
              <Table.Th>ARGO</Table.Th>
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
                <Table.Td>{row.argo}</Table.Td>
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
                title="Screenshot Order"
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
           <Modal
  opened={exportModal}
  onClose={() => {
    setExportModal(false);
    setExportDate([null, null]);
  }}
  title="Export Laporan Ritase"
  size="md"
  centered
  radius="lg"
>
  <Box className="space-y-4">
    {/* Pilihan Mode Export */}
    <Select
      label="Mode Export"
      placeholder="Pilih mode export"
      value={exportMode}
      onChange={setExportMode}
      data={[
        { value: "single", label: "Satu Tanggal" },
        { value: "range", label: "Rentang Tanggal (maks. 7 hari)" },
      ]}
      required
    />

    {/* Date Picker */}
    {exportMode === "single" && (
      <DatePickerInput
        label="Pilih Tanggal"
        value={exportDate[0]}
        onChange={(value) => setExportDate([value, null])}
        placeholder="Pilih satu tanggal"
        locale="id"
        clearable
        size="md"
        className="w-full"
      />
    )} {exportMode === "range" && (
      <DatePickerInput
        type="range"
        label="Pilih Rentang Tanggal"
        value={exportDate}
        onChange={(value) => {
          if (value === false) {
            setExportDate([null, null]);
          } else {
            setExportDate(value);
          }
        }}
        placeholder="Pilih rentang tanggal (maks. 7 hari)"
        locale="id"
        clearable
        size="md"
        className="w-full"
        excludeDate={excludeDate}
      />
    )}

    <Group justify="flex-end" mt="md">
      <Button variant="light" onClick={() => setExportModal(false)}>
        Batal
      </Button>

      <Button
        color="green"
        onClick={async () => {
          if (!exportDate || (!exportDate[0] && !exportDate[1])) {
            notifications.show({
              title: "Peringatan",
              message: "Pilih tanggal terlebih dahulu",
              color: "red",
            });
            return;
          }

          // Validasi range maksimum 7 hari
          if (
            exportMode === "range" &&
            exportDate[0] &&
            exportDate[1] &&
            dayjs(exportDate[1]).diff(dayjs(exportDate[0]), "day") > 7
          ) {
            notifications.show({
              title: "Peringatan",
              message: "Rentang tanggal maksimal 7 hari.",
              color: "red",
            });
            return;
          }

          try {
            await downloadRitaseExcel(exportDate);
            notifications.show({
              title: "Berhasil",
              message: "Laporan berhasil diunduh",
              color: "green",
            });
            setExportModal(false);
            setExportDate([null, null]);
          } catch (err) {
            notifications.show({
              title: "Gagal",
              message:
                err.response?.data?.message ||
                "Terjadi kesalahan saat mengunduh laporan",
              color: "red",
            });
          }
        }}
      >
        Export
      </Button>
    </Group>
  </Box>
</Modal>



    </div>
  );
}
