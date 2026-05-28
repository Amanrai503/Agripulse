import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const farmerId = formData.get("farmer_id");
        const cropType = formData.get("crop_type");

        // 1. Save image locally
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}_${file.name}`;
        const filepath = path.join(process.cwd(), "public/uploads", filename);
        await writeFile(filepath, buffer);
        const imageUrl = `/uploads/${filename}`;

        // 2. Send image to FastAPI
        const mlFormData = new FormData();
        mlFormData.append("file", file);
        
        // reads from environment variable, falls back to localhost for local dev
        const ML_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

        const mlResponse = await fetch(`${ML_URL}/predict`, {
            method: "POST",
            body: mlFormData,
        });
        
        if (!mlResponse.ok) {
            const errorText = await mlResponse.text();
            throw new Error(`FastAPI Error: ${mlResponse.status} ${errorText}`);
        }
        
        const { disease, confidence } = await mlResponse.json();

        // 3. Ensure valid farmer_id
        let validFarmerId = farmerId;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(validFarmerId)) {
            let farmerResult = await pool.query('SELECT farmer_id FROM farmers LIMIT 1');
            if (farmerResult.rows.length === 0) {
                farmerResult = await pool.query(
                    'INSERT INTO farmers (name, contact_info) VALUES ($1, $2) RETURNING farmer_id',
                    ['Demo Farmer', 'demo@example.com']
                );
            }
            validFarmerId = farmerResult.rows[0].farmer_id;
        }

        // 4. Get disease_id and details from disease_library
        const diseaseResult = await pool.query(
            `SELECT disease_id, description, symptoms, solution, severity FROM disease_library WHERE disease_name = $1`,
            [disease]
        );
        const diseaseInfo = diseaseResult.rows[0] || null;
        const diseaseId = diseaseInfo?.disease_id ?? null;

        // 5. Extract Crop Type from disease name using known keywords
        let finalCropType = cropType;
        if (!finalCropType || finalCropType === "Unknown") {
            if (disease) {
                const knownCrops = [
                    'Apple', 'Blueberry', 'Cherry', 'Corn', 'Grape', 
                    'Orange', 'Peach', 'Bell Pepper', 'Potato', 'Raspberry', 
                    'Soybean', 'Squash', 'Strawberry', 'Tomato'
                ];
                
                const lowerDisease = disease.toLowerCase();
                const matchedCrop = knownCrops.find(c => lowerDisease.includes(c.toLowerCase()));
                
                if (matchedCrop) {
                    finalCropType = matchedCrop;
                }
            }
        }

        // 6. Insert into scans table
        const scanResult = await pool.query(
            `INSERT INTO scans (farmer_id, crop_type, image_url, detected_disease_id, confidence_score)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [validFarmerId, finalCropType, imageUrl, diseaseId, confidence / 100]
        );

        return NextResponse.json({
            scan: scanResult.rows[0],
            disease,
            confidence,
            image_url: imageUrl,
            severity: diseaseInfo?.severity || 'None',
            description: diseaseInfo?.description || 'No description available for this disease.',
            symptoms: diseaseInfo?.symptoms || 'No symptoms recorded.',
            solution: diseaseInfo?.solution || `No specific solution found for ${disease}. Please consult an agricultural expert.`,
        });
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}

export async function GET() {
    const result = await pool.query(
        `SELECT 
            s.scan_id,
            s.farmer_id,
            f.name AS farmer_name,
            s.crop_type,
            s.image_url,
            d.disease_name,
            d.status,
            d.severity,
            s.confidence_score,
            s.scanned_at
        FROM scans s
        LEFT JOIN disease_library d ON s.detected_disease_id = d.disease_id
        LEFT JOIN farmers f ON s.farmer_id = f.farmer_id
        ORDER BY s.scanned_at DESC`
    );

    return NextResponse.json({ scans: result.rows });
}
