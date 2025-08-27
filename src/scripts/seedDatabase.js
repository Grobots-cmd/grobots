import mongoose from 'mongoose';
import { teamData } from '../data/team/teamData.js';
import { achievementsData } from '../data/achievements/achievementsData.js'
import TeamMember from '../models/TeamMember.js';
import AchievementSchema from '../models/Achievement.js'
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


// Function to upload image to Cloudinary
async function uploadImageToCloudinary(imagePath, memberName, batch) {
  try {
    // Check if image path is already a Cloudinary URL
    if (imagePath.startsWith('http') && imagePath.includes('cloudinary')) {
      console.log(`✓ Image already on Cloudinary for ${memberName}`);
      return imagePath;
    }
    // Check if local image exists
    const publicPath = path.join(process.cwd(), 'public', imagePath);
    if (!fs.existsSync(publicPath)) {
      console.log(`⚠ Local image not found for ${memberName}: ${publicPath}`);
      return imagePath; // Return original path if local image doesn't exist
    }
    console.log(`📤 Uploading image to Cloudinary for ${memberName}...`);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(publicPath, {
      folder: `grobots/team-members/${batch}`,
      public_id: `grobots-${memberName.toLowerCase().replace(/\s+/g, '-')}`,
      transformation: [
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });
    console.log(`✓ Image uploaded to Cloudinary for ${memberName}: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading image for ${memberName}:`, error.message);
    return imagePath; // Return original path if upload fails
  }
}

// Function to seed or update team members
async function seedDatabase() {
  try {
    console.log('🔌 Connecting to database...');
    await dbConnect();

    console.log('📊 Starting team member seeding/update process...');

    const results = {
      created: 0,
      updated: 0,
      errors: 0
    };

    for (const memberData of teamData.leadership.members) {
      try {
        console.log(`\n🔄 Processing: ${memberData.name}`);

        // Upload image to Cloudinary
        const cloudinaryImageUrl = await uploadImageToCloudinary(
          memberData.image,
          memberData.name,
          memberData.batch
        );

        // Prepare member data
        const memberDoc = {
          name: memberData.name,
          role: memberData.role,
          department: memberData.department,
          bio: memberData.bio,
          image: cloudinaryImageUrl,
          skills: memberData.skills,
          achievements: memberData.achievements,
          social: memberData.social,
          isAlumni: memberData.isAlumni,
          batch: memberData.batch,
          isActive: true,
        };

        // Check if member already exists (by name and role)
        const existingMember = await TeamMember.findOne({
          name: memberData.name,
          role: memberData.role
        });

        if (existingMember) {
          // Update existing member
          await TeamMember.findByIdAndUpdate(existingMember._id, memberDoc, { new: true });
          console.log(`✓ Updated: ${memberData.name} (${memberData.role})`);
          results.updated++;
        } else {
          // Create new member
          await TeamMember.create(memberDoc);
          console.log(`✓ Created: ${memberData.name} (${memberData.role})`);
          results.created++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${memberData.name}:`, error.message);
        results.errors++;
      }
    }

    // Display summary
    console.log('\n📈 Seeding Summary:');
    console.log(`✅ Created: ${results.created} members`);
    console.log(`🔄 Updated: ${results.updated} members`);
    console.log(`❌ Errors: ${results.errors} members`);
    console.log(`📊 Total processed: ${teamData.leadership.members.length} members`);

    // Display all team members in database
    console.log('\n📋 Current Team Members in Database:');
    const allMembers = await TeamMember.find({}).sort({ name: 1 });
    allMembers.forEach(member => {
      const status = member.isAlumni ? '👨‍🎓 Alumni' : '👨‍💼 Current';
      const batch = member.batch ? `(Batch: ${member.batch})` : '';
      console.log(`- ${member.name} - ${member.role} - ${status} ${batch}`);
    });

    console.log('\n🎉 Database seeding/update completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error in seeding process:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();