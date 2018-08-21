import axios from "axios";

export default {
  // Gets all basics
  getBasics: function() {
    return axios.get("/api/basics");
  },
  // Gets the basic with the given id
  getBasic: function(id) {
    return axios.get("/api/basics/" + id);
  },
  // Deletes the basic with the given id
  deleteBasic: function(id) {
    return axios.delete("/api/basics/" + id);
  },
  // Saves a basic to the database
  saveBasic: function(basicData) {
    return axios.post("/api/basics", basicData);
  }
};
