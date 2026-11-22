import type { ReactNode } from "react";
import { Gallery, type Shot } from "@/components/ReferenceShots";
import { Icon } from "@/components/icons";
import { labelClass } from "@/components/ui";
import {
  checkOnSite,
  circuits,
  outlets,
  shopping,
  switches,
  tellElectrician,
  type Point,
} from "@/lib/electrical";
import planElectrical from "@/public/reference/plan-electrical.png";
import wallDeck from "@/public/reference/wall-deck.png";
import wallEast from "@/public/reference/wall-east.png";
import wallSouth from "@/public/reference/wall-south.png";
import wallWest from "@/public/reference/wall-west.png";
import wiringDiagram from "@/public/reference/wiring-diagram.png";

const sheets: Shot[] = [
  {
    image: planElectrical,
    alt: "ผังปลั๊กและสวิตช์ทั้งห้อง มองจากด้านบน S1–S4 ปลั๊ก P1–P7 โคม L1 L2 ไฟซ่อน แอร์ ตู้ไฟ พร้อมตารางความสูงและวงจร",
    caption: "ผังปลั๊ก-สวิตช์ — ทั้งห้อง มองจากด้านบน",
  },
  {
    image: wallEast,
    alt: "รูปด้านผนังฝั่งประตูมองจากในห้อง ทีวีแขวนกับ P1 ซ่อนหลังทีวี ชุดสวิตช์ S1 Tuya 3 ช่องบน S2 สวิตช์ 2 ทางล่าง P2 ใต้สวิตช์ ประตูบานเลื่อน ตู้เย็น และหน้าสวิตช์ขยาย",
    caption: "ผนังฝั่งประตู — มองจากในห้อง · หน้าสวิตช์ขยาย",
  },
  {
    image: wallDeck,
    alt: "รูปด้านผนังหน้ามองจากระเบียง โคมกล่องไม้ 2 ดวงใต้แป S4 สวิตช์ 2 ทางกับ P6 ใต้ S4 เหนือตู้รองเท้า P7 ซ้ายประตูในบล็อกกันน้ำฝาพับ LED strip ใต้ขอบเดค",
    caption: "ผนังหน้า — มองจากระเบียง",
  },
  {
    image: wallSouth,
    alt: "รูปด้านผนังครัว ตู้เย็น 55×55×97 ไมโครเวฟบนหลังตู้ P3 ปลั๊กคู่แนวตั้งข้างไมโครเวฟ ตู้ไฟเหนือตู้เย็น เคาน์เตอร์ KNOXHULT ซิงก์ช่องขวา หน้าต่างครัวกับมู่ลี่ไม้ไผ่ ประตูห้องน้ำ uPVC 80 และ S3",
    caption: "ผนังครัว — ฝั่งที่ล้างจาน",
  },
  {
    image: wallWest,
    alt: "รูปด้านผนังฝั่งโซฟาและห้องน้ำ P4 กึ่งกลางปลายโต๊ะกินข้าวสูง 60 P5 หลังอาร์มแชร์สูง 40 ไฟซ่อนชิดฝ้า",
    caption: "ผนังฝั่งโซฟา-ห้องน้ำ",
  },
  {
    image: wiringDiagram,
    alt: "ผังสายไฟแบบเส้นเดียว ตู้ไฟเมน 32A แยก 4 วงจร ไปสวิตช์ โคม และปลั๊ก",
    caption: "ผังสายไฟ — ตู้ไฟ → 4 วงจร → สวิตช์ → โคม/ปลั๊ก",
  },
];

/**
 * The page's last section. Long, and only needed when talking to the
 * electrician, so it starts folded with the counts showing.
 */
export function ElectricalSection() {
  return (
    <details className="group mt-16 border-t border-line pt-8">
      <summary className="flex cursor-pointer list-none items-end justify-between gap-4 select-none [&::-webkit-details-marker]:hidden">
        <div>
          <h2 className="font-serif text-xl text-ink">ระบบไฟฟ้า · ปลั๊ก · สวิตช์</h2>
          <p className="mt-1 text-xs text-muted">
            สวิตช์ {switches.length} · ปลั๊กคู่ {outlets.length} · {circuits.length} วงจร —{" "}
            <span className="group-open:hidden">กดเพื่อดูรายละเอียด</span>
            <span className="hidden group-open:inline">กดเพื่อย่อ</span>
          </p>
        </div>
        <Icon
          name="chevron"
          className="mb-1 size-5 shrink-0 text-muted transition group-open:rotate-90"
        />
      </summary>
      <div className="mt-6">
        <Electrical />
      </div>
    </details>
  );
}

/**
 * The agreed layout, short first: circuits, then one line per switch and
 * outlet, then what to tell the electrician. The shopping list and the
 * drawings are only needed on the day, so they stay folded.
 */
export function Electrical() {
  const shoppingCount = shopping.reduce((n, g) => n + g.lines.length, 0);
  return (
    <div className="space-y-8">
      <div>
        <h3 className={`${labelClass} mb-3`}>ตู้ไฟ · เมน 32A · {circuits.length} วงจร</h3>
        <dl className="divide-y divide-line-soft rounded-lg border border-line bg-surface">
          {circuits.map(([code, text]) => (
            <div key={code} className="flex gap-3 px-4 py-2">
              <dt className="w-8 shrink-0 font-mono text-sm text-ink">{code}</dt>
              <dd className="text-sm text-ink">{text}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <PointList title="สวิตช์" note="สูง 120 ทุกตัว" points={switches} tone="lamp" />
        <PointList title="ปลั๊กคู่" note="สูงจากพื้น (ซม.)" points={outlets} tone="power" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Checklist title="ต้องบอกช่าง" items={tellElectrician} />
        <Checklist title="เช็กหน้างาน" items={checkOnSite} />
      </div>

      <Fold title="รายการของที่ต้องซื้อ" count={`${shoppingCount} รายการ`}>
        <div className="space-y-4">
          {shopping.map((group) => (
            <div key={group.title} className="rounded-lg border border-line bg-surface">
              <p className="border-b border-line-soft px-4 py-2.5 text-sm font-medium text-ink">
                {group.title}
              </p>
              <ul className="divide-y divide-line-soft">
                {group.lines.map((line) => (
                  <li key={line.item} className="flex items-baseline gap-3 px-4 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink">{line.item}</p>
                      {line.note && <p className="text-xs text-muted">{line.note}</p>}
                    </div>
                    <span className="tnum shrink-0 font-mono text-sm text-ink">{line.qty}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">
          ความยาว LED strip และจำนวนช่องตู้ไฟเป็นตัวเลขประมาณจากแบบ ให้ช่างวัดยืนยันก่อนสั่ง
        </p>
      </Fold>

      <Fold title="แบบไฟฟ้า" count={`${sheets.length} แผ่น`}>
        <Gallery shots={sheets} />
      </Fold>
    </div>
  );
}

function Fold({ title, count, children }: { title: string; count: string; children: ReactNode }) {
  return (
    <details className="group/fold rounded-lg border border-line">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 select-none [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-medium text-ink">{title}</span>
        <span className="text-xs text-muted">{count}</span>
        <Icon name="chevron" className="ml-auto size-4 text-muted transition group-open/fold:rotate-90" />
      </summary>
      <div className="border-t border-line-soft p-4">{children}</div>
    </details>
  );
}

function PointList({
  title,
  note,
  points,
  tone,
}: {
  title: string;
  note: string;
  points: Point[];
  tone: "lamp" | "power";
}) {
  const badge =
    tone === "lamp"
      ? "border-[#d9931f] bg-[#fff1cc] text-[#8a5a10]"
      : "border-[#2f6f9f] bg-[#e4eff8] text-[#2f6f9f]";
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h3 className={labelClass}>{title}</h3>
        <span className="text-xs text-muted">{note}</span>
      </div>
      <ul className="divide-y divide-line-soft rounded-lg border border-line bg-surface">
        {points.map((p) => (
          <li key={p.code} className="flex items-baseline gap-3 px-3 py-2">
            <span className={`shrink-0 rounded border px-1.5 font-mono text-xs font-medium ${badge}`}>
              {p.code}
            </span>
            <p className="min-w-0 flex-1 text-sm leading-5 text-ink">{p.short}</p>
            {tone === "power" && (
              <span className="tnum shrink-0 font-mono text-xs text-muted">{p.height.replace("ขอบล่าง ", "")}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className={`${labelClass} mb-2`}>{title}</h3>
      <ul className="space-y-1 rounded-lg bg-wood-soft/50 px-4 py-3">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-5 text-ink">
            <span className="text-wood">·</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
