import { firebaseService } from '@/app/services/firebase.service';
import { auth } from '@/auth';
import { db } from '@/db';
import { notificationLog, userMaster } from '@/db/schema';
import { desc, eq, max } from "drizzle-orm";
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {

    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        let data;
        data = await db
            .select({
                logId: notificationLog.logId,
                userId: notificationLog.userId,
                templateId: notificationLog.templateId,
                channelUsed: notificationLog.channelUsed,
                messageContent: notificationLog.messageContent,
                sentStatus: notificationLog.sentStatus,
                sentAt: notificationLog.sentAt,
                responseData: notificationLog.responseData,
            })
            .from(notificationLog)
            .orderBy(desc(notificationLog.sentAt))
            .then((rows) =>
                rows.map((row) => ({
                    ...row,
                    sentAt: row.sentAt
                        ? moment(row.sentAt).format('LLL')
                        : null,
                }))
            );
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}

export async function POST(req: NextRequest) {

    const session = await auth();
    // if (!session?.user || session.user.role !== "admin") {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    try {
        let data: any = [];

        const body = await req.json();
        console.log(body)
        let tokens;
        
        switch (body.target.type) {
            case 'retailer':
                 tokens = await db.select({ tokens: userMaster.fcmToken }).from(userMaster).where(eq(userMaster.userType, 'retailer'));
                 tokens = tokens.map((item) => item.tokens);
                 console.log(tokens, "tokens")
                            await firebaseService.sendNotification(body.payload,{ tokens:tokens,type:'all' })
                break;
         case 'distributor':
              tokens = await db.select({ tokens: userMaster.fcmToken }).from(userMaster).where(eq(userMaster.userType, 'distributor'));
                               tokens = tokens.map((item) => item.tokens);
                              await firebaseService.sendNotification(body.payload,{ tokens:tokens,type:'all' })

                break;

                 case 'sales':
               tokens = await db.select({ tokens: userMaster.fcmToken }).from(userMaster).where(eq(userMaster.userType, 'sales'));
                                tokens = tokens.map((item) => item.tokens);
                               await firebaseService.sendNotification(body.payload,{ tokens:tokens,type:'all' })

                break;
                case 'all':
                   tokens = await db.select({ tokens: userMaster.fcmToken }).from(userMaster);
                                    tokens = tokens.map((item) => item.tokens);
                                   await firebaseService.sendNotification(body.payload,{ tokens:tokens,type:'all' })

                   break;
            case 'single':
                break;
            default:
                break;
        }

        

return NextResponse.json({ message: "success" });
        
        return NextResponse.json({ message: "success" });
    } catch (error) {
        console.log(error, "eroro")
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}