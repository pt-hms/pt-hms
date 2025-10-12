"use client";
import { useState } from "react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { Loader } from "@mantine/core";
import { Icon } from "@iconify/react";
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
                message: "Silakan pilih file terlebih dahulu.",
                color: "red",
            });
            return;
        }

        setIsUploading(true); // Mulai loading
        // Simulasi proses upload
        setTimeout(() => {
            notifications.show({
                title: "Berhasil",
                message: `Bukti transfer "${file.name}" berhasil diunggah!`,
                color: "green",
            });

            setFile(null);
            setPreview(null);
            setIsUploading(false); // Hentikan loading
        }, 1500); // Simulasi waktu upload 1.5 detik
    };
    
    return (
        // Wrapper utama diubah:
        // 1. Dibuat flex container (flex)
        // 2. Konten diletakkan di tengah horizontal (items-center)
        // 3. Konten diletakkan di tengah vertikal (justify-center)
        // 4. pb-[124px] dihilangkan, diganti dengan padding vertikal (py-8)
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-8">
                
            
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
                className="w-[90%] h-[50vh] max-w-sm bg-white rounded-3xl border-4 border-[#e10b16] 
                           flex flex-col items-center justify-center cursor-pointer shadow-lg hover:bg-red-50 
                           transition-all duration-300 ease-in-out p-4 relative overflow-hidden"
                onDragEnter={(event) => event.currentTarget.classList.add('scale-[1.02]', 'shadow-2xl')} 
                onDragLeave={(event) => event.currentTarget.classList.remove('scale-[1.02]', 'shadow-2xl')}
            >
                {preview ? (
                    <Image
                        src={preview}
                        alt="Preview Bukti Transfer"
                        className="max-w-full max-h-full object-contain rounded-2xl animate-fade-in"
                    />
                ) : (
                    <div className="flex flex-col items-center text-center p-4">
                        <Icon icon="solar:upload-minimalistic-bold" width={80} height={80} className="text-[#e10b16] mb-4 animate-bounce-slow" />
                        
                        <p className="text-gray-700 font-extrabold text-2xl tracking-wide mb-2">
                            UNGGAH BUKTI TRANSFER KEHADIRAN
                        </p>
                        <p className="text-gray-500 text-sm mt-1 mb-4 max-w-[200px]">
                            Klik untuk memilih.
                        </p>
                        <p className="text-gray-400 text-xs">
                            (Format yang didukung: JPG, PNG, JPEG)
                        </p>
                    </div>
                )}
            </Dropzone>
            
            {/* === TOMBOL AKSI === */}
            {file &&
                <div className="w-[90%] mx-auto h-fit py-5 flex flex-col items-center gap-4 max-w-sm mt-8">
                    {/* Tombol Batal: Abu-abu tua */}
                    <button
                        className="w-full py-3 px-8 text-lg rounded-xl bg-gray-500 text-white cursor-pointer hover:bg-gray-600 transition disabled:opacity-50 font-semibold shadow-md"
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
                        className="w-full py-3 px-8 text-lg rounded-xl bg-[#e10b16] text-white cursor-pointer hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2 justify-center font-semibold shadow-md"
                    >
                        {isUploading ? <Loader size="sm" color="white" /> : "Kirim Bukti"}
                    </button>
                </div>
            }
        </div>
    );
}