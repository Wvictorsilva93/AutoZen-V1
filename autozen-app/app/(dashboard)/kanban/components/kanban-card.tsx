'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, Car, User, GripVertical, MessageSquare, Eye, Pencil, DollarSign, Camera, Printer, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CardData {
  id: string; number: number; client_id: string; vehicle_id: string;
  kanban_status: string; created_at: string; updated_at: string;
  description?: string; total?: number; payment_status?: string; payment_method?: string;
}

interface KanbanCardProps {
  order: CardData;
  clientName: string;
  vehicleInfo: string;
  elapsed: string;
  onView: (id: string) => void;
  onEdit: (order: CardData) => void;
  onPayment: (order: CardData) => void;
  onPhotos: (id: string) => void;
  onPrint: (order: CardData) => void;
  onCancel: (order: CardData) => void;
  onNotify: (order: CardData) => void;
}

export default function KanbanCard({
  order, clientName, vehicleInfo, elapsed,
  onView, onEdit, onPayment, onPhotos, onPrint, onCancel, onNotify,
}: KanbanCardProps) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const paymentColors: Record<string, string> = {
    pago: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    pendente: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    cancelado: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-border bg-card hover:border-blue-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5"
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <button {...attributes} {...listeners}
              className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 transition-colors">
              <GripVertical className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono text-slate-500">#{order.number}</span>
          </div>
          <div className="flex items-center gap-1">
            {(order.payment_status || order.payment_method) && (
              <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 border ${order.payment_method ? paymentColors.pago : paymentColors.pendente}`}>
                {order.payment_method ? 'Pago' : 'Pend.'}
              </Badge>
            )}
            <Car className="w-3 h-3 text-blue-400" />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-white truncate flex items-center gap-1.5">
            <User className="w-3 h-3 text-slate-500 shrink-0" />
            {clientName}
          </p>
          <p className="text-xs text-slate-400 truncate flex items-center gap-1.5">
            <span className="shrink-0">{vehicleInfo}</span>
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            {order.total && Number(order.total) > 0 && (
              <span className="text-xs font-medium text-emerald-400">
                R$ {Number(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {elapsed}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-border/30">
          <button onClick={() => onView(order.id)}
            className="flex-1 h-7 rounded flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Visualizar">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onEdit(order)}
            className="flex-1 h-7 rounded flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Editar">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onPayment(order)}
            className="flex-1 h-7 rounded flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Receber Pagamento">
            <DollarSign className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onPhotos(order.id)}
            className="flex-1 h-7 rounded flex items-center justify-center text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors" title="Anexar Fotos">
            <Camera className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onPrint(order)}
            className="flex-1 h-7 rounded flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-700/30 transition-colors" title="Imprimir OS">
            <Printer className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onCancel(order)}
            className="flex-1 h-7 rounded flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Cancelar">
            <XCircle className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onNotify(order)}
            className="flex-1 h-7 rounded flex items-center justify-center text-emerald-500/60 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="WhatsApp">
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
