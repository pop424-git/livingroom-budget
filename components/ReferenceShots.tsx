"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import engawaVeranda from "@/public/reference/engawa-veranda.jpg";
import exteriorFront from "@/public/reference/exterior-front.jpg";
import interiorEngawa from "@/public/reference/interior-engawa.jpg";
import interiorLiving from "@/public/reference/interior-living.jpg";
import planDimensions from "@/public/reference/plan-dimensions.png";

type Shot = {
  image: StaticImageData;
  alt: string;
  caption: string;
  /** Plans lose their edges under object-cover. */
  contain?: boolean;
};

/**
 * Reference shots the design is based on.
 *
 * Images are imported rather than referenced by path so Next can size and
 * optimise them, and so a missing file breaks the build instead of shipping a
 * broken image. To add one: drop the file in public/reference/, import it
 * above, and add an entry to the right list.
 */
const overview: Shot[] = [
  {
    image: planDimensions,
    alt: "ผังพื้นพร้อมระยะ ห้องนั่งเล่น 32 ตร.ม. ห้องน้ำ 3 ตร.ม. กว้าง 400 ซม. ยาว 800 ซม. ระเบียงกว้าง 150 ซม. สองฝั่ง",
    caption: "ผังพื้นพร้อมระยะ — ห้อง 4×8 ม. ห้องน้ำ 3 ตร.ม. ระเบียง 1.5 ม.",
    contain: true,
  },
  {
    image: exteriorFront,
    alt: "บ้านผนังขาว หลังคาจั่วชายคายื่นคลุม ประตูบานเลื่อนกระจกเปิดเต็มหน้า เห็นภายในห้องนั่งเล่น มีระเบียงไม้และบันไดไม้ด้านหน้า",
    caption: "แนวทางรวม — หลังคาจั่วชายคายื่น ประตูเปิดเต็มหน้า ระเบียงไม้ยกพื้น",
  },
];

/** Interior renders: the same room seen from each end. */
const interior: Shot[] = [
  {
    image: interiorLiving,
    alt: "ภาพเรนเดอร์ภายใน เห็นโซฟา ทีวีบนตู้ลอย มู่ลี่ไม้ โต๊ะกินข้าวใต้โคมห้อย ประตูกระจกบานเลื่อน และห้องน้ำด้านขวา",
    caption: "ภายใน — โซฟา ผนังทีวี โต๊ะกินข้าว ห้องน้ำ",
  },
  {
    image: interiorEngawa,
    alt: "ภาพเรนเดอร์มองจากระเบียงเข้าไปในห้อง เห็นครัว ตู้เย็น โต๊ะกินข้าว โซฟา และพื้นไม้ยกระดับจากพื้นปูน",
    caption: "มองจากระเบียง — ครัว โต๊ะกินข้าว พื้นยกระดับ",
  },
];

/** Engawa reference, shown last and full width: it is the one shot about the
    veranda itself rather than the room. */
const engawa: Shot[] = [
  {
    image: engawaVeranda,
    alt: "ภาพเรนเดอร์ระเบียงเอ็นกาวะไม้ยกพื้น เสาไม้รับชายคายื่นคลุมยาว ประตูบานเลื่อนกระจกกรอบไม้ ม้านั่งไม้ยาว และสวนหินด้านหน้า",
    caption: "ระเบียงเอ็นกาวะ — พื้นไม้ยกพื้น เสารับชายคายื่น ม้านั่งไม้ยาว",
  },
];

/** One flat list so the lightbox can page through every shot in order. */
const allShots = [...overview, ...interior, ...engawa];

export function ReferenceShots() {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback((index: number) => {
    setOpenAt(index);
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const step = useCallback((delta: number) => {
    setOpenAt((current) =>
      current === null
        ? current
        : (current + delta + allShots.length) % allShots.length
    );
  }, []);

  // Arrow keys page through; Escape is handled by <dialog> itself.
  useEffect(() => {
    if (openAt === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openAt, step]);

  const current = openAt === null ? null : allShots[openAt];

  return (
    <>
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          {overview.map((shot, index) => (
            <Thumb
              key={shot.image.src}
              shot={shot}
              onOpen={() => open(index)}
              // 4:3 is the photo's own ratio, and it leaves the near-square
              // plan more room than a 3:2 box would.
              aspect="aspect-4/3"
              priority
            />
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {interior.map((shot, index) => (
            <Thumb
              key={shot.image.src}
              shot={shot}
              onOpen={() => open(overview.length + index)}
              // The renders are panoramic; a 3:2 crop would cut off both ends.
              aspect="aspect-2/1"
            />
          ))}
        </div>

        <div className="grid gap-3">
          {engawa.map((shot, index) => (
            <Thumb
              key={shot.image.src}
              shot={shot}
              onOpen={() => open(overview.length + interior.length + index)}
              aspect="aspect-2/1"
            />
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpenAt(null)}
        onClick={(event) => {
          // Clicks land on the dialog itself only when they hit the backdrop.
          if (event.target === dialogRef.current) close();
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
      >
        {current && (
          <div
            onClick={close}
            className="flex h-dvh w-dvw flex-col items-center justify-center gap-3 p-4 sm:p-8"
          >
            {/* A sized frame that the image fits inside: no layout shift while
                it loads, and every aspect ratio lands centred. */}
            <div className="relative w-full flex-1">
              <Image
                src={current.image}
                alt={current.alt}
                fill
                sizes="100vw"
                loading="eager"
                // Only the picture itself swallows the click; the empty space
                // around it still closes, which is what a tap there means.
                onClick={(event) => event.stopPropagation()}
                className="object-contain"
              />
            </div>

            <div
              className="flex w-full max-w-2xl shrink-0 items-center justify-between gap-3 rounded-lg bg-surface/95 px-3 py-2"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="รูปก่อนหน้า"
                className="rounded-md px-3 py-1.5 text-lg text-muted transition hover:bg-line-soft hover:text-ink"
              >
                ‹
              </button>

              <p className="tnum min-w-0 flex-1 text-center text-xs text-muted">
                {openAt! + 1}/{allShots.length}
              </p>

              <button
                type="button"
                onClick={() => step(1)}
                aria-label="รูปถัดไป"
                className="rounded-md px-3 py-1.5 text-lg text-muted transition hover:bg-line-soft hover:text-ink"
              >
                ›
              </button>

              <button
                type="button"
                onClick={close}
                aria-label="ปิด"
                className="rounded-md px-3 py-1.5 text-sm text-muted transition hover:bg-line-soft hover:text-ink"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function Thumb({
  shot,
  onOpen,
  aspect,
  priority = false,
}: {
  shot: Shot;
  onOpen: () => void;
  aspect: string;
  priority?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`ดูรูปใหญ่ — ${shot.caption}`}
      className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-surface"
    >
      <div className={aspect}>
        <Image
          src={shot.image}
          alt={shot.alt}
          className={`size-full transition duration-300 group-hover:scale-[1.03] ${
            shot.contain ? "object-contain" : "object-cover"
          }`}
          sizes="(min-width: 640px) 50vw, 100vw"
          priority={priority}
        />
      </div>
    </button>
  );
}
