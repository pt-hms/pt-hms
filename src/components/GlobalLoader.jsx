"use client";

import { Loader } from "@mantine/core";
import usePageLoading from "@/utils/usePageLoading";

export default function GlobalLoader() {
  const loading = usePageLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-all duration-300">
      <Loader size="lg" color="red" />
    </div>
  );
}
