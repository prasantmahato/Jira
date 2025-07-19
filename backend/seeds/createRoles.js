// seeds/createRoles.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';
import { permissionsData } from './data/permissions.js';
import { rolesData } from './data/roles.js';

dotenv.config();

const seedRolesAndPermissions = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('🔗 Connected to MongoDB for seeding...');

    // Clear existing data (optional - remove in production)
    console.log('🧹 Clearing existing roles and permissions...');
    await Role.deleteMany({});
    await Permission.deleteMany({});

    // Create permissions first
    console.log('🔐 Creating permissions...');
    const createdPermissions = await Permission.insertMany(permissionsData);
    console.log(`✅ Created ${createdPermissions.length} permissions`);

    // Create a map of permission names to IDs for role creation
    const permissionMap = {};
    createdPermissions.forEach(permission => {
      permissionMap[permission.name] = permission._id;
    });

    // Create roles with permission references
    console.log('👥 Creating roles...');
    const rolePromises = rolesData.map(async (roleData) => {
      const permissionIds = roleData.permissions.map(permissionName => {
        const permissionId = permissionMap[permissionName];
        if (!permissionId) {
          throw new Error(`Permission ${permissionName} not found for role ${roleData.name}`);
        }
        return permissionId;
      });

      return await Role.create({
        name: roleData.name,
        description: roleData.description,
        permissions: permissionIds,
        isSystemRole: true
      });
    });

    const createdRoles = await Promise.all(rolePromises);
    console.log(`✅ Created ${createdRoles.length} roles`);

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log('==================');
    
    for (const role of createdRoles) {
      await role.populate('permissions');
      console.log(`\n${role.name}:`);
      console.log(`  Description: ${role.description}`);
      console.log(`  Permissions: ${role.permissions.length}`);
      role.permissions.forEach(permission => {
        console.log(`    - ${permission.name}: ${permission.description}`);
      });
    }

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRolesAndPermissions();
}

export default seedRolesAndPermissions;
