const {
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
} = require('../models/contentModel');

// GET /admin/content/home
const showHomepageEditor = async (req, res) => {
  try {
    const content = await getHomepageContent();
    res.render('admin/content/home', {
      title: 'Edit Homepage',
      content: content
    });
  } catch (error) {
    console.error('Homepage editor error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// POST /admin/content/home
const updateHomepage = async (req, res) => {
  try {
    const { title, subtitle, description, productsLink } = req.body;
    await updateHomepageContent({ title, subtitle, description, productsLink });
    res.redirect('/admin/content/home');
  } catch (error) {
    console.error('Update homepage error:', error);
    res.status(500).render('error', { message: 'Failed to update homepage' });
  }
};

// GET /admin/content/about
const showAboutEditor = async (req, res) => {
  try {
    const content = await getAboutContent();
    res.render('admin/content/about', {
      title: 'Edit About Page',
      content: content
    });
  } catch (error) {
    console.error('About editor error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// POST /admin/content/about
const updateAbout = async (req, res) => {
  try {
    const { title, content, features, note } = req.body;
    const featuresArray = features ? features.split('\n').map(f => f.trim()).filter(f => f) : [];
    await updateAboutContent({ title, content, features: featuresArray, note });
    res.redirect('/admin/content/about');
  } catch (error) {
    console.error('Update about error:', error);
    res.status(500).render('error', { message: 'Failed to update about page' });
  }
};

// GET /admin/content/contact
const showContactEditor = async (req, res) => {
  try {
    const content = await getContactContent();
    res.render('admin/content/contact', {
      title: 'Edit Contact Page',
      content: content
    });
  } catch (error) {
    console.error('Contact editor error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// POST /admin/content/contact
const updateContact = async (req, res) => {
  try {
    const {
      title,
      intro,
      submitText,
      email,
      phone,
      phoneRaw,
      whatsappNumber,
      whatsappMessage,
      addressStreet,
      addressCity,
      addressState,
      addressZip,
      addressCountry,
      businessHoursWeekday,
      businessHoursWeekdayStart,
      businessHoursWeekdayEnd,
      businessHoursWeekendDays,
      businessHoursWeekendStatus
    } = req.body;

    const contactData = {
      title: title || 'Contact Us',
      intro: intro || 'Get in touch with us using the form below.',
      submitText: submitText || 'Send Message',
      email: email || 'info@example.com',
      phone: phone || '+1 (234) 567-890',
      phoneRaw: phoneRaw || '+1234567890',
      whatsappNumber: whatsappNumber || '+1234567890',
      whatsappMessage: whatsappMessage || 'Hi, I would like to know more',
      address: {
        street: addressStreet || '123 Business Street',
        city: addressCity || 'New York',
        state: addressState || 'NY',
        zip: addressZip || '10001',
        country: addressCountry || 'United States'
      },
      businessHours: {
        weekdayDays: businessHoursWeekday || 'Monday - Friday',
        weekdayStart: businessHoursWeekdayStart || '9:00 AM',
        weekdayEnd: businessHoursWeekdayEnd || '5:00 PM',
        weekendDays: businessHoursWeekendDays || 'Saturday - Sunday',
        weekendStatus: businessHoursWeekendStatus || 'Closed'
      }
    };

    await updateContactContent(contactData);
    res.redirect('/admin/content/contact');
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).render('error', { message: 'Failed to update contact page' });
  }
};

// GET /admin/content/products
const showProductsEditor = async (req, res) => {
  try {
    const content = await getProductsPageContent();
    res.render('admin/content/products', {
      title: 'Edit Products Page',
      content: content
    });
  } catch (error) {
    console.error('Products editor error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// POST /admin/content/products
const updateProducts = async (req, res) => {
  try {
    const { title, intro } = req.body;
    await updateProductsPageContent({ title, intro });
    res.redirect('/admin/content/products');
  } catch (error) {
    console.error('Update products error:', error);
    res.status(500).render('error', { message: 'Failed to update products page' });
  }
};

// GET /admin/content/faq
const showFAQEditor = async (req, res) => {
  try {
    const content = await getFAQPageContent();
    res.render('admin/content/faq', {
      title: 'Edit FAQ Page',
      content: content
    });
  } catch (error) {
    console.error('FAQ editor error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// POST /admin/content/faq
const updateFAQ = async (req, res) => {
  try {
    const { title, faqs } = req.body;
    let faqsArray = [];
    if (faqs) {
      try {
        faqsArray = JSON.parse(faqs);
      } catch (e) {
        console.error('Invalid JSON for FAQs:', e);
        faqsArray = [];
      }
    }
    await updateFAQPageContent({ title, faqs: faqsArray });
    res.redirect('/admin/content/faq');
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).render('error', { message: 'Failed to update FAQ page' });
  }
};

// GET /admin/content/services
const showServicesEditor = async (req, res) => {
  try {
    const content = await getServicesPageContent();
    res.render('admin/content/services', {
      title: 'Edit Services Page',
      content: content
    });
  } catch (error) {
    console.error('Services editor error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// POST /admin/content/services
const updateServices = async (req, res) => {
  try {
    const { title, services } = req.body;
    let servicesArray = [];
    if (services) {
      try {
        servicesArray = JSON.parse(services);
      } catch (e) {
        console.error('Invalid JSON for services:', e);
        servicesArray = [];
      }
    }
    await updateServicesPageContent({ title, services: servicesArray });
    res.redirect('/admin/content/services');
  } catch (error) {
    console.error('Update services error:', error);
    res.status(500).render('error', { message: 'Failed to update services page' });
  }
};

// GET /admin/content/gallery
const showGalleryEditor = async (req, res) => {
  try {
    const content = await getGalleryPageContent();
    res.render('admin/content/gallery', {
      title: 'Edit Gallery Page',
      content: content
    });
  } catch (error) {
    console.error('Gallery editor error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// POST /admin/content/gallery
const updateGallery = async (req, res) => {
  try {
    const { title, images } = req.body;
    const imagesArray = images ? (Array.isArray(images) ? images : [images]) : [];
    await updateGalleryPageContent({ title, images: imagesArray });
    res.redirect('/admin/content/gallery');
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).render('error', { message: 'Failed to update gallery page' });
  }
};

// GET /admin/content/testimonials
const showTestimonialsEditor = async (req, res) => {
  try {
    const content = await getTestimonialsPageContent();
    res.render('admin/content/testimonials', {
      title: 'Edit Testimonials Page',
      content: content
    });
  } catch (error) {
    console.error('Testimonials editor error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// POST /admin/content/testimonials
const updateTestimonials = async (req, res) => {
  try {
    const { title, testimonials } = req.body;
    let testimonialsArray = [];
    if (testimonials) {
      try {
        testimonialsArray = JSON.parse(testimonials);
      } catch (e) {
        console.error('Invalid JSON for testimonials:', e);
        testimonialsArray = [];
      }
    }
    await updateTestimonialsPageContent({ title, testimonials: testimonialsArray });
    res.redirect('/admin/content/testimonials');
  } catch (error) {
    console.error('Update testimonials error:', error);
    res.status(500).render('error', { message: 'Failed to update testimonials page' });
  }
};

// GET /admin/content/team
const showTeamEditor = async (req, res) => {
  try {
    const content = await getTeamPageContent();
    res.render('admin/content/team', {
      title: 'Edit Team Page',
      content: content
    });
  } catch (error) {
    console.error('Team editor error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// POST /admin/content/team
const updateTeam = async (req, res) => {
  try {
    const { title, members } = req.body;
    let membersArray = [];
    if (members) {
      try {
        membersArray = JSON.parse(members);
      } catch (e) {
        console.error('Invalid JSON for team members:', e);
        membersArray = [];
      }
    }
    await updateTeamPageContent({ title, members: membersArray });
    res.redirect('/admin/content/team');
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).render('error', { message: 'Failed to update team page' });
  }
};

// GET /admin/content/settings
const showSettingsEditor = async (req, res) => {
  try {
    const content = await getSettingsPageContent();
    res.render('admin/content/settings', {
      title: 'Edit Settings Page',
      content: content
    });
  } catch (error) {
    console.error('Settings editor error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// POST /admin/content/settings
const updateSettings = async (req, res) => {
  try {
    const {
      title,
      intro,
      companyName,
      companyEmail,
      companyPhone,
      privacyPolicyTitle,
      privacyPolicyContent,
      termsOfServiceTitle,
      termsOfServiceContent,
      aboutTitle,
      aboutContent,
      returnsTitle,
      returnsContent
    } = req.body;

    const settingsData = {
      title: title || 'Company Settings & Information',
      intro: intro || 'Learn about our company and policies',
      companyName: companyName || 'My App',
      companyEmail: companyEmail || 'info@example.com',
      companyPhone: companyPhone || '+1 (234) 567-890',
      privacyPolicyTitle: privacyPolicyTitle || 'Privacy Policy',
      privacyPolicyContent: privacyPolicyContent || 'We respect your privacy and are committed to protecting your personal data.',
      termsOfServiceTitle: termsOfServiceTitle || 'Terms of Service',
      termsOfServiceContent: termsOfServiceContent || 'By using our service, you agree to these terms and conditions.',
      aboutTitle: aboutTitle || 'About Us',
      aboutContent: aboutContent || 'We are a company dedicated to providing excellent service.',
      returnsTitle: returnsTitle || 'Returns & Refunds',
      returnsContent: returnsContent || 'We offer a 30-day return policy for all products.'
    };

    await updateSettingsPageContent(settingsData);
    res.redirect('/admin/content/settings');
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).render('error', { message: 'Failed to update settings page' });
  }
};

module.exports = {
  showHomepageEditor,
  updateHomepage,
  showAboutEditor,
  updateAbout,
  showContactEditor,
  updateContact,
  showProductsEditor,
  updateProducts,
  showFAQEditor,
  updateFAQ,
  showServicesEditor,
  updateServices,
  showGalleryEditor,
  updateGallery,
  showTestimonialsEditor,
  updateTestimonials,
  showTeamEditor,
  updateTeam,
  showSettingsEditor,
  updateSettings
};