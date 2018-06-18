import React, { Component } from "react";
import styled from "styled-components";
import { Toggle } from "./Toggle";
import { Button } from "./Button";
import { Search } from "./Search";
import { List, ListItem } from "./List";

const Wrapper = styled.aside`
    height: 100vh;
    overflow-y: auto;
    background: #eeeeee;
    padding: 10px;
    box-shadow: 0px 0px 4px 0px #00000070;
    z-index: 2;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 300px;
    transition: all ease .5s;
`;

class Sidebar extends Component {
  state = {
    locations: [],
    active: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.markers !== this.props.markers) {
      this.setState({ locations: nextProps.markers });
    }
  }


  /**
   * Performs toggle of sidebar
   */

   toggleClass() {

    let sidetoggle = document.getElementsByTagName("aside")[0];

    sidetoggle.classList.toggle("toggled");

  };


  /**
   * Performs a search on map markers
   */
  searchLocations = e => {
    const { value } = e.target;
    const { markers, closeInfoWindow } = this.props;

    // Close info window before starting to search
    closeInfoWindow();

    const filteredLocations = markers.filter(location => {
      // Regular expression to match the value if it contains in str
      // gi = global and case insensitive
      const strToMatch = new RegExp(value, "gi");
      if (location.title.match(strToMatch)) {
        location.setVisible(true);
      } else {
        location.setVisible(false);
      }

      return location.title.match(strToMatch);
    });

    // Update locations state with filtered locations
    this.setState({ locations: filteredLocations });
  };

  render() {
    const { openInfoWindow } = this.props;
    const { locations } = this.state;

    return (
      <Wrapper>
        <h2 tabIndex="1">Historic places in Split</h2>

        <Toggle
          onClick={this.toggleClass}
          aria-label="Toggle"
          tabIndex="1"
        >

        </Toggle>

        <Button
          onClick={this.props.showMarkers}
          aria-label="Show all markers"
          tabIndex="1"
        >
          Show
        </Button>
        <Button
          onClick={this.props.hideMarkers}
          aria-label="Hide all markers"
          tabIndex="1"
        >
          Hide
        </Button>
        <Search
          type="text"
          placeholder="Search"
          onChange={this.searchLocations}
          aria-label="Search places"
          tabIndex="1"
        />
        <List role="list" aria-label="Museums" tabIndex="1">
          {locations.map((marker, index) => (
            <ListItem
              tabIndex="1"
              role="listitem"
              key={index}
              onClick={() => openInfoWindow(marker)}
            >
              {marker.title}
            </ListItem>
          ))}
        </List>
      </Wrapper>
    );
  }
}

export default Sidebar;
