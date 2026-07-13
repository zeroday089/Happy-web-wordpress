"use client";

import { PopupModal } from "react-calendly";

interface SlotSelectorProps {
  url: string;
  open: boolean;
  onClose: () => void;
  prefill?: {
    name?: string;
    email?: string;
  };
}

export function SlotSelector({ url, open, onClose, prefill }: SlotSelectorProps) {
  if (typeof window === "undefined") return null;

  return (
    <PopupModal
      url={url}
      onModalClose={onClose}
      open={open}
      rootElement={document.body}
      prefill={prefill}
    />
  );
}