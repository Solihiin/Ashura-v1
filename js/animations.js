// Animations.js

// Inisialisasi GSAP + ScrollTrigger
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ✨ Fade-in untuk setiap section saat muncul
gsap.utils.toArray("section").forEach(section => {
  gsap.from(section, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top 80%",  // mulai saat bagian atas section mencapai 80% viewport
      toggleActions: "play none none none"
    }
  });
});

// ✨ Navbar masuk dari atas saat halaman load
gsap.from(".navbar", {
  y: -100,
  opacity: 0,
  duration: 1,
  ease: "power2.out"
});

// ✨ Hero image masuk dari kanan, teks dari kiri
gsap.from(".hero-text", {
  x: -100,
  opacity: 0,
  duration: 1,
  ease: "power2.out"
});
gsap.from(".hero-image", {
  x: 100,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  delay: 0.3
});

// ✨ Smooth scroll ke section saat klik anchor
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    e.preventDefault();

    const targetId = anchor.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      gsap.to(window, {
        scrollTo: {
          y: targetElement,
          offsetY: 80 // jika ada navbar fixed, sesuaikan offset-nya
        },
        duration: 1,
        ease: "power2.inOut"
      });
    }
  });
});

// ✨ Scroll-to untuk pagination (ini harus dipanggil di project.js juga)
function scrollToProjectsSection() {
  const projectsSection = document.querySelector('.projects');
  if (projectsSection) {
    gsap.to(window, {
      scrollTo: {
        y: projectsSection,
        offsetY: 80
      },
      duration: 1,
      ease: 'power2.inOut'
    });
  }
}

// Ekspor fungsi jika dipakai di file lain
window.scrollToProjectsSection = scrollToProjectsSection;
