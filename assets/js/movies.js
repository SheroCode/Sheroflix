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
            <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}" />
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
  const genres = await getGenres(); //Array of objects
  for (const genre of genres) {
    const movies = await fetchListByGenre(genre.id);
    displayGenreSection(genre.name, movies.slice(0, 10));
  }
}
fire();
