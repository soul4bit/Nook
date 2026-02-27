import Dexie, { type Table } from "dexie";

export type CachedNote = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

class NookCache extends Dexie {
  notes!: Table<CachedNote, string>;

  constructor() {
    super("nook-cache");
    this.version(1).stores({
      notes: "id, updatedAt",
    });
  }
}

export const nookCache = new NookCache();
