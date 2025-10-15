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
import { DateInput, TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function RitaseModal({ opened, onClose, data, plat, onSubmit }) {
  const [preview, setPreview] = useState(null);

  const form = useForm({
    initialValues: {
      no_pol: "",
      time: null,  // string HH:mm
      date: null,  // Date object
      bukti_tf: null,
    },
    validate: {
      no_pol: (value) => (!value ? "Nomor polisi wajib diisi" : null),
      time: (value) => (!value ? "Jam wajib diisi" : null),
      date: (value) => (!value ? "Tanggal wajib diisi" : null),
    },
  });

  // Prefill form saat edit
  useEffect(() => {
    if (data) {
      if (data.createdAt) {
        const dtLocal = dayjs(data.createdAt).tz(dayjs.tz.guess());
        form.setValues({
          no_pol: data.no_pol || "",
          date: dtLocal.toDate(),         // DateInput
          time: dtLocal.format("HH:mm"),  // TimeInput sebagai string "HH:mm"
          bukti_tf: data.bukti_tf || null,
        });
      } else {
        form.setValues({
          no_pol: data.no_pol || "",
          date: null,
          time: null,
          bukti_tf: data.bukti_tf || null,
        });
      }
      if (data.bukti_tf) setPreview(data.bukti_tf);
    } else {
      form.reset();
      setPreview(null);
    }
  }, [data]);

  const handleSubmit = (values) => {
    try {
      const datePart = new Date(values.date);

      // Jika TimeInput string "HH:mm"
      const [hours, minutes] = values.time.split(":").map(Number);

      const combinedDate = new Date(datePart);
      combinedDate.setHours(hours);
      combinedDate.setMinutes(minutes);
      combinedDate.setSeconds(0);
      combinedDate.setMilliseconds(0);

      const createdAt = combinedDate.toISOString();

      const payload = {
        no_pol: values.no_pol,
        bukti_tf: values.bukti_tf,
        createdAt,
      };

      onSubmit({ payload });

      form.reset();
      setPreview(null);
      onClose();
    } catch (error) {
      console.error("Gagal memproses tanggal/jam:", error);
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
          <div className="grid grid-cols-1 gap-3 lg:col-span-2">
            <Select 
              label="Plat Nomor"
              data={plat} 
              {...form.getInputProps("no_pol")} 
            />
            <TimeInput
              label="Jam"
              {...form.getInputProps("time")}
              format="24" // format 24 jam
            />
            <DateInput
              label="Tanggal"
              locale="id"
              valueFormat="DD MMMM YYYY"
              {...form.getInputProps("date")}
            />
          </div>

          {/* Dropzone */}
          <div className="flex flex-col items-center justify-center gap-3">
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
                  <Icon icon="mdi:cloud-upload-outline" width={50} height={50} color="#1c7ed6" />
                  <p className="mt-2 text-sm font-medium">Klik atau tarik file bukti SS</p>
                  <p className="text-xs text-gray-400">(Hanya PNG atau JPG, rasio layar HP disarankan)</p>
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
