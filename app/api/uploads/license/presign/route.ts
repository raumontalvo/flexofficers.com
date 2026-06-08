import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getStorageConfig } from "@/lib/storage";
import { parseLicenseUploadPayload } from "../validation";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "license-upload-presign",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const payload = (await req.json()) as {
      licenseId?: unknown;
      fileName?: unknown;
      fileType?: unknown;
      fileSizeBytes?: unknown;
    };

    const parsed = parseLicenseUploadPayload(payload);

    if ("errors" in parsed) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: parsed.errors,
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
      select: {
        role: true,
        officer: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user || user.role !== UserRole.OFFICER || !user.officer) {
      return NextResponse.json(
        { error: "Only officer accounts can upload license documents." },
        { status: 403 }
      );
    }

    const license = await prisma.license.findFirst({
      where: {
        id: parsed.data.licenseId,
        officerId: user.officer.id,
      },
      select: {
        id: true,
      },
    });

    if (!license) {
      return NextResponse.json(
        { error: "License not found or you do not own this license." },
        { status: 404 }
      );
    }

    const storageConfig = getStorageConfig();
    const objectKey = parsed.data.createObjectKey(user.officer.id);

    const s3Client = new S3Client({
      region: storageConfig.region,
      endpoint: storageConfig.endpoint,
      forcePathStyle: storageConfig.forcePathStyle,
      credentials: {
        accessKeyId: storageConfig.accessKeyId,
        secretAccessKey: storageConfig.secretAccessKey,
      },
    });

    const uploadCommand = new PutObjectCommand({
      Bucket: storageConfig.bucket,
      Key: objectKey,
      ContentType: parsed.data.fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, uploadCommand, {
      expiresIn: storageConfig.uploadPresignTtlSeconds,
    });

    return NextResponse.json({
      uploadUrl,
      objectKey,
      expiresInSeconds: storageConfig.uploadPresignTtlSeconds,
      requiredHeaders: {
        "Content-Type": parsed.data.fileType,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create upload URL" },
      { status: 500 }
    );
  }
}
