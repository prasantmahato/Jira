// seeds/data/projects.js
export const projectsData = [
    {
      name: 'E-commerce Platform',
      key: 'ECOM',
      description: 'Next-generation e-commerce platform with microservices architecture',
      status: 'active',
      category: 'software',
      visibility: 'public',
      settings: {
        allowExternalUsers: false,
        requireApproval: true
      }
    },
    {
      name: 'Mobile Banking App',
      key: 'MBANK',
      description: 'Secure mobile banking application with biometric authentication',
      status: 'active',
      category: 'software',
      visibility: 'private',
      settings: {
        allowExternalUsers: false,
        requireApproval: true
      }
    },
    {
      name: 'Customer Support Portal',
      key: 'CSP',
      description: 'Self-service customer support portal with AI chatbot integration',
      status: 'active',
      category: 'software',
      visibility: 'public',
      settings: {
        allowExternalUsers: true,
        requireApproval: false
      }
    },
    {
      name: 'Marketing Analytics Dashboard',
      key: 'MKTG',
      description: 'Real-time marketing analytics and campaign performance dashboard',
      status: 'active',
      category: 'marketing',
      visibility: 'public',
      settings: {
        allowExternalUsers: false,
        requireApproval: false
      }
    },
    {
      name: 'Design System Library',
      key: 'DSL',
      description: 'Comprehensive design system and component library for all products',
      status: 'active',
      category: 'design',
      visibility: 'public',
      settings: {
        allowExternalUsers: true,
        requireApproval: false
      }
    },
    {
      name: 'Internal HR Management',
      key: 'HR',
      description: 'Employee management system for HR operations and workflows',
      status: 'active',
      category: 'operations',
      visibility: 'private',
      settings: {
        allowExternalUsers: false,
        requireApproval: true
      }
    },
    {
      name: 'API Gateway Service',
      key: 'APIGW',
      description: 'Centralized API gateway for microservices communication',
      status: 'active',
      category: 'software',
      visibility: 'public',
      settings: {
        allowExternalUsers: false,
        requireApproval: false
      }
    },
    {
      name: 'Data Science Research',
      key: 'DSR',
      description: 'Machine learning and data science research initiatives',
      status: 'active',
      category: 'research',
      visibility: 'private',
      settings: {
        allowExternalUsers: true,
        requireApproval: true
      }
    },
    {
      name: 'Legacy System Migration',
      key: 'LEGACY',
      description: 'Migration of legacy systems to cloud-native architecture',
      status: 'inactive',
      category: 'operations',
      visibility: 'private',
      settings: {
        allowExternalUsers: false,
        requireApproval: true
      }
    },
    {
      name: 'Security Audit Platform',
      key: 'AUDIT',
      description: 'Automated security auditing and compliance management platform',
      status: 'active',
      category: 'software',
      visibility: 'private',
      settings: {
        allowExternalUsers: false,
        requireApproval: true
      }
    }
  ];
  