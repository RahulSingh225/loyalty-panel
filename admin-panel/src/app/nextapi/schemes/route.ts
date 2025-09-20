import { auth } from '@/auth';
import { db } from '@/db';
import { schemes } from '@/db/schema';
import { asc, max, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import Busboy from 'busboy';
import { Readable } from 'stream';
import { fileService } from '@/app/services/file.service';
import path from 'path';
import { randomUUID } from 'crypto';

// GET: Fetch all schemes with their details, including the new schemePreview field
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = await db
      .select({
        schemeId: schemes.schemeId,
        schemeName: schemes.schemeName,
        schemeResourcee: schemes.schemeResourcee,
        schemePreview: schemes.schemePreview, // Added new field
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
          schemeId: row.schemeId, // Ensure schemeId is numeric
          schemeResourceUrl: signedUrl,
        };
      })
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching schemes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create a new scheme with the new schemePreview field
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    // Extract form fields
    const schemeName = formData.get('schemeName') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const roles = JSON.parse(formData.get('roles') as string);
    const schemePreview = formData.get('schemePreview') as File;
    const file = formData.get('file') as File;
    

    
    
    // Validate required fields
    if (!schemeName || !startDate || !endDate || !roles) {
      return NextResponse.json(
        { error: 'Missing required fields: schemeName, startDate, endDate, or roles' },
        { status: 400 }
      );
    }

    // Validate main file
    if (!file) {
      return NextResponse.json(
        { error: 'A file (image or PDF) is required for schemeResourcee' },
        { status: 400 }
      );
    }

    // Validate file types
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Main file must be an image or PDF' },
        { status: 400 }
      );
    }

    if (schemePreview && !schemePreview.name.match(/\.(jpeg|jpg|png)$/i)) {
      console.error('Invalid preview file type:', schemePreview.type);
      return NextResponse.json(
        { error: 'Preview file must be a JPG or PNG' },
        { status: 400 }
      );
    }

    // Upload main file
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileKey = `RANJIT/SCHEME/${randomUUID()}-${schemeName}${path.extname(file.name)}`;
    const fileUrl = await fileService.upload(fileBuffer, fileKey);

    // Upload preview file (if provided)
    let previewFileUrl = schemePreview || '';
    let previewFileKey = '';
    if (schemePreview) {
      const previewBuffer = Buffer.from(await schemePreview.arrayBuffer());
      previewFileKey = `RANJIT/SCHEME/preview-${randomUUID()}-${schemeName}${path.extname(schemePreview.name)}`;
      previewFileUrl = await fileService.upload(previewBuffer, previewFileKey);
    }

    // Get next scheme ID
    const [maxIdResult] = await db.select({ maxId: max(schemes.schemeId) }).from(schemes);
    const nextSchemeId = (maxIdResult?.maxId ?? 0) + 1;

    // Insert scheme into database
    await db.insert(schemes).values({
      schemeId: nextSchemeId,
      schemeName,
      startDate,
      endDate,
      schemeResourcee: fileKey,
      schemePreview: previewFileKey || null, // Use uploaded preview URL or provided schemePreview
      applicableRoles: (roles), // Convert to integer array
      isActive: true,
    });

    return NextResponse.json({ message: 'Scheme created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete a scheme by schemeId
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const schemeId = Number(searchParams.get('schemeId'));
    if (!schemeId) {
      return NextResponse.json({ error: 'Invalid scheme ID' }, { status: 400 });
    }
    await db.delete(schemes).where(sql`scheme_id = ${schemeId}`);
    return NextResponse.json({ message: 'Scheme deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}