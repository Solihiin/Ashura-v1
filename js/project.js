document.addEventListener("DOMContentLoaded", function () {
  // Project categories mapping (from filter buttons to JSON categories)
  const categoryMap = {
    all: "all",
    brand: ["brand", "wordmark", "abstract"],
    mascot: ["mascot", "character"],
    monogram: ["monogram", "letterform"],
  };

  // DOM elements
  const projectsContainer = document.getElementById("projects-container");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const isProjectPage = window.location.pathname.includes("project.html");
  let allProjects = [];
  let currentPage = 1;
  const projectsPerPage = 9;
  let currentFilteredProjects = [];

  // Load projects from JSON file
  fetch("data/project.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      allProjects = data.projects.map((project) => {
        // Determine category based on title/content (you might want to add a category field to your JSON)
        let category = "brand"; // default
        if (project.title.toLowerCase().includes("mascot")) category = "mascot";
        if (project.title.toLowerCase().includes("monogram"))
          category = "monogram";
        if (project.title.toLowerCase().includes("gaming")) category = "gaming";

        return {
          ...project,
          category: category
        };
      });

      if (isProjectPage) {
        renderPaginatedProjects(allProjects); // gunakan pagination di halaman project
        setupFilterButtons(); // untuk filter tombol
      }

      // === Halaman index.html: hanya 6 project tanpa filter ===
      else {
        const limitedProjects = allProjects.slice(0, 6);
        renderProjects(limitedProjects);
      }

      setupProjectModals(); // tetap dijalankan
    });
  function setupFilterButtons() {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        filterBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        const filterValue = this.getAttribute("data-filter");
        filterProjects(filterValue);
      });
    });
  }

  function renderPaginatedProjects(projects) {
    currentFilteredProjects = projects;
    const totalPages = Math.ceil(projects.length / projectsPerPage);
    const start = (currentPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;
    const paginated = projects.slice(start, end);

    renderProjects(paginated);
    setupProjectModals()
    renderPaginationControls(totalPages);
  }

  function renderPaginationControls(totalPages) {
    let paginationContainer = document.getElementById("pagination");

    if (!paginationContainer) {
      paginationContainer = document.createElement("div");
      paginationContainer.id = "pagination";
      paginationContainer.className = "pagination-controls";
      projectsContainer.parentElement.appendChild(paginationContainer);
    }

    let buttonsHTML = "";

    // Prev button
    buttonsHTML += `<button class="pagination-btn" ${
      currentPage === 1 ? "disabled" : ""
    } data-page="${currentPage - 1}">Prev</button>`;

    // Always show first page
    if (currentPage === 1) {
      buttonsHTML += `<button class="pagination-btn active" data-page="1">1</button>`;
    } else {
      buttonsHTML += `<button class="pagination-btn" data-page="1">1</button>`;
    }

    // Show dots if needed before middle pages
    if (currentPage > 3) {
      buttonsHTML += `<span class="dots">...</span>`;
    }

    // Show middle pages (currentPage-1, currentPage, currentPage+1)
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i === 1 || i === totalPages) continue; // already handled
      buttonsHTML += `<button class="pagination-btn ${
        i === currentPage ? "active" : ""
      }" data-page="${i}">${i}</button>`;
    }

    // Show dots if needed after middle pages
    if (currentPage < totalPages - 2) {
      buttonsHTML += `<span class="dots">...</span>`;
    }

    // Always show last page if more than 1
    if (totalPages > 1) {
      if (currentPage === totalPages) {
        buttonsHTML += `<button class="pagination-btn active" data-page="${totalPages}">${totalPages}</button>`;
      } else {
        buttonsHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
      }
    }

    // Next button
    buttonsHTML += `<button class="pagination-btn" ${
      currentPage === totalPages ? "disabled" : ""
    } data-page="${currentPage + 1}">Next</button>`;

    paginationContainer.innerHTML = buttonsHTML;

    // Add click events
    const pageButtons = paginationContainer.querySelectorAll(
      ".pagination-btn[data-page]"
    );
    pageButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedPage = parseInt(btn.getAttribute("data-page"));
        if (
          !isNaN(selectedPage) &&
          selectedPage >= 1 &&
          selectedPage <= totalPages
        ) {
          currentPage = selectedPage;
          renderPaginatedProjects(currentFilteredProjects);

          // Scroll to the .projects section after changing page
          const projectsSection = document.querySelector(".projects");
          if (projectsSection) {
            window.scrollTo({
              top: projectsSection.offsetTop,
              behavior: "smooth",
            });
          }
        }
      });
    });
  }

  // Render projects to the DOM
  function renderProjects(projects) {
    projectsContainer.innerHTML = "";

    if (projects.length === 0) {
      projectsContainer.innerHTML = `
          <div class="no-projects">
            <p>No projects found in this category.</p>
          </div>
        `;
      return;
    }

    projects.forEach((project) => {
      const projectCard = document.createElement("div");
      projectCard.className = "project-card";
      projectCard.setAttribute("data-category", project.category);
      projectCard.setAttribute("data-id", project.id);

      projectCard.innerHTML = `
          <div class="project-image">
            <img src="images/project/${project.image}" alt="${
        project.title
      }" loading="lazy">
          </div>
          <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tags">
              ${project.tools
                .map((tool) => `<span class="project-tag">${tool}</span>`)
                .join("")}
            </div>
          </div>
        `;

      projectsContainer.appendChild(projectCard);
    });
  }

  // Filter projects based on category
  function filterProjects(category) {
    let filteredProjects;

    if (category === "all") {
      filteredProjects = allProjects;
    } else {
      filteredProjects = allProjects.filter((project) => {
        if (category === "brand") {
          return (
            !project.title.toLowerCase().includes("mascot") &&
            !project.title.toLowerCase().includes("monogram") &&
            !project.title.toLowerCase().includes("gaming")
          );
        }
        if (category === "mascot") {
          return (
            project.title.toLowerCase().includes("mascot") ||
            project.title.toLowerCase().includes("character")
          );
        }
        if (category === "monogram") {
          return (
            project.title.toLowerCase().includes("monogram") ||
            project.title.toLowerCase().includes("letterform")
          );
        }
        if (category === "gaming") {
          return project.title.toLowerCase().includes("gaming");
        }
        return false;
      });
    }

    currentPage = 1;
    renderPaginatedProjects(filteredProjects);
  }

  // Set up project modal functionality
  function setupProjectModals() {
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card) => {
      card.addEventListener("click", function () {
        const projectId = parseInt(this.getAttribute("data-id"));
        const project = allProjects.find((p) => p.id === projectId);

        if (project) {
          openProjectModal(project);
        }
      });
    });
  }

  // Open project modal with details
  function openProjectModal(project) {
    const modal = document.getElementById("project-modal");
    const modalImage = document.getElementById("modal-project-image");
    const modalTitle = document.getElementById("modal-project-title");
    const modalTools = document.getElementById("modal-project-tools");
    const modalYear = document.getElementById("modal-project-year");
    const modalDescription = document.getElementById(
      "modal-project-description"
    );
    const modalTags = document.getElementById("modal-project-tags");

    modalImage.src = `images/project/${project.image}`;
    modalImage.alt = project.title;
    modalTitle.textContent = project.title;
    modalTools.textContent = project.tools.join(", ");
    modalYear.textContent = project.year;
    modalDescription.textContent = project.description;

    // Clear existing tags
    modalTags.innerHTML = '';
    project.tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = 'project-tag';
      tagElement.textContent = tag;
      modalTags.appendChild(tagElement);
    });

    // Add new tags


    // Show modal
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    const closeBtn = modal.querySelector(".modal-close");
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }
});
