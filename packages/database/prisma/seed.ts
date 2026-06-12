import { hash } from "bcryptjs";
import { prisma, UserRole } from "../src/index";

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: "baruk" },
    update: {},
    create: {
      name: "BARUK Restaurant Group",
      slug: "baruk",
    },
  });

  const branch = await prisma.branch.upsert({
    where: {
      organizationId_slug: {
        organizationId: org.id,
        slug: "casablanca-centre",
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      name: "BARUK Casablanca Centre",
      slug: "casablanca-centre",
      address: "123 Boulevard Mohammed V",
      city: "Casablanca",
      postalCode: "20000",
      country: "MA",
      phone: "+212 5 22 00 00 00",
      email: "contact@baruk.ma",
      latitude: 33.5731,
      longitude: -7.5898,
      openingHours: {
        monday: "12:00-23:00",
        tuesday: "12:00-23:00",
        wednesday: "12:00-23:00",
        thursday: "12:00-23:00",
        friday: "12:00-00:00",
        saturday: "12:00-00:00",
        sunday: "12:00-22:00",
      },
    },
  });

  const adminPassword = await hash("admin123", 12);
  const ownerPassword = await hash("owner123", 12);
  const staffPassword = await hash("staff123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@baruk.ma" },
    update: {},
    create: {
      email: "admin@baruk.ma",
      name: "Admin BARUK",
      role: UserRole.ADMIN,
      passwordHash: adminPassword,
      organizationId: org.id,
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@baruk.ma" },
    update: {},
    create: {
      email: "owner@baruk.ma",
      name: "Propriétaire BARUK",
      role: UserRole.OWNER,
      passwordHash: ownerPassword,
      organizationId: org.id,
    },
  });

  const staffUser = await prisma.user.upsert({
    where: { email: "serveur@baruk.ma" },
    update: {},
    create: {
      email: "serveur@baruk.ma",
      name: "Ahmed Serveur",
      role: UserRole.STAFF,
      passwordHash: staffPassword,
      organizationId: org.id,
    },
  });

  const employee = await prisma.employee.upsert({
    where: { userId: staffUser.id },
    update: {},
    create: {
      branchId: branch.id,
      userId: staffUser.id,
      firstName: "Ahmed",
      lastName: "Benali",
      email: "serveur@baruk.ma",
      position: "serveur",
      nfcCardUid: "NFC-DEMO-001",
      pinCode: "1234",
    },
  });

  for (let i = 1; i <= 8; i++) {
    await prisma.restaurantTable.upsert({
      where: {
        branchId_number: { branchId: branch.id, number: i },
      },
      update: {},
      create: {
        branchId: branch.id,
        number: i,
        name: `Table ${i}`,
        capacity: i <= 4 ? 4 : 6,
        section: i <= 4 ? "Salle principale" : "Terrasse",
        posX: (i % 4) * 120,
        posY: Math.floor((i - 1) / 4) * 100,
      },
    });
  }

  const categories = [
    {
      name: "Entrées",
      description: "Pour bien commencer",
      items: [
        { name: "Salade BARUK", slug: "salade-baruk", description: "Mesclun, grenade, feta", price: 65 },
        { name: "Briouates au fromage", slug: "briouates-fromage", description: "Feuilletées croustillantes", price: 45 },
        { name: "Soupe du jour", slug: "soupe-jour", description: "Recette du chef", price: 40 },
      ],
    },
    {
      name: "Plats",
      description: "Nos signatures",
      items: [
        { name: "Tajine poulet citron", slug: "tajine-poulet-citron", description: "Olives confites, semoule", price: 120 },
        { name: "Couscous royal", slug: "couscous-royal", description: "7 légumes, viandes", price: 145 },
        { name: "Pastilla au poulet", slug: "pastilla-poulet", description: "Amandes, cannelle", price: 110 },
      ],
    },
    {
      name: "Desserts",
      description: "Douceurs maison",
      items: [
        { name: "Chebakia", slug: "chebakia", description: "Miel et sésame", price: 35 },
        { name: "Pastilla au lait", slug: "pastilla-lait", description: "Cannelle, fleur d'oranger", price: 40 },
        { name: "Salade de fruits", slug: "salade-fruits", description: "Fruits de saison", price: 45 },
      ],
    },
  ];

  for (const [catIndex, cat] of categories.entries()) {
    const category = await prisma.menuCategory.create({
      data: {
        branchId: branch.id,
        name: cat.name,
        description: cat.description,
        sortOrder: catIndex,
      },
    });

    for (const [itemIndex, item] of cat.items.entries()) {
      await prisma.menuItem.create({
        data: {
          categoryId: category.id,
          name: item.name,
          description: item.description,
          price: item.price,
          sortOrder: itemIndex,
          imageUrl: `/menu/${item.slug}.svg`,
        },
      });
    }
  }

  const stockItems = [
    { name: "Poulet", unit: "kg", quantity: 25, minThreshold: 5 },
    { name: "Semoule", unit: "kg", quantity: 40, minThreshold: 10 },
    { name: "Huile d'olive", unit: "L", quantity: 15, minThreshold: 3 },
    { name: "Citrons confits", unit: "kg", quantity: 8, minThreshold: 2 },
  ];

  for (const item of stockItems) {
    await prisma.stockItem.create({
      data: { branchId: branch.id, ...item },
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.dailyLedger.upsert({
    where: {
      branchId_date: { branchId: branch.id, date: today },
    },
    update: {},
    create: {
      branchId: branch.id,
      date: today,
      openingCash: 500,
      totalSales: 0,
      totalTips: 0,
      totalExpenses: 0,
    },
  });

  console.log("Seed completed:", {
    org: org.slug,
    branch: branch.slug,
    admin: admin.email,
    owner: owner.email,
    staff: employee.firstName,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
