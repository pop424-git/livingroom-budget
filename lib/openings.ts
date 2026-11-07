import type { StaticImageData } from "next/image";

/** Picks which line drawing stands in until a photo is added. */
export type OpeningKind = "window" | "louvre" | "sliding-door";

export type Color = { name: string; hex: string };

/** What hangs over the opening. Its own listing, so its own price. */
export type Curtain = {
  /** e.g. ม่านม้วน, มู่ลี่ไม้, ม่านจีบ, ม่านตาไก่ */
  type: string | null;
  /** Centimetres. */
  size: { width: number | null; height: number | null };
  color: Color | null;
  /** Baht per piece, as listed on Shopee. */
  price: number | null;
  quantity: number;
  shopeeUrl?: string;
};

export type Opening = {
  name: string;
  /** Short Latin tag shown in the mono face, like a mark on a plan. */
  tag: string;
  kind: OpeningKind;
  /** One line under the name: type of sash, glass, frame material. */
  note?: string;
  /** Centimetres. null shows as a dash until the number is known. */
  size: { width: number | null; length: number | null; height: number | null };
  color: Color | null;
  /** Baht per piece, as listed on Shopee. */
  price: number | null;
  quantity: number;
  shopeeUrl?: string;
  /** null when the opening goes without one. */
  curtain: Curtain | null;
  /** Product photo. Drop the file in public/openings/, import it here. */
  image?: StaticImageData;
};

function emptyCurtain(): Curtain {
  return {
    type: null,
    size: { width: null, height: null },
    color: null,
    price: null,
    quantity: 1,
  };
}

/** Price × quantity, or null while the price isn't known. */
export function lineTotal(item: { price: number | null; quantity: number }) {
  return item.price === null ? null : item.price * item.quantity;
}

/**
 * Doors and windows, with the Shopee listing each price came from.
 * Placeholder entries: sizes, colours and prices go in once they're chosen.
 */
export const openings: Opening[] = [
  {
    name: "หน้าต่างทิศเหนือ",
    tag: "North",
    kind: "window",
    size: { width: null, length: null, height: null },
    color: null,
    price: null,
    quantity: 1,
    curtain: emptyCurtain(),
  },
  {
    name: "หน้าต่างทิศใต้",
    tag: "South",
    kind: "window",
    size: { width: null, length: null, height: null },
    color: null,
    price: null,
    quantity: 1,
    curtain: emptyCurtain(),
  },
  {
    name: "หน้าต่างในห้องน้ำ",
    tag: "Bath",
    kind: "louvre",
    size: { width: null, length: null, height: null },
    color: null,
    price: null,
    quantity: 1,
    curtain: emptyCurtain(),
  },
  {
    name: "ประตูด้านหน้า",
    tag: "Front",
    kind: "sliding-door",
    size: { width: null, length: null, height: null },
    color: null,
    price: null,
    quantity: 1,
    curtain: emptyCurtain(),
  },
];
