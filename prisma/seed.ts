import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.priceReport.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.location.deleteMany();
  await prisma.adminUser.deleteMany();

  // Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "İçecek", slug: "icecek", icon: "🍺" } }),
    prisma.category.create({ data: { name: "Yiyecek", slug: "yiyecek", icon: "🍞" } }),
    prisma.category.create({ data: { name: "Akaryakıt", slug: "akaryakit", icon: "⛽" } }),
    prisma.category.create({ data: { name: "Market", slug: "market", icon: "🛒" } }),
  ]);

  const [icecek, yiyecek, akaryakit, market] = categories;

  // Items
  const items = await Promise.all([
    prisma.item.create({ data: { name: "Bira (Efes)", unit: "500ml", categoryId: icecek.id } }),
    prisma.item.create({ data: { name: "Çay", unit: "bardak", categoryId: icecek.id } }),
    prisma.item.create({ data: { name: "Türk Kahvesi", unit: "fincan", categoryId: icecek.id } }),
    prisma.item.create({ data: { name: "Filtre Kahve", unit: "bardak", categoryId: icecek.id } }),
    prisma.item.create({ data: { name: "Su", unit: "500ml", categoryId: icecek.id } }),
    prisma.item.create({ data: { name: "Ekmek", unit: "somun", categoryId: yiyecek.id } }),
    prisma.item.create({ data: { name: "Simit", unit: "adet", categoryId: yiyecek.id } }),
    prisma.item.create({ data: { name: "Döner (Yarım Ekmek)", unit: "porsiyon", categoryId: yiyecek.id } }),
    prisma.item.create({ data: { name: "Benzin (95)", unit: "litre", categoryId: akaryakit.id } }),
    prisma.item.create({ data: { name: "Motorin", unit: "litre", categoryId: akaryakit.id } }),
    prisma.item.create({ data: { name: "Yumurta", unit: "10'lu", categoryId: market.id } }),
    prisma.item.create({ data: { name: "Süt", unit: "1 litre", categoryId: market.id } }),
  ]);

  const [bira, cay, kahve, filtre, su, ekmek, simit, doner, benzin, motorin, yumurta, sut] = items;

  // Locations
  const locations = await Promise.all([
    prisma.location.create({ data: { name: "Bağdaşık Pub", city: "İstanbul", district: "Kadıköy", type: "bar" } }),
    prisma.location.create({ data: { name: "Mahalle Büfesi", city: "İstanbul", district: "Beşiktaş", type: "büfe" } }),
    prisma.location.create({ data: { name: "Tarihi Çay Ocağı", city: "İstanbul", district: "Eminönü", type: "çay ocağı" } }),
    prisma.location.create({ data: { name: "Çarşı Kahvesi", city: "İstanbul", district: "Fatih", type: "kafe" } }),
    prisma.location.create({ data: { name: "Liman Lokantası", city: "İzmir", district: "Konak", type: "lokanta" } }),
    prisma.location.create({ data: { name: "Kemeraltı Büfesi", city: "İzmir", district: "Konak", type: "büfe" } }),
    prisma.location.create({ data: { name: "Kızılay Simit Sarayı", city: "Ankara", district: "Çankaya", type: "simitçi" } }),
    prisma.location.create({ data: { name: "Ulus Çay Evi", city: "Ankara", district: "Altındağ", type: "çay ocağı" } }),
    prisma.location.create({ data: { name: "Şehir Merkezi Akaryakıt", city: "İstanbul", district: "Şişli", type: "akaryakıt" } }),
    prisma.location.create({ data: { name: "Çevre Yolu İstasyonu", city: "Ankara", district: "Keçiören", type: "akaryakıt" } }),
    prisma.location.create({ data: { name: "Migros Kadıköy", city: "İstanbul", district: "Kadıköy", type: "market" } }),
    prisma.location.create({ data: { name: "BİM Beşiktaş", city: "İstanbul", district: "Beşiktaş", type: "market" } }),
    prisma.location.create({ data: { name: "Sokak Simitçisi", city: "İstanbul", district: "Taksim", type: "simitçi" } }),
    prisma.location.create({ data: { name: "Unkapanı Ekmek Fırını", city: "İstanbul", district: "Fatih", type: "fırın" } }),
    prisma.location.create({ data: { name: "Boğaz Restoran", city: "İstanbul", district: "Beşiktaş", type: "restoran" } }),
  ]);

  const [bagdasik, mahalle, tarihi, carsi, liman, kemeralti, kizilaysimit, ulus, sehirAkaryakit, cevreyolu, migros, bim, sokaksimit, unkapani, bogaz] = locations;

  // Price Reports (approved)
  const approved = "approved";
  await prisma.priceReport.createMany({
    data: [
      // Bira
      { itemId: bira.id, locationId: bagdasik.id, price: 120, status: approved },
      { itemId: bira.id, locationId: mahalle.id, price: 85, status: approved },
      { itemId: bira.id, locationId: bogaz.id, price: 175, status: approved },
      { itemId: bira.id, locationId: liman.id, price: 95, status: approved },
      // Çay
      { itemId: cay.id, locationId: tarihi.id, price: 10, status: approved },
      { itemId: cay.id, locationId: carsi.id, price: 12, status: approved },
      { itemId: cay.id, locationId: ulus.id, price: 8, status: approved },
      { itemId: cay.id, locationId: mahalle.id, price: 15, status: approved },
      { itemId: cay.id, locationId: bogaz.id, price: 35, status: approved },
      // Türk Kahvesi
      { itemId: kahve.id, locationId: carsi.id, price: 45, status: approved },
      { itemId: kahve.id, locationId: bogaz.id, price: 95, status: approved },
      { itemId: kahve.id, locationId: liman.id, price: 60, status: approved },
      { itemId: kahve.id, locationId: tarihi.id, price: 40, status: approved },
      // Filtre Kahve
      { itemId: filtre.id, locationId: migros.id, price: 55, status: approved },
      { itemId: filtre.id, locationId: bogaz.id, price: 120, status: approved },
      { itemId: filtre.id, locationId: kizilaysimit.id, price: 50, status: approved },
      // Su
      { itemId: su.id, locationId: mahalle.id, price: 10, status: approved },
      { itemId: su.id, locationId: bogaz.id, price: 35, status: approved },
      { itemId: su.id, locationId: migros.id, price: 8, status: approved },
      // Ekmek
      { itemId: ekmek.id, locationId: unkapani.id, price: 10, status: approved },
      { itemId: ekmek.id, locationId: migros.id, price: 12, status: approved },
      { itemId: ekmek.id, locationId: bim.id, price: 10, status: approved },
      // Simit
      { itemId: simit.id, locationId: sokaksimit.id, price: 15, status: approved },
      { itemId: simit.id, locationId: kizilaysimit.id, price: 20, status: approved },
      { itemId: simit.id, locationId: tarihi.id, price: 12, status: approved },
      // Döner
      { itemId: doner.id, locationId: kemeralti.id, price: 120, status: approved },
      { itemId: doner.id, locationId: mahalle.id, price: 150, status: approved },
      { itemId: doner.id, locationId: liman.id, price: 130, status: approved },
      // Benzin
      { itemId: benzin.id, locationId: sehirAkaryakit.id, price: 43.80, status: approved },
      { itemId: benzin.id, locationId: cevreyolu.id, price: 43.20, status: approved },
      // Motorin
      { itemId: motorin.id, locationId: sehirAkaryakit.id, price: 41.50, status: approved },
      { itemId: motorin.id, locationId: cevreyolu.id, price: 40.90, status: approved },
      // Yumurta
      { itemId: yumurta.id, locationId: migros.id, price: 85, status: approved },
      { itemId: yumurta.id, locationId: bim.id, price: 72, status: approved },
      // Süt
      { itemId: sut.id, locationId: migros.id, price: 42, status: approved },
      { itemId: sut.id, locationId: bim.id, price: 38, status: approved },
      // Pending examples
      { itemId: bira.id, locationId: kemeralti.id, price: 90, status: "pending" },
      { itemId: cay.id, locationId: kizilaysimit.id, price: 10, status: "pending" },
    ],
  });

  await prisma.adminUser.create({
    data: { username: "admin", password: await bcrypt.hash("admin123", 10) },
  });

  console.log("✅ Seed tamamlandı");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
