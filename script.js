document.addEventListener("DOMContentLoaded", () => {
  // Add loading animation
  setTimeout(() => {
    document.querySelectorAll(".loading").forEach((el) => {
      el.style.opacity = "1"
    })
  }, 100)

  // Navigation Menu Toggle
  const menuBtn = document.getElementById("menuBtn")
  const navDropdown = document.getElementById("navDropdown")

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    navDropdown.classList.toggle("active")
  })

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!navDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
      navDropdown.classList.remove("active")
    }
  })

  // Close dropdown when clicking on a link
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navDropdown.classList.remove("active")
    })
  })

  // Carousel Functionality
  const carouselTrack = document.getElementById("carouselTrack")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const slides = document.querySelectorAll(".carousel-slide")

  let currentIndex = 0
  const totalSlides = slides.length
  let slidesToShow = getSlidesToShow()
  let maxIndex = totalSlides - slidesToShow

  function getSlidesToShow() {
    if (window.innerWidth <= 768) return 1
    return 3
  }

  function updateCarousel() {
    if (slides.length === 0) return

    const slideWidth = slides[0].offsetWidth + 20 // including margin
    const translateX = -currentIndex * slideWidth
    carouselTrack.style.transform = `translateX(${translateX}px)`

    // Update button states
    prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1"
    nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1"
    prevBtn.disabled = currentIndex === 0
    nextBtn.disabled = currentIndex >= maxIndex
  }

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--
      updateCarousel()
      stopAutoPlay()
      setTimeout(startAutoPlay, 5000)
    }
  })

  nextBtn.addEventListener("click", () => {
    if (currentIndex < maxIndex) {
      currentIndex++
      updateCarousel()
      stopAutoPlay()
      setTimeout(startAutoPlay, 5000)
    }
  })

  // Handle window resize
  let resizeTimeout
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      slidesToShow = getSlidesToShow()
      maxIndex = totalSlides - slidesToShow

      if (currentIndex > maxIndex) {
        currentIndex = Math.max(0, maxIndex)
      }

      updateCarousel()
    }, 250)
  })

  // Auto-play carousel
  let autoPlayInterval

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      if (currentIndex < maxIndex) {
        currentIndex++
      } else {
        currentIndex = 0
      }
      updateCarousel()
    }, 15000) // Alterado de 4000 para 15000 (15 segundos)
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval)
  }

  // Pause auto-play on hover
  const carouselContainer = document.querySelector(".carousel-container")
  carouselContainer.addEventListener("mouseenter", stopAutoPlay)
  carouselContainer.addEventListener("mouseleave", startAutoPlay)

  // Touch/swipe support for mobile
  let startX = 0
  let currentX = 0
  let isDragging = false

  carouselContainer.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX
    isDragging = true
    stopAutoPlay()
  })

  carouselContainer.addEventListener("touchmove", (e) => {
    if (!isDragging) return
    currentX = e.touches[0].clientX
  })

  carouselContainer.addEventListener("touchend", (e) => {
    if (!isDragging) return
    isDragging = false

    const diffX = startX - currentX
    const threshold = 50

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && currentIndex < maxIndex) {
        currentIndex++
      } else if (diffX < 0 && currentIndex > 0) {
        currentIndex--
      }
      updateCarousel()
    }

    setTimeout(startAutoPlay, 3000)
  })

  // Initialize carousel
  updateCarousel()
  startAutoPlay()

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const offsetTop = target.offsetTop - 80 // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Enhanced navbar scroll effect
  let ticking = false

  function updateNavbar() {
    const navbar = document.querySelector(".navbar")
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
    ticking = false
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar)
      ticking = true
    }
  })

  // Keyboard navigation for carousel
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && currentIndex > 0) {
      currentIndex--
      updateCarousel()
      stopAutoPlay()
      setTimeout(startAutoPlay, 5000)
    } else if (e.key === "ArrowRight" && currentIndex < maxIndex) {
      currentIndex++
      updateCarousel()
      stopAutoPlay()
      setTimeout(startAutoPlay, 5000)
    }
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe service cards
  document.querySelectorAll(".service-card").forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(card)
  })
})
