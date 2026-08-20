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

function Figure({
  shot,
  small = false,
  priority = false,
}: {
  shot: Shot;
  small?: boolean;
  priority?: boolean;
}) {
  return (
    <figure>
      <div className="aspect-3/2 overflow-hidden rounded-xl border border-line bg-surface">
        <Image
          src={shot.image}
          alt={shot.alt}
          className="size-full object-cover"
          sizes={
            small
              ? "(min-width: 640px) 25vw, 50vw"
              : "(min-width: 640px) 50vw, 100vw"
          }
          priority={priority}
        />
      </div>
      <figcaption
        className={`mt-1.5 leading-5 text-muted ${small ? "text-[11px]" : "text-xs"}`}
      >
        {shot.caption}
      </figcaption>
    </figure>
  );
}

export function ReferenceShots() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {exterior.map((shot) => (
          <Figure key={shot.image.src} shot={shot} priority />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {interior.map((shot) => (
          <Figure key={shot.image.src} shot={shot} small />
        ))}
      </div>
    </div>
  );
}
