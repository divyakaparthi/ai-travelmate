import "dotenv/config";
import { Temporal } from "@js-temporal/polyfill";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../prisma/contract.d";
import contractJson from "../../prisma/contract.json";

// Make Temporal available globally for Prisma PostgreSQL codecs.
(globalThis as typeof globalThis & {
  Temporal: typeof Temporal;
}).Temporal = Temporal;

const db = postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL!,
});

export default db;