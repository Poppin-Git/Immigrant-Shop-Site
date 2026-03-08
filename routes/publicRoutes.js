const express = require('express');
const path = require('path');
const ejs = require('ejs');
const { getActiveProducts } = require('../models/productModel');
const { createMessage } = require('../models/messageModel');
const {
  getAboutContent,
  getContactContent,
  getProductsPageContent,
  getFAQPageContent,
  getServicesPageContent,
  getGalleryPageContent,
  getSettingsPageContent
} = require('../models/contentModel');

const router = express.Router();

// GET / - Home page
router.get('/', async (req, res) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  try {
    const db = require('../firebase');
    const { getHomepageContent } = require('../models/contentModel');
    
    // Get editable homepage content from Firebase
    const homeContent = await getHomepageContent();
    
    const allProducts = await getActiveProducts();

    // Helper to format discount text
    const formatDiscount = (disc) => {
      return disc.type === 'percentage' ? `${disc.value}%` : `$${disc.value}`;
    };

    // Process products to load discount details
    const processedProducts = await Promise.all(allProducts.map(async (product) => {
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      let appliedDiscounts = [];
      let finalPrice = price;

      // Load applied discounts from discount manager
      if (product.discountIds && product.discountIds.length > 0) {
        try {
          for (const discId of product.discountIds) {
            const discDoc = await db.collection('discounts').doc(discId).get();
            if (discDoc.exists) {
              const disc = discDoc.data();
              if (disc && disc.active) {
                appliedDiscounts.push(disc);
              }
            }
          }

          // Apply discounts to price
          let tempPrice = price;
          appliedDiscounts.forEach(disc => {
            if (disc.type === 'percentage') {
              tempPrice *= (1 - disc.value / 100);
            } else {
              tempPrice -= disc.value;
            }
          });
          finalPrice = Math.max(0, tempPrice);
        } catch (e) {
          console.error('Error loading discounts:', e);
        }
      }

      const percentDiscount = product.discount && product.discount > 0 ? parseInt(product.discount) : 0;
      const discountedPrice = percentDiscount > 0 ? (finalPrice * (1 - percentDiscount / 100)).toFixed(2) : finalPrice.toFixed(2);

      return {
        ...product,
        price: price,
        finalPrice: discountedPrice,
        appliedDiscounts: appliedDiscounts,
        percentDiscount: percentDiscount,
        hasDiscount: percentDiscount > 0 || appliedDiscounts.length > 0
      };
    }));

    // Featured Products: Products with discounts (on sale)
    const featuredProducts = processedProducts
      .filter(p => p.hasDiscount)
      .slice(0, 4);

    // Bestsellers: Popular products (use first products without heavy filtering for now)
    const bestsellers = processedProducts
      .filter(p => !p.hasDiscount)
      .slice(0, 4);

    // New Arrivals: Most recently added products
    const newArrivals = processedProducts
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt.toDate ? a.createdAt.toDate() : a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt.toDate ? b.createdAt.toDate() : b.createdAt) : new Date(0);
        return dateB - dateA;
      })
      .slice(0, 4);

    const data = {
      title: homeContent.title || 'Welcome to My App',
      subtitle: homeContent.subtitle || 'Your one-stop solution',
      description: homeContent.description || 'Discover amazing products and services.',
      productsLink: homeContent.productsLink || 'View Our Products',
      featuredProducts: featuredProducts,
      bestsellers: bestsellers,
      newArrivals: newArrivals
    };

    const body = await ejs.renderFile(path.join(__dirname, '../views/public/home.ejs'), data);
    res.render('layouts/publicLayout', { body, title: 'Home - My App' });
  } catch (error) {
    console.error('Home page error:', error);
    res.status(500).send('Error loading page');
  }
});

// GET /about - Public about page
router.get('/about', async (req, res) => {
  try {
    const data = await getAboutContent();
    const body = await ejs.renderFile(path.join(__dirname, '../views/public/about.ejs'), data);
    res.render('layouts/publicLayout', { body, title: 'About - My App' });
  } catch (error) {
    console.error('About page error:', error);
    res.status(500).send('Error loading page');
  }
});

// GET /contact - Public contact page
router.get('/contact', async (req, res) => {
  try {
    const data = await getContactContent();
    data.success = req.query.success;
    data.error = req.query.error;
    data.formAction = '/contact/submit';
    
    ejs.renderFile(path.join(__dirname, '../views/public/contact.ejs'), data, (err, html) => {
      if (err) {
        console.error('EJS render error:', err);
        // Fallback: render simple inline form
        return res.render('layouts/publicLayout', { 
          body: `<div style="max-width: 600px; margin: 2rem auto; padding: 1rem;">
                   <h2>Contact Us</h2>
                   <p>Get in touch with us</p>
                   <form action="/contact/submit" method="POST">
                     <div style="margin-bottom: 1rem;">
                       <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Name:</label>
                       <input type="text" name="name" required style="width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px;">
                     </div>
                     <div style="margin-bottom: 1rem;">
                       <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Email:</label>
                       <input type="email" name="email" required style="width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px;">
                     </div>
                     <div style="margin-bottom: 1rem;">
                       <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Message:</label>
                       <textarea name="message" rows="5" required style="width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"></textarea>
                     </div>
                     <button type="submit" style="background: #007bff; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Send Message</button>
                   </form>
                 </div>`, 
          title: 'Contact - My App' 
        });
      }
      res.render('layouts/publicLayout', { body: html, title: 'Contact - My App' });
    });
  } catch (error) {
    console.error('Contact page error:', error);
    res.render('layouts/publicLayout', { 
      body: `<div style="max-width: 600px; margin: 2rem auto; padding: 1rem;">
               <h2>Contact Us</h2>
               <form action="/contact/submit" method="POST">
                 <div style="margin-bottom: 1rem;">
                   <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Name:</label>
                   <input type="text" name="name" required style="width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px;">
                 </div>
                 <div style="margin-bottom: 1rem;">
                   <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Email:</label>
                   <input type="email" name="email" required style="width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px;">
                 </div>
                 <div style="margin-bottom: 1rem;">
                   <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Message:</label>
                   <textarea name="message" rows="5" required style="width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"></textarea>
                 </div>
                 <button type="submit" style="background: #007bff; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Send Message</button>
               </form>
             </div>`, 
      title: 'Contact - My App' 
    });
  }
});

// POST /contact/submit - Handle contact form submission
router.post('/contact/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.redirect('/contact?error=All fields are required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.redirect('/contact?error=Invalid email address');
    }

    // Store in Firestore
    await createMessage({ name, email, message });

    res.redirect('/contact?success=Message sent successfully');
  } catch (error) {
    console.error('Contact submit error:', error);
    res.redirect('/contact?error=Failed to send message');
  }
});

// GET /products - Public products page
router.get('/products', async (req, res) => {
  try {
    const db = require('../firebase');
    const products = await getActiveProducts();
    
    // Helper to format discount text
    const formatDiscount = (disc) => {
      return disc.type === 'percentage' ? `${disc.value}%` : `$${disc.value}`;
    };

    // Build products HTML with discount manager support
    const productsHtml = await Promise.all(products.map(async (product) => {
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      const percentDiscount = product.discount && product.discount > 0 ? parseInt(product.discount) : 0;
      
      // Load applied discounts from discount manager
      let appliedDiscounts = [];
      let finalPrice = price;
      
      if (product.discountIds && product.discountIds.length > 0) {
        try {
          for (const discId of product.discountIds) {
            const discDoc = await db.collection('discounts').doc(discId).get();
            if (discDoc.exists) {
              const disc = discDoc.data();
              if (disc && disc.active) {
                appliedDiscounts.push(disc);
              }
            }
          }
          
          // Apply discounts to price
          let tempPrice = price;
          appliedDiscounts.forEach(disc => {
            if (disc.type === 'percentage') {
              tempPrice *= (1 - disc.value / 100);
            } else {
              tempPrice -= disc.value;
            }
          });
          finalPrice = Math.max(0, tempPrice);
        } catch (e) {
          console.error('Error loading discounts:', e);
        }
      }
      
      // Apply percentage discount on top if it exists
      const discountedPrice = percentDiscount > 0 ? (finalPrice * (1 - percentDiscount / 100)).toFixed(2) : finalPrice.toFixed(2);
      const maxDiscount = Math.max(percentDiscount, appliedDiscounts.length > 0 ? 1 : 0);
      
      const discountBadges = appliedDiscounts.length > 0 
        ? `<div class="discount-badges">${appliedDiscounts.map(d => `<span class="discount-tag">${d.code}</span>`).join('')}</div>`
        : '';
      
      const hasDiscount = percentDiscount > 0 || appliedDiscounts.length > 0;
      const maxDiscountValue = appliedDiscounts.length > 0 ? 100 : percentDiscount; // For sorting
      
      return `
        <div class="product-card" data-category="${product.category || 'all'}" data-product-id="${product.id || 'unknown'}" data-product-name="${product.name}" data-product-price="${discountedPrice}" data-has-discount="${hasDiscount}" data-discount-value="${maxDiscountValue}">
          <div class="product-card-container">
            ${product.imageUrl ? `<div class="product-image"><img src="${product.imageUrl}" alt="${product.name}"></div>` : ''}
            ${hasDiscount ? `<div class="discount-badge">${percentDiscount > 0 ? percentDiscount + '% OFF' : 'On Sale'}</div>` : ''}
            <h3>${product.name}</h3>
            <p>${product.description || 'No description'}</p>
            ${discountBadges}
            <div class="price-container">
              ${(percentDiscount > 0 || appliedDiscounts.length > 0) ? `
                <div class="price-info">
                  <span class="original-price">$${price.toFixed(2)}</span>
                  <span class="discounted-price">$${discountedPrice}</span>
                </div>
              ` : `
                <p><strong>$${price.toFixed(2)}</strong></p>
              `}
            </div>
            <div class="product-actions">
              <a href="#" class="button learn-more">Learn More</a>
              <button class="button add-to-cart" data-product-id="${product.id || 'unknown'}" data-product-name="${product.name}" data-product-price="${discountedPrice}">
                Add to Cart
              </button>
              <a href="https://wa.me/1234567890?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}" class="button whatsapp" target="_blank">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      `;
    })).then(html => html.join(''));

    const body = `
      <div style="padding: 2rem;">
        <h1>Our Products</h1>
        <p>Browse our collection of quality products</p>
        
        <div class="search-container">
          <input type="text" id="searchInput" placeholder="Search products..." onkeyup="filterProducts()">
        </div>

        <div class="filter-buttons">
          <button class="filter-btn active" onclick="filterByCategory('all')">All</button>
          <button class="filter-btn" onclick="filterByCategory('new')">New</button>
          <button class="filter-btn" onclick="filterByCategory('popular')">Popular</button>
          <button class="filter-btn" onclick="filterByCategory('sale')">On Sale</button>
        </div>

        <div class="sort-controls" style="margin: 1.5rem 0; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
          <label for="sortDropdown" style="font-weight: bold; margin: 0;">Sort By:</label>
          <select id="sortDropdown" style="padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
            <option value="">-- Select Option --</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="discount-asc">Discount (Low to High)</option>
            <option value="discount-desc">Discount (High to Low)</option>
          </select>
          <button onclick="resetSort()" style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Reset</button>
        </div>

        <div class="products" id="productsContainer">
          ${productsHtml || '<p>No products available at the moment</p>'}
        </div>

        <style>
          .products {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
          }
          .product-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 1rem;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: relative;
          }
          .product-image {
            width: 100%;
            height: 200px;
            background: #f0f0f0;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 1rem;
          }
          .product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .discount-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #e74c3c;
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: 4px;
            font-weight: bold;
            z-index: 10;
          }
          .discount-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 0.5rem 0;
          }
          .discount-tag {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            font-size: 0.85rem;
            font-weight: 600;
          }
          .price-info {
            display: flex;
            gap: 0.5rem;
            align-items: center;
          }
          .original-price {
            text-decoration: line-through;
            color: #999;
          }
          .discounted-price {
            color: #e74c3c;
            font-weight: bold;
            font-size: 1.1em;
          }
          .product-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
            flex-wrap: wrap;
          }
          .button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            font-size: 0.9rem;
            flex: 1;
            min-width: 100px;
          }
          .add-to-cart {
            background: #007bff;
            color: white;
          }
          .add-to-cart:hover {
            background: #0056b3;
          }
          .learn-more {
            background: #6c757d;
            color: white;
          }
          .whatsapp {
            background: #25d366;
            color: white;
          }
          .search-container {
            margin: 2rem 0;
          }
          #searchInput {
            width: 100%;
            max-width: 500px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          .filter-buttons {
            display: flex;
            gap: 1rem;
            margin: 1rem 0;
            flex-wrap: wrap;
          }
          .filter-btn {
            padding: 0.5rem 1rem;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
          }
          .filter-btn.active {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          @media (prefers-color-scheme: dark) {
            .product-card { background: #2c3e50; border-color: #444; color: #ecf0f1; }
            .product-image { background: #445a6f; }
            #searchInput { background: #445a6f; color: #ecf0f1; border-color: #555; }
            .filter-btn { background: #445a6f; color: #ecf0f1; border-color: #555; }
            .filter-btn.active { background: #007bff; color: white; }
          }
        </style>

        <script>
          function filterProducts() {
            const searchInput = document.getElementById('searchInput').value.toLowerCase();
            const products = document.querySelectorAll('.product-card');
            products.forEach(product => {
              const text = product.textContent.toLowerCase();
              product.style.display = text.includes(searchInput) ? '' : 'none';
            });
          }

          function filterByCategory(category) {
            const products = document.querySelectorAll('.product-card');
            products.forEach(product => {
              let show = false;
              
              if (category === 'all') {
                show = true;
              } else if (category === 'sale') {
                // Show products with discounts OR manually marked as on sale
                show = product.dataset.hasDiscount === 'true' || product.dataset.category === 'sale';
              } else {
                // Show products matching the category
                show = product.dataset.category === category;
              }
              
              product.style.display = show ? '' : 'none';
            });
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
          }

          function sortProducts(sortOption) {
            const container = document.getElementById('productsContainer');
            const products = Array.from(document.querySelectorAll('.product-card'));
            
            if (!sortOption) return;
            
            products.sort((a, b) => {
              const nameA = a.dataset.productName.toLowerCase();
              const nameB = b.dataset.productName.toLowerCase();
              const priceA = parseFloat(a.dataset.productPrice);
              const priceB = parseFloat(b.dataset.productPrice);
              const discountA = parseInt(a.dataset.discountValue) || 0;
              const discountB = parseInt(b.dataset.discountValue) || 0;
              
              switch(sortOption) {
                case 'name-asc':
                  return nameA.localeCompare(nameB);
                case 'name-desc':
                  return nameB.localeCompare(nameA);
                case 'price-asc':
                  return priceA - priceB;
                case 'price-desc':
                  return priceB - priceA;
                case 'discount-asc':
                  return discountA - discountB;
                case 'discount-desc':
                  return discountB - discountA;
                default:
                  return 0;
              }
            });
            
            // Clear container and re-add sorted products
            container.innerHTML = '';
            products.forEach(product => {
              container.appendChild(product);
            });
          }

          function resetSort() {
            document.getElementById('sortDropdown').value = '';
            location.reload();
          }

          // Add event listener to sort dropdown
          document.getElementById('sortDropdown').addEventListener('change', function() {
            sortProducts(this.value);
          });

          document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function(e) {
              e.preventDefault();
              alert('Product added to cart!');
            });
          });
        </script>
      </div>
    `;

    res.render('layouts/publicLayout', { body, title: 'Products - My App' });
  } catch (error) {
    console.error('Products page error:', error);
    res.status(500).send('<h1>Error Loading Products</h1><p>' + error.message + '</p>');
  }
});

// GET /faq - Public FAQ page
router.get('/faq', async (req, res) => {
  try {
    const content = await getFAQPageContent();
    const body = await ejs.renderFile(path.join(__dirname, '../views/public/faq.ejs'), content);
    res.render('layouts/publicLayout', { body, title: 'FAQ - My App' });
  } catch (error) {
    console.error('FAQ page error:', error);
    res.status(500).send('Error loading page');
  }
});

// GET /services - Public services page
router.get('/services', async (req, res) => {
  try {
    const content = await getServicesPageContent();
    const body = await ejs.renderFile(path.join(__dirname, '../views/public/services.ejs'), content);
    res.render('layouts/publicLayout', { body, title: 'Services - My App' });
  } catch (error) {
    console.error('Services page error:', error);
    res.status(500).send('Error loading page');
  }
});

// GET /gallery - Public gallery page
router.get('/gallery', async (req, res) => {
  try {
    const content = await getGalleryPageContent();
    const body = await ejs.renderFile(path.join(__dirname, '../views/public/gallery.ejs'), content);
    res.render('layouts/publicLayout', { body, title: 'Gallery - My App' });
  } catch (error) {
    console.error('Gallery page error:', error);
    res.status(500).send('Error loading page');
  }
});

// GET /settings - Public settings page
router.get('/settings', async (req, res) => {
  try {
    const content = await getSettingsPageContent();
    const body = await ejs.renderFile(path.join(__dirname, '../views/public/settings.ejs'), content);
    res.render('layouts/publicLayout', { body, title: 'Settings - My App' });
  } catch (error) {
    console.error('Settings page error:', error);
    res.status(500).send('Error loading page');
  }
});

module.exports = router;
