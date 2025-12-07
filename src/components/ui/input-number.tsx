import * as React from "react";
import { Input } from "./input";

export interface InputNumberProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> {
  value?: number | string;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  allowDecimal?: boolean;
  decimalPlaces?: number;
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      allowDecimal = false,
      decimalPlaces,
      onInput,
      ...props
    },
    ref,
  ) => {
    const [displayValue, setDisplayValue] = React.useState<string>(
      String(value ?? ""),
    );

    React.useEffect(() => {
      setDisplayValue(String(value ?? ""));
    }, [value]);

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      let newValue = input.value;

      if (allowDecimal) {
        // Allow digits, minus sign, and decimal point
        newValue = newValue.replace(/[^\d.\-]/g, "");

        // Ensure only one minus sign at the beginning
        if (newValue.includes("-")) {
          const parts = newValue.split("-");
          newValue = "-" + parts.slice(1).join("");
        }

        // Ensure only one decimal point
        if (newValue.includes(".")) {
          const dotIndex = newValue.indexOf(".");
          const lastDotIndex = newValue.lastIndexOf(".");
          if (dotIndex !== lastDotIndex) {
            // Multiple dots found, keep only the first one
            newValue =
              newValue.substring(0, lastDotIndex) +
              newValue.substring(lastDotIndex + 1);
          }
        }

        setDisplayValue(newValue);

        // Convert to number and apply min/max constraints
        if (newValue === "" || newValue === "-" || newValue === ".") {
          onChange?.(NaN);
        } else if (newValue.endsWith(".")) {
          // Don't call onChange for incomplete decimals like "5."
          // User will continue typing digits
        } else {
          let numValue = parseFloat(newValue);

          if (typeof min === "number" && numValue < min) {
            numValue = min;
            setDisplayValue(
              typeof decimalPlaces === "number"
                ? min.toFixed(decimalPlaces)
                : min.toString(),
            );
            onChange?.(numValue);
          } else if (typeof max === "number" && numValue > max) {
            numValue = max;
            setDisplayValue(
              typeof decimalPlaces === "number"
                ? max.toFixed(decimalPlaces)
                : max.toString(),
            );
            onChange?.(numValue);
          } else {
            onChange?.(numValue);
          }
        }
      } else {
        // Remove any non-digit characters except the first minus sign
        newValue = newValue.replace(/[^\d-]/g, "");

        // Ensure only one minus sign at the beginning
        if (newValue.includes("-")) {
          const parts = newValue.split("-");
          newValue = "-" + parts.filter((p, i) => i === 0 || p).join("");
        }

        setDisplayValue(newValue);

        // Convert to number and apply min/max constraints
        if (newValue === "" || newValue === "-") {
          onChange?.(NaN);
        } else {
          let numValue = parseInt(newValue, 10);

          if (typeof min === "number" && numValue < min) {
            numValue = min;
            setDisplayValue(min.toString());
            onChange?.(numValue);
          } else if (typeof max === "number" && numValue > max) {
            numValue = max;
            setDisplayValue(max.toString());
            onChange?.(numValue);
          } else {
            onChange?.(numValue);
          }
        }
      }

      onInput?.(e);
    };

    return (
      <Input
        type="text"
        ref={ref}
        value={displayValue}
        onInput={handleInput}
        inputMode={allowDecimal ? "decimal" : "numeric"}
        {...props}
      />
    );
  },
);
InputNumber.displayName = "InputNumber";

export { InputNumber };
