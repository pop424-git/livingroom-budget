import Image, { type StaticImageData } from "next/image";
import engawaHako from "@/public/reference/engawa-hako.jpg";
import roomRender from "@/public/reference/room-render.jpg";

/**
 * Reference photos the design is based on.
 *
 * Images are imported rather than referenced by path so Next can size and
 * optimise them, and so a missing file fails the build instead of shipping a
 * broken image. To add one: drop the file in public/reference/, import it
 * above, and add an entry here.
 */
const shots: { image: StaticImageData; alt: string; caption: string }[] = [
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

export function ReferenceShots() {
  if (shots.length === 0) return null;

  return (
    <div
      className={`grid gap-3 ${shots.length > 1 ? "sm:grid-cols-2" : "sm:max-w-xl"}`}
    >
      {shots.map((shot) => (
        <figure key={shot.image.src}>
          <div className="aspect-3/2 overflow-hidden rounded-xl border border-line bg-surface">
            <Image
              src={shot.image}
              alt={shot.alt}
              className="size-full object-cover"
              sizes="(min-width: 640px) 50vw, 100vw"
              priority
            />
          </div>
          <figcaption className="mt-1.5 text-xs leading-5 text-muted">
            {shot.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
