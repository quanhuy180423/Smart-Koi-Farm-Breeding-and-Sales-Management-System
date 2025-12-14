import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";
import { vi } from "date-fns/locale";

interface DatePickerFilterProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  maxDate?: Date;
}

const getDateFromString = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  // Parse ISO string and interpret the DATE portion as local time, not UTC
  // This ensures the calendar shows the date that was actually selected
  const parts = dateString.split("T")[0].split("-");
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const day = parseInt(parts[2]);

  // Create a date at midnight in local timezone
  // This ensures when the calendar reads getDate(), it gets the correct day
  const date = new Date(year, month, day, 0, 0, 0, 0);
  return date;
};

const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function DatePickerFilter({
  label,
  value,
  onChange,
  placeholder = "Chọn ngày...",
  maxDate,
}: DatePickerFilterProps) {
  return (
    <div className="space-y-2 w-full">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? formatDate(value, DATE_FORMATS.MEDIUM_DATE) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={getDateFromString(value)}
            onSelect={(date) => {
              if (date) {
                onChange(formatDateToString(date));
              }
            }}
            disabled={(date) => maxDate ? date > maxDate : false}
            captionLayout="dropdown"
            locale={vi}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
