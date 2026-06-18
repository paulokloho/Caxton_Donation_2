import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { donations } from '@/lib/db/schema'
import { desc, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get('limit') || '50'),
      100
    )
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(donations)

    const totalCount = countResult[0]?.count || 0

    // Get donations, most recent first
    const donationsList = await db
      .select({
        id: donations.id,
        donorName: donations.donorName,
        donorEmail: donations.donorEmail,
        receiptFileName: donations.receiptFileName,
        receiptPathname: donations.receiptPathname,
        amount: donations.amount,
        notes: donations.notes,
        createdAt: donations.createdAt,
      })
      .from(donations)
      .orderBy(desc(donations.createdAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      donations: donationsList,
      total: totalCount,
      limit,
      offset,
    })
  } catch (error) {
    console.error('[v0] List donations error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve donations' },
      { status: 500 }
    )
  }
}
