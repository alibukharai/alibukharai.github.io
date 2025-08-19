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

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {
    console.log(selectedValue);
    console.log(filterItems[i].dataset.category);
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category.toLowerCase()) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

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

// Enhanced form submission with Formspree
if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Construct form endpoint (basic obfuscation)
    const baseUrl = "https://formspree.io/f/";
    const formId = "mr" + "bl" + "wl" + "rp"; // Your form ID split
    const endpoint = baseUrl + formId;
    
    const formData = new FormData(form);
    const button = formBtn;
    const originalText = button.querySelector('span').textContent;
    
    // Update button state
    button.querySelector('span').textContent = 'Sending...';
    button.setAttribute('disabled', '');
    
    fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        button.querySelector('span').textContent = 'Message Sent!';
        form.reset();
        setTimeout(() => {
          button.querySelector('span').textContent = originalText;
          button.removeAttribute('disabled');
        }, 3000);
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .catch(error => {
      button.querySelector('span').textContent = 'Error! Try Again';
      setTimeout(() => {
        button.querySelector('span').textContent = originalText;
        button.removeAttribute('disabled');
      }, 3000);
    });
  });
}

// Form submission handling
if (form) {
  form.addEventListener('submit', function(e) {
    // Show loading state
    formBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon><span>Sending...</span>';
    formBtn.setAttribute("disabled", "");
    
    // Reset form after a delay (Formspree will handle the actual submission)
    setTimeout(function() {
      formBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon><span>Sent!</span>';
      setTimeout(function() {
        formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
        formBtn.removeAttribute("disabled");
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