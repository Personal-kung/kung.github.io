import { db, storage } from './firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

async function migrateToProduction() {
    console.log("🚀 Starting Production Migration...");

    const response = await fetch('./test.json');
    const projects = await response.json();
    
    // Handles both object and array root structures
    const projectArray = Array.isArray(projects) ? projects : projects.projects;

    for (const project of projectArray) {
        try {
            console.log(`Processing: ${project.title.en}`);

            // 1. Upload Profile Image
            let cloudProfileURL = "";
            if (project.profile_image) {
                cloudProfileURL = await uploadToStorage(project.profile_image);
            }

            // 2. Upload Secondary Images Array
            let cloudImagesArray = [];
            if (project.images && project.images.length > 0) {
                for (const localPath of project.images) {
                    const url = await uploadToStorage(localPath);
                    cloudImagesArray.push(url);
                }
            }

            // 3. Save to Firestore (Preserving your multilingual schema)
            // Using ID from JSON as the Document Name for consistency
            const projectID = project.id.toString(); 
            
            await setDoc(doc(db, "projects", projectID), {
                ...project,
                profile_image: cloudProfileURL,
                images: cloudImagesArray,
                updatedAt: new Date().toISOString()
            });

            console.log(`✅ Fully Migrated: ${project.title.en}`);

        } catch (err) {
            console.error(`❌ Migration Error for ID ${project.id}:`, err);
        }
    }
    console.log("--- All data is now live on Firebase ---");
}

// Helper function for the "Double Upload"
async function uploadToStorage(localPath) {
    const imgResponse = await fetch(localPath);
    const blob = await imgResponse.blob();
    const fileName = localPath.split('/').pop();
    
    // Organizing by timestamp to prevent naming collisions
    const storageRef = ref(storage, `portfolio/${Date.now()}-${fileName}`);
    
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
}