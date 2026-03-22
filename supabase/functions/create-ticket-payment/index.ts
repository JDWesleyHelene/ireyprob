import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { eventId, eventTitle, buyerName, buyerEmail, amount, currency, quantity } = await req.json()

    if (!eventId || !buyerName || !buyerEmail || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      name: buyerName,
      email: buyerEmail,
    })

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: (currency || 'eur').toLowerCase(),
      customer: customer.id,
      description: `Ticket for ${eventTitle}`,
      metadata: {
        event_id: eventId,
        event_title: eventTitle,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        quantity: String(quantity || 1),
      },
    })

    // Save order to database
    const { data: order, error: dbError } = await supabase
      .from('ticket_orders')
      .insert({
        event_id: eventId,
        event_title: eventTitle,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        amount: amount,
        currency: currency || 'eur',
        payment_intent_id: paymentIntent.id,
        payment_status: 'pending',
        quantity: quantity || 1,
      })
      .select()
      .single()

    if (dbError) {
      console.error('DB error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret, orderId: order.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e: any) {
    console.error('create-ticket-payment error:', e)
    return new Response(
      JSON.stringify({ error: e?.message ?? 'Payment setup failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
