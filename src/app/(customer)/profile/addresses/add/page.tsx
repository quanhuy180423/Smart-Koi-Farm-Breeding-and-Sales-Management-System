"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, MapPin, ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { useCreateAddress } from "@/hooks/useCustomerAddress";
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

export default function AddAddressPage() {
  const router = useRouter();
  const { mutate: createAddress, isPending } = useCreateAddress();

  const [formData, setFormData] = useState({
    fullAddress: "",
    city: "",
    district: "",
    ward: "",
    streetAddress: "",
    latitude: 21.0285,
    longitude: 105.8542,
    recipientPhone: "",
    isDefault: false,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  // Auto-geocode when user finishes typing in search or address fields
  useEffect(() => {
    if (!debouncedSearchQuery.trim() && !formData.fullAddress.trim()) return;

    const query = debouncedSearchQuery || formData.fullAddress;
    if (!query.trim()) return;

    const performGeocoding = async () => {
      setIsSearching(true);
      try {
        const result = await geocodeAddress(query);
        if (result) {
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));
          setMapKey((prev) => prev + 1);
          if (debouncedSearchQuery) {
            toast.success(`Tìm thấy: ${result.display_name}`);
            setSearchQuery("");
          }
        } else {
          if (debouncedSearchQuery) {
            toast.error("Không tìm thấy địa chỉ này");
          }
        }
      } catch {
      } finally {
        setIsSearching(false);
      }
    };

    performGeocoding();
  }, [debouncedSearchQuery, formData.fullAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isDefault: checked,
    }));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger geocoding by setting debouncedSearchQuery
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.fullAddress ||
      !formData.city ||
      !formData.district ||
      !formData.ward ||
      !formData.streetAddress ||
      !formData.recipientPhone
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Validate phone
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.recipientPhone)) {
      toast.error(
        "Số điện thoại không hợp lệ (cần có 10 chữ số, bắt đầu từ 0)",
      );
      return;
    }

    createAddress(formData, {
      onSuccess: () => {
        toast.success("Địa chỉ đã được tạo thành công");
        router.push("/profile/addresses");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Không thể tạo địa chỉ",
        );
      },
    });
  };

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Thêm địa chỉ mới</h1>
            <p className="text-muted-foreground">
              Điền thông tin và chọn vị trí trên bản đồ
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Fields */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Thông tin địa chỉ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  {/* Full Address */}
                  <div className="space-y-1">
                    <Label htmlFor="fullAddress" className="text-sm">
                      Địa chỉ đầy đủ
                    </Label>
                    <Input
                      id="fullAddress"
                      name="fullAddress"
                      placeholder="VD: 123 Đường ABC, Hà Nội"
                      value={formData.fullAddress}
                      onChange={handleInputChange}
                      disabled={isPending}
                      className="h-9"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <Label htmlFor="city" className="text-sm">
                      Thành phố
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="VD: Hà Nội"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={isPending}
                      className="h-9"
                    />
                  </div>

                  {/* District */}
                  <div className="space-y-1">
                    <Label htmlFor="district" className="text-sm">
                      Quận/Huyện
                    </Label>
                    <Input
                      id="district"
                      name="district"
                      placeholder="VD: Hoàn Kiếm"
                      value={formData.district}
                      onChange={handleInputChange}
                      disabled={isPending}
                      className="h-9"
                    />
                  </div>

                  {/* Ward */}
                  <div className="space-y-1">
                    <Label htmlFor="ward" className="text-sm">
                      Phường/Xã
                    </Label>
                    <Input
                      id="ward"
                      name="ward"
                      placeholder="VD: Hàng Trống"
                      value={formData.ward}
                      onChange={handleInputChange}
                      disabled={isPending}
                      className="h-9"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="space-y-1">
                    <Label htmlFor="streetAddress" className="text-sm">
                      Số nhà/Đường phố
                    </Label>
                    <Input
                      id="streetAddress"
                      name="streetAddress"
                      placeholder="VD: 123 Đường ABC"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      disabled={isPending}
                      className="h-9"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <Label htmlFor="recipientPhone" className="text-sm">
                      Số điện thoại
                    </Label>
                    <Input
                      id="recipientPhone"
                      name="recipientPhone"
                      placeholder="VD: 0987654321"
                      value={formData.recipientPhone}
                      onChange={handleInputChange}
                      disabled={isPending}
                      maxLength={10}
                      className="h-9"
                    />
                  </div>

                  {/* Default Address Checkbox */}
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox
                      id="isDefault"
                      checked={formData.isDefault}
                      onCheckedChange={handleCheckboxChange}
                      disabled={isPending}
                    />
                    <Label
                      htmlFor="isDefault"
                      className="text-xs font-normal cursor-pointer"
                    >
                      Đặt làm địa chỉ mặc định
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-2" />
                        Tạo địa chỉ
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    Chọn vị trí trên bản đồ
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-4">
                  {/* Search Box */}
                  <form onSubmit={handleSearchSubmit} className="mb-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder="Tìm kiếm địa chỉ trên bản đồ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isSearching || isPending}
                        className="pl-10 h-10"
                      />
                      {isSearching && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                      )}
                    </div>
                  </form>

                  {/* Map Container */}
                  <div className="w-full flex-1 rounded-lg overflow-hidden border border-border">
                    <MapContainer
                      key={mapKey}
                      ref={mapRef}
                      center={[formData.latitude, formData.longitude]}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapMover
                        lat={formData.latitude}
                        lng={formData.longitude}
                      />
                      <MapClickHandler onMapClick={handleMapClick} />
                      <Marker
                        position={[formData.latitude, formData.longitude]}
                      >
                        <Popup>
                          Vĩ độ: {formData.latitude.toFixed(6)}
                          <br />
                          Kinh độ: {formData.longitude.toFixed(6)}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3">
                    💡 Tìm kiếm địa chỉ hoặc nhấp trên bản đồ để đặt vị trí
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
}
