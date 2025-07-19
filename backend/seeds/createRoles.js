// seeds/createRoles.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';
import Project from '../models/Project.js';
import { permissionsData } from './data/permissions.js';
import { rolesData } from './data/roles.js';
import { projectsData } from './data/projects.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('🔗 Connected to MongoDB for seeding...');

    // Clear existing data (optional - remove in production)
    console.log('🧹 Clearing existing data...');
    await Role.deleteMany({});
    await Permission.deleteMany({});
    await Project.deleteMany({});

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

    // Create projects
    console.log('🏗️  Creating projects...');
    const createdProjects = await Project.insertMany(projectsData);
    console.log(`✅ Created ${createdProjects.length} projects`);

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log('==================');
    
    // Display roles and permissions
    for (const role of createdRoles) {
      await role.populate('permissions');
      console.log(`\n👤 ${role.name}:`);
      console.log(`   Description: ${role.description}`);
      console.log(`   Permissions: ${role.permissions.length}`);
    }

    // Display projects
    console.log('\n🏗️  Projects Created:');
    createdProjects.forEach(project => {
      console.log(`\n📁 ${project.name} (${project.key}):`);
      console.log(`   Description: ${project.description}`);
      console.log(`   Category: ${project.category}`);
      console.log(`   Status: ${project.status}`);
      console.log(`   Visibility: ${project.visibility}`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`\n📊 Final Count:`);
    console.log(`   • ${createdPermissions.length} permissions`);
    console.log(`   • ${createdRoles.length} roles`);
    console.log(`   • ${createdProjects.length} projects`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
