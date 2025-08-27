import mongoose from 'mongoose';
import { achievementsData } from '../data/achievements/achievementsData.js';
import Achievement from '../models/Achievement.js';
import dbConnect from '../lib/db.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

console.log({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload images to Cloudinary
async function uploadImagesToCloudinary(imagePaths, eventName) {
  try {
    const uploadedUrls = [];
    
    for (let i = 0; i < imagePaths.length; i++) {
      const imagePath = imagePaths[i];
      
      // Check if image path is already a Cloudinary URL
      if (imagePath.startsWith('http') && imagePath.includes('cloudinary')) {
        console.log(`✓ Image already on Cloudinary: ${imagePath}`);
        uploadedUrls.push(imagePath);
        continue;
      }
      
      // Check if local image exists
      const publicPath = path.join(process.cwd(), 'public', imagePath);
      if (!fs.existsSync(publicPath)) {
        console.log(`⚠ Local image not found: ${publicPath}`);
        uploadedUrls.push(imagePath); // Keep original path if local image doesn't exist
        continue;
      }
      
      console.log(`📤 Uploading image to Cloudinary: ${imagePath}`);
      
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(publicPath, {
          folder: `grobots/achievements/${eventName.toLowerCase().replace(/\s+/g, '-')}`,
          public_id: `grobots-${eventName.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
          transformation: [
            { quality: "auto" },
            { fetch_format: "auto" }
          ]
        });
        
        console.log(`✓ Image uploaded to Cloudinary: ${result.secure_url}`);
        uploadedUrls.push(result.secure_url);
      } catch (error) {
        console.error(`❌ Error uploading image ${imagePath}:`, error.message);
        uploadedUrls.push(imagePath); // Keep original path if upload fails
      }
    }
    
    return uploadedUrls;
  } catch (error) {
    console.error(`❌ Error in uploadImagesToCloudinary for ${eventName}:`, error.message);
    return imagePaths; // Return original paths if upload fails
  }
}

// Function to seed or update achievements
async function seedAchievements() {
  try {
    console.log('🔌 Connecting to database...');
    await dbConnect();

    console.log('📊 Starting achievements seeding/update process...');

    const results = {
      created: 0,
      updated: 0,
      errors: 0
    };

    for (const achievementData of achievementsData) {
      try {
        console.log(`\n🔄 Processing: ${achievementData.nameOfEvent}`);

        // Upload images to Cloudinary
        const cloudinaryImageUrls = await uploadImagesToCloudinary(
          achievementData.images || [],
          achievementData.nameOfEvent
        );

        // Prepare achievement data
        const achievementDoc = {
          nameOfEvent: achievementData.nameOfEvent,
          location: achievementData.location,
          dateOfEvent: achievementData.dateOfEvent ? new Date(achievementData.dateOfEvent) : null,
          winningPosition: achievementData.winningPosition,
          prizeWon: achievementData.prizeWon || null,
          shortDescription: achievementData.shortDescription,
          longDescription: achievementData.longDescription,
          images: cloudinaryImageUrls,
          visibility: achievementData.visibility !== undefined ? achievementData.visibility : true,
        };

        // Check if achievement already exists (by name and location)
        const existingAchievement = await Achievement.findOne({
          nameOfEvent: achievementData.nameOfEvent,
          location: achievementData.location
        });

        if (existingAchievement) {
          // Update existing achievement
          await Achievement.findByIdAndUpdate(existingAchievement._id, achievementDoc, { new: true });
          console.log(`✓ Updated: ${achievementData.nameOfEvent} (${achievementData.location})`);
          results.updated++;
        } else {
          // Create new achievement
          await Achievement.create(achievementDoc);
          console.log(`✓ Created: ${achievementData.nameOfEvent} (${achievementData.location})`);
          results.created++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${achievementData.nameOfEvent}:`, error.message);
        results.errors++;
      }
    }

    // Display summary
    console.log('\n📈 Achievements Seeding Summary:');
    console.log(`✅ Created: ${results.created} achievements`);
    console.log(`🔄 Updated: ${results.updated} achievements`);
    console.log(`❌ Errors: ${results.errors} achievements`);
    console.log(`📊 Total processed: ${achievementsData.length} achievements`);

    // Display all achievements in database
    console.log('\n📋 Current Achievements in Database:');
    const allAchievements = await Achievement.find({}).sort({ dateOfEvent: -1 });
    allAchievements.forEach(achievement => {
      const date = achievement.dateOfEvent ? achievement.dateOfEvent.toLocaleDateString() : 'No date';
      const visibility = achievement.visibility ? '👁️ Visible' : '🙈 Hidden';
      console.log(`- ${achievement.nameOfEvent} - ${achievement.location} - ${date} - ${visibility}`);
    });

    console.log('\n🎉 Achievements seeding/update completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error in achievements seeding process:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedAchievements();
