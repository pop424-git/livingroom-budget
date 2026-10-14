import { AddCategoryForm } from "@/components/AddCategoryForm";
import { CategoryCard } from "@/components/CategoryCard";
import { Icon } from "@/components/icons";
import { ReferenceShots } from "@/components/ReferenceShots";
import { SummaryBar } from "@/components/SummaryBar";
import { labelClass, monoLabelClass } from "@/components/ui";
import { categoryTotal, grandTotal } from "@/lib/types";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** The room's key dimensions, set out like the notes on a drawing. */
const specs = [
  ["ห้อง", "4 × 8 ม."],
  ["ยกพื้น", "45 ซม."],
  ["ฝ้า", "2.40 ม."],
  ["ระเบียง", "ลึก 2 ม."],
  ["ชายคา", "ยื่น 2.50 ม."],
];

export default async function Page() {
  const categories = await getCategories();
  const grandMax = grandTotal(categories).max;

  return (
    <main className="min-h-dvh pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="pt-10 pb-8 sm:pt-14">
          <p className={monoLabelClass}>Living room · Engawa — Budget</p>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
            สรุปยอดห้องนั่งเล่น
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            หลังคาจั่วไม่สมมาตร พร้อมระเบียงไม้เอ็นกาวะ
            ราคาส่วนใหญ่เป็นช่วงประเมิน ยังไม่ใช่ใบเสนอราคาจริง
          </p>

          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-4">
            {specs.map(([label, value]) => (
              <div key={label}>
                <dt className={labelClass}>{label}</dt>
                <dd className="tnum mt-0.5 text-sm text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <SummaryBar categories={categories} />

        <div className="mt-12 mb-4 flex items-end justify-between gap-4">
          <h2 className="font-serif text-xl text-ink">รายการตามหมวด</h2>
          <span className={labelClass}>{categories.length} หมวด</span>
        </div>

        <details className="group mb-4 rounded-lg bg-wood-soft/50 text-xs leading-5 text-muted">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 select-none hover:text-ink">
            <Icon name="info" className="size-4" strokeWidth={1.8} />
            วิธีใช้
            <Icon
              name="chevron"
              className="ml-auto size-4 transition group-open:rotate-90"
            />
          </summary>
          <ul className="space-y-1 px-4 pb-3 pl-10">
            <li>กดหัวหมวดเพื่อกาง/ย่อ · กดค้าง 3 วินาทีเพื่อแก้ชื่อหมวด</li>
            <li>กดวงกลมหน้ารายการเพื่อทำเครื่องหมายว่าจ่ายแล้ว</li>
            <li>กดชื่อรายการเพื่อแก้ราคา เลื่อนลำดับ หรือลบ</li>
            <li>“นับรวม/ไม่นับ” ตัดรายการหรือทั้งหมวดออกจากยอดโดยไม่ต้องลบ</li>
          </ul>
        </details>

        {categories.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line py-12 text-center text-sm text-muted">
            ยังไม่มีหมวด — รัน <code className="text-wood">npm run db:setup</code>{" "}
            เพื่อใส่ข้อมูลตั้งต้น หรือเพิ่มหมวดเองด้านล่าง
          </p>
        ) : (
          <div className="space-y-2.5">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                share={
                  category.is_included && grandMax > 0
                    ? categoryTotal(category).max / grandMax
                    : 0
                }
              />
            ))}
          </div>
        )}

        <div className="mt-2.5">
          <AddCategoryForm />
        </div>

        <section className="mt-16">
          <div className="mb-4 flex items-end justify-between gap-4 border-t border-line pt-8">
            <h2 className="font-serif text-xl text-ink">ภาพอ้างอิง</h2>
            <span className={labelClass}>แบบ · เรนเดอร์</span>
          </div>
          <ReferenceShots />
        </section>
      </div>
    </main>
  );
}
