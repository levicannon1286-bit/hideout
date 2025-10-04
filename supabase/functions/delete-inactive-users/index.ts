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
    console.log('Running inactive user deletion job');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Calculate date 2 weeks ago
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Delete users inactive for 2 weeks
    const { data: deletedUsers, error } = await supabase
      .from('users')
      .delete()
      .lt('last_active', twoWeeksAgo.toISOString())
      .select();

    if (error) {
      console.error('Error deleting inactive users:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to delete inactive users' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Deleted ${deletedUsers?.length || 0} inactive users`);

    return new Response(
      JSON.stringify({ 
        message: `Deleted ${deletedUsers?.length || 0} inactive users`,
        deletedCount: deletedUsers?.length || 0
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in delete-inactive-users function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});