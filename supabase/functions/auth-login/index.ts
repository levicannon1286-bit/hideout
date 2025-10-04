import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, secretKey } = await req.json();

    console.log('Login attempt for username:', username);

    // Validate inputs
    if (!username || !secretKey) {
      return new Response(
        JSON.stringify({ error: 'Username and secret key are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash the secret key
    const encoder = new TextEncoder();
    const data = encoder.encode(secretKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const secretKeyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find user
    const { data: user, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('secret_key_hash', secretKeyHash)
      .single();

    if (selectError || !user) {
      console.log('Invalid credentials for username:', username);
      return new Response(
        JSON.stringify({ error: 'Invalid username or secret key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update last_active
    await supabase
      .from('users')
      .update({ last_active: new Date().toISOString() })
      .eq('id', user.id);

    console.log('User logged in successfully:', user.id);

    return new Response(
      JSON.stringify({ user: { id: user.id, username: user.username, secretKey } }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in login function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});