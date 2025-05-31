import { initializeChatbot } from './chatbot.js';
import { initSwiper,options } from './swiper.js';
const trendingWrapper = document.querySelector("#trending");
const movieWrapper = document.querySelector("#movie");
const tvWrapper = document.querySelector("#tv");
// overlay variables
const overlay = document.querySelector(".overlay");
const detailsImage = document.querySelector(".details__image img");
const detailsType = document.querySelector(".details__type");
const detailsDate = document.querySelector(".details__date");
const detailsDescription = document.querySelector(".details__description");


if (trendingWrapper) {
  // fetch of trending movies
  fetch(
    "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
    options
  )
    .then((res) => res.json())
    //object destruction
    .then(({ results }) => {
      displaytrending(results);
      initSwiper();
    })
    .catch((err) => console.error(err));

  function displaytrending(list) {
    list.forEach((ele) => {
      let swiperSlide = document.createElement("div");
      let img = document.createElement("img");
      swiperSlide.className = "swiper-slide";
      img.src = `https://image.tmdb.org/t/p/original${ele.poster_path}`;
      img.alt = "Movie Poster";
      img.addEventListener("click", function () {
        showDetails(ele);
      });
      swiperSlide.appendChild(img);
      trendingWrapper.appendChild(swiperSlide);
    });
  }
}
// fetch   movies
if (movieWrapper) {
  fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    options
  )
    .then((res) => res.json())
    //object destruction
    .then(({ results }) => {
      displayMovie(results);
      initSwiper();
    })
    .catch((err) => console.error(err));

  function displayMovie(list) {
    list.forEach((ele) => {
      let swiperSlide = document.createElement("div");
      let img = document.createElement("img");
      swiperSlide.className = "swiper-slide";
      img.src = `https://image.tmdb.org/t/p/original${ele.poster_path}`;
      img.alt = "Movie Poster";
      img.addEventListener("click", function () {
        showDetails(ele);
      });
      swiperSlide.appendChild(img);
      movieWrapper.appendChild(swiperSlide);
    });
  }
}
if (tvWrapper) {
  // fetch tvShows
  fetch(
    "https://api.themoviedb.org/3/tv/popular?language=en-US&page=1",
    options
  )
    .then((res) => res.json())
    //object destruction
    .then(({ results }) => {
      displayTv(results);
      initSwiper();
    })
    .catch((err) => console.error(err));
  function displayTv(list) {
    list.forEach((ele) => {
      let swiperSlide = document.createElement("div");
      let img = document.createElement("img");
      swiperSlide.className = "swiper-slide";
      img.src = `https://image.tmdb.org/t/p/original${ele.poster_path}`;
      img.alt = "TV Show Poster";
      img.addEventListener("click", function () {
        showDetails(ele);
      });
      swiperSlide.appendChild(img);
      tvWrapper.appendChild(swiperSlide);
    });
  }
}
/*Show details card*/

function showDetails(ele) {
  overlay.classList.remove("hidden");
  overlay.classList.add("block");
  detailsImage.setAttribute(
    "src",
    `https://image.tmdb.org/t/p/original${
      ele.poster_path ? ele.poster_path : ""
    }`
  );
  detailsType.textContent = ele.media_type || (ele.title ? "Movie" : "TV Show");
  detailsDate.textContent = ele.release_date
    ? ele.release_date.split("").splice(0, 4).join("")
    : "2000";
  detailsDescription.textContent =
    ele.overview.split(" ").splice(0, 30).join(" ") + "......" ||
    "No avilabel over view";
}

/*Close details card*/
const closeBtn = document.querySelector(".close-btn");
if (closeBtn) {
  closeBtn.addEventListener("click", function () {
    overlay.classList.remove("block");
    overlay.classList.add("hidden");
  });
  overlay.addEventListener("click", function (e) {
    // console.log(e.target)
    if (e.target === overlay) {
      overlay.classList.remove("block");
      overlay.classList.add("hidden");
    }
  });
}
////// Log Out Logic /////
const logout = document.getElementById("logout-btn");
if (logout) {
  logout.addEventListener("click", function () {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("currentUser");
      window.location.href = "../index.html";
    }
  });
}
////// Search animation Logic /////
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

/*****search diplay logic  */

if (searchInput) {
  searchInput.addEventListener("keydown", async function (e) {
    if (e.key === "Enter") {
      let searchInputValue = searchInput.value.trim();
      if (searchInputValue !== "") {
        // console.log("Enter key was pressed!");
        // console.log(searchInputValue);
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
        // img.addEventListener("click", function () {
        //   showDetails(ele);
        // });
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
        // console.log(e.target)
        if (e.target === searchOverlay) {
          searchOverlay.classList.remove("block");
          searchOverlay.classList.add("hidden");
        }
      });
    }
  }
}

initializeChatbot()
