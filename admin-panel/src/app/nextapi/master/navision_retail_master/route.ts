import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { navisionRetailMaster, retailer } from "@/db/schema";
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

    const whereClause = navid ? eq(navisionRetailMaster.no, navid) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(distinct ${navisionRetailMaster.no})` })
      .from(navisionRetailMaster)
      .where(whereClause)
      .then(r => (r[0]?.count as number) || 0);

    const rows = await db
      .select({
        no: navisionRetailMaster.no,
        name: navisionRetailMaster.shopName,
        whatsappNo: navisionRetailMaster.whatsappNo,
        whatsappNo2:navisionRetailMaster.whatsappNo2,
        onboarded: sql<boolean>`CASE WHEN EXISTS(SELECT 1 FROM ${retailer} WHERE ${retailer.navisionId} = ${navisionRetailMaster.no}) THEN true ELSE false END`,
      })
      .from(navisionRetailMaster)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ page, limit, total: countResult, data: rows });
  } catch (error) {
    console.error("navision_retail_master API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
