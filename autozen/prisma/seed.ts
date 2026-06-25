import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const superAdminPassword = await bcrypt.hash('admin123', 12)
  const userPassword = await bcrypt.hash('123456', 12)

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@autozen.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@autozen.com',
      password: superAdminPassword,
      role: 'super_admin',
    },
  })

  const company = await prisma.company.upsert({
    where: { slug: 'oficina-exemplo' },
    update: {},
    create: {
      name: 'Oficina Exemplo',
      slug: 'oficina-exemplo',
      cnpj: '12.345.678/0001-90',
      phone: '(11) 99999-9999',
      email: 'contato@oficinaexemplo.com.br',
      address: 'Rua das Oficinas, 123',
      city: 'São Paulo',
      state: 'SP',
      plan: 'pro',
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@oficina.com' },
    update: {},
    create: {
      name: 'Carlos Silva',
      email: 'admin@oficina.com',
      password: userPassword,
      role: 'admin',
      phone: '(11) 98888-8888',
      companyId: company.id,
    },
  })

  const employee = await prisma.user.upsert({
    where: { email: 'funcionario@oficina.com' },
    update: {},
    create: {
      name: 'João Santos',
      email: 'funcionario@oficina.com',
      password: userPassword,
      role: 'employee',
      phone: '(11) 97777-7777',
      companyId: company.id,
    },
  })

  const clients = [
    { name: 'Maria Oliveira', cpfCnpj: '123.456.789-00', phone: '(11) 96666-6666', whatsapp: '(11) 96666-6666', email: 'maria@email.com' },
    { name: 'Pedro Costa', cpfCnpj: '987.654.321-00', phone: '(11) 95555-5555', whatsapp: '(11) 95555-5555', email: 'pedro@email.com' },
    { name: 'Ana Pereira', cpfCnpj: '456.789.123-00', phone: '(11) 94444-4444', whatsapp: '(11) 94444-4444', email: 'ana@email.com' },
    { name: 'Roberto Almeida', cpfCnpj: '321.654.987-00', phone: '(11) 93333-3333', whatsapp: '(11) 93333-3333', email: 'roberto@email.com' },
    { name: 'Lucia Ferreira', cpfCnpj: '789.123.456-00', phone: '(11) 92222-2222', whatsapp: '(11) 92222-2222', email: 'lucia@email.com' },
  ]

  const createdClients = []
  for (const client of clients) {
    const c = await prisma.client.create({
      data: { ...client, companyId: company.id },
    })
    createdClients.push(c)
  }

  const vehicles = [
    { plate: 'ABC-1234', brand: 'Toyota', model: 'Corolla', year: 2022, color: 'Prata', km: 35000, clientId: createdClients[0].id },
    { plate: 'DEF-5678', brand: 'Honda', model: 'Civic', year: 2021, color: 'Preto', km: 42000, clientId: createdClients[1].id },
    { plate: 'GHI-9012', brand: 'Volkswagen', model: 'Golf', year: 2023, color: 'Branco', km: 15000, clientId: createdClients[2].id },
    { plate: 'JKL-3456', brand: 'Chevrolet', model: 'Onix', year: 2020, color: 'Vermelho', km: 58000, clientId: createdClients[3].id },
    { plate: 'MNO-7890', brand: 'Ford', model: 'Focus', year: 2019, color: 'Azul', km: 72000, clientId: createdClients[4].id },
    { plate: 'PQR-1122', brand: 'Hyundai', model: 'HB20', year: 2023, color: 'Cinza', km: 8000, clientId: createdClients[0].id },
  ]

  const createdVehicles = []
  for (const vehicle of vehicles) {
    const v = await prisma.vehicle.create({
      data: { ...vehicle, companyId: company.id },
    })
    createdVehicles.push(v)
  }

  const products = [
    { name: 'Óleo Motor 5W30', sku: 'OLEO001', category: 'Lubrificantes', costPrice: 35, salePrice: 65, stockQuantity: 50, minStock: 10, unit: 'L' },
    { name: 'Filtro de Ar', sku: 'FILT001', category: 'Filtros', costPrice: 25, salePrice: 55, stockQuantity: 30, minStock: 5, unit: 'un' },
    { name: 'Filtro de Óleo', sku: 'FILT002', category: 'Filtros', costPrice: 15, salePrice: 35, stockQuantity: 40, minStock: 10, unit: 'un' },
    { name: 'Pastilha de Freio', sku: 'FREI001', category: 'Freios', costPrice: 45, salePrice: 95, stockQuantity: 20, minStock: 5, unit: 'kit' },
    { name: 'Correia Dentada', sku: 'CORR001', category: 'Motor', costPrice: 40, salePrice: 85, stockQuantity: 15, minStock: 3, unit: 'un' },
    { name: 'Vela de Ignição', sku: 'VELA001', category: 'Ignição', costPrice: 12, salePrice: 28, stockQuantity: 60, minStock: 15, unit: 'un' },
    { name: 'Líquido de Arrefecimento', sku: 'LIQ001', category: 'Fluidos', costPrice: 18, salePrice: 40, stockQuantity: 25, minStock: 5, unit: 'L' },
    { name: 'Fluido de Freio DOT4', sku: 'FLU001', category: 'Fluidos', costPrice: 15, salePrice: 35, stockQuantity: 20, minStock: 5, unit: 'L' },
  ]

  const createdProducts = []
  for (const product of products) {
    const p = await prisma.product.create({
      data: { ...product, companyId: company.id },
    })
    createdProducts.push(p)
  }

  const suppliers = [
    { name: 'Auto Peças Brasil', cnpj: '11.222.333/0001-44', phone: '(11) 3333-4444', email: 'vendas@autopecas.com.br', contactName: 'Fernando' },
    { name: 'Distribuidora Premium', cnpj: '22.333.444/0001-55', phone: '(11) 4444-5555', email: 'comercial@premium.com.br', contactName: 'Roberta' },
  ]

  for (const supplier of suppliers) {
    await prisma.supplier.create({
      data: { ...supplier, companyId: company.id },
    })
  }

  const now = new Date()
  const orders = [
    { number: 1001, status: 'pending', description: 'Troca de óleo e filtros', totalValue: 250, finalValue: 250, clientId: createdClients[0].id, vehicleId: createdVehicles[0].id },
    { number: 1002, status: 'in_progress', description: 'Revisão completa', totalValue: 480, discount: 30, finalValue: 450, clientId: createdClients[1].id, vehicleId: createdVehicles[1].id },
    { number: 1003, status: 'completed', description: 'Troca de pastilhas de freio', totalValue: 320, finalValue: 320, clientId: createdClients[2].id, vehicleId: createdVehicles[2].id },
    { number: 1004, status: 'delivered', description: 'Alinhamento e balanceamento', totalValue: 180, finalValue: 180, clientId: createdClients[3].id, vehicleId: createdVehicles[3].id },
    { number: 1005, status: 'pending', description: 'Troca de correia dentada', totalValue: 380, finalValue: 380, clientId: createdClients[4].id, vehicleId: createdVehicles[4].id },
  ]

  for (const order of orders) {
    await prisma.serviceOrder.create({
      data: {
        ...order,
        companyId: company.id,
        creatorId: admin.id,
        startDate: order.status !== 'pending' ? now : null,
      },
    })
  }

  const financial = [
    { type: 'income', description: 'Serviço OS #1001', amount: 250, category: 'Serviços', dueDate: now, paidDate: now, status: 'paid', paymentMethod: 'pix' },
    { type: 'income', description: 'Serviço OS #1002', amount: 450, category: 'Serviços', dueDate: now, status: 'pending' },
    { type: 'income', description: 'Serviço OS #1003', amount: 320, category: 'Serviços', dueDate: now, paidDate: now, status: 'paid', paymentMethod: 'card' },
    { type: 'expense', description: 'Compra de óleo', amount: 1200, category: 'Estoque', dueDate: now, paidDate: now, status: 'paid', paymentMethod: 'transfer' },
    { type: 'expense', description: 'Aluguel', amount: 4500, category: 'Despesa Fixa', dueDate: now, status: 'pending' },
    { type: 'expense', description: 'Energia elétrica', amount: 380, category: 'Despesa Fixa', dueDate: now, status: 'pending' },
  ]

  for (const record of financial) {
    await prisma.financialRecord.create({
      data: { ...record, companyId: company.id },
    })
  }

  const appointments = [
    { title: 'Troca de óleo - Toyota Corolla', date: new Date(now.getTime() + 86400000), clientId: createdClients[0].id, vehicleId: createdVehicles[0].id, companyId: company.id },
    { title: 'Revisão 50km - Honda Civic', date: new Date(now.getTime() + 172800000), clientId: createdClients[1].id, vehicleId: createdVehicles[1].id, companyId: company.id },
    { title: 'Alinhamento - VW Golf', date: new Date(now.getTime() + 259200000), clientId: createdClients[2].id, vehicleId: createdVehicles[2].id, companyId: company.id },
  ]

  for (const appointment of appointments) {
    await prisma.appointment.create({ data: appointment })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
