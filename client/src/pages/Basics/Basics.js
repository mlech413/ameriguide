import React, { Component } from "react";
import Jumbotron from "../../components/Jumbotron";
import DeleteBtn from "../../components/DeleteBtn";
import API from "../../utils/API";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { StateDropdown, StateDropdownItem } from "../../components/StateDropdown";
import { CityDropdown, CityDropdownItem } from "../../components/CityDropdown";
import { Input, TextArea, FormBtn } from "../../components/Form";
import "./Basics.css";

var myResults = [];
var cityPhoto = "./01.jpg";
var indexOfPics = 0;
var randomNum = 0;
var newsLength = 0;

class Basics extends Component {
  state = {
    basics: [],
    usa_state: "",
    usa_city: "",
    stateList: [],
    cityList: [],
    search: "",
    results: [],
    newsResults: [],
    newsTitle: [],
    newsUrl: []
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
    const listOfStates = passedData.map(p => p.usa_state);
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
        tempArray = this.state.basics[s].usa_city.toLowerCase().split(","); 
        for(var u = 0; u < tempArray.length; u++) {
          tempArray[u] = tempArray[u].charAt(0).toUpperCase() + tempArray[u].substr(1);
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
    // this.searchPicture(event.target.value + "+" + this.state.usa_state);
    // console.log("this.state.results=");
    // console.log(this.state.results);

    // if (this.state.results.length < 1) {
    //   this.searchPicture(this.state.usa_state + "+scenery");
    //   console.log("this.state.results=");
    //   console.log(this.state.results);
    //   if (this.state.results.length < 1) {
        this.searchPicture(this.state.usa_state);
        this.searchNews();
        // this.searchWeather(event.target.value);
        console.log("this.state.results=");
        console.log(this.state.results);
        if (this.state.results.length > 0) {
          indexOfPics = this.state.results.length;
					// use a random picture number based from the total number of possible pictures
					randomNum = [Math.floor(Math.random() * indexOfPics)];
					cityPhoto = this.state.results[randomNum].largeImageURL;
          }
    //   }
    // }

    // console.log("this.myResults=");
    // console.log(myResults);
    // this.processWeather(this.state.results);
    // setTimeout(function() {
    //   console.log("this.state.results=");
    //   console.log(this.state.results);
    //   this.processWeather(this.state.results)
    //   this.setState({ 
    //     usa_city: event.target.value
    //   }); 
    // }, 5000);
  };
  
  searchWeather = query => {
    API.searchWeatherAPI(query)
      .then(res => this.setState({ results: res.data.hits }))
      .catch(err => console.log(err));
  };


  searchPicture = queryPic => {
    API.searchPictureAPI(queryPic)
      .then(res => this.setState({ results: res.data.hits }))
      .catch(err => console.log(err));
  };

  searchNews = queryNews => {
    var threadTitle = false;
    var threadURL = "";
    var selectedStateWith20 = this.state.usa_state.split(" ").join("%20");
    var selectedCityWith20 = this.state.usa_city.split(" ").join("%20");
    var queryNews = selectedStateWith20 + "%20" + selectedCityWith20;
    API.searchNewsAPI(queryNews)
    .then(resNews => this.setState({ newsResults: resNews.data.posts }))
      .catch(err => console.log(err));
    const newsTitle = this.state.newsResults.map(p => p.title);
    const newsUrl = this.state.newsResults.map(p => p.url);
    if (this.state.newsTitle.length > 10 ) {
      newsLength = 10;
    }
    else {
      newsLength = this.state.newsTitle.length;
    }
    console.log("newsLength=" + 10)
    console.log("newsUrl:");
    console.log(newsUrl);
    console.log("newsTitle:");
    console.log(newsTitle);
    this.setState({ newsTitle: newsTitle, newsUrl: newsUrl })

  }
 
 

  processWeather(result) {
    console.log("result=");
    console.log(result);
    console.log("result.list=");
    console.log(result.list);
    var weatherMonth = [];
		var weatherDay = [];
		var weatherHour = [];
		var weatherMaxTemp = [];
		var weatherMinTemp = [];
    var weatherDesc = [];
    var listArray = [result.list]
			// split up the forecast dates and times into individual variables
			for (var i=0; i < listArray.length; i++) {
        console.log("listArray[i].dt_txt=" + listArray[i].dt_txt)
				weatherMonth[i] = result[i].dt_txt.slice(5, 7);
				weatherDay[i] = result[i].dt_txt.slice(8, 10);
				weatherHour[i] = result[i].dt_txt.slice(11, 13);
				// convert kelvin temp into fahrenheit
				var kelvinMaxTemp = result[i].main.temp_max;
				weatherMaxTemp[i] = Math.round(((kelvinMaxTemp-273.15)*1.8)+32);
				var kelvinMinTemp = result[i].main.temp_min;
				weatherMinTemp[i] = Math.round(((kelvinMinTemp-273.15)*1.8)+32);
				weatherDesc[i] = result[i].weather[0].description;
			}
			var weatherMonthPrev = weatherMonth[0];
			var weatherDayPrev = weatherDay[0];
			var highTempForDay = -999;
			var lowTempForDay = 999;
			var descForDay = "";
			var weatherHtml = "<table style='width:100%'><tr><th>Date</th><th>High</th><th>Low</th><th>Outlook</th></tr>";
			// each day returns 8 forecasts (every 3 hours), so cycle through to get overall high and low for each day
			for (var i=0; i < result.length; i++) {
				if (weatherDayPrev == weatherDay[i]) {
					if (highTempForDay < weatherMaxTemp[i]) {
						highTempForDay = weatherMaxTemp[i];
						descForDay = weatherDesc[i];
					}
					if (lowTempForDay > weatherMinTemp[i]) {
						lowTempForDay = weatherMinTemp[i];
					}
				}
				else {
					weatherHtml = weatherHtml +
						"<tr>" +
							"<td>" + weatherMonthPrev + "/" + weatherDayPrev + "</td>" +
							"<td>" + highTempForDay + "</td>" +
							"<td>" + lowTempForDay + "</td>" +
							"<td>" + descForDay + "</td>" +
						"</tr>";
						weatherMonthPrev = weatherMonth[i];
						weatherDayPrev = weatherDay[i];
						highTempForDay = -999;
						lowTempForDay = 999;
						descForDay = "";
				}
			}
			weatherHtml = weatherHtml + "</table>";
			console.log("weather card");
			// write out weather to screen
			console.log(weatherHtml);
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
                <h3>Loading...</h3>
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
                <h3></h3>
                )
              }
          </Col>
         
        </Row>
        <Row>
          <Col size="md-6">
          <br/>
            <Jumbotron>
              <img src={cityPhoto} style={{height: 240, width: 400}}></img>
            </Jumbotron>
            {/* <form>
              <Input value={this.state.usa_state} 
                    onChange={this.handleInputChange} 
                    name="usa-state" 
                    placeholder="State (required)" />
              <Input value={this.state.usa_city} 
                    onChange={this.handleInputChange} 
                    name="usa-city" 
                    placeholder="City (required)" />
              <TextArea value={this.state.usa_city} 
                    onChange={this.handleInputChange} 
                    name="usa-other" 
                    placeholder="Other City (Optional)" />
              <FormBtn onClick={this.handleSubmit}>Submit Basic</FormBtn>
            </form> */}
          </Col>
          <Col size="md-6 sm-12">
          <br/>
            <Jumbotron>
              <h1>&nbsp;</h1>
              <h1>Please Select</h1>
              <h1>a State and City</h1>
              {/* {this.state.newResults.map(newsFeed => {}
              console.log(newsFeed)  
              })}   */}
            </Jumbotron>
            {newsLength ? (
              <List>
                {this.state.newsTitle.map(basicNews => {
                  console.log(basicNews)
                  return (
                    <ListItem key={basicNews}>
                      <p>{basicNews}</p>
                    </ListItem>
                  );
                })}
              </List>
            ) : (
            <h3></h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Basics;
