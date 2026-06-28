"use client";

import { useEffect, useRef } from "react";
import { getCalApi } from "@calcom/embed-react";

interface SlotSelectorProps {
  calLink: string; // e.g. "username/event-slug"
  open: boolean;
  onClose: () => void;
  onBooked: (data: { uid: string; startTime: string }) => void;
  prefill?: {
    name?: string;
    email?: string;
  };
}

export function SlotSelector({
  calLink,
  open,
  onClose,
  onBooked,
  prefill,
}: SlotSelectorProps) {
  // Keep stable refs so the useEffect callbacks always see the latest values
  const onBookedRef = useRef(onBooked);
  const onCloseRef = useRef(onClose);
  onBookedRef.current = onBooked;
  onCloseRef.current = onClose;

  // Register the bookingSuccessfulV2 listener once on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      const cal = await getCalApi();

      cal("on", {
        action: "bookingSuccessfulV2",
        callback: (e: any) => {
          if (!mounted) return;
          const data = e?.detail?.data ?? {};
          const uid: string = data?.uid ?? "";
          const startTime: string = data?.startTime ?? "";
          onBookedRef.current({ uid, startTime });
          onCloseRef.current();
        },
      });

      // Listen for modal close / dismiss without booking
      cal("on", {
        action: "__windowLoadComplete",
        callback: () => {
          // no-op — just ensures the script is ready
        },
      });
    })();

    return () => {
      mounted = false;
    };
  }, []); // intentionally empty — listeners registered once

  // Open the Cal.com popup whenever `open` flips to true
  useEffect(() => {
    if (!open) return;

    (async () => {
      const cal = await getCalApi();

      cal("modal", {
        calLink,
        config: {
          name: prefill?.name ?? "",
          email: prefill?.email ?? "",
        },
      });
    })();
  }, [open, calLink, prefill?.name, prefill?.email]);

  // Cal.com manages its own modal DOM — nothing to render
  return null;
}
