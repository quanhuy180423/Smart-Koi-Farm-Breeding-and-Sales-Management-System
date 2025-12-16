"use client";

import * as React from "react";
import { Clock, ChevronDown } from "lucide-react"; // Icon tùy chọn

interface TimePickerProps {
  value?: string; // Format: "HH:mm"
  onChange?: (time: string) => void;
  minuteStep?: number; // Bước nhảy phút (5, 15, 30...)
  className?: string;
  placeholder?: string;
}

export function TimePicker({
  value,
  onChange,
  minuteStep = 5,
  className = "",
}: TimePickerProps) {
  // --- STATE QUẢN LÝ DROPDOWN ---
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // --- LOGIC XỬ LÝ GIỜ/PHÚT (Giữ nguyên logic cũ vì nó đã chuẩn) ---
  const [selectedHour, setSelectedHour] = React.useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = React.useState<number | null>(
    null
  );

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        setSelectedHour(h);
        setSelectedMinute(m);
      }
    }
  }, [value]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from(
    { length: 60 / minuteStep },
    (_, i) => i * minuteStep
  );

  const handleSelect = (type: "hour" | "minute", val: number) => {
    let newHour = selectedHour ?? 0;
    let newMinute = selectedMinute ?? 0;

    if (type === "hour") {
      newHour = val;
      setSelectedHour(val);
    } else {
      newMinute = val;
      setSelectedMinute(val);
    }

    if (type === "hour" && selectedMinute === null) setSelectedMinute(0);
    if (type === "minute" && selectedHour === null) setSelectedHour(0);

    const formattedTime = `${newHour.toString().padStart(2, "0")}:${(type ===
      "minute" && selectedHour === null
      ? 0
      : newMinute
    )
      .toString()
      .padStart(2, "0")}`;

    onChange?.(formattedTime);
  };

  // Đóng dropdown khi click ra ngoài
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* --- TRIGGER BUTTON --- */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2
          ${!value ? "text-slate-500" : "text-slate-900 font-medium"}
        `}
      >
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4 opacity-50" />
          {value || "Chọn giờ"}
        </span>
        <ChevronDown
          className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* --- DROPDOWN CONTENT --- */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-60 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="flex h-[300px] divide-x divide-slate-100">
            {/* CỘT GIỜ */}
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-center border-b border-slate-100 bg-slate-50 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Giờ
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
                <div className="p-1 space-y-1">
                  {hours.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => handleSelect("hour", hour)}
                      className={`
                        w-full rounded-md px-2 py-1.5 text-sm text-center transition-colors
                        ${
                          selectedHour === hour
                            ? "bg-slate-900 text-white font-medium" // Style khi được chọn
                            : "text-slate-700 hover:bg-slate-100" // Style mặc định
                        }
                      `}
                    >
                      {hour.toString().padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CỘT PHÚT */}
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-center border-b border-slate-100 bg-slate-50 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Phút
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
                <div className="p-1 space-y-1">
                  {minutes.map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => handleSelect("minute", minute)}
                      className={`
                        w-full rounded-md px-2 py-1.5 text-sm text-center transition-colors
                        ${
                          selectedMinute === minute
                            ? "bg-slate-900 text-white font-medium"
                            : "text-slate-700 hover:bg-slate-100"
                        }
                      `}
                    >
                      {minute.toString().padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
