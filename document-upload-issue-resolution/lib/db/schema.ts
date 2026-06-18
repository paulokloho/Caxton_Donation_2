import { pgTable, text, timestamp, serial } from 'drizzle-orm/pg-core'

export const donations = pgTable('donations', {
  id: serial('id').primaryKey(),
  donorName: text('donor_name'),
  donorEmail: text('donor_email'),
  receiptFileName: text('receipt_file_name').notNull(),
  receiptPathname: text('receipt_pathname').notNull(),
  receiptUrl: text('receipt_url'),
  amount: text('amount'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Donation = typeof donations.$inferSelect
export type NewDonation = typeof donations.$inferInsert
