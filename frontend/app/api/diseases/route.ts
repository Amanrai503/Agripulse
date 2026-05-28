import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    try {
        const result = await pool.query(
            `SELECT *
            FROM disease_library
            WHERE status = 'diseased'
            ORDER BY disease_name ASC`
        );
        return NextResponse.json({ diseases: result.rows });
    } catch (error) {
        console.error("API Route Error (Diseases):", error);
        const message = error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
