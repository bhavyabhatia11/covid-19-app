import React, { useState,useEffect } from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent
} from "@material-ui/core"
import './App.css';
import InfoBox from"./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph"
import { sortData, prettyPrintStat } from "./util";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";

function App() {
  const [countries, setCountries] = useState([]);
  const [CountryCode, setCountry] = useState("worldwide");
  const[CountryInfo, setCountryInfo] = useState({});
  const [mapCountries, setMapCountries] = useState([]);
  const[TableData, setTableData] = useState([]);
const [mapCenter, setMapCenter] = useState({lat: 33.8869, lng: 9.5375});
  const[casesType,setCasesType] = useState("cases");

const[mapZoom, setMapZoom] = useState(2);
  useEffect(()=>{
    const url = "https://disease.sh/v3/covid-19/all" 

    fetch(url)
    .then(response => response.json())
    .then(data =>{
     
      setCountry(CountryCode);
      setCountryInfo(data);
     
     
     
     
    });

  },[]);

  useEffect(()=>{
    //async
    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then ((data)=>{
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,  
        }));

        
        const sortedData = sortData(data);
        setMapCountries(data);
        setTableData(sortedData);
        setCountries(countries);
      });
    };

    getCountriesData();
  },[]);



  const onCountryChange= async (event) => {
      const CountryCode = event.target.value;
      setCountry(CountryCode);

      const url= CountryCode === 'worldwide' ? 
      "https://disease.sh/v3/covid-19/all" : 
      `https://disease.sh/v3/covid-19/countries/${CountryCode}`;

      await fetch(url)
      .then(response => response.json())
      .then(data =>{
        setCountry(CountryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
        console.log(data);
      })
  };

 
  return (
    <div className="app">
      <div className="app_left">
            <div className="app_header">
            <h1> Covid-19 Tracker </h1>
              <FormControl className="app_dropdown">
                <Select
                variant ="outlined"
                onChange = {onCountryChange}
                value = {CountryCode}
                > 
                  <MenuItem value = "worldwide" > Worldwide </MenuItem>
                  { 
                    countries.map((country) => (
                      <MenuItem value = {country.value} > {country.name} </MenuItem>
                    ))
                  }

                </Select>
              </FormControl>

            </div>
            <div className="app_stats">
            <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isBlue
            active={casesType === "cases"}
            cases={prettyPrintStat(CountryInfo.todayCases)}
            total={numeral(CountryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(CountryInfo.todayRecovered)}
            total={numeral(CountryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(CountryInfo.todayDeaths)}
            total={numeral(CountryInfo.deaths).format("0.0a")}
          />

            </div>

            <Map countries = {mapCountries} casesType = {casesType } center= {mapCenter}
            zoom = {mapZoom} />
      </div>
      <Card className="app_right">
        <CardContent>
              <h1>
                Live cases By Country
              </h1>
              <Table countries ={TableData}>

              </Table>
              <h2 className="app_graphTitle">
                Worldwide New {casesType}
              </h2>
              <LineGraph  className="app_graph"  casesType ={casesType}/>
        </CardContent>

      </Card>
     

    </div>
  );
}

export default App;
