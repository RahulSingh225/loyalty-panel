import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  navisionNotifyCustomer,
  navisionSalespersonList,
  navisionVendorMaster,
  navisionCustomerMaster,
  navisionRetailMaster,
  retailer,
  distributor,
  salesperson,
} from "@/db/schema";

function escapeCsv(value: any) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const master = url.searchParams.get("master");
    const navid = url.searchParams.get("navid") || null;

    if (!master) {
      return NextResponse.json({ error: "Missing master parameter" }, { status: 400 });
    }

    let rows: any[] = [];
    let onboardSet = new Set<string>();
    let idField = "no";

    if (master === "navision_notify_customer") {
      rows = await db.select().from(navisionNotifyCustomer).where(navid ? navisionNotifyCustomer.no.eq(navid) : undefined);
      const ids = (await db.select({ id: retailer.navisionId }).from(retailer)).map(r => r.id).filter(Boolean);
      onboardSet = new Set(ids);
      idField = "no";
    } else if (master === "navision_salesperson_list") {
      rows = await db.select().from(navisionSalespersonList).where(navid ? navisionSalespersonList.code.eq(navid) : undefined);
      const ids = (await db.select({ id: salesperson.navisionId }).from(salesperson)).map(r => r.id).filter(Boolean);
      onboardSet = new Set(ids);
      idField = "code";
    } else if (master === "navision_vendor_master") {
      rows = await db.select().from(navisionVendorMaster).where(navid ? navisionVendorMaster.no.eq(navid) : undefined);
      const ids = (await db.select({ id: distributor.navisionId }).from(distributor)).map(r => r.id).filter(Boolean);
      onboardSet = new Set(ids);
      idField = "no";
    } else if (master === "navision_customer_master") {
      rows = await db.select().from(navisionCustomerMaster).where(navid ? navisionCustomerMaster.no.eq(navid) : undefined);
      const ids = (await db.select({ id: retailer.navisionId }).from(retailer)).map(r => r.id).filter(Boolean);
      onboardSet = new Set(ids);
      idField = "no";
    } else if (master === "navision_retail_master") {
      rows = await db.select().from(navisionRetailMaster).where(navid ? navisionRetailMaster.no.eq(navid) : undefined);
      const ids = (await db.select({ id: retailer.navisionId }).from(retailer)).map(r => r.id).filter(Boolean);
      onboardSet = new Set(ids);
      idField = "no";
    } else {
      return NextResponse.json({ error: "Unknown master" }, { status: 400 });
    }

    // attach onboarded flag
    const processed = rows.map(r => ({ ...r, onboarded: !!onboardSet.has(String(r[idField])) }));

    if (processed.length === 0) {
      return NextResponse.json({ page: 1, total: 0, data: [] });
    }

    // build CSV
    const headers = Object.keys(processed[0]);
    const csvRows = [headers.join(",")];
    for (const row of processed) {
      const line = headers.map(h => escapeCsv(row[h]));
      csvRows.push(line.join(","));
    }

    const csv = csvRows.join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${master}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
