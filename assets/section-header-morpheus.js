// Morpheus Header - Scroll Detection & Interactivity

class MorpheusHeader {
  constructor(section) {
    this.section = section;
    this.navbar = section.querySelector('.top-navbar');
    this.searchToggle = section.querySelector('.search-toggle');
    this.cartBtn = section.querySelector('.cart-btn');
    this.accountBtn = section.querySelector('.account-btn');
    this.accountDropdown = section.querySelector('.account-dropdown');
    this.backBtn = section.querySelector('.back-btn');
    this.burgerBtn = section.querySelector('.burger-btn');
    this.isScrolled = false;

    this.init();
  }

  init() {
    // Scroll detection with debouncing
    window.addEventListener('scroll', () => this.detectScroll(), { passive: true });

    // Search toggle
    if (this.searchToggle) {
      this.searchToggle.addEventListener('click', () => this.toggleSearch());
    }

    // Cart button
    if (this.cartBtn) {
      this.cartBtn.addEventListener('click', () => this.openCart());
    }

    // Account menu toggle
    if (this.accountBtn) {
      this.accountBtn.addEventListener('click', () => this.toggleAccountMenu());
    }

    // Close account menu when clicking outside
    document.addEventListener('click', (e) => this.handleClickOutside(e));

    // Back button
    if (this.backBtn) {
      this.backBtn.addEventListener('click', () => this.navigateBack());
    }

    // Burger menu
    if (this.burgerBtn) {
      this.burgerBtn.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Listen for cart updates
    document.addEventListener('cart:change', () => this.updateCartBadge());
  }

  detectScroll() {
    const scrolled = window.scrollY > 50;

    if (scrolled !== this.isScrolled) {
      this.isScrolled = scrolled;
      if (scrolled) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    }
  }

  toggleSearch() {
    const isOpen = this.navbar.classList.contains('search-open');
    if (isOpen) {
      this.navbar.classList.remove('search-open');
      this.navbar.classList.add('search-closed');
    } else {
      this.navbar.classList.remove('search-closed');
      this.navbar.classList.add('search-open');
    }
  }

  openCart() {
    // Trigger Shopify's cart drawer if it exists
    const cartDrawer = document.querySelector('cart-drawer');
    if (cartDrawer) {
      cartDrawer.open();
    } else {
      // Fallback: navigate to cart page
      window.location.href = '/cart';
    }
  }

  toggleAccountMenu() {
    if (this.accountDropdown) {
      const isHidden = this.accountDropdown.hasAttribute('hidden');
      if (isHidden) {
        this.accountDropdown.removeAttribute('hidden');
      } else {
        this.accountDropdown.setAttribute('hidden', '');
      }
    }
  }

  handleClickOutside(e) {
    if (this.accountDropdown && !this.accountDropdown.hasAttribute('hidden')) {
      if (!this.section.contains(e.target)) {
        this.accountDropdown.setAttribute('hidden', '');
      }
    }
  }

  navigateBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  }

  toggleMobileMenu() {
    // Open Shopify's drawer menu
    const menuDrawer = document.querySelector('[data-menu-drawer]');
    if (menuDrawer) {
      menuDrawer.classList.toggle('is-open');
    } else {
      console.warn('Mobile menu drawer not found');
    }
  }

  updateCartBadge() {
    // Fetch and update cart count badge
    fetch('/cart.js')
      .then((res) => res.json())
      .then((cart) => {
        const badge = this.cartBtn?.querySelector('.badge');
        if (badge && cart.item_count > 0) {
          badge.textContent = cart.item_count;
          if (cart.item_count > 99) {
            badge.textContent = '99+';
          }
        }
      })
      .catch((err) => console.error('Error updating cart:', err));
  }
}

// Initialize header when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const headerSection = document.querySelector('.section-header-morpheus');
  if (headerSection) {
    new MorpheusHeader(headerSection);
  }
});

// Also initialize if header is dynamically added
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const headerSection = document.querySelector('.section-header-morpheus');
    if (headerSection) {
      new MorpheusHeader(headerSection);
    }
  });
} else {
  const headerSection = document.querySelector('.section-header-morpheus');
  if (headerSection) {
    new MorpheusHeader(headerSection);
  }
}
