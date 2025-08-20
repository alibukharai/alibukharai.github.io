'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });


// custom select variables
const portfolioSelect = document.querySelector(".portfolio [data-select]");
const portfolioSelectItems = document.querySelectorAll(".portfolio [data-select-item]");
const portfolioSelectValue = document.querySelector(".portfolio [data-select-value]");
const portfolioFilterBtn = document.querySelectorAll(".portfolio [data-filter-btn]");

const articlesSelect = document.querySelector(".articles [data-select]");
const articlesSelectItems = document.querySelectorAll(".articles [data-select-item]");
const articlesSelectValue = document.querySelector(".articles [data-select-value]");
const articlesFilterBtn = document.querySelectorAll(".articles [data-filter-btn]");

// Portfolio select functionality
if (portfolioSelect) {
  portfolioSelect.addEventListener("click", function () { elementToggleFunc(this); });
}

// Portfolio select items
for (let i = 0; i < portfolioSelectItems.length; i++) {
  portfolioSelectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (portfolioSelectValue) portfolioSelectValue.innerText = this.innerText;
    elementToggleFunc(portfolioSelect);
    portfolioFilterFunc(selectedValue);
  });
}

// Articles select functionality
if (articlesSelect) {
  articlesSelect.addEventListener("click", function () { elementToggleFunc(this); });
}

// Articles select items
for (let i = 0; i < articlesSelectItems.length; i++) {
  articlesSelectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (articlesSelectValue) articlesSelectValue.innerText = this.innerText;
    elementToggleFunc(articlesSelect);
    articlesFilterFunc(selectedValue);
  });
}

// Portfolio filter function
const portfolioFilterFunc = function (selectedValue) {
  const portfolioItems = document.querySelectorAll(".portfolio [data-filter-item]");
  
  for (let i = 0; i < portfolioItems.length; i++) {
    if (selectedValue === "all") {
      portfolioItems[i].classList.add("active");
    } else if (selectedValue === portfolioItems[i].dataset.category.toLowerCase()) {
      portfolioItems[i].classList.add("active");
    } else {
      portfolioItems[i].classList.remove("active");
    }
  }
}

// Articles filter function
const articlesFilterFunc = function (selectedValue) {
  const articleItems = document.querySelectorAll(".articles [data-filter-item]");
  
  for (let i = 0; i < articleItems.length; i++) {
    if (selectedValue === "all") {
      articleItems[i].classList.add("active");
    } else {
      // Improved matching logic for articles
      const itemCategory = articleItems[i].dataset.category;
      let shouldShow = false;
      
      if (itemCategory) {
        const categoryLower = itemCategory.toLowerCase();
        
        // Exact match
        if (selectedValue === categoryLower) {
          shouldShow = true;
        }
        // Handle specific mappings
        else if (selectedValue === "edge ai" && categoryLower === "edge ai") {
          shouldShow = true;
        }
        else if (selectedValue === "linux kernel" && categoryLower === "linux kernel") {
          shouldShow = true;
        }
        else if (selectedValue === "gpu programming" && categoryLower === "gpu programming") {
          shouldShow = true;
        }
      }
      
      if (shouldShow) {
        articleItems[i].classList.add("active");
      } else {
        articleItems[i].classList.remove("active");
      }
    }
  }
}

// Portfolio filter buttons
let lastClickedBtnPortfolio = null;

for (let i = 0; i < portfolioFilterBtn.length; i++) {
  portfolioFilterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (portfolioSelectValue) portfolioSelectValue.innerText = this.innerText;
    portfolioFilterFunc(selectedValue);

    if (lastClickedBtnPortfolio) {
      lastClickedBtnPortfolio.classList.remove("active");
    }
    this.classList.add("active");
    lastClickedBtnPortfolio = this;
  });
}

// Articles filter buttons
let lastClickedBtnArticles = null;

for (let i = 0; i < articlesFilterBtn.length; i++) {
  articlesFilterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (articlesSelectValue) articlesSelectValue.innerText = this.innerText;
    articlesFilterFunc(selectedValue);

    if (lastClickedBtnArticles) {
      lastClickedBtnArticles.classList.remove("active");
    }
    this.classList.add("active");
    lastClickedBtnArticles = this;

  });
}

// Initialize default filter states and page navigation
document.addEventListener('DOMContentLoaded', function() {
  // Set initial active buttons for portfolio
  const portfolioFirstBtn = document.querySelector('.portfolio [data-filter-btn]');
  if (portfolioFirstBtn) {
    lastClickedBtnPortfolio = portfolioFirstBtn;
  }
  
  // Set initial active buttons for articles  
  const articlesFirstBtn = document.querySelector('.articles [data-filter-btn]');
  if (articlesFirstBtn) {
    lastClickedBtnArticles = articlesFirstBtn;
  }
  
  // Initialize articles - show all by default
  const allArticles = document.querySelectorAll('.articles [data-filter-item]');
  allArticles.forEach(function(article) {
    article.classList.add('active');
  });
  
  // Initialize page state
  setActivePage(currentPage);
});

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

// Enhanced form submission
if (form) {
  form.addEventListener("submit", function(e) {
    const button = formBtn;
    const originalText = button.querySelector('span').textContent;
    
    // Update button state
    button.querySelector('span').textContent = 'Sending...';
    button.setAttribute('disabled', '');
    
    // Let the form submit naturally to Formspree
    // Don't prevent default - let browser handle the submission
    
    // Reset button after a delay for user feedback
    setTimeout(() => {
      button.querySelector('span').textContent = 'Message Sent!';
      setTimeout(() => {
        button.querySelector('span').textContent = originalText;
        button.removeAttribute('disabled');
      }, 2000);
    }, 1000);
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Store current page in sessionStorage
let currentPage = sessionStorage.getItem('currentPage') || 'about';

// Function to set active page
function setActivePage(pageName) {
  for (let i = 0; i < pages.length; i++) {
    if (pageName === pages[i].dataset.page) {
      pages[i].classList.add("active");
      navigationLinks[i].classList.add("active");
      currentPage = pageName;
      sessionStorage.setItem('currentPage', pageName);
    } else {
      pages[i].classList.remove("active");
      navigationLinks[i].classList.remove("active");
    }
  }
}

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const pageName = this.innerHTML.toLowerCase();
    setActivePage(pageName);
    window.scrollTo(0, 0);
  });
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
  const savedPage = sessionStorage.getItem('currentPage') || 'about';
  setActivePage(savedPage);
});