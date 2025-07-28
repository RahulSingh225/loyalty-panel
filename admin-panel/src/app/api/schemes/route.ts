import { auth } from '@/auth';
import { db } from '@/db';
import { schemes } from '@/db/schema';
import { asc, desc, eq, max, sql } from "drizzle-orm";
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';
import Busboy from 'busboy';
import { Readable } from 'stream';
import { fileService } from '@/app/services/file.service';

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db
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
      .orderBy(asc(schemes.schemeId));

    const data = await Promise.all(
      rows.map(async (row) => {
        const signedUrl = row.schemeResourcee
          ? await fileService.generateSignedUrl(row.schemeResourcee)
          : null;

        return {
          ...row,
          schemeId: row.schemeId, // Don't format as date here – schemeId is numeric
          schemeResourceUrl: signedUrl,
        };
      })
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    const session = await auth();

    try {
        const formFields: Record<string, string> = {};
        let fileBuffer: Buffer | null = null;
        let fileNameFromClient: string = '';

        const busboy = Busboy({ headers: Object.fromEntries(req.headers) });

        const filePromise = new Promise<void>((resolve, reject) => {
            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                const chunks: Buffer[] = [];
                fileNameFromClient = filename;

                file.on('data', (chunk: Buffer) => {
                    chunks.push(chunk);
                });

                file.on('end', () => {
                    fileBuffer = Buffer.concat(chunks);
                    resolve();
                });

                file.on('error', (err: Error) => {
                    reject(err);
                });
            });

            busboy.on('field', (fieldname: string, val: string) => {
                formFields[fieldname] = val;
            });

            busboy.on('finish', resolve);
            busboy.on('error', reject);

            const reader = req.body?.getReader();
            const stream = new Readable({
                async read() {
                    if (!reader) return this.push(null);
                    const { done, value } = await reader.read();
                    if (done) return this.push(null);
                    this.push(value);
                },
            });

            stream.pipe(busboy);
        });

        await filePromise;

        // parse fields
        const { schemeName, startDate, endDate, roles } = formFields;

        // get next ID
        const [maxIdResult] = await db.select({ maxId: max(schemes.schemeId) }).from(schemes);
        const nextSchemeId = (maxIdResult?.maxId ?? 0) + 1;

        let fileKey = '';
        if (fileBuffer && schemeName) {
            const filePath = fileService.generateFilePath(`${nextSchemeId}_${schemeName}`, 'CLAIMS');
            fileKey = await fileService.upload(fileBuffer, filePath);
        }

        await db.insert(schemes).values({
            schemeId: nextSchemeId,
            schemeName,
            startDate,
            endDate,
            schemeResourcee: fileKey,
            applicableRoles: [roles], 
            isActive: true,
        });

        return NextResponse.json({ message: 'success' });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
