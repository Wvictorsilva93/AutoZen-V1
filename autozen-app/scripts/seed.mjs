import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'admin@autozen.com';
const ADMIN_PASS = '123456';

const SUPABASE_URL = 'https://rpakyjmdijhmpqsnnjke.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('❌ Defina SUPABASE_SERVICE_ROLE_KEY no ambiente');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('🌱 Populando dados mock do AutoZen...\n');

  // --- Limpeza de dados anteriores ---
  const { data: existingCompany } = await supabase.from('companies')
    .select('id').eq('responsible_name', 'Admin').maybeSingle();
  if (existingCompany) {
    const oldCid = existingCompany.id;
    const { data: oldOrders } = await supabase.from('orders').select('id').eq('company_id', oldCid);
    const oldIds = oldOrders?.map(o => o.id) ?? [];
    if (oldIds.length) {
      await supabase.from('os_photos').delete().in('os_id', oldIds);
      await supabase.from('order_services').delete().in('order_id', oldIds);
    }
    await supabase.from('orders').delete().eq('company_id', oldCid);
    await supabase.from('vehicles').delete().eq('company_id', oldCid);
    await supabase.from('clients').delete().eq('company_id', oldCid);
    await supabase.from('employees').delete().eq('company_id', oldCid);
    await supabase.from('services').delete().eq('company_id', oldCid);
    console.log(`🗑️ Dados anteriores da empresa ${oldCid} removidos`);
  }

  // 1. Cria empresa
  let company;
  const { data: comp, error: ce } = await supabase.from('companies')
    .insert({ name: 'Lava Rápido Top', responsible_name: 'Admin', phone: '11999999999', plan: 'basic', status: 'active' })
    .select('id').single();
  if (ce && ce.code === '23505') {
    const { data: existing } = await supabase.from('companies')
      .select('id').eq('responsible_name', 'Admin').single();
    if (!existing) { console.error('Erro: empresa duplicada mas não encontrada'); return; }
    company = existing;
    console.log(`✅ Empresa já existia: ${company.id}`);
  } else if (ce) {
    console.error('Erro company:', ce); return;
  } else {
    company = comp;
    console.log(`✅ Empresa criada: ${company.id}`);
  }
  const cid = company.id;

  // 2. Cria ou obtém usuário admin
  let uid;
  const { data: created, error: ae } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL, password: ADMIN_PASS, email_confirm: true,
    user_metadata: { name: 'Admin', role: 'admin_empresa', company_id: cid, phone: '11999999999' },
  });
  if (created?.user) {
    uid = created.user.id;
    console.log(`✅ Admin criado: ${ADMIN_EMAIL} / ${ADMIN_PASS} (${uid})`);
  } else if (ae && ae.code === 'email_exists') {
    // Usuário já existe — busca via listUsers (filtro manual)
    const { data: list } = await supabase.auth.admin.listUsers();
    const found = list?.users.find(u => u.email === ADMIN_EMAIL);
    if (!found) { console.error('Admin existe mas não encontrado na listagem'); return; }
    uid = found.id;
    console.log(`✅ Admin já existia: ${ADMIN_EMAIL} (${uid})`);
    await supabase.auth.admin.updateUserById(uid, {
      user_metadata: { name: 'Admin', role: 'admin_empresa', company_id: cid, phone: '11999999999' },
    });
  } else {
    console.error('Erro auth:', ae); return;
  }

  // 3. Cria profile
  await supabase.from('profiles').upsert({
    user_id: uid, company_id: cid, name: 'Admin', role: 'admin_empresa', email: ADMIN_EMAIL, phone: '11999999999',
  }, { onConflict: 'user_id' });

  // 4. Serviços
  const svcs = [
    { company_id: cid, name: 'Lavagem Completa', price: 59.90, estimated_time: 30, category: 'Lavagem', vehicle_type: 'carro', active: true },
    { company_id: cid, name: 'Lavagem Simples', price: 29.90, estimated_time: 15, category: 'Lavagem', vehicle_type: 'carro', active: true },
    { company_id: cid, name: 'Lavagem Moto', price: 19.90, estimated_time: 10, category: 'Lavagem', vehicle_type: 'moto', active: true },
    { company_id: cid, name: 'Cera Líquida', price: 39.90, estimated_time: 20, category: 'Acabamento', vehicle_type: 'carro', active: true },
    { company_id: cid, name: 'Polimento Completo', price: 149.90, estimated_time: 90, category: 'Polimento', vehicle_type: 'carro', active: true },
    { company_id: cid, name: 'Higienização Interna', price: 89.90, estimated_time: 60, category: 'Higienização', vehicle_type: 'carro', active: true },
    { company_id: cid, name: 'Lavagem de Motor', price: 49.90, estimated_time: 30, category: 'Lavagem', vehicle_type: 'carro', active: true },
    { company_id: cid, name: 'Vidros Insulfilm (Limpeza)', price: 25.00, estimated_time: 15, category: 'Acabamento', vehicle_type: 'carro', active: true },
    { company_id: cid, name: 'Odorizante', price: 19.90, estimated_time: 10, category: 'Higienização', vehicle_type: 'ambos', active: true },
  ];
  const { data: services, error: sve } = await supabase.from('services').insert(svcs).select();
  if (sve) { console.error('Erro services:', sve); return; }
  console.log(`✅ ${services.length} serviços criados`);

  // 5. Funcionários
  const funcs = [
    { company_id: cid, name: 'Carlos Silva', phone: '11911111111', role: 'Lavador', commission_percentage: 10, active: true },
    { company_id: cid, name: 'Ana Oliveira', phone: '11922222222', role: 'Lavadora', commission_percentage: 10, active: true },
    { company_id: cid, name: 'Pedro Santos', phone: '11933333333', role: 'Polidor', commission_percentage: 12, active: true },
    { company_id: cid, name: 'Marina Costa', phone: '11944444444', role: 'Recepcionista', commission_percentage: 5, active: true },
    { company_id: cid, name: 'João Lima', phone: '11955555555', role: 'Lavador', commission_percentage: 10, active: true },
  ];
  const { data: employees, error: fee } = await supabase.from('employees').insert(funcs).select();
  if (fee) { console.error('Erro employees:', fee); return; }
  console.log(`✅ ${employees.length} funcionários criados`);

  // 6. Clientes com veículos
  const clientData = [
    { name: 'Roberto Almeida', phone: '11966666611', email: 'roberto@email.com', total_visits: 15 },
    { name: 'Fernanda Costa', phone: '11966666622', email: 'fernanda@email.com', total_visits: 8 },
    { name: 'Lucas Pereira', phone: '11966666633', email: 'lucas@email.com', total_visits: 3 },
    { name: 'Juliana Martins', phone: '11966666644', email: 'juliana@email.com', total_visits: 22 },
    { name: 'Thiago Barbosa', phone: '11966666655', email: 'thiago@email.com', total_visits: 1 },
    { name: 'Camila Rocha', phone: '11966666666', email: 'camila@email.com', total_visits: 5 },
    { name: 'Eduardo Lima', phone: '11966666677', email: 'eduardo@email.com', total_visits: 12 },
    { name: 'Patrícia Souza', phone: '11966666688', email: 'patricia@email.com', total_visits: 7 },
    { name: 'Gustavo Nunes', phone: '11966666699', email: 'gustavo@email.com', total_visits: 4 },
    { name: 'Amanda Oliveira', phone: '11966666600', email: 'amanda@email.com', total_visits: 10 },
  ];

  const allClients = [];
  for (const c of clientData) {
    const { data: client } = await supabase.from('clients')
      .insert({ ...c, company_id: cid }).select('id').single();
    if (client) allClients.push(client);
  }
  console.log(`✅ ${allClients.length} clientes criados`);

  // 7. Veículos
  const vehicleData = [
    { plate: 'ABC1D23', brand: 'Fiat', model: 'Uno', color: 'Branco', type: 'carro', year: 2020 },
    { plate: 'DEF4G56', brand: 'Volkswagen', model: 'Gol', color: 'Preto', type: 'carro', year: 2021 },
    { plate: 'GHI7J89', brand: 'Chevrolet', model: 'Onix', color: 'Prata', type: 'carro', year: 2022 },
    { plate: 'JKL0M12', brand: 'Honda', model: 'Civic', color: 'Azul', type: 'carro', year: 2023 },
    { plate: 'MNO3P45', brand: 'Toyota', model: 'Corolla', color: 'Branco', type: 'carro', year: 2022 },
    { plate: 'PQR6S78', brand: 'Yamaha', model: 'Fazer 250', color: 'Vermelha', type: 'moto', year: 2021 },
    { plate: 'STU9V01', brand: 'Honda', model: 'CB 500', color: 'Preta', type: 'moto', year: 2023 },
    { plate: 'VWX2Y34', brand: 'Jeep', model: 'Renegade', color: 'Verde', type: 'suv', year: 2024 },
    { plate: 'YZA5B67', brand: 'Nissan', model: 'Kicks', color: 'Cinza', type: 'suv', year: 2023 },
    { plate: 'BCD8E90', brand: 'Ford', model: 'Ka', color: 'Vermelho', type: 'carro', year: 2019 },
  ];

  const allVehicles = [];
  for (let i = 0; i < vehicleData.length; i++) {
    const v = vehicleData[i];
    const { data: vehicle } = await supabase.from('vehicles')
      .insert({ ...v, company_id: cid, client_id: allClients[i].id }).select('id').single();
    if (vehicle) allVehicles.push(vehicle);
  }
  console.log(`✅ ${allVehicles.length} veículos criados`);

  // 8. Ordens de Serviço em vários status
  //   Pegamos um número máximo atual e incrementamos
  const { data: maxOrd } = await supabase.from('orders').select('number').order('number', { ascending: false }).limit(1);
  let nextNum = (maxOrd?.[0]?.number ?? 999) + 1;

  const statuses = [
    { ks: 'aguardando', s: 'aberta', ps: 'pendente', count: 4 },
    { ks: 'lavando', s: 'aberta', ps: 'pendente', count: 3 },
    { ks: 'finalizando', s: 'aberta', ps: 'pendente', count: 2 },
    { ks: 'pronto', s: 'aberta', ps: 'pendente', count: 2 },
    { ks: 'pronto', s: 'finalizada', ps: 'pendente', count: 3 },
  ];

  let orderCount = 0;
  for (const st of statuses) {
    for (let i = 0; i < st.count; i++) {
      const ci = (orderCount + i) % allClients.length;
      const vi = (orderCount + i) % allVehicles.length;
      const svc1 = services[orderCount % services.length];
      const svc2 = services[(orderCount + 1) % services.length];
      const total = svc1.price + (svc2?.price ?? 0);

      const { data: order, error: oe } = await supabase.from('orders')
        .insert({
          company_id: cid, number: nextNum++, client_id: allClients[ci].id,
          vehicle_id: allVehicles[vi].id,
          kanban_status: st.ks, status: st.s, payment_status: st.ps,
          total,
          description: `OS de teste #${nextNum - 1} - ${st.ks}`,
        })
        .select('id').single();

      if (order) {
        await supabase.from('order_services')
          .insert([
            { order_id: order.id, service_id: svc1.id, quantity: 1, price: svc1.price },
            { order_id: order.id, service_id: svc2.id, quantity: 1, price: svc2.price },
          ]);
        orderCount++;
      } else {
        console.error('Erro order:', oe);
      }
    }
  }
  console.log(`✅ ${orderCount} ordens de serviço criadas`);

  console.log('\n🎉 Seed concluído!');
  console.log('   Login: admin@autozen.com');
  console.log('   Senha: 123456');
}

main().catch(console.error);
