// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // ============================================
  // 1. Create Locations
  // ============================================
  console.log("📍 Creating locations...");

  const locations = await Promise.all([
    prisma.location.upsert({
      where: { id: "nairobi-loc" },
      update: {},
      create: {
        id: "nairobi-loc",
        name: "Nairobi",
        city: "Nairobi",
        address: "Nairobi CBD, Kenya",
        latitude: -1.286389,
        longitude: 36.817223,
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { id: "kisumu-loc" },
      update: {},
      create: {
        id: "kisumu-loc",
        name: "Kisumu",
        city: "Kisumu",
        address: "Kisumu City Center, Kenya",
        latitude: -0.091702,
        longitude: 34.767956,
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { id: "nakuru-loc" },
      update: {},
      create: {
        id: "nakuru-loc",
        name: "Nakuru",
        city: "Nakuru",
        address: "Nakuru Town, Kenya",
        latitude: -0.303099,
        longitude: 36.080025,
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { id: "mombasa-loc" },
      update: {},
      create: {
        id: "mombasa-loc",
        name: "Mombasa",
        city: "Mombasa",
        address: "Mombasa Island, Kenya",
        latitude: -4.043477,
        longitude: 39.668206,
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { id: "eldoret-loc" },
      update: {},
      create: {
        id: "eldoret-loc",
        name: "Eldoret",
        city: "Eldoret",
        address: "Eldoret Town, Kenya",
        latitude: 0.514277,
        longitude: 35.269779,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${locations.length} locations`);

  // ============================================
  // 2. Create Vehicle Categories (for Taxi)
  // ============================================
  console.log("🚗 Creating vehicle categories...");

  const categories = await Promise.all([
    prisma.vehicleCategory.upsert({
      where: { name: "Sedan" },
      update: {},
      create: {
        name: "Sedan",
        description: "Comfortable sedan for up to 4 passengers",
        seats: 4,
        basePrice: 2000,
        pricePerKm: 50,
        image: "/images/categories/sedan.jpg",
        isActive: true,
      },
    }),
    prisma.vehicleCategory.upsert({
      where: { name: "SUV" },
      update: {},
      create: {
        name: "SUV",
        description: "Spacious SUV for up to 6 passengers",
        seats: 6,
        basePrice: 3500,
        pricePerKm: 70,
        image: "/images/categories/suv.jpg",
        isActive: true,
      },
    }),
    prisma.vehicleCategory.upsert({
      where: { name: "Van" },
      update: {},
      create: {
        name: "Van",
        description: "Large van for up to 12 passengers",
        seats: 12,
        basePrice: 5000,
        pricePerKm: 90,
        image: "/images/categories/van.jpg",
        isActive: true,
      },
    }),
    prisma.vehicleCategory.upsert({
      where: { name: "Executive" },
      update: {},
      create: {
        name: "Executive",
        description: "Luxury executive car for up to 3 passengers",
        seats: 3,
        basePrice: 5000,
        pricePerKm: 100,
        image: "/images/categories/executive.jpg",
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} vehicle categories`);

  // ============================================
  // 3. Create Sample Vehicles (for Rental)
  // ============================================
  console.log("🚙 Creating sample vehicles...");

  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        name: "Toyota Corolla 2022",
        brand: "Toyota",
        model: "Corolla",
        year: 2022,
        registrationNo: "KCA 123A",
        color: "Silver",
        seats: 5,
        transmission: "Automatic",
        fuelType: "Petrol",
        pricePerDay: 3500,
        images: [
          "/images/vehicles/corolla-1.jpg",
          "/images/vehicles/corolla-2.jpg",
        ],
        features: ["AC", "GPS", "Bluetooth", "USB Charging"],
        description:
          "Reliable and fuel-efficient sedan, perfect for city driving.",
        status: "AVAILABLE",
        locationId: "nairobi-loc",
        mileage: 45000,
      },
    }),
    prisma.vehicle.create({
      data: {
        name: "Honda CRV 2023",
        brand: "Honda",
        model: "CRV",
        year: 2023,
        registrationNo: "KCB 456B",
        color: "Black",
        seats: 7,
        transmission: "Automatic",
        fuelType: "Petrol",
        pricePerDay: 5500,
        images: ["/images/vehicles/crv-1.jpg"],
        features: ["AC", "GPS", "Bluetooth", "Leather Seats", "Sunroof"],
        description: "Spacious SUV ideal for family trips and road adventures.",
        status: "AVAILABLE",
        locationId: "nairobi-loc",
        mileage: 12000,
      },
    }),
    prisma.vehicle.create({
      data: {
        name: "Nissan X-Trail 2021",
        brand: "Nissan",
        model: "X-Trail",
        year: 2021,
        registrationNo: "KCC 789C",
        color: "White",
        seats: 7,
        transmission: "Automatic",
        fuelType: "Diesel",
        pricePerDay: 4800,
        images: ["/images/vehicles/xtrail-1.jpg"],
        features: ["AC", "GPS", "Bluetooth", "4WD"],
        description: "Powerful SUV with 4WD capability for any terrain.",
        status: "AVAILABLE",
        locationId: "kisumu-loc",
        mileage: 68000,
      },
    }),
    prisma.vehicle.create({
      data: {
        name: "Mazda Demio 2020",
        brand: "Mazda",
        model: "Demio",
        year: 2020,
        registrationNo: "KCD 234D",
        color: "Blue",
        seats: 5,
        transmission: "Manual",
        fuelType: "Petrol",
        pricePerDay: 2800,
        images: ["/images/vehicles/demio-1.jpg"],
        features: ["AC", "Bluetooth", "USB Charging"],
        description: "Compact and economical car, great for budget travelers.",
        status: "AVAILABLE",
        locationId: "mombasa-loc",
        mileage: 92000,
      },
    }),
    prisma.vehicle.create({
      data: {
        name: "Toyota Prado 2023",
        brand: "Toyota",
        model: "Land Cruiser Prado",
        year: 2023,
        registrationNo: "KCE 567E",
        color: "Pearl White",
        seats: 7,
        transmission: "Automatic",
        fuelType: "Diesel",
        pricePerDay: 8500,
        images: [
          "/images/vehicles/prado-1.jpg",
          "/images/vehicles/prado-2.jpg",
        ],
        features: [
          "AC",
          "GPS",
          "Bluetooth",
          "Leather Seats",
          "4WD",
          "Sunroof",
          "Cruise Control",
        ],
        description:
          "Premium SUV with luxury features and excellent off-road capability.",
        status: "AVAILABLE",
        locationId: "nairobi-loc",
        mileage: 8000,
      },
    }),
  ]);

  console.log(`✅ Created ${vehicles.length} vehicles`);

  // ============================================
  // 4. Create Admin User
  // ============================================
  console.log("👤 Creating admin user...");

  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@transport.com" },
    update: {},
    create: {
      email: "admin@transport.com",
      passwordHash: passwordHash,
      firstName: "Admin",
      lastName: "User",
      role: "super_admin",
      isActive: true,
    },
  });

  console.log("✅ Created admin user");
  console.log("   Email: admin@transport.com");
  console.log("   Password: admin123");

  // ============================================
  // 5. Create Sample Customer (Optional)
  // ============================================
  console.log("👥 Creating sample customer...");

  const customer = await prisma.customer.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+254712345678",
      address: "123 Sample Street",
      city: "Nairobi",
      country: "Kenya",
      drivingLicense: "DL123456789",
      licenseExpiry: new Date("2026-12-31"),
    },
  });

  console.log("✅ Created sample customer");

  console.log("\n🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
