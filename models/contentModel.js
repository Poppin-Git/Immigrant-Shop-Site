const db = require('../firebase');

// Get homepage content
const getHomepageContent = async () => {
  try {
    const doc = await db.collection('siteContent').doc('homepage').get();
    if (doc.exists) {
      return doc.data();
    }
    // Return defaults if not found
    return {
      title: 'Welcome to My App',
      subtitle: 'This is a public-facing website built with Node.js, Express, and EJS.',
      description: 'Explore our pages and learn more about what we do.',
      productsLink: 'View Our Products'
    };
  } catch (error) {
    throw new Error(`Failed to get homepage content: ${error.message}`);
  }
};

// Update homepage content
const updateHomepageContent = async (data) => {
  try {
    await db.collection('siteContent').doc('homepage').set(data, { merge: true });
    return true;
  } catch (error) {
    throw new Error(`Failed to update homepage content: ${error.message}`);
  }
};

// Get about content
const getAboutContent = async () => {
  try {
    const doc = await db.collection('siteContent').doc('about').get();
    if (doc.exists) {
      return doc.data();
    }
    // Return defaults
    return {
      title: 'About Us',
      content: 'This application demonstrates a Node.js + Express web application with Firebase Firestore backend.',
      features: [
        'Admin-only authentication system',
        'Public-facing website',
        'Server-side rendering with EJS',
        'Session-based authentication'
      ],
      note: 'Built for learning and demonstration purposes.'
    };
  } catch (error) {
    throw new Error(`Failed to get about content: ${error.message}`);
  }
};

// Update about content
const updateAboutContent = async (data) => {
  try {
    await db.collection('siteContent').doc('about').set(data, { merge: true });
    return true;
  } catch (error) {
    throw new Error(`Failed to update about content: ${error.message}`);
  }
};

// generic helpers for page content
const getPageContent = async (pageKey, defaults) => {
  try {
    const doc = await db.collection('siteContent').doc(pageKey).get();
    if (doc.exists) {
      // Merge database data with defaults to ensure all fields are present
      return { ...defaults, ...doc.data() };
    }
    return defaults;
  } catch (error) {
    throw new Error(`Failed to get ${pageKey} content: ${error.message}`);
  }
};

const updatePageContent = async (pageKey, data) => {
  try {
    await db.collection('siteContent').doc(pageKey).set(data, { merge: true });
    return true;
  } catch (error) {
    throw new Error(`Failed to update ${pageKey} content: ${error.message}`);
  }
};

// Contact content using generic helpers
const getContactContent = () => getPageContent('contact', {
  title: 'Contact Us',
  intro: 'Get in touch with us using the form below.',
  formAction: '/contact',
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
    weekdayStart: '9:00 AM',
    weekdayEnd: '5:00 PM',
    weekdayDays: 'Monday - Friday',
    weekendStatus: 'Closed',
    weekendDays: 'Saturday - Sunday'
  }
});

const updateContactContent = (data) => updatePageContent('contact', data);

// wrappers for additional editable pages
const getProductsPageContent = () => getPageContent('products', {
  title: 'Our Products',
  intro: 'Explore our range of products.',
});
const updateProductsPageContent = (data) => updatePageContent('products', data);

const getFAQPageContent = () => getPageContent('faq', {
  title: 'Frequently Asked Questions',
  faqs: [
    { question: 'What products do you offer?', answer: 'We offer a wide range of quality products. Check our Products page to see the full selection.' },
    { question: 'How do I place an order?', answer: 'You can browse our products page and click on any item to learn more. Contact us for ordering details.' },
    { question: 'What is your return policy?', answer: 'We offer a 30-day return policy on all items. Please contact our support team with any return requests.' },
    { question: 'Do you offer shipping?', answer: 'Yes, we offer fast shipping to most locations. Shipping costs and timelines will be calculated at checkout.' }
  ]
});
const updateFAQPageContent = (data) => updatePageContent('faq', data);

const getServicesPageContent = () => getPageContent('services', {
  title: 'Our Services',
  services: [
    { name: 'Consulting', description: 'Expert advice and guidance for your business needs.' },
    { name: 'Support', description: '24/7 customer support available via email and phone.' },
    { name: 'Customization', description: 'We can customize products to fit your specific requirements.' },
    { name: 'Training', description: 'Comprehensive training programs for product usage and implementation.' }
  ]
});
const updateServicesPageContent = (data) => updatePageContent('services', data);

const getGalleryPageContent = () => getPageContent('gallery', {
  title: 'Gallery',
  images: [
    'gallery-1.jpg',
    'gallery-2.jpg',
    'gallery-3.jpg',
    'gallery-4.jpg',
    'gallery-5.jpg',
    'gallery-6.jpg'
  ]
});
const updateGalleryPageContent = (data) => updatePageContent('gallery', data);

const getTestimonialsPageContent = () => getPageContent('testimonials', {
  title: 'Testimonials',
  testimonials: [
    { text: 'Great products and excellent customer service!', name: 'John Smith' },
    { text: 'Highly recommend this company. Very professional team.', name: 'Sarah Johnson' },
    { text: 'Best experience I\'ve had. Will definitely order again.', name: 'Mike Williams' },
    { text: 'Amazing quality and fast delivery. Outstanding!', name: 'Emily Brown' }
  ]
});
const updateTestimonialsPageContent = (data) => updatePageContent('testimonials', data);

const getTeamPageContent = () => getPageContent('team', {
  title: 'Our Team',
  members: [
    { name: 'John Doe', role: 'Founder & CEO' },
    { name: 'Jane Smith', role: 'Lead Developer' },
    { name: 'Bob Johnson', role: 'Customer Support Manager' },
    { name: 'Alice Brown', role: 'Sales Director' }
  ]
});
const updateTeamPageContent = (data) => updatePageContent('team', data);

// Settings page - company information
const getSettingsPageContent = () => getPageContent('settingsPage', {
  title: 'Company Settings & Information',
  intro: 'Learn about our company and policies',
  companyName: 'My App',
  companyEmail: 'info@example.com',
  companyPhone: '+1 (234) 567-890',
  privacyPolicyTitle: 'Privacy Policy',
  privacyPolicyContent: 'We respect your privacy and are committed to protecting your personal data.',
  termsOfServiceTitle: 'Terms of Service',
  termsOfServiceContent: 'By using our service, you agree to these terms and conditions.',
  aboutTitle: 'About Us',
  aboutContent: 'We are a company dedicated to providing excellent service.',
  returnsTitle: 'Returns & Refunds',
  returnsContent: 'We offer a 30-day return policy for all products.'
});

const updateSettingsPageContent = (data) => updatePageContent('settingsPage', data);

module.exports = {
  getHomepageContent,
  updateHomepageContent,
  getAboutContent,
  updateAboutContent,
  getContactContent,
  updateContactContent,
  getProductsPageContent,
  updateProductsPageContent,
  getFAQPageContent,
  updateFAQPageContent,
  getServicesPageContent,
  updateServicesPageContent,
  getGalleryPageContent,
  updateGalleryPageContent,
  getTestimonialsPageContent,
  updateTestimonialsPageContent,
  getTeamPageContent,
  updateTeamPageContent,
  getSettingsPageContent,
  updateSettingsPageContent
};