import { useState, useRef, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Search,
  Navigation,
  Phone,
  MapPin,
  X,
  List,
  Map as MapIcon,
  ArrowLeft,
  Footprints,
  Car,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  distance: string;
  walkTime: string;
  hours: string | null;
  isOpen: boolean;
  lat: number;
  lng: number;
  phone: string;
}

interface RouteStep {
  instruction: string;
  distance: string;
  icon: string;
}

interface RouteInfo {
  distance: string;
  duration: string;
  steps: RouteStep[];
}

type TravelMode = "foot" | "driving";

const DAKAR_CENTER: [number, number] = [14.716677, -17.467686];

const pharmacies: Pharmacy[] = [
  {
    id: 1,
    name: "Pharmacie Plateau",
    address: "Avenue Léopold Sédar Senghor, Plateau",
    distance: "450 m",
    walkTime: "6 min",
    hours: "24h/24",
    isOpen: true,
    lat: 14.6937,
    lng: -17.4441,
    phone: "+221 33 823 45 67",
  },
  {
    id: 2,
    name: "Pharmacie Almadies",
    address: "Route des Almadies, Ngor",
    distance: "1.2 km",
    walkTime: "15 min",
    hours: "20h – 8h",
    isOpen: true,
    lat: 14.7457,
    lng: -17.5143,
    phone: "+221 33 820 12 34",
  },
  {
    id: 3,
    name: "Pharmacie Mermoz",
    address: "Rue de Kolda, Mermoz",
    distance: "2.5 km",
    walkTime: "32 min",
    hours: null,
    isOpen: false,
    lat: 14.7147,
    lng: -17.4736,
    phone: "+221 33 860 78 90",
  },
  {
    id: 4,
    name: "Pharmacie Point E",
    address: "Avenue Cheikh Anta Diop, Point E",
    distance: "3.1 km",
    walkTime: "40 min",
    hours: "24h/24",
    isOpen: true,
    lat: 14.7085,
    lng: -17.4692,
    phone: "+221 33 825 11 22",
  },
  {
    id: 5,
    name: "Pharmacie Résidence",
    address: "Cité Résidence, HLM",
    distance: "3.8 km",
    walkTime: "48 min",
    hours: "20h – 8h",
    isOpen: true,
    lat: 14.7237,
    lng: -17.4586,
    phone: "+221 33 832 44 55",
  },
  {
    id: 6,
    name: "Pharmacie El Mansour",
    address: "HLM Grand Yoff",
    distance: "4.2 km",
    walkTime: "54 min",
    hours: null,
    isOpen: false,
    lat: 14.7287,
    lng: -17.4486,
    phone: "+221 33 867 33 21",
  },
  {
    id: 7,
    name: "Pharmacie des Allées",
    address: "Avenue Bourguiba, Médina",
    distance: "4.7 km",
    walkTime: "60 min",
    hours: "24h/24",
    isOpen: true,
    lat: 14.7187,
    lng: -17.4536,
    phone: "+221 33 822 99 88",
  },
  {
    id: 8,
    name: "Pharmacie Aimé Césaire",
    address: "Rue Aimé Césaire, Plateau",
    distance: "5.0 km",
    walkTime: "65 min",
    hours: "20h – 8h",
    isOpen: true,
    lat: 14.7037,
    lng: -17.4591,
    phone: "+221 33 823 77 66",
  },
];

// ─── Route helpers ────────────────────────────────────────────────────────────

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} h ${m} min` : `${h} h`;
}

function getStepIcon(maneuverType: string, modifier?: string): string {
  if (maneuverType === "arrive") return "🏁";
  if (maneuverType === "depart") return "📍";
  if (maneuverType === "roundabout" || maneuverType === "rotary") return "🔄";
  if (modifier?.includes("right")) return "↱";
  if (modifier?.includes("left")) return "↰";
  if (modifier === "uturn") return "↩";
  return "↑";
}

function getStepInstruction(step: {
  maneuver: { type: string; modifier?: string };
  name: string;
}): string {
  const { maneuver, name } = step;
  const street = name && name !== "" ? ` sur ${name}` : "";

  switch (maneuver.type) {
    case "depart":
      return `Partez${street}`;
    case "arrive":
      return "Vous êtes arrivé à destination";
    case "turn": {
      const mod = maneuver.modifier ?? "";
      if (mod === "left") return `Tournez à gauche${street}`;
      if (mod === "right") return `Tournez à droite${street}`;
      if (mod === "slight left") return `Restez à gauche${street}`;
      if (mod === "slight right") return `Restez à droite${street}`;
      if (mod === "sharp left") return `Virage serré à gauche${street}`;
      if (mod === "sharp right") return `Virage serré à droite${street}`;
      return `Tournez${street}`;
    }
    case "new name":
    case "continue":
      return `Continuez tout droit${street}`;
    case "merge":
      return `Fusionnez${street}`;
    case "on ramp":
      return `Prenez la bretelle${street}`;
    case "off ramp":
      return `Quittez la voie rapide${street}`;
    case "roundabout":
    case "rotary":
      return `Prenez le rond-point${street}`;
    case "fork": {
      const mod = maneuver.modifier ?? "";
      if (mod.includes("left")) return `Prenez à gauche à l'embranchement${street}`;
      return `Prenez à droite à l'embranchement${street}`;
    }
    default:
      return `Continuez${street}`;
  }
}

async function fetchRoute(
  start: [number, number],
  end: [number, number],
  mode: TravelMode,
): Promise<{ geometry: [number, number][]; info: RouteInfo }> {
  const url = `https://router.project-osrm.org/route/v1/${mode}/${start[1]},${start[0]};${end[1]},${end[0]}?steps=true&geometries=geojson&overview=full`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur réseau");
  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.length) throw new Error("Itinéraire introuvable");

  const route = data.routes[0];

  // GeoJSON coordinates are [lng, lat] – flip to [lat, lng] for Leaflet
  const geometry: [number, number][] = route.geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const steps: RouteStep[] = route.legs[0].steps.map((step: any) => ({
    instruction: getStepInstruction(step),
    distance: formatDistance(step.distance),
    icon: getStepIcon(step.maneuver.type, step.maneuver.modifier),
  }));

  return {
    geometry,
    info: {
      distance: formatDistance(route.distance),
      duration: formatDuration(route.duration),
      steps,
    },
  };
}

// ─── Marker icons ─────────────────────────────────────────────────────────────

const createPharmacyIcon = (selected: boolean) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width:38px;height:38px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
        background:${selected ? "#0d5154" : "#e53e3e"};
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 2px 8px rgba(0,0,0,0.35);
        border:2px solid ${selected ? "#01c2a7" : "#c53030"};
      ">
        <span style="transform:rotate(45deg);color:white;font-size:16px;font-weight:700;">+</span>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });

const userLocationIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:22px;height:22px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;inset:0;border-radius:50%;background:rgba(66,133,244,0.25);animation:user-dot-pulse 2s ease-out infinite;"></div>
      <div style="position:relative;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,0.30);display:flex;align-items:center;justify-content:center;">
        <div style="width:11px;height:11px;border-radius:50%;background:#4285F4;"></div>
      </div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

// ─── Map sub-components ───────────────────────────────────────────────────────

function MapController({ flyTarget }: { flyTarget: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (flyTarget) map.flyTo(flyTarget, 15, { duration: 1.2 });
  }, [flyTarget, map]);
  return null;
}

function MapFitBounds({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
  }, [bounds, map]);
  return null;
}

// ─── UI Components ────────────────────────────────────────────────────────────

function StatusBadge({ isOpen, label }: { isOpen: boolean; label?: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold font-montserrat ${
        isOpen ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      {label ?? (isOpen ? "Ouvert" : "Fermé")}
    </span>
  );
}

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  selected: boolean;
  onClick: () => void;
  cardRef?: (el: HTMLDivElement | null) => void;
}

function PharmacyCard({ pharmacy, selected, onClick, cardRef }: PharmacyCardProps) {
  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        selected
          ? "border-pharmaloc-teal bg-teal-50/30 shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-montserrat font-bold text-[15px] text-pharmaloc-dark leading-snug">
          {pharmacy.name}
        </h3>
        <StatusBadge isOpen={pharmacy.isOpen} />
      </div>
      <p className="font-sora text-[13px] text-gray-500 mb-2 leading-relaxed">
        {pharmacy.address}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-sora text-[13px] text-gray-500">
          {pharmacy.distance} &bull; {pharmacy.walkTime} à pied
        </span>
        {pharmacy.isOpen && pharmacy.hours && (
          <span className="font-sora text-[13px] font-semibold text-pharmaloc-teal">
            {pharmacy.hours}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Route Panel (Google Maps-style) ─────────────────────────────────────────

interface RoutePanelProps {
  pharmacy: Pharmacy;
  routeInfo: RouteInfo | null;
  travelMode: TravelMode;
  isLoading: boolean;
  error: string | null;
  onChangeTravelMode: (mode: TravelMode) => void;
  onClose: () => void;
}

function RoutePanel({
  pharmacy,
  routeInfo,
  travelMode,
  isLoading,
  error,
  onChangeTravelMode,
  onClose,
}: RoutePanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft size={16} className="text-gray-600" />
          </button>
          <div className="min-w-0">
            <p className="font-sora text-[11px] text-gray-400 uppercase tracking-wide">
              Itinéraire vers
            </p>
            <h2 className="font-montserrat font-bold text-[15px] text-pharmaloc-dark truncate">
              {pharmacy.name}
            </h2>
          </div>
        </div>

        {/* Travel mode toggle */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => onChangeTravelMode("foot")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-montserrat font-semibold text-[13px] transition-all ${
              travelMode === "foot"
                ? "bg-white text-pharmaloc-dark shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Footprints size={14} /> À pied
          </button>
          <button
            onClick={() => onChangeTravelMode("driving")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-montserrat font-semibold text-[13px] transition-all ${
              travelMode === "driving"
                ? "bg-white text-pharmaloc-dark shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Car size={14} /> En voiture
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={28} className="text-pharmaloc-teal animate-spin" />
            <p className="font-sora text-[14px] text-gray-500">
              Calcul de l'itinéraire…
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="mx-5 mt-5 p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3">
            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-montserrat font-semibold text-[14px] text-red-600 mb-1">
                Erreur
              </p>
              <p className="font-sora text-[13px] text-red-500">{error}</p>
            </div>
          </div>
        )}

        {/* Route info */}
        {!isLoading && routeInfo && (
          <>
            {/* Summary card */}
            <div className="mx-5 mt-4 rounded-xl bg-pharmaloc-dark text-white p-4">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-montserrat font-bold text-[28px] text-pharmaloc-accent">
                  {routeInfo.duration}
                </span>
                <span className="font-sora text-[14px] text-white/70">
                  · {routeInfo.distance}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-sora text-[13px] text-white/80">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  Votre position
                </div>
                <div
                  className="border-l-2 border-white/20 ml-[3px] pl-4 py-1 font-sora text-[12px] text-white/50"
                >
                  {pharmacy.address}
                </div>
                <div className="flex items-center gap-2 font-sora text-[13px] text-white/80">
                  <MapPin size={12} className="text-pharmaloc-accent" />
                  {pharmacy.name}
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="px-5 pt-4 pb-6">
              <p className="font-montserrat font-semibold text-[13px] text-gray-400 uppercase tracking-wide mb-3">
                Étapes
              </p>
              <div className="space-y-0">
                {routeInfo.steps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    {/* timeline */}
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-[14px]">
                        {step.icon}
                      </div>
                      {i < routeInfo.steps.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 my-1 min-h-[16px]" />
                      )}
                    </div>
                    {/* text */}
                    <div className="pb-3 pt-1 min-w-0">
                      <p className="font-sora text-[13px] text-gray-700 leading-snug">
                        {step.instruction}
                      </p>
                      {step.distance !== "0 m" && (
                        <p className="font-sora text-[12px] text-gray-400 mt-0.5">
                          {step.distance}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Detail Overlay ───────────────────────────────────────────────────────────

interface DetailOverlayProps {
  pharmacy: Pharmacy;
  onClose: () => void;
  onItineraire: (pharmacy: Pharmacy) => void;
}

function DetailOverlay({ pharmacy, onClose, onItineraire }: DetailOverlayProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-2xl shadow-2xl px-6 pt-5 pb-6 border-t border-gray-100 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="font-montserrat font-bold text-[18px] text-pharmaloc-dark">
            {pharmacy.name}
          </h2>
          <StatusBadge
            isOpen={pharmacy.isOpen}
            label={pharmacy.isOpen ? "Ouvert maintenant" : "Fermé"}
          />
        </div>
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X size={16} className="text-gray-600" />
        </button>
      </div>

      <p className="font-sora text-[14px] text-gray-500 mb-1 flex items-center gap-1.5">
        <MapPin size={14} className="text-pharmaloc-teal flex-shrink-0" />
        {pharmacy.address}
      </p>
      <p className="font-sora text-[14px] text-gray-500 mb-2">
        {pharmacy.distance} &bull; {pharmacy.walkTime} à pied
      </p>
      <p className="font-sora text-[14px] font-semibold text-pharmaloc-teal mb-4">
        Horaires: {pharmacy.isOpen && pharmacy.hours ? pharmacy.hours : "Fermé"}
      </p>

      <div className="flex gap-3">
        <a
          href={`tel:${pharmacy.phone}`}
          className="flex-1 flex items-center justify-center gap-2 border border-pharmaloc-teal text-pharmaloc-teal font-montserrat font-semibold text-[14px] rounded-xl py-3 hover:bg-pharmaloc-teal/5 transition-colors"
        >
          <Phone size={16} />
          Appeler
        </a>
        <button
          onClick={() => onItineraire(pharmacy)}
          className="flex-1 flex items-center justify-center gap-2 bg-pharmaloc-teal text-white font-montserrat font-semibold text-[14px] rounded-xl py-3 hover:bg-pharmaloc-dark transition-colors"
        >
          <Navigation size={16} />
          Itinéraire
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PharmacieGardePage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  // Routing state
  const [isRouting, setIsRouting] = useState(false);
  const [routeDestination, setRouteDestination] = useState<Pharmacy | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][] | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [routeBounds, setRouteBounds] = useState<L.LatLngBounds | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>("foot");

  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const filtered = pharmacies.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.address.toLowerCase().includes(query.toLowerCase()),
  );

  const selectedPharmacy = pharmacies.find((p) => p.id === selectedId) ?? null;

  // ── Route logic ─────────────────────────────────────────────────────────────

  const startRoute = useCallback(
    async (start: [number, number], pharmacy: Pharmacy, mode: TravelMode) => {
      setRouteLoading(true);
      setRouteError(null);
      setRouteGeometry(null);
      setRouteInfo(null);
      try {
        const { geometry, info } = await fetchRoute(start, [pharmacy.lat, pharmacy.lng], mode);
        setRouteGeometry(geometry);
        setRouteInfo(info);
        const bounds = L.latLngBounds([start, [pharmacy.lat, pharmacy.lng]]);
        setRouteBounds(bounds);
        setMobileView("map");
      } catch {
        setRouteError("Impossible de calculer l'itinéraire. Vérifiez votre connexion.");
      } finally {
        setRouteLoading(false);
      }
    },
    [],
  );

  const handleItineraire = useCallback(
    (pharmacy: Pharmacy) => {
      setIsRouting(true);
      setRouteDestination(pharmacy);
      setSelectedId(null); // close detail overlay
      setRouteBounds(null);

      if (userPosition) {
        startRoute(userPosition, pharmacy, travelMode);
      } else {
        // Request location first
        setRouteLoading(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
            setUserPosition(coords);
            startRoute(coords, pharmacy, travelMode);
          },
          () => {
            // fallback to Dakar center
            setUserPosition(DAKAR_CENTER);
            startRoute(DAKAR_CENTER, pharmacy, travelMode);
          },
        );
      }
    },
    [userPosition, travelMode, startRoute],
  );

  const handleChangeTravelMode = useCallback(
    (mode: TravelMode) => {
      setTravelMode(mode);
      if (routeDestination && userPosition) {
        startRoute(userPosition, routeDestination, mode);
      }
    },
    [routeDestination, userPosition, startRoute],
  );

  const handleStopRouting = useCallback(() => {
    setIsRouting(false);
    setRouteGeometry(null);
    setRouteInfo(null);
    setRouteBounds(null);
    setRouteError(null);
    setRouteDestination(null);
  }, []);

  // ── Map / sidebar helpers ────────────────────────────────────────────────────

  const handleSelectPharmacy = useCallback((pharmacy: Pharmacy) => {
    setSelectedId(pharmacy.id);
    setFlyTarget([pharmacy.lat, pharmacy.lng]);
    setMobileView("map");
  }, []);

  const handleMarkerClick = useCallback((pharmacy: Pharmacy) => {
    setSelectedId(pharmacy.id);
    setFlyTarget([pharmacy.lat, pharmacy.lng]);
    setTimeout(() => {
      cardRefs.current[pharmacy.id]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }, []);

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(coords);
        setFlyTarget(coords);
        setMobileView("map");
      },
      () => {
        setUserPosition(DAKAR_CENTER);
        setFlyTarget(DAKAR_CENTER);
        setMobileView("map");
      },
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Mobile view toggle */}
      <div className="md:hidden flex border-b border-gray-200 bg-white sticky top-[90px] z-40">
        <button
          onClick={() => setMobileView("list")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 font-montserrat font-semibold text-[14px] border-b-2 transition-colors ${
            mobileView === "list"
              ? "border-pharmaloc-teal text-pharmaloc-teal"
              : "border-transparent text-gray-400"
          }`}
        >
          <List size={16} /> Liste
        </button>
        <button
          onClick={() => setMobileView("map")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 font-montserrat font-semibold text-[14px] border-b-2 transition-colors ${
            mobileView === "map"
              ? "border-pharmaloc-teal text-pharmaloc-teal"
              : "border-transparent text-gray-400"
          }`}
        >
          <MapIcon size={16} /> Carte
        </button>
      </div>

      {/* Split area */}
      <div
        className="flex overflow-hidden"
        style={{ height: "calc(100vh - 90px)" }}
      >
        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside
          className={`flex flex-col bg-white border-r border-gray-200
            w-full md:w-[380px] md:flex-shrink-0
            ${mobileView === "map" ? "hidden md:flex" : "flex"}
          `}
        >
          {isRouting && routeDestination ? (
            <RoutePanel
              pharmacy={routeDestination}
              routeInfo={routeInfo}
              travelMode={travelMode}
              isLoading={routeLoading}
              error={routeError}
              onChangeTravelMode={handleChangeTravelMode}
              onClose={handleStopRouting}
            />
          ) : (
            <>
              {/* Sidebar header */}
              <div className="px-5 pt-6 pb-4 flex-shrink-0">
                <h1 className="font-montserrat font-bold text-[22px] text-pharmaloc-dark mb-4">
                  Pharmacies de garde
                </h1>
                <div className="relative mb-3">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher une pharmacie..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 font-sora text-[14px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pharmaloc-teal/40 focus:border-pharmaloc-teal transition-colors"
                  />
                </div>
                <button
                  onClick={handleLocate}
                  className="w-full flex items-center justify-center gap-2.5 bg-pharmaloc-teal hover:bg-pharmaloc-dark text-white font-montserrat font-semibold text-[15px] rounded-xl py-3 transition-colors"
                >
                  <Navigation size={17} />
                  Me localiser
                </button>
              </div>

              {/* Pharmacy list */}
              <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-3">
                {filtered.length === 0 ? (
                  <p className="font-sora text-[14px] text-gray-400 text-center pt-8">
                    Aucune pharmacie trouvée
                  </p>
                ) : (
                  filtered.map((pharmacy) => (
                    <PharmacyCard
                      key={pharmacy.id}
                      pharmacy={pharmacy}
                      selected={selectedId === pharmacy.id}
                      onClick={() => handleSelectPharmacy(pharmacy)}
                      cardRef={(el) => {
                        cardRefs.current[pharmacy.id] = el;
                      }}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </aside>

        {/* ── Map ─────────────────────────────────────────────────────────── */}
        <div
          className={`relative flex-1 isolate ${mobileView === "list" ? "hidden md:block" : "block"}`}
        >
          <MapContainer
            center={DAKAR_CENTER}
            zoom={13}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController flyTarget={flyTarget} />
            <MapFitBounds bounds={routeBounds} />

            {/* Pharmacy markers */}
            {pharmacies.map((pharmacy) => (
              <Marker
                key={pharmacy.id}
                position={[pharmacy.lat, pharmacy.lng]}
                icon={createPharmacyIcon(
                  selectedId === pharmacy.id || routeDestination?.id === pharmacy.id,
                )}
                eventHandlers={{ click: () => handleMarkerClick(pharmacy) }}
              />
            ))}

            {/* User location */}
            {userPosition && (
              <Marker position={userPosition} icon={userLocationIcon} zIndexOffset={1000} />
            )}

            {/* Route polyline */}
            {routeGeometry && (
              <Polyline
                positions={routeGeometry}
                pathOptions={{
                  color: "#01c2a7",
                  weight: 5,
                  opacity: 0.85,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            )}
          </MapContainer>

          {/* Detail overlay */}
          {selectedPharmacy && !isRouting && (
            <DetailOverlay
              pharmacy={selectedPharmacy}
              onClose={() => setSelectedId(null)}
              onItineraire={handleItineraire}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
