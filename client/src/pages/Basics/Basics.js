import React, { Component } from "react";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Weather, WeatherItem } from "../../components/WeatherList";
import { StateDropdown, StateDropdownItem } from "../../components/StateDropdown";
import { CityDropdown, CityDropdownItem } from "../../components/CityDropdown";
import "./Basics.css";

var cityPhotoA = "./01.jpg";
var cityPhotoB = "./02.jpg";
var cityPhotoC = "./03.jpg";
var indexOfPics = 0;
var randomNum = 0;
var queryWiki = "";
var listArray = [];
var dispWeatherObj = {};
var dispWeatherArray = [];
var wikiCard = "Please Select a State and a City...";

class Basics extends Component {
  state = {
    basics: [],
    usa_state: "",
    usa_city: "",
    stateList: [],
    cityList: [],
    search: "",
    results: [],
    picResults: [],
    newsResults: [],
    newsTitle: [],
    newsUrl: [],
    wikiResults: "",
    weatherArray: []
  };

  componentDidMount() {
    this.loadBasics();
  }

  loadBasics = () => {
    API.getBasics()
      .then(res => {
        this.buildStateArray(res.data);
      })
      .catch(err => console.log(err));
  };

  buildStateArray(passedData) {
    
    // sort mongo db incoming data
    function compare(a, b) {
      const idA = a._id;
      const idB = b._id;
    
      let comparison = 0;
      if (idA > idB) {
        comparison = 1;
      } else if (idA < idB) {
        comparison = -1;
      }
       return comparison;
    }
    
    passedData.sort(compare);

    this.setState({ basics: passedData,  
      usa_state: "",
      usa_city: "",
      stateList: [],
      cityList: [],
      search: "",
      results: [],
      newsResults: [],
      newsTitle: [],
      newsUrl: [],
      wikiResults: "",
      weatherArray: []}
    )
  }

  change = event => {
    for ( var s = 0; s < this.state.basics.length; s++) {
      if (this.state.basics[s].usa_state === event.target.value) {
        let tempArray = [];
        tempArray = this.state.basics[s].usa_city.split(","); 
        
        for(var u = 0; u < tempArray.length; u++) {
            tempArray[u] = toTitleCase(tempArray[u]);
        } 
        function toTitleCase() {
          return tempArray[u].replace(/\b\w*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });
        }
        
        this.setState({ 
          usa_state: event.target.value, 
          cityList: tempArray
        });
       }
    }
  }

  changeCity = event => {
    event.preventDefault();
    wikiCard = " ";
    this.setState({ 
        usa_city: event.target.value,
          search: "",
          results: [],
          newsResults: [],
          newsTitle: [],
          newsUrl: [],
          wikiResults: "",
          weatherArray: []
      }); 

    this.searchPicture(this.state.usa_state);
    if (event.target.value === "New York") {
      queryWiki = "New_York_City";
      this.searchWiki(queryWiki);
    }
    else if (this.state.usa_state === "District Of Columbia") {
      queryWiki = "Washington,_D.C.";
      this.searchWiki(queryWiki);
    }
    else {        
      queryWiki = event.target.value.split(" ").join("_") + ",_" + this.state.usa_state.split(" ").join("_");
      this.searchWiki(queryWiki);
      if (this.state.wikiResults) {
        if (this.state.wikiResults.length > 20) {
        }
        else {
          queryWiki = event.target.value.split(" ").join("_");
          this.searchWiki(queryWiki);
        }
      }
      else {
        queryWiki = event.target.value.split(" ").join("_");
          this.searchWiki(queryWiki);
      }
    }
    this.searchNews(event.target.value);
    this.searchWeather(event.target.value);
  };
 
  searchWeather = query => {
    API.searchWeatherAPI(query)
      .then(resWeather => this.setState({ weatherResults: resWeather.data.list },
        function() { this.processWeather() }
      ))
      .catch(err => console.log(err));
  };

  setWeather = query => {
    API.searchWeatherAPI(query)
    .then(resWeather => this.setState({ weatherArray: dispWeatherArray },
      function() { console.log("Weather SET") }
    ))
  };

  searchPicture = queryPic => {
    API.searchPictureAPI(queryPic)
      .then(resPic => this.setState({ picResults: resPic.data.hits },
        function() {
          if (this.state.picResults.length > 0) {
            cityPhotoB = this.state.picResults[0].largeImageURL;
            cityPhotoC = this.state.picResults[1].largeImageURL;
            indexOfPics = this.state.picResults.length;
            // use a random picture number based from the total number of possible pictures
            randomNum = [Math.floor(Math.random() * indexOfPics)];
            if (randomNum < 2) {
              randomNum = 2;
            }
            cityPhotoA = this.state.picResults[randomNum].largeImageURL;
          }
          else {
            cityPhotoA = "./01.jpg";
          };
         },
      ))
      .catch(err => console.log(err));
  };

  searchWiki = queryWiki => {
    API.searchWikiAPI(queryWiki)
    .then(resWiki => this.setState({ wikiResults: resWiki.data.query.pages[0].extract },
      function() { console.log("Wiki completed") },
      this.setState({ wikiResults: resWiki.data.query.pages[0].extract }),
      wikiCard = this.state.wikiResults
    ))
      .catch(err => console.log(err));  
  };

  searchNews = queryNews => {
    var selectedStateWith20 = this.state.usa_state.split(" ").join("%20");
    var selectedCityWith20 = queryNews.split(" ").join("%20");
    queryNews = selectedCityWith20 + "%20" + selectedStateWith20;
    API.searchNewsAPI(queryNews)
    .then(resNews => this.setState({ newsResults: resNews.data.posts },
      function() { console.log("News completed") },
      this.setState({ newsResults: resNews.data.posts })
    ))   
  }
 
 

  processWeather() {
    listArray = this.state.weatherResults;
    var weatherMonth = [];
		var weatherDay = [];
		var weatherHour = [];
		var weatherMaxTemp = [];
		var weatherMinTemp = [];
    var weatherDesc = [];
		// split up the forecast dates and times into individual variables
		 	for (var i=0; i < listArray.length; i++) {
		 		weatherMonth[i] = listArray[i].dt_txt.slice(5, 7);
		 		weatherDay[i] = listArray[i].dt_txt.slice(8, 10);
		 		weatherHour[i] = listArray[i].dt_txt.slice(11, 13);
		 		// convert kelvin temp into fahrenheit
		 		var kelvinMaxTemp = listArray[i].main.temp_max;
		 		weatherMaxTemp[i] = Math.round(((kelvinMaxTemp-273.15)*1.8)+32);
		 		var kelvinMinTemp = listArray[i].main.temp_min;
		 		weatherMinTemp[i] = Math.round(((kelvinMinTemp-273.15)*1.8)+32);
        weatherDesc[i] = listArray[i].weather[0].description;
		 	}
			var dispWeatherMonthPrev = weatherMonth[0];
			var dispWeatherDayPrev = weatherDay[0];
      var dispHighTempForDay = -999;
			var dispLowTempForDay = 999;
			var dispDescForDay = "";
      // each day returns 8 forecasts (every 3 hours), so cycle through to get overall high and low for each day
      var w = 0;
			for (var t = 0; t < listArray.length; t++) {
				if (dispWeatherDayPrev === weatherDay[t]) {
					if (dispHighTempForDay < weatherMaxTemp[t]) {
						dispHighTempForDay = weatherMaxTemp[t];
						dispDescForDay = weatherDesc[t];
					}
					if (dispLowTempForDay > weatherMinTemp[t]) {
						dispLowTempForDay = weatherMinTemp[t];
					}
				}
				else {
            dispWeatherObj = {
                "dispWeatherMonthPrev": dispWeatherMonthPrev,
                "dispWeatherDayPrev": dispWeatherDayPrev,
                "dispHighTempForDay": dispHighTempForDay,
                "dispLowTempForDay": dispLowTempForDay,
                "dispDescForDay": dispDescForDay
              };
            dispWeatherArray[w] = dispWeatherObj;
            w++;
						dispWeatherMonthPrev = weatherMonth[t];
						dispWeatherDayPrev = weatherDay[t];
						dispHighTempForDay = -999;
						dispLowTempForDay = 999;
						dispDescForDay = "";
				}
      }
      this.setWeather(this.state.usa_city);
    };
   
  render() {
    return (
      <Container fluid>
        <video id="bgVideo" loop autoPlay>
          <source src="./USA_Map.mp4" type="video/mp4" />
          <source src="./USA_Map.mp4'" type="video/ogg" />
          Your browser does not support the video tag.
      </video>
      
        <Row>
          <Col size="md-12">
            <img src={"./logocircle3.png"} alt="AmeriGuide" height="140px" />
          </Col>
        </Row>
        <Row>
          <Col size="md-6">
            {/* *********************** */}
            {/* ***  STATE DROPDOWN *** */}
            {/* *********************** */}
            {this.state.basics.length ? (
              <StateDropdown onChange={this.change} value={this.name}>
                {this.state.basics.map(basic => {
                  return (
                    <StateDropdownItem
                      key={basic._id}
                      name={basic.usa_state}
                      onChange={this.change}
                    />
                  )
                })}
              </StateDropdown>
            ) : (
                <img src={"./loading.gif"} alt="Loading..." height="70px"></img>
              )}
          </Col>
          <Col size="md-6">
            {/* ********************** */}
            {/* ***  CITY DROPDOWN *** */}
            {/* ********************** */}
    
            {this.state.cityList.length ? (
               <CityDropdown onChange={this.changeCity} value={this.name}>
            {this.state.cityList.map(city=>{
              return(
              <CityDropdownItem
                       key={city}
                      name={city}
                      onChange={this.changeCity}
                   />)
            })}</CityDropdown>
            
            ) : (
                <h3>&nbsp;</h3>
                )
              }
          </Col>
         
        </Row>
        
        <Row>
          <Col size="md-6">
          <br/>
            <Jumbotron>
              <img src={cityPhotoA} alt="United States 1" style={{height: 240, width: 400}}></img>
              <br/><br/>
              <img src={cityPhotoB} alt="United States 2" style={{height: 240, width: 400}}></img>
              <br/><br/>
              <img src={cityPhotoC} alt="United States 3" style={{height: 240, width: 400}}></img>
            </Jumbotron>
            {this.state.weatherArray.length ? (
              <Weather>
                
                {this.state.weatherArray.map(basicWeather => {
                  if(basicWeather.dispWeatherMonthPrev >" "){
                    return (
                      
                      <WeatherItem key={basicWeather.dispWeatherDayPrev} 
                          dispWeatherMonthPrev={basicWeather.dispWeatherMonthPrev} 
                          dispWeatherDayPrev={basicWeather.dispWeatherDayPrev}
                          dispHighTempForDay={basicWeather.dispHighTempForDay}
                          dispLowTempForDay={basicWeather.dispLowTempForDay}
                          dispDescForDay={basicWeather.dispDescForDay}
                          />
                    );
                  }
                })}
              </Weather>
            ) : (
            <h3>&nbsp;</h3>
            )}



          </Col>
          <Col size="md-6 sm-12">
          <br/>
            <Jumbotron>
          
            {wikiCard}
              
            </Jumbotron>
            {this.state.newsResults.length ? (
              <List>
                <h2>Recent News</h2>
                {this.state.newsResults.map(basicNews => {
                  if(basicNews.title >" "){
                    return (
                      <ListItem key={basicNews.uuid} title={basicNews.title}  url={basicNews.url}/>
                    );
                  }
                })}
              </List>
            ) : (
            <h3>&nbsp;</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Basics;
