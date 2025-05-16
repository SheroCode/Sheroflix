const wrapper = document.querySelector(".swiper-wrapper");
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
      768: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 40 },
      1440: { slidesPerView: 4, spaceBetween: 50 },
    },
  });
}
// fetch of trending movies
fetch("https://api.themoviedb.org/3/trending/movie/day?language=en-US", options)
  .then((res) => res.json())
  //object destruction
  .then(({ results }) => {
    displayList(results);
    initSwiper();
  })
  .catch((err) => console.error(err));

function displayList(list) {
  list.forEach((ele) => {
    let swiperSlide = document.createElement("div");
    swiperSlide.className = "swiper-slide";
    swiperSlide.innerHTML = `<img  src="https://image.tmdb.org/t/p/original${ele.poster_path}" alt="Movie Poster" />`;
    wrapper.appendChild(swiperSlide);
  });
}
