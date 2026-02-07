import fs from 'fs';
import path from 'path';

// --- HYBRID DB CONFIGURATION ---
const rawUrl = process.env.DATABASE_URL || "";
const isCloudDB = rawUrl.includes("postgres") || rawUrl.includes("supabase");

const DB_PATH = path.join(process.cwd(), 'data.json');

console.log(`[DB INIT] Mode: ${isCloudDB ? 'CLOUD (Prisma)' : 'LOCAL (JSON)'}`);

// --- PRISMA SETUP (Dynamic) ---
let _prisma: any = null;
const getPrisma = async () => {
  if (!_prisma) {
    try {
      // DYNAMIC IMPORT to prevent crash if @prisma/client is missing/broken locally
      const { PrismaClient } = await import('@prisma/client');
      _prisma = new PrismaClient();
    } catch (e) {
      console.error("Prisma Initialization Failed, falling back to JSON");
      return null;
    }
  }
  return _prisma;
};

// --- JSON DB MOCK ---
function initJSONDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      menuItems: [
        { id: 1, name: 'Masala Dosa', price: 60, prepTime: 5, category: 'South Indian' },
        { id: 2, name: 'Idli Vada', price: 40, prepTime: 2, category: 'South Indian' },
        { id: 3, name: 'Veg Noodles', price: 80, prepTime: 8, category: 'Chinese' },
        { id: 4, name: 'Fried Rice', price: 80, prepTime: 8, category: 'Chinese' },
        { id: 5, name: 'Tea', price: 15, prepTime: 1, category: 'Beverages' },
        { id: 6, name: 'Coffee', price: 20, prepTime: 1, category: 'Beverages' },
        { id: 7, name: 'Samosa', price: 20, prepTime: 0, category: 'Snacks' },
        { id: 8, name: 'Sandwich', price: 50, prepTime: 4, category: 'Snacks' },
      ],
      orders: [],
      orderItems: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  }
}

function readJSONDB() {
  try {
    if (!fs.existsSync(DB_PATH)) { initJSONDB(); }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error("JSON Read Error:", e);
    return { menuItems: [], orders: [], orderItems: [] };
  }
}

function writeJSONDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) { }
}

// --- EXPORTED HYBRID CLIENT ---
export const db = {
  menuItem: {
    findMany: async (args?: any) => {
      if (isCloudDB) {
        const client = await getPrisma();
        if (client) return client.menuItem.findMany(args);
      }

      const data = readJSONDB();
      let items = data.menuItems;
      if (args?.where?.id?.in) {
        items = items.filter((i: any) => args.where.id.in.includes(i.id));
      }
      return items;
    },
    findUnique: async (args: any) => {
      if (isCloudDB) {
        const client = await getPrisma();
        if (client) return client.menuItem.findUnique(args);
      }
      const data = readJSONDB();
      return data.menuItems.find((i: any) => i.id === args.where.id);
    }
  },
  order: {
    findMany: async (args?: any) => {
      if (isCloudDB) {
        const client = await getPrisma();
        if (client) return client.order.findMany(args);
      }

      const data = readJSONDB();
      let orders = data.orders;

      if (args?.where?.status?.in) {
        orders = orders.filter((o: any) => args.where.status.in.includes(o.status));
      }

      if (args?.include?.items) {
        orders = orders.map((o: any) => ({
          ...o,
          items: data.orderItems
            .filter((oi: any) => oi.orderId === o.id)
            .map((oi: any) => ({
              ...oi,
              menuItem: data.menuItems.find((mi: any) => mi.id === oi.menuItemId)
            }))
        }));
      }

      return orders.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    },
    create: async (args: any) => {
      if (isCloudDB) {
        const client = await getPrisma();
        if (client) return client.order.create(args);
      }

      const data = readJSONDB();
      const newId = (data.orders.length > 0 ? Math.max(...data.orders.map((o: any) => o.id)) : 1000) + 1;
      const { items: itemsField, ...orderFields } = args.data;

      const newOrder = {
        id: newId,
        ...orderFields,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      data.orders.push(newOrder);

      const itemsToCreate = itemsField?.create || [];
      let orderItemId = (data.orderItems.length > 0 ? Math.max(...data.orderItems.map((i: any) => i.id)) : 0) + 1;

      const newOrderItems = itemsToCreate.map((item: any) => ({
        id: orderItemId++,
        orderId: newId,
        menuItemId: item.menuItemId,
        quantity: item.quantity
      }));

      data.orderItems.push(...newOrderItems);
      writeJSONDB(data);

      return {
        ...newOrder,
        items: newOrderItems
      };
    },
    update: async (args: any) => {
      if (isCloudDB) {
        const client = await getPrisma();
        if (client) return client.order.update(args);
      }

      const data = readJSONDB();
      const index = data.orders.findIndex((o: any) => o.id === args.where.id);
      if (index === -1) throw new Error("Order not found");

      data.orders[index] = { ...data.orders[index], ...args.data, updatedAt: new Date().toISOString() };
      writeJSONDB(data);
      return data.orders[index];
    },
    count: async (args: any) => {
      if (isCloudDB) {
        const client = await getPrisma();
        if (client) return client.order.count(args);
      }
      const data = readJSONDB();
      let orders = data.orders;
      if (args?.where?.status?.in) {
        orders = orders.filter((o: any) => args.where.status.in.includes(o.status));
      }
      return orders.length;
    }
  }
};

export default db;
