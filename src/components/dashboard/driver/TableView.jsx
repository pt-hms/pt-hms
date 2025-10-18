"use client";

import { useEffect, useState, useMemo } from "react";
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
  ActionIcon,
} from "@mantine/core";
import { Icon } from "@iconify/react";
import DriverModal from "./DriverModal";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { exportToExcel } from "@/components/Export";
import { deleteDriver, getDriver } from "@/utils/api/driver";
import GlobalLoader from "@/components/GlobalLoader";
import { nprogress } from "@mantine/nprogress";
import { notifications } from "@mantine/notifications";


export default function TableView() {
  const [checkedRows, setCheckedRows] = useState([]);
  const [opened, setOpened] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [ssPreview, setSsPreview] = useState(null);
  const [page, setPage] = useState(1);
  const [showPassword, setShowPassword] = useState({});
  const [adminModalOpened, setAdminModalOpened] = useState(false);
  const [driverIdToShowPassword, setDriverIdToShowPassword] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  // Fetch data driver
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDriver();
      setData(res.drivers || []);
    } catch (err) {
      console.error("Gagal ambil data driver:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔍 Filtering data efisien dengan useMemo
  const filteredData = useMemo(() => {
    const query = search.toLowerCase();
    return data.filter(
      (d) =>
        d.no_pol?.toLowerCase().includes(query) ||
        d.nama?.toLowerCase().includes(query)
    );
  }, [search, data]);

  // Pagination efisien
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(
    () => filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [filteredData, page]
  );

  const toggleCheck = (id) => {
    setCheckedRows((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // 🔹 Password show/hide konfirmasi admin
  const handleOpenAdminModal = (id) => {
    if (showPassword[id]) {
      setShowPassword((prev) => ({ ...prev, [id]: false }));
    } else {
      setDriverIdToShowPassword(id);
      setAdminModalOpened(true);
    }
  };

  const handleAdminConfirm = (id) => {
    setShowPassword((prev) => ({ ...prev, [id]: true }));
    setDriverIdToShowPassword(null);
  };

  // ✅ Fungsi buka modal konfirmasi hapus
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
    nprogress.start();
    // Kirim array ID ke API
    const res = await deleteDriver(idArray);
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
   
  } catch (error) {
    console.error(error);
          notifications.show({
            title: "Gagal",
            message: error.response?.data?.message || "Terjadi Kesalahan Saat Mengunggah Gambar",
            color: "red",
          });
          nprogress.complete();
  } finally {
     setCheckedRows([]);
    modals.closeAll();
    await fetchData();
    nprogress.complete()
  }
};



  const handleModalSubmit = async () => {
    await fetchData();
  };

  const headers = {
    id: "No",
    nama: "Nama Driver",
    no_pol: "Plat Nomor",
    kategori: "Kategori Driver",
    mobil: "Mobil",
    no_kep: "Nomor KEP",
    exp_kep: "Masa Berakhir KEP",
    no_hp: "No Telepon",
    no_darurat: "No Telepon Darurat",
    password: "Password Driver",
    foto_profil: "Foto Profil",
  };

  
  return (
    <div className="w-full relative">
      {/* 🔹 Header & Filter */}
      <Group justify="space-between" className="p-4 flex-wrap gap-3">
        <TextInput
          placeholder="Cari driver..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          leftSection={<Icon icon="mdi:magnify" />}
          className="w-full lg:w-1/3"
        />
        <Group>
          <Button
            color="yellow"
            leftSection={<Icon icon="mdi:download" />}
            onClick={() =>
              exportToExcel(filteredData, "Driver PT HMS.xlsx", headers)
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

      {/* 🔹 Tabel Data */}
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
          <Table.Thead>
            <Table.Tr className="bg-gray-50">
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
              <Table.Th>PLAT</Table.Th>
              <Table.Th>MOBIL</Table.Th>
              <Table.Th>KATEGORI</Table.Th>
              <Table.Th>NO KEP</Table.Th>
              <Table.Th>MASA BERLAKU</Table.Th>
              <Table.Th>NO TELP</Table.Th>
              <Table.Th>NO DARURAT</Table.Th>
              <Table.Th>PASSWORD</Table.Th>
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
                <Table.Td>{row.nama || "-"}</Table.Td>
                <Table.Td>{row.no_pol || "-"}</Table.Td>
                <Table.Td>{row.mobil || "-"}</Table.Td>
                <Table.Td>
                  <Badge
                    color={row.kategori === "PREMIUM" ? "red" : "gray"}
                    fullWidth
                    size="md"
                  >
                    {row.kategori || "-"}
                  </Badge>
                </Table.Td>
                <Table.Td>{row.no_kep || "-"}</Table.Td>
                <Table.Td>
                  {row.exp_kep
                    ? dayjs(row.exp_kep).locale("id").format("D MMMM YYYY")
                    : "-"}
                </Table.Td>
                <Table.Td>{row.no_hp || "-"}</Table.Td>
                <Table.Td>{row.no_darurat || "-"}</Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="center">
                    <Text>
                      {showPassword[row.id] ? row.password : "••••••"}
                    </Text>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={() => handleOpenAdminModal(row.id)}
                    >
                      <Icon
                        icon={
                          showPassword[row.id]
                            ? "mdi:eye-off-outline"
                            : "mdi:eye-outline"
                        }
                        width={18}
                      />
                    </ActionIcon>
                  </Group>
                </Table.Td>
                <Table.Td className="text-center">
                  <Group justify="center" gap="xs">
                    <Button
                      variant="subtle"
                      color="green"
                      radius="xl"
                      size="xs"
                      onClick={() =>
                        row.foto_profil
                          ? setSsPreview(
                              typeof row.foto_profil === "string"
                                ? row.foto_profil
                                : URL.createObjectURL(row.foto_profil)
                            )
                          : alert("Foto Profil belum tersedia")
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

        {/* 🔹 Pagination */}
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

      {/* Modal Tambah/Edit Driver */}
      <DriverModal
        opened={opened}
        onClose={() => setOpened(false)}
        data={editData}
        onSubmit={fetchData} // ✅ langsung panggil fetchData
        type="form"
      />

      {/* Modal Foto Profil */}
      <Modal
        opened={!!ssPreview}
        onClose={() => setSsPreview(null)}
        title="Foto Driver"
        size="md"
        centered
        radius="lg"
      >
        {ssPreview ? (
          <Image src={ssPreview} alt="Foto Driver" width="100%" radius="md" />
        ) : (
          <Text c="dimmed" ta="center">
            Tidak ada gambar untuk ditampilkan.
          </Text>
        )}
      </Modal>

      {/* Modal Konfirmasi Admin */}
      {driverIdToShowPassword && (
        <DriverModal
          opened={adminModalOpened}
          onClose={() => setAdminModalOpened(false)}
          onConfirm={handleAdminConfirm}
          driverId={driverIdToShowPassword}
          type="confirm_admin"
        />
      )}
    </div>
  );
}
