"use client"
import { TextInput, PasswordInput, Button } from "@mantine/core"
import Image from "next/image"
import { useForm } from "@mantine/form";
export default function page() {
  const form = useForm({
    initialValues: {
      phone: "",
      password: "",
    },
    validate: {
      phone: (value) => {
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
    },
  });

  const handleSubmit = (values) => {
    alert(`Login dengan nomor: ${values.phone}`);
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
            label="Nomor Telepon"
            withAsterisk
            placeholder="Masukkan Nomor Telepon"
            mb="md"
            {...form.getInputProps("phone")}
            className="md:hidden"
          />
          <TextInput
            size="lg"
            radius="md"
            label="Nomor Telepon"
            withAsterisk
            placeholder="Masukkan Nomor Telepon"
            mb="md"
            {...form.getInputProps("phone")}
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
