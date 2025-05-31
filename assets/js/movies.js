import { initSwiper,options } from "./swiper.js";
// =================== Fetch and Display Movies by Genre ===================
const GenreSections = document.querySelector("#genre-sections");

if (GenreSections) {
  async function getGenres() {
    const res = await fetch(
      "https://api.themoviedb.org/3/genre/movie/list?language=en",
      options
    );
    const data = await res.json();
    return data.genres;
  }

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
                .map(
                  (movie) => `
                <div class="swiper-slide">
                  <img class="swiper-slide__poster" data-id="${movie.id}"
                  src="https://image.tmdb.org/t/p/original${movie.poster_path}"
                  alt="${movie.title}" />
                </div>
              `
                )
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
    const genres = await getGenres();
    for (const genre of genres) {
      const movies = await fetchListByGenre(genre.id);
      displayGenreSection(genre.name, movies.slice(0, 10));
    }
  }

  fire();
}

// =================== Handle Poster Click ===================
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("swiper-slide__poster")) {
    const movieId = e.target.dataset.id;
    window.location.href = `moviedetails.html?id=${movieId}`;
  }
});

// =================== Details Page ===================
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
      <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${
    movie.title
  }" />
    </figure>
    <div class="show-details__contents">
      <div class="show-details__header">
        <a href="#" class="hero__btn play-btn flex" data-id="${movie.id}">
          <i class="fa-solid fa-play"></i>Play
        </a>
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
        <h4>${movie.overview}</h4>
      </div>
      <div class="show-details__info">
        <div class="show-details__p">
          <p>Name</p>
          <span>${movie.title}</span>
        </div>
        <div class="show-details__p">
          <p>Created by</p>
          <span>${movie.production_companies
            .map((p) => p.name)
            .slice(0, 3)
            .join(" , ")}</span>
        </div>
        <div class="show-details__p">
          <p>Genre</p>
          <span>${movie.genres.map((g) => g.name).join(" , ")}</span>
        </div>
      </div>
    </div>
  `;

  // ✅ Attach play button click event after rendering
  const playBtn = document.querySelector(".play-btn");
  if (playBtn) {
    playBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const movieId = playBtn.getAttribute("data-id");
      displayVideo(movieId);
    });
  }
}

// =================== Load Movie Details ===================
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

// =================== Comment Section ===================
const reviewForm = document.getElementById("form-comment");

if (reviewForm) {
  const commentsList = document.querySelector(".comments__list");
  const showId = urlParams.get("id");
  const storageKey = `comments_${showId}`;
  let list = JSON.parse(localStorage.getItem(storageKey)) || [];

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
      localStorage.setItem(storageKey, JSON.stringify(list));
      renderList(list);
      textarea.value = "";
    }
  });

  function renderList(list) {
    commentsList.innerHTML = "";
    list.forEach((li) => {
      const listItem = document.createElement("li");
      listItem.className = "user-comment";
      listItem.textContent = li.comment;
      commentsList.appendChild(listItem);
    });
  }
}

// =================== Display Movie Video ===================
const movieVideo = document.querySelector(".movie-video");

async function fetchMovieVideo(movieId) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
    options
  );
  const data = await res.json();
  return data.results;
}

async function displayVideo(movieId) {
  const videos = await fetchMovieVideo(movieId);
  const trailer = videos.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  if (trailer) {
    movieVideo.classList.remove("hidden");
    movieVideo.innerHTML = `
      <iframe width="100%" height="100%" 
        src="https://www.youtube.com/embed/${trailer.key}" 
        frameborder="0" 
        allowfullscreen>
      </iframe>
    `;
  } else {
    movieVideo.innerHTML = `<p>No trailer available.</p>`;
  }
}
