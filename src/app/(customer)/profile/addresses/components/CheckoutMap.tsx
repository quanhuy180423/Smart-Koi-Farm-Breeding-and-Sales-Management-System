"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, MapPin, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import MapPicker from "@/components/dialogs/MapPicker";
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

interface CheckoutMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  disabled?: boolean;
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

export default function CheckoutMap({
  latitude,
  longitude,
  onLocationChange,
  disabled = false,
}: CheckoutMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
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

  // Auto-geocode only when user manually searches
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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Chọn vị trí trên bản đồ</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Search Box and Buttons */}
        <div className="flex gap-2 mb-3">
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Tìm kiếm địa chỉ trên bản đồ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={disabled || isGettingLocation}
                className="pl-10 h-10"
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
            onClick={handleGetCurrentLocation}
            disabled={disabled || isGettingLocation}
            className="px-3 h-10"
            title="Lấy vị trí hiện tại"
          >
            {isGettingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsMapPickerOpen(true)}
            className="px-3 h-10"
            title="Mở toàn màn hình"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Map Container - Hidden when MapPicker is open */}
        {!isMapPickerOpen && (
          <div className="w-full flex-1 rounded-lg overflow-hidden border border-border relative">
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
                  Vĩ độ: {latitude?.toFixed(6)}
                  <br />
                  Kinh độ: {longitude?.toFixed(6)}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-3">
          💡 Tìm kiếm địa chỉ hoặc nhấp trên bản đồ để đặt vị trí
        </p>
      </CardContent>

      {/* Map Picker Fullscreen */}
      <MapPicker
        isOpen={isMapPickerOpen}
        onOpenChange={setIsMapPickerOpen}
        latitude={latitude}
        longitude={longitude}
        onLocationChange={onLocationChange}
      />
    </Card>
  );
}
