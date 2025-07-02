import { NextResponse } from "next/server";
import { db } from "@/db";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { userMaster } from "@/db/schema";
import { retailer } from "@/db/schema";
import { pointAllocationLog } from "@/db/schema";
import { redemptionRequest } from "@/db/schema";

export async function GET(request: Request, context: { params: Promise<{ type: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await context.params;

  try {
    let data;
    switch (type) {
      case "login":
        data = await db
          .select()
          .from(userMaster)
          .leftJoin(retailer, eq(userMaster.userId, retailer.userId));
        break;
      case "enrollment":
        return
        data = await db
          .select({
            id: enrollments.id,
            username: users.username,
            courseName: enrollments.courseName,
            enrolledAt: enrollments.enrolledAt,
          })
          .from(enrollments)
          .leftJoin(users, eq(enrollments.userId, users.id));
        break;
      case "point-transfer":
        data = await db
          .select()
          .from(pointAllocationLog)
          
        break;
      case "claim":
        data = await db
          .select()
          .from(redemptionRequest)
          
        break;
      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}