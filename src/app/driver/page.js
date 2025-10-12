"use client";
import { useState } from "react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { Loader } from "@mantine/core";
import Image from "next/image";

export default function Page() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = (files) => {
    const selectedFile = files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file == null) {
      notifications.show({
        title: "Gagal",
        message: "Silakan pilih file terlebih dahulu!",
        color: "red",
      });
      return;
    }

    // Simulasi proses upload
    setIsUploading(true);
    setTimeout(() => {
        notifications.show({
            title: "Berhasil",
            message: `File "${file.name}" berhasil diunggah (simulasi)!`,
            color: "green",
        });

        setFile(null);
        setPreview(null);
        setIsUploading(false);
    }, 1500); // Simulasi waktu upload 1.5 detik
  };
  
  return (
    // Latar belakang layar diubah menjadi abu-abu muda lembut
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pb-[124px]"> 
      <h1 className="text-xl font-bold text-[#333333] mb-4">Unggah SS Ritase</h1>
      
      {/* === AREA UPLOAD (Dropzone) === */}
      <Dropzone
        accept={IMAGE_MIME_TYPE}
        multiple={false}
        onDrop={handleDrop}
        onReject={() =>
          notifications.show({
            title: "File tidak didukung",
            message: "Silakan unggah file gambar (jpg, png, jpeg, webp).",
            color: "red",
          })
        }
        // Latar belakang putih, border Merah sebagai aksen, dan shadow yang jelas
        className="w-[80%] h-[60vh] max-w-sm bg-white rounded-3xl border-4 border-[#e10b16] 
                   flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-100 transition p-2"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-2xl"
            style={{ objectFit: 'contain' }} // Menggunakan contain agar gambar terlihat utuh
          />
        ) : (
          <p className="text-gray-500 font-bold text-center text-xl p-4">
            PILIH FILE<br />GAMBAR ANDA DISINI
          </p>
        )}
      </Dropzone>
      
      {/* === TOMBOL AKSI === */}
      {file &&
        <div className="w-4/5 mx-auto h-fit py-5 flex justify-between max-w-sm">
          {/* Tombol Batal: Abu-abu tua */}
          <button
            className="py-2 px-6 text-lg rounded-xl bg-gray-500 text-white cursor-pointer hover:bg-gray-600 transition disabled:opacity-50"
            onClick={() => {
              setPreview(null);
              setFile(null);
            }}
            disabled={isUploading}
          >
            Batal
          </button>

          {/* Tombol Kirim: Merah sebagai aksen utama */}
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="py-2 px-6 text-lg rounded-xl bg-[#e10b16] text-white cursor-pointer hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isUploading ? <Loader size="sm" color="white" /> : "Kirim"}
          </button>
        </div>
      }
    </div>
  );
}