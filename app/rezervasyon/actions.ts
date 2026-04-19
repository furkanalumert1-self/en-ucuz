"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createReservation(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const guestCount = parseInt(formData.get("guestCount") as string);
  const tableId = parseInt(formData.get("tableId") as string);
  const note = formData.get("note") as string;

  if (!name || !phone || !date || !time || !guestCount || !tableId) {
    return;
  }

  await prisma.reservation.create({
    data: { name, phone, date, time, guestCount, tableId, note: note || null },
  });

  redirect("/rezervasyon/basarili");
}
