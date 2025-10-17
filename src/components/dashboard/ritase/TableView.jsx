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
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { Icon } from "@iconify/react";
import RitaseModal from "./RitaseModal";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { exportToExcel } from "@/components/Export";
import { getSIJ } from "@/utils/api/sij";
import { deleteRitase, getAllRitase } from "@/utils/api/ritase";

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


   const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;
  
    // Fetch data driver
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



  // 🔹 Normalisasi data agar aman

  const normalizedData = Array.isArray(data)

    ? data

    : Array.isArray(data)

    ? data

    : [];


  // 🔹 Jam filter (07:00 - 23:00)

  const hours = Array.from({ length: 18 }, (_, i) => {

    const hour = 7 + i;

    const label = `${hour.toString().padStart(2, "0")}:00`;

    return { value: label, label };

  });



  // 🔍 Filtering

    // 🔍 Filtering (search + time)
  useEffect(() => {
    const searchText = search.toLowerCase().trim();

    const filtered = data?.filter((d) => {
      const nama = d?.user?.nama?.toLowerCase() || "";
      const plat = d?.user?.no_pol?.toLowerCase() || "";
      const pickup = d?.pickup_point?.toLowerCase() || "";
      const tujuan = d?.tujuan?.toLowerCase() || "";

      // Filter berdasarkan teks pencarian
      const matchSearch =
        nama.includes(searchText) ||
        plat.includes(searchText) ||
        pickup.includes(searchText) ||
        tujuan.includes(searchText);

      // Filter berdasarkan jam (HH:mm)
      let matchTime = true;
      if (timeFilter && d?.createdAt) {
        const dataHour = dayjs(d.createdAt).format("HH");
        const filterHour = timeFilter.split(":")[0]; // ambil "07" dari "07:00"
        matchTime = dataHour === filterHour;
      }

      return matchSearch && matchTime;
    });

    setFilteredData(filtered);
    setPage(1);
  }, [search, timeFilter, data]);

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const paginatedData = filteredData?.slice(

    (page - 1) * itemsPerPage,

    page * itemsPerPage

  );
  
  // 🔹 Checkbox
  const toggleCheck = (id) => {
    setCheckedRows((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleShowDetail = (row) => {
    if (selectedRow && selectedRow.id === row.id) setSelectedRow(null);
    else setSelectedRow(row);
  };

  const handleSubmit = async () => {
  await fetchData(); // refresh tabel setelah create/update
  setOpened(false);
};


  // 🔹 Edit
  const handleEdit = (row) => {
    setEditData(row);
    setOpened(true);
  };

  // 🔹 Hapus
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
  
  // ✅ Fungsi delete (tanpa alert)
  const handleDelete = async (ids) => {
    try {
      const idArray = Array.isArray(ids) ? ids : [ids];
      console.log("Menghapus ID:", idArray);
  
      // Kirim array ID ke API
      await deleteRitase(idArray);
  
      // Update tampilan tanpa fetch ulang
      setData((prev) =>
        prev.filter((item) => !idArray.includes(String(item.id)))
      );

       notifications.show({
                title: "Berhasil",
                message: res.message || "Berhasil menghapus data",
                color: "green",
              });
  
      // Tutup modal dan reset
      setCheckedRows([]);
      modals.closeAll();
      await fetchData();
    } catch (error) {
      console.error(error);
              notifications.show({
                title: "Gagal",
                message: error.response?.data?.message || "Terjadi Kesalahan Saat Mengunggah Gambar",
                color: "red",
              });
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

  // 🔹 View SS
  const handleSSView = (ssUrl) => {
    if (ssUrl) {
      setSsPreview(ssUrl);
    } else {
      modals.open({
        title: "Bukti SS Belum Tersedia",
        children: (
          <Text size="sm">
            Bukti <i>screenshot</i> untuk ritase ini belum diunggah.
          </Text>
        ),
      });
    }
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
          className="w-full lg:w-1/3"
        />
        <Select
          placeholder="Filter Jam"
          value={timeFilter}
          onChange={setTimeFilter}
          data={hours}
          className="w-full lg:w-40"
        />
        <Group>
          {checkedRows.length > 0 && (
            <Button
              color="red"
              leftSection={<Icon icon="mdi:trash-can" />}
              onClick={() => openDeleteConfirm(checkedRows)}
            >
              Hapus ({checkedRows.length})
            </Button>
          )}
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

      {/* 🔹 Table */}
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
                        prev.filter((id) => !paginatedData.map((d) => d.id).includes(id))
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
                <Table.Td>{row.user.nama}</Table.Td>
                <Table.Td>{row.user.no_pol}</Table.Td>
                <Table.Td>
                  <Badge color={row.user.kategori === "PREMIUM" ? "#e10b16" : "gray"} fullWidth size="md">{row.user.kategori}</Badge>
                </Table.Td>
                <Table.Td>{row.pickup_point}</Table.Td>
                <Table.Td>{row.tujuan}</Table.Td>
                <Table.Td>{dayjs(row.createdAt).locale("id").format("HH:mm") || "-"}</Table.Td>
                <Table.Td>
                  {row.createdAt
                    ? dayjs(row.createdAt).locale("id").format("D MMMM YYYY")
                    : "-"}
                </Table.Td>
                <Table.Td className="text-center">
                  <Group justify="center" gap="xs">
                    <Button
                      variant="subtle"
                      color="green"
                      radius="xl"
                      size="xs"
                      onClick={() =>
                        row.ss_order
                          ? setSsPreview(
                              typeof row.ss_order === "string"
                                ? row.ss_order
                                : URL.createObjectURL(row.ss_order)
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

      {selectedRow && (
        <Box className="p-4 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between sticky bottom-0 w-full">
          <Text size="sm" className="text-gray-700">
            Data Driver Terpilih dengan Plat Nomor:{" "}
            <span className="font-semibold">{selectedRow.user.no_pol}</span>
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
