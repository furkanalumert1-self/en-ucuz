import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.reservation.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.table.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.restaurant.deleteMany();

  const restaurant = await prisma.restaurant.create({
    data: {
      name: "En Ucuz Bistro",
      address: "Bağdat Caddesi No:42, Kadıköy, İstanbul",
      phone: "0216 123 45 67",
      description: "Şeffaf fiyatlarla kaliteli yemek deneyimi",
    },
  });

  const tables = await Promise.all(
    [
      { number: 1, capacity: 2 },
      { number: 2, capacity: 4 },
      { number: 3, capacity: 4 },
      { number: 4, capacity: 6 },
      { number: 5, capacity: 8 },
    ].map((t) =>
      prisma.table.create({ data: { ...t, restaurantId: restaurant.id } })
    )
  );

  await prisma.menuItem.createMany({
    data: [
      { name: "Mercimek Çorbası", category: "Çorba", price: 85, restaurantId: restaurant.id, description: "Geleneksel kırmızı mercimek" },
      { name: "Ezogelin Çorbası", category: "Çorba", price: 85, restaurantId: restaurant.id, description: "Bulgurlu ezogelin" },
      { name: "Izgara Köfte", category: "Ana Yemek", price: 220, restaurantId: restaurant.id, description: "200g dana köfte, pilav ve salata ile" },
      { name: "Tavuk Şiş", category: "Ana Yemek", price: 195, restaurantId: restaurant.id, description: "Marine edilmiş tavuk, lavaş ve cacık ile" },
      { name: "Karışık Izgara", category: "Ana Yemek", price: 380, restaurantId: restaurant.id, description: "Dana, tavuk ve kuzu karışık" },
      { name: "Mevsim Salatası", category: "Salata", price: 95, restaurantId: restaurant.id, description: "Taze mevsim sebzeleri" },
      { name: "Çoban Salatası", category: "Salata", price: 90, restaurantId: restaurant.id, description: "Domates, salatalık, biber, maydanoz" },
      { name: "Künefe", category: "Tatlı", price: 145, restaurantId: restaurant.id, description: "Fıstıklı geleneksel künefe" },
      { name: "Ayran", category: "İçecek", price: 45, restaurantId: restaurant.id, description: "Ev yapımı yoğurt ayranı" },
      { name: "Limonata", category: "İçecek", price: 65, restaurantId: restaurant.id, description: "Taze sıkılmış limon" },
    ],
  });

  await prisma.reservation.createMany({
    data: [
      { name: "Ahmet Yılmaz", phone: "0532 111 22 33", date: "2026-04-25", time: "19:00", guestCount: 2, tableId: tables[0].id, status: "approved" },
      { name: "Fatma Kaya", phone: "0542 333 44 55", date: "2026-04-25", time: "20:00", guestCount: 4, tableId: tables[1].id, status: "pending" },
      { name: "Mehmet Demir", phone: "0555 666 77 88", date: "2026-04-26", time: "13:00", guestCount: 3, tableId: tables[2].id, status: "pending" },
    ],
  });

  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.create({
    data: { username: "admin", password: hashed },
  });

  console.log("✅ Seed tamamlandı");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
