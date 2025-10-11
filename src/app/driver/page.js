"use client";
import { useState } from "react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { Loader } from "@mantine/core";

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

  // const handleUpload = async () => {
  //   if (!file) {
  //     notifications.show({
  //       title: "Gagal",
  //       message: "Silakan pilih file terlebih dahulu.",
  //       color: "red",
  //     });
  //     return;
  //   }

  //   try {
  //     setIsUploading(true);
  //     const formData = new FormData();
  //     formData.append("image", file);

  //     const res = await fetch("/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!res.ok) throw new Error("Upload gagal");

  //     notifications.show({
  //       title: "Berhasil",
  //       message: "File berhasil diunggah!",
  //       color: "green",
  //     });

  //     setPreview(null);
  //     setFile(null);
  //   } catch (err) {
  //     notifications.show({
  //       title: "Gagal",
  //       message: err.message || "Terjadi kesalahan saat upload",
  //       color: "red",
  //     });
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  const handleUpload = () => {
    if (file == null) {
      notifications.show({
        title: "Gagal",
        message: "Silakan pilih file terlebih dahulu!",
        color: "red",
      });
      return;
    }

    notifications.show({
      title: "Berhasil",
      message: `File "${file.name}" berhasil diunggah (simulasi)!`,
      color: "green",
    });

    setFile(null);
    setPreview(null);
  };
  console.log(file);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF9F0] pb-[124px]">
      {/* === AREA UPLOAD === */}
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
        className="w-[80%] h-[60vh] max-w-sm bg-[#FCE6BE] rounded-3xl border-4 border-[#B58A53]
                   flex items-center justify-center cursor-pointer shadow-inner hover:bg-[#fbe0ad] transition p-2"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-[60vh] object-cover rounded-2xl"
          />
        ) : (
          <p className="text-black font-bold text-center text-xl">
            PILIH FILE ANDA<br />DISINI
          </p>
        )}
      </Dropzone>
      {file &&
        <div className="w-4/5 mx-auto h-fit py-5 flex justify-between max-w-sm">
          <button
            className="py-2 px-6 text-lg rounded-xl bg-[#87560E] text-white cursor-pointer"
            onClick={() => {
              setPreview(null);
              setFile(null);
            }}
            disabled={isUploading}
          >
            Batal
          </button>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="py-2 px-6 text-lg rounded-xl bg-[#E9AC50] text-white cursor-pointer"
          >
            {isUploading && <Loader size="sm" color="white" />} Kirim
          </button>
        </div>
      }
    </div>
  );
}
