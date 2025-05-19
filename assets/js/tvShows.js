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

async function getGenre() {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/tv/list?language=en`,options
  );
  const data = await res.json();
  return data.genres;
}
async function fetchListByGenre(genreId) {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?&with_genres=${genreId}`,options
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
            <img src="https://image.tmdb.org/t/p/original${tvShow.poster_path}" alt="${tvShow.name}" />
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
    displayGenreSection(genre.name, tvShows.slice(0,10));
  }
}
fire();