'use client';

/** Exporta um array de objetos para CSV e dispara o download. */
export function exportCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (val: unknown) => {
    const s = val === null || val === undefined ? '' : String(val);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Abre uma janela de impressão (PDF via navegador) com um HTML simples. */
export function printReport(title: string, bodyHtml: string) {
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(`<!doctype html><html><head><title>${title}</title>
  <meta charset="utf-8"/>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;color:#111;padding:32px;}
    h1{font-size:20px;margin:0 0 4px;}
    .sub{color:#666;font-size:12px;margin-bottom:24px;}
    table{width:100%;border-collapse:collapse;font-size:13px;}
    th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #e5e7eb;}
    th{background:#f8fafc;}
    .tot{margin-top:16px;font-weight:bold;}
  </style></head><body>
  <h1>${title}</h1>
  <div class="sub">AutoZen · gerado em ${new Date().toLocaleString('pt-BR')}</div>
  ${bodyHtml}
  <script>window.onload=()=>{window.print();}</script>
  </body></html>`);
  w.document.close();
}
