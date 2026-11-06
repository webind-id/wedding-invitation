/** Path ke nilai bersarang, mis. ["events", 0, "name"]. */
export type Path = readonly (string | number)[];

export function getIn(obj: unknown, path: Path): unknown {
  return path.reduce<unknown>((cur, key) => (cur == null ? undefined : (cur as Record<string | number, unknown>)[key]), obj);
}

/** Salinan baru `obj` dengan nilai di `path` diganti — objek asli tidak diubah. */
export function setIn<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [key, ...rest] = path;
  const current = (obj as Record<string | number, unknown>)?.[key];
  const next = setIn(current, rest, value);
  if (Array.isArray(obj)) {
    const copy = [...obj];
    copy[key as number] = next;
    return copy as T;
  }
  return { ...(obj as object), [key]: next } as T;
}

export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return [...list];
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function removeItem<T>(list: readonly T[], index: number): T[] {
  return list.filter((_, i) => i !== index);
}

export function pathKey(path: Path): string {
  return path.join(".");
}
