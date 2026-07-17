'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, Car, User, GripVertical, MessageSquare, Eye, Pencil, DollarSign, Camera, Printer, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const paymentColors: Record<string, string> = {
    pago: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    pendente: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    cancelado: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-xl border border-border/40 bg-card/60 backdrop-blur-md",
        "transition-all duration-300 overflow-hidden",
        isDragging ? "shadow-2xl shadow-indigo-500/20 border-indigo-500/50 scale-105" : "hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5"
      )}
    >
      {/* Accent strip based on status */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1 opacity-60",
        order.kanban_status === 'aguardando' ? 'bg-amber-500' :
        order.kanban_status === 'lavando' ? 'bg-indigo-500' :
        order.kanban_status === 'finalizando' ? 'bg-violet-500' :
        'bg-emerald-500'
      )} />

      <div className="p-3.5 pl-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-foreground transition-colors p-0.5 rounded -ml-1"
              aria-label="Arrastar OS"
            >
              <GripVertical className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground/70 uppercase">
              OS #{order.number}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {(order.payment_status || order.payment_method) && (
              <Badge variant="secondary" className={cn("text-[10px] font-bold px-1.5 py-0 border", order.payment_method ? paymentColors.pago : paymentColors.pendente)}>
                {order.payment_method ? 'PAGO' : 'PEND.'}
              </Badge>
            )}
            <Car className="w-3.5 h-3.5 text-indigo-400" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-foreground truncate flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
            {clientName}
          </p>
          <p className="text-xs text-muted-foreground truncate flex items-center gap-2 pl-[22px]">
            {vehicleInfo}
          </p>
        </div>

        {/* Value and Time */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
          <div className="flex items-center gap-3 w-full">
            <span className={cn(
              "text-[11px] font-medium flex items-center gap-1.5",
              order.total && Number(order.total) > 0 ? "text-emerald-400" : "text-muted-foreground/50"
            )}>
              <DollarSign className="w-3 h-3" />
              {order.total && Number(order.total) > 0 
                ? Number(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                : '0,00'}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5 ml-auto bg-muted/40 px-2 py-1 rounded-md">
              <Clock className="w-3 h-3 text-muted-foreground/60" /> {elapsed}
            </span>
          </div>
        </div>

        {/* Action Buttons (Appears on Hover for cleaner UI, or always visible if on mobile) */}
        <div className="grid grid-cols-7 gap-1 mt-3 pt-2 border-t border-border/30 opacity-60 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onView(order.id)}
            className="h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors tooltip-trigger" title="Visualizar">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onEdit(order)}
            className="h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Editar">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onPayment(order)}
            className="h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Receber Pagamento">
            <DollarSign className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onPhotos(order.id)}
            className="h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-violet-400 hover:bg-violet-500/10 transition-colors" title="Anexar Fotos">
            <Camera className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onPrint(order)}
            className="h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Imprimir OS">
            <Printer className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onCancel(order)}
            className="h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors" title="Cancelar">
            <XCircle className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onNotify(order)}
            className="h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Notificar via WhatsApp">
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
