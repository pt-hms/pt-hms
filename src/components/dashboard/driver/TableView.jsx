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
  ActionIcon,
} from "@mantine/core";
import { Icon } from "@iconify/react";
import DriverModal from "./DriverModal";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { exportToExcel } from "@/components/Export";

export default function TableView({ data }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [opened, setOpened] = useState(false); // untuk Modal Form (Tambah/Edit)
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [ssPreview, setSsPreview] = useState(null);
  const [page, setPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);
  const [showPassword, setShowPassword] = useState({});
  const itemsPerPage = 10;

  // State untuk Modal Konfirmasi Password Admin
  const [adminModalOpened, setAdminModalOpened] = useState(false);
  const [driverIdToShowPassword, setDriverIdToShowPassword] = useState(null); 

  useEffect(() => {
    setFilteredData(
      data.filter(
        (d) =>
          d.no_pol.toLowerCase().includes(search.toLowerCase()) ||
          d.nama.toLowerCase().includes(search.toLowerCase())
      )
    );
    setPage(1); 
  }, [search, data]);

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

  const handleShowDetail = (row) => {
    if (selectedRow && selectedRow.id === row.id) setSelectedRow(null);
    else setSelectedRow(row);
  };

  const handleSubmit = (form) => {
    if (editData) console.log("Update data:", form);
    else console.log("Create data:", form);
  };

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

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

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

  // FUNGSI: Buka modal konfirmasi admin
  const handleOpenAdminModal = (id) => {
    // Jika password sedang terlihat, klik berarti menyembunyikan
    if (showPassword[id]) {
        setShowPassword((prev) => ({ ...prev, [id]: false }));
    } else {
        // Jika belum terlihat, buka modal konfirmasi
        setDriverIdToShowPassword(id);
        setAdminModalOpened(true);
    }
  };

  // FUNGSI: Tampilkan password setelah konfirmasi berhasil
  const handleAdminConfirm = (id) => {
    setShowPassword((prev) => ({ ...prev, [id]: true }));
    setDriverIdToShowPassword(null);
  };

  // Cari data driver yang akan ditampilkan passwordnya (gunakan data asli)
  const driverToConfirm = driverIdToShowPassword 
    ? data.find(d => d.id === driverIdToShowPassword)
    : null;

    function dateFormat(date) {
        const tanggalLokal = dayjs(date).tz("Asia/Jakarta").format("DD MM YYYY");
        return tanggalLokal
      }

  return (
    <div className="w-full relative">
      {/* 🔍 Header Atas */}
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
          <Table.Thead>
          <Table.Tr className="bg-gray-50">
              <Table.Th>
                <Checkbox
                  checked={
                    paginatedData.length > 0 &&
                    paginatedData.every((row) => checkedRows.includes(row.id))
                  }
                  indeterminate={
                    paginatedData.some((row) =>
                      checkedRows.includes(row.id)
                    ) &&
                    !paginatedData.every((row) =>
                      checkedRows.includes(row.id)
                    )
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
              <Table.Th>MOBIL</Table.Th>
              <Table.Th>JENIS</Table.Th>
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
              <Table.Tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <Table.Td>
                  <Checkbox
                    checked={checkedRows.includes(row.id)}
                    onChange={() => toggleCheck(row.id)}
                  />
                </Table.Td>
                <Table.Td>{row.nama}</Table.Td>
                <Table.Td>{row.no_pol}</Table.Td>
                <Table.Td>{row.mobil}</Table.Td>
                <Table.Td>
                  <Badge
                    color={row.kategori == "PREMIUM" ? "red" : "gray"}
                    fullWidth
                    size="md"
                  >
                    {row.kategori}
                  </Badge>
                </Table.Td>
                <Table.Td>{row.no_kep}</Table.Td>
                <Table.Td>
                  {row.exp_kep
                    ? dayjs(row.exp_kep).locale("id").format("D MMMM YYYY")
                    : "-"}
                </Table.Td>
                <Table.Td>{row.no_hp}</Table.Td>
                <Table.Td>{row.no_darurat}</Table.Td>

                {/* Password column dengan modal konfirmasi */}
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

        {/* Modal Tambah/Edit Driver */}
        <DriverModal
          opened={opened}
          onClose={() => setOpened(false)}
          data={editData}
          onSubmit={handleSubmit}
          type="form" 
        />

        {/* Modal Preview Foto Driver */}
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
      </Box>
      
      {/* Modal Konfirmasi Password Admin */}
      {driverToConfirm && (
        <DriverModal
          opened={adminModalOpened}
          onClose={() => setAdminModalOpened(false)}
          onConfirm={handleAdminConfirm} 
          driverId={driverIdToShowPassword}
          type="confirm_admin" 
        />
      )}

      {/* Detail Panel */}
      {selectedRow && (
        <Box className="p-4 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between sticky bottom-0 w-full">
          <Text size="sm" className="text-gray-700">
            Data Driver Terpilih dengan Plat Nomor:{" "}
            <span className="font-semibold">{selectedRow.no_pol}</span>
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