import { describe, expect, it } from "vitest"
import {
  extractList,
  formatMoney,
  isActiveStatus,
  normalizeStatus,
  STATUS_LABEL,
  todayISO,
} from "@/lib/courier-api"

describe("normalizeStatus", () => {
  it("maps backend status spellings to internal ones", () => {
    expect(normalizeStatus("delivered")).toBe("delivered")
    expect(normalizeStatus("completed")).toBe("delivered")
    expect(normalizeStatus("cancelled")).toBe("cancelled")
    expect(normalizeStatus("canceled")).toBe("cancelled")
    expect(normalizeStatus("rejected")).toBe("cancelled")
    expect(normalizeStatus("on the way")).toBe("on_the_way")
    expect(normalizeStatus("on-the-way")).toBe("on_the_way")
    expect(normalizeStatus("pending")).toBe("new")
    expect(normalizeStatus("preparing")).toBe("new")
  })

  it("is case and whitespace tolerant", () => {
    expect(normalizeStatus("  DELIVERED  ")).toBe("delivered")
  })

  it("defaults unknown or empty values to new", () => {
    expect(normalizeStatus(undefined)).toBe("new")
    expect(normalizeStatus(null)).toBe("new")
    expect(normalizeStatus("archived")).toBe("new")
  })
})

describe("isActiveStatus", () => {
  it("is true only for new and on_the_way", () => {
    expect(isActiveStatus("new")).toBe(true)
    expect(isActiveStatus("on_the_way")).toBe(true)
    expect(isActiveStatus("delivered")).toBe(false)
    expect(isActiveStatus("cancelled")).toBe(false)
  })
})

describe("STATUS_LABEL", () => {
  it("has a label for every status", () => {
    expect(STATUS_LABEL).toEqual({
      new: "Yangi buyurtma",
      on_the_way: "Yo'lda",
      delivered: "Yetkazildi",
      cancelled: "Bekor qilindi",
    })
  })
})

describe("extractList", () => {
  it("accepts a bare array", () => {
    expect(extractList([{ id: 1 }])).toEqual([{ id: 1 }])
  })

  it("finds lists nested under common keys", () => {
    expect(extractList({ data: [{ id: 1 }] })).toHaveLength(1)
    expect(extractList({ data: { data: [{ id: 1 }] } })).toHaveLength(1)
    expect(extractList({ data: { orders: [{ id: 1 }] } })).toHaveLength(1)
    expect(extractList({ data: { items: [{ id: 1 }] } })).toHaveLength(1)
    expect(extractList({ data: { results: [{ id: 1 }] } })).toHaveLength(1)
    expect(extractList({ orders: [{ id: 1 }] })).toHaveLength(1)
    expect(extractList({ items: [{ id: 1 }] })).toHaveLength(1)
    expect(extractList({ results: [{ id: 1 }] })).toHaveLength(1)
  })

  it("throws a descriptive error for unrecognised payloads", () => {
    expect(() => extractList({ foo: "bar" })).toThrow(/tushunarsiz/)
    expect(() => extractList({ foo: "bar" })).toThrow(/foo/)
  })
})

describe("formatMoney", () => {
  it("groups thousands and appends the currency", () => {
    const out = formatMoney(1_234_567).replace(/\u00a0|\u202f/g, " ")
    expect(out).toBe("1 234 567 so'm")
  })
})

describe("todayISO", () => {
  it("returns a zero-padded YYYY-MM-DD date", () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(todayISO()).toBe(new Date().toISOString().slice(0, 10))
  })
})
