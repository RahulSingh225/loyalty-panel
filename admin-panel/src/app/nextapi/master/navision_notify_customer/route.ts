import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { navisionNotifyCustomer, retailer } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const navid = url.searchParams.get("navid") || null;

    const offset = Math.max(0, (page - 1) * limit);

    const whereClause = navid ? eq(navisionNotifyCustomer.no, navid) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(distinct ${navisionNotifyCustomer.no})` })
      .from(navisionNotifyCustomer)
      .where(whereClause)
      .then(r => (r[0]?.count as number) || 0);

    const rows = await db
      .select({
        no: navisionNotifyCustomer.no,
        name: navisionNotifyCustomer.name,
        whatsappNo: navisionNotifyCustomer.whatsappNo,
        whatsappNo2:navisionNotifyCustomer.whatsappNo2,
        onboarded: sql<boolean>`CASE WHEN EXISTS(SELECT 1 FROM ${retailer} WHERE ${retailer.navisionId} = ${navisionNotifyCustomer.no}) THEN true ELSE false END`,
      })
      .from(navisionNotifyCustomer)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ page, limit, total: countResult, data: rows });
  } catch (error) {
    console.error("navision_notify_customer API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
