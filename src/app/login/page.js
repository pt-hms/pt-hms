"use client"
import { TextInput, PasswordInput, Button } from "@mantine/core"
import Image from "next/image"
import { useForm } from "@mantine/form";
import { redirect } from "next/navigation";
import Link from "next/link"; // Import Link dari next/link

export default function page() {
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

  const handleSubmit = (values) => {
    // Simulasi redirect
    console.log("Login attempt:", values);
    redirect("/driver");
    //fetch login ke be
  };

  // Fungsi untuk mengarahkan ke halaman registrasi
  const handleRegister = () => {
    redirect("/register"); // Asumsi halaman registrasi ada di /register
  };
  
  return (
    <div className="w-full min-h-dvh flex items-center justify-center bg-gray-50 text-black">
      <div className="w-[85%] max-w-sm mx-auto h-full flex flex-col items-center gap-12">
        
        <Image 
            src={"/logo.png"} 
            alt="Logo Aplikasi" 
            width={160} 
            height={127} 
        />
        
        <form onSubmit={form.onSubmit(handleSubmit)} className="w-full">
            {/* Input Plat Nomor (Mobile: md) */}
            <TextInput
              size="md"
              radius="md"
              label={<span className="text-black font-semibold">Plat Nomor</span>}
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
              label={<span className="text-black font-semibold">Plat Nomor</span>}
              withAsterisk
              placeholder="Masukkan Plat Nomor"
              mb="md"
              {...form.getInputProps("plat")}
              className="hidden md:block"
            />
            
            {/* Input Password (Mobile: md) */}
            <PasswordInput
              label={<span className="text-black font-semibold">Password</span>}
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
              label={<span className="text-black font-semibold">Password</span>}
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
            >
                Masuk
            </Button>
            
            {/* Tombol REGISTRASI (Subtle / Polos) */}
            <div className="mt-6 text-center">
                <p className="text-gray-600 mb-2 text-sm">Belum punya akun?</p>
                <Link href="/register" passHref>
                    <Button
                        component="a" // Menggunakan component="a" untuk Link next/js
                        fullWidth
                        variant="light" // Menggunakan variant light/subtle untuk tema yang lebih lembut
                        color="gray"
                        size="md"
                        radius="md"
                        className="hover:bg-gray-100"
                    >
                        Daftar Sekarang
                    </Button>
                </Link>
            </div>
            
        </form>
      </div>
    </div>
  )
}