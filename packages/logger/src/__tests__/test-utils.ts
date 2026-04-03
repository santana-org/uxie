import type { Writer } from "../types.js"

export function makeWriter(): { out: string[]; err: string[]; writer: Writer } {
  const out: string[] = []
  const err: string[] = []
  return {
    out,
    err,
    writer: {
      out: (msg) => out.push(msg),
      err: (msg) => err.push(msg),
    },
  }
}
