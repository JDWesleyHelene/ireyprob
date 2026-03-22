-- Migration: Stripe ticketing - ticket_orders table + ticket_price/tickets_available on events
-- Timestamp: 20260316170000

-- Add ticket_price and tickets_available columns to events table
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS ticket_price NUMERIC(10,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS tickets_available INTEGER DEFAULT NULL;

-- Create ticket_orders table
CREATE TABLE IF NOT EXISTS public.ticket_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  event_title TEXT NOT NULL DEFAULT '',
  buyer_name TEXT NOT NULL DEFAULT '',
  buyer_email TEXT NOT NULL DEFAULT '',
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'eur',
  payment_intent_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  stripe_charge_id TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ticket_orders_event_id ON public.ticket_orders(event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_orders_payment_intent_id ON public.ticket_orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_ticket_orders_buyer_email ON public.ticket_orders(buyer_email);

ALTER TABLE public.ticket_orders ENABLE ROW LEVEL SECURITY;

-- Public can insert (buy tickets)
DROP POLICY IF EXISTS "public_can_insert_ticket_orders" ON public.ticket_orders;
CREATE POLICY "public_can_insert_ticket_orders"
ON public.ticket_orders
FOR INSERT
TO public
WITH CHECK (true);

-- Admins can read all ticket orders
DROP POLICY IF EXISTS "admin_can_read_ticket_orders" ON public.ticket_orders;
CREATE POLICY "admin_can_read_ticket_orders"
ON public.ticket_orders
FOR SELECT
TO authenticated
USING (true);

-- Admins can update ticket orders (for payment status updates)
DROP POLICY IF EXISTS "admin_can_update_ticket_orders" ON public.ticket_orders;
CREATE POLICY "admin_can_update_ticket_orders"
ON public.ticket_orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
