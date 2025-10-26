import { useState, useEffect } from "react";

/**
 * Hook tùy chỉnh để debounce một giá trị.
 *
 * Hook này trả về một giá trị chỉ được cập nhật sau khi giá trị đầu vào
 * (ví dụ: chuỗi tìm kiếm) không thay đổi trong một khoảng thời gian nhất định.
 * Điều này giúp tránh việc gọi API hoặc các thao tác nặng liên tục.
 *
 * @param value Giá trị cần debounce (ví dụ: searchTerm).
 * @param delay Độ trễ tính bằng mili giây (mặc định là 500ms).
 * @returns Giá trị đã được debounce.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
