"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function submitPrice(formData: FormData) {
  const itemId = parseInt(formData.get("itemId") as string);
  const price = parseFloat((formData.get("price") as string).replace(",", "."));

  const locationName = (formData.get("locationName") as string).trim();
  const city = (formData.get("city") as string).trim();
  const district = (formData.get("district") as string).trim();
  const type = (formData.get("type") as string).trim();

  if (!itemId || isNaN(price) || price <= 0 || !locationName || !city || !district || !type) return;

  let location = await prisma.location.findFirst({
    where: { name: locationName, city, district },
  });

  if (!location) {
    location = await prisma.location.create({
      data: { name: locationName, city, district, type },
    });
  }

  await prisma.priceReport.create({
    data: { itemId, locationId: location.id, price, status: "pending" },
  });

  redirect("/fiyat-bildir/tesekkurler");
}
