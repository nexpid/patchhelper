import { NextRequest, NextResponse } from "next/server";
import { BuildAPIResponse } from "./types";
import { discordHeaders } from "@/lib/headers";

export async function GET(
  req: NextRequest
): Promise<NextResponse<BuildAPIResponse>> {
  const channel = req.nextUrl.searchParams.get("channel") ?? "canary";
  if (!["stable", "ptb", "canary"].includes(channel))
    return new NextResponse(null, { status: 400 });

  const dcRes = await fetch(
    `https://${channel !== "stable" ? channel + "." : ""}discord.com/app`,
    {
      next: {
        revalidate: 1200,
      },
      headers: discordHeaders,
    }
  );
  if (!dcRes.ok) return new NextResponse(null, { status: 500 });

  const html = await dcRes.text();
  const modules =
    html
      .match(/<script src="(.+?)" defer>/g)
      ?.map((x) => x.match(/"(.+?)"/)?.[1]!)
      .filter((x) => !!x) ?? [];
  const build = html.match(/"buildId":"(.+?)"/)?.[1]!;

  if (!modules[0] || !build) new NextResponse(null, { status: 500 });

  return NextResponse.json(
    {
      build: `${channel} (${build.slice(0, 7)})`,
      modules,
    },
    {
      headers: {
        "cache-control": "public, max-age=1200",
      },
    }
  );
}
