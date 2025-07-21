import { NextResponse } from "next/server";
import { db } from "@/db";
import { auth } from "@/auth";
import { desc, eq, and, gte, lte } from "drizzle-orm";
import { userMaster } from "@/db/schema";
import { retailer } from "@/db/schema";
import { pointAllocationLog } from "@/db/schema";
import { redemptionRequest } from "@/db/schema";
import moment from "moment";

export async function GET(request: Request, context: { params: Promise<{ type: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await context.params;
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    let data;
    switch (type) {
      case "login":
        data = await db
          .select({
            id: userMaster.userId,
            username: userMaster.username,
            loginTime: userMaster.updatedAt,
          })
          .from(userMaster)
          .where(
            and(
              startDate ? gte(userMaster.updatedAt, new Date(startDate)) : undefined,
              endDate ? lte(userMaster.updatedAt, new Date(endDate)) : undefined
            )
          )
          .orderBy(desc(userMaster.updatedAt))
          .then((rows) =>
            rows.map((row) => ({
              ...row,
              loginTime: row.loginTime
                ? moment(row.loginTime).format('LLL')
                : null,
            }))
          );
        break;
      case "enrollment":
        data = await db
          .select({
            id: retailer.userId,
            username: retailer.shopName,
            mobileNumber: retailer.whatsappNo,
            enrolledAt: retailer.createdAt,
          })
          .from(retailer)
          .where(
            and(
              startDate ? gte(retailer.createdAt, new Date(startDate)) : undefined,
              endDate ? lte(retailer.createdAt, new Date(endDate)) : undefined
            )
          )
          .orderBy(desc(retailer.createdAt))
          .then((rows) =>
            rows.map((row) => ({
              ...row,
              enrolledAt: row.enrolledAt
                ? moment(row.enrolledAt).format('LLL')
                : null,
            }))
          );
        break;
      case "point-transfer":
        data = await db
          .select({
            id: pointAllocationLog.allocationId,
            username: userMaster.username,
            points: pointAllocationLog.pointsAllocated,
            transferDate: pointAllocationLog.allocationDate,
          })
          .from(pointAllocationLog)
          .innerJoin(userMaster, eq(pointAllocationLog.targetUserId, userMaster.userId))
          .where(
            and(
              startDate ? gte(pointAllocationLog.allocationDate, new Date(startDate)) : undefined,
              endDate ? lte(pointAllocationLog.allocationDate, new Date(endDate)) : undefined
            )
          )
          .orderBy(desc(pointAllocationLog.allocationDate))
          .then((rows) =>
            rows.map((row) => ({
              ...row,
              transferDate: row.transferDate
                ? moment(row.transferDate).format('LLL')
                : null,
            }))
          );
        break;
      case "claim":
        data = await db
          .select({
            id: redemptionRequest.requestId,
            username: userMaster.username,
            status: redemptionRequest.status,
            claimDate: redemptionRequest.requestDate,
          })
          .from(redemptionRequest)
          .innerJoin(userMaster, eq(redemptionRequest.userId, userMaster.userId))
          .where(
            and(
              startDate ? gte(redemptionRequest.requestDate, new Date(startDate)) : undefined,
              endDate ? lte(redemptionRequest.requestDate, new Date(endDate)) : undefined
            )
          )
          .orderBy(desc(redemptionRequest.requestDate))
          .then((rows) =>
            rows.map((row) => ({
              ...row,
              claimDate: row.claimDate
                ? moment(row.claimDate).format('LLL')
                : null,
            }))
          );
        break;
      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}