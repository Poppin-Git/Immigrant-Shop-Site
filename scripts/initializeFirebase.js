#!/usr/bin/env node

/**
 * Firebase Batch Update Script
 * This script helps initialize or reset collections with default data
 */

const db = require('../firebase');

async function initializeDefaults() {
  try {
    console.log('\n🔄 Initializing Firebase database with defaults...\n');

    // Initialize settings with defaults
    const settingsDefaults = {
      siteTitle: 'My App',
      siteEmail: 'admin@example.com',
      itemsPerPage: 10,
      maintenanceMode: false,
      emailNotifications: true,
      analyticsEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('📍 Settings collection...');
    await db.collection('settings').doc('system').set(settingsDefaults, { merge: true });
    console.log('   ✅ Created/Updated settings/system\n');

    // Initialize homepage content
    const homepageDefaults = {
      title: 'Welcome to My App',
      subtitle: 'Your one-stop solution',
      description: 'Discover amazing products and services.',
      productsLink: 'View Our Products',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('📍 Content collection...');
    await db.collection('siteContent').doc('homepage').set(homepageDefaults, { merge: true });
    console.log('   ✅ Created/Updated siteContent/homepage');

    // Initialize contact content
    const contactDefaults = {
      title: 'Contact Us',
      intro: 'Get in touch with us.',
      submitText: 'Send Message',
      email: 'info@example.com',
      phone: '+1 (234) 567-890',
      phoneRaw: '+1234567890',
      whatsappNumber: '+1234567890',
      whatsappMessage: 'Hi, I would like to know more',
      address: {
        street: '123 Business Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States'
      },
      businessHours: {
        weekdayDays: 'Monday - Friday',
        weekdayStart: '9:00 AM',
        weekdayEnd: '5:00 PM',
        weekendDays: 'Saturday - Sunday',
        weekendStatus: 'Closed'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('siteContent').doc('contact').set(contactDefaults, { merge: true });
    console.log('   ✅ Created/Updated siteContent/contact');

    // Initialize other required documents
    const otherPages = [
      {
        id: 'about',
        data: {
          title: 'About Us',
          content: 'This application demonstrates a Node.js + Express web application with Firebase Firestore backend.',
          features: ['Admin-only authentication', 'Public-facing website', 'Server-side rendering', 'Session-based auth'],
          note: 'Built for learning and demonstration purposes.'
        }
      },
      {
        id: 'services',
        data: {
          title: 'Our Services',
          intro: 'We provide comprehensive solutions',
          services: []
        }
      },
      {
        id: 'faq',
        data: {
          title: 'Frequently Asked Questions',
          faqs: []
        }
      },
      {
        id: 'gallery',
        data: {
          title: 'Gallery',
          images: []
        }
      },
      {
        id: 'testimonials',
        data: {
          title: 'Testimonials',
          testimonials: []
        }
      },
      {
        id: 'team',
        data: {
          title: 'Our Team',
          members: []
        }
      },
      {
        id: 'settingsPage',
        data: {
          title: 'Company Settings & Information',
          intro: 'Learn about our company and policies',
          companyName: 'My App',
          companyEmail: 'info@example.com',
          companyPhone: '+1 (234) 567-890',
          privacyPolicyTitle: 'Privacy Policy',
          privacyPolicyContent: 'We respect your privacy.',
          termsOfServiceTitle: 'Terms of Service',
          termsOfServiceContent: 'By using our service, you agree to these terms.',
          aboutTitle: 'About Us',
          aboutContent: 'We are committed to excellence.',
          returnsTitle: 'Returns & Refunds',
          returnsContent: 'We offer a 30-day return policy.'
        }
      }
    ];

    for (const page of otherPages) {
      const dataWithTimestamp = {
        ...page.data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.collection('siteContent').doc(page.id).set(dataWithTimestamp, { merge: true });
      console.log(`   ✅ Created/Updated siteContent/${page.id}`);
    }

    console.log('\n✅ Database initialization complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  }
}

initializeDefaults();
