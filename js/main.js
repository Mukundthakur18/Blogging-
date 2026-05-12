// DOM Elements
const body = document.body;
const themeToggleBtn = document.getElementById('theme-toggle');
const header = document.querySelector('.header');
const scrollTopBtn = document.getElementById('scroll-top');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const loader = document.getElementById('loader');

// Authentication State Management
const authContainer = document.getElementById('auth-container');

// ==========================================
// Theme Management (Dark/Light Mode)
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    body.setAttribute('data-theme', 'dark');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = '<i class="ri-sun-line"></i>';
    }
  } else {
    body.removeAttribute('data-theme');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = '<i class="ri-moon-line"></i>';
    }
  }
}

function toggleTheme() {
  const currentTheme = body.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    body.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="ri-moon-line"></i>';
  } else {
    body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="ri-sun-line"></i>';
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', toggleTheme);
}

// ==========================================
// UI Interactions (Scroll, Mobile Menu)
// ==========================================
window.addEventListener('scroll', () => {
  // Sticky Header
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Scroll to Top Button
  if (scrollTopBtn) {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Mobile Menu Toggle
if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.className = 'ri-close-line';
      body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
      icon.className = 'ri-menu-line';
      body.style.overflow = '';
    }
  });
}

// Close mobile menu when clicking a link
const navItems = document.querySelectorAll('.nav-link');
navItems.forEach(item => {
  item.addEventListener('click', () => {
    if (navLinks && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      const icon = mobileMenuBtn.querySelector('i');
      icon.className = 'ri-menu-line';
      body.style.overflow = '';
    }
  });
});

// ==========================================
// Authentication Logic (Simulation)
// ==========================================
function updateAuthUI() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const currentUser = localStorage.getItem('currentUser') || 'User';

  if (!authContainer) return;

  if (isLoggedIn) {
    authContainer.innerHTML = `
      <div class="user-profile-nav">
        <span class="welcome-text" style="margin-right: 12px; font-size: 0.9rem; font-weight: 500;">Hi, ${currentUser}</span>
        <button id="logout-btn" class="btn btn-outline" style="padding: 6px 16px; font-size: 0.85rem;">Logout</button>
      </div>
    `;
    
    // Attach logout event
    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      updateAuthUI();
      // Optional: reload page to clear any protected state
      window.location.reload();
    });
  } else {
    authContainer.innerHTML = `
      <a href="login.html" class="btn btn-primary" style="padding: 8px 20px;">Log In</a>
    `;
  }
}

// ==========================================
// Data Fetching & Rendering
// ==========================================

// Fake loading delay for demonstration
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function fetchPosts() {
  try {
    const response = await fetch('./data/posts.json');
    if (!response.ok) throw new Error('Failed to fetch posts');
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
}

function createBlogCard(post) {
  return `
    <article class="blog-card" data-category="${post.category.toLowerCase()}">
      <div class="card-image">
        <span class="card-category">${post.category}</span>
        <a href="post.html?id=${post.id}">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
        </a>
      </div>
      <div class="card-content">
        <div class="card-meta">
          <span><i class="ri-calendar-line"></i> ${post.date}</span>
          <span><i class="ri-time-line"></i> ${post.readTime}</span>
        </div>
        <h3 class="card-title"><a href="post.html?id=${post.id}">${post.title}</a></h3>
        <p class="card-excerpt">${post.excerpt}</p>
        <div class="card-footer">
          <div class="card-author">
            <img src="${post.authorImage}" alt="${post.author}" loading="lazy">
            <div>
              <span class="author-name">${post.author}</span>
            </div>
          </div>
          <a href="post.html?id=${post.id}" class="read-more">Read More <i class="ri-arrow-right-line"></i></a>
        </div>
      </div>
    </article>
  `;
}

// Render posts based on page context
async function initBlogContent() {
  const posts = await fetchPosts();
  await delay(500); // Simulate network latency to show loader optionally
  
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
  
  // Homepage - Featured & Latest
  const featuredGrid = document.getElementById('featured-grid');
  const latestGrid = document.getElementById('latest-grid');
  
  if (featuredGrid && latestGrid) {
    const featuredPosts = posts.filter(p => p.featured).slice(0, 2);
    const latestPosts = posts.filter(p => !p.featured).slice(0, 3);
    
    featuredGrid.innerHTML = featuredPosts.map(p => createBlogCard(p)).join('');
    latestGrid.innerHTML = latestPosts.map(p => createBlogCard(p)).join('');
  }
  
  // Blog Page - All Posts
  const blogGrid = document.getElementById('all-posts-grid');
  if (blogGrid) {
    blogGrid.innerHTML = posts.map(p => createBlogCard(p)).join('');
  }
}

// Initialize things on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateAuthUI();
  initBlogContent();
});
