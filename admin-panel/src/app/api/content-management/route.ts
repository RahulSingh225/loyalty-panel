
import { fileService } from '@/app/services/file.service';
import { auth } from '@/auth';
import { db } from '@/db';
import { contentManagement } from '@/db/schema';
import { randomUUID } from 'crypto';
import { asc, desc, eq, max } from "drizzle-orm";
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';
import Busboy from 'busboy';
import { Readable } from 'stream';

export async function GET() {

  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let data;
    data = await db
      .select({
        contentId: contentManagement.contentId,
        content: contentManagement.content,
        imagePdfUrl: contentManagement.imagePdfUrl,
        contentType: contentManagement.contentType,
        lastUpdatedAt: contentManagement.lastUpdatedAt,
      })
      .from(contentManagement)
      .orderBy(asc(contentManagement.contentId))
      .then((rows) =>
        rows.map((row) => ({
          ...row,
          lastUpdatedAt: row.lastUpdatedAt
            ? moment(row.lastUpdatedAt).format('LLL')
            : null,
        }))
      );
    console.log(data);
    const newData = await Promise.all(
          data.map(async (data) => {
            const signedUrl = data.imagePdfUrl
              ? await fileService.generateSignedUrl(`RANJIT/${data.contentType}/${data.imagePdfUrl}`)
              : null;
    
            return {
              ...data,
              contentResourceUrl: signedUrl,
            };
          })
        );
    console.log(newData)
    return NextResponse.json(newData);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

}


export async function POST(req: NextRequest) {

  const session = await auth();

  try {
    let data: any = [];
    const formData = await req.formData();
    const file = formData.get('file') as File;
    let fileUrl:any = "";
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = `uploads/${randomUUID()}-${file.name}`;
      fileUrl = await fileService.upload(buffer, filePath);
    }
    const [maxIdResult] = await db.select({ maxId: max(contentManagement.contentId) }).from(contentManagement);
    const nextContentId = (maxIdResult?.maxId ?? 0) + 1;
    console.log("vdsvdsc", fileUrl)
    await db.transaction(async (tran) => {
      // Step 2: Insert the new content
      await tran.insert(contentManagement).values({
        contentId: nextContentId,
        contentType: formData?.get("contentType") as string,
        content: formData?.get("content") as string,
        imagePdfUrl: fileUrl || "",
        // lastUpdatedAt: '', 
      });
    })


    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.log(error, "erOne")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }


}