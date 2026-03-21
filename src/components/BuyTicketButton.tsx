"use client";
import Link from "next/link";

interface Props {
  eventId?: string;
  eventTitle?: string;
  ticketPrice?: number;
  currency?: string;
}

export default function BuyTicketButton({ eventTitle }: Props) {
  return (
    <Link
      href="/contact"
      className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-[12px] font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-accent transition-all duration-300"
    >
      Get Tickets — {eventTitle}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
