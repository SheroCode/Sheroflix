const trendingWrapper = document.querySelector("#trending");
const movieWrapper = document.querySelector("#movie");
const tvWrapper = document.querySelector("#tv");
// overlay variables
const overlay = document.querySelector(".overlay");
const detailsImage = document.querySelector(".details__image img");
const detailsType = document.querySelector(".details__type");
const detailsDate = document.querySelector(".details__date");
const detailsDescription = document.querySelector(".details__description");
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZGQxMGQyYjhmNTJiYzBhNTMyMGQ1YzlkODhiZDFmZiIsIm5iZiI6MTU5Mjc1NTkwMS44MjgsInN1YiI6IjVlZWY4NmJkZWQyYWMyMDAzNTlkNGM4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NT77KLEZLjsgTMnyjJQBWADPa_t_7ydLLbvEABTxbwM",
  },
};
//swiper js
function initSwiper() {
  new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 10 },
      1024: { slidesPerView: 4, spaceBetween: 20 },
      1440: { slidesPerView: 5, spaceBetween: 30 },
    },
  });
}
// fetch of trending movies
fetch("https://api.themoviedb.org/3/trending/movie/day?language=en-US", options)
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
// fetch   movies
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

// fetch tvShows
fetch("https://api.themoviedb.org/3/tv/popular?language=en-US&page=1", options)
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
  detailsDescription.textContent = ele.overview || "No avilabel over view";
}

/*Close details card*/
document.querySelector(".close-btn").addEventListener("click", function () {
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

////===========Authentication logic=============/////
// // Signup logic
// const signupForm = document.getElementById("signupForm");
// if (signupForm) {
//   signupForm.addEventListener("submit", function (e) {
//     e.preventDefault();
//     const signupName = document.getElementById("signup-name").value.trim();
//     const signupEmail = document.getElementById("signup-email").value.trim();
//     const signupPassword = document.getElementById("signup-password").value;
//     const messageEl = document.getElementById("signupMessage");
//     // Clear previous message
//     messageEl.textContent = "";
//     messageEl.classList.remove("success");
//     // Simple validation
//     if (!signupName || !signupEmail || !signupPassword) {
//       messageEl.textContent = "All fields are required.";
//       return;
//     }
//     // Get existing users from localStorage or initialize empty array
//     let users = JSON.parse(localStorage.getItem("users")) || [];

//     // Check if email already exists
//     const userExists = users.some((user) => user.email === signupEmail); //true or false
//     if (userExists) {
//       messageEl.textContent = "User already exists. Please sign in.";
//       return;
//     }

//     const NewUser = {
//       name: signupName,
//       email: signupEmail,
//       password: signupPassword,
//     };

//     users.push(NewUser);

//     // Save updated users array to localStorage
//     localStorage.setItem("users", JSON.stringify(users));
//     messageEl.textContent = "Signup successful! Redirecting...";
//     messageEl.classList.add("success");
//     setTimeout(() => {
//       window.location.href = "signin.html";
//     }, 1500);
//   });
// }
