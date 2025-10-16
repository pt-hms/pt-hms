"use client";
import { useEffect, useState } from "react";
import {
  Modal,
  TextInput,
  Select,
  Button,
  Group,
  Box,
  Image,
  PasswordInput,
  Text,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { Icon } from "@iconify/react";
import { DateInput } from "@mantine/dates";
import { createDriver, updateDriver } from "@/utils/api/driver";

// password admin
const ADMIN_SECRET_PASSWORD = "12345678"; // Pastikan ini sudah benar


function PasswordChecker({ opened, onClose, onConfirm, driverId }) {
  const [error, setError] = useState(null);

  const form = useForm({
    initialValues: {
      adminPassword: "",
    },
    // Blok validate dikosongkan karena validasi dilakukan di handleSubmit
  });
  
  // Fungsi yang membersihkan state saat modal ditutup atau dibatalkan
  const handleCloseClean = () => {
    form.reset();
    setError(null); // Reset error saat modal ditutup
    onClose();
  }

  const handleSubmit = (values) => {
    // 1. Reset error sebelumnya sebelum mencoba lagi
    setError(null);
    
    if (values.adminPassword === ADMIN_SECRET_PASSWORD) {
      // JALUR SUKSES: Panggil onConfirm dan tutup modal
      onConfirm(driverId); 
      handleCloseClean();
    } else {
      // JALUR GAGAL: Set error
      setError("Password Admin salah! Silakan coba lagi.");
      // Opsional: Hapus input password agar pengguna mengetik ulang
      form.setFieldValue('adminPassword', '');
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCloseClean} // Gunakan fungsi penutup yang bersih
      title="Konfirmasi Admin"
      centered
      size="sm"
      radius="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <PasswordInput
          label="Masukkan Password Admin"
          placeholder="Password Admin"
          // PERBAIKAN KRUSIAL: Manual menghubungkan value dan onChange
          value={form.values.adminPassword}
          onChange={(event) => {
            // Hapus error saat pengguna mulai mengetik
            if (error) setError(null);
            form.setFieldValue('adminPassword', event.currentTarget.value);
          }}
          // Sekarang, properti 'error' HANYA mengambil dari state lokal 'error'
          error={error} 
          autoFocus
        />

        <Group justify="flex-end" mt="md">
          <Button
            variant="light"
            color="red"
            onClick={handleCloseClean}
          >
            Batal
          </Button>
          <Button type="submit" color="blue">
            Konfirmasi
          </Button>
        </Group>
      </form>
    </Modal>
  );
}



function DriverFormModal({ opened, onClose, data, onSubmit }) {
  const [preview, setPreview] = useState(null);
  const form = useForm({
    initialValues: {
      nama: "",
      no_pol: "",
      kategori: "",
      mobil: "",
      no_kep: "",
      exp_kep: null,
      no_hp: "",
      no_darurat: "",
      password: "",
      foto_profil: null,
    },
    validate: {
      nama: (value) => (!value.trim() ? "Nama wajib diisi" : null),
      no_pol: (value) => (!value.trim() ? "Plat nomor wajib diisi" : null),
      kategori: (value) => (!value.trim() ? "Kategori driver wajib diisi" : null),
      mobil: (value) => (!value.trim() ? "Nama mobil wajib diisi" : null),
      no_kep: (value) => (!value.trim() ? "Nomor KEP wajib diisi" : null),
      exp_kep: (value) => (!value ? "Tanggal berlaku kartu wajib diisi" : null),
      no_hp: (value) => {
        const trimmed = value.trim();
        if (!trimmed) return "Nomor telepon wajib diisi";
        if (!/^[0-9]+$/.test(trimmed)) {
          return "Nomor telepon hanya boleh berisi angka";
        }
        if (trimmed.length < 10 || trimmed.length > 15) {
          return "Nomor telepon harus 10–15 digit";
        }
        return null;
      },
      no_darurat: (value) => {
        const trimmed = value.trim();
        if (!trimmed) return "Nomor telepon wajib diisi";
        if (!/^[0-9]+$/.test(trimmed)) {
          return "Nomor telepon hanya boleh berisi angka";
        }
        if (trimmed.length < 10 || trimmed.length > 15) {
          return "Nomor telepon harus 10–15 digit";
        }
        return null;
      },
      password: (value) =>
        (!data && !value.trim()) 
          ? "Password wajib diisi"
          : (value.trim().length > 0 && value.trim().length < 6)
          ? "Password minimal 6 karakter"
          : null,
    },
  });

  useEffect(() => {
  if (opened && data) {
    form.setValues(data);
    if (data.foto_profil) setPreview(data.foto_profil);
  } else if (opened && !data) {
    form.reset();
    setPreview(null);
  }
}, [data, opened]);

  
  

 // di DriverFormModal
const handleSubmit = async (values) => {
  try {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof File) formData.append(key, value);
      else if (value !== null && value !== undefined)
        formData.append(key, value);
    });

    if (data) await updateDriver(data.id, formData);
    else await createDriver(formData);

    // ✅ panggil callback untuk refresh
    if (onSubmit) await onSubmit();

    notifications.show({
      title: data ? "Data Diperbarui" : "Driver Ditambahkan",
      message: "Data driver berhasil disimpan.",
      color: "green",
    });

  } catch (err) {
    notifications.show({
      title: "Gagal Menyimpan Data",
      message: err.response?.data?.message || "Terjadi kesalahan.",
      color: "red",
    });
  } finally {
    form.reset();
    setPreview(null);
    onClose();
  }
};


  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset();
        setPreview(null);
        onClose();
      }}
      title={data ? "Ubah Data Driver" : "Tambah Data Driver"}
      centered
      size="lg"
      radius="lg"
    >
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:col-span-2">
            <TextInput label="Nama Lengkap Driver" {...form.getInputProps("nama")} />
            <TextInput label="Plat Nomor" {...form.getInputProps("no_pol")} />
            <Select
              label="Kategori Driver"
              placeholder="Pilih kategori"
              data={[
                { value: "Premium", label: "PREMIUM" },
                { value: "Reguler", label: "REGULER" },
              ]}
              {...form.getInputProps("kategori")}
            />

            <TextInput label="Mobil" {...form.getInputProps("mobil")} />
            <TextInput label="Nomor KEP" {...form.getInputProps("no_kep")} />
            <DateInput
              label="Tanggal Berakhir KEP"
              locale="id"
              valueFormat="DD MMMM YYYY"
              {...form.getInputProps("exp_kep")}
            />
            <TextInput label="No Telepon" {...form.getInputProps("no_hp")} />
            <TextInput label="No Telepon Darurat" {...form.getInputProps("no_darurat")} />
            
            <PasswordInput 
                label="Password" 
                placeholder={data ? "Kosongkan jika tidak diubah" : "Masukkan password"}
                {...form.getInputProps("password")} 
            />
          </div>

          {/* Dropzone dengan Preview */}
          <div className="flex flex-col items-center justify-center gap-3">
            <Dropzone
              accept={IMAGE_MIME_TYPE}
              multiple={false}
              onDrop={(files) => {
                const file = files[0];
                if (file) {
                  form.setFieldValue("foto_profil", file); 
                  setPreview(URL.createObjectURL(file));
                }
              }}
              onReject={() => alert("File tidak valid, pilih gambar PNG/JPG")}
              className="w-full h-[240px] border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center overflow-hidden cursor-pointer hover:bg-gray-50 transition relative"
            >
              {!preview && (
                <div className="flex flex-col items-center text-center text-gray-600">
                  <Icon
                    icon="mdi:cloud-upload-outline"
                    width={50}
                    height={50}
                    color="#1c7ed6"
                  />
                  <p className="mt-2 text-sm font-medium">
                    Klik atau tarik foto driver
                  </p>
                  <p className="text-xs text-gray-400">
                    (Hanya PNG atau JPG, rasio layar HP disarankan)
                  </p>
                </div>
              )}

              {preview && (
                <Image
                  src={preview}
                  alt="Preview Profil"
                  width="100%"
                  height="100%"
                  fit="cover"
                  className="object-cover"
                />
              )}
            </Dropzone>

            {preview && (
              <Button
                size="xs"
                variant="light"
                color="red"
                onClick={() => {
                  setPreview(null);
                  form.setFieldValue("foto_profil", null);
                }}
              >
                Hapus Gambar
              </Button>
            )}
          </div>
        </div>

        <Group className="w-full mx-auto" mt="lg">
          <Button
            color="red"
            variant="light"
            onClick={() => {
              form.reset();
              setPreview(null);
              onClose();
            }}
          >
            Batal
          </Button>
          <Button type="submit" color="blue">
            Simpan
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}


export default function DriverModal(props) {
    if (props.type === 'confirm_admin') {
        return <PasswordChecker {...props} />;
    }
    return <DriverFormModal {...props} />;
}