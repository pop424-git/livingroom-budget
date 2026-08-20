"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import engawaHako from "@/public/reference/engawa-hako.jpg";
import interiorDining from "@/public/reference/interior-dining.jpg";
import interiorOverview from "@/public/reference/interior-overview.jpg";
import interiorSofa from "@/public/reference/interior-sofa.jpg";
import interiorTvWall from "@/public/reference/interior-tv-wall.jpg";
import roomRender from "@/public/reference/room-render.jpg";

type Shot = { image: StaticImageData; alt: string; caption: string };

/**
 * Reference photos the design is based on.
 *
 * Images are imported rather than referenced by path so Next can size and
 * optimise them, and so a missing file breaks the build instead of shipping a
 * broken image. To add one: drop the file in public/reference/, import it
 * above, and add an entry to the right list.
 */
const exterior: Shot[] = [
  {
    image: roomRender,
    alt: "ภาพเรนเดอร์อาคารทรงญี่ปุ่น หลังคาเมทัลชีทสีเข้ม ระเบียงไม้ยกพื้น เสารับชายคา ประตูบานเลื่อน",
    caption: "แนวทางรวม — หลังคาเมทัลชีทลาดเดียว ชายคายื่นคลุมระเบียง ผนังฉาบเรียบ",
  },
  {
    image: engawaHako,
    alt: "บ้านสำเร็จรูป HAKO ระเบียงไม้เอ็นกาวะยกพื้น ชายคายื่นคลุม เสาไม้รับชายคา",
    caption: "ระเบียงเอ็นกาวะ — ยกพื้น 45 ซม. นั่งห้อยขาได้ เสาไม้รับชายคาที่ขอบ",
  },
];

const interior: Shot[] = [
  {
    image: interiorOverview,
    alt: "ภาพภายในห้อง มุมกว้าง เห็นโซฟา โต๊ะกินข้าว และผนังไม้ระแนง",
    caption: "มุมรวม โซฟา–โต๊ะกินข้าว",
  },
  {
    image: interiorTvWall,
    alt: "ผนังทีวีพร้อมตู้ลอย หน้าต่างมู่ลี่ไม้ แอร์ติดผนัง และประตูกระจกออกระเบียง",
    caption: "ผนังทีวี ตู้ลอย มู่ลี่ไม้",
  },
  {
    image: interiorDining,
    alt: "มองจากโต๊ะกินข้าวไปทางโซฟาและผนังทีวี เห็นแอร์ติดผนังเหนือหน้าต่าง",
    caption: "มองจากโต๊ะกินข้าว",
  },
  {
    image: interiorSofa,
    alt: "โซนโซฟาและโต๊ะกินข้าว เห็นแอร์ติดผนังและหน้าต่างมู่ลี่ไม้",
    caption: "โซนโซฟา จุดติดแอร์",
  },
];

/** One flat list so the lightbox can page through every shot in order. */
const allShots = [...exterior, ...interior];

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
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {exterior.map((shot, index) => (
            <Thumb
              key={shot.image.src}
              shot={shot}
              onOpen={() => open(index)}
              priority
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {interior.map((shot, index) => (
            <Thumb
              key={shot.image.src}
              shot={shot}
              onOpen={() => open(exterior.length + index)}
              small
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

              <p className="min-w-0 flex-1 text-center text-xs leading-5 text-ink">
                {current.caption}
                <span className="tnum ml-2 text-muted">
                  {openAt! + 1}/{allShots.length}
                </span>
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
  small = false,
  priority = false,
}: {
  shot: Shot;
  onOpen: () => void;
  small?: boolean;
  priority?: boolean;
}) {
  return (
    <figure>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`ดูรูปใหญ่ — ${shot.caption}`}
        className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-surface"
      >
        <div className="aspect-3/2">
          <Image
            src={shot.image}
            alt={shot.alt}
            className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes={
              small
                ? "(min-width: 640px) 25vw, 50vw"
                : "(min-width: 640px) 50vw, 100vw"
            }
            priority={priority}
          />
        </div>
      </button>
      <figcaption
        className={`mt-1.5 leading-5 text-muted ${small ? "text-[11px]" : "text-xs"}`}
      >
        {shot.caption}
      </figcaption>
    </figure>
  );
}
