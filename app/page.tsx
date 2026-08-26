import { AddCategoryForm } from "@/components/AddCategoryForm";
import { CategoryCard } from "@/components/CategoryCard";
import { ReferenceShots } from "@/components/ReferenceShots";
import { SummaryBar } from "@/components/SummaryBar";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const categories = await getCategories();

  return (
    <main className="min-h-dvh pb-24">
      <SummaryBar categories={categories} />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="pt-8">
          <ReferenceShots />
        </div>

        <header className="py-8">
          <h1 className="text-xl font-medium text-ink">สรุปยอดห้องนั่งเล่น</h1>
          <p className="mt-1 text-sm leading-6 text-muted">
            ห้อง 4×8 ม. ยกพื้น 45 ซม. ระเบียงไม้เอ็นกาวะลึก 2 ม.
            ชายคายื่น 2.4 ม.
          </p>
          <p className="mt-2 text-xs leading-5 text-muted">
            ราคาส่วนใหญ่เป็นช่วงประเมิน ยังไม่ใช่ใบเสนอราคาจริง ·
            กดที่ชื่อรายการเพื่อแก้ · กดวงกลมซ้ายเมื่อจ่ายแล้ว ·
            ปุ่ม “นับรวม/ไม่นับ” ใช้ตัดรายการออกจากยอดโดยไม่ต้องลบ
          </p>
        </header>

        {categories.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line py-12 text-center text-sm text-muted">
            ยังไม่มีหมวด — รัน <code className="text-wood">npm run db:setup</code>{" "}
            เพื่อใส่ข้อมูลตั้งต้น หรือเพิ่มหมวดเองด้านล่าง
          </p>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        <div className="mt-4">
          <AddCategoryForm />
        </div>
      </div>
    </main>
  );
}
