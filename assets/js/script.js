'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });


// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  // Get current active page to determine context
  const currentPage = document.querySelector("article.active");
  let contextItems = filterItems;
  
  // If we're on articles page, filter only article items
  if (currentPage && currentPage.classList.contains("articles")) {
    contextItems = currentPage.querySelectorAll("[data-filter-item]");
  }
  // If we're on portfolio page, filter only project items  
  else if (currentPage && currentPage.classList.contains("portfolio")) {
    contextItems = currentPage.querySelectorAll("[data-filter-item]");
  }

  for (let i = 0; i < contextItems.length; i++) {
    console.log(selectedValue);
    console.log(contextItems[i].dataset.category);
    if (selectedValue === "all") {
      contextItems[i].classList.add("active");
    } else if (selectedValue === contextItems[i].dataset.category.toLowerCase()) {
      contextItems[i].classList.add("active");
    } else {
      contextItems[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
let lastClickedBtnPortfolio = null;
let lastClickedBtnArticles = null;

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    // Get current page context to manage active states properly
    const currentPage = document.querySelector("article.active");
    let lastClickedBtn = null;
    let currentPageButtons = [];
    
    if (currentPage && currentPage.classList.contains("articles")) {
      currentPageButtons = currentPage.querySelectorAll("[data-filter-btn]");
      lastClickedBtn = lastClickedBtnArticles;
    } else if (currentPage && currentPage.classList.contains("portfolio")) {
      currentPageButtons = currentPage.querySelectorAll("[data-filter-btn]");
      lastClickedBtn = lastClickedBtnPortfolio;
    }

    // Remove active from previous button in this context
    if (lastClickedBtn) {
      lastClickedBtn.classList.remove("active");
    }
    
    // Add active to current button
    this.classList.add("active");
    
    // Update the last clicked button for this context
    if (currentPage && currentPage.classList.contains("articles")) {
      lastClickedBtnArticles = this;
    } else if (currentPage && currentPage.classList.contains("portfolio")) {
      lastClickedBtnPortfolio = this;
    }

  });

}

// Initialize default filter states
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

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);

      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}