"use client";
import { useEffect, useMemo, useState } from "react";
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
import { DateTimePicker } from "@mantine/dates";

export default function RitaseModal({ opened, onClose, data, plat, onSubmit }) {
  const [preview, setPreview] = useState(null);
  const [selectedUserImg, setSelectedUserImg] = useState(null);

  const form = useForm({
    initialValues: {
      plate: "",
      pickup: "",
      destination: "",
      datetime: null,
      ss: null,
    },
    validate: {
      plate: (v) => (!v ? "Nomor polisi wajib diisi" : null),
      datetime: (v) => (!v ? "Tanggal & waktu wajib diisi" : null),
    },
  });

  // Prefill saat edit
  useEffect(() => {
    if (data) {
      form.setValues({
        plate: data.user?.no_pol || data.plate || "",
        pickup: data.pickup_point || "",
        destination: data.tujuan || "",
        datetime: data.createdAt ? new Date(data.createdAt) : null,
        ss: null,
      });

      if (data.ss_order) {
        setPreview(data.ss_order);
      } else if (data.user?.foto_profil) {
        setPreview(data.user.foto_profil);
      } else {
        setPreview(null);
      }
    } else {
      form.reset();
      setPreview(null);
      setSelectedUserImg(null);
    }
  }, [data]);

  const handleSubmit = (values) => {
    onSubmit(values);
    form.reset();
    setPreview(null);
    setSelectedUserImg(null);
    onClose();
  };

  // 🔄 Filter plat unik
  const availablePlates = useMemo(() => {
    const unique = plat.filter(
      (p, i, self) => i === self.findIndex((x) => x.value === p.value)
    );
    return unique;
  }, [plat]);

  // 🔄 Update foto profil berdasarkan plat
  useEffect(() => {
    const selected = plat.find((p) => p.value === form.values.plate);
    if (selected && selected.user?.foto_profil) {
      setSelectedUserImg(selected.user.foto_profil);
      if (!preview) setPreview(selected.user.foto_profil);
    } else if (!form.values.plate) {
      setSelectedUserImg(null);
      setPreview(null);
    }
  }, [form.values.plate]);

  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset();
        setPreview(null);
        setSelectedUserImg(null);
        onClose();
      }}
      title={data ? "Ubah Data Ritase" : "Tambah Data Ritase"}
      centered
      size="lg"
      radius="lg"
    >
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Bagian Input */}
          <div className="grid grid-cols-1 gap-3 lg:col-span-2">
            <Select
              label="Plat Nomor"
              placeholder="Pilih plat..."
              data={availablePlates}
              {...form.getInputProps("plate")}
            />

            {/* Field pickup & tujuan hanya muncul saat edit */}
            {data && (
              <>
                <TextInput
                  label="Pickup Point"
                  placeholder="Masukkan pickup point"
                  {...form.getInputProps("pickup")}
                />
                <TextInput
                  label="Tujuan"
                  placeholder="Masukkan tujuan"
                  {...form.getInputProps("destination")}
                />
              </>
            )}

            <DateTimePicker
              label="Tanggal & Waktu"
              placeholder="Pilih tanggal dan jam"
              valueFormat="DD MMM YYYY, HH:mm"
              locale="id"
              {...form.getInputProps("datetime")}
            />
          </div>

          {/* Dropzone + Preview */}
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
              {!preview ? (
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
              ) : (
                <Image
                  src={preview}
                  alt="Preview Gambar"
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
                  setPreview(selectedUserImg || null);
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
              setSelectedUserImg(null);
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