import axios from "axios";

export default {
  // Gets all basics
  getBasics: function() {
    return axios.get("/api/basics");
  },
  // // Gets the basic with the given id
  // getBasic: function(id) {
  //   return axios.get("/api/basics/" + id);
  // },
  // // Deletes the basic with the given id
  // deleteBasic: function(id) {
  //   return axios.delete("/api/basics/" + id);
  // },
  // // Saves a basic to the database
  // saveBasic: function(basicData) {
  //   return axios.post("/api/basics", basicData);
  // },
  searchWeatherAPI: function(query) {
    return axios.get("https://api.openweathermap.org/data/2.5/forecast?q=" + query + ",us&mode=json&appid=b76476b1c47594e9baa38a8e8abdf0cb")
    .then(console.log("Weather query=" + query))
  },
  searchPictureAPI: function(queryPic) {
    return axios.get("https://pixabay.com/api/?key=9426516-053a04d2281391085630ae092&q=" + queryPic + "&client_id=adfe7ebf76276935093bb4be1d9597e28c6beb6d34f0fe2a590f40d3362732f9")
    .then(console.log("queryPic=" + queryPic))
  },
  searchNewsAPI: function(queryNews) {
    return axios.get("https://cors-anywhere.herokuapp.com/https://webhose.io/filterWebContent?token=bd31f441-28cc-46aa-8c99-81d3f5040fc7&format=json&sort=crawled&q=" + queryNews)
    .then(console.log("queryNews=" + queryNews))
  },
  searchWikiAPI: function(queryWiki) {
    return axios.get("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&origin=*&formatversion=2&titles=" + queryWiki + "")
    .then(console.log("queryWiki=" + queryWiki))
  }
};
