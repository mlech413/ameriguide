import React, { Component } from "react";
import Jumbotron from "../../components/Jumbotron";
// import DeleteBtn from "../../components/DeleteBtn";
import API from "../../utils/API";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Weather, WeatherItem } from "../../components/WeatherList";
import { StateDropdown, StateDropdownItem } from "../../components/StateDropdown";
import { CityDropdown, CityDropdownItem } from "../../components/CityDropdown";
// import { Input, TextArea, FormBtn } from "../../components/Form";
import "./Basics.css";

// var myResults = [];
var cityPhotoA = "./01.jpg";
var cityPhotoB = "./02.jpg";
var cityPhotoC = "./03.jpg";
var indexOfPics = 0;
var randomNum = 0;
// var newsLength = 0;
var queryWiki = "";
var listArray = [];
// var weatherHtml = "";
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

    // console.log("passedData:")
    // console.log(passedData)
    
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
    
    // console.log(passedData.sort(compare));
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
      newsUrl: []})
  }

  change = event => {
    // event.preventDefault();
    for ( var s = 0; s < this.state.basics.length; s++) {
      if (this.state.basics[s].usa_state === event.target.value) {
        let tempArray = [];
        tempArray = this.state.basics[s].usa_city.split(","); 
        // tempArray = this.state.basics[s].usa_city.toLowerCase().split(","); 
        
        for(var u = 0; u < tempArray.length; u++) {
            tempArray[u] = toTitleCase(tempArray[u]);
          // tempArray[u] = tempArray[u].charAt(0).toUpperCase() + tempArray[u].substr(1);
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
        // console.log(tempArray)
        // console.log(this.state.cityList)
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
          newsUrl: []
      }); 
    console.log("changeCity")
    console.log("event.target.value=" + event.target.value)
    console.log("this.state.usa_state=" + this.state.usa_state)

    this.searchPicture(this.state.usa_state);
    // this.setState({ wikiResults: " " })
    if (event.target.value === "New York") {
      queryWiki = "New_York_City";
      console.log("************** 1 *************");
      this.searchWiki(queryWiki);
    }
    else if (this.state.usa_state === "District Of Columbia") {
      queryWiki = "Washington,_D.C.";
      console.log("************** 2 *************");
      this.searchWiki(queryWiki);
    }
    else {        
      queryWiki = event.target.value.split(" ").join("_") + ",_" + this.state.usa_state.split(" ").join("_");
      console.log("************** 3 *************");
      this.searchWiki(queryWiki);
      if (!this.state.wikiResults || this.state.wikiResult <= "") {
        queryWiki = event.target.value.split(" ").join("_");
        console.log("************** 4 *************");
        this.searchWiki(queryWiki);
      }
      // if (!this.state.wikiResults || this.state.wikiResult <= ""){
      //   queryWiki = this.state.usa_state.split(" ").join("_");
      //   console.log("************** 5 *************");
      //   this.searchWiki(queryWiki);
      // }
    }
    this.searchNews();
    this.searchWeather(event.target.value);
    // console.log("this.state.picResults=");
    // console.log(this.state.picResults);
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
      function() { console.log("Weather SET completed", this.state.weatherArray) },
      // this.setState({ weatherArray: dispWeatherArray })
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
        //  this.setState({ picResults: resPic.data.hits })
      ))
      .catch(err => console.log(err));
  };

  searchWiki = queryWiki => {
    API.searchWikiAPI(queryWiki)
    .then(resWiki => this.setState({ wikiResults: resWiki.data.query.pages[0].extract },
      function() { console.log("Wiki completed", this.state.wikiResults) },
      this.setState({ wikiResults: resWiki.data.query.pages[0].extract }),
      // console.log("wikiResults:"),
      // console.log(this.state.wikiResults),
      wikiCard = this.state.wikiResults
    ))
      .catch(err => console.log(err));  
  };

  searchNews = queryNews => {
    var selectedStateWith20 = this.state.usa_state.split(" ").join("%20");
    var selectedCityWith20 = this.state.usa_city.split(" ").join("%20");
    queryNews = selectedStateWith20 + "%20" + selectedCityWith20;
    API.searchNewsAPI(queryNews)
    .then(resNews => this.setState({ newsResults: resNews.data.posts },
      function() { console.log("News completed", this.state.newsResults) },
      // this.setState({ newsResults: resNews.data.posts }),
    ))   
  }
 
 

  processWeather() {
    // console.log("weatherResults=");
    // console.log(this.state.weatherResults);
    listArray = this.state.weatherResults;
    // console.log("result.list=");
    // console.log(result.list);
    var weatherMonth = [];
		var weatherDay = [];
		var weatherHour = [];
		var weatherMaxTemp = [];
		var weatherMinTemp = [];
    var weatherDesc = [];
		// split up the forecast dates and times into individual variables
		 	for (var i=0; i < listArray.length; i++) {
        //  console.log("listArray[i].dt_txt=" + listArray[i].dt_txt)
		 		weatherMonth[i] = listArray[i].dt_txt.slice(5, 7);
		 		weatherDay[i] = listArray[i].dt_txt.slice(8, 10);
		 		weatherHour[i] = listArray[i].dt_txt.slice(11, 13);
		 		// convert kelvin temp into fahrenheit
		 		var kelvinMaxTemp = listArray[i].main.temp_max;
		 		weatherMaxTemp[i] = Math.round(((kelvinMaxTemp-273.15)*1.8)+32);
		 		var kelvinMinTemp = listArray[i].main.temp_min;
		 		weatherMinTemp[i] = Math.round(((kelvinMinTemp-273.15)*1.8)+32);
        weatherDesc[i] = listArray[i].weather[0].description;
        // console.log("weatherDesc["+i+"]=" + weatherDesc[i]) 
		 	}
			var dispWeatherMonthPrev = weatherMonth[0];
			var dispWeatherDayPrev = weatherDay[0];
			// var highTempForDay = -999;
			// var lowTempForDay = 999;
      // var descForDay = "";
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
            // console.log("dispWeatherObj:");
            // console.log(dispWeatherObj);
            dispWeatherArray[w] = dispWeatherObj;
            // console.log("dispWeatherArray[" + w + "]=" + dispWeatherArray[w]);
            w++;
						dispWeatherMonthPrev = weatherMonth[t];
						dispWeatherDayPrev = weatherDay[t];
						dispHighTempForDay = -999;
						dispLowTempForDay = 999;
						dispDescForDay = "";
				}
      }
      // console.log(this.state.weatherObj);
			// console.log("weather array:");  
      // console.log(dispWeatherArray);
      this.setWeather(this.state.usa_city);
 


      // console.log("this.state.weatherArray=" + this.state.weatherArray);
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
                // <h3>Loading...</h3>
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
             
              
              {/* <p>{this.state.wikiResults}</p>
              <h1>&nbsp;</h1>
              <h1>Please Select</h1>
              <h1>a State and City</h1> */}
              
            </Jumbotron>
            {this.state.newsResults.length ? (
              <List>
                <h2>Recent News</h2>
                {this.state.newsResults.map(basicNews => {
                  // console.log(basicNews.title)
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
