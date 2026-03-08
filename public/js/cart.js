// Cart functionality using localStorage

class Cart {
  constructor() {
    this.storageKey = 'appCart';
    this.items = this.loadCart();
    this.init();
  }

  init() {
    this.updateCartCount();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
        e.preventDefault();
        this.addItem(e.target);
      }
    });

    // Cart link
    const cartLink = document.getElementById('cart-link');
    if (cartLink) {
      cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showCartModal();
      });
    }
  }

  addItem(button) {
    const productId = button.getAttribute('data-product-id');
    const productName = button.getAttribute('data-product-name');
    const productPrice = parseFloat(button.getAttribute('data-product-price'));

    const existingItem = this.items.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
    }

    this.saveCart();
    this.updateCartCount();
    this.showNotification(`${productName} added to cart!`);
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartCount();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, parseInt(quantity));
      this.saveCart();
      this.updateCartCount();
    }
  }

  getCartTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  }

  getCartItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  saveCart() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  loadCart() {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : [];
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartCount();
  }

  updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = this.getCartItemCount();
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2500);
  }

  showCartModal() {
    const modal = document.getElementById('cart-modal') || this.createCartModal();
    modal.classList.add('active');
    this.updateModalContent(modal);
  }

  hideCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  async checkoutViaWhatsApp() {
    if (this.items.length === 0) {
      this.showNotification('Please add items to your cart first!');
      return;
    }

    try {
      // Fetch WhatsApp settings from admin
      const settingsResponse = await fetch('/api/settings/whatsapp-checkout', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const settings = settingsResponse.ok ? await settingsResponse.json() : {};
      const whatsappNumber = settings.whatsappNumber || '1234567890';
      const messageTemplate = settings.messageTemplate || 'default';

      // Build message
      let message = '🛒 *Order Request*\n\n';
      message += '*Items:*\n';
      this.items.forEach(item => {
        message += `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`;
      });
      message += `\n*Total: $${this.getCartTotal()}*\n\n`;
      
      // Add custom closing message based on template
      if (messageTemplate === 'friendly') {
        message += '😊 Please confirm this order. We appreciate your business!';
      } else if (messageTemplate === 'professional') {
        message += 'Please confirm this order. Thank you for your purchase.';
      } else if (messageTemplate === 'urgent') {
        message += '⏰ Please confirm ASAP to secure your order!';
      } else {
        message += 'Please confirm this order. Thank you!';
      }

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      this.hideCartModal();
      this.showNotification('Opening WhatsApp...');
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
      // Fallback to default
      let message = '🛒 *Order Request*\n\n';
      message += '*Items:*\n';
      this.items.forEach(item => {
        message += `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`;
      });
      message += `\n*Total: $${this.getCartTotal()}*\n\n`;
      message += 'Please confirm this order. Thank you!';

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/1234567890?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      this.hideCartModal();
      this.showNotification('Opening WhatsApp...');
    }
  }

  createCartModal() {
    const modal = document.createElement('div');
    modal.id = 'cart-modal';
    modal.className = 'cart-modal';
    modal.innerHTML = `
      <div class="cart-modal-content">
        <div class="cart-modal-header">
          <h2>Shopping Cart</h2>
          <button class="cart-close">&times;</button>
        </div>
        <div class="cart-modal-body" id="cart-items"></div>
        <div class="cart-modal-footer">
          <div class="cart-total">
            <strong>Total: $<span id="cart-total">0.00</span></strong>
          </div>
          <button class="btn btn-whatsapp" id="whatsapp-btn">💬 Checkout via WhatsApp</button>
          <button class="btn btn-secondary" id="clear-cart-btn">Clear Cart</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.cart-close').addEventListener('click', () => this.hideCartModal());
    document.getElementById('clear-cart-btn').addEventListener('click', () => {
      this.clearCart();
      this.updateModalContent(modal);
    });
    document.getElementById('whatsapp-btn').addEventListener('click', () => {
      this.checkoutViaWhatsApp();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.hideCartModal();
    });

    return modal;
  }

  updateModalContent(modal) {
    const itemsContainer = modal.querySelector('#cart-items');
    const totalElement = modal.querySelector('#cart-total');

    if (this.items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Start shopping to add items to your cart!</p>
        </div>
      `;
      totalElement.textContent = '0.00';
      return;
    }

    itemsContainer.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <div class="cart-item-main">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p class="item-price">$${item.price.toFixed(2)} each</p>
          </div>
          <button class="cart-remove-btn" data-id="${item.id}" type="button" title="Remove item">
            <span>✕</span>
          </button>
        </div>
        <div class="cart-item-controls">
          <div class="cart-item-quantity">
            <button class="qty-btn qty-decrease" data-id="${item.id}" type="button" title="Decrease quantity">−</button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-btn qty-increase" data-id="${item.id}" type="button" title="Increase quantity">+</button>
          </div>
          <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      </div>
    `).join('');

    totalElement.textContent = this.getCartTotal();

    // Event listeners for quantity controls - using immediate binding
    itemsContainer.querySelectorAll('.qty-decrease').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = e.target.getAttribute('data-id');
        const item = this.items.find(i => i.id === productId);
        if (item && item.quantity > 1) {
          this.updateQuantity(productId, item.quantity - 1);
          this.updateModalContent(modal);
        }
      });
    });

    itemsContainer.querySelectorAll('.qty-increase').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = e.target.getAttribute('data-id');
        const item = this.items.find(i => i.id === productId);
        if (item) {
          this.updateQuantity(productId, item.quantity + 1);
          this.updateModalContent(modal);
        }
      });
    });

    itemsContainer.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.removeItem(e.target.closest('.cart-remove-btn').getAttribute('data-id'));
        this.updateModalContent(modal);
      });
    });
  }
}

// Initialize cart when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
  });
} else {
  window.cart = new Cart();
}

// Add CSS for cart modal and notification
const style = document.createElement('style');
style.textContent = `
/* Cart Notification */
.cart-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 9999;
  font-weight: 500;
}
.cart-notification.show {
  opacity: 1;
  transform: translateX(0);
}

/* Cart Modal Overlay and Container */
.cart-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}
.cart-modal.active {
  display: flex;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.cart-modal-content {
  background: white;
  border-radius: 12px;
  max-width: 700px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Cart Header */
.cart-modal-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.cart-modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.cart-close {
  background: rgba(255,255,255,0.2);
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.cart-close:hover {
  background: rgba(255,255,255,0.3);
  transform: rotate(90deg);
}

/* Cart Body */
.cart-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.cart-modal-body::-webkit-scrollbar {
  width: 6px;
}

.cart-modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.cart-modal-body::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 3px;
}

.cart-modal-body::-webkit-scrollbar-thumb:hover {
  background: #888;
}

/* Empty Cart State */
.empty-cart {
  text-align: center;
  color: #7f8c8d;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-cart-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.empty-cart h3 {
  margin: 0.5rem 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.empty-cart p {
  margin: 0;
  color: #95a5a6;
  font-size: 0.95rem;
}

/* Cart Item */
.cart-item {
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e9ecef;
  transition: all 0.2s;
}

.cart-item:hover {
  border-color: #dee2e6;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.cart-item-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.cart-item-details h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1.05rem;
  font-weight: 600;
}

.cart-item-details .item-price {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.cart-remove-btn {
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s;
  flex-shrink: 0;
}

.cart-remove-btn:hover {
  color: #c0392b;
  transform: scale(1.15);
}

/* Cart Item Controls */
.cart-item-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid #dee2e6;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #f8f9fa;
  color: #2c3e50;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0;
}

.qty-btn:hover {
  background: #e9ecef;
  color: #667eea;
}

.qty-btn:active {
  transform: scale(0.9);
}

.qty-display {
  font-weight: 600;
  color: #2c3e50;
  min-width: 30px;
  text-align: center;
}

.cart-item-total {
  font-weight: 700;
  color: #667eea;
  font-size: 1.1rem;
}

/* Cart Footer */
.cart-modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-shrink: 0;
  background: #f8f9fa;
}

.cart-total {
  text-align: center;
  font-size: 1.3rem;
  color: #2c3e50;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 0.5rem;
}

.cart-total strong {
  color: #667eea;
}

.btn {
  padding: 0.85rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
  transform: translateY(-2px);
}

.btn-whatsapp {
  background: linear-gradient(135deg, #25d366 0%, #1ba952 100%);
  color: white;
}

.btn-whatsapp:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(37, 211, 102, 0.3);
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .cart-modal {
    background: rgba(0, 0, 0, 0.8);
  }

  .cart-modal-content {
    background: #1e1e1e;
  }

  .cart-modal-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .empty-cart {
    color: #bdc3c7;
  }

  .empty-cart h3 {
    color: #ecf0f1;
  }

  .empty-cart p {
    color: #95a5a6;
  }

  .cart-item {
    background: #2c3e50;
    border-color: #34495e;
  }

  .cart-item:hover {
    border-color: #3d566e;
    background: #34495e;
  }

  .cart-item-details h4 {
    color: #ecf0f1;
  }

  .cart-item-details .item-price {
    color: #bdc3c7;
  }

  .cart-item-controls {
    border-top-color: #34495e;
  }

  .cart-item-quantity {
    background: #34495e;
    border-color: #34495e;
  }

  .qty-btn {
    background: #2c3e50;
    color: #ecf0f1;
  }

  .qty-btn:hover {
    background: #3d566e;
    color: #667eea;
  }

  .qty-display {
    color: #ecf0f1;
  }

  .cart-item-total {
    color: #5dade2;
  }

  .cart-remove-btn {
    color: #ec7063;
  }

  .cart-remove-btn:hover {
    color: #e74c3c;
  }

  .cart-modal-footer {
    border-top-color: #34495e;
    background: #2c3e50;
  }

  .cart-total {
    color: #ecf0f1;
    border-bottom-color: #34495e;
  }

  .cart-total strong {
    color: #5dade2;
  }
}

/* Responsive Design */
@media (max-width: 600px) {
  .cart-modal {
    padding: 0;
  }

  .cart-modal-content {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
    width: 100%;
  }

  .cart-modal-header {
    padding: 1.25rem;
  }

  .cart-modal-body {
    padding: 1rem;
  }

  .cart-item {
    padding: 1rem;
    margin-bottom: 0.75rem;
  }

  .btn {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .cart-modal-footer {
    padding: 1rem;
    gap: 0.5rem;
  }

  .cart-total {
    font-size: 1.15rem;
  }
}
`;
document.head.appendChild(style);
