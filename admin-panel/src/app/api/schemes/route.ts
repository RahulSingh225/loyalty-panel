import { auth } from '@/auth';
import { db } from '@/db';
import { schemes } from '@/db/schema';
import { asc, desc, eq, max, sql } from "drizzle-orm";
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
                schemeId: schemes.schemeId,
                schemeName: schemes.schemeName,
                schemeResourcee: schemes.schemeResourcee,
                isActive: schemes.isActive,
                applicableRoles: schemes.applicableRoles,
                startDate: schemes.startDate,
                endDate: schemes.endDate,
                createdAt: schemes.createdAt,
            })
            .from(schemes)
            .orderBy(asc(schemes.schemeId))
            .then((rows) =>
                rows.map((row) => ({
                    ...row,
                    schemeId: row.schemeId
                        ? moment(row.schemeId).format('LLL')
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

        await db.transaction(async (tran) => {
            const [maxIdResult] = await tran
                .select({ maxId: max(schemes.schemeId) })
                .from(schemes);

            const nextSchemeId = (maxIdResult?.maxId ?? 0) + 1;

            // Step 2: Insert the new scheme
            await tran.insert(schemes).values({
                schemeId: nextSchemeId,
                schemeName: body?.schemeName,
                startDate: body?.startDate,
                endDate: body?.endDate,
                schemeResourcee: '', 
                applicableRoles: [body.roles],
                isActive: true,
            });
        })

        return NextResponse.json({ message: "success" });
    } catch (error) {
        console.log(error, "eroro")
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}
