import { db } from "@/db";
import { userMaster } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: Promise<{ type: string }> }) {



  const { type } = await context.params;
try {
let data;
  switch (type) {
    
    case 'all':
        data = await db.select({id:userMaster.userId,username:userMaster.username,fcmToken:userMaster.fcmToken}).from(userMaster)
        break;
  case 'retailer':
        data = await db.select({id:userMaster.userId,username:userMaster.username,fcmToken:userMaster.fcmToken}).from(userMaster).where(eq(userMaster.userType,'retailer'))

        break;
        case 'distributor':
        data = await db.select({id:userMaster.userId,username:userMaster.username,fcmToken:userMaster.fcmToken}).from(userMaster).where(eq(userMaster.userType,'distributor'))
        break;
        case 'sales':
    data = await db.select({id:userMaster.userId,username:userMaster.username,fcmToken:userMaster.fcmToken}).from(userMaster).where(eq(userMaster.userType,'sales'))

        break;
    default:
        return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
  }
    return NextResponse.json(data);
 } catch (error) {
  console.error('Error fetching user list:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

}