import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { navisionSalespersonList, salesperson } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

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

    const whereClause = navid ? eq(navisionSalespersonList.code, navid) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(distinct ${navisionSalespersonList.code})` })
      .from(navisionSalespersonList)
      .where(whereClause)
      .then(r => (r[0]?.count as number) || 0);

    const rows = await db
      .select({
        code: navisionSalespersonList.code,
        name: navisionSalespersonList.name,
        whatsappMobileNumber: navisionSalespersonList.whatsappMobileNumber,
        onboarded: sql<boolean>`CASE WHEN EXISTS(SELECT 1 FROM ${salesperson} WHERE ${salesperson.navisionId} = ${navisionSalespersonList.code}) THEN true ELSE false END`,
      })
      .from(navisionSalespersonList)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ page, limit, total: countResult, data: rows });
  } catch (error) {
    console.error("navision_salesperson_list API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
