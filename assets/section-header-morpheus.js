class MorpheusHeader {
  constructor(section) {
    this.section = section;
    this.navbar = section.querySelector('[data-morpheus-header]');
    this.searchToggle = section.querySelector('[data-search-toggle]');
    this.searchForm = section.querySelector('[data-search-form]');
    this.searchFilterToggle = section.querySelector('[data-search-filter-toggle]');
    this.searchFilterDropdown = section.querySelector('[data-search-filter-dropdown]');
    this.searchOverlay = section.querySelector('[data-search-overlay]');
    this.searchOptions = section.querySelectorAll('[data-search-option]');
    this.searchFilterLabel = section.querySelector('[data-search-filter-label]');
    this.searchTypeInput = section.querySelector('[data-search-type-input]');
    this.accountMenu = section.querySelector('[data-account-menu]');
    this.accountButton = section.querySelector('[data-account-button]');
    this.accountDropdown = section.querySelector('[data-account-dropdown]');
    this.burgerButton = section.querySelector('[data-burger-button]');
    this.sidebar = section.querySelector('[data-sidebar]');
    this.sidebarOverlay = section.querySelector('[data-sidebar-overlay]');
    this.backButton = section.querySelector('[data-back-button]');
    this.cartTriggers = section.querySelectorAll('[data-cart-trigger]');
    this.cartCountNodes = section.querySelectorAll('[data-cart-count]');
    this.lastScrollTop = 0;
    this.searchVisible = true;
    this.delta = 15;
    this.handleScroll = this.handleScroll.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleCartChange = this.handleCartChange.bind(this);
    this.init();
  }

  init() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('cart:change', this.handleCartChange);

    this.searchToggle?.addEventListener('click', () => this.toggleSearch());
    this.searchFilterToggle?.addEventListener('click', () => this.toggleFilterDropdown());
    this.searchFilterToggle?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggleFilterDropdown();
      }
    });

    this.searchOptions.forEach((option) => {
      option.addEventListener('click', () => this.selectSearchOption(option));
    });

    this.accountButton?.addEventListener('click', (event) => {
      event.preventDefault();
      this.toggleAccountDropdown();
    });

    this.burgerButton?.addEventListener('click', () => this.toggleSidebar());
    this.sidebarOverlay?.addEventListener('click', () => this.closeSidebar());
    this.backButton?.addEventListener('click', () => this.navigateBack());

    this.cartTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => this.openCart());
    });

    this.sidebar?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => this.closeSidebar());
    });

    this.handleScroll();
  }

  handleScroll() {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const isBottom = scrollTop + viewportHeight >= documentHeight - 50;
    const isScrolled = scrollTop > 0;

    this.navbar.classList.toggle('scrolled', isScrolled);

    if (Math.abs(this.lastScrollTop - scrollTop) <= this.delta) {
      return;
    }

    if (scrollTop <= 60 || isBottom) {
      this.setSearchVisible(true);
      this.lastScrollTop = scrollTop;
      return;
    }

    this.setSearchVisible(scrollTop < this.lastScrollTop);
    this.lastScrollTop = scrollTop;
  }

  setSearchVisible(isVisible) {
    if (this.searchVisible === isVisible) {
      return;
    }

    this.searchVisible = isVisible;
    this.navbar.classList.toggle('search-open', isVisible);
    this.navbar.classList.toggle('search-closed', !isVisible);
    this.searchToggle?.setAttribute('aria-expanded', String(isVisible));
  }

  toggleSearch() {
    this.setSearchVisible(!this.searchVisible);
  }

  toggleFilterDropdown() {
    const isOpen = this.searchFilterDropdown?.classList.contains('show');
    this.searchFilterDropdown?.classList.toggle('show', !isOpen);
    this.searchFilterToggle?.classList.toggle('active', !isOpen);
    this.searchFilterToggle?.setAttribute('aria-expanded', String(!isOpen));
    if (this.searchOverlay) {
      this.searchOverlay.hidden = isOpen;
    }
  }

  closeFilterDropdown() {
    this.searchFilterDropdown?.classList.remove('show');
    this.searchFilterToggle?.classList.remove('active');
    this.searchFilterToggle?.setAttribute('aria-expanded', 'false');
    if (this.searchOverlay) {
      this.searchOverlay.hidden = true;
    }
  }

  selectSearchOption(option) {
    this.searchOptions.forEach((item) => item.classList.remove('active'));
    option.classList.add('active');

    const label = option.getAttribute('data-label') || 'All Categories';
    const searchTypes = option.getAttribute('data-search-types') || '';

    if (this.searchFilterLabel) {
      this.searchFilterLabel.textContent = label;
    }

    if (this.searchTypeInput) {
      this.searchTypeInput.value = searchTypes;
    }

    this.closeFilterDropdown();
  }

  toggleAccountDropdown() {
    const isHidden = this.accountDropdown?.hasAttribute('hidden');
    if (!this.accountDropdown || !this.accountButton) {
      return;
    }

    if (isHidden) {
      this.accountDropdown.removeAttribute('hidden');
      this.accountButton.setAttribute('aria-expanded', 'true');
    } else {
      this.accountDropdown.setAttribute('hidden', '');
      this.accountButton.setAttribute('aria-expanded', 'false');
    }
  }

  closeAccountDropdown() {
    if (!this.accountDropdown || !this.accountButton) {
      return;
    }

    this.accountDropdown.setAttribute('hidden', '');
    this.accountButton.setAttribute('aria-expanded', 'false');
  }

  toggleSidebar() {
    const isOpen = this.sidebar?.classList.contains('open');
    if (isOpen) {
      this.closeSidebar();
      return;
    }

    this.closeAccountDropdown();
    this.closeFilterDropdown();
    this.sidebar?.classList.add('open');
    this.sidebarOverlay?.classList.add('visible');
    this.burgerButton?.classList.add('is-active');
    this.burgerButton?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('overflow-hidden-mobile');
    this.section.querySelector('.floating-cart')?.classList.add('sidebar-open');
  }

  closeSidebar() {
    this.sidebar?.classList.remove('open');
    this.sidebarOverlay?.classList.remove('visible');
    this.burgerButton?.classList.remove('is-active');
    this.burgerButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('overflow-hidden-mobile');
    this.section.querySelector('.floating-cart')?.classList.remove('sidebar-open');
  }

  openCart() {
    this.closeSidebar();
    this.closeAccountDropdown();
    this.closeFilterDropdown();

    const drawer = document.querySelector('cart-drawer');
    if (drawer && typeof drawer.open === 'function') {
      drawer.open();
      return;
    }

    const overlay = document.querySelector('#CartDrawer-Overlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      document.body.classList.add('overflow-hidden');
      return;
    }

    window.location.assign('/cart');
  }

  navigateBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.assign('/');
  }

  handleDocumentClick(event) {
    if (this.accountMenu && !this.accountMenu.contains(event.target)) {
      this.closeAccountDropdown();
    }

    if (
      this.searchForm &&
      !this.searchForm.contains(event.target) &&
      this.searchFilterDropdown?.classList.contains('show')
    ) {
      this.closeFilterDropdown();
    }
  }

  async handleCartChange() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      const count = cart.item_count > 99 ? '99+' : String(cart.item_count);
      this.cartCountNodes.forEach((node) => {
        node.textContent = count;
        node.classList.toggle('hidden', cart.item_count === 0);
      });
    } catch (error) {
      console.error('Failed to refresh cart count', error);
    }
  }
}

const initMorpheusHeader = () => {
  document.querySelectorAll('.section-header-morpheus').forEach((section) => {
    if (section.dataset.morpheusReady === 'true') {
      return;
    }

    section.dataset.morpheusReady = 'true';
    new MorpheusHeader(section);
  });
};

document.addEventListener('DOMContentLoaded', initMorpheusHeader);
document.addEventListener('shopify:section:load', initMorpheusHeader);
