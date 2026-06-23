/**
 * Maps Portuguese payment status labels to English DB constraint values.
 * orders.payment_status CHECK: 'pending' | 'paid' | 'partial' | 'cancelled'
 */

export type DbPaymentStatus = 'pending' | 'paid' | 'partial' | 'cancelled';
export type UIPaymentStatus = 'pendente' | 'pago' | 'parcial' | 'cancelado';

const TO_DB: Record<UIPaymentStatus, DbPaymentStatus> = {
  pendente: 'pending',
  pago: 'paid',
  parcial: 'partial',
  cancelado: 'cancelled',
};

const TO_UI: Record<DbPaymentStatus, UIPaymentStatus> = {
  pending: 'pendente',
  paid: 'pago',
  partial: 'parcial',
  cancelled: 'cancelado',
};

/**
 * Convert a UI payment status (Portuguese) to DB-safe English value.
 * Returns the input unchanged if already a valid DB value.
 */
export function toDbPaymentStatus(status: string): DbPaymentStatus {
  if (status in TO_DB) return TO_DB[status as UIPaymentStatus];
  if (status in TO_UI) return status as DbPaymentStatus;
  return 'pending';
}

/**
 * Convert a DB payment status (English) to UI label (Portuguese).
 * Returns the input unchanged if unknown.
 */
export function toUiPaymentStatus(status: string): string {
  if (status in TO_UI) return TO_UI[status as DbPaymentStatus];
  return status;
}
