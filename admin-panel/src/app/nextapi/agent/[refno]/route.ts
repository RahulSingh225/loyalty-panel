import { NextResponse } from "next/server";
import { db } from "@/db";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { distributor, userMaster } from "@/db/schema";

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
      return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
    }

    const result = await db
      .select({
        distributorId: distributor.distributorId,
        userId: distributor.userId,
        distributorName: distributor.distributorName,
        contactPerson: distributor.contactPerson,
        phoneNumber: distributor.phoneNumber,
        email: distributor.email,
        address: distributor.address,
        city: distributor.city,
        state: distributor.state,
        zipCode: distributor.zipCode,
        gstNumber: distributor.gstNumber,
        navisionId: distributor.navisionId,
        createdAt: distributor.createdAt,
        totalPoints: distributor.totalPoints,
        balancePoints: distributor.balancePoints,
        consumedPoints: distributor.consumedPoints,
        salesPersonCode: distributor.salesPersonCode,
        username: userMaster.username,
        fcmToken: userMaster.fcmToken,
      })
      .from(distributor)
      .innerJoin(userMaster, eq(distributor.userId, userMaster.userId))
      .where(eq(distributor.navisionId, refno))
      .limit(1);

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching agent details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}