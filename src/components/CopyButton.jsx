"use client";

import { useState } from "react";
import { ActionIcon, Tooltip, Notification } from "@mantine/core";
import { Icon } from "@iconify/react";

export default function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset copied
    } catch (err) {
      console.error("Gagal menyalin:", err);
    }
  };

  return (
    <>
      <Tooltip label={copied ? "Copied!" : `Copy ${label}`} withArrow>
        <ActionIcon color={copied ? "teal" : "gray"} onClick={handleCopy} variant="light">
          <Icon
            width={16}
            height={16}
            icon={copied ? "tabler:check" : "tabler:copy"}
          />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
