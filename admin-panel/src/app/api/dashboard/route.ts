// app/api/dashboard/route.ts
import { db } from '@/db';
import { userMaster } from '@/db/schema';
import { count, eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

interface DashboardResponse {
  total_retailers: number;
  total_distributors: number;
  total_salesperson: number;
}

export async function GET() {
  try {
    // Use conditional aggregation with raw SQL for accurate counts
    const result = await db
      .select({
        total_retailers: sql<number>`count(case when ${userMaster.userType} = 'retailer' then 1 end)::integer`.mapWith(Number).as('total_retailers'),
        total_distributors: sql<number>`count(case when ${userMaster.userType} = 'distributor' then 1 end)::integer`.mapWith(Number).as('total_distributors'),
        total_salesperson: sql<number>`count(case when ${userMaster.userType} = 'sales' then 1 end)::integer`.mapWith(Number).as('total_salesperson'),
      })
      .from(userMaster);

    const [{ total_retailers, total_distributors, total_salesperson }] = result;

    const response: DashboardResponse = {
      total_retailers,
      total_distributors,
      total_salesperson,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard counts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}