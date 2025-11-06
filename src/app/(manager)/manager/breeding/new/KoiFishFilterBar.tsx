"use client";

import { Input } from "@/components/ui/input";

interface KoiFishFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function KoiFishFilterBar({
  search,
  onSearchChange,
}: KoiFishFilterBarProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-2">
          Tìm kiếm
        </label>
        <Input
          placeholder="Tìm kiếm cá..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 text-sm"
        />
      </div>
    </div>
  );
}
