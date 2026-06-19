import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://rpakyjmdijhmpqsnnjke.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  // 1. Get the exact constraint definition
  const { data: defs, error: e1 } = await s.rpc('exec_sql', {
    sql: "SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'orders'::regclass AND contype = 'c'"
  });
  console.log('=== CONSTRAINT DEFINITIONS ===');
  console.log(JSON.stringify(defs, null, 2));
  if (e1) console.error('Error:', e1);

  // 2. Try inserting with each possible value to confirm
  // Get a valid order first to clone
  const { data: refOrder } = await s.from('orders').select('id').limit(1).single();
  if (!refOrder) { console.log('No reference order found'); return; }

  const { data: ref } = await s.from('orders').select('*').eq('id', refOrder.id).single();
  if (!ref) { console.log('Could not get reference'); return; }

  const testVals = ['pendente', 'pago', 'Pago', 'PENDENTE', 'Pago', 'paid', 'pending'];
  console.log('\n=== TESTING VALUES ===');
  for (const v of testVals) {
    const { data, error } = await s.from('orders')
      .insert({
        company_id: ref.company_id,
        number: ref.number + 1000,
        client_id: ref.client_id,
        vehicle_id: ref.vehicle_id,
        kanban_status: 'aguardando',
        status: 'aberta',
        payment_status: v,
        total: 10,
      })
      .select('id');
    if (data) {
      console.log(`✅ '${v}' — SUCCESS (id: ${data[0].id})`);
      await s.from('orders').delete().eq('id', data[0].id);
    } else {
      console.log(`❌ '${v}' — FAILED: ${error?.message?.slice(0, 100)}`);
    }
  }
}

main().catch(console.error);
