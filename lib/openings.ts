import type { StaticImageData } from "next/image";
import bathWindow from "@/public/openings/bath-window.webp";
import kitchenWindow from "@/public/openings/kitchen-window.webp";

/** Picks which line drawing stands in until a photo is added. */
export type OpeningKind = "window" | "casement" | "awning" | "sliding-door";

export type Color = { name: string; hex: string };

/** Every frame in the house is the same wood finish. */
const wood: Color = { name: "สีไม้", hex: "#b47a45" };

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
  /** null: goes without one. "undecided": not settled whether to have one. */
  curtain: Curtain | null | "undecided";
  /** Product photo. Drop the file in public/openings/, import it here. */
  image?: StaticImageData;
};

function emptyCurtain(): Curtain {
  return {
    type: null,
    size: { width: null, height: null },
    color: null,
    price: null,
  };
}

/**
 * Doors and windows, one of each, with the store listing each price came from.
 * Placeholder entries: sizes, colours and prices go in once they're chosen.
 */
export const openings: Opening[] = [
  {
    name: "หน้าต่างทิศเหนือ",
    tag: "North",
    kind: "window",
    size: { width: null, height: null },
    color: wood,
    price: null,
    curtain: emptyCurtain(),
  },
  {
    name: "หน้าต่างครัว",
    tag: "Kitchen",
    kind: "casement",
    note: "อะลูมิเนียมบานเปิด รุ่น N-ACG0611 พร้อมมุ้ง · ร้าน\u00a0GlobalHouse",
    size: { width: 60, height: 110 },
    color: wood,
    price: 2819,
    url: "https://th.shp.ee/iiWbrdfK",
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
    name: "หน้าต่างในห้องน้ำ",
    tag: "Bath",
    kind: "awning",
    note: "อะลูมิเนียมบานกระทุ้ง รุ่น N-AAG0805 พร้อมมุ้ง · ร้าน\u00a0GlobalHouse",
    size: { width: 80, height: 50 },
    color: wood,
    price: 2003,
    url: "https://th.shp.ee/KPX7aSMq",
    image: bathWindow,
    curtain: "undecided",
  },
  {
    name: "ประตูด้านหน้า",
    tag: "Front",
    kind: "sliding-door",
    size: { width: null, height: null },
    color: wood,
    price: null,
    curtain: emptyCurtain(),
  },
];
