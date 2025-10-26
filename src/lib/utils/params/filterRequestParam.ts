import { RequestParams } from "@/lib/api/apiClient";

export const toRequestParams = <T extends object>(obj?: T): RequestParams => {
  if (!obj) return {};

  const params: RequestParams = {};

  for (const [key, value] of Object.entries(obj)) {
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    ) {
      continue;
    }

    // Nếu là array nhưng không phải string[] -> convert thành string[]
    if (Array.isArray(value)) {
      params[key] = value.map(String);
    } else {
      params[key] = value as string | number | boolean | string[];
    }
  }

  return params;
};

export default toRequestParams;
