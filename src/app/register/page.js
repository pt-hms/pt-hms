"use client";
import { useState, useRef, useEffect } from "react";
import {
    TextInput,
    PasswordInput,
    Button,
    Select,
    Group,
    FileButton,
    Loader,
} from "@mantine/core";
import Image from "next/image";
import { useForm, matchesField } from "@mantine/form";
import { redirect, useRouter } from "next/navigation";
import { DateInput } from "@mantine/dates";
import "dayjs/locale/id";
import { Icon } from "@iconify/react";
import { notifications } from "@mantine/notifications";
import { registerUser, useGuest } from "@/utils/useAuth";
import useRouteLoading from "@/utils/useRouteLoading";

export default function Page() {
    const [preview, setPreview] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useGuest();

    useEffect(() => {
        setMounted(true); // menandai komponen sudah di client
    }, []);


    // 🔹 Start Camera
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false,
            });
            setStream(mediaStream);
            setCameraActive(true);
        } catch (err) {
            console.error("Gagal membuka kamera:", err);
            alert("Tidak dapat mengakses kamera. Pastikan izin sudah diberikan.");
        }
    };

    // 🔹 Stop Camera
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        setCameraActive(false);
    };

    // 🔹 Capture Selfie
    const capturePhoto = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // 👇 Mirror gambar supaya hasil selfie tidak terbalik
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], "selfie.png", { type: "image/png" });
                setPreview(URL.createObjectURL(blob));
                form.setFieldValue("foto_profil", file);
            }
        }, "image/png");

        stopCamera();
    };



    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;

            // Pastikan video langsung play setelah stream diset
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play().catch((err) => {
                    console.error("⚠️ Tidak bisa auto-play video:", err);
                });
            };
        }
    }, [stream]);

    const form = useForm({
        initialValues: {
            nama: "",
            no_pol: "",
            kategori: "",
            mobil: "",
            no_kep: null,
            exp_kep: null,
            no_hp: "",
            no_darurat: "",
            password: "",
            confirm_password: "",
            foto_profil: null,
        },
        validate: {
            nama: (value) => (!value.trim() ? "Nama wajib diisi" : null),
            no_pol: (value) => (!value.trim() ? "Plat nomor wajib diisi" : null),
            kategori: (value) => (!value.trim() ? "Kategori driver wajib diisi" : null),
            mobil: (value) => (!value.trim() ? "Nama mobil wajib diisi" : null),
            // no_kep: (value) => (!value.trim() ? "Nomor KEP wajib diisi" : null),
            // exp_kep: (value) => (!value ? "Tanggal berlaku kartu wajib diisi" : null),
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
                !value.trim()
                    ? "Password wajib diisi"
                    : value.trim().length < 6
                        ? "Password minimal 6 karakter"
                        : null,
            confirm_password: matchesField("password", "Password tidak sama"),
        },
    });

    const handleFileUpload = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
                form.setFieldValue("foto_profil", file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        console.log(values);

        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value instanceof File) {
                    formData.append(key, value); // untuk file
                } else if (value !== null && value !== undefined && key != "confirm_password") {
                    formData.append(key, value); // untuk string/tanggal
                }
            });

            await registerUser(formData);
            setTimeout(() => router.push("/"), 1000);
        } catch (err) {
            notifications.show({
                title: "Registrasi Gagal",
                message: err.response?.data?.message || "Terjadi kesalahan.",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    useRouteLoading(() => {
        notifications.show({
            title: "Registrasi Berhasil 🎉",
            message: "Silakan login dengan akun Anda.",
            color: "green",
        });
        setLoading(false);
    });




    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader color="red" />
            </div>
        );
    }

    return (
        <div className="w-full min-h-dvh flex items-center justify-center bg-white text-black">
            <div className="w-[75%] mx-auto h-fit flex flex-col items-center gap-12 py-12">
                <Image src={"/icon.png"} alt="" width={160} height={127} />

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <div className="flex flex-col items-center mb-5">
                        {preview ? (
                            <Image
                                src={preview}
                                width={32}
                                height={32}
                                alt="Preview"
                                className="w-32 h-32 rounded-full object-cover border mb-3"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border mb-3">
                                <Icon icon="mdi:account-circle-outline" width={64} />
                            </div>
                        )}

                        {mounted ? (
                            <Group>
                                <FileButton onChange={handleFileUpload} accept="image/*">
                                    {(props) => (
                                        <Button
                                            {...props}
                                            leftSection={<Icon icon="mdi:upload" width={18} />}
                                            variant="light"
                                            color="#e10b16"
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
                                    color="#e10b16"
                                    radius="md"
                                >
                                    Selfie
                                </Button>
                            </Group>
                        ) : null}


                        {cameraActive && (
                            <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 z-50">
                                <video
                                    id="selfieVideo"
                                    autoPlay
                                    playsInline
                                    ref={videoRef}
                                    className="w-80 h-80 rounded-2xl bg-black object-cover"
                                    style={{ transform: "scaleX(-1)" }} // 👈 mirror tampilan kamera
                                />

                                <div className="mt-4 flex gap-3">
                                    <Button onClick={capturePhoto} color="#e10b16" radius="md">
                                        <Icon icon="mdi:camera" className="mr-2" /> Ambil Foto
                                    </Button>
                                    <Button onClick={stopCamera} color="red" radius="md">
                                        <Icon icon="mdi:close" className="mr-2" /> Tutup
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FORM INPUTS */}
                    <TextInput
                        size="md"
                        radius="md"
                        label="Nama Lengkap"
                        withAsterisk
                        placeholder="Masukkan nama lengkap"
                        mb="md"
                        {...form.getInputProps("nama")}
                        className="md:hidden"
                    />
                    <TextInput
                        size="lg"
                        radius="md"
                        label="Nama Lengkap"
                        withAsterisk
                        placeholder="Masukkan nama lengkap"
                        mb="md"
                        {...form.getInputProps("nama")}
                        className="hidden md:block"
                    />

                    <TextInput
                        size="md"
                        radius="md"
                        label="Plat Nomor"
                        withAsterisk
                        placeholder="Masukkan plat nomor"
                        mb="md"
                        {...form.getInputProps("no_pol")}
                        className="md:hidden"
                    />
                    <TextInput
                        size="lg"
                        radius="md"
                        label="Plat Nomor"
                        withAsterisk
                        placeholder="Masukkan plat nomor"
                        mb="md"
                        {...form.getInputProps("no_pol")}
                        className="hidden md:block"
                    />

                    <Select
                        size="md"
                        radius="md"
                        label="Kategori Driver"
                        withAsterisk
                        placeholder="Pilih kategori"
                        data={[
                            { value: "premium", label: "Premium" },
                            { value: "reguler", label: "Reguler" },
                        ]}
                        mb="md"
                        {...form.getInputProps("kategori")}
                        className="md:hidden"
                    />
                    <Select
                        size="lg"
                        radius="md"
                        label="Kategori Driver"
                        withAsterisk
                        placeholder="Pilih kategori"
                        data={[
                            { value: "premium", label: "Premium" },
                            { value: "reguler", label: "Reguler" },
                        ]}
                        mb="md"
                        {...form.getInputProps("kategori")}
                        className="hidden md:block"
                    />

                    <TextInput
                        size="md"
                        radius="md"
                        label="Mobil"
                        withAsterisk
                        placeholder="Masukkan nama mobil"
                        mb="md"
                        {...form.getInputProps("mobil")}
                        className="md:hidden"
                    />
                    <TextInput
                        size="lg"
                        radius="md"
                        label="Mobil"
                        withAsterisk
                        placeholder="Masukkan nama mobil"
                        mb="md"
                        {...form.getInputProps("mobil")}
                        className="hidden md:block"
                    />

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

                    <DateInput
                        size="md"
                        radius="md"
                        label="Tanggal Berakhir KEP"
                        withAsterisk
                        placeholder="Berlaku Sampai"
                        mb="md"
                        locale="id"
                        valueFormat="DD MMMM YYYY"
                        {...form.getInputProps("exp_kep")}
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
                        {...form.getInputProps("exp_kep")}
                        className="hidden md:block"
                    />

                    <TextInput
                        size="md"
                        radius="md"
                        label="Nomor Telepon"
                        withAsterisk
                        placeholder="Masukkan nomor telepon"
                        mb="md"
                        {...form.getInputProps("no_hp")}
                        className="md:hidden"
                    />
                    <TextInput
                        size="lg"
                        radius="md"
                        label="Nomor Telepon"
                        withAsterisk
                        placeholder="Masukkan nomor telepon"
                        mb="md"
                        {...form.getInputProps("no_hp")}
                        className="hidden md:block"
                    />

                    <TextInput
                        size="md"
                        radius="md"
                        label="Nomor Darurat"
                        withAsterisk
                        placeholder="Masukkan nomor darurat"
                        mb="md"
                        {...form.getInputProps("no_darurat")}
                        className="md:hidden"
                    />
                    <TextInput
                        size="lg"
                        radius="md"
                        label="Nomor Darurat"
                        withAsterisk
                        placeholder="Masukkan nomor darurat"
                        mb="md"
                        {...form.getInputProps("no_darurat")}
                        className="hidden md:block"
                    />

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

                    <Button
                        fullWidth
                        color="#e10b16"
                        type="submit"
                        variant="filled"
                        size="md"
                        radius="md"
                    >
                        Daftar
                    </Button>
                </form>
            </div>
        </div>
    );
}
