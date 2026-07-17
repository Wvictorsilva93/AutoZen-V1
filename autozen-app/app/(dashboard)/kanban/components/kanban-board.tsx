'use client';

import { useMemo, useState } from 'react';
import {
  DndContext, DragOverlay, DragStartEvent, DragEndEvent, DragOverEvent,
  PointerSensor, useSensor, useSensors, closestCorners,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './kanban-card';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CardData {
  id: string; number: number; client_id: string; vehicle_id: string;
  kanban_status: string; created_at: string; updated_at: string;
  description?: string; total?: number; payment_status?: string;
}

const columns: { id: string; title: string; color: string; bgGlow: string }[] = [
  { id: 'aguardando', title: 'Aguardando', color: 'bg-amber-500', bgGlow: 'hover:shadow-amber-500/10' },
  { id: 'lavando', title: 'Em Andamento', color: 'bg-indigo-500', bgGlow: 'hover:shadow-indigo-500/10' },
  { id: 'finalizando', title: 'Finalizando', color: 'bg-violet-500', bgGlow: 'hover:shadow-violet-500/10' },
  { id: 'pronto', title: 'Pronto', color: 'bg-emerald-500', bgGlow: 'hover:shadow-emerald-500/10' },
];

export { columns };

interface ColumnContainerProps {
  col: typeof columns[0];
  cards: CardData[];
  clients: { id: string; name?: string }[];
  vehicles: { id: string; plate?: string; brand?: string; model?: string }[];
  elapsed: (iso: string) => string;
  onView: (id: string) => void;
  onEdit: (order: CardData) => void;
  onPayment: (order: CardData) => void;
  onPhotos: (id: string) => void;
  onPrint: (order: CardData) => void;
  onCancel: (order: CardData) => void;
  onNotify: (order: CardData) => void;
}

function ColumnContainer({ col, cards, clients, vehicles, elapsed, onView, onEdit, onPayment, onPhotos, onPrint, onCancel, onNotify }: ColumnContainerProps) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? '—';
  const vehicleInfo = (id: string) => {
    const v = vehicles.find((ve) => ve.id === id);
    if (!v) return '—';
    return [v.plate, v.brand, v.model].filter(Boolean).join(' ');
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-2xl border border-border/40 p-3 transition-all duration-300",
        "bg-card/40 backdrop-blur-sm shadow-sm",
        col.bgGlow,
        isOver && "bg-muted/40 border-primary/40 shadow-lg scale-[1.01]"
      )}
    >
      <div className="flex items-center justify-between mb-4 px-2 pt-1">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full ring-2 ring-offset-1 ring-offset-card", col.color, `${col.color}/30`)} />
          <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">{col.title}</h3>
        </div>
        <span className="text-xs font-bold bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
          {cards.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2.5 scrollbar-thin min-h-[150px] p-1 pb-4">
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard
              key={card.id}
              order={card}
              clientName={clientName(card.client_id)}
              vehicleInfo={vehicleInfo(card.vehicle_id)}
              elapsed={elapsed(card.updated_at || card.created_at)}
              onView={onView}
              onEdit={onEdit}
              onPayment={onPayment}
              onPhotos={onPhotos}
              onPrint={onPrint}
              onCancel={onCancel}
              onNotify={onNotify}
            />
          ))}
        </SortableContext>
        
        {cards.length === 0 && (
          <div className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-border/40 rounded-xl bg-muted/10 opacity-60">
            <p className="text-xs font-medium text-muted-foreground/60">Solte as OS aqui</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface KanbanBoardProps {
  orders: CardData[];
  clients: { id: string; name?: string }[];
  vehicles: { id: string; plate?: string; brand?: string; model?: string }[];
  elapsed: (iso: string) => string;
  onMove: (orderId: string, toStatus: string) => void;
  onView: (id: string) => void;
  onEdit: (order: CardData) => void;
  onPayment: (order: CardData) => void;
  onPhotos: (id: string) => void;
  onPrint: (order: CardData) => void;
  onCancel: (order: CardData) => void;
  onNotify: (order: CardData) => void;
}

export default function KanbanBoard({
  orders, clients, vehicles, elapsed,
  onMove, onView, onEdit, onPayment, onPhotos, onPrint, onCancel, onNotify,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
    document.body.style.cursor = 'grabbing';
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    document.body.style.cursor = '';
    const { active, over } = event;
    if (!over) return;
    
    const orderId = active.id as string;
    const colId = over.id as string;
    
    if (Object.keys(columnsMap).includes(colId)) {
      const order = orders.find((o) => o.id === orderId);
      if (order && order.kanban_status !== colId) {
        onMove(orderId, colId);
      }
    }
  }

  const columnsMap = useMemo(() => Object.fromEntries(columns.map((c) => [c.id, c])), []);
  
  // Find active card for overlay
  const activeCard = useMemo(() => {
    if (!activeId) return null;
    return orders.find(o => o.id === activeId);
  }, [activeId, orders]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-[calc(100vh-16rem)] min-h-[500px]">
        {columns.map((col) => {
          const cards = orders.filter((o) => o.kanban_status === col.id);
          return (
            <ColumnContainer
              key={col.id}
              col={col}
              cards={cards}
              clients={clients}
              vehicles={vehicles}
              elapsed={elapsed}
              onView={onView}
              onEdit={onEdit}
              onPayment={onPayment}
              onPhotos={onPhotos}
              onPrint={onPrint}
              onCancel={onCancel}
              onNotify={onNotify}
            />
          );
        })}
      </div>
      
      {/* Drag Overlay with scaled animation */}
      <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeCard ? (
          <div className="rotate-2 scale-105 shadow-2xl shadow-indigo-500/20 cursor-grabbing opacity-90">
            <KanbanCard
              order={activeCard}
              clientName={clients.find(c => c.id === activeCard.client_id)?.name ?? '—'}
              vehicleInfo={[
                vehicles.find(v => v.id === activeCard.vehicle_id)?.plate,
                vehicles.find(v => v.id === activeCard.vehicle_id)?.brand,
                vehicles.find(v => v.id === activeCard.vehicle_id)?.model
              ].filter(Boolean).join(' ') || '—'}
              elapsed={elapsed(activeCard.updated_at || activeCard.created_at)}
              onView={() => {}} onEdit={() => {}} onPayment={() => {}} onPhotos={() => {}} onPrint={() => {}} onCancel={() => {}} onNotify={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
