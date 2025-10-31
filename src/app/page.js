"use client"
import { TextInput, PasswordInput, Button, Loader } from "@mantine/core"
import Image from "next/image"
import { useForm } from "@mantine/form";
import { redirect } from "next/navigation";
import Link from "next/link"; // Import Link dari next/link
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { getUser, loginUser, useGuest } from "@/utils/useAuth";
import useRouteLoading from "@/utils/useRouteLoading";

export default function page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useGuest();

  useRouteLoading(() => {
    const user = getUser();
    if (user) {
      notifications.show({
        title: "Login Berhasil 🎉",
        message: `Selamat datang, ${user.nama}`,
        color: "green",
      });
    }
    setLoading(false);
  });

  const form = useForm({
    initialValues: {
      plat: "",
      password: "",
    },
    validate: {
      plat: (value) => {
        const trimmed = value.trim();
        if (!trimmed) return "Plat nomor wajib diisi";
        return null;
      },

      password: (value) =>
        !value.trim()
          ? "Password wajib diisi"
          : value.trim().length < 6
            ? "Password minimal 6 karakter"
            : null,
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const data = await loginUser(values.plat, values.password);
      router.push(data.driver.role === "admin" ? "/admin" : data.driver.role === "grab" ? "/grab" : "/driver");
    } catch (err) {
      notifications.show({
        title: "Login Gagal",
        message: err.response?.data?.message || "Periksa kembali data login",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader color="red" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-dvh flex items-center justify-center bg-gray-50 text-black">
      <div className="w-[85%] max-w-sm mx-auto h-full flex flex-col items-center gap-12 mb-12">

        <Image
          src={"/icon.png"}
          alt="Logo Aplikasi"
          width={160}
          height={127}
        />

        <form onSubmit={form.onSubmit(handleSubmit)} className="w-full">
          {/* Input Plat Nomor (Mobile: md) */}
          <TextInput
            size="md"
            radius="md"
            label="Plat Nomor"
            withAsterisk
            placeholder="Masukkan Plat Nomor"
            mb="md"
            {...form.getInputProps("plat")}
            className="md:hidden"
          />
          {/* Input Plat Nomor (Desktop: lg) */}
          <TextInput
            size="lg"
            radius="md"
            label="Plat Nomor"
            withAsterisk
            placeholder="Masukkan Plat Nomor"
            mb="md"
            {...form.getInputProps("plat")}
            className="hidden md:block"
          />

          {/* Input Password (Mobile: md) */}
          <PasswordInput
            label="Password"
            size="md"
            radius="md"
            placeholder="Masukkan password"
            withAsterisk
            mb="xl"
            {...form.getInputProps("password")}
            className="md:hidden"
          />
          {/* Input Password (Desktop: lg) */}
          <PasswordInput
            label="Password"
            size="lg"
            radius="md"
            placeholder="Masukkan password"
            withAsterisk
            mb="xl"
            {...form.getInputProps("password")}
            className="hidden md:block"
          />

          {/* Tombol MASUK (Aksen Merah) */}

          <Button
            fullWidth
            color="#e10b16"
            type="submit"
            variant="filled"
            size="lg"
            radius="md"
            className="shadow-lg hover:shadow-xl transition duration-300"
            disabled={loading}
          >
            Masuk
          </Button>
          {/* Tombol REGISTRASI (Subtle / Polos) */}

        </form>
        <div className="text-center w-full">
          <p className="text-gray-600 mb-2 text-sm">Belum jadi driver?</p>
          <Button
            component="a" // Menggunakan component="a" untuk Link next/js
            fullWidth
            href="/register"
            variant="light" // Menggunakan variant light/subtle untuk tema yang lebih lembut
            color="black"
            size="md"
            radius="md"
            className="hover:bg-gray-100"
          >
            Daftar Sekarang
          </Button>
        </div>
      </div>
    </div>
  )
}