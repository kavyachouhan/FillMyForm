import { NextRequest, NextResponse } from "next/server";
import { Client, Databases, ID } from "appwrite";

interface LogEntry {
  url: string;
  formTitle?: string;
  questionCount?: number;
  timestamp: number;
  ip?: string;
  userAgent?: string;
}

// Initialize Appwrite client
function getAppwriteClient() {
  const client = new Client();

  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  return client;
}

// Extract client IP address from request headers
function getClientIp(request: NextRequest): string {
  // Check common headers for client IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // "x-forwarded-for" can contain multiple IPs, take the first one
    const ip = forwardedFor.split(",")[0].trim();
    return normalizeIp(ip);
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return normalizeIp(realIp);
  }

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return normalizeIp(cfIp);
  }

  const clientIp = request.headers.get("x-client-ip");
  if (clientIp) {
    return normalizeIp(clientIp);
  }

  return "127.0.0.1"; // Fallback to localhost
}

// Normalize IP address format
function normalizeIp(ip: string): string {
  // Trim whitespace
  ip = ip.trim();
  
  // Handle localhost representations
  if (ip === "::1" || ip === "::ffff:127.0.0.1") {
    return "127.0.0.1";
  }
  
  // Handle IPv4-mapped IPv6 addresses
  if (ip.startsWith("::ffff:")) {
    return ip.substring(7);
  }
  
  return ip;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, formTitle, questionCount, timestamp } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Get client IP and user agent
    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "unknown";

    const logEntry: LogEntry = {
      url,
      formTitle,
      questionCount,
      timestamp: timestamp || Date.now(),
      ip,
      userAgent,
    };

    // Save log entry to Appwrite database
    try {
      const client = getAppwriteClient();
      const databases = new Databases(client);

      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_LOGS_COLLECTION_ID!,
        ID.unique(),
        logEntry
      );

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error("Error saving to Appwrite:", dbError);

      // Even if logging fails, we return success to not block the user
      return NextResponse.json({
        success: true,
        warning: "Log saved with errors",
      });
    }
  } catch (error) {
    console.error("Error logging form URL:", error);
    return NextResponse.json(
      { error: "Failed to log form URL" },
      { status: 500 }
    );
  }
}