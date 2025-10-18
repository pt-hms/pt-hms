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
import { notifications } from "@mantine/notifications";
import { DateTimePicker } from "@mantine/dates";
import { createRitase, updateRitase } from "@/utils/api/ritase";
import dayjs from "dayjs";
import { nprogress } from "@mantine/nprogress";

export default function RitaseModal({ opened, onClose, data, plat, onSubmit }) {
  const [preview, setPreview] = useState(null);
  const [selectedUserImg, setSelectedUserImg] = useState(null);

  const form = useForm({
    initialValues: {
      no_pol: "",
      tanggal_jam: null,
      ss_order: null,
      argo: "",
      pickup_point: "",
      tujuan: "",
    },
    validate: {
      no_pol: (v) => (!v ? "Nomor polisi wajib diisi" : null),
      tanggal_jam: (v) => (!data && !v ? "Tanggal & waktu wajib diisi" : null),
    },
  });

  // Prefill saat edit
  useEffect(() => {
    if (opened && data) {
      form.setValues({
        no_pol: data.user?.no_pol || data.no_pol || "",
        argo: data.argo || "",
        pickup_point: data.pickup_point || "",
        tujuan: data.tujuan || "",
        tanggal_jam: data.createdAt ? new Date(data.createdAt) : null,
        ss_order: data.ss_order,
      });
      if (data.ss_order) setPreview(data.ss_order);
    } else {
      form.reset();
      setPreview(null);
      setSelectedUserImg(null);
    }
  }, [data,opened]);

  console.log(data);
  console.log(form.values);

  const handleSubmit = async (values) => {
    try {
      nprogress.start();
      const formData = new FormData();

      // Jika sedang EDIT → hanya kirim field no_pol, pickup, tujuan
      if (data) {
        formData.append("no_pol", values.no_pol);
        formData.append("pickup_point", values.pickup_point);
        formData.append("tujuan", values.tujuan);
        if (values.tanggal_jam) {
          const isoDate = dayjs(values.tanggal_jam).toISOString();
          formData.append("tanggal_jam", isoDate);
        }
        await updateRitase(data.id, formData);
      }
      // Jika sedang TAMBAH → kirim semua field
      else {
        formData.append("no_pol", values.no_pol);

        if (values.tanggal_jam) {
          const isoDate = dayjs(values.tanggal_jam).toISOString();
          formData.append("tanggal_jam", isoDate);
        }

        if (values.ss_order instanceof File) {
          formData.append("ss_order", values.ss_order);
        }

        await createRitase(formData);
      }

      if (onSubmit) await onSubmit(); // refresh tabel

      notifications.show({
        title: data ? "Data Diperbarui" : "Ritase Ditambahkan",
        message: "Data ritase berhasil disimpan.",
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
      nprogress.complete()
    }
  };

  // 🔄 Filter plat unik
  const availablePlates = useMemo(() => {
    const unique = plat.filter(
      (p, i, self) => i === self.findIndex((x) => x.value === p.value)
    );
    return unique;
  }, [plat]);

  // 🔄 Update foto profil berdasarkan plat
  // useEffect(() => {
  //   const selected = plat.find((p) => p.value === form.values.no_pol);
  //   if (selected && selected.user?.foto_profil) {
  //     setSelectedUserImg(selected.user.foto_profil);
  //     if (!preview) setPreview(selected.user.foto_profil);
  //   } else if (!form.values.no_pol) {
  //     setSelectedUserImg(null);
  //     setPreview(null);
  //   }
  // }, [form.values.no_pol]);

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
              {...form.getInputProps("no_pol")}
            />

            {/* Field pickup & tujuan hanya muncul saat edit */}
            {data && (
              <>
                <TextInput
                  label="Argo"
                  placeholder="Masukkan argo"
                  {...form.getInputProps("argo")}
                />
                <TextInput
                  label="Pickup Point"
                  placeholder="Masukkan pickup point"
                  {...form.getInputProps("pickup_point")}
                />
                <TextInput
                  label="Tujuan"
                  placeholder="Masukkan tujuan"
                  {...form.getInputProps("tujuan")}
                />
              </>
            )}

            {/* Field tanggal hanya muncul saat tambah */}
              <DateTimePicker
                label="Tanggal & Waktu"
                placeholder="Pilih tanggal dan jam"
                valueFormat="DD MMM YYYY, HH:mm"
                locale="id"
                {...form.getInputProps("tanggal_jam")}
              />
          </div>

          {/* Dropzone + Preview */}
          {!data ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                multiple={false}
                onDrop={(files) => {
                  const file = files[0];
                  if (file) {
                    form.setFieldValue("ss_order", file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                onReject={() =>
                  notifications.show({
                    title: "Gagal Upload",
                    message: "File tidak valid, pilih gambar PNG/JPG",
                    color: "red",
                  })
                }
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
                    setPreview(null);
                    form.setFieldValue("ss_order", null);
                  }}
                >
                  Hapus Gambar
                </Button>
              )}
            </div>
          ):  <Image
                    src={preview}
                    alt="Preview Gambar"
                    width="100%"
                    height="100%"
                    fit="cover"
                    className="object-cover"
                  />}
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
