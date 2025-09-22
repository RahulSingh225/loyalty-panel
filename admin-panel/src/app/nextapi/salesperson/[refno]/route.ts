import { NextResponse } from "next/server";
import { db } from "@/db";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { salesperson, userMaster } from "@/db/schema";

export async function GET(
  request: Request,
  context: { params: { refno: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { refno } = context.params;
    if (!refno) {
      return NextResponse.json({ error: "Salesperson ID is required" }, { status: 400 });
    }

    const result = await db
      .select({
        salespersonId: salesperson.salespersonId,
        userId: salesperson.userId,
        salespersonName: salesperson.salespersonName,
        distributorId: salesperson.distributorId,
        navisionId: salesperson.navisionId,
        createdAt: salesperson.createdAt,
        updatedAt: salesperson.updatedAt,
        address: salesperson.address,
        address2: salesperson.address2,
        city: salesperson.city,
        state: salesperson.state,
        pinCode: salesperson.pinCode,
        mobileNumber: salesperson.mobileNumber,
        username: userMaster.username,
        email: userMaster.email,
        fcmToken: userMaster.fcmToken,
      })
      .from(salesperson)
      .innerJoin(userMaster, eq(salesperson.userId, userMaster.userId))
      .where(eq(salesperson.navisionId, refno))
      .limit(1);

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Salesperson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching salesperson details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}