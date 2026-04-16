import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";

import type { FileFingerprint } from "../types";

export const sha256 = (input: string | Uint8Array): string =>
  createHash("sha256").update(input).digest("hex");

export const describeFile = async (absolutePath: string): Promise<FileFingerprint> => {
  try {
    const [content, metadata] = await Promise.all([readFile(absolutePath), stat(absolutePath)]);
    return {
      exists: true,
      sha256: sha256(content),
      size: metadata.size
    };
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return {
        exists: false,
        sha256: null,
        size: null
      };
    }

    throw error;
  }
};
