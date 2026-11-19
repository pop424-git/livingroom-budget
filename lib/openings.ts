import type { StaticImageData } from "next/image";
import bathWindow from "@/public/openings/bath-window.webp";
import frontDoor from "@/public/openings/front-door.webp";
import kitchenWindow from "@/public/openings/kitchen-window.webp";
import northWindow from "@/public/openings/north-window.webp";

/** Picks which line drawing stands in until a photo is added. */
export type OpeningKind = "window" | "casement" | "awning" | "sliding-door";

export type Color = { name: string; hex: string };

/** Every frame in the house is the same wood finish. */
const wood: Color = { name: "ลายไม้สักทอง", hex: "#b8743f" };

/** What hangs over the opening. Its own listing, so its own price. */
export type Curtain = {
  /** e.g. ม่านม้วน, มู่ลี่ไม้, ม่านจีบ, ม่านตาไก่ */
  type: string | null;
  /** Centimetres. */
  size: { width: number | null; height: number | null };
  color: Color | null;
  /** Baht per piece, as listed by the store. */
  price: number | null;
  /** Where the price came from. Defaults to Shopee. */
  source?: string;
  /** Link to the listing. */
  url?: string;
  /** Said in place of the store when the price isn't a listing, e.g. made to order. */
  priceNote?: string;
};

export type Opening = {
  name: string;
  /** Short Latin tag shown in the mono face, like a mark on a plan. */
  tag: string;
  kind: OpeningKind;
  /** One line under the name: type of sash, glass, frame material. */
  note?: string;
  /** Centimetres. null shows as a dash until the number is known. */
  size: { width: number | null; height: number | null };
  color: Color | null;
  /** Baht per piece, as listed by the store. */
  price: number | null;
  /** Where the price came from. Defaults to Shopee. */
  source?: string;
  /** Link to the listing. */
  url?: string;
  /** Said in place of the store when the price isn't a listing, e.g. made to order. */
  priceNote?: string;
  /** null: goes without one. "undecided": not settled whether to have one. */
  curtain: Curtain | null | "undecided";
  /** Product photo. Drop the file in public/openings/, import it here. */
  image?: StaticImageData;
  /** Flags a photo that isn't the product itself, e.g. an edited mock-up. */
  imageNote?: string;
};

/**
 * Doors and windows, one of each, with the store listing each price came from.
 * Placeholder entries: sizes, colours and prices go in once they're chosen.
 */
export const openings: Opening[] = [
  {
    name: "ประตูด้านหน้า",
    tag: "Front",
    kind: "sliding-door",
    note: "บานเลื่อน 4 ช่อง กระจกใสเขียว ลายตารางเฉพาะบานตาย พร้อมมุ้ง 1 ชุด · ขนาดรวมวงกบนอก",
    size: { width: 280, height: 200 },
    color: wood,
    price: 13890,
    source: "ppwindows",
    image: frontDoor,
    curtain: {
      type: "2 ชั้น · ทึบแสง + โปร่ง",
      size: { width: null, height: null },
      color: null,
      price: null,
      priceNote: "ยังไม่ได้เลือกร้าน",
    },
  },
  {
    name: "หน้าต่างทิศเหนือ",
    tag: "North",
    kind: "window",
    note: "บานเลื่อน 3 ช่อง กระจกใสเขียว พร้อมมุ้ง 1 ชุด",
    size: { width: 180, height: 110 },
    color: wood,
    price: 3890,
    source: "ppwindows",
    image: northWindow,
    curtain: {
      type: "มู่ลี่",
      size: { width: 200, height: 140 },
      color: null,
      price: 2142,
      url: "https://th.shp.ee/1moNCyRm",
    },
  },
  {
    name: "หน้าต่างครัว",
    tag: "Kitchen",
    kind: "window",
    note: "บานเลื่อนสลับ 2 ช่อง กระจกใสเขียว พร้อมมุ้ง 1 ชุด",
    size: { width: 100, height: 100 },
    color: wood,
    price: 2190,
    source: "ppwindows",
    image: kitchenWindow,
    curtain: {
      type: "ม่านจีบรังผึ้ง ทึบแสง",
      size: { width: null, height: null },
      color: null,
      price: null,
      source: "ไทวัสดุ",
    },
  },
  {
    name: "หน้าต่างระบายอากาศห้องน้ำ",
    tag: "Bath",
    kind: "awning",
    note: "บานเกล็ดซ้อน กระจกฝ้า พร้อมมุ้ง 1 ชุด · ผนังเหนือ เหนือโถ",
    size: { width: 40, height: 35 },
    color: wood,
    price: 790,
    source: "ppwindows",
    image: bathWindow,
    curtain: "undecided",
  },
];
