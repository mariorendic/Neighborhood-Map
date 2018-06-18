import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { museumPlaces, mapStyles } from "../../lib/constants";
import axios from "axios";
import Sidebar from "../Sidebar";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  font-family: "Roboto", sans-serif;
  color: #000;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const MapDiv = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
`;

class MapContainer extends Component {
  state = {
    locations: museumPlaces,
    defaultMapZoom: 17,
    center: {
      lat: 43.5087747,
      lng: 16.4391097
    },
    mapType: "roadmap",
    iconSize: 30,
    mapTypeControl: false,
    markers: [],
    infoWindow: "",
    markerDetails: {
      name: null,
      address: null,
      url: null,
      img: null,
      phone: {
        formattedPhone: null,
        phone: null
      },
      rating: null
    }
  };

  componentDidMount() {
    this.loadMap();
  }

  /**
   * Loads a google map
   */
  loadMap = () => {
    if (this.props && this.props.google) {
      const { google } = this.props;
      const maps = google.maps;

      const { defaultMapZoom, center, mapType } = this.state;

      const mapRef = this.refs.map; // looks for HTML div ref 'map'. Returned in render below
      const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node

      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: defaultMapZoom,
          mapTypeId: mapType,
          styles: mapStyles
        }
      );

      // Create info window
      const infoWindow = new google.maps.InfoWindow({ maxWidth: 200 });
      //infoWindow.setOptions({ maxWidth: 300 });
      this.setState({ infoWindow: infoWindow });

      // creates a new Google map on the specified configuration set above
      this.map = new maps.Map(node, mapConfig);

      this.addMarkers();
    }
  };

  /**
   * Adds markers to a map from State
   */
  addMarkers = () => {
    const { google } = this.props;
    const { iconSize, locations } = this.state;
    const markers = [];

    // Create an Marker Icon
    const museumIcon = {
      url: "./img/museum-icon.png",
      size: new google.maps.Size(iconSize, iconSize),
      scaledSize: new google.maps.Size(iconSize, iconSize)
    };

    // Initialize markers
    locations.forEach((location, index) => {
      const marker = new google.maps.Marker({
        map: this.map,
        position: { lat: location.location.lat, lng: location.location.lng },
        title: location.name,
        animation: google.maps.Animation.DROP,
        id: index,
        icon: museumIcon,
        anchorPoint: new google.maps.Point(0, -30)
      });

      // Push the markers to array of markers
      markers.push(marker);

      marker.addListener("click", () => {
        this.openInfoWindow(marker);
      });
    });

    // Set up the markers state
    this.setState({ markers });
  };

  /**
   * Opens info window for the marker
   * @param {object} marker - Marker object
   */
  openInfoWindow = marker => {
    const { map } = this;
    const { infoWindow } = this.state;
    // Check if the infoWindow is not already opened for this marker
    if (infoWindow.marker !== marker) {
      infoWindow.marker = marker;
      infoWindow.setContent(`Loading...`);
      infoWindow.open(this.map, marker);

      // Clear the marker property when closed
      infoWindow.addListener("closeclick", () => {
        infoWindow.setMarker = null;
      });
    }

    this.getMarkerDetails(marker);

    // Center map to a marker position
    map.panTo(marker.getPosition());
  };

  /**
   * Gets all the details for marker from
   * Foursquare API
   * @param {object} marker - Marker object
   */
  getMarkerDetails = marker => {
    const clientId = "ZWIQ2CGPMVFJ5IGJLNOC1JCNR0FWLK32ENCSW21504K1HCTF";
    const clientSecret = "EHDLJW5RB2YZORXLGH23VC1VMC25RSZNVRDNTLCI3J4XI2AW";
    const { infoWindow } = this.state;

    // Venues Search
    axios
      .get("https://api.foursquare.com/v2/venues/search", {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          ll: `${marker.getPosition().lat()},${marker.getPosition().lng()}`,
          v: "20180323",
          query: marker.title,
          limit: 1
        }
      })
      .then(res => {
        const venueId = res.data.response.venues[0].id;

        return axios.get(`https://api.foursquare.com/v2/venues/${venueId}`, {
          params: {
            client_id: clientId,
            client_secret: clientSecret,
            v: "20180323"
          }
        });
      })
      .then(res => {
        // Set variables and update the state
        const { venue } = res.data.response;

        const name = venue.name;
        const address = venue.location.formattedAddress.join(", ");
        const url = venue.url;
        const img = `${venue.bestPhoto.prefix}200x200${venue.bestPhoto.suffix}`;
        const phone = {
          formattedPhone: venue.contact.formattedPhone,
          phone: venue.contact.phone
        };
        const rating = venue.rating;

        this.setState({
          markerDetails: {
            name,
            address,
            url,
            img,
            phone,
            rating
          }
        });
      })
      .then(res => {
        // Retrieve details from state and create content for infoWindow
        const {
          name,
          address,
          url,
          img,
          phone,
          rating
        } = this.state.markerDetails;

        const phoneField =
          phone.phone !== undefined
            ? `<a href="tel:${phone.phone}">${phone.formattedPhone}</a>`
            : "";
        const urlField =
          url !== undefined ? `<a href=${url} target="_blank">${url}</a>` : "";
        const ratingField =
          rating !== undefined
            ? `<span><b>${rating}</b></span>`
            : "not available";
        const imgField =
          img !== undefined ? `<img src=${img} alt=${name} />` : "";

        const content = `
          <div style="width: 100%;">
            <h2>${name}</h2>
            <p>${address}</p>
            <p>${phoneField}</p>
            <p>${urlField}</p>
            <p>Rating: ${ratingField}</p>
            <div style='width: 100%; text-align: center'>${imgField}</div>
            <img style="width: 100%" src="./img/byFoursquare.png" />
          </div>
        `;

        // Set the infoWindow content
        infoWindow.setContent(content);
      })
      .catch(err => {
        console.log("Error", err);
      });
  };

  /**
   * Closes the Info Window
   */
  closeInfoWindow = () => {
    this.state.infoWindow.close();
  };

  /**
   * Hides all markers from map
   */
  hideMarkers = () => {
    const { markers } = this.state;

    markers.forEach(marker => {
      marker.setMap(null);
    });
  };

  /**
   * Show all markers to map
   */
  showMarkers = () => {
    const { markers } = this.state;

    markers.forEach(marker => {
      marker.setMap(this.map);
    });
  };

  updateMarkers = markers => {
    this.setState({ markers });
  };

  render() {
    const { markers, locations } = this.state;

    return (
      <Wrapper>
        <Sidebar
          locations={locations}
          markers={markers}
          showMarkers={this.showMarkers}
          hideMarkers={this.hideMarkers}
          openInfoWindow={this.openInfoWindow}
          closeInfoWindow={this.closeInfoWindow}
          searchLocations={this.searchLocations}
        />
        <MapDiv role="application" ref="map">
          loading map...
        </MapDiv>
      </Wrapper>
    );
  }
}

export default MapContainer;
