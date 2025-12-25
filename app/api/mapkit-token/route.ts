import { SignJWT, importPKCS8 } from "jose";
import { NextResponse } from "next/server";

export async function GET() {
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

    // Import the private key
    const key = await importPKCS8(privateKey, "ES256");

    // Create JWT token
    const token = await new SignJWT({})
      .setProtectedHeader({
        alg: "ES256",
        kid: keyId,
        typ: "JWT",
      })
      .setIssuer(teamId)
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(key);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("MapKit token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate MapKit token" },
      { status: 500 }
    );
  }
}
