"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import elevationDimensions from "@/public/reference/elevation-dimensions.jpg";
import engawaGardenPath from "@/public/reference/engawa-garden-path.jpg";
import engawaVeranda from "@/public/reference/engawa-veranda.jpg";
import engawaVerandaPlanted from "@/public/reference/engawa-veranda-planted.jpg";
import exteriorCorner from "@/public/reference/exterior-corner.jpg";
import exteriorFront from "@/public/reference/exterior-front.jpg";
import exteriorHipRoof from "@/public/reference/exterior-hip-roof.jpg";
import interiorEngawa from "@/public/reference/interior-engawa.jpg";
import interiorLiving from "@/public/reference/interior-living.jpg";
import planDimensions from "@/public/reference/plan-dimensions.png";
import sectionDimensions from "@/public/reference/section-dimensions.jpg";

type Shot = {
  image: StaticImageData;
  alt: string;
  caption: string;
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
    alt: "ผังพื้นพร้อมระยะ ห้อง 400 × 960 ซม. 38.4 ตร.ม. ห้องน้ำ 200 × 150 ซม. มุมตะวันออกเฉียงเหนือ ประตูห้องน้ำผนังใต้ อ่างล้างหน้าชนหลังซิงค์ครัว ตู้เย็น 70 เคาน์เตอร์ 120 ประตูบานเลื่อน 300 กลางผนังด้านระเบียง ระเบียงลึก 200 ซม.",
    caption: "ผังพื้น — ห้อง 4 × 9.6 ม. ห้องน้ำ 3 ตร.ม. ระเบียง 2 ม.",
  },
  {
    image: sectionDimensions,
    alt: "รูปตัดขวางพร้อมระยะ จั่วไม่สมมาตร ชันฝั่งเดค 38.7° ฝั่งหลัง 21.8° สันสูง 4.00 ม. จากพื้น ท้องชายคา 2.00 ม. เท่ากันสองฝั่ง ฝ้าห้อง 2.40 ม. พื้นยก 0.45 ม. เดคลึก 2.00 ม. ชายคาเลยขอบเดค 0.50 ม.",
    caption: "รูปตัด — จั่วไม่สมมาตร 38.7°/21.8° สัน 4.00 ม. ฝ้า 2.40 ม.",
  },
];

/** Front elevation. */
const elevation: Shot[] = [
  {
    image: elevationDimensions,
    alt: "รูปด้านหน้าพร้อมระยะ ยาว 960 ซม. ผนังตรงกลางจั่วสูง 400 ซม. ประตูบานเลื่อนกว้าง 300 ซม. กลางผนัง ห้องน้ำกว้าง 150 ซม. ตู้เย็นชิดผนังซ้าย โต๊ะกินข้าวกับเก้าอี้หน้าประตู อาร์มแชร์และโซฟา 186 ซม. ด้านขวา บนพื้นยกบนตอม่อ",
    caption: "รูปด้านหน้า — ยาว 960 ซม. ประตูบานเลื่อน 300 ซม. ห้องน้ำ 150 ซม. โซฟา 186 ซม.",
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

/** Engawa reference: the veranda seen from the garden, with the building
    around it, rather than the room. */
const engawa: Shot[] = [
  {
    image: engawaVeranda,
    alt: "ภาพเรนเดอร์มองจากสวนช่วงหัวค่ำ ระเบียงเอ็นกาวะไม้ยกพื้นพาดเต็มหน้าบ้าน เสาไม้สี่ต้นตั้งบนตอม่อคอนกรีตรับชายคาที่ยื่นคลุม ผนังฉาบสีครีม ประตูกระจกบานเลื่อนกรอบไม้ โคมไฟติดผนังสองดวง เก้าอี้กับโต๊ะเล็กบนระเบียง บันไดไม้ขั้นเดียวลงสวนกรวด และตะเกียงหิน",
    caption: "ระเบียงเอ็นกาวะ — พื้นไม้ยกพื้น เสารับชายคายื่น บันไดลงสวนหิน",
  },
];

/** More engawa references. */
const engawaMore: Shot[] = [
  {
    image: engawaVerandaPlanted,
    alt: "ภาพเรนเดอร์หน้าบ้านหลังคาเมทัลชีทสีขาว เสาไม้สี่ต้นบนตอม่อคอนกรีต ผนังไม้ตีเกล็ดแนวตั้งสีขาว ประตูกระจกบานเลื่อนลูกฟักไม้ ระเบียงไม้ยกพื้น บันไดไม้สามขั้นลงสวนกรวด ตะเกียงหิน บอนไซ และไม้พุ่มรอบบ้าน",
    caption: "ระเบียงอีกแบบ — หลังคาขาว ประตูลูกฟัก บันไดไม้ สวนปลูกต้นไม้",
  },
  {
    image: engawaGardenPath,
    alt: "ภาพถ่ายบ้านญี่ปุ่น ระเบียงไม้ยาวใต้ชายคาไม้ เสาไม้ ผนังขาว ประตูกระจกกรอบไม้ มีคนนั่งริมระเบียง ทางเดินแผ่นหินผ่านสวนดอกไม้และต้นไม้",
    caption: "ระเบียงจริง — นั่งริมขอบ ทางเดินหินผ่านสวน",
  },
];

/** The building seen whole. */
const materials: Shot[] = [
  {
    image: exteriorFront,
    alt: "ภาพเรนเดอร์ตัวอาคาร หลังคาจั่วไม่สมมาตรชายคายื่นคลุม เสาไม้รับชายคา ประตูบานเลื่อนเปิดเต็มหน้า ระเบียงไม้ยกพื้น และไฟซ่อนใต้ชายคา",
    caption: "ตัวอาคาร — จั่วชายคายื่น เสาไม้รับ ประตูเปิดเต็มหน้า",
  },
  {
    image: exteriorCorner,
    alt: "ภาพเรนเดอร์บ้านมุมเฉียงกลางวัน หลังคาเมทัลชีทสีเทาเงินจั่วสองชั้น ชายคาต่ำคลุมระเบียงไม้ยกพื้น เสาไม้ ผนังฉาบสีขาว ประตูบานเลื่อนกรอบไม้ลายตาราง บันไดไม้ลงทางเดินกรวดกับแผ่นหิน สวนหินและไม้พุ่ม แอร์คอมเพรสเซอร์ข้างบ้าน มีภูเขาเป็นฉากหลัง",
    caption: "มุมเฉียง — หลังคาเมทัลชีทเทา ผนังขาว ระเบียงไม้ สวนหิน ภูเขาด้านหลัง",
  },
  {
    image: exteriorHipRoof,
    alt: "ภาพบ้านชั้นเดียวมองตรงจากสนามหญ้า หลังคาปั้นหยากระเบื้องสีเทาอ่อน ผนังฉาบสีขาว ประตูกระจกบานเลื่อนกรอบไม้สีส้มอ่อนหลายชุดกับผ้าม่านขาว ฉากไม้ระแนงข้างประตูกลาง ระเบียงไม้ยกพื้นยาวเต็มหน้าบ้าน ม้านั่งไม้ โต๊ะกับม้านั่งกินข้าว บันไดปูนลงทางเดินแผ่นหิน ไม้พุ่มรอบบ้าน และภูเขาป่าเขียวเป็นฉากหลัง",
    caption: "หลังคาปั้นหยา — กระเบื้องเทา กรอบไม้ ระเบียงยาวเต็มหน้า ภูเขาด้านหลัง",
  },
];

/** Every shot in page order; the lightbox pages through the same list. */
const allShots = [
  ...overview,
  ...elevation,
  ...interior,
  ...engawa,
  ...engawaMore,
  ...materials,
];

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
      {/* One shot per row at full width, each at its own proportions, so
          nothing is cropped or shrunk to fit beside another. */}
      <div className="space-y-4 sm:space-y-5">
        {allShots.map((shot, index) => (
          <Thumb
            key={shot.image.src}
            shot={shot}
            onOpen={() => open(index)}
          />
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpenAt(null)}
        onClick={(event) => {
          // Clicks land on the dialog itself only when they hit the backdrop.
          if (event.target === dialogRef.current) close();
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-ink/90"
      >
        {current && (
          <div
            onClick={close}
            className="flex h-dvh w-dvw flex-col items-center justify-center gap-3 p-4 sm:p-8"
          >
            {/* The image is sized to the picture itself rather than filling
                the frame, so the bands beside a tall plan or above a wide
                render are the frame, not the image — a tap there closes.
                Its width/height attributes still reserve the box before it
                loads, so nothing shifts. */}
            <div className="flex min-h-0 w-full flex-1 items-center justify-center">
              <Image
                src={current.image}
                alt={current.alt}
                sizes="100vw"
                loading="eager"
                // Only the picture itself swallows the click.
                onClick={(event) => event.stopPropagation()}
                className="h-auto max-h-full w-auto max-w-full"
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

              <p className="min-w-0 flex-1 text-center text-xs leading-5 text-muted">
                <span className="tnum font-mono">
                  {openAt! + 1}/{allShots.length}
                </span>
                <span className="hidden sm:inline"> · {current.caption}</span>
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

function Thumb({ shot, onOpen }: { shot: Shot; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`ดูรูปใหญ่ — ${shot.caption}`}
      // A plain white photo frame: the mat sets the warm renders off the page,
      // and the caption sits on the bottom of the mat like a gallery label.
      className="group block w-full cursor-zoom-in rounded-[3px] border border-line bg-surface p-2.5 text-left shadow-[0_1px_2px_rgb(42_38_34/0.05),0_12px_28px_-20px_rgb(42_38_34/0.35)] transition hover:shadow-[0_1px_2px_rgb(42_38_34/0.06),0_16px_32px_-18px_rgb(42_38_34/0.45)] sm:p-3.5"
    >
      {/* The thin line is the bevel where the mat is cut around the picture. */}
      <div className="overflow-hidden border border-ink/10">
        <Image
          src={shot.image}
          alt={shot.alt}
          className="h-auto w-full transition duration-300 group-hover:scale-[1.03]"
          sizes="(min-width: 768px) 768px, 100vw"
        />
      </div>
      <p className="mt-2.5 text-xs leading-5 text-muted transition group-hover:text-ink sm:mt-3">
        {shot.caption}
      </p>
    </button>
  );
}
