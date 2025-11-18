import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import SingleOnboardService from "@/utils/onBoardService";

type OnboardType = "retailer" | "distributor" | "salesperson";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, navisionId } = body;

    if (!type || !navisionId) {
      return NextResponse.json(
        { error: "Missing type or navisionId" },
        { status: 400 }
      );
    }

    const validTypes: OnboardType[] = ["retailer", "distributor", "salesperson"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await SingleOnboardService.onboardSingle(type, navisionId);

    if (result.success) {
      return NextResponse.json({ success: true, ...result }, { status: 200 });
    } else {
        console.log("Onboard failed:", result);
      return NextResponse.json(
        { success: false, error: result.error || "Onboarding failed" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Onboard API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
