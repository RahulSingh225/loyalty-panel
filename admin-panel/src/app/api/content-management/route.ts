

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
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const previewFile = formData.get('preview') as File; // Added preview file
    let fileUrl = "";
    let previewFileUrl = "";

    // Handle main file upload (image or PDF)
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = `RANJIT/${formData.get("contentType")}/${file.name}`;
      fileUrl = await fileService.upload(buffer, filePath);
    }

    // Handle preview image upload (JPG/PNG)
    let previewFilePath = "";
    if (previewFile) {
      const arrayBuffer = await previewFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
       previewFilePath = `RANJIT/${formData.get("contentType")}/${previewFile?.name}`;
      previewFileUrl = await fileService.upload(buffer, previewFilePath);
    }

    const [maxIdResult] = await db.select({ maxId: max(contentManagement.contentId) }).from(contentManagement);
    const nextContentId = (maxIdResult?.maxId ?? 0) + 1;

    await db.transaction(async (tran) => {
      await tran.insert(contentManagement).values({
        
        contentType: formData.get("contentType") as string,
        content: formData.get("content") as string,
        imagePdfUrl: file.name,
        preview: previewFile?.name || "", // Store preview image URL
      
      });
    });

    return NextResponse.json({ message: "Content created successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const contentId = Number(searchParams.get("contentId"));
    if (!contentId) {
      return NextResponse.json({ error: "Invalid content ID" }, { status: 400 });
    }
    await db.delete(contentManagement).where(eq(contentManagement.contentId, contentId));
    return NextResponse.json({ message: "Content deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}