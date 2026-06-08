import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UserRole } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getStorageConfig } from "@/lib/storage";

type DownloadPayload = {
  licenseId?: unknown;
};

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "license-download",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const payload = (await req.json()) as DownloadPayload;
    const licenseId =
      typeof payload.licenseId === "string" ? payload.licenseId.trim() : "";

    if (!licenseId) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: [
            {
              field: "licenseId",
              message: "licenseId is required",
            },
          ],
        },
        { status: 400 }
      );
    }

    const actor = await prisma.user.findUnique({
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

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = actor.role === UserRole.ADMIN;
    const isOfficer = actor.role === UserRole.OFFICER && Boolean(actor.officer);

    if (!isAdmin && !isOfficer) {
      return NextResponse.json(
        { error: "Only admins or officer owners can access license documents." },
        { status: 403 }
      );
    }

    const license = await prisma.license.findFirst({
      where: isAdmin
        ? {
            id: licenseId,
          }
        : {
            id: licenseId,
            officerId: actor.officer?.id,
          },
      select: {
        id: true,
        documentKey: true,
      },
    });

    if (!license) {
      return NextResponse.json(
        { error: "License not found or you do not have access." },
        { status: 404 }
      );
    }

    if (!license.documentKey) {
      return NextResponse.json(
        { error: "License document not found." },
        { status: 404 }
      );
    }

    const storageConfig = getStorageConfig();

    const s3Client = new S3Client({
      region: storageConfig.region,
      endpoint: storageConfig.endpoint,
      forcePathStyle: storageConfig.forcePathStyle,
      credentials: {
        accessKeyId: storageConfig.accessKeyId,
        secretAccessKey: storageConfig.secretAccessKey,
      },
    });

    const downloadUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: storageConfig.bucket,
        Key: license.documentKey,
      }),
      {
        expiresIn: storageConfig.downloadPresignTtlSeconds,
      }
    );

    return NextResponse.json({
      downloadUrl,
      expiresInSeconds: storageConfig.downloadPresignTtlSeconds,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create download URL" },
      { status: 500 }
    );
  }
}
