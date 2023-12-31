import { discordHeaders } from "@/lib/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<any>> {
  const modulePath = req.nextUrl.searchParams.get("modulePath");
  if (!modulePath) return new NextResponse(null, { status: 400 });

  const channel = req.nextUrl.searchParams.get("channel") ?? "canary";
  if (!["stable", "ptb", "canary"].includes(channel))
    return new NextResponse(null, { status: 400 });

  const res = await fetch(
    `https://${
      channel !== "stable" ? channel + "." : ""
    }discord.com/${modulePath.slice(1)}`,
    {
      next: {
        revalidate: 1200,
      },
      headers: discordHeaders,
    }
  );
  if (!res.ok) return new NextResponse(null, { status: 500 });

  return new NextResponse(res.body, {
    headers: {
      "content-type": res.headers.get("content-type")!,
      "cache-control": "public, max-age=1200",
    },
    status: res.status,
  });
}
