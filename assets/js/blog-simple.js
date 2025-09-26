// Simple and Reliable Blog Manager
class SimpleBlogManager {
  constructor() {
    this.blogPosts = [
      {
        title: 'AMD GPU Ring Buffer Architecture',
        description: "Deep dive into AMD's GPU driver ring buffer mechanism, exploring the sophisticated communication system between CPU and GPU in the Linux kernel AMDGPU driver with real code examples.",
        date: 'January 2025',
        readTime: '25 min read',
        category: 'GPU Architecture',
        slug: 'ring_buffer',
        file: 'blog/ring_buffer.md',
        image: './assets/images/ring_buffer.png'
      }
    ];
    this.initialized = false;
  }

  init() {
    console.log('SimpleBlogManager: Initializing...');
    
    this.articlesContainer = document.querySelector('.articles-list');
    if (!this.articlesContainer) {
      console.error('SimpleBlogManager: Articles container not found');
      return;
    }
    
    this.loadBlogPosts();
    this.initialized = true;
    console.log('SimpleBlogManager: Initialized successfully');
  }

  loadBlogPosts() {
    console.log('SimpleBlogManager: Loading blog posts...');
    this.articlesContainer.innerHTML = '';
    
    for (const post of this.blogPosts) {
      const article = this.createArticleElement(post);
      this.articlesContainer.appendChild(article);
    }
    
    console.log(`SimpleBlogManager: Loaded ${this.blogPosts.length} blog posts`);
  }

  createArticleElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-post active';
    article.setAttribute('data-filter-item', '');
    article.setAttribute('data-category', post.category);
    article.innerHTML = `
      <div class="post-banner">
        <img src="${post.image}" alt="${post.title}" loading="lazy">
      </div>
      <div class="post-content">
        <div class="post-meta">
          <span class="post-category">${post.category}</span>
          <time datetime="${post.date}">${post.date}</time>
        </div>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-description">${post.description}</p>
        <div class="post-footer">
          <span class="read-time">${post.readTime}</span>
        </div>
      </div>
    `;
    
    article.addEventListener('click', () => this.openPost(post));
    return article;
  }

  async openPost(post) {
    try {
      console.log(`SimpleBlogManager: Opening post - ${post.title}`);
      
      const response = await fetch(post.file);
      if (!response.ok) {
        throw new Error(`Failed to load ${post.file}`);
      }
      
      let content = await response.text();
      console.log(`SimpleBlogManager: Loaded ${content.length} characters`);
      
      // Remove YAML frontmatter
      if (content.startsWith('---')) {
        const secondDelimiter = content.indexOf('---', 3);
        if (secondDelimiter !== -1) {
          content = content.substring(secondDelimiter + 3).trim();
        }
      }
      
      // Enhanced marked configuration for better code formatting
      if (typeof marked !== 'undefined') {
        // Create custom renderer
        const renderer = new marked.Renderer();
        
        // Override code block rendering to preserve formatting
        renderer.code = function(code, language, escaped) {
          const validLang = language && language.trim();
          const langClass = validLang ? `hljs language-${validLang}` : 'hljs';
          
          // Clean up code without altering structure
          const cleanCode = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
          
          return `<pre><code class="${langClass}">${cleanCode}</code></pre>`;
        };
        
        marked.setOptions({
          renderer: renderer,
          highlight: null, // Disable highlighting completely for now
          langPrefix: 'language-',
          breaks: false, // Don't convert single line breaks to <br>
          gfm: true,
          smartypants: false, // Don't convert quotes and dashes
          sanitize: false,
          headerIds: false,
          mangle: false
        });
        
        const htmlContent = marked.parse(content);
        this.showModal(post.title, htmlContent);
      } else {
        throw new Error('Marked.js not available');
      }
      
    } catch (error) {
      console.error('SimpleBlogManager: Error loading post:', error);
      this.showModal(post.title, `<p style="color: red;">Error loading blog post: ${error.message}</p>`);
    }
  }

  showModal(title, content) {
    console.log('SimpleBlogManager: Creating modal...');
    
    const modal = document.createElement('div');
    modal.className = 'blog-modal-overlay';
    modal.innerHTML = `
      <div class="blog-modal">
        <div class="modal-header">
          <h2>${title}</h2>
          <button class="modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="modal-content">
          ${content}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Modal controls
    const closeBtn = modal.querySelector('.modal-close');
    const closeModal = () => {
      document.body.removeChild(modal);
      console.log('SimpleBlogManager: Modal closed');
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', function handleEscape(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    });

    // Apply formatting fixes without highlighting for now
    setTimeout(() => {
      modal.querySelectorAll('pre code').forEach(block => {
        // Apply strong formatting without highlighting
        this.fixCodeFormatting(block);
        console.log('SimpleBlogManager: Applied formatting fixes (no highlighting)');
      });
    }, 100);
    
    console.log('SimpleBlogManager: Modal displayed');
  }

  fixCodeFormatting(codeBlock) {
    // Apply strong CSS rules to prevent any text wrapping
    const elements = [codeBlock, ...codeBlock.querySelectorAll('*')];
    
    elements.forEach(el => {
      el.style.setProperty('white-space', 'pre', 'important');
      el.style.setProperty('word-wrap', 'normal', 'important');
      el.style.setProperty('word-break', 'normal', 'important');
      el.style.setProperty('overflow-wrap', 'normal', 'important');
      el.style.setProperty('text-wrap', 'nowrap', 'important');
      el.style.setProperty('hyphens', 'none', 'important');
    });
    
    console.log('SimpleBlogManager: Fixed code formatting for code block');
  }
}

// Global blog manager instance
let globalBlogManager = null;

// Initialize blog manager when needed
function initBlogManager() {
  if (!globalBlogManager) {
    globalBlogManager = new SimpleBlogManager();
  }
  
  const blogSection = document.querySelector('[data-page="blog"]');
  if (blogSection && blogSection.classList.contains('active') && !globalBlogManager.initialized) {
    console.log('SimpleBlogManager: Blog section is active, initializing...');
    globalBlogManager.init();
    
    // Ensure Medium button works
    setTimeout(() => {
      setupMediumButton();
    }, 500);
  }
}

// Setup Medium button functionality
function setupMediumButton() {
  const mediumBtn = document.querySelector('.medium-follow-btn');
  if (mediumBtn) {
    console.log('SimpleBlogManager: Found Medium button');
    
    // Ensure the button is clickable and visible
    mediumBtn.style.pointerEvents = 'auto';
    mediumBtn.style.cursor = 'pointer';
    mediumBtn.style.zIndex = '1000';
    
    // Test click functionality
    mediumBtn.addEventListener('click', function(e) {
      console.log('SimpleBlogManager: Medium button clicked - link should open naturally');
    });
    
    console.log('SimpleBlogManager: Medium button verified clickable');
  } else {
    console.warn('SimpleBlogManager: Medium button not found');
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('SimpleBlogManager: DOM loaded, setting up...');
    
    // Check immediately
    setTimeout(initBlogManager, 100);
    
    // Listen for navigation clicks
    document.addEventListener('click', function(e) {
      if (e.target.matches('[data-nav-link]') || e.target.closest('[data-nav-link]')) {
        setTimeout(initBlogManager, 200);
      }
    });
    
    // Periodic check
    setInterval(() => {
      if (globalBlogManager && !globalBlogManager.initialized) {
        initBlogManager();
      }
    }, 1000);
  });
} else {
  // DOM already loaded
  setTimeout(initBlogManager, 100);
}
