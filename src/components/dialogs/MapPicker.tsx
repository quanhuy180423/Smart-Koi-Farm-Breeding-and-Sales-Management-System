"use client";

import { useState, useRef, useEffect } from "react";
import { X, Search, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Fix leaflet icon issue
type IconPrototype = { _getIconUrl?: unknown };
delete (L.Icon.Default.prototype as unknown as IconPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapClickEvent {
  latlng: {
    lat: number;
    lng: number;
  };
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface MapPickerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

// Geocoding using Nominatim API
async function geocodeAddress(
  address: string,
): Promise<NominatimResult | null> {
  if (!address.trim()) return null;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) return null;

    const results: NominatimResult[] = await response.json();
    return results.length > 0 ? results[0] : null;
  } catch {
    return null;
  }
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e: MapClickEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapMover({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);

  return null;
}

export default function MapPicker({
  isOpen,
  onOpenChange,
  latitude,
  longitude,
  onLocationChange,
}: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const mapRef = useRef(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 1500);

  // Get current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt của bạn không hỗ trợ vị trí hiện tại");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationChange(latitude, longitude);
        toast.success("Đã lấy vị trí hiện tại");
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Vui lòng cấp quyền truy cập vị trí");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          toast.error("Không thể lấy vị trí hiện tại");
        } else if (error.code === error.TIMEOUT) {
          toast.error("Timeout khi lấy vị trí");
        } else {
          toast.error("Lỗi khi lấy vị trí hiện tại");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // Auto-geocode when user finishes typing in search field
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) return;

    const performGeocoding = async () => {
      setIsSearching(true);
      try {
        const result = await geocodeAddress(debouncedSearchQuery);
        if (result) {
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          onLocationChange(lat, lng);
          toast.success(`Tìm thấy: ${result.display_name}`);
          setSearchQuery("");
        } else {
          toast.error("Không tìm thấy địa chỉ này");
        }
      } catch {
        toast.error("Lỗi khi tìm kiếm địa chỉ");
      } finally {
        setIsSearching(false);
      }
    };

    performGeocoding();
  }, [debouncedSearchQuery, onLocationChange]);

  const handleMapClick = (lat: number, lng: number) => {
    onLocationChange(lat, lng);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 pointer-events-none"
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      {/* Close Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(false);
        }}
        className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white text-black hover:bg-slate-50 pointer-events-auto z-60 transition-colors"
        title="Đóng"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Search Box and Current Location Button */}
      <div className="absolute top-6 left-6 right-20 flex gap-2 pointer-events-auto z-60">
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Tìm kiếm địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isGettingLocation}
              className="pl-10 h-10 bg-white"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
            )}
          </div>
        </form>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleGetCurrentLocation();
          }}
          disabled={isGettingLocation}
          className="px-3 h-10 bg-white"
          title="Lấy vị trí hiện tại"
        >
          {isGettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Map Container - Fullscreen */}
      <div className="fixed inset-0 pointer-events-auto">
        <MapContainer
          ref={mapRef}
          center={[latitude, longitude]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapMover lat={latitude} lng={longitude} />
          <MapClickHandler onMapClick={handleMapClick} />
          <Marker position={[latitude, longitude]}>
            <Popup>
              Vĩ độ: {latitude.toFixed(6)}
              <br />
              Kinh độ: {longitude.toFixed(6)}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Help Text */}
      <div className="absolute bottom-6 left-6 text-white text-xs pointer-events-auto z-60">
        💡 Nhấp trên bản đồ để chọn vị trí hoặc dùng thanh tìm kiếm
      </div>
    </div>
  );
}
