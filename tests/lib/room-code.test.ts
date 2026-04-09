import { describe, it, expect } from "vitest";
import { generateRoomCode } from "@/lib/room-code";

describe("generateRoomCode", () => {
  it("returns a 6-character string", () => {
    const code = generateRoomCode();
    expect(code).toHaveLength(6);
  });

  it("contains only uppercase alphanumeric characters", () => {
    const code = generateRoomCode();
    expect(code).toMatch(/^[A-Z0-9]{6}$/);
  });

  it("generates unique codes", () => {
    const codes = new Set(Array.from({ length: 100 }, () => generateRoomCode()));
    expect(codes.size).toBeGreaterThan(90);
  });
});
