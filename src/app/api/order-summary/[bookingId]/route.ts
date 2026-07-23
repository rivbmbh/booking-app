import { auth } from "@/auth";
import { generateOrderSummaryPdf } from "@/lib/pdf/generateOrderSummaryPdf";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ bookingId: string }> } 
    ) => {
    try {
        // Pastikan hanya admin yang bisa akses endpoint ini
        const session = await auth();
        if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
         const { bookingId } = await params; // 

        const { pdfBuffer } = await generateOrderSummaryPdf(bookingId);
        const pdfBytes = new Uint8Array(pdfBuffer);

        return new NextResponse(pdfBytes, {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="order-summary-${bookingId}.pdf"`,
        },
        });
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        return NextResponse.json(
        { error: "Failed to generate order summary" },
        { status: 500 }
        );
    }
};