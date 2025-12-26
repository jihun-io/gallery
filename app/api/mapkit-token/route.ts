import { SignJWT, importPKCS8 } from "jose";
import { NextRequest, NextResponse } from "next/server";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const teamId = process.env.MAPKIT_TEAM_ID;
    const keyId = process.env.MAPKIT_KEY_ID;
    const privateKey = process.env.MAPKIT_PRIVATE_KEY;

    if (!teamId || !keyId || !privateKey) {
      return NextResponse.json(
        { error: "MapKit credentials not configured" },
        { status: 500 }
      );
    }

    // Get origin from request headers or environment variable
    const requestOrigin = request.headers.get("origin");
    const origin = requestOrigin || process.env.NEXT_PUBLIC_SITE_URL || "https://gallery.jihun.io";

    // Import the private key
    const key = await importPKCS8(privateKey, "ES256");

    // Create JWT token with explicit timestamps to avoid server time issues
    const now = Math.floor(Date.now() / 1000);
    const token = await new SignJWT({
      origin: origin,
    })
      .setProtectedHeader({
        alg: "ES256",
        kid: keyId,
        typ: "JWT",
      })
      .setIssuer(teamId)
      .setIssuedAt(now)
      .setExpirationTime(now + 3600) // 1 hour in seconds
      .sign(key);

    return NextResponse.json(
      { token },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    console.error("MapKit token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate MapKit token" },
      { status: 500 }
    );
  }
}
