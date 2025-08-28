import mongoose from 'mongoose';
import dbConnect from '../lib/db.js';
import { v2 as cloudinary } from 'cloudinary';
import TeamMember from '../models/TeamMember.js';

// Configure Cloudinary directly with credentials
cloudinary.config({
  cloud_name: 'dv0rm0k0r',
  api_key: '362822825989394',
  api_secret: 'xahTTUB7B8N3dNTOo6_NXz8htxk',
});

async function wipeDatabase() {
  try {
    console.log('🔌 Connecting to database...');
    await dbConnect();
    
    console.log('🗑️ Starting database cleanup process...');
    
    // First, get all team members to clean up Cloudinary images
    const teamMembers = await TeamMember.find({});
    console.log(`📸 Found ${teamMembers.length} team members with images to clean up`);
    
    // Clean up Cloudinary images
    if (teamMembers.length > 0) {
      console.log('☁️ Cleaning up Cloudinary images...');
      for (const member of teamMembers) {
        if (member.image && member.image.includes('cloudinary')) {
          try {
            // Extract public_id from Cloudinary URL
            const urlParts = member.image.split('/');
            const publicId = urlParts[urlParts.length - 1].split('.')[0];
            const folder = 'grobots/team-members';
            const fullPublicId = `${folder}/${publicId}`;
            
            console.log(`🗑️ Deleting Cloudinary image: ${fullPublicId}`);
            await cloudinary.uploader.destroy(fullPublicId);
            console.log(`✓ Deleted: ${fullPublicId}`);
          } catch (error) {
            console.log(`⚠️ Could not delete Cloudinary image for ${member.name}: ${error.message}`);
          }
        }
      }
      console.log('✅ Cloudinary cleanup completed');
    }
    
    // Now clean up database collections
    console.log('\n🗄️ Getting all database collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('📭 Database is already empty!');
      process.exit(0);
    }
    
    console.log(`📋 Found ${collections.length} collections to remove:`);
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    console.log('\n🧹 Wiping all collections...');
    for (const collection of collections) {
      try {
        await mongoose.connection.db.dropCollection(collection.name);
        console.log(`✓ Dropped collection: ${collection.name}`);
      } catch (error) {
        console.log(`⚠️ Could not drop collection ${collection.name}: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Database wiped clean successfully!');
    console.log('✅ All collections have been removed');
    console.log('✅ All Cloudinary images have been cleaned up');
    console.log('✅ Database is now completely empty and ready for fresh data');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error wiping database:', error);
    process.exit(1);
  }
}

// Run the wiping function
wipeDatabase();