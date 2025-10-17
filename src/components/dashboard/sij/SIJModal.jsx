"use client";
import { useEffect, useState } from "react";
import {
  Modal,
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
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id";
import { nprogress } from "@mantine/nprogress";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function SIJModal({ opened, onClose, data, plat, onSubmit }) {
  const [preview, setPreview] = useState(null);

  const form = useForm({
    initialValues: {
      no_pol: "",
      datetime: null, // gabungan tanggal dan jam
      bukti_tf: null,
    },
    validate: {
      no_pol: (value) => (!value ? "Nomor polisi wajib diisi" : null),
      datetime: (value) => (!value ? "Tanggal & jam wajib diisi" : null),
    },
  });

  // Prefill form saat edit
  useEffect(() => {
    if (data) {
      if (data.createdAt) {
        const dtLocal = dayjs(data.createdAt).tz(dayjs.tz.guess());
        form.setValues({
          no_pol: data.no_pol || "",
          datetime: dtLocal.toDate(),
          bukti_tf: data.bukti_tf || null,
        });
      } else {
        form.setValues({
          no_pol: data.no_pol || "",
          datetime: null,
          bukti_tf: data.bukti_tf || null,
        });
      }
      if (data.bukti_tf) setPreview(data.bukti_tf);
    } else {
      form.reset();
      setPreview(null);
    }
  }, [data]);

  console.log(form);
  

  const handleSubmit = (values) => {
    try {
      nprogress.start();
      const createdAt = new Date(values.datetime).toISOString();

      const payload = {
        no_pol: values.no_pol,
        bukti_tf: values.bukti_tf,
        createdAt,
      };

      onSubmit({ payload });

      
    } catch (error) {
      console.error("Gagal memproses tanggal & jam:", error);
    } finally {
      form.reset();
      setPreview(null);
      onClose();
      nprogress.complete()
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
      title={data ? `Ubah Data SIJ ${data.no_sij || ""}` : "Tambah Data SIJ"}
      centered
      size="lg"
      radius="lg"
    >
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Input Data */}
          <div className="grid grid-cols-1 gap-3 lg:col-span-3">
            <Select
              label="Plat Nomor"
              data={plat}
              {...form.getInputProps("no_pol")}
            />
            <DateTimePicker
              label="Tanggal & Jam"
              locale="id"
              valueFormat="DD MMMM YYYY HH:mm"
              placeholder="Pilih tanggal dan jam"
              {...form.getInputProps("datetime")}
            />
          </div>

          {/* Dropzone */}
          {/* <div className="flex flex-col items-center justify-center gap-3">
            <Dropzone
              accept={IMAGE_MIME_TYPE}
              multiple={false}
              onDrop={(files) => {
                const file = files[0];
                if (file) {
                  form.setFieldValue("bukti_tf", file);
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
                    Klik atau tarik file bukti SS
                  </p>
                  <p className="text-xs text-gray-400">
                    (Hanya PNG atau JPG, rasio layar HP disarankan)
                  </p>
                </div>
              )}
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

            {preview && (
              <Button
                size="xs"
                variant="light"
                color="red"
                onClick={() => {
                  setPreview(null);
                  form.setFieldValue("bukti_tf", null);
                }}
              >
                Hapus Gambar
              </Button>
            )}
          </div> */}
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