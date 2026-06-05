// AutoZen - Health Check API
// Rota para verificar se a aplicação está funcionando

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AutoZen API',
    version: '1.0.0',
  });
}
