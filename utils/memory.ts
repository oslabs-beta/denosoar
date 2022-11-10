export type MemoryElement = {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
};

export const getMemory = (): MemoryElement => {
  return Deno.memoryUsage();
};
