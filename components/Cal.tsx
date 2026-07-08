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

/** Check whether a Cal.com modal iframe is currently visible in the DOM. */
function isCalModalVisible(): boolean {
    const iframe = document.querySelector(
        'iframe[src*="cal.com"]'
    ) as HTMLElement | null;

    if (!iframe) return false;

    // Removed from DOM tree
    if (!document.body.contains(iframe)) return false;

    // Hidden via CSS (display:none, visibility:hidden, or 0-sized)
    const style = getComputedStyle(iframe);
    if (style.display === "none" || style.visibility === "hidden") return false;

    const rect = iframe.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;

    return true;
}

export function SlotSelector({
    calLink,
    open,
    onClose,
    onBooked,
    prefill,
}: SlotSelectorProps) {
    const slug = toSlug(calLink);

    const onBookedRef = useRef(onBooked);
    const onCloseRef = useRef(onClose);
    onBookedRef.current = onBooked;
    onCloseRef.current = onClose;

    const bookedRef = useRef(false);
    const calRef = useRef<any>(null);

    // ── Init Cal.com SDK + register booking listener ONCE ──
    useEffect(() => {
        let mounted = true;

        (async () => {
            const cal = await getCalApi();
            if (!mounted) return;
            calRef.current = cal;

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

        return () => { mounted = false; };
    }, []);

    // ── Open modal + poll for close ──
    useEffect(() => {
        if (!open) return;

        bookedRef.current = false;

        // Guard against React Strict Mode's double-invoke in dev,
        // which can call openModal() twice before the first iframe
        // finishes mounting and crash the Cal.com embed SDK.
        let cancelled = false;

        // Open the Cal.com modal
        const openModal = async () => {
            const cal = calRef.current ?? (await getCalApi());
            calRef.current = cal;

            // Small delay lets the previous (Strict Mode duplicate)
            // effect's cleanup run first before we open a new modal.
            await new Promise((resolve) => setTimeout(resolve, 50));
            if (cancelled) return;

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

        // Poll to detect when the Cal.com modal disappears.
        // Phase 1 — wait for the iframe to appear in the DOM.
        // Phase 2 — once it appeared, detect when it's gone → fire onClose.
        let appeared = false;
        const pollId = setInterval(() => {
            const visible = isCalModalVisible();

            if (!appeared) {
                if (visible) {
                    appeared = true;
                    console.log("[Cal.com] modal appeared in DOM");
                }
            } else {
                // It was visible before, now it's gone → modal was closed
                if (!visible) {
                    console.log("[Cal.com] modal closed (poll detected)");
                    clearInterval(pollId);

                    if (!bookedRef.current) {
                        onCloseRef.current();
                    }
                    bookedRef.current = false;
                }
            }
        }, 400);

        return () => {
            cancelled = true;
            clearInterval(pollId);
        };
    }, [open, slug, prefill?.name, prefill?.email]);

    return null;
}        bookedRef.current = false;
                }
            }
        }, 400);

<<<<<<< HEAD
        return () => {
            cancelled = true;
            clearInterval(pollId);
        };
=======
        return () => clearInterval(pollId);
>>>>>>> 15a0746c1eed0eb885cad3a223acf8165165f983
    }, [open, slug, prefill?.name, prefill?.email]);

    return null;
}
