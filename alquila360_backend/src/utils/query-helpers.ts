export class QueryHelpers {
  static normalizePage(page?: number, limit?: number): { page: number; limit: number } {
    let p = page ?? 1;
    if (p < 1) p = 1;

    let l = limit ?? 10;
    if (l < 1) l = 1;
    if (l > 100) l = 100;

    return { page: p, limit: l };
  }

  static orderByProp<T extends object>(src: T[], sort?: string, order?: string): T[] {
    if (!sort || !sort.trim()) return src;

    const prop = sort as keyof T;
    if (src.length === 0 || !(prop in src[0])) return src;

    const sorted = [...src].sort((a, b) => {
      const valA = a[prop];
      const valB = b[prop];

      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      // Comparación segura para strings y números
      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB);
      }

      return valA > valB ? 1 : -1;
    });

    // Permitir orden descendente opcional
    if (order?.toLowerCase() === 'desc') {
      return sorted.reverse();
    }

    return sorted;
  }
}   