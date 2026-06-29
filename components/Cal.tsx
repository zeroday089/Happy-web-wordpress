"use client";

import { useEffect, useRef } from "react";
import { getCalApi } from "@calcom/embed-react";

interface SlotSelectorProps {
    calLink: string;
    open: boolean;
    onClose: () => void;
    onBooked: (data: { uid: string; startTime: string }) => void;
    prefill?: {
        name?: string;
        email?: string;
    };
}

function toSlug(calLink: string): string {
    try {
        const url = new URL(calLink);
        return url.pathname.replace(/^\//, "");
    } catch {
        return calLink;
    }
}

export function SlotSelector({
    calLink,
    open,
    onClose,
    onBooked,
    prefill,
}: SlotSelectorProps) {
    const slug = toSlug(calLink);

    // Stable refs — always point at latest prop values
    const onBookedRef = useRef(onBooked);
    const onCloseRef = useRef(onClose);
    onBookedRef.current = onBooked;
    onCloseRef.current = onClose;

    // Tracks whether booking happened (prevents onClose after successful booking)
    const bookedRef = useRef(false);
    const modalOpenRef = useRef(false);
    const calRef = useRef<any>(null);

    // ── Initialise Cal.com SDK and register booking listener ONCE on mount ──
    useEffect(() => {
        let mounted = true;

        (async () => {
            const cal = await getCalApi();
            if (!mounted) return;
            calRef.current = cal;

            // Listen for successful bookings
            cal("on", {
                action: "bookingSuccessfulV2",
                callback: (e: any) => {
                    if (!mounted) return;
                    bookedRef.current = true;
                    const data = e?.detail?.data ?? {};
                    console.log("[Cal.com] booking confirmed:", data);
                    onBookedRef.current({
                        uid: data?.uid ?? "",
                        startTime: data?.startTime ?? "",
                    });
                },
            });
        })();

        return () => {
            mounted = false;
        };
    }, []);

    // ── Open the modal when `open` transitions to true ──
    // Also watches for the Cal.com modal overlay being removed from the DOM
    // to reliably detect dismissal (clicking backdrop / X button).
    useEffect(() => {
        if (!open) return;

        bookedRef.current = false;
        modalOpenRef.current = true;

        const openModal = async () => {
            const cal = calRef.current ?? (await getCalApi());
            calRef.current = cal;

            console.log("[Cal.com] opening modal for:", slug);
            cal("modal", {
                calLink: slug,
                config: {
                    name: prefill?.name ?? "",
                    email: prefill?.email ?? "",
                },
            });
        };
        openModal();

        // ── Detect modal close via DOM observation ──
        // Cal.com adds an overlay + iframe to document.body when the modal
        // opens. When the user dismisses it, Cal.com removes those elements.
        // We watch for that removal with a MutationObserver.
        let observer: MutationObserver | null = null;

        // Give Cal.com a moment to inject its modal, then start observing
        const timeoutId = setTimeout(() => {
            observer = new MutationObserver(() => {
                if (!modalOpenRef.current) return;

                // If there's no Cal.com iframe left, the modal was closed
                const calIframe = document.querySelector(
                    'iframe[src*="cal.com"]'
                );
                if (!calIframe) {
                    console.log("[Cal.com] modal closed (DOM observer)");
                    modalOpenRef.current = false;
                    observer?.disconnect();

                    if (!bookedRef.current) {
                        onCloseRef.current();
                    }
                    bookedRef.current = false;
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }, 2000);

        return () => {
            clearTimeout(timeoutId);
            observer?.disconnect();
        };
    }, [open, slug, prefill?.name, prefill?.email]);

    // Nothing to render — Cal.com manages its own overlay
    return null;
}
