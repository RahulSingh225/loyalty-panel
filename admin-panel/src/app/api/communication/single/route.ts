import { firebaseService } from "@/app/services/firebase.service";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const session = await auth();  
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        console.log(body)
       const result = await firebaseService.sendNotification(body.payload, body.target);
       console.log(result)
        return NextResponse.json({ message: "success" });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }


}