"use client"
import { TextInput, PasswordInput, Button } from "@mantine/core"
import Image from "next/image"
import { useForm } from "@mantine/form";
import { redirect } from "next/navigation";
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
    redirect("/driver");
    //fetch login ke be
  };
  return (
    <div className="w-full min-h-dvh flex items-center justify-center bg-white text-[#E9AC50]">
      <div className="w-[75%] mx-auto h-full flex flex-col items-center gap-12">
        <Image src={"/logo.png"} alt="" width={160} height={127} />
        <form onSubmit={form.onSubmit(handleSubmit)}>
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
          <PasswordInput
            label="Password"
            size="md"
            radius="md"
            placeholder="Masukkan password"
            withAsterisk
            mb="md"
            {...form.getInputProps("password")}
            className="md:hidden"
          />
          <PasswordInput
            label="Password"
            size="lg"
            radius="md"
            placeholder="Masukkan password"
            withAsterisk
            mb="md"
            {...form.getInputProps("password")}
            className="hidden md:block"
          />
          <Button fullWidth color="#E9AC50" type="submit" variant="filled" size="md" radius="md">Masuk</Button>

        </form>
      </div>
    </div >
  )
}
