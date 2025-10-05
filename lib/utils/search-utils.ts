export function searchInValue(value: any, query: string): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.toLowerCase().includes(query);
  }

  if (typeof value === "number") {
    return value.toString().includes(query);
  }

  if (typeof value === "boolean") {
    return value.toString().toLowerCase().includes(query);
  }

  if (Array.isArray(value)) {
    return value.some((item) => searchInValue(item, query));
  }

  if (typeof value === "object") {
    return Object.values(value).some((val) => searchInValue(val, query));
  }

  return false;
}

export function searchInObject<T>(item: T, searchFields: (keyof T)[], query: string): boolean {
  return searchFields.some((field) => {
    const fieldValue = item[field];
    return searchInValue(fieldValue, query);
  });
}
