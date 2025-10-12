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
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { Icon } from "@iconify/react";
import { DateInput } from "@mantine/dates";

export default function DriverModal({ opened, onClose, data, plat, onSubmit }) {
  const [preview, setPreview] = useState(null);
  const form = useForm({
    initialValues: {
       name: "",
            plate: "",
            category: "",
            car: "",
            kep_number: "",
            period: null,
            phone: "",
            emergency_phone: "",
            password: "",
            profile: null,
        },
        validate: {
            name: (value) => (!value.trim() ? "Nama wajib diisi" : null),
            plat: (value) => (!value.trim() ? "Plat nomor wajib diisi" : null),
            category: (value) => (!value.trim() ? "Kategori driver wajib diisi" : null),
            car: (value) => (!value.trim() ? "Nama mobil wajib diisi" : null),
            kep_number: (value) => (!value.trim() ? "Nomor KEP wajib diisi" : null),
            period: (value) => (!value ? "Tanggal berlaku kartu wajib diisi" : null),
            phone: (value) => {
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
            emergency_phone: (value) => {
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
                !value.trim()
                    ? "Password wajib diisi"
                    : value.trim().length < 6
                        ? "Password minimal 6 karakter"
                        : null
    },
  });

  // Prefill form saat edit
  useEffect(() => {
    if (data) {
      form.setValues(data);
      if (data.profile) setPreview(data.profile);
    } else {
      form.reset();
      setPreview(null);
    }
  }, [data]);

  const handleSubmit = (values) => {
    onSubmit(values);
    form.reset();
    setPreview(null);
    onClose();
  };

//   console.log(allData);
  

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
          {/* Bagian Input Data */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:col-span-2">
            <TextInput label="Nama Lengkap Driver" {...form.getInputProps("name")} />
            <TextInput label="Plat Nomor" {...form.getInputProps("plate")} />
            <Select
              label="Kategori Driver"
              placeholder="Pilih kategori"
              data={[
                { value: "PREMIUM", label: "Premium" },
                { value: "REGULER", label: "Reguler" },
              ]}
              {...form.getInputProps("category")} // pastikan ambil dari field "type"
            />

            <TextInput label="Nomor KEP" {...form.getInputProps("kep_number")} />
             <DateInput
                label="Tanggal Berakhir KEP"
                locale="id"
                valueFormat="DD MMMM YYYY"
                {...form.getInputProps("period")}
              />
            <TextInput label="No Telepon" {...form.getInputProps("phone")} />
            <TextInput label="No Telepon Darurat" {...form.getInputProps("emergency_phone")} />
            <PasswordInput label="Password" {...form.getInputProps("password")} />
          </div>

          {/* Dropzone dengan Preview */}
          <div className="flex flex-col items-center justify-center gap-3">
            <Dropzone
              accept={IMAGE_MIME_TYPE}
              multiple={false}
              onDrop={(files) => {
                const file = files[0];
                if (file) {
                  form.setFieldValue("ss", file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
              onReject={() => alert("File tidak valid, pilih gambar PNG/JPG")}
              className="w-full h-[240px] border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center overflow-hidden cursor-pointer hover:bg-gray-50 transition relative"
            >
              {/* Jika belum ada gambar */}
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

              {/* Jika sudah ada preview */}
              {preview && (
                <Image
                  src={preview}
                  alt="Preview SS"
                  width="100%"
                  height="100%"
                  fit="cover"
                  className="object-cover"
                />
              )}
            </Dropzone>

            {/* Tombol ganti file kalau sudah ada preview */}
            {preview && (
              <Button
                size="xs"
                variant="light"
                color="red"
                onClick={() => {
                  setPreview(null);
                  form.setFieldValue("ss", null);
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
