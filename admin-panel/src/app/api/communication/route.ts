import { auth } from '@/auth';
import { db } from '@/db';
import { notificationLog } from '@/db/schema';
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
return NextResponse.json({ message: "success" });
        await db.transaction(async (tran) => {
            const [maxIdResult] = await tran
                .select({ maxId: max(notificationLog.logId) })
                .from(notificationLog);

            const nextSchemeId = (maxIdResult?.maxId ?? 0) + 1;

            // Step 2: Insert the new scheme
            await tran.insert(notificationLog).values({
                logId: body?.logId,
                userId: body?.schemeName,
                templateId: body?.startDate,
                channelUsed: body?.endDate,
                messageContent: '', 
                sentStatus: [body.roles],
                sentAt: true,
                responseData
            });
        })

        return NextResponse.json({ message: "success" });
    } catch (error) {
        console.log(error, "eroro")
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}