'use client';

import { useMemo } from 'react';
import {
  DndContext, DragOverlay, DragStartEvent, DragEndEvent, DragOverEvent,
  PointerSensor, useSensor, useSensors, closestCorners,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './kanban-card';

interface CardData {
  id: string; number: number; client_id: string; vehicle_id: string;
  kanban_status: string; created_at: string; updated_at: string;
  description?: string; total?: number; payment_status?: string;
}

const columns: { id: string; title: string; color: string; border: string }[] = [
  { id: 'aguardando', title: 'Aguardando', color: 'border-t-amber-500', border: 'border-amber-500/30' },
  { id: 'lavando', title: 'Lavando', color: 'border-t-blue-500', border: 'border-blue-500/30' },
  { id: 'finalizando', title: 'Finalizando', color: 'border-t-violet-500', border: 'border-violet-500/30' },
  { id: 'pronto', title: 'Pronto', color: 'border-t-emerald-500', border: 'border-emerald-500/30' },
];

export { columns };

interface ColumnContainerProps {
  col: { id: string; title: string; color: string; border: string };
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
      className={`flex flex-col rounded-xl border border-border border-t-4 ${col.color} p-3 transition-all duration-200 ${isOver ? 'bg-blue-500/10 scale-[1.01]' : 'bg-slate-900/50'}`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-medium text-white">{col.title}</h3>
        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">{cards.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin min-h-[100px]">
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
          <div className="flex items-center justify-center h-20 border-2 border-dashed border-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-600">Nenhum card</p>
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
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    document.body.style.cursor = 'grabbing';
  }

  function handleDragEnd(event: DragEndEvent) {
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-[calc(100vh-24rem)]">
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
      <DragOverlay>
        {/* Empty overlay — the card stays visible in its original position during drag */}
      </DragOverlay>
    </DndContext>
  );
}
