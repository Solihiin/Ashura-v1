document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navLinksItems = document.querySelectorAll(".nav-link");

  hamburger.addEventListener("click", function () {
    this.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  navLinksItems.forEach((item) => {
    item.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Active nav link indicator
  const navIndicator = document.querySelector(".nav-indicator");
  const navLinksContainer = document.querySelector(".nav-links");

  function updateNavIndicator(el) {
    const linkRect = el.getBoundingClientRect();
    const containerRect = navLinksContainer.getBoundingClientRect();

    navIndicator.style.width = `${linkRect.width}px`;
    navIndicator.style.left = `${linkRect.left - containerRect.left}px`;
  }

  // Set initial active link
  const activeLink = document.querySelector(".nav-link.active");
  if (activeLink) {
    updateNavIndicator(activeLink);
  }

  // Update indicator on link hover/click
  navLinksItems.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      updateNavIndicator(this);
    });

    link.addEventListener("click", function () {
      navLinksItems.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");
      updateNavIndicator(this);
    });
  });

  // Reset indicator when mouse leaves nav
  navLinksContainer.addEventListener("mouseleave", function () {
    const activeLink = document.querySelector(".nav-link.active");
    if (activeLink) {
      updateNavIndicator(activeLink);
    }
  });

  // Back to top button
  const backToTopBtn = document.querySelector(".back-to-top");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("active");
    } else {
      backToTopBtn.classList.remove("active");
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // About modal
  const aboutModal = document.getElementById("about-modal");
  const aboutModalBtn = document.getElementById("about-more-btn");
  const modalCloseBtns = document.querySelectorAll(".modal-close");

  if (aboutModalBtn) {
    aboutModalBtn.addEventListener("click", function () {
      aboutModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  // Tab functionality in about modal
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");

      tabBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      tabContents.forEach((content) => {
        content.classList.remove("active");
        if (content.getAttribute("data-tab") === tabId) {
          content.classList.add("active");
        }
      });
    });
  });

  // Close modals
  modalCloseBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".modal").forEach((modal) => {
        modal.classList.remove("active");
      });
      document.body.style.overflow = "auto";
    });
  });

  // Close modal when clicking outside content
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });
  });

  // Contact form submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const formData = {
        name: this.name.value,
        email: this.email.value,
        subject: this.subject.value,
        message: this.message.value,
      };

      // Here you would typically send the data to a server
      console.log("Form submitted:", formData);

      // Show success message (in a real app, you'd check the response first)
      alert("Pesan Anda telah terkirim! Terima kasih telah menghubungi saya.");
      this.reset();

      // Reset form labels
      const labels = this.querySelectorAll("label");
      labels.forEach((label) => {
        label.style.top = "15px";
        label.style.left = "15px";
        label.style.fontSize = "1rem";
      });
    });
  }

  // Initialize projects filter
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Get filter value
      const filterValue = this.getAttribute("data-filter");

      // Filter projects
      filterProjects(filterValue);
    });
  });

  // Form label animation
  const formGroups = document.querySelectorAll(".form-group");
  formGroups.forEach((group) => {
    const input = group.querySelector("input, textarea");
    const label = group.querySelector("label");

    if (input.value.trim() !== "") {
      label.style.top = "-10px";
      label.style.left = "10px";
      label.style.fontSize = "0.8rem";
    }

    input.addEventListener("focus", function () {
      label.style.top = "-10px";
      label.style.left = "10px";
      label.style.fontSize = "0.8rem";
      label.style.color = "var(--accent-color)";
    });

    input.addEventListener("blur", function () {
      if (this.value.trim() === "") {
        label.style.top = "15px";
        label.style.left = "15px";
        label.style.fontSize = "1rem";
        label.style.color = "var(--gray-color)";
      }
    });
  });
});

// Project filtering function
function filterProjects(filter) {
  const projects = document.querySelectorAll(".project-card");

  projects.forEach((project) => {
    if (
      filter === "all" ||
      project.getAttribute("data-category").includes(filter)
    ) {
      project.style.display = "block";
    } else {
      project.style.display = "none";
    }
  });
}


const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");
const indicator = document.querySelector(".nav-indicator");

function setActiveNav() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100; // offset agar aktif lebih awal
    if (pageYOffset >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(currentSection)) {
      link.classList.add("active");

      // Pindahkan nav-indicator
      const offsetLeft = link.offsetLeft;
      const offsetWidth = link.offsetWidth;
      indicator.style.left = `${offsetLeft}px`;
      indicator.style.width = `${offsetWidth}px`;
    }
  });
}

window.addEventListener("scroll", setActiveNav);
window.addEventListener("load", setActiveNav);