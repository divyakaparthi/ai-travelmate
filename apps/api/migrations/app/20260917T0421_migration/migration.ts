#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/66388f97820e64953e1f50afa17fb957ca92d07bc21c27fccc6b1eadbee01857/contract';
import startContract from '../../snapshots/66388f97820e64953e1f50afa17fb957ca92d07bc21c27fccc6b1eadbee01857/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/e56ce86a3661598fc699e646b47c1ac6949ebfa027f827e5eb0fb6f99dc75471/contract';
import endContract from '../../snapshots/e56ce86a3661598fc699e646b47c1ac6949ebfa027f827e5eb0fb6f99dc75471/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'itinerary',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('data', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('destination', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tripId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'itinerary',
        constraint: 'itinerary_tripId_key',
        columns: ['tripId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'itinerary',
        foreignKey: {
          name: 'itinerary_tripId_fkey',
          columns: ['tripId'],
          references: { schema: 'public', table: 'trip', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
