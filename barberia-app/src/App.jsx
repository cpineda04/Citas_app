import { useState, useRef, useEffect } from "react";
import {
  Calendar, Users, Scissors, Clock, Settings, Briefcase,
  ChevronLeft, ChevronRight, Trash2, Pencil, GripVertical,
  Check, X, MessageCircle, Undo2
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

/* ============================================================
   DATOS DE EJEMPLO — Barbería Dominicana
   ============================================================ */

const SERVICES_SEED = [
  { id: "s1", name: "Corte + Barba", duration: "60 min", priceLabel: "RD$700", active: true, desc: "Corte a máquina o tijera, incluye perfilado de barba" },
  { id: "s2", name: "Corte de cabello", duration: "45 min", priceLabel: "RD$500", active: true, desc: "Corte clásico o degradado, lavado incluido" },
  { id: "s3", name: "Barba", duration: "30 min", priceLabel: "RD$350", active: true, desc: "Perfilado y arreglo de barba con navaja" },
  { id: "s4", name: "Tinte de barba", duration: "40 min", priceLabel: "RD$450", active: false, desc: "Coloración natural, oculta canas" },
];

const CLIENTS_SEED = [
  { id: "c1", name: "Juan Pérez", initials: "JP", phone: "809-555-1234", email: "juan.perez@email.com", since: "12 ene 2025", count: 12, spent: "RD$8,400", status: "Activo" },
  { id: "c2", name: "Ramón Castillo", initials: "RC", phone: "809-555-8821", email: "ramon.c@email.com", since: "3 mar 2025", count: 5, spent: "RD$1,750", status: "Activo" },
  { id: "c3", name: "Luis Feliz", initials: "LF", phone: "809-555-4470", email: "luisf@email.com", since: "29 jun 2025", count: 8, spent: "RD$4,200", status: "Activo" },
  { id: "c4", name: "Ana María Reyes", initials: "AR", phone: "809-555-2290", email: "ana.reyes@email.com", since: "15 nov 2024", count: 3, spent: "RD$2,100", status: "Inactivo" },
  { id: "c5", name: "Pedro Núñez", initials: "PN", phone: "809-555-6634", email: "pedro.n@email.com", since: "2 feb 2024", count: 21, spent: "RD$10,500", status: "Activo" },
  { id: "c6", name: "Carlos Mercedes", initials: "CM", phone: "809-555-3315", email: "carlos.m@email.com", since: "20 ago 2025", count: 2, spent: "RD$1,050", status: "Activo" },
  { id: "c7", name: "Yolanda Beltré", initials: "YB", phone: "809-555-7742", email: "yolanda.b@email.com", since: "5 abr 2025", count: 6, spent: "RD$3,300", status: "Activo" },
  { id: "c8", name: "Miguel Ángel Soto", initials: "MS", phone: "809-555-1189", email: "miguel.soto@email.com", since: "18 dic 2024", count: 14, spent: "RD$7,000", status: "Activo" },
  { id: "c9", name: "Rosa Peña", initials: "RP", phone: "809-555-5567", email: "rosa.pena@email.com", since: "9 jul 2025", count: 1, spent: "RD$500", status: "Inactivo" },
];

const APPTS_SEED = [
  { id: "a1", time: "9:00 AM", client: "Miguel Ángel Soto", phone: "809-555-1189", service: "Corte + Barba", duration: "60 min", price: "RD$700", status: "done", employee: "Miguel Reyes" },
  { id: "a2", time: "10:00 AM", client: "Rosa Peña", phone: "809-555-5567", service: "Barba", duration: "30 min", price: "RD$350", status: "done", employee: "Ana Julia Peña" },
  { id: "a3", time: "11:00 AM", client: "Carlos Mercedes", phone: "809-555-3315", service: "Corte de cabello", duration: "45 min", price: "RD$500", status: "cancelled", employee: "Cualquiera disponible" },
  { id: "a4", time: "1:00 PM", client: "Pedro Núñez", phone: "809-555-6634", service: "Corte de cabello", duration: "45 min", price: "RD$500", status: "done", employee: "Wilson Tavárez" },
  { id: "a5", time: "2:00 PM", client: "Yolanda Beltré", phone: "809-555-7742", service: "Corte + Barba", duration: "60 min", price: "RD$700", status: "confirmed", employee: "Miguel Reyes" },
  { id: "a6", time: "3:00 PM", client: "Juan Pérez", phone: "809-555-1234", service: "Corte + Barba", duration: "60 min", price: "RD$700", status: "confirmed", employee: "Cualquiera disponible" },
  { id: "a7", time: "3:45 PM", client: "Ramón Castillo", phone: "809-555-8821", service: "Barba", duration: "30 min", price: "RD$350", status: "pending", employee: "Ana Julia Peña" },
  { id: "a8", time: "4:15 PM", client: "Luis Feliz", phone: "809-555-4470", service: "Corte de cabello", duration: "45 min", price: "RD$500", status: "confirmed", employee: "Cualquiera disponible" },
  { id: "a9", time: "5:00 PM", client: "Ana María Reyes", phone: "809-555-2290", service: "Corte + Barba", duration: "60 min", price: "RD$700", status: "cancelled", employee: "Miguel Reyes" },
];

const EMPLOYEES_SEED = [
  { id: "e1", name: "Miguel Reyes", initials: "MR", role: "Barbero senior", phone: "809-555-2201", active: true, serviceIds: ["s1", "s2", "s3"] },
  { id: "e2", name: "Ana Julia Peña", initials: "AP", role: "Barbera", phone: "809-555-2202", active: true, serviceIds: ["s1", "s2", "s3", "s4"] },
  { id: "e3", name: "Wilson Tavárez", initials: "WT", role: "Barbero junior", phone: "809-555-2203", active: true, serviceIds: ["s2", "s3"] },
  { id: "e4", name: "Franklin Ureña", initials: "FU", role: "Barbero", phone: "809-555-2204", active: false, serviceIds: ["s1", "s2"] },
];

// Datos ilustrativos para el panel de Super Admin — representan otros negocios
// de la plataforma; no están conectados al estado del tenant "Barbería Dominicana".
const PLATFORM_BUSINESSES_SEED = [
  { id: "t1", name: "Barbería Dominicana", plan: "PRO", city: "Santo Domingo", clients: 184, status: "Activo" },
  { id: "t2", name: "Salón Bella Luna", plan: "BASIC", city: "Santiago", clients: 92, status: "Activo" },
  { id: "t3", name: "Spa Relax RD", plan: "BUSINESS", city: "Punta Cana", clients: 310, status: "Activo" },
  { id: "t4", name: "Clínica Dental Sonrisa", plan: "PRO", city: "Santo Domingo", clients: 145, status: "Activo" },
  { id: "t5", name: "Estudio Fit Coach", plan: "BASIC", city: "La Vega", clients: 41, status: "Inactivo" },
  { id: "t6", name: "Nails & Co.", plan: "PRO", city: "San Francisco de Macorís", clients: 128, status: "Activo" },
];

const toWaNumber = (phone) => "1" + phone.replace(/\D/g, "");
const parsePrice = (label) => parseInt(String(label).replace(/[^\d]/g, ""), 10) || 0;
const formatPrice = (num) => `RD$${Math.round(num).toLocaleString("en-US")}`;

function downloadCSV(filename, headers, rows) {
  const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
  const csvContent = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
const initialsFromName = (name) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

// El resto de clientes/citas del historial del negocio que no están en esta demo,
// para que los totales del dashboard arranquen en números realistas y crezcan en vivo.
const CLIENT_BASE_COUNT = 175;
const PAST_MONTH_REVENUE = [
  { service: "Corte + Barba", baseline: 32000 },
  { service: "Corte de cabello", baseline: 16600 },
  { service: "Barba", baseline: 6650 },
  { service: "Tinte de barba", baseline: 1800 },
];
const TREND_BASE = [
  { day: "Lun", monto: 5200 },
  { day: "Mar", monto: 4100 },
  { day: "Mié", monto: 6800 },
  { day: "Jue", monto: 0 },
  { day: "Vie", monto: 8300 },
  { day: "Sáb", monto: 7100 },
  { day: "Dom", monto: 0 },
];

const STATUS_STYLES = {
  confirmed: "bg-emerald-50 text-emerald-800",
  pending: "bg-amber-50 text-amber-800",
  done: "bg-stone-100 text-stone-500",
  cancelled: "bg-red-50 text-red-700",
  noshow: "bg-stone-100 text-stone-500",
};
const STATUS_LABEL = { confirmed: "Confirmada", pending: "Pendiente", done: "Completada", cancelled: "Cancelada", noshow: "No-show" };
const ROW_ACCENT = { confirmed: "border-emerald-400", pending: "border-amber-400", done: "border-stone-200", cancelled: "border-red-200", noshow: "border-stone-200" };

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const RESCHED_DAYS = [
  { d: 18, dow: "JUE" }, { d: 19, dow: "VIE" }, { d: 20, dow: "SÁB" }, { d: 22, dow: "LUN" }, { d: 23, dow: "MAR" },
];
const RESCHED_SLOTS = ["9:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "4:00 PM"];
const RESCHED_TAKEN = ["11:00 AM"];

// Mapea cada día del calendario de la demo (Sept 2026) a su nombre de día de semana,
// para poder cruzarlo contra el horario real configurado en el panel del negocio.
const WEEKDAY_SEQUENCE = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const dayNameFor = (d) => WEEKDAY_SEQUENCE[(d - 1) % 7];

const parseTimeToMinutes = (str) => {
  const m = String(str).match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + min;
};

const isSlotWithinBlocks = (slot, blocks) => {
  const t = parseTimeToMinutes(slot);
  if (t === null || !blocks || blocks.length === 0) return false;
  return blocks.some((b) => {
    const [startStr, endStr] = String(b).split("–").map((s) => s.trim());
    const start = parseTimeToMinutes(startStr);
    const end = parseTimeToMinutes(endStr);
    if (start === null || end === null) return true;
    return t >= start && t < end;
  });
};

const HOUR_OPTIONS = ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
const DURATION_OPTIONS = ["15 min", "30 min", "45 min", "60 min", "75 min", "90 min"];

const SCHEDULE_SEED = [
  { day: "Lunes", open: true, blocks: ["8:00 AM – 12:00 PM", "2:00 PM – 6:00 PM"] },
  { day: "Martes", open: true, blocks: ["8:00 AM – 6:00 PM"] },
  { day: "Miércoles", open: true, blocks: ["8:00 AM – 6:00 PM"] },
  { day: "Jueves", open: true, blocks: ["9:00 AM – 5:00 PM"] },
  { day: "Viernes", open: true, blocks: ["8:00 AM – 6:00 PM"] },
  { day: "Sábado", open: true, blocks: ["8:00 AM – 4:00 PM"] },
  { day: "Domingo", open: false, blocks: [] },
];

const EXCEPTIONS = [
  { n: "Día feriado", d: "25 de diciembre · Todo el día" },
  { n: "Vacaciones del equipo", d: "1 – 15 de agosto" },
  { n: "Mantenimiento del local", d: "3 de octubre · 8:00 AM – 12:00 PM" },
];

const DEFAULT_PROFILE = {
  name: "Barbería Dominicana",
  description: "Cortes, barba y arreglos clásicos desde 2014.",
  publicLink: "app.com/book/barberia-dominicana",
  phone: "809-555-1234",
  email: "contacto@barberiadominicana.com",
  instagram: "@barberiadominicana",
  whatsapp: "809-555-1234",
  colorIndex: 0,
  allowCancellation: true,
  allowRescheduling: true,
  cancelHours: "2",
  rescheduleHours: "4",
  minNotice: "1 hora",
  maxDays: "30 días",
  notifyConfirm: true,
  notifyReminder24: true,
  notifyReminder2: false,
};

const waLink = (msg, phone) => `https://wa.me/${toWaNumber(phone)}?text=${encodeURIComponent(msg)}`;

/* ============================================================
   PIEZAS REUTILIZABLES
   ============================================================ */

function Toggle({ on, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors flex-shrink-0 ${on ? "bg-emerald-700" : "bg-stone-200"}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? "translate-x-4" : "translate-x-0"}`} />
    </div>
  );
}

function Badge({ status }) {
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[status]}`}>{STATUS_LABEL[status]}</span>;
}

function Toast({ message, actionLabel, onAction, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 text-center" style={{ maxWidth: "92%" }}>
      <Check size={16} className="text-emerald-400 flex-shrink-0" />
      <span>{message}</span>
      {actionLabel && (
        <button
          onClick={() => { onAction(); onClose(); }}
          className="flex items-center gap-1 text-emerald-300 font-semibold flex-shrink-0"
        >
          <Undo2 size={14} /> {actionLabel}
        </button>
      )}
    </div>
  );
}

function ConfirmDialog({ title, message, confirmLabel = "Confirmar", danger = true, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(15,23,42,0.35)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${danger ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-800"}`}>
          <X size={22} />
        </div>
        <h3 className="font-serif text-lg font-semibold mb-1.5">{title}</h3>
        <p className="text-sm text-slate-500 mb-5">{message}</p>
        <button onClick={onConfirm} className={`w-full text-white font-semibold py-3 rounded-xl mb-2.5 text-sm ${danger ? "bg-red-600" : "bg-emerald-700"}`}>
          {confirmLabel}
        </button>
        <button onClick={onClose} className="w-full border border-stone-200 py-2.5 rounded-xl font-semibold text-sm">Cancelar</button>
      </div>
    </div>
  );
}

function WhatsAppButton({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl mb-2.5 no-underline text-sm"
    >
      <MessageCircle size={18} /> {children}
    </a>
  );
}

function SummaryRow({ k, v, total }) {
  return (
    <div className={`flex justify-between py-1.5 text-sm ${total ? "border-t border-stone-200 mt-1 pt-3" : ""}`}>
      <span className="text-slate-500">{k}</span>
      <span className={`font-semibold text-right ${total ? "font-serif text-base text-emerald-800" : ""}`}>{v}</span>
    </div>
  );
}

function StepTransition({ children, transitionKey }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [transitionKey]);
  return (
    <div
      style={{
        transform: visible ? "translateX(0)" : "translateX(18px)",
        opacity: visible ? 1 : 0,
        transition: "transform 240ms ease, opacity 240ms ease",
      }}
    >
      {children}
    </div>
  );
}

function LoadingStep({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-5 text-center" style={{ height: "600px" }}>
      <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin" />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

const FLOW_STEP_LABELS = ["Servicio", "Fecha", "Hora", "Datos"];

function ProgressBar({ current }) {
  return (
    <div className="flex items-start px-5 pt-3 pb-2 gap-1.5">
      {FLOW_STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <div key={label} className="flex-1 flex flex-col items-center gap-1">
            <div className={`h-1 w-full rounded-full ${done || active ? "bg-emerald-700" : "bg-stone-200"}`} />
            <span className={`text-xs ${active ? "text-emerald-800 font-semibold" : "text-stone-400"}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function MiniSummaryBar({ service, employee }) {
  if (!service) return null;
  return (
    <div className="mx-5 mb-1 flex items-center justify-between bg-stone-100 rounded-lg px-3 py-2 text-xs gap-2">
      <span className="font-semibold text-slate-700 truncate">{service.name}</span>
      <span className="text-slate-500 flex-shrink-0">{employee ? employee.name.split(" ")[0] : "Cualquiera"} · {service.priceLabel}</span>
    </div>
  );
}

function BackLink({ onBack, label = "← Volver" }) {
  return (
    <div onClick={onBack} className="px-5 pt-4 text-sm font-semibold text-slate-500 cursor-pointer">
      {label}
    </div>
  );
}

function BottomBar({ children }) {
  return <div className="px-5 pb-6 pt-3 mt-auto">{children}</div>;
}

function Field({ label, value, onChange }) {
  return (
    <div className="mb-3.5">
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      <input
        value={value}
        onChange={onChange}
        className="w-full px-3.5 py-3 border border-stone-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
      />
    </div>
  );
}

/* ============================================================
   TOP SWITCHER
   ============================================================ */

function TopSwitcher({ view, setView }) {
  return (
    <div className="flex justify-center pt-7 pb-2 px-4">
      <div className="inline-flex bg-white border border-stone-200 rounded-full p-1 gap-1 flex-wrap justify-center">
        <button
          onClick={() => setView("client")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${view === "client" ? "bg-slate-900 text-white" : "text-slate-500"}`}
        >
          Vista del cliente
        </button>
        <button
          onClick={() => setView("business")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${view === "business" ? "bg-slate-900 text-white" : "text-slate-500"}`}
        >
          Panel del negocio
        </button>
        <button
          onClick={() => setView("superadmin")}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${view === "superadmin" ? "bg-slate-900 text-white" : "text-slate-500"}`}
        >
          Super Admin
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   FLUJO DEL CLIENTE (dentro de un marco de teléfono)
   ============================================================ */

const TESTIMONIALS = [
  { name: "Julio R.", text: "Siempre salgo bien atendido, puntualidad total.", rating: 5 },
  { name: "Marisol T.", text: "El mejor corte + barba de la zona, sin duda.", rating: 5 },
  { name: "Kelvin D.", text: "Reservar por aquí es rapidísimo, se los recomiendo.", rating: 5 },
];

function StepLanding({ profile, closingLabel, employees, onNext }) {
  const [reviewIndex, setReviewIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setReviewIndex((i) => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);
  const review = TESTIMONIALS[reviewIndex];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
  const activeEmployees = employees.filter((e) => e.active).slice(0, 4);

  return (
    <div>
      <div className="h-36 bg-gradient-to-br from-emerald-700 to-slate-900" />
      <div className="px-5 -mt-7">
        <div className="w-16 h-16 rounded-2xl bg-amber-500 border-4 border-stone-50 flex items-center justify-center font-serif text-2xl font-semibold text-slate-900">
          {initialsFromName(profile.name)}
        </div>
      </div>
      <div className="px-5 pt-3 pb-2">
        <p className="text-xs font-semibold text-emerald-700 mb-1">{greeting} 👋</p>
        <h1 className="font-serif text-xl font-semibold mb-1">{profile.name}</h1>
        <p className="text-sm text-slate-500 mb-3 leading-relaxed">
          Av. Winston Churchill 45, Santo Domingo · {profile.description}
        </p>

        {activeEmployees.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-2">
              {activeEmployees.map((e) => (
                <div key={e.id} className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 border-2 border-white flex items-center justify-center text-xs font-bold">
                  {e.initials}
                </div>
              ))}
            </div>
            <span className="text-xs text-slate-500">Equipo de {activeEmployees.length} profesionales</span>
          </div>
        )}

        <div className="flex gap-2 flex-wrap mb-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-stone-200 text-slate-500">★ 4.9 (312)</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-stone-200 text-slate-500">{closingLabel}</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-stone-200 text-slate-500">WhatsApp</span>
        </div>

        <div key={reviewIndex} className="bg-white border border-stone-200 rounded-lg px-3.5 py-2.5 mb-5 text-xs text-slate-600 italic animate-fade">
          "{review.text}" — {review.name} · {"★".repeat(review.rating)}
        </div>

        <button onClick={onNext} className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-transform duration-150">
          Reservar una cita
        </button>
      </div>
    </div>
  );
}

function StepService({ services, service, setService, employees, employee, setEmployee, profile, appts, onBack, onNext }) {
  const eligible = employees.filter((e) => e.active && e.serviceIds.includes(service.id));
  const serviceCounts = {};
  appts.forEach((a) => { serviceCounts[a.service] = (serviceCounts[a.service] || 0) + 1; });
  const topServiceName = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  return (
    <div className="flex flex-col h-full">
      <ProgressBar current={1} />
      <div className="px-5 flex-1">
        <h3 className="font-serif text-lg font-semibold mt-1 mb-0.5">Elige un servicio</h3>
        <p className="text-sm text-slate-500 mb-4">{profile.name}</p>
        {services.filter((s) => s.active).map((s) => (
          <div
            key={s.id}
            onClick={() => { setService(s); setEmployee(null); }}
            className={`flex justify-between items-center border rounded-xl px-4 py-3.5 mb-2.5 cursor-pointer transition-transform duration-150 active:scale-95 ${
              service.id === s.id ? "border-emerald-700 bg-emerald-50" : "border-stone-200 bg-white hover:border-emerald-700"
            }`}
          >
            <div>
              <p className="font-semibold text-sm mb-0.5 flex items-center gap-1.5">
                {s.name}
                {s.name === topServiceName && (
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">🔥 Popular hoy</span>
                )}
              </p>
              <p className="text-xs text-slate-500">{s.duration}</p>
            </div>
            <div className="font-serif font-semibold text-emerald-800">{s.priceLabel}</div>
          </div>
        ))}

        {eligible.length > 0 && (
          <>
            <p className="text-xs font-semibold text-slate-500 mt-5 mb-2">¿Con quién prefieres tu cita?</p>
            <div className="flex gap-2 overflow-x-auto pb-1.5">
              <div
                onClick={() => setEmployee(null)}
                className={`flex-shrink-0 px-3.5 py-2.5 rounded-full text-xs font-semibold text-center border cursor-pointer whitespace-nowrap ${
                  employee === null ? "bg-emerald-700 text-white border-emerald-700" : "bg-white border-stone-200"
                }`}
              >
                Cualquiera disponible
              </div>
              {eligible.map((e) => (
                <div
                  key={e.id}
                  onClick={() => setEmployee(e)}
                  className={`flex-shrink-0 px-3.5 py-2.5 rounded-full text-xs font-semibold text-center border cursor-pointer whitespace-nowrap ${
                    employee && employee.id === e.id ? "bg-emerald-700 text-white border-emerald-700" : "bg-white border-stone-200"
                  }`}
                >
                  {e.name}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <BackLink onBack={onBack} />
      <BottomBar>
        <button onClick={onNext} className="w-full bg-emerald-700 active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-transform duration-150">Continuar</button>
      </BottomBar>
    </div>
  );
}

function StepDate({ service, day, setDay, schedule, profile, onBack, onNext }) {
  const cells = Array.from({ length: 20 }, (_, i) => i + 1);
  const isClosed = (d) => {
    const entry = schedule.find((s) => s.day === dayNameFor(d));
    return entry ? !entry.open : false;
  };
  return (
    <div className="flex flex-col h-full">
      <ProgressBar current={2} />
      <div className="px-5 flex-1">
        <h3 className="font-serif text-lg font-semibold mt-1 mb-0.5">Elige una fecha</h3>
        <p className="text-sm text-slate-500 mb-4">{service.name} · {service.duration}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-sm">Septiembre 2026</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-slate-500 mb-1">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          <span className="text-stone-300 aspect-square flex items-center justify-center text-sm">31</span>
          {cells.map((d) => {
            if (isClosed(d)) {
              return <span key={d} className="text-stone-300 aspect-square flex items-center justify-center text-sm">{d}</span>;
            }
            const selected = day === d;
            return (
              <div
                key={d}
                onClick={() => setDay(d)}
                className={`aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer border transition-transform duration-150 active:scale-90 ${
                  selected ? "bg-emerald-700 text-white border-emerald-700" : "bg-white border-stone-200 hover:border-emerald-700"
                }`}
              >
                {d}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-4">Los días marcados como "Cerrado" en Horarios no se muestran disponibles. Máximo {profile.maxDays} de anticipación.</p>
      </div>
      <BackLink onBack={onBack} />
      <BottomBar>
        <button onClick={onNext} className="w-full bg-emerald-700 active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-transform duration-150">Continuar</button>
      </BottomBar>
    </div>
  );
}

function StepTime({ day, slot, setSlot, takenSlots, schedule, onBack, onNext }) {
  const entry = schedule.find((s) => s.day === dayNameFor(day));
  const blocks = entry && entry.open ? entry.blocks : [];
  const [liveTaken, setLiveTaken] = useState([]);
  const [liveNotice, setLiveNotice] = useState(null);

  const allTaken = [...takenSlots, ...liveTaken];
  const availableSlots = TIME_SLOTS.filter((t) => isSlotWithinBlocks(t, blocks) && !allTaken.includes(t));
  const availableKey = availableSlots.join(",");

  useEffect(() => {
    const remaining = availableSlots.filter((t) => t !== slot);
    if (remaining.length === 0) return;
    const timer = setTimeout(() => {
      const pick = remaining[Math.floor(Math.random() * remaining.length)];
      setLiveTaken((prev) => [...prev, pick]);
      setLiveNotice(`Alguien más acaba de reservar las ${pick}`);
      setTimeout(() => setLiveNotice(null), 3500);
    }, 6000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableKey]);

  return (
    <div className="flex flex-col h-full">
      <ProgressBar current={3} />
      <div className="px-5 flex-1">
        <h3 className="font-serif text-lg font-semibold mt-1 mb-0.5">Elige una hora</h3>
        <p className="text-sm text-slate-500 mb-3">{dayNameFor(day)} {day} de septiembre</p>
        {liveNotice && (
          <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3 animate-fade">
            {liveNotice}
          </div>
        )}
        <div className="grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((t) => {
            const withinHours = isSlotWithinBlocks(t, blocks);
            const taken = allTaken.includes(t);
            const disabled = taken || !withinHours;
            const selected = slot === t;
            return (
              <div
                key={t}
                onClick={() => !disabled && setSlot(t)}
                className={`text-center py-2.5 rounded-lg text-sm font-medium border transition-transform duration-150 ${
                  disabled
                    ? "text-stone-300 line-through cursor-not-allowed border-stone-200"
                    : selected
                    ? "bg-emerald-700 text-white border-emerald-700 cursor-pointer active:scale-90"
                    : "bg-white border-stone-200 hover:border-emerald-700 cursor-pointer active:scale-90"
                }`}
              >
                {t}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Quedan {availableSlots.length} horario{availableSlots.length === 1 ? "" : "s"} disponible{availableSlots.length === 1 ? "" : "s"} hoy.
        </p>
      </div>
      <BackLink onBack={onBack} />
      <BottomBar>
        <button onClick={onNext} className="w-full bg-emerald-700 active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-transform duration-150">Continuar</button>
      </BottomBar>
    </div>
  );
}

function StepContact({ contact, setContact, clients, onBack, onNext }) {
  const update = (field) => (e) => setContact((prev) => ({ ...prev, [field]: e.target.value }));
  const matched = clients.find((c) => c.phone === contact.phone.trim());
  return (
    <div className="flex flex-col h-full">
      <ProgressBar current={4} />
      <div className="px-5 flex-1">
        <h3 className="font-serif text-lg font-semibold mt-1 mb-0.5">Tus datos</h3>
        <p className="text-sm text-slate-500 mb-4">Para confirmar tu cita y enviarte el recordatorio</p>
        <Field label="Teléfono" value={contact.phone} onChange={update("phone")} />
        {matched && (
          <div key={matched.id} className="flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2.5 mb-3.5 text-xs text-emerald-800 animate-fade">
            <span>¡Bienvenido de nuevo, {matched.name.split(" ")[0]}! Te reconocimos por tu teléfono.</span>
            <button
              onClick={() => setContact((prev) => ({ ...prev, name: matched.name, email: matched.email }))}
              className="font-semibold underline flex-shrink-0"
            >
              Usar mis datos
            </button>
          </div>
        )}
        <Field label="Nombre completo" value={contact.name} onChange={update("name")} />
        <Field label="Correo electrónico" value={contact.email} onChange={update("email")} />
        <p className="text-xs text-slate-500">Tip: escribe tu propio nombre — así la verás aparecer en el panel del negocio.</p>
      </div>
      <BackLink onBack={onBack} />
      <BottomBar>
        <button onClick={onNext} className="w-full bg-emerald-700 active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-transform duration-150">Revisar y confirmar</button>
      </BottomBar>
    </div>
  );
}

function StepSummary({ service, day, slot, contact, employee, profile, onBack, onNext }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 flex-1">
        <h3 className="font-serif text-lg font-semibold mt-1 mb-4">Confirma tu cita</h3>
        <div className="bg-white border border-stone-200 rounded-xl p-4 mb-4">
          <SummaryRow k="Negocio" v={profile.name} />
          <SummaryRow k="Cliente" v={contact.name || "—"} />
          <SummaryRow k="Servicio" v={service.name} />
          <SummaryRow k="Profesional" v={employee ? employee.name : "Cualquiera disponible"} />
          <SummaryRow k="Fecha" v={`${day} sep, 2026`} />
          <SummaryRow k="Hora" v={slot} />
          <SummaryRow k="Duración" v={service.duration} />
          <SummaryRow k="Total" v={service.priceLabel} total />
        </div>
        <p className="text-xs text-slate-500">
          {profile.allowCancellation ? `Puedes cancelar hasta ${profile.cancelHours} horas antes` : "Este negocio no permite cancelaciones desde la app"}
          {profile.allowRescheduling ? ` o reprogramar hasta ${profile.rescheduleHours} horas antes desde "Mis citas".` : "."}
        </p>
      </div>
      <BackLink onBack={onBack} />
      <BottomBar>
        <button onClick={onNext} className="w-full bg-emerald-700 active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-transform duration-150">Confirmar cita</button>
      </BottomBar>
    </div>
  );
}

function StepConfirmed({ service, day, slot, contact, profile, onHome, onMisCitas }) {
  const msg = `Hola ${profile.name}, quisiera reservar una cita:\nServicio: ${service.name}\nFecha: ${day} de septiembre, ${slot}\nNombre: ${contact.name}`;
  return (
    <div className="px-5 pt-8 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 animate-pop">
        <Clock size={30} />
      </div>
      <h2 className="font-serif text-xl font-semibold mb-1.5">Tu solicitud fue enviada</h2>
      <p className="text-sm text-slate-500 mb-5">El negocio confirmará tu cita en breve. Te avisaremos por correo y WhatsApp.</p>
      <div className="bg-white border border-stone-200 rounded-xl p-4 mb-4 text-left">
        <div className="flex justify-between items-center pb-2 mb-1 border-b border-stone-100">
          <span className="text-sm text-slate-500">Estado</span>
          <Badge status="pending" />
        </div>
        <SummaryRow k="Servicio" v={service.name} />
        <SummaryRow k="Fecha" v={`Jue ${day} sep · ${slot}`} />
        <SummaryRow k="Negocio" v={profile.name} />
      </div>
      <WhatsAppButton href={waLink(msg, profile.whatsapp)}>Enviar solicitud por WhatsApp</WhatsAppButton>
      <div className="flex items-center gap-2.5 text-xs text-slate-400 my-3">
        <div className="flex-1 h-px bg-stone-200" /> o <div className="flex-1 h-px bg-stone-200" />
      </div>
      <button onClick={onHome} className="w-full border border-stone-200 active:scale-95 py-3 rounded-xl font-semibold text-sm mb-3 transition-transform duration-150">Volver al inicio</button>
      <div onClick={onMisCitas} className="text-sm font-semibold text-slate-500 cursor-pointer mb-4">Ver mis citas →</div>
      <p className="text-xs text-slate-400 bg-stone-100 rounded-lg p-3 text-left">
        Cambia a "Panel del negocio" → Citas para ver tu solicitud recién creada, pendiente de confirmación.
      </p>
    </div>
  );
}

function StepMisCitas({ profile, onBack, onReprogramar, onCancelar }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 flex-1">
        <h3 className="font-serif text-lg font-semibold mb-4">Mis citas</h3>
        <p className="text-xs font-semibold text-slate-500 mb-2">Próxima cita</p>
        <div className="bg-white border border-stone-200 rounded-xl p-4 mb-5">
          <div className="flex justify-between items-start mb-2.5">
            <div>
              <p className="font-semibold text-sm">Corte + Barba</p>
              <p className="text-xs text-slate-500">{profile.name}</p>
              <p className="text-xs text-slate-500">Jueves 18 sep · 3:00 PM</p>
            </div>
            <Badge status="pending" />
          </div>
          {(profile.allowRescheduling || profile.allowCancellation) ? (
            <div className="flex gap-2 mt-3">
              {profile.allowRescheduling && (
                <button onClick={onReprogramar} className="flex-1 border border-stone-200 active:scale-95 rounded-lg py-2 text-xs font-semibold transition-transform duration-150">Reprogramar</button>
              )}
              {profile.allowCancellation && (
                <button onClick={onCancelar} className="flex-1 border border-red-200 text-red-600 active:scale-95 rounded-lg py-2 text-xs font-semibold transition-transform duration-150">Cancelar</button>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 mt-3">Este negocio no permite cambios desde la app. Contáctalo directamente si necesitas ajustar tu cita.</p>
          )}
        </div>
        <p className="text-xs font-semibold text-slate-500 mb-2">Historial</p>
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-sm">Corte de cabello</p>
              <p className="text-xs text-slate-500">{profile.name}</p>
              <p className="text-xs text-slate-500">Mié 3 sep · 11:00 AM</p>
            </div>
            <Badge status="done" />
          </div>
        </div>
      </div>
      <BackLink onBack={onBack} />
    </div>
  );
}

function StepReprogramar({ day, setDay, slot, setSlot, onBack, onNext }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 flex-1">
        <h3 className="font-serif text-lg font-semibold mb-0.5">Reprogramar cita</h3>
        <p className="text-sm text-slate-500 mb-4">Corte + Barba · actualmente Jue 18 sep, 3:00 PM</p>
        <p className="text-xs font-semibold text-slate-500 mb-2">Nueva fecha</p>
        <div className="flex gap-2 overflow-x-auto pb-1.5 mb-4">
          {RESCHED_DAYS.map(({ d, dow }) => (
            <div
              key={d}
              onClick={() => setDay(d)}
              className={`flex-shrink-0 px-3.5 py-2.5 rounded-full text-xs font-semibold text-center border cursor-pointer ${
                day === d ? "bg-emerald-700 text-white border-emerald-700" : "bg-white border-stone-200"
              }`}
            >
              <span className={`block text-xs font-medium ${day === d ? "text-emerald-100" : "text-slate-500"}`}>{dow}</span>
              {d}
            </div>
          ))}
        </div>
        <p className="text-xs font-semibold text-slate-500 mb-2">Nueva hora</p>
        <div className="grid grid-cols-3 gap-2">
          {RESCHED_SLOTS.map((t) => {
            const taken = RESCHED_TAKEN.includes(t);
            const selected = slot === t;
            return (
              <div
                key={t}
                onClick={() => !taken && setSlot(t)}
                className={`text-center py-2.5 rounded-lg text-sm font-medium border ${
                  taken ? "text-stone-300 line-through border-stone-200" : selected ? "bg-emerald-700 text-white border-emerald-700" : "bg-white border-stone-200"
                }`}
              >
                {t}
              </div>
            );
          })}
        </div>
      </div>
      <BackLink onBack={onBack} />
      <BottomBar>
        <button onClick={onNext} className="w-full bg-emerald-700 active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-transform duration-150">Confirmar nuevo horario</button>
      </BottomBar>
    </div>
  );
}

function StepCancelar({ reason, setReason, profile, onBack, onConfirm }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 flex-1">
        <h3 className="font-serif text-lg font-semibold mb-0.5">Cancelar cita</h3>
        <p className="text-sm text-slate-500 mb-4">Corte + Barba · Jue 18 sep, 3:00 PM</p>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg px-3.5 py-2.5 mb-4 leading-relaxed">
          Puedes cancelar sin costo hasta {profile.cancelHours} horas antes de tu cita.
        </div>
        <label className="block text-sm font-semibold mb-1.5">Motivo (opcional)</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ej: surgió un compromiso de trabajo"
          className="w-full px-3.5 py-3 border border-stone-200 rounded-lg text-sm bg-white resize-none h-20"
        />
      </div>
      <BackLink onBack={onBack} />
      <BottomBar>
        <button onClick={onConfirm} className="w-full bg-red-600 active:scale-95 text-white font-semibold py-3.5 rounded-xl mb-2.5 transition-transform duration-150">Sí, cancelar cita</button>
        <button onClick={onBack} className="w-full border border-stone-200 active:scale-95 py-3 rounded-xl font-semibold text-sm transition-transform duration-150">No, mantener cita</button>
      </BottomBar>
    </div>
  );
}

function StepReprogramada({ rescheduleDay, rescheduleSlot, profile, onMisCitas }) {
  const msg = `Hola ${profile.name}, reprogramé mi cita:\nServicio: Corte + Barba\nAntes: Jueves 18 de septiembre, 3:00 PM\nAhora: ${rescheduleDay} de septiembre, ${rescheduleSlot}\nNombre: Juan Pérez`;
  return (
    <div className="px-5 pt-8 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-4 animate-pop">
        <Check size={30} />
      </div>
      <h2 className="font-serif text-xl font-semibold mb-1.5">Cita reprogramada</h2>
      <p className="text-sm text-slate-500 mb-5">Tu nueva fecha quedó registrada</p>
      <div className="bg-white border border-stone-200 rounded-xl p-4 mb-4 text-left">
        <SummaryRow k="Antes" v={<span className="line-through text-slate-400">Jue 18 sep · 3:00 PM</span>} />
        <SummaryRow k="Ahora" v={`${rescheduleDay} sep · ${rescheduleSlot}`} />
      </div>
      <WhatsAppButton href={waLink(msg, profile.whatsapp)}>Avisar al negocio por WhatsApp</WhatsAppButton>
      <button onClick={onMisCitas} className="w-full border border-stone-200 active:scale-95 py-3 rounded-xl font-semibold text-sm mt-1 transition-transform duration-150">Ver mis citas</button>
    </div>
  );
}

function StepCancelada({ reason, profile, onHome }) {
  const msg = `Hola ${profile.name}, cancelo mi cita:\nServicio: Corte + Barba\nFecha: Jueves 18 de septiembre, 3:00 PM\nNombre: Juan Pérez${reason ? "\nMotivo: " + reason : ""}`;
  return (
    <div className="px-5 pt-8 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 animate-pop">
        <X size={30} />
      </div>
      <h2 className="font-serif text-xl font-semibold mb-1.5">Cita cancelada</h2>
      <p className="text-sm text-slate-500 mb-5">Le avisamos al negocio de tu cancelación</p>
      <div className="bg-white border border-stone-200 rounded-xl p-4 mb-4 text-left">
        <SummaryRow k="Servicio" v="Corte + Barba" />
        <SummaryRow k="Fecha" v="Jue 18 sep · 3:00 PM" />
      </div>
      <WhatsAppButton href={waLink(msg, profile.whatsapp)}>Avisar al negocio por WhatsApp</WhatsAppButton>
      <button onClick={onHome} className="w-full border border-stone-200 active:scale-95 py-3 rounded-xl font-semibold text-sm mt-1 transition-transform duration-150">Volver al inicio</button>
    </div>
  );
}

function ClientFlow({ services, appts, setAppts, clients, setClients, schedule, profile, employees }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState(services[0]);
  const [employee, setEmployee] = useState(null);
  const [day, setDay] = useState(18);
  const [slot, setSlot] = useState("3:00 PM");
  const [contact, setContact] = useState({ name: "Nuevo Cliente", phone: "809-555-0199", email: "nuevo.cliente@email.com" });
  const [reason, setReason] = useState("");
  const [rDay, setRDay] = useState(19);
  const [rSlot, setRSlot] = useState("1:00 PM");
  const [loadingLabel, setLoadingLabel] = useState(null);

  const goToStep = (next, label) => {
    if (label) {
      setLoadingLabel(label);
      setTimeout(() => {
        setStep(next);
        setLoadingLabel(null);
      }, 450);
    } else {
      setStep(next);
    }
  };

  const takenSlots = appts.filter((a) => a.status !== "cancelled").map((a) => a.time);

  const todayEntry = schedule.find((s) => s.day === "Jueves");
  const closingLabel = todayEntry && todayEntry.open && todayEntry.blocks.length > 0
    ? `Cierra ${todayEntry.blocks[todayEntry.blocks.length - 1].split("–")[1].trim()}`
    : "Cerrado hoy";

  const handleBook = () => {
    const name = contact.name.trim() || "Cliente sin nombre";
    const phone = contact.phone.trim() || "809-000-0000";
    const newAppt = {
      id: "b" + Date.now(),
      time: slot,
      client: name,
      phone,
      service: service.name,
      duration: service.duration,
      price: service.priceLabel,
      status: "pending",
      employee: employee ? employee.name : "Cualquiera disponible",
    };
    setAppts((prev) => [...prev, newAppt]);
    setClients((prev) => {
      if (prev.some((c) => c.phone === phone)) return prev;
      return [
        ...prev,
        {
          id: "cl" + Date.now(),
          name,
          initials: initialsFromName(name),
          phone,
          email: contact.email.trim(),
          since: "18 sep 2026",
          count: 0,
          spent: "RD$0",
          status: "Activo",
        },
      ];
    });
    setStep(6);
  };

  return (
    <div>
      <p className="text-center text-sm text-slate-500 max-w-md mx-auto mb-9 leading-relaxed px-4">
        Así ve un cliente el link público <strong>{profile.publicLink}</strong>. Completa el flujo (puedes cambiar el nombre en "Tus datos") y luego revisa el "Panel del negocio" para ver tu cita en vivo.
      </p>
      <div className="w-96 max-w-full mx-auto bg-slate-900 p-3.5 shadow-2xl" style={{ borderRadius: "2.75rem" }}>
        <div className="bg-stone-50 overflow-hidden flex flex-col relative" style={{ borderRadius: "2rem", height: "740px" }}>
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 rounded-full z-10" />
          <div className="flex-1 overflow-y-auto pt-8">
            {loadingLabel ? (
              <LoadingStep label={loadingLabel} />
            ) : (
              <>
                {[2, 3, 4].includes(step) && <MiniSummaryBar service={service} employee={employee} />}
                <StepTransition transitionKey={step}>
                  {step === 0 && <StepLanding profile={profile} closingLabel={closingLabel} employees={employees} onNext={() => setStep(1)} />}
                  {step === 1 && <StepService services={services} service={service} setService={setService} employees={employees} employee={employee} setEmployee={setEmployee} profile={profile} appts={appts} onBack={() => setStep(0)} onNext={() => goToStep(2, "Buscando disponibilidad...")} />}
                  {step === 2 && <StepDate service={service} day={day} setDay={setDay} schedule={schedule} profile={profile} onBack={() => setStep(1)} onNext={() => goToStep(3, "Verificando horarios...")} />}
                  {step === 3 && <StepTime day={day} slot={slot} setSlot={setSlot} takenSlots={takenSlots} schedule={schedule} onBack={() => setStep(2)} onNext={() => setStep(4)} />}
                  {step === 4 && <StepContact contact={contact} setContact={setContact} clients={clients} onBack={() => setStep(3)} onNext={() => setStep(5)} />}
                  {step === 5 && <StepSummary service={service} day={day} slot={slot} contact={contact} employee={employee} profile={profile} onBack={() => setStep(4)} onNext={handleBook} />}
                  {step === 6 && <StepConfirmed service={service} day={day} slot={slot} contact={contact} profile={profile} onHome={() => setStep(0)} onMisCitas={() => setStep(7)} />}
                  {step === 7 && <StepMisCitas profile={profile} onBack={() => setStep(6)} onReprogramar={() => setStep(8)} onCancelar={() => setStep(9)} />}
                  {step === 8 && <StepReprogramar day={rDay} setDay={setRDay} slot={rSlot} setSlot={setRSlot} onBack={() => setStep(7)} onNext={() => setStep(10)} />}
                  {step === 9 && <StepCancelar reason={reason} setReason={setReason} profile={profile} onBack={() => setStep(7)} onConfirm={() => setStep(11)} />}
                  {step === 10 && <StepReprogramada rescheduleDay={rDay} rescheduleSlot={rSlot} profile={profile} onMisCitas={() => setStep(7)} />}
                  {step === 11 && <StepCancelada reason={reason} profile={profile} onHome={() => setStep(0)} />}
                </StepTransition>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PANEL DEL NEGOCIO
   ============================================================ */

const NAV_ITEMS = [
  { id: "citas", label: "Citas", full: "Citas", icon: Calendar },
  { id: "clientes", label: "Clientes", full: "Clientes", icon: Users },
  { id: "empleados", label: "Equipo", full: "Empleados", icon: Briefcase },
  { id: "servicios", label: "Servicios", full: "Servicios", icon: Scissors },
  { id: "horarios", label: "Horarios", full: "Horarios", icon: Clock },
  { id: "config", label: "Config", full: "Configuración", icon: Settings },
];

function StatCard({ label, value, accent, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`border rounded-xl p-4 text-left transition ${onClick ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : ""} ${
        accent ? "bg-emerald-700 border-emerald-700 text-white" : "bg-white border-stone-200"
      }`}
    >
      <div className={`text-xs mb-2 ${accent ? "text-emerald-100" : "text-slate-500"}`}>{label}</div>
      <div className="font-serif text-2xl font-semibold">{value}</div>
    </div>
  );
}

function BarRow({ label, pct }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div className="w-24 text-xs text-slate-500 flex-shrink-0 truncate">{label}</div>
      <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-700 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <div className="w-8 text-xs font-semibold text-slate-500 text-right">{pct}%</div>
    </div>
  );
}

function IngresosModal({ total, breakdown, trend, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(15,23,42,0.35)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 overflow-y-auto" style={{ maxHeight: "90vh" }}>
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="font-serif text-lg font-semibold">Ingresos del mes</h3>
            <p className="text-sm text-slate-500">Septiembre 2026</p>
          </div>
          <X size={20} className="cursor-pointer text-slate-400 flex-shrink-0" onClick={onClose} />
        </div>
        <div className="font-serif text-3xl font-semibold text-emerald-800 my-4">{formatPrice(total)}</div>

        <h4 className="text-xs font-semibold text-slate-500 mb-2.5">Desglose por servicio</h4>
        {breakdown.map((b) => (
          <div key={b.name} className="flex items-center gap-2.5 mb-3">
            <div className="w-32 text-xs text-slate-600 flex-shrink-0 truncate">{b.name}</div>
            <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-700 rounded-full" style={{ width: `${b.pct}%` }} />
            </div>
            <div className="w-20 text-xs font-semibold text-slate-600 text-right flex-shrink-0">{formatPrice(b.amount)}</div>
          </div>
        ))}

        <h4 className="text-xs font-semibold text-slate-500 mb-2.5 mt-6">Tendencia de ingresos (esta semana)</h4>
        <div style={{ width: "100%", height: 180 }}>
          <ResponsiveContainer>
            <LineChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#78716C" }} axisLine={{ stroke: "#E7E5E4" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#78716C" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [formatPrice(v), "Ingresos"]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E7E5E4" }} />
              <Line type="monotone" dataKey="monto" stroke="#047857" strokeWidth={2.5} dot={{ r: 3, fill: "#047857" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const WEEK_DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const WEEK_ILLUSTRATIVE_COUNTS = { Lunes: 5, Martes: 4, Miércoles: 6, Viernes: 7, Sábado: 6, Domingo: 0 };

function WeekView({ schedule, citasHoy, onGoToday }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-3">
        {WEEK_DAYS.map((day) => {
          const entry = schedule.find((s) => s.day === day);
          const closed = entry ? !entry.open : false;
          const isToday = day === "Jueves";
          const count = isToday ? citasHoy : closed ? 0 : WEEK_ILLUSTRATIVE_COUNTS[day];
          return (
            <div
              key={day}
              onClick={isToday ? onGoToday : undefined}
              className={`border rounded-xl p-4 text-center ${
                isToday ? "border-emerald-600 bg-emerald-50 cursor-pointer" : "border-stone-200 bg-white"
              } ${closed ? "opacity-50" : ""}`}
            >
              <div className="text-xs font-semibold text-slate-500 mb-1">{day}{isToday ? " (hoy)" : ""}</div>
              <div className="font-serif text-2xl font-semibold">{closed ? "—" : count}</div>
              <div className="text-xs text-slate-400 mt-1">{closed ? "Cerrado" : isToday ? "Ver citas →" : "citas (ilustrativo)"}</div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-500">Solo "Jueves (hoy)" refleja datos reales del prototipo; el resto de la semana es ilustrativo.</p>
    </div>
  );
}

function MonthView({ schedule, citasHoy, onGoToday }) {
  const cells = Array.from({ length: 20 }, (_, i) => i + 1);
  return (
    <div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500 mb-2">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-2 mb-3">
        {cells.map((d) => {
          const wn = dayNameFor(d);
          const entry = schedule.find((s) => s.day === wn);
          const closed = entry ? !entry.open : false;
          const isToday = d === 18;
          const count = isToday ? citasHoy : closed ? 0 : (d % 5) + 3;
          return (
            <div
              key={d}
              onClick={isToday ? onGoToday : undefined}
              className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-xs ${
                isToday ? "border-emerald-600 bg-emerald-50 cursor-pointer font-bold" : closed ? "border-stone-100 text-stone-300" : "border-stone-200"
              }`}
            >
              <span>{d}</span>
              {!closed && <span className="text-xs text-slate-400">{count}</span>}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-500">Solo el día 18 (hoy) refleja datos reales; los demás conteos son ilustrativos y respetan los días cerrados configurados en Horarios.</p>
    </div>
  );
}

const HOUR_HEIGHT = 56;
const AGENDA_COL_WIDTH = 168;
const AGENDA_TIME_COL_WIDTH = 60;

const minutesToLabel = (mins) => {
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  const ap = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ap}`;
};

const durationToMinutes = (label) => parseInt(String(label).replace(/[^\d]/g, ""), 10) || 30;

const AGENDA_STATUS_STYLES = {
  pending: "bg-amber-50 border-amber-400 text-amber-900",
  confirmed: "bg-emerald-50 border-emerald-400 text-emerald-900",
  done: "bg-stone-100 border-stone-300 text-stone-500",
};

function AgendaView({ appts, employees, schedule, onGoToDia }) {
  const todayEntry = schedule.find((s) => s.day === "Jueves");
  const blocks = todayEntry && todayEntry.open ? todayEntry.blocks : [];

  let dayStartMin = 9 * 60;
  let dayEndMin = 17 * 60;
  if (blocks.length > 0) {
    const starts = blocks.map((b) => parseTimeToMinutes(b.split("–")[0].trim())).filter((n) => n !== null);
    const ends = blocks.map((b) => parseTimeToMinutes(b.split("–")[1].trim())).filter((n) => n !== null);
    if (starts.length) dayStartMin = Math.min(...starts);
    if (ends.length) dayEndMin = Math.max(...ends);
  }
  const totalHours = Math.max(1, Math.ceil((dayEndMin - dayStartMin) / 60));
  const hourMarks = Array.from({ length: totalHours + 1 }, (_, i) => dayStartMin + i * 60);

  const activeEmployees = employees.filter((e) => e.active);
  const columns = [...activeEmployees.map((e) => ({ id: e.id, name: e.name, role: e.role })), { id: "unassigned", name: "Sin asignar", role: null }];

  const visibleAppts = appts.filter((a) => a.status !== "cancelled");
  const apptsForColumn = (col) => {
    if (col.id === "unassigned") return visibleAppts.filter((a) => !activeEmployees.some((e) => e.name === a.employee));
    return visibleAppts.filter((a) => a.employee === col.name);
  };

  const totalWidth = AGENDA_TIME_COL_WIDTH + columns.length * AGENDA_COL_WIDTH;

  return (
    <div>
      <div className="border border-stone-200 rounded-xl overflow-x-auto mb-3">
        <div style={{ minWidth: `${totalWidth}px` }}>
          <div className="flex border-b border-stone-200">
            <div style={{ width: AGENDA_TIME_COL_WIDTH }} className="flex-shrink-0" />
            {columns.map((col) => (
              <div key={col.id} style={{ width: AGENDA_COL_WIDTH }} className="flex-shrink-0 px-2 py-2.5 text-center border-l border-stone-100">
                <div className="text-sm font-semibold truncate">{col.name}</div>
                {col.role && <div className="text-xs text-slate-400 truncate">{col.role}</div>}
              </div>
            ))}
          </div>
          <div className="flex">
            <div style={{ width: AGENDA_TIME_COL_WIDTH }} className="flex-shrink-0">
              {hourMarks.map((m) => (
                <div key={m} style={{ height: HOUR_HEIGHT }} className="text-xs text-slate-400 text-right pr-2 pt-1 border-t border-stone-100">
                  {minutesToLabel(m)}
                </div>
              ))}
            </div>
            {columns.map((col) => (
              <div key={col.id} style={{ width: AGENDA_COL_WIDTH, height: totalHours * HOUR_HEIGHT }} className="flex-shrink-0 border-l border-stone-100 relative">
                {hourMarks.slice(0, -1).map((m) => (
                  <div key={m} style={{ height: HOUR_HEIGHT }} className="border-t border-stone-100" />
                ))}
                {apptsForColumn(col).map((a) => {
                  const startMin = parseTimeToMinutes(a.time);
                  if (startMin === null) return null;
                  const top = ((startMin - dayStartMin) / 60) * HOUR_HEIGHT;
                  const height = Math.max(26, (durationToMinutes(a.duration) / 60) * HOUR_HEIGHT - 4);
                  return (
                    <div
                      key={a.id}
                      onClick={onGoToDia}
                      style={{ top: `${top + 2}px`, height: `${height}px` }}
                      className={`absolute left-1 right-1 rounded-lg border px-2 py-1 text-xs cursor-pointer overflow-hidden transition-transform duration-150 active:scale-95 ${AGENDA_STATUS_STYLES[a.status] || "bg-stone-100 border-stone-300"}`}
                    >
                      <div className="font-semibold truncate">{a.time} · {a.client}</div>
                      <div className="truncate opacity-80">{a.service}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Pendiente</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Confirmada</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-stone-300" /> Completada</span>
        <span>· Toca una cita para ir a la vista Día y gestionarla</span>
      </div>
    </div>
  );
}

function NewApptModal({ clients, services, appts, employees, onClose, onCreate }) {
  const [mode, setMode] = useState("existing");
  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const activeServices = services.filter((s) => s.active);
  const [serviceId, setServiceId] = useState(activeServices[0]?.id || "");
  const [employeeId, setEmployeeId] = useState("");
  const takenTimes = appts.filter((a) => a.status !== "cancelled").map((a) => a.time);
  const availableTimes = TIME_SLOTS.filter((t) => !takenTimes.includes(t));
  const [time, setTime] = useState(availableTimes[0] || "");
  const eligibleEmployees = employees.filter((e) => e.active && e.serviceIds.includes(serviceId));
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) { setError("Selecciona un servicio."); return; }
    if (!time) { setError("No hay una hora seleccionada."); return; }
    const chosenEmployee = employees.find((e) => e.id === employeeId);
    let clientName, clientPhone, newClientObj = null;
    if (mode === "existing") {
      const c = clients.find((cl) => cl.id === clientId);
      if (!c) { setError("Selecciona un cliente."); return; }
      clientName = c.name;
      clientPhone = c.phone;
    } else {
      if (!newName.trim() || !newPhone.trim()) {
        setError("Completa el nombre y el teléfono del nuevo cliente.");
        return;
      }
      clientName = newName.trim();
      clientPhone = newPhone.trim();
      newClientObj = {
        id: "cl" + Date.now(),
        name: clientName,
        initials: initialsFromName(clientName),
        phone: clientPhone,
        email: "",
        since: "18 sep 2026",
        count: 0,
        spent: "RD$0",
        status: "Activo",
      };
    }
    const appt = {
      id: "a" + Date.now(),
      time,
      client: clientName,
      phone: clientPhone,
      service: service.name,
      duration: service.duration,
      price: service.priceLabel,
      status: "confirmed",
      employee: chosenEmployee ? chosenEmployee.name : "Cualquiera disponible",
    };
    onCreate(appt, newClientObj);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(15,23,42,0.35)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-serif text-lg font-semibold">Nueva cita</h3>
          <X size={20} className="cursor-pointer text-slate-400 flex-shrink-0" onClick={onClose} />
        </div>

        <div className="inline-flex bg-stone-100 border border-stone-200 rounded-lg p-0.5 mb-4">
          <span onClick={() => setMode("existing")} className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${mode === "existing" ? "bg-white shadow-sm" : "text-slate-500"}`}>Cliente existente</span>
          <span onClick={() => setMode("new")} className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${mode === "new" ? "bg-white shadow-sm" : "text-slate-500"}`}>Cliente nuevo</span>
        </div>

        {mode === "existing" ? (
          <div className="mb-3.5">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Cliente</label>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm">
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nombre</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre completo" className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Teléfono</label>
              <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="809-555-0000" className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm" />
            </div>
          </div>
        )}

        <div className="mb-3.5">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Servicio</label>
          <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm">
            {activeServices.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — {s.priceLabel}</option>
            ))}
          </select>
        </div>

        <div className="mb-3.5">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Profesional</label>
          <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm">
            <option value="">Cualquiera disponible</option>
            {eligibleEmployees.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Hora disponible</label>
          {availableTimes.length === 0 ? (
            <p className="text-xs text-red-600">No hay horarios libres hoy.</p>
          ) : (
            <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm">
              {availableTimes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}
        </div>

        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
        <button onClick={handleSubmit} disabled={availableTimes.length === 0} className="w-full bg-emerald-700 disabled:bg-stone-300 text-white font-semibold py-3 rounded-xl text-sm">
          Crear cita
        </button>
      </div>
    </div>
  );
}

function CitasPanel({ appts, clients, services, employees, schedule, profile, updateStatus, setAppts, onGoToClientes, onCreateAppt, onCreateClient }) {
  const [tab, setTab] = useState("Día");
  const [statusFilter, setStatusFilter] = useState("Todos los estados");
  const [serviceFilter, setServiceFilter] = useState("Todos los servicios");
  const [search, setSearch] = useState("");
  const [showRevenue, setShowRevenue] = useState(false);
  const [showNewAppt, setShowNewAppt] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [selected, setSelected] = useState([]);
  const tableRef = useRef(null);

  const scrollToTable = () => {
    setTab("Día");
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleSelect = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleConfirm = (appt) => {
    const snapshot = appts;
    updateStatus(appt.id, "confirmed");
    const firstName = appt.client.split(" ")[0];
    const msg = `Hola ${firstName}, tu cita de ${appt.service} el jueves 18 de septiembre a las ${appt.time} ha sido confirmada. ¡Te esperamos en ${profile.name}!`;
    window.open(`https://wa.me/${toWaNumber(appt.phone)}?text=${encodeURIComponent(msg)}`, "_blank");
    setToast({ message: `Cita confirmada — WhatsApp enviado a ${appt.client}`, actionLabel: "Deshacer", onAction: () => setAppts(snapshot) });
  };

  const handleReject = (appt) => {
    const snapshot = appts;
    updateStatus(appt.id, "cancelled");
    const firstName = appt.client.split(" ")[0];
    const msg = `Hola ${firstName}, no pudimos confirmar tu solicitud de cita para el jueves 18 de septiembre a las ${appt.time}. Por favor contáctanos para buscar otro horario.`;
    window.open(`https://wa.me/${toWaNumber(appt.phone)}?text=${encodeURIComponent(msg)}`, "_blank");
    setToast({ message: `Solicitud rechazada — WhatsApp enviado a ${appt.client}`, actionLabel: "Deshacer", onAction: () => setAppts(snapshot) });
  };

  const handleCancelConfirmed = (appt) => {
    setConfirmTarget(appt);
  };

  const confirmCancelConfirmed = () => {
    const appt = confirmTarget;
    if (!appt) return;
    const snapshot = appts;
    updateStatus(appt.id, "cancelled");
    const firstName = appt.client.split(" ")[0];
    const msg = `Hola ${firstName}, lamentamos informarte que tu cita de ${appt.service} el jueves 18 de septiembre a las ${appt.time} fue cancelada por el negocio. Contáctanos para reprogramar cuando gustes.`;
    window.open(`https://wa.me/${toWaNumber(appt.phone)}?text=${encodeURIComponent(msg)}`, "_blank");
    setToast({ message: `Cita cancelada — WhatsApp enviado a ${appt.client}`, actionLabel: "Deshacer", onAction: () => setAppts(snapshot) });
    setConfirmTarget(null);
  };

  const bulkConfirmSelected = () => {
    const targets = appts.filter((a) => selected.includes(a.id) && a.status === "pending");
    if (targets.length === 0) return;
    const snapshot = appts;
    setAppts((prev) => prev.map((a) => (selected.includes(a.id) && a.status === "pending" ? { ...a, status: "confirmed" } : a)));
    setSelected([]);
    setToast({
      message: `${targets.length} cita(s) confirmada(s). En la app real cada cliente recibe su notificación individual.`,
      actionLabel: "Deshacer",
      onAction: () => setAppts(snapshot),
    });
  };

  const filterMap = { Pendiente: "pending", Confirmada: "confirmed", Completada: "done", Cancelada: "cancelled" };
  const searchQuery = search.trim().toLowerCase();
  const visibleAppts = appts
    .filter((a) => statusFilter === "Todos los estados" || a.status === filterMap[statusFilter])
    .filter((a) => serviceFilter === "Todos los servicios" || a.service === serviceFilter)
    .filter((a) => !searchQuery || a.client.toLowerCase().includes(searchQuery));
  const selectablePendingIds = visibleAppts.filter((a) => a.status === "pending").map((a) => a.id);
  const allPendingSelected = selectablePendingIds.length > 0 && selectablePendingIds.every((id) => selected.includes(id));
  const toggleSelectAllPending = () => {
    if (allPendingSelected) setSelected((prev) => prev.filter((id) => !selectablePendingIds.includes(id)));
    else setSelected((prev) => Array.from(new Set([...prev, ...selectablePendingIds])));
  };

  const citasHoy = appts.length;
  const pendientesCount = appts.filter((a) => a.status === "pending").length;
  const totalClients = CLIENT_BASE_COUNT + clients.length;

  const liveByService = {};
  appts.forEach((a) => {
    if (a.status === "confirmed" || a.status === "done") {
      liveByService[a.service] = (liveByService[a.service] || 0) + parsePrice(a.price);
    }
  });
  const breakdownRaw = PAST_MONTH_REVENUE.map((b) => ({ name: b.service, amount: b.baseline + (liveByService[b.service] || 0) }));
  const totalRevenue = breakdownRaw.reduce((s, b) => s + b.amount, 0);
  const breakdown = breakdownRaw.map((b) => ({ ...b, pct: Math.round((b.amount / totalRevenue) * 100) }));
  const todayLiveTotal = Object.values(liveByService).reduce((s, v) => s + v, 0);
  const trend = TREND_BASE.map((t) => (t.day === "Jue" ? { ...t, monto: todayLiveTotal } : t));

  const serviceCounts = {};
  appts.forEach((a) => { serviceCounts[a.service] = (serviceCounts[a.service] || 0) + 1; });
  const maxCount = Math.max(1, ...Object.values(serviceCounts));
  const topServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({ name, pct: Math.round((count / maxCount) * 100) }));

  return (
    <div>
      <div className="flex justify-between items-start mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-xl font-semibold mb-0.5">Hola de nuevo 👋</h2>
          <div className="text-sm text-slate-500">Jueves, 18 de septiembre de 2026</div>
        </div>
        <button onClick={() => setShowNewAppt(true)} className="bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg">+ Nueva cita</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        <StatCard label="Citas de hoy" value={citasHoy} accent onClick={scrollToTable} />
        <StatCard label="Pendientes de confirmar" value={pendientesCount} onClick={() => { setStatusFilter("Pendiente"); scrollToTable(); }} />
        <StatCard label="Clientes activos" value={totalClients} onClick={onGoToClientes} />
        <StatCard label="Ingresos del mes" value={formatPrice(totalRevenue)} onClick={() => setShowRevenue(true)} />
      </div>

      <div ref={tableRef} className="flex justify-between items-center flex-wrap gap-3 mb-4 scroll-mt-4">
        <div>
          <h3 className="font-semibold text-base mb-0.5">Citas</h3>
          <div className="text-sm text-slate-500">{citasHoy} citas hoy · {pendientesCount} pendientes de confirmar</div>
        </div>
        <div className="inline-flex bg-stone-100 border border-stone-200 rounded-lg p-0.5">
          {["Día", "Agenda", "Semana", "Mes"].map((t) => (
            <span
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${tab === t ? "bg-white shadow-sm" : "text-slate-500"}`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {tab === "Agenda" && <AgendaView appts={appts} employees={employees} schedule={schedule} onGoToDia={() => setTab("Día")} />}
      {tab === "Semana" && <WeekView schedule={schedule} citasHoy={citasHoy} onGoToday={() => setTab("Día")} />}
      {tab === "Mes" && <MonthView schedule={schedule} citasHoy={citasHoy} onGoToday={() => setTab("Día")} />}

      {tab === "Día" && (
        <>
          <div className="flex flex-wrap gap-2.5 items-center mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ChevronLeft size={16} className="cursor-pointer text-slate-400" /> Jueves, 18 sep <ChevronRight size={16} className="cursor-pointer text-slate-400" />
            </div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente..." className="border border-stone-200 rounded-lg px-3 py-2 text-sm w-48" />
            <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="border border-stone-200 rounded-lg px-3 py-2 text-sm">
              <option>Todos los servicios</option>
              {services.map((s) => <option key={s.id}>{s.name}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-stone-200 rounded-lg px-3 py-2 text-sm">
              <option>Todos los estados</option>
              <option>Pendiente</option>
              <option>Confirmada</option>
              <option>Completada</option>
              <option>Cancelada</option>
            </select>
            <button
              onClick={() => downloadCSV(
                "citas.csv",
                ["Hora", "Cliente", "Servicio", "Profesional", "Duración", "Precio", "Estado"],
                visibleAppts.map((a) => [a.time, a.client, a.service, a.employee || "—", a.duration, a.price, STATUS_LABEL[a.status]])
              )}
              className="border border-stone-200 text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg"
            >
              Exportar CSV
            </button>
          </div>

          {selected.length > 0 && (
            <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 mb-3 flex-wrap">
              <span className="text-sm font-semibold text-emerald-800">{selected.length} seleccionada(s)</span>
              <div className="flex gap-3 items-center">
                <button onClick={bulkConfirmSelected} className="text-sm font-semibold text-emerald-800 bg-white border border-emerald-300 px-3 py-1.5 rounded-lg">
                  Confirmar seleccionadas
                </button>
                <span onClick={() => setSelected([])} className="text-sm font-semibold text-slate-500 cursor-pointer">Cancelar selección</span>
              </div>
            </div>
          )}

          <div className="border border-stone-200 rounded-xl overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-stone-200">
                  <th className="py-2.5 px-3 font-semibold">
                    {selectablePendingIds.length > 0 && (
                      <input type="checkbox" checked={allPendingSelected} onChange={toggleSelectAllPending} />
                    )}
                  </th>
                  <th className="py-2.5 px-3 font-semibold">Hora</th>
                  <th className="py-2.5 px-3 font-semibold">Cliente</th>
                  <th className="py-2.5 px-3 font-semibold">Servicio</th>
                  <th className="py-2.5 px-3 font-semibold">Profesional</th>
                  <th className="py-2.5 px-3 font-semibold">Duración</th>
                  <th className="py-2.5 px-3 font-semibold">Precio</th>
                  <th className="py-2.5 px-3 font-semibold">Estado</th>
                  <th className="py-2.5 px-3" />
                </tr>
              </thead>
              <tbody>
                {visibleAppts.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 px-3 text-center text-sm text-slate-400">
                      {appts.length === 0
                        ? "Aún no tienes citas registradas. Comparte tu link de reservas para empezar a recibirlas."
                        : "No hay citas que coincidan con estos filtros."}
                    </td>
                  </tr>
                )}
                {visibleAppts.map((a) => (
                  <tr key={a.id} className="border-b border-stone-100 last:border-0">
                    <td className="py-3 px-3">
                      {a.status === "pending" && (
                        <input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggleSelect(a.id)} />
                      )}
                    </td>
                    <td className={`py-3 px-3 whitespace-nowrap border-l-4 ${ROW_ACCENT[a.status]}`}>{a.time}</td>
                    <td className="py-3 px-3 whitespace-nowrap">{a.client}</td>
                    <td className="py-3 px-3 whitespace-nowrap">{a.service}</td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-500">{a.employee || "—"}</td>
                    <td className="py-3 px-3 whitespace-nowrap">{a.duration}</td>
                    <td className="py-3 px-3 whitespace-nowrap">{a.price}</td>
                    <td className="py-3 px-3"><Badge status={a.status} /></td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {a.status === "pending" && (
                        <>
                          <button onClick={() => handleConfirm(a)} className="text-xs font-semibold text-emerald-800 mr-3">Confirmar</button>
                          <button onClick={() => handleReject(a)} className="text-xs font-semibold text-red-600 mr-3">Rechazar</button>
                        </>
                      )}
                      {a.status === "confirmed" && (
                        <button onClick={() => updateStatus(a.id, "done")} className="text-xs font-semibold text-emerald-800 mr-3">Completar</button>
                      )}
                      {a.status === "confirmed" && (
                        <button onClick={() => handleCancelConfirmed(a)} className="text-xs font-semibold text-red-600 mr-3">Cancelar</button>
                      )}
                      {(a.status === "done" || a.status === "cancelled") && (
                        <button className="text-xs font-semibold text-slate-400">Ver</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="border border-stone-200 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3">Servicios más reservados hoy</h3>
              {topServices.map((s) => <BarRow key={s.name} label={s.name} pct={s.pct} />)}
            </div>
            <div className="border border-stone-200 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3">Ocupación de la semana</h3>
              <BarRow label="Lun" pct={60} />
              <BarRow label="Mar" pct={45} />
              <BarRow label="Mié" pct={70} />
              <BarRow label="Jue" pct={90} />
              <BarRow label="Vie" pct={82} />
            </div>
          </div>
        </>
      )}

      {showNewAppt && (
        <NewApptModal
          clients={clients}
          services={services}
          appts={appts}
          employees={employees}
          onClose={() => setShowNewAppt(false)}
          onCreate={(appt, newClient) => {
            onCreateAppt(appt);
            if (newClient) onCreateClient(newClient);
            setToast({ message: `Cita creada para ${appt.client}` });
            setShowNewAppt(false);
          }}
        />
      )}
      {showRevenue && <IngresosModal total={totalRevenue} breakdown={breakdown} trend={trend} onClose={() => setShowRevenue(false)} />}
      {toast && <Toast message={toast.message} actionLabel={toast.actionLabel} onAction={toast.onAction} onClose={() => setToast(null)} />}
      {confirmTarget && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: "rgba(15,23,42,0.35)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmTarget(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <X size={22} />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-1.5">¿Cancelar esta cita?</h3>
            <p className="text-sm text-slate-500 mb-5">
              {confirmTarget.client} · {confirmTarget.service} · {confirmTarget.time}. Se le avisará por WhatsApp que la cita fue cancelada.
            </p>
            <button onClick={confirmCancelConfirmed} className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl mb-2.5 text-sm">
              Sí, cancelar cita
            </button>
            <button onClick={() => setConfirmTarget(null)} className="w-full border border-stone-200 py-2.5 rounded-xl font-semibold text-sm">
              No, mantener cita
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function NewClientModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      setError("Completa nombre y teléfono para continuar.");
      return;
    }
    onCreate({
      id: "cl" + Date.now(),
      name: name.trim(),
      initials: initialsFromName(name.trim()),
      phone: phone.trim(),
      email: email.trim(),
      since: "18 sep 2026",
      count: 0,
      spent: "RD$0",
      status: "Activo",
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(15,23,42,0.35)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-serif text-lg font-semibold">Nuevo cliente</h3>
          <X size={20} className="cursor-pointer text-slate-400 flex-shrink-0" onClick={onClose} />
        </div>
        <div className="mb-3.5">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nombre completo</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm" placeholder="Nombre y apellido" />
        </div>
        <div className="mb-3.5">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Teléfono</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm" placeholder="809-555-0000" />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Correo (opcional)</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm" placeholder="correo@email.com" />
        </div>
        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
        <button onClick={handleSubmit} className="w-full bg-emerald-700 text-white font-semibold py-3 rounded-xl text-sm">Crear cliente</button>
      </div>
    </div>
  );
}

function ClientesPanel({ clients, onOpenClient, onCreateClient }) {
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState("");
  const total = CLIENT_BASE_COUNT + clients.length;
  const query = search.trim().toLowerCase();
  const filtered = query ? clients.filter((c) => c.name.toLowerCase().includes(query) || c.phone.includes(query)) : clients;

  const exportCSV = () => {
    downloadCSV(
      "clientes.csv",
      ["Nombre", "Teléfono", "Correo", "Registrado", "Citas", "Estado"],
      clients.map((c) => [c.name, c.phone, c.email, c.since, c.count, c.status])
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="font-serif text-xl font-semibold mb-0.5">Clientes</h2>
          <div className="text-sm text-slate-500">{total} clientes registrados</div>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente..." className="border border-stone-200 rounded-lg px-3 py-2 text-sm w-48" />
          <button onClick={exportCSV} className="border border-stone-200 text-slate-600 text-sm font-semibold px-4 py-2.5 rounded-lg">Exportar CSV</button>
          <button onClick={() => setShowNew(true)} className="bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg">+ Nuevo cliente</button>
        </div>
      </div>
      <div className="border border-stone-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-stone-200">
              <th className="py-2.5 px-3 font-semibold">Cliente</th>
              <th className="py-2.5 px-3 font-semibold">Teléfono</th>
              <th className="py-2.5 px-3 font-semibold">Registrado</th>
              <th className="py-2.5 px-3 font-semibold">N° citas</th>
              <th className="py-2.5 px-3 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="py-6 px-3 text-center text-sm text-slate-400">No encontramos clientes que coincidan con "{search}".</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} onClick={() => onOpenClient(c)} className="border-b border-stone-100 last:border-0 cursor-pointer hover:bg-stone-50">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {c.initials}
                    </span>
                    <span className="font-semibold whitespace-nowrap">{c.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">{c.phone}</td>
                <td className="py-3 px-3 whitespace-nowrap">{c.since}</td>
                <td className="py-3 px-3">{c.count}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${c.status === "Activo" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showNew && (
        <NewClientModal
          onClose={() => setShowNew(false)}
          onCreate={(c) => { onCreateClient(c); setShowNew(false); }}
        />
      )}
    </div>
  );
}

function ClientDrawer({ client, onClose }) {
  return (
    <div className="fixed inset-0 flex justify-end z-50" style={{ background: "rgba(15,23,42,0.35)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-96 max-w-full bg-white p-6 overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-serif font-semibold text-lg flex-shrink-0">
              {client.initials}
            </div>
            <div>
              <h3 className="font-semibold text-base">{client.name}</h3>
              <div className="text-xs text-slate-500">{client.phone} · {client.email}</div>
            </div>
          </div>
          <X size={20} className="cursor-pointer text-slate-400 flex-shrink-0" onClick={onClose} />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="border border-stone-200 rounded-lg p-2.5 text-center">
            <div className="font-serif font-semibold text-lg">{client.count}</div>
            <div className="text-xs text-slate-500 mt-0.5">Citas totales</div>
          </div>
          <div className="border border-stone-200 rounded-lg p-2.5 text-center">
            <div className="font-serif font-semibold text-lg">{client.spent}</div>
            <div className="text-xs text-slate-500 mt-0.5">Total gastado</div>
          </div>
          <div className="border border-stone-200 rounded-lg p-2.5 text-center">
            <div className="font-serif font-semibold text-lg">{client.since}</div>
            <div className="text-xs text-slate-500 mt-0.5">Cliente desde</div>
          </div>
        </div>
        <h4 className="text-xs font-semibold text-slate-500 mb-2.5 mt-5">Estado</h4>
        <div className="flex justify-between items-center py-2.5 border-b border-stone-100 text-sm">
          <span>Estado del cliente</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${client.status === "Activo" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
            {client.status}
          </span>
        </div>
      </div>
    </div>
  );
}

function ServiceFormModal({ initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || "");
  const [duration, setDuration] = useState(initial?.duration || DURATION_OPTIONS[2]);
  const [price, setPrice] = useState(initial ? initial.priceLabel.replace(/[^\d]/g, "") : "");
  const [desc, setDesc] = useState(initial?.desc || "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) { setError("Escribe un nombre para el servicio."); return; }
    if (!price.trim()) { setError("Escribe un precio."); return; }
    onSave({
      id: initial?.id || "s" + Date.now(),
      name: name.trim(),
      duration,
      priceLabel: `RD$${price.trim()}`,
      active: initial ? initial.active : true,
      desc: desc.trim(),
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(15,23,42,0.35)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-serif text-lg font-semibold">{initial ? "Editar servicio" : "Nuevo servicio"}</h3>
          <X size={20} className="cursor-pointer text-slate-400 flex-shrink-0" onClick={onClose} />
        </div>
        <div className="mb-3.5">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nombre del servicio</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Corte para niños" className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Duración</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm">
              {DURATION_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Precio (RD$)</label>
            <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))} placeholder="450" className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Descripción (opcional)</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm resize-none h-16" placeholder="Breve descripción para el cliente" />
        </div>
        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
        <button onClick={handleSubmit} className="w-full bg-emerald-700 text-white font-semibold py-3 rounded-xl text-sm">{initial ? "Guardar cambios" : "Crear servicio"}</button>
      </div>
    </div>
  );
}

function AddBlockModal({ onClose, onAdd }) {
  const [start, setStart] = useState("8:00 AM");
  const [end, setEnd] = useState("6:00 PM");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (parseTimeToMinutes(start) >= parseTimeToMinutes(end)) {
      setError('La hora "Hasta" debe ser después de la hora "Desde".');
      return;
    }
    onAdd(start, end);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(15,23,42,0.35)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-serif text-lg font-semibold">Agregar bloque de horario</h3>
          <X size={20} className="cursor-pointer text-slate-400 flex-shrink-0" onClick={onClose} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Desde</label>
            <select value={start} onChange={(e) => setStart(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm">
              {HOUR_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Hasta</label>
            <select value={end} onChange={(e) => setEnd(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm">
              {HOUR_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
        <button onClick={handleSubmit} className="w-full bg-emerald-700 text-white font-semibold py-3 rounded-xl text-sm">Agregar bloque</button>
      </div>
    </div>
  );
}

function AddExceptionModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Escribe un motivo para el bloqueo.");
      return;
    }
    onAdd({ n: name.trim(), d: detail.trim() || "Todo el día" });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(15,23,42,0.35)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-serif text-lg font-semibold">Agregar bloqueo</h3>
          <X size={20} className="cursor-pointer text-slate-400 flex-shrink-0" onClick={onClose} />
        </div>
        <div className="mb-3.5">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Motivo</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Vacaciones, feriado, mantenimiento" className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm" />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Fecha u horario</label>
          <input value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Ej: 1 – 15 de agosto" className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm" />
        </div>
        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
        <button onClick={handleSubmit} className="w-full bg-emerald-700 text-white font-semibold py-3 rounded-xl text-sm">Agregar bloqueo</button>
      </div>
    </div>
  );
}

function EmployeeFormModal({ initial, services, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || "");
  const [role, setRole] = useState(initial?.role || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [serviceIds, setServiceIds] = useState(initial?.serviceIds || []);
  const [error, setError] = useState("");

  const toggleService = (id) => setServiceIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleSubmit = () => {
    if (!name.trim()) { setError("Escribe el nombre del empleado."); return; }
    if (!role.trim()) { setError("Escribe su puesto."); return; }
    onSave({
      id: initial?.id || "e" + Date.now(),
      name: name.trim(),
      initials: initialsFromName(name.trim()),
      role: role.trim(),
      phone: phone.trim(),
      active: initial ? initial.active : true,
      serviceIds,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(15,23,42,0.35)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-serif text-lg font-semibold">{initial ? "Editar empleado" : "Nuevo empleado"}</h3>
          <X size={20} className="cursor-pointer text-slate-400 flex-shrink-0" onClick={onClose} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nombre completo</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre y apellido" className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Puesto</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ej: Barbero senior" className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm" />
          </div>
        </div>
        <div className="mb-3.5">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Teléfono</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="809-555-0000" className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm" />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Servicios que puede realizar</label>
          <div className="flex flex-wrap gap-2">
            {services.filter((s) => s.active).map((s) => (
              <div
                key={s.id}
                onClick={() => toggleService(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                  serviceIds.includes(s.id) ? "bg-emerald-700 text-white border-emerald-700" : "bg-white border-stone-200 text-slate-600"
                }`}
              >
                {s.name}
              </div>
            ))}
          </div>
        </div>
        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
        <button onClick={handleSubmit} className="w-full bg-emerald-700 text-white font-semibold py-3 rounded-xl text-sm">{initial ? "Guardar cambios" : "Crear empleado"}</button>
      </div>
    </div>
  );
}

function EmpleadosPanel({ employees, setEmployees, services }) {
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toggleActive = (id) => setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e)));

  const handleSave = (emp) => {
    setEmployees((prev) => (prev.some((e) => e.id === emp.id) ? prev.map((e) => (e.id === emp.id ? emp : e)) : [...prev, emp]));
    setShowNew(false);
    setEditing(null);
  };

  const handleDelete = () => {
    setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap gap-3 mb-5">
        <div>
          <h2 className="font-serif text-xl font-semibold mb-0.5">Empleados</h2>
          <div className="text-sm text-slate-500">{employees.length} en el equipo · {employees.filter((e) => e.active).length} activos</div>
        </div>
        <button onClick={() => setShowNew(true)} className="bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg">+ Agregar empleado</button>
      </div>

      {employees.length === 0 && (
        <div className="text-center py-10 px-4 border-2 border-dashed border-stone-200 rounded-xl mb-3">
          <p className="text-sm font-semibold text-slate-600 mb-1">Aún no tienes empleados registrados</p>
          <p className="text-xs text-slate-500">Agrega tu equipo para poder asignar profesionales a las citas.</p>
        </div>
      )}

      {employees.map((e) => (
        <div key={e.id} className={`flex items-center gap-3.5 bg-white border border-stone-200 rounded-xl px-4 py-3.5 mb-2.5 flex-wrap md:flex-nowrap ${!e.active ? "opacity-55" : ""}`}>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-serif font-semibold text-sm flex-shrink-0">
            {e.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm mb-0.5">{e.name}</p>
            <p className="text-xs text-slate-500">{e.role} · {e.phone}</p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {e.serviceIds.map((sid) => {
                const svc = services.find((s) => s.id === sid);
                return svc ? (
                  <span key={sid} className="text-xs bg-stone-100 text-slate-500 px-2 py-0.5 rounded-full">{svc.name}</span>
                ) : null;
              })}
            </div>
          </div>
          <Toggle on={e.active} onClick={() => toggleActive(e.id)} />
          <Pencil size={15} className="text-slate-400 cursor-pointer flex-shrink-0" onClick={() => setEditing(e)} />
          <Trash2 size={15} className="text-slate-400 cursor-pointer flex-shrink-0" onClick={() => setDeleteTarget(e)} />
        </div>
      ))}
      <div
        onClick={() => setShowNew(true)}
        className="border-2 border-dashed border-stone-200 rounded-xl py-4 text-center text-sm font-semibold text-slate-500 cursor-pointer hover:border-emerald-700 hover:text-emerald-800"
      >
        + Agregar empleado
      </div>
      {(showNew || editing) && (
        <EmployeeFormModal
          initial={editing}
          services={services}
          onClose={() => { setShowNew(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="¿Eliminar este empleado?"
          message={`"${deleteTarget.name}" ya no podrá ser asignado a nuevas citas.`}
          confirmLabel="Sí, eliminar"
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function ServiciosPanel({ services, setServices }) {
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toggleActive = (id) => setServices((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));

  const handleSave = (svc) => {
    setServices((prev) => (prev.some((s) => s.id === svc.id) ? prev.map((s) => (s.id === svc.id ? svc : s)) : [...prev, svc]));
    setShowNew(false);
    setEditing(null);
  };

  const handleDelete = () => {
    setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap gap-3 mb-5">
        <div>
          <h2 className="font-serif text-xl font-semibold mb-0.5">Servicios</h2>
          <div className="text-sm text-slate-500">{services.length} servicios · {services.filter((s) => s.active).length} activos</div>
        </div>
        <button onClick={() => setShowNew(true)} className="bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg">+ Nuevo servicio</button>
      </div>

      {services.length === 0 && (
        <div className="text-center py-10 px-4 border-2 border-dashed border-stone-200 rounded-xl mb-3">
          <p className="text-sm font-semibold text-slate-600 mb-1">Aún no tienes servicios</p>
          <p className="text-xs text-slate-500">Agrega el primero para que tus clientes puedan empezar a reservar.</p>
        </div>
      )}

      {services.map((s) => (
        <div key={s.id} className={`flex items-center gap-3.5 bg-white border border-stone-200 rounded-xl px-4 py-3.5 mb-2.5 flex-wrap md:flex-nowrap ${!s.active ? "opacity-55" : ""}`}>
          <GripVertical size={16} className="text-stone-300 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm mb-0.5">{s.name}</p>
            <p className="text-xs text-slate-500">{s.desc}</p>
          </div>
          <div className="text-right">
            <div className="font-serif font-semibold text-sm">{s.duration}</div>
            <div className="text-xs text-slate-500">Duración</div>
          </div>
          <div className="text-right">
            <div className="font-serif font-semibold text-sm">{s.priceLabel}</div>
            <div className="text-xs text-slate-500">Precio</div>
          </div>
          <Toggle on={s.active} onClick={() => toggleActive(s.id)} />
          <Pencil size={15} className="text-slate-400 cursor-pointer flex-shrink-0" onClick={() => setEditing(s)} />
          <Trash2 size={15} className="text-slate-400 cursor-pointer flex-shrink-0" onClick={() => setDeleteTarget(s)} />
        </div>
      ))}
      <div
        onClick={() => setShowNew(true)}
        className="border-2 border-dashed border-stone-200 rounded-xl py-4 text-center text-sm font-semibold text-slate-500 cursor-pointer hover:border-emerald-700 hover:text-emerald-800"
      >
        + Agregar servicio
      </div>
      {(showNew || editing) && (
        <ServiceFormModal
          initial={editing}
          onClose={() => { setShowNew(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="¿Eliminar este servicio?"
          message={`"${deleteTarget.name}" dejará de estar disponible para nuevas reservas.`}
          confirmLabel="Sí, eliminar"
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function HorariosPanel({ schedule, setSchedule }) {
  const [exceptions, setExceptions] = useState(EXCEPTIONS);
  const [blockTargetDay, setBlockTargetDay] = useState(null);
  const [showAddException, setShowAddException] = useState(false);

  const toggleDay = (i) => setSchedule((prev) => prev.map((s, idx) => (idx === i ? { ...s, open: !s.open } : s)));
  const addBlock = (dayIndex, start, end) => {
    setSchedule((prev) => prev.map((s, idx) => (idx === dayIndex ? { ...s, open: true, blocks: [...s.blocks, `${start} – ${end}`] } : s)));
    setBlockTargetDay(null);
  };
  const removeBlock = (dayIndex, blockIndex) => {
    setSchedule((prev) => prev.map((s, idx) => (idx === dayIndex ? { ...s, blocks: s.blocks.filter((_, bi) => bi !== blockIndex) } : s)));
  };
  const addException = (exc) => {
    setExceptions((prev) => [...prev, exc]);
    setShowAddException(false);
  };
  const removeException = (i) => setExceptions((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div>
      <h2 className="font-serif text-xl font-semibold mb-0.5">Horarios</h2>
      <div className="text-sm text-slate-500 mb-5">Horario semanal y excepciones. Los cambios aquí se reflejan al instante en la disponibilidad que ve el cliente.</div>
      <div className="border border-stone-200 rounded-xl p-4 mb-4">
        {schedule.map((s, i) => (
          <div key={s.day} className={`flex items-start gap-4 py-3.5 flex-wrap ${i < schedule.length - 1 ? "border-b border-stone-100" : ""}`}>
            <div className="w-28 flex items-center gap-2.5 flex-shrink-0 pt-0.5">
              <Toggle on={s.open} onClick={() => toggleDay(i)} />
              <span className="text-sm font-semibold">{s.day}</span>
            </div>
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              {s.open ? (
                <>
                  {s.blocks.map((b, bi) => (
                    <div key={bi} className="flex items-center gap-2">
                      <span className="border border-stone-200 rounded-lg px-3 py-1.5 text-xs bg-stone-50">{b}</span>
                      <X size={14} className="text-red-500 cursor-pointer" onClick={() => removeBlock(i, bi)} />
                    </div>
                  ))}
                  <span onClick={() => setBlockTargetDay(i)} className="text-xs font-semibold text-emerald-800 cursor-pointer">+ Agregar bloque</span>
                </>
              ) : (
                <span className="text-sm text-slate-500 pt-1">Cerrado</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border border-stone-200 rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-sm">Bloqueos y excepciones</h3>
          <span onClick={() => setShowAddException(true)} className="text-xs font-semibold text-emerald-800 cursor-pointer">+ Agregar bloqueo</span>
        </div>
        {exceptions.map((e, i) => (
          <div key={i} className={`flex justify-between items-center py-3 ${i < exceptions.length - 1 ? "border-b border-stone-100" : ""}`}>
            <div>
              <div className="text-sm font-semibold">{e.n}</div>
              <div className="text-xs text-slate-500">{e.d}</div>
            </div>
            <Trash2 size={15} className="text-slate-400 cursor-pointer flex-shrink-0" onClick={() => removeException(i)} />
          </div>
        ))}
      </div>

      {blockTargetDay !== null && (
        <AddBlockModal onClose={() => setBlockTargetDay(null)} onAdd={(start, end) => addBlock(blockTargetDay, start, end)} />
      )}
      {showAddException && <AddExceptionModal onClose={() => setShowAddException(false)} onAdd={addException} />}
    </div>
  );
}

function CfgField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      <input value={value} onChange={onChange} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm bg-stone-50" />
    </div>
  );
}

function CfgToggleRow({ title, desc, on, onToggle }) {
  return (
    <div className="flex justify-between items-center gap-4 py-3.5 border-b border-stone-100 last:border-0">
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
      </div>
      <Toggle on={on} onClick={onToggle} />
    </div>
  );
}

const COLOR_OPTIONS = ["#047857", "#0f172a", "#d97706", "#3b5ba9", "#8a3b5e"];

function ConfigPanel({ profile, setProfile }) {
  const [draft, setDraft] = useState(profile);
  const [toast, setToast] = useState(null);
  const set = (field) => (e) => setDraft((prev) => ({ ...prev, [field]: e.target.value }));
  const toggle = (field) => () => setDraft((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSave = () => {
    setProfile(draft);
    setToast("Cambios guardados — ya se reflejan en la página del cliente");
  };

  return (
    <div>
      <h2 className="font-serif text-xl font-semibold mb-0.5">Configuración</h2>
      <div className="text-sm text-slate-500 mb-5">Perfil del negocio, reglas de reserva y notificaciones</div>

      <div className="border border-stone-200 rounded-xl p-5 mb-5">
        <h3 className="font-semibold text-sm mb-1">Perfil del negocio</h3>
        <p className="text-xs text-slate-500 mb-4">Esta información aparece en tu página pública de reservas.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <CfgField label="Nombre del negocio" value={draft.name} onChange={set("name")} />
          <CfgField label="Enlace público" value={draft.publicLink} onChange={set("publicLink")} />
          <CfgField label="Teléfono" value={draft.phone} onChange={set("phone")} />
          <CfgField label="Correo electrónico" value={draft.email} onChange={set("email")} />
          <CfgField label="Instagram" value={draft.instagram} onChange={set("instagram")} />
          <CfgField label="WhatsApp" value={draft.whatsapp} onChange={set("whatsapp")} />
        </div>
        <div className="mt-3.5">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Descripción</label>
          <textarea
            value={draft.description}
            onChange={set("description")}
            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm bg-stone-50 resize-none h-16"
          />
        </div>
        <label className="block text-xs font-semibold text-slate-500 mb-2 mt-4">Color principal</label>
        <div className="flex gap-2.5">
          {COLOR_OPTIONS.map((c, i) => (
            <div
              key={i}
              onClick={() => setDraft((prev) => ({ ...prev, colorIndex: i }))}
              style={{ background: c }}
              className={`w-7 h-7 rounded-full cursor-pointer border-2 ${draft.colorIndex === i ? "border-slate-900" : "border-transparent"}`}
            />
          ))}
        </div>
      </div>

      <div className="border border-stone-200 rounded-xl p-5 mb-5">
        <h3 className="font-semibold text-sm mb-1">Reglas de reserva</h3>
        <p className="text-xs text-slate-500 mb-2">Controla cómo y cuándo tus clientes pueden reservar, cancelar o reprogramar.</p>
        <CfgToggleRow title="Permitir cancelaciones" desc='El cliente puede cancelar desde "Mis citas"' on={draft.allowCancellation} onToggle={toggle("allowCancellation")} />
        <CfgToggleRow title="Permitir reprogramación" desc="El cliente puede cambiar fecha/hora" on={draft.allowRescheduling} onToggle={toggle("allowRescheduling")} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
          <CfgField label="Cancelar hasta (horas antes)" value={draft.cancelHours} onChange={set("cancelHours")} />
          <CfgField label="Reprogramar hasta (horas antes)" value={draft.rescheduleHours} onChange={set("rescheduleHours")} />
          <CfgField label="Anticipación mínima" value={draft.minNotice} onChange={set("minNotice")} />
          <CfgField label="Máximo de días para reservar" value={draft.maxDays} onChange={set("maxDays")} />
        </div>
      </div>

      <div className="border border-stone-200 rounded-xl p-5 mb-5">
        <h3 className="font-semibold text-sm mb-1">Notificaciones</h3>
        <p className="text-xs text-slate-500 mb-2">Correos automáticos enviados al cliente en cada etapa de su cita.</p>
        <CfgToggleRow title="Email de confirmación" desc="Al momento de reservar" on={draft.notifyConfirm} onToggle={toggle("notifyConfirm")} />
        <CfgToggleRow title="Recordatorio 24 horas antes" desc="Reduce el ausentismo" on={draft.notifyReminder24} onToggle={toggle("notifyReminder24")} />
        <CfgToggleRow title="Recordatorio 2 horas antes" desc="Aviso adicional el mismo día" on={draft.notifyReminder2} onToggle={toggle("notifyReminder2")} />
      </div>

      <button onClick={handleSave} className="bg-emerald-700 text-white font-semibold px-5 py-3 rounded-lg text-sm">Guardar cambios</button>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

function BusinessPanel({ clients, setClients, appts, setAppts, services, setServices, schedule, setSchedule, profile, setProfile, employees, setEmployees }) {
  const [panel, setPanel] = useState("citas");
  const [drawerClient, setDrawerClient] = useState(null);

  const updateStatus = (id, status) => setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  const createAppt = (appt) => setAppts((prev) => [...prev, appt]);
  const createClient = (client) => setClients((prev) => [...prev, client]);

  return (
    <div>
      <p className="text-center text-sm text-slate-500 max-w-lg mx-auto mb-7 leading-relaxed px-4">
        Panel del negocio — vista de <strong>{profile.name}</strong> como Business Owner. Los datos mostrados pertenecen únicamente a este tenant.
      </p>
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xl flex mx-4" style={{ minHeight: "640px" }}>
        <aside className="hidden md:flex w-56 bg-slate-900 text-stone-300 p-5 flex-col flex-shrink-0">
          <div className="flex items-center gap-2.5 pb-5 mb-4 border-b border-slate-700">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-900 flex items-center justify-center font-serif font-semibold text-sm flex-shrink-0">
              {initialsFromName(profile.name)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white leading-tight truncate">{profile.name}</div>
              <div className="text-xs text-slate-400">Plan PRO</div>
            </div>
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = panel === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setPanel(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer mb-0.5 ${
                  active ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon size={16} /> {item.full}
              </div>
            );
          })}
        </aside>

        <main className="flex-1 p-5 md:p-7 overflow-x-auto pb-24 md:pb-7 min-w-0">
          {panel === "citas" && (
            <CitasPanel
              appts={appts}
              clients={clients}
              services={services}
              employees={employees}
              schedule={schedule}
              profile={profile}
              updateStatus={updateStatus}
              setAppts={setAppts}
              onGoToClientes={() => setPanel("clientes")}
              onCreateAppt={createAppt}
              onCreateClient={createClient}
            />
          )}
          {panel === "clientes" && <ClientesPanel clients={clients} onOpenClient={setDrawerClient} onCreateClient={createClient} />}
          {panel === "empleados" && <EmpleadosPanel employees={employees} setEmployees={setEmployees} services={services} />}
          {panel === "servicios" && <ServiciosPanel services={services} setServices={setServices} />}
          {panel === "horarios" && <HorariosPanel schedule={schedule} setSchedule={setSchedule} />}
          {panel === "config" && <ConfigPanel profile={profile} setProfile={setProfile} />}
        </main>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-around py-2 z-40 shadow-lg">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = panel === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setPanel(item.id)}
              className={`flex flex-col items-center gap-0.5 px-1 text-xs font-semibold cursor-pointer ${active ? "text-emerald-800" : "text-slate-400"}`}
            >
              <Icon size={20} /> {item.label}
            </div>
          );
        })}
      </div>

      {drawerClient && <ClientDrawer client={drawerClient} onClose={() => setDrawerClient(null)} />}
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */

const PLAN_STYLES = {
  BASIC: "bg-stone-100 text-stone-600",
  PRO: "bg-emerald-50 text-emerald-800",
  BUSINESS: "bg-amber-50 text-amber-800",
};

function NewBusinessModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [plan, setPlan] = useState("BASIC");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !city.trim()) {
      setError("Completa el nombre del negocio y la ciudad.");
      return;
    }
    onCreate({ id: "t" + Date.now(), name: name.trim(), plan, city: city.trim(), clients: 0, status: "Activo" });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(15,23,42,0.35)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-serif text-lg font-semibold">Registrar negocio</h3>
          <X size={20} className="cursor-pointer text-slate-400 flex-shrink-0" onClick={onClose} />
        </div>
        <div className="mb-3.5">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nombre del negocio</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Spa Aurora" className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm" />
        </div>
        <div className="mb-3.5">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Ciudad</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ej: Santo Domingo" className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm" />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Plan</label>
          <select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm">
            <option value="BASIC">BASIC</option>
            <option value="PRO">PRO</option>
            <option value="BUSINESS">BUSINESS</option>
          </select>
        </div>
        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
        <button onClick={handleSubmit} className="w-full bg-emerald-700 text-white font-semibold py-3 rounded-xl text-sm">Registrar negocio</button>
      </div>
    </div>
  );
}

function SuperAdminPanel() {
  const [businesses, setBusinesses] = useState(PLATFORM_BUSINESSES_SEED);
  const [showNew, setShowNew] = useState(false);

  const toggleStatus = (id) =>
    setBusinesses((prev) => prev.map((b) => (b.id === id ? { ...b, status: b.status === "Activo" ? "Inactivo" : "Activo" } : b)));

  const totalNegocios = businesses.length;
  const activos = businesses.filter((b) => b.status === "Activo").length;
  const totalClientesPlataforma = businesses.reduce((s, b) => s + b.clients, 0);
  const suscripcionesPagas = businesses.filter((b) => b.plan !== "BASIC").length;

  return (
    <div className="px-4">
      <p className="text-center text-sm text-slate-500 max-w-lg mx-auto mb-7 leading-relaxed">
        Vista ilustrativa del Super Admin de la plataforma. Muestra otros negocios de ejemplo — no están conectados al tenant "Barbería Dominicana" que ves en las otras dos pestañas.
      </p>

      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-7 shadow-xl">
        <div className="flex justify-between items-start mb-5 flex-wrap gap-3">
          <div>
            <h2 className="font-serif text-xl font-semibold mb-0.5">Plataforma</h2>
            <div className="text-sm text-slate-500">Todos los negocios registrados</div>
          </div>
          <button onClick={() => setShowNew(true)} className="bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg">+ Registrar negocio</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
          <StatCard label="Negocios totales" value={totalNegocios} accent />
          <StatCard label="Negocios activos" value={activos} />
          <StatCard label="Clientes en la plataforma" value={totalClientesPlataforma.toLocaleString("en-US")} />
          <StatCard label="Suscripciones PRO/BUSINESS" value={suscripcionesPagas} />
        </div>

        <div className="border border-stone-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-stone-200">
                <th className="py-2.5 px-3 font-semibold">Negocio</th>
                <th className="py-2.5 px-3 font-semibold">Plan</th>
                <th className="py-2.5 px-3 font-semibold">Ciudad</th>
                <th className="py-2.5 px-3 font-semibold">Clientes</th>
                <th className="py-2.5 px-3 font-semibold">Estado</th>
                <th className="py-2.5 px-3" />
              </tr>
            </thead>
            <tbody>
              {businesses.map((b) => (
                <tr key={b.id} className="border-b border-stone-100 last:border-0">
                  <td className="py-3 px-3 font-semibold whitespace-nowrap">{b.name}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${PLAN_STYLES[b.plan]}`}>{b.plan}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">{b.city}</td>
                  <td className="py-3 px-3">{b.clients}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${b.status === "Activo" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <button onClick={() => toggleStatus(b.id)} className="text-xs font-semibold text-slate-500">
                      {b.status === "Activo" ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showNew && (
        <NewBusinessModal
          onClose={() => setShowNew(false)}
          onCreate={(b) => { setBusinesses((prev) => [...prev, b]); setShowNew(false); }}
        />
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("client");
  const [clients, setClients] = useState(CLIENTS_SEED);
  const [appts, setAppts] = useState(APPTS_SEED);
  const [services, setServices] = useState(SERVICES_SEED);
  const [schedule, setSchedule] = useState(SCHEDULE_SEED);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [employees, setEmployees] = useState(EMPLOYEES_SEED);

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Fraunces', serif; }
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); } }
        .animate-pop { animation: popIn 420ms cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes fadeSlide { 0% { opacity: 0; transform: translateY(4px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade { animation: fadeSlide 400ms ease; }
      `}</style>
      <TopSwitcher view={view} setView={setView} />
      <div className="max-w-6xl mx-auto pb-16">
        {view === "client" && (
          <ClientFlow services={services} appts={appts} setAppts={setAppts} clients={clients} setClients={setClients} schedule={schedule} profile={profile} employees={employees} />
        )}
        {view === "business" && (
          <BusinessPanel
            clients={clients} setClients={setClients}
            appts={appts} setAppts={setAppts}
            services={services} setServices={setServices}
            schedule={schedule} setSchedule={setSchedule}
            profile={profile} setProfile={setProfile}
            employees={employees} setEmployees={setEmployees}
          />
        )}
        {view === "superadmin" && <SuperAdminPanel />}
      </div>
    </div>
  );
}
