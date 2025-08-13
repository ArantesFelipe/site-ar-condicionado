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

  // Optimized Carousel Functionality
  const carouselTrack = document.getElementById("carouselTrack")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const slides = document.querySelectorAll(".carousel-slide")
  const carouselContainer = document.querySelector(".carousel-container")

  // Carousel state
  let currentIndex = 0
  const totalSlides = slides.length
  let autoPlayInterval = null
  let isUserInteracting = false
  let slidesToShow = getSlidesToShow()

  // Performance optimization - cache DOM measurements
  let slideWidth = 0
  let containerWidth = 0

  function getSlidesToShow() {
    return window.innerWidth <= 768 ? 1 : 3
  }

  function cacheMeasurements() {
    if (slides.length > 0) {
      slideWidth = slides[0].offsetWidth + 20 // including margin
      containerWidth = carouselTrack.parentElement.offsetWidth
    }
  }

  function updateCarousel(smooth = true) {
    if (slides.length === 0) return

    // Use cached measurements for better performance
    const translateX = -currentIndex * slideWidth

    // Apply transform with optional smooth transition
    carouselTrack.style.transition = smooth ? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" : "none"
    carouselTrack.style.transform = `translateX(${translateX}px)`

    // Update button states
    updateButtonStates()
  }

  function updateButtonStates() {
    // Always enable buttons for infinite loop
    prevBtn.style.opacity = "1"
    nextBtn.style.opacity = "1"
    prevBtn.disabled = false
    nextBtn.disabled = false
  }

  function goToNext() {
    currentIndex = (currentIndex + 1) % totalSlides
    updateCarousel()
  }

  function goToPrev() {
    currentIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1
    updateCarousel()
  }

  // Optimized auto-play with better performance
  function startAutoPlay() {
    if (autoPlayInterval) return // Prevent multiple intervals

    autoPlayInterval = setInterval(() => {
      if (!isUserInteracting) {
        goToNext()
      }
    }, 15000) // Exactly 15 seconds
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
      autoPlayInterval = null
    }
  }

  function restartAutoPlay() {
    stopAutoPlay()
    setTimeout(startAutoPlay, 100) // Small delay to ensure clean restart
  }

  // Event listeners with optimized interaction handling
  prevBtn.addEventListener("click", () => {
    isUserInteracting = true
    goToPrev()
    restartAutoPlay()
    setTimeout(() => {
      isUserInteracting = false
    }, 1000)
  })

  nextBtn.addEventListener("click", () => {
    isUserInteracting = true
    goToNext()
    restartAutoPlay()
    setTimeout(() => {
      isUserInteracting = false
    }, 1000)
  })

  // Optimized hover behavior
  carouselContainer.addEventListener("mouseenter", () => {
    isUserInteracting = true
    stopAutoPlay()
  })

  carouselContainer.addEventListener("mouseleave", () => {
    isUserInteracting = false
    startAutoPlay()
  })

  // Optimized touch/swipe with better performance
  let touchStartX = 0
  let touchEndX = 0
  let isSwiping = false

  carouselContainer.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX
      isSwiping = true
      isUserInteracting = true
      stopAutoPlay()
    },
    { passive: true },
  )

  carouselContainer.addEventListener(
    "touchmove",
    (e) => {
      if (!isSwiping) return
      touchEndX = e.touches[0].clientX
    },
    { passive: true },
  )

  carouselContainer.addEventListener(
    "touchend",
    () => {
      if (!isSwiping) return
      isSwiping = false

      const swipeDistance = touchStartX - touchEndX
      const minSwipeDistance = 50

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          goToNext()
        } else {
          goToPrev()
        }
      }

      setTimeout(() => {
        isUserInteracting = false
        startAutoPlay()
      }, 2000)
    },
    { passive: true },
  )

  // Optimized keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      isUserInteracting = true

      if (e.key === "ArrowLeft") {
        goToPrev()
      } else {
        goToNext()
      }

      restartAutoPlay()
      setTimeout(() => {
        isUserInteracting = false
      }, 1000)
    }
  })

  // Optimized resize handler with debouncing
  let resizeTimeout
  function handleResize() {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      const newSlidesToShow = getSlidesToShow()

      if (newSlidesToShow !== slidesToShow) {
        slidesToShow = newSlidesToShow
        currentIndex = Math.min(currentIndex, totalSlides - 1)
      }

      cacheMeasurements()
      updateCarousel(false) // No smooth transition on resize
    }, 150)
  }

  window.addEventListener("resize", handleResize)

  // Visibility API for better performance when tab is not active
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoPlay()
    } else if (!isUserInteracting) {
      startAutoPlay()
    }
  })

  // Initialize carousel with optimizations
  function initCarousel() {
    if (slides.length === 0) return

    cacheMeasurements()
    updateCarousel(false)
    startAutoPlay()

    // Preload images for better performance
    slides.forEach((slide) => {
      const img = slide.querySelector("img")
      if (img && !img.complete) {
        img.loading = "eager"
      }
    })
  }

  // Start the carousel
  initCarousel()

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const offsetTop = target.offsetTop - 80
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
