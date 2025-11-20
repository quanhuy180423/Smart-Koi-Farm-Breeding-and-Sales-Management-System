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

interface DatePickerFilterProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

const getDateFromString = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  const parts = dateString.split("T")[0].split("-");
  return new Date(
    parseInt(parts[0]),
    parseInt(parts[1]) - 1,
    parseInt(parts[2]),
  );
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
}: DatePickerFilterProps) {
  return (
    <div className="space-y-2">
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
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
