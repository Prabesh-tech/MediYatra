const apiBase = process.env.API_INTERNAL_URL ?? "http://localhost:4000/api/v1";

type ApiList<T> = { data: T[]; meta: { page: number; pageSize: number; total: number; pageCount: number } };
type ApiItem<T> = { data: T };

export async function fetchCatalogList<T>(
  resource: string,
  filters: string | Record<string, string | undefined> = "",
): Promise<ApiList<T> | null> {
  try {
    const url = new URL(resource.replace(/^\//, ""), `${apiBase.replace(/\/$/, "")}/`);
    if (typeof filters === "string") {
      if (filters) url.searchParams.set("q", filters);
    } else {
      for (const [key, value] of Object.entries(filters)) {
        if (value) url.searchParams.set(key, value);
      }
    }
    const response = await fetch(url, { next: { revalidate: 30 } });
    if (!response.ok) return null;
    return await response.json() as ApiList<T>;
  } catch {
    return null;
  }
}

export async function fetchAllCatalogItems<T>(
  resource: string,
  filters: Record<string, string | undefined> = {},
): Promise<T[] | null> {
  const firstPage = await fetchCatalogList<T>(resource, { ...filters, page: "1", pageSize: "50" });
  if (!firstPage) return null;
  if (firstPage.meta.pageCount <= 1) return firstPage.data;

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.meta.pageCount - 1 }, (_, index) =>
      fetchCatalogList<T>(resource, { ...filters, page: String(index + 2), pageSize: "50" }),
    ),
  );
  if (remainingPages.some((page) => page === null)) return null;

  return [...firstPage.data, ...remainingPages.flatMap((page) => page?.data ?? [])];
}

export async function fetchCatalogItem<T>(resource: string): Promise<T | null> {
  try {
    const url = new URL(resource.replace(/^\//, ""), `${apiBase.replace(/\/$/, "")}/`);
    const response = await fetch(url, { next: { revalidate: 30 } });
    if (!response.ok) return null;
    const result = await response.json() as ApiItem<T>;
    return result.data;
  } catch {
    return null;
  }
}
