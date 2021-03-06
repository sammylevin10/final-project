import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import { Ellipsis } from "react-spinners-css";

function Home({ postsArray, geolocation }) {
  const [bike, setBike] = useState(true);
  const [radius, setRadius] = useState(50);
  const [location, setLocation] = useState(null);
  let postsDisplayed = 0;

  // When the props passed from geolocated package change,
  // Set the state of location to the coords object of props
  useEffect(() => {
    if (geolocation) {
      setLocation(geolocation);
    }
  }, [geolocation]);

  function withinRadius(lat1, lng1, radius) {
    let lat2 = location.latitude;
    let lng2 = location.longitude;
    let factor1 = Math.pow(lat2 - lat1, 2);
    let factor2 = Math.pow(lng2 - lng1, 2);
    let distanceInDegrees = Math.sqrt(factor1 + factor2);
    let distanceInKm = distanceInDegrees * 111;
    if (distanceInKm < radius) {
      return true;
    } else {
      return false;
    }
  }

  function handleBikeRun(e) {
    e.preventDefault();
    let value = e.currentTarget.value;
    if (value === "cycling") {
      setBike(true);
    } else {
      setBike(false);
    }
  }

  function handleRadius(e) {
    e.preventDefault();
    let value = e.currentTarget.value;
    if (value === "inf") {
      setRadius(40000);
    } else {
      setRadius(parseInt(value));
    }
  }

  if (postsArray && location) {
    return (
      <div className="Home">
        <p className="TrailParameters">
          Find{" "}
          <select name="bikeRun" onChange={(e) => handleBikeRun(e)}>
            <option value="cycling">cycling</option>
            <option value="running">running</option>
          </select>{" "}
          trails that are within{" "}
          <select name="radius" onChange={(e) => handleRadius(e)}>
            <option value="50">50 km</option>
            <option value="150">150 km</option>
            <option value="300">300 km</option>
            <option value="inf">∞ km</option>
          </select>{" "}
          of my current location
        </p>
        {/* Data.map(element, iterator) is a function that acts like an enhanced for loop. It parses through each element in the iterable type */}
        {/* For every object in addData, generate Post */}
        {postsArray.map((postData, i) => {
          if (i == 0) {
            postsDisplayed = 0;
          }
          if (
            withinRadius(postData.lat, postData.lng, radius) &&
            postData.bike == bike
          ) {
            postsDisplayed += 1;
            return <Post key={i} data={postData} />;
          }
          if (postsArray.length == i + 1 && postsDisplayed == 0) {
            return (
              <p className="ErrorText">
                Uh oh! There are no listed trails within your local radius.
              </p>
            );
          }
        })}
      </div>
    );
  } else {
    return (
      <div className="Home">
        <h2 className="FixedTitle">Finding trails near you...</h2>
        <div className="HomeContainer">
          <div className="LoadingWrapper">
            <Ellipsis color="#2eb157" size={100} />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
