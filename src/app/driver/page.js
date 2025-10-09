"use client"
import { useRef, useState, useEffect } from "react";

export default function Page() {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const handleTriggerUpload = () => {
      if (preview) {
        alert("File sudah dipilih!");
      } else {
        fileInputRef.current?.click();
      }
    };

    window.addEventListener("trigger-upload", handleTriggerUpload);
    return () => window.removeEventListener("trigger-upload", handleTriggerUpload);
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF9F0] pb-24">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-[80%] h-[70vh] max-w-sm bg-[#FCE6BE] rounded-3xl border-4 border-[#B58A53]
                   flex items-center justify-center cursor-pointer shadow-inner hover:bg-[#fbe0ad] transition"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <p className="text-black font-bold text-center text-lg">
            PILIH FILE ANDA<br />DISINI
          </p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
