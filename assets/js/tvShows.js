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
const GenreSections = document.querySelector("#genre-sections");

if (GenreSections) {
  async function getGenre() {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/tv/list?language=en`,
      options
    );
    const data = await res.json();
    return data.genres;
  }
  async function fetchListByGenre(genreId) {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?&with_genres=${genreId}`,
      options
    );

    const data = await res.json();
    return data.results;
  }
  function displayGenreSection(genreName, tvShows) {
    const genreSection = document.createElement("section");
    genreSection.classList.add("genre-section");
    genreSection.innerHTML = `
<h2>${genreName} TV Shows</h2>
<div class="swiper">
    <div class="swiper-wrapper">
        ${tvShows
          .map((tvShow) => {
            return `
          <div class="swiper-slide">
            <img class="swiper-slide__poster" src="https://image.tmdb.org/t/p/original${tvShow.poster_path}" data-id="${tvShow.id}"  alt="${tvShow.name}" />
          </div>
          `;
          })
          .join("")}
    </div>
    <div class="swiper-button-prev custom-prev"></div>
    <div class="swiper-button-next custom-next"></div>
</div>
  `;
    document.querySelector("#genre-sections").appendChild(genreSection);
    initSwiper();
  }

  async function fire() {
    const genres = await getGenre();
    for (const genre of genres) {
      const tvShows = await fetchListByGenre(genre.id);
      displayGenreSection(genre.name, tvShows.slice(0, 10));
    }
  }
  fire();
}

/***** Details Page Logic ******/

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("swiper-slide__poster")) {
    console.log(e.target);
    const tvshowId = e.target.dataset.id;
    window.location.href = `tvshowdetails.html?id=${tvshowId}`;
  }
});
const tvShowDetailsSection = document.querySelector(".show-details__row");

async function fetchtvShowDetails(id) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
    options
  );
  const data = await res.json();
  return data;
}
function rendertvShowDetails(tvshow) {
  tvShowDetailsSection.innerHTML = `
              <figure class="show-details__poster">
              <img src="https://image.tmdb.org/t/p/original${
                tvshow.poster_path
              }" alt=" ${tvshow.name}" />
            </figure>
            <div class="show-details__contents">
              <div class="show-details__header">
                <a href="" class="hero__btn play-btn flex"
                  ><i class="fa-solid fa-play"></i>Play</a
                >
                <h4 class="show-details__rating">
                  <span id="vote-average">${tvshow.vote_average}</span>
                  <i class="fa-solid fa-star"></i>
                </h4>
                <div class="show-details__voters">
                  <p id="vote-count">${tvshow.vote_count} Vote</p>
                </div>
              </div>
              <div class="show-details__date">
                <p id="release_date">${tvshow.last_air_date?tvshow.last_air_date.slice(0, 4):""}</p>
              </div>
              <div class="show-details__overview">
                <h4>
              ${tvshow.overview}
                </h4>
              </div>
              <div class="show-details__info">
                <div class="show-details__p">
                  <p>Name</p>
                  <span>
                    ${tvshow.name}</span
                  >
                </div>
                <div class="show-details__p">
                  <p>Created by</p>
                  <span>
                    ${tvshow.production_companies
                      .map((p) => p.name)
                      .join(" , ")}</span
                  >
                </div>
                <div class="show-details__p">
                  <p>Genre</p>
                  <span> ${tvshow.genres.map((g) => g.name).join(", ")} </span>
                </div>
              </div>
            </div>
  `;
}

const urlParams = new URLSearchParams(window.location.search);
const tvShowId = urlParams.get("id");

if (tvShowId && tvShowDetailsSection) {
  fetchtvShowDetails(tvShowId)
    .then(rendertvShowDetails)
    .catch((err) => {
      tvShowDetailsSection.innerHTML =
        "<p>tvshow details could not be loaded.</p>";
      console.error(err);
    });
}
