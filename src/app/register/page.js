"use client";

import { useState, useRef } from "react";
import { TextInput, PasswordInput, Button, Select, Group, FileButton } from "@mantine/core"
import Image from "next/image"
import { useForm, matchesField } from "@mantine/form";
import { redirect } from "next/navigation";
import { DateInput } from "@mantine/dates";
import "dayjs/locale/id";
import { Icon } from "@iconify/react";
import { notifications } from "@mantine/notifications";
export default function page() {
    const [preview, setPreview] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const form = useForm({
        initialValues: {
            name: "",
            plat: "",
            category: "",
            car_name: "",
            no_kep: "",
            period: null,
            phone: "",
            emergency_phone: "",
            password: "",
            confirm_password: "",
            profile: null,
        },
        validate: {
            name: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Nama wajib diisi";
                return null;
            },
            plat: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Plat nomor wajib diisi";
                return null;
            },
            category: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Kategori driver wajib diisi";
                return null;
            },
            car_name: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Nama mobil wajib diisi";
                return null;
            },
            no_kep: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Nomor KEP wajib diisi";
                return null;
            },
            period: (value) => {
                if (!value) return "Tanggal berlaku kartu wajib diisi";
                return null;
            },
            phone: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Nomor telepon wajib diisi";
                return null;
            },
            emergency_phone: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return "Nomor telepon darurat wajib diisi";
                return null;
            },
            password: (value) =>
                !value.trim()
                    ? "Password wajib diisi"
                    : value.trim().length < 6
                        ? "Password minimal 6 karakter"
                        : null,
            confirm_password: matchesField(
                "password",
                "Password tidak sama"
            ),
        },
    });

    const handleFileUpload = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
                form.setFieldValue("profile", file);
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
            }
        } catch (err) {
            notifications.show({
                title: "Gagal membuka kamera",
                message: "Pastikan kamu memberi izin kamera",
                color: "red",
            });
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            context.drawImage(videoRef.current, 0, 0, 320, 240);
            const dataUrl = canvasRef.current.toDataURL("image/png");
            setPreview(dataUrl);
            form.setFieldValue("profile", dataUrl);
            stopCamera();
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
        }
        setCameraActive(false);
    };

    const handleSubmit = (values) => {
        redirect("/driver");
        //fetch login ke be
    };
    return (
        <div className="w-full min-h-dvh flex items-center justify-center bg-white text-[#E9AC50]">
            <div className="w-[75%] mx-auto h-fit flex flex-col items-center gap-12 py-12">
                <Image src={"/logo.png"} alt="" width={160} height={127} />
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <div className="flex flex-col items-center mb-5">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-32 h-32 rounded-full object-cover border mb-3"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border mb-3">
                                <Icon icon="mdi:account-circle-outline" width={64} />
                            </div>
                        )}

                        {/* ✅ Tombol Upload dan Selfie */}
                        <Group>
                            <FileButton onChange={handleFileUpload} accept="image/*">
                                {(props) => (
                                    <Button
                                        {...props}
                                        leftSection={<Icon icon="mdi:upload" width={18} />}
                                        variant="light"
                                        radius="md"
                                    >
                                        Upload
                                    </Button>
                                )}
                            </FileButton>
                            <Button
                                leftSection={<Icon icon="mdi:camera" width={18} />}
                                onClick={startCamera}
                                variant="light"
                                color="blue"
                                radius="md"
                            >
                                Selfie
                            </Button>
                        </Group>

                        {/* ✅ Kamera tampil di sini */}
                        {cameraActive && (
                            <div className="flex flex-col items-center mt-4">
                                <video
                                    ref={videoRef}
                                    autoPlay={true}
                                    playsInline={true}
                                    muted
                                    width="320"
                                    height="240"
                                    className="rounded-md border bg-black"
                                />
                                <canvas ref={canvasRef} width="320" height="240" className="hidden" />
                                <Group mt="sm">
                                    <Button color="green" radius="md" onClick={capturePhoto}>
                                        Ambil Foto
                                    </Button>
                                    <Button color="red" radius="md" onClick={stopCamera}>
                                        Batal
                                    </Button>
                                </Group>
                                {cameraError && <p className="text-red-500 text-sm mt-2">{cameraError}</p>}
                            </div>
                        )}
                    </div>
                    <TextInput
                        size="md"
                        radius="md"
                        label="Nama Lengkap"
                        withAsterisk
                        placeholder="Masukkan nama lengkap"
                        mb="md"
                        {...form.getInputProps("name")}
                        className="md:hidden"
                    />
                    <TextInput
                        size="lg"
                        radius="md"
                        label="Nama Lengkap"
                        withAsterisk
                        placeholder="Masukkan nama lengkap"
                        mb="md"
                        {...form.getInputProps("name")}
                        className="hidden md:block"
                    />

                    {/* PLAT NOMOR */}
                    <TextInput
                        size="md"
                        radius="md"
                        label="Plat Nomor"
                        withAsterisk
                        placeholder="Masukkan plat nomor"
                        mb="md"
                        {...form.getInputProps("plat")}
                        className="md:hidden"
                    />
                    <TextInput
                        size="lg"
                        radius="md"
                        label="Plat Nomor"
                        withAsterisk
                        placeholder="Masukkan plat nomor"
                        mb="md"
                        {...form.getInputProps("plat")}
                        className="hidden md:block"
                    />

                    {/* KATEGORI */}
                    <Select
                        size="md"
                        radius="md"
                        label="Kategori Driver"
                        withAsterisk
                        placeholder="Pilih kategori"
                        data={[
                            { value: "premium", label: "Premium" },
                            { value: "reguler", label: "Reguler" }
                        ]}
                        mb="md"
                        {...form.getInputProps("category")}
                        className="md:hidden"
                    />
                    <Select
                        size="lg"
                        radius="md"
                        label="Kategori Kendaraan"
                        withAsterisk
                        placeholder="Pilih kategori"
                        data={[
                            { value: "premium", label: "Premium" },
                            { value: "reguler", label: "Reguler" }
                        ]}
                        mb="md"
                        {...form.getInputProps("category")}
                        className="hidden md:block"
                    />

                    {/* CAR NAME */}
                    <TextInput
                        size="md"
                        radius="md"
                        label="Mobil"
                        withAsterisk
                        placeholder="Masukkan nama mobil"
                        mb="md"
                        {...form.getInputProps("car_name")}
                        className="md:hidden"
                    />
                    <TextInput
                        size="lg"
                        radius="md"
                        label="Mobil"
                        withAsterisk
                        placeholder="Masukkan nama mobil"
                        mb="md"
                        {...form.getInputProps("car_name")}
                        className="hidden md:block"
                    />

                    {/* NOMOR KEP */}
                    <TextInput
                        size="md"
                        radius="md"
                        label="Nomor KEP"
                        withAsterisk
                        placeholder="Masukkan nomor KEP"
                        mb="md"
                        {...form.getInputProps("no_kep")}
                        className="md:hidden"
                    />
                    <TextInput
                        size="lg"
                        radius="md"
                        label="Nomor KEP"
                        withAsterisk
                        placeholder="Masukkan nomor KEP"
                        mb="md"
                        {...form.getInputProps("no_kep")}
                        className="hidden md:block"
                    />

                    {/* PERIODE */}
                    <DateInput
                        size="md"
                        radius="md"
                        label="Tanggal Berakhir KEP"
                        withAsterisk
                        placeholder="Berlaku Sampai"
                        mb="md"
                        locale="id"
                        valueFormat="DD MMMM YYYY"
                        {...form.getInputProps("period")}
                        className="md:hidden"
                    />
                    <DateInput
                        size="lg"
                        radius="md"
                        label="Tanggal Berakhir KEP"
                        withAsterisk
                        placeholder="Berlaku Sampai"
                        mb="md"
                        locale="id"
                        valueFormat="DD MMMM YYYY"
                        {...form.getInputProps("period")}
                        className="hidden md:block"
                    />

                    {/* NOMOR TELEPON */}
                    <TextInput
                        size="md"
                        radius="md"
                        label="Nomor Telepon"
                        withAsterisk
                        placeholder="Masukkan nomor telepon"
                        mb="md"
                        {...form.getInputProps("phone")}
                        className="md:hidden"
                    />
                    <TextInput
                        size="lg"
                        radius="md"
                        label="Nomor Telepon"
                        withAsterisk
                        placeholder="Masukkan nomor telepon"
                        mb="md"
                        {...form.getInputProps("phone")}
                        className="hidden md:block"
                    />

                    {/* NOMOR DARURAT */}
                    <TextInput
                        size="md"
                        radius="md"
                        label="Nomor Darurat"
                        withAsterisk
                        placeholder="Masukkan nomor darurat"
                        mb="md"
                        {...form.getInputProps("emergency_phone")}
                        className="md:hidden"
                    />
                    <TextInput
                        size="lg"
                        radius="md"
                        label="Nomor Darurat"
                        withAsterisk
                        placeholder="Masukkan nomor darurat"
                        mb="md"
                        {...form.getInputProps("emergency_phone")}
                        className="hidden md:block"
                    />

                    {/* PASSWORD */}
                    <PasswordInput
                        size="md"
                        radius="md"
                        label="Password"
                        withAsterisk
                        placeholder="Masukkan password"
                        mb="md"
                        {...form.getInputProps("password")}
                        className="md:hidden"
                    />
                    <PasswordInput
                        size="lg"
                        radius="md"
                        label="Password"
                        withAsterisk
                        placeholder="Masukkan password"
                        mb="md"
                        {...form.getInputProps("password")}
                        className="hidden md:block"
                    />

                    {/* KONFIRMASI PASSWORD */}
                    <PasswordInput
                        size="md"
                        radius="md"
                        label="Konfirmasi Password"
                        withAsterisk
                        placeholder="Ulangi password"
                        mb="md"
                        {...form.getInputProps("confirm_password")}
                        className="md:hidden"
                    />
                    <PasswordInput
                        size="lg"
                        radius="md"
                        label="Konfirmasi Password"
                        withAsterisk
                        placeholder="Ulangi password"
                        mb="md"
                        {...form.getInputProps("confirm_password")}
                        className="hidden md:block"
                    />
                    <Button fullWidth color="#E9AC50" type="submit" variant="filled" size="md" radius="md">Daftar</Button>

                </form>
            </div>
        </div >
    )
}
