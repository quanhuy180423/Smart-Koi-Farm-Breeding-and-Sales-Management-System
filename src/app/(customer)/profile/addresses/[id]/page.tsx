"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, MapPin, ArrowLeft, Search, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import CustomerLayout from "@/components/customer/CustomerLayout";
import {
  useGetCustomerAddresses,
  useUpdateAddress,
} from "@/hooks/useCustomerAddress";
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
import MapPicker from "@/components/dialogs/MapPicker";

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

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams();
  const addressId = parseInt(params.id as string, 10);

  const { data: addresses, isLoading: isLoadingAddresses } =
    useGetCustomerAddresses();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();

  const [formData, setFormData] = useState({
    fullAddress: "",
    city: "",
    ward: "",
    streetAddress: "",
    latitude: 21.0285,
    longitude: 105.8542,
    recipientPhone: "",
    isDefault: false,
  });

  const [originalAddress, setOriginalAddress] = useState<{
    isActive: boolean;
  }>({ isActive: true });

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const mapRef = useRef(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 1500);

  // Load address data
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const address = addresses.find((a) => a.id === addressId);
      if (address) {
        setFormData({
          fullAddress: address.fullAddress,
          city: address.city,
          ward: address.ward,
          streetAddress: address.streetAddress,
          latitude: address.latitude || 21.0285,
          longitude: address.longitude || 105.8542,
          recipientPhone: address.recipientPhone,
          isDefault: address.isDefault,
        });
        setOriginalAddress({
          isActive: address.isActive,
        });
      }
    }
  }, [addresses, addressId]);

  // Geocode when user searches in search box
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) return;

    const performGeocoding = async () => {
      setIsSearching(true);
      try {
        const result = await geocodeAddress(debouncedSearchQuery);
        if (result) {
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));
          toast.success(`Tìm thấy: ${result.display_name}`);
          setSearchQuery("");
        } else {
          toast.error("Không tìm thấy địa chỉ này");
        }
      } catch {
      } finally {
        setIsSearching(false);
      }
    };

    performGeocoding();
  }, [debouncedSearchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      // Auto-generate fullAddress from other fields
      if (name !== "fullAddress") {
        updated.fullAddress = [
          updated.streetAddress,
          updated.ward,
          updated.city,
        ]
          .filter((v) => v && v.trim())
          .join(", ");
      }
      return updated;
    });
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
  };

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
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.city ||
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

    updateAddress(
      {
        addressId,
        data: {
          ...formData,
          isActive: originalAddress.isActive,
        },
      },
      {
        onSuccess: () => {
          toast.success("Địa chỉ đã được cập nhật thành công");
          router.push("/profile/addresses");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể cập nhật địa chỉ",
          );
        },
      },
    );
  };

  if (isLoadingAddresses) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </CustomerLayout>
    );
  }

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
            <h1 className="text-3xl font-bold">Chỉnh sửa địa chỉ</h1>
            <p className="text-muted-foreground">
              Cập nhật thông tin và vị trí địa chỉ
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
                  {/* Full Address - Read Only */}
                  <div className="space-y-1">
                    <Label htmlFor="fullAddress" className="text-sm">
                      Địa chỉ đầy đủ
                    </Label>
                    <Input
                      id="fullAddress"
                      value={formData.fullAddress}
                      disabled
                      className="h-9 bg-muted/30 text-black font-semibold cursor-not-allowed"
                      placeholder="Tự động điền..."
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
                      disabled={isUpdating}
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
                      disabled={isUpdating}
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
                      disabled={isUpdating}
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
                      disabled={isUpdating}
                      maxLength={10}
                      className="h-9"
                    />
                  </div>

                  {/* Default Address Checkbox */}
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox
                      id="isDefault"
                      checked={formData.isDefault}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(checked as boolean)
                      }
                      disabled={isUpdating}
                    />
                    <Label
                      htmlFor="isDefault"
                      className="text-xs font-normal cursor-pointer"
                    >
                      Đặt làm địa chỉ mặc định
                    </Label>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang cập nhật...
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4 mr-2" />
                          Cập nhật
                        </>
                      )}
                    </Button>
                  </div>
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
                  {/* Search Box and Buttons */}
                  <div className="flex gap-2 mb-3">
                    <form onSubmit={handleSearchSubmit} className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          placeholder="Tìm kiếm địa chỉ trên bản đồ..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          disabled={isUpdating || isGettingLocation}
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
                      disabled={isUpdating || isGettingLocation}
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

                  {/* Map Container */}
                  <div className="w-full flex-1 rounded-lg overflow-hidden border border-border relative">
                    <MapContainer
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

      {/* Map Picker Fullscreen */}
      <MapPicker
        isOpen={isMapPickerOpen}
        onOpenChange={setIsMapPickerOpen}
        latitude={formData.latitude}
        longitude={formData.longitude}
        onLocationChange={(lat, lng) =>
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }))
        }
      />
    </CustomerLayout>
  );
}
