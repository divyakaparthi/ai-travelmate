#!/usr/bin/env -S node

import type { Contract as Start } from "../../snapshots/03864294a543bdc756186de71e8b7c7618736a128bc8b649cb6999fffe20cfc0/contract";

import startContractJson from "../../snapshots/03864294a543bdc756186de71e8b7c7618736a128bc8b649cb6999fffe20cfc0/contract.json" with {
  type: "json",
};

import type { Contract as End } from "../../snapshots/66388f97820e64953e1f50afa17fb957ca92d07bc21c27fccc6b1eadbee01857/contract";

import endContractJson from "../../snapshots/66388f97820e64953e1f50afa17fb957ca92d07bc21c27fccc6b1eadbee01857/contract.json" with {
  type: "json",
};

import {
  Migration,
  MigrationCLI,
  col,
  fn,
  primaryKey,
  rawSql,
} from "@prisma/orm-postgres/migration";

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContractJson;

  override readonly endContractJson = endContractJson;

  override get operations() {
    return [
      // -----------------------------------------------------
      // 1. Create User table
      // -----------------------------------------------------

      this.createTable({
        schema: "public",
        table: "user",

        columns: [
          col("createdAt", "timestamptz", {
            notNull: true,
            default: fn("now()"),
            codecRef: {
              codecId: "pg/timestamptz-temporal@1",
            },
          }),

          col("email", "text", {
            notNull: true,
            codecRef: {
              codecId: "pg/text@1",
            },
          }),

          col("id", "text", {
            notNull: true,
            codecRef: {
              codecId: "pg/text@1",
            },
          }),

          col("password", "text", {
            notNull: true,
            codecRef: {
              codecId: "pg/text@1",
            },
          }),
        ],

        constraints: [primaryKey(["id"])],
      }),

      // -----------------------------------------------------
      // 2. Add userId to Trip
      // -----------------------------------------------------

      this.addColumn({
        schema: "public",
        table: "trip",

        column: col("userId", "text", {
          codecRef: {
            codecId: "pg/text@1",
          },
        }),
      }),

      // -----------------------------------------------------
      // 3. Create temporary/system user
      // -----------------------------------------------------

      rawSql({
        id: "backfill.create-system-user",
        label: "Create system user for existing trips",
        operationClass: "data",
        target: {
          id: "postgres",
        },

        precheck: [
          {
            description: "System user does not already exist",
            sql: `
              SELECT NOT EXISTS (
                SELECT 1
                FROM "public"."user"
                WHERE "id" = '00000000-0000-0000-0000-000000000001'
              )
            `,
          },
        ],

        execute: [
          {
            description: "Create system user",
            sql: `
              INSERT INTO "public"."user"
                ("id", "email", "password")
              VALUES
                (
                  '00000000-0000-0000-0000-000000000001',
                  'system@aitravelmate.local',
                  'migration-placeholder'
                )
            `,
          },
        ],

        postcheck: [
          {
            description: "System user exists",
            sql: `
              SELECT EXISTS (
                SELECT 1
                FROM "public"."user"
                WHERE "id" = '00000000-0000-0000-0000-000000000001'
              )
            `,
          },
        ],
      }),

      // -----------------------------------------------------
      // 4. Backfill existing trips
      // -----------------------------------------------------

      rawSql({
        id: "backfill.trip-userId",
        label: "Backfill existing trips with system user",
        operationClass: "data",
        target: {
          id: "postgres",
        },

        precheck: [
          {
            description: "Trips without userId exist",
            sql: `
              SELECT EXISTS (
                SELECT 1
                FROM "public"."trip"
                WHERE "userId" IS NULL
              )
            `,
          },
        ],

        execute: [
          {
            description: "Assign existing trips to system user",
            sql: `
              UPDATE "public"."trip"
              SET "userId" = '00000000-0000-0000-0000-000000000001'
              WHERE "userId" IS NULL
            `,
          },
        ],

        postcheck: [
          {
            description: "All trips have userId",
            sql: `
              SELECT NOT EXISTS (
                SELECT 1
                FROM "public"."trip"
                WHERE "userId" IS NULL
              )
            `,
          },
        ],
      }),

      // -----------------------------------------------------
      // 5. Make userId required
      // -----------------------------------------------------

      this.setNotNull({
        schema: "public",
        table: "trip",
        column: "userId",
      }),

      // -----------------------------------------------------
      // 6. Unique email
      // -----------------------------------------------------

      this.addUnique({
        schema: "public",
        table: "user",

        constraint: "user_email_key",

        columns: ["email"],
      }),

      // -----------------------------------------------------
      // 7. Index on Trip.userId
      // -----------------------------------------------------

      this.createIndex({
        schema: "public",
        table: "trip",

        index: "trip_userId_idx_a489d58a",

        columns: ["userId"],
      }),

      // -----------------------------------------------------
      // 8. Foreign key
      // -----------------------------------------------------

      this.addForeignKey({
        schema: "public",
        table: "trip",

        foreignKey: {
          name: "trip_userId_fkey",

          columns: ["userId"],

          references: {
            schema: "public",
            table: "user",
            columns: ["id"],
          },

          onDelete: "cascade",
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);