fetch("http://localhost:5000/movies")
  .then((res) => {
     console.log(res)
   return res.json();
   
  })
  .then((data) => {
    console.log(data)
    console.log("Monies from server:", data);
  })
  .catch((error) => {
    console.log(("Error fetching movies:", error));
  });
