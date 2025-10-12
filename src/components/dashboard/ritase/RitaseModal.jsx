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
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { Icon } from "@iconify/react";

export default function RitaseModal({ opened, onClose, data, onSubmit }) {
  const [preview, setPreview] = useState(null);

  const form = useForm({
    initialValues: {
      phone: "",
      name: "",
      plate: "",
      type: "",
      pickup: "",
      destination: "",
      ss: null,
    },
    validate: {
      phone: (value) =>
        value.trim().length < 8 ? "Nomor HP tidak valid" : null,
      name: (value) => (!value ? "Nama wajib diisi" : null),
      plate: (value) => (!value ? "Nomor polisi wajib diisi" : null),
      type: (value) => (!value ? "Jenis wajib dipilih" : null),
      pickup: (value) => (!value ? "Pickup point wajib diisi" : null),
      destination: (value) => (!value ? "Tujuan wajib diisi" : null),
    },
  });

  // Prefill form saat edit
  useEffect(() => {
    if (data) {
      form.setValues(data);
      if (data.ss) setPreview(data.ss);
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

  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset();
        setPreview(null);
        onClose();
      }}
      title={data ? "Ubah Data Ritase" : "Tambah Data Ritase"}
      centered
      size="lg"
      radius="lg"
    >
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Bagian Input Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:col-span-2">
            <TextInput label="No. HP" {...form.getInputProps("phone")} />
            <TextInput label="Nama" {...form.getInputProps("name")} />
            <TextInput label="No. Polisi" {...form.getInputProps("plate")} />
            <Select
              label="Jenis"
              data={["PREMIUM", "REGULER"]}
              {...form.getInputProps("type")}
            />
            <TextInput label="Pickup Point" {...form.getInputProps("pickup")} />
            <TextInput label="Tujuan" {...form.getInputProps("destination")} />
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
                    Klik atau tarik file bukti SS
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

        <Group position="center" mt="lg">
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
