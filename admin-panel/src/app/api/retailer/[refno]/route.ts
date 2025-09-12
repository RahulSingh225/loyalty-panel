import { db } from '@/db';
import { retailer } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req, context) {
  const { params } = await context;
  const refno = params.refno;
  if (!refno) {
    return NextResponse.json({ error: 'Invalid retailer refno' }, { status: 400 });
  }
  try {
    const [result] = await db.select().from(retailer).where(eq(retailer.navisionId, refno));
    if (!result) {
      return NextResponse.json({ error: 'Retailer not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



