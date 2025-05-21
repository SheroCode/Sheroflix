const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYzYxMjA3Yzk4MDI1ZjBkZDlkN2RjMTQ3NjJiNzcyMyIsIm5iZiI6MTc0NzM2NDkyNC4zMzcsInN1YiI6IjY4MjZhYzNjOTA1OTk2NTJhZWFkYTc5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sen0exBSPtLuOdBL55OGwo-8LcSp4CkWERe8SVa7nP4",
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
const GenreSections = document.querySelector("#genre-sections");
if (GenreSections) {
  async function getGenres() {
    const res = await fetch(
      "https://api.themoviedb.org/3/genre/movie/list?language=en",
      options
    );
    const data = await res.json();
    return data.genres; //name ,id
  }
  // console.log(getGenres())
  async function fetchListByGenre(genreId) {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?&with_genres=${genreId}`,
      options
    );
    const data = await res.json();
    return data.results;
  }

  function displayGenreSection(genreName, movies) {
    const genreSection = document.createElement("section");
    genreSection.classList.add("genre-section");
    genreSection.innerHTML = `
<h2>${genreName} Movies</h2>
<div class="swiper">
    <div class="swiper-wrapper">
        ${movies
          .map((movie) => {
            return `
          <div class="swiper-slide">
            <img class="swiper-slide__poster" data-id="${movie.id}" src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}" />
          </div>
          `;
          })
          .join("")}
    </div>
    <div class="swiper-button-prev custom-prev"></div>
    <div class="swiper-button-next custom-next"></div>
</div>
  `;
    GenreSections.appendChild(genreSection);
    initSwiper();
  }
  async function fire() {
    const genres = await getGenres(); //Array of objects
    for (const genre of genres) {
      const movies = await fetchListByGenre(genre.id);
      displayGenreSection(genre.name, movies.slice(0, 10));
    }
  }
  fire();
}
/***** Details Page Logic ******/

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("swiper-slide__poster")) {
    console.log(e.target);
    const movieId = e.target.dataset.id;
    window.location.href = `moviedetails.html?id=${movieId}`;
  }
});
const movieDetailsSection = document.querySelector(".show-details__row");

async function fetchMovieDetails(id) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    options
  );
  const data = await res.json();
  return data;
}
function renderMovieDetails(movie) {
  movieDetailsSection.innerHTML = `
              <figure class="show-details__poster">
              <img src="https://image.tmdb.org/t/p/original${
                movie.poster_path
              }" alt=" ${movie.title}" />
            </figure>
            <div class="show-details__contents">
              <div class="show-details__header">
                <a href="" class="hero__btn play-btn flex"
                  ><i class="fa-solid fa-play"></i>Play</a
                >
                <h4 class="show-details__rating">
                  <span id="vote-average">${movie.vote_average}</span>
                  <i class="fa-solid fa-star"></i>
                </h4>
                <div class="show-details__voters">
                  <p id="vote-count">${movie.vote_count} Vote</p>
                </div>
              </div>
              <div class="show-details__date">
                <p id="release_date">${movie.release_date.slice(0, 4)}</p>
              </div>
              <div class="show-details__overview">
                <h4>
              ${movie.overview}
                </h4>
              </div>
              <div class="show-details__info">
                <div class="show-details__p">
                  <p>Name</p>
                  <span>
                    ${movie.title}</span
                  >
                </div>
                <div class="show-details__p">
                  <p>Created by</p>
                  <span>
                    ${movie.production_companies
                      .map((p) => p.name)
                      .join(" , ")}</span
                  >
                </div>
                <div class="show-details__p">
                  <p>Genre</p>
                  <span> ${movie.genres.map((g) => g.name).join(", ")} </span>
                </div>
              </div>
            </div>
  `;
}

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

if (movieId && movieDetailsSection) {
  fetchMovieDetails(movieId)
    .then(renderMovieDetails)
    .catch((err) => {
      movieDetailsSection.innerHTML =
        "<p>Movie details could not be loaded.</p>";
      console.error(err);
    });
}

/****** Comments Logic Per Show ******/

const reviewForm = document.getElementById("form-comment");

if (reviewForm) {
  const commentsList = document.querySelector(".comments__list");

  // Get the current show ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const showId = urlParams.get("id");

  // Create a unique storage key per show
  const storageKey = `comments_${showId}`;

  // Load existing comments for this show
  let list = JSON.parse(localStorage.getItem(storageKey)) || [];

  // Display any existing comments on page load
  renderList(list);

  reviewForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const textarea = document.getElementById("comment-textarea");
    const userReview = textarea.value.trim();

    if (userReview !== "") {
      const obj = {
        id: Date.now(),
        comment: userReview,
      };

      list.push(obj);
      localStorage.setItem(storageKey, JSON.stringify(list)); // Save with unique key
      renderList(list);
      textarea.value = ""; // Clear the input
    }
  });

  function renderList(list) {
    commentsList.innerHTML = ""; // Clear old comments
    list.forEach((li) => {
      const listItem = document.createElement("li");
      listItem.className = "user-comment";
      listItem.textContent = li.comment;
      commentsList.appendChild(listItem);
    });
  }
}
