"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";

/** Accepts "12,500", "12500.50" or "" and returns a number. */
function parseAmount(raw: FormDataEntryValue | null): number {
  if (raw === null) return 0;
  const cleaned = String(raw).replace(/[,\s]/g, "").trim();
  if (cleaned === "") return 0;
  const value = Number(cleaned);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

/** An empty max means the item has one price rather than a range. */
function parseOptionalAmount(raw: FormDataEntryValue | null): number | null {
  if (raw === null || String(raw).trim() === "") return null;
  return parseAmount(raw);
}

function parseText(raw: FormDataEntryValue | null, limit = 500): string {
  return String(raw ?? "").trim().slice(0, limit);
}

function parseId(raw: FormDataEntryValue | null): number {
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) throw new Error("invalid id");
  return value;
}

function done() {
  revalidatePath("/");
}

/* ---------- categories ---------- */

export async function addCategory(formData: FormData) {
  const name = parseText(formData.get("name"), 80);
  if (!name) return;
  await sql`
    insert into categories (name, sort_order)
    values (${name}, (select coalesce(max(sort_order), 0) + 1 from categories))`;
  done();
}

export async function updateCategory(formData: FormData) {
  const id = parseId(formData.get("id"));
  const name = parseText(formData.get("name"), 80);
  const note = parseText(formData.get("note"), 200);
  if (!name) return;
  await sql`update categories set name = ${name}, note = ${note} where id = ${id}`;
  done();
}

export async function deleteCategory(formData: FormData) {
  const id = parseId(formData.get("id"));
  await sql`delete from categories where id = ${id}`;
  done();
}

export async function toggleCategoryIncluded(formData: FormData) {
  const id = parseId(formData.get("id"));
  await sql`update categories set is_included = not is_included where id = ${id}`;
  done();
}

export async function moveCategory(formData: FormData) {
  const id = parseId(formData.get("id"));
  const up = formData.get("direction") === "up";

  const current = await sql`select sort_order from categories where id = ${id}`;
  if (current.length === 0) return;
  const order = Number(current[0].sort_order);

  const neighbour = up
    ? await sql`select id, sort_order from categories
                where sort_order < ${order} order by sort_order desc limit 1`
    : await sql`select id, sort_order from categories
                where sort_order > ${order} order by sort_order asc limit 1`;
  if (neighbour.length === 0) return;

  await sql`update categories set sort_order = ${Number(neighbour[0].sort_order)} where id = ${id}`;
  await sql`update categories set sort_order = ${order} where id = ${Number(neighbour[0].id)}`;
  done();
}

/* ---------- items ---------- */

export async function addItem(formData: FormData) {
  const categoryId = parseId(formData.get("category_id"));
  const name = parseText(formData.get("name"), 120);
  if (!name) return;

  const detail = parseText(formData.get("detail"));
  const min = parseAmount(formData.get("amount_min"));
  const max = parseOptionalAmount(formData.get("amount_max"));

  await sql`
    insert into items (category_id, name, detail, amount_min, amount_max, sort_order)
    values (
      ${categoryId}, ${name}, ${detail}, ${min}, ${max},
      (select coalesce(max(sort_order), 0) + 1 from items where category_id = ${categoryId})
    )`;
  done();
}

export async function updateItem(formData: FormData) {
  const id = parseId(formData.get("id"));
  const name = parseText(formData.get("name"), 120);
  if (!name) return;

  const detail = parseText(formData.get("detail"));
  const min = parseAmount(formData.get("amount_min"));
  const max = parseOptionalAmount(formData.get("amount_max"));

  await sql`
    update items
    set name = ${name}, detail = ${detail}, amount_min = ${min},
        amount_max = ${max}, updated_at = now()
    where id = ${id}`;
  done();
}

export async function deleteItem(formData: FormData) {
  const id = parseId(formData.get("id"));
  await sql`delete from items where id = ${id}`;
  done();
}

export async function toggleItemPaid(formData: FormData) {
  const id = parseId(formData.get("id"));
  await sql`update items set is_paid = not is_paid, updated_at = now() where id = ${id}`;
  done();
}

export async function toggleItemIncluded(formData: FormData) {
  const id = parseId(formData.get("id"));
  await sql`update items set is_included = not is_included, updated_at = now() where id = ${id}`;
  done();
}

export async function moveItem(formData: FormData) {
  const id = parseId(formData.get("id"));
  const up = formData.get("direction") === "up";

  const current = await sql`select category_id, sort_order from items where id = ${id}`;
  if (current.length === 0) return;
  const categoryId = Number(current[0].category_id);
  const order = Number(current[0].sort_order);

  const neighbour = up
    ? await sql`select id, sort_order from items
                where category_id = ${categoryId} and sort_order < ${order}
                order by sort_order desc limit 1`
    : await sql`select id, sort_order from items
                where category_id = ${categoryId} and sort_order > ${order}
                order by sort_order asc limit 1`;
  if (neighbour.length === 0) return;

  await sql`update items set sort_order = ${Number(neighbour[0].sort_order)} where id = ${id}`;
  await sql`update items set sort_order = ${order} where id = ${Number(neighbour[0].id)}`;
  done();
}
