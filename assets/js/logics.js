//////============= Swiper js Logic============/////
export function initSwiper() {
  const swiperContainers = document.querySelectorAll(".swiper");
  swiperContainers.forEach((container) => {
    const slides = container.querySelectorAll(".swiper-slide");
    const shouldLoop = slides.length > 4; // Only enable loop if more than 4 slides
    new Swiper(container, {
      slidesPerView: 4,
      spaceBetween: 20,
      loop: shouldLoop,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      },
    });
  });
}
//////============= Options an Api key ============/////

export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZGQxMGQyYjhmNTJiYzBhNTMyMGQ1YzlkODhiZDFmZiIsIm5iZiI6MTU5Mjc1NTkwMS44MjgsInN1YiI6IjVlZWY4NmJkZWQyYWMyMDAzNTlkNGM4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NT77KLEZLjsgTMnyjJQBWADPa_t_7ydLLbvEABTxbwM",
  },
};
//////============= Search Animation Logic ============///// 

export function handelSearchAnimation() {
  const searchIcon = document.getElementById("search-icon");
  const searchInput = document.getElementById("search-input");

  if (searchIcon) {
    searchIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      searchInput.classList.toggle("active");
      searchInput.focus();
    });

    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !searchIcon.contains(e.target)) {
        searchInput.classList.remove("active");
      }
    });
  }
}
//////============= Search Display Logic ============/////

export function handelSearchLogic() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keydown", async function (e) {
      if (e.key === "Enter") {
        let searchInputValue = searchInput.value.trim();
        if (searchInputValue !== "") {
          const results = await fetchSearchInput(searchInputValue);
          displaySearchResults(results);
          searchInput.value = "";
        }
      }
    });
    async function fetchSearchInput(searchInputValue) {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${searchInputValue}&include_adult=false&language=en-US&page=1`,
        options
      );
      const data = await res.json();
      return data.results;
    }
    function displaySearchResults(results) {
      const searchOverlay = document.querySelector(".search-overlay");
      if (results.length !== 0 && searchOverlay) {
        searchOverlay.classList.remove("hidden");
        const searchWrapper = document.getElementById("search-results-wrapper");
        searchWrapper.innerHTML = "";
        results.forEach((ele) => {
          if (ele.poster_path === "" || !ele.poster_path) return;
          let swiperSlide = document.createElement("div");
          let img = document.createElement("img");
          swiperSlide.className = "swiper-slide";
          img.src = `https://image.tmdb.org/t/p/original${ele.poster_path}`;
          img.alt = "Poster";
          swiperSlide.appendChild(img);
          searchWrapper.appendChild(swiperSlide);
        });
        initSwiper(); // reinitialize Swiper after DOM update
      }
      const searchCloseBtn = document.querySelector(".search__close-btn");
      if (searchCloseBtn) {
        searchCloseBtn.addEventListener("click", function () {
          searchOverlay.classList.remove("block");
          searchOverlay.classList.add("hidden");
        });
        searchOverlay.addEventListener("click", function (e) {
          if (e.target === searchOverlay) {
            searchOverlay.classList.remove("block");
            searchOverlay.classList.add("hidden");
          }
        });
      }
    }
  }
}
//////=============  Log Out Logic ============/////
export function handelLogout() {
  const logout = document.getElementById("logout-btn");
  if (logout) {
    logout.addEventListener("click", function () {
      if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("currentUser");
        window.location.href = "../index.html";
      }
    });
  }
}
