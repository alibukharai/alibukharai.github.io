'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });


// custom select variables
const projectsSelect = document.querySelector(".projects [data-select]");
const projectsSelectItems = document.querySelectorAll(".projects [data-select-item]");
const projectsSelectValue = document.querySelector(".projects [data-select-value]");
const projectsFilterBtn = document.querySelectorAll(".projects [data-filter-btn]");

const articlesSelect = document.querySelector(".articles [data-select]");
const articlesSelectItems = document.querySelectorAll(".articles [data-select-item]");
const articlesSelectValue = document.querySelector(".articles [data-select-value]");
const articlesFilterBtn = document.querySelectorAll(".articles [data-filter-btn]");

// Projects select functionality
if (projectsSelect) {
  projectsSelect.addEventListener("click", function () { elementToggleFunc(this); });
}

// Projects select items
for (let i = 0; i < projectsSelectItems.length; i++) {
  projectsSelectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (projectsSelectValue) projectsSelectValue.innerText = this.innerText;
    elementToggleFunc(projectsSelect);
    projectsFilterFunc(selectedValue);
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

// Projects filter function
const projectsFilterFunc = function (selectedValue) {
  const projectsItems = document.querySelectorAll(".projects [data-filter-item]");
  
  for (let i = 0; i < projectsItems.length; i++) {
    if (selectedValue === "all") {
      projectsItems[i].classList.add("active");
    } else if (selectedValue === projectsItems[i].dataset.category.toLowerCase()) {
      projectsItems[i].classList.add("active");
    } else {
      projectsItems[i].classList.remove("active");
    }
  }
}

// Articles filter function
const articlesFilterFunc = function (selectedValue) {
  const articleItems = document.querySelectorAll(".articles [data-filter-item]");
  console.log("Filtering articles for:", selectedValue);
  console.log("Found article items:", articleItems.length);
  
  for (let i = 0; i < articleItems.length; i++) {
    if (selectedValue === "all") {
      articleItems[i].classList.add("active");
      console.log("Showing all - item", i);
    } else {
      const itemCategory = articleItems[i].dataset.category;
      console.log("Item", i, "category:", itemCategory, "selected:", selectedValue);
      
      if (itemCategory) {
        const categoryLower = itemCategory.toLowerCase();
        const selectedLower = selectedValue.toLowerCase();
        
        console.log("Comparing:", selectedLower, "===", categoryLower);
        
        if (selectedLower === categoryLower) {
          articleItems[i].classList.add("active");
          console.log("MATCH - Showing item", i);
        } else {
          articleItems[i].classList.remove("active");
          console.log("NO MATCH - Hiding item", i);
        }
      } else {
        articleItems[i].classList.remove("active");
        console.log("No category found for item", i);
      }
    }
  }
}

// Projects filter buttons
let lastClickedBtnProjects = null;

for (let i = 0; i < projectsFilterBtn.length; i++) {
  projectsFilterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (projectsSelectValue) projectsSelectValue.innerText = this.innerText;
    projectsFilterFunc(selectedValue);

    if (lastClickedBtnProjects) {
      lastClickedBtnProjects.classList.remove("active");
    }
    this.classList.add("active");
    lastClickedBtnProjects = this;
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

// Combined DOM initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log('Script: DOM loaded, initializing everything...');
  
  // Initialize highlight.js if available
  if (typeof hljs !== 'undefined') {
    hljs.highlightAll();
    console.log('Script: Highlight.js initialized');
  }
  
  // Set initial active buttons for projects
  const projectsFirstBtn = document.querySelector('.projects [data-filter-btn]');
  if (projectsFirstBtn) {
    lastClickedBtnProjects = projectsFirstBtn;
  }
  
  // Set initial active buttons for articles  
  const articlesFirstBtn = document.querySelector('.articles [data-filter-btn]');
  if (articlesFirstBtn) {
    lastClickedBtnArticles = articlesFirstBtn;
  }
  
  // Setup navigation
  setupNavigation();
  
  // Initialize page state after navigation is set up
  const currentPage = sessionStorage.getItem('currentPage') || 'home';
  setActivePage(currentPage);
  
  // Wait for blog system to initialize before setting up articles
  setTimeout(() => {
    // Initialize articles - show all by default
    const allArticles = document.querySelectorAll('.articles [data-filter-item]');
    allArticles.forEach(function(article) {
      article.classList.add('active');
    });
  }, 1000);
  
  console.log('Script: Complete initialization finished');
});

function setupNavigation() {
  console.log('Script: Setting up navigation...');
  
  // page navigation variables
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  console.log(`Script: Found ${navigationLinks.length} nav links and ${pages.length} pages`);

  // Make setActivePage global so it can be used elsewhere
  window.setActivePage = function(pageName) {
    console.log(`Script: Setting active page to: ${pageName}`);
    
    for (let i = 0; i < pages.length; i++) {
      if (pageName === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        sessionStorage.setItem('currentPage', pageName);
        console.log(`Script: Activated page: ${pageName}`);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  };

  // add event to all nav link
  for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener("click", function () {
      const pageName = this.innerHTML.toLowerCase();
      setActivePage(pageName);
      window.scrollTo(0, 0);
    });
  }

  console.log('Script: Navigation setup complete');
}

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


// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
  const savedPage = sessionStorage.getItem('currentPage') || 'home';
  setActivePage(savedPage);
});