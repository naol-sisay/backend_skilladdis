// fix-urls.js
const db = require('./config/db');

async function runFix() {
    console.log("Replacing fake video IDs with real ones...");
    
    // Map of Fake ID -> Real YouTube ID
    const replacements = {
        '0LNE5NNA6qg': 'Iiq4Sem9GPM',
        'jwNmEqJ05Cg': 'c9Wg6Cb_YlU',
        'mclKroW8kDU': '6ViGc5NgdSw',
        '0k1L2A-4Aig': 'yqOwuu9BRpc',
        'O1m_1Z3Q3gI': 'y7Ci_H9bYEk',
        'OezMavBqWX4': '1EPNYWeEf1U',
        'QZ2eM8rN6sY': 'c9Wg6Cb_YlU'
    };

    try {
        for (const [fake, real] of Object.entries(replacements)) {
            // Fix course thumbnails and primary videos
            await db.query(`UPDATE courses SET thumbnail_url = REPLACE(thumbnail_url, '${fake}', '${real}')`);
            await db.query(`UPDATE courses SET video_url = REPLACE(video_url, '${fake}', '${real}')`);
            
            // Fix the syllabus lessons so the player works
            await db.query(`UPDATE course_materials SET content = REPLACE(content, '${fake}', '${real}')`);
        }
        
        console.log("✅ SUCCESS: All fake YouTube IDs have been replaced with working ones!");
    } catch (error) {
        console.error("❌ ERROR:", error.message);
    } finally {
        process.exit();
    }
}

runFix();