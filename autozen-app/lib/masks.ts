// Máscaras de input do AutoZen (sem dependências)

export function maskPhone(v: string): string {
  const d = (v ?? '').replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) {
    return d
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .trim();
  }
  return d
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export function maskPlate(v: string): string {
  const s = (v ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
  // Mercosul (ABC1D23) não usa hífen; padrão antigo ABC-1234
  if (/^[A-Z]{3}\d[A-Z]\d{2}$/.test(s)) return s;
  if (s.length > 3) return s.slice(0, 3) + '-' + s.slice(3);
  return s;
}

export function maskCNPJ(v: string): string {
  const d = (v ?? '').replace(/\D/g, '').slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

/** Recebe dígitos e devolve string monetária "1.234,56". */
export function maskCurrency(v: string): string {
  const d = (v ?? '').replace(/\D/g, '');
  if (!d) return '';
  const n = (parseInt(d, 10) / 100);
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Converte string mascarada "1.234,56" em número 1234.56. */
export function parseCurrency(v: string): number {
  if (!v) return 0;
  const clean = v.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '');
  return Number(clean) || 0;
}
