import './App.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Circle,
} from 'react-leaflet';
import { useState, useEffect } from 'react';

// mock from potencial database
const events = [
  { id: '3ee3rwegwegw4', name: 'Leos Party', location: [51.505, -0.09] },
  { id: 'esgergerb', name: 'Ale Party', location: [51.505, -0.087] },
  { id: '3ee3r4yrhthwegwegw4', name: 'Nick Party', location: [51.515, -0.081] },
];

const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const [selection, setSelection] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  const map = useMapEvents({
    click: (e) => {
      console.log('click', e);
      // when the user clicks we set the selection to the one from the click
      // which will in turn show a marker on that specific location
      setSelection(e.latlng);
    },
    locationfound: (e) => {
      console.log('locationfound', e);
      setPosition(e.latlng);
      setAccuracy(e.accuracy);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    // gets the location of the user and when its done triggers the locationfound method
    map.locate();
  });

  if (position === null) {
    return null;
  }
  return (
    <>
      <Marker position={position}>
        <Popup>This is where you are, give or take {accuracy} meters.</Popup>
      </Marker>
      {selection && (
        <Marker position={selection}>
          <Popup>This is your selection!</Popup>
        </Marker>
      )}
      <Circle
        center={position}
        pathOptions={{ fillColor: 'blue' }}
        radius={accuracy}
      />
    </>
  );
};

// important notes

// "center" prop is the initial coordinates in which the map is centered but can be changed according
// to your needs

// dont forget to set the height or the map will not show

function App() {
  return (
    <div className="App">
      <MapContainer
        zoom={13}
        scrollWheelZoom={false}
        center={[51.505, -0.09]}
        style={{ height: '100vh' }}
      >
        <TileLayer
          id="mapbox/streets-v11"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
          accessToken="pk.eyJ1IjoiYWxudGphbiIsImEiOiJja3Q0dnFyOG0wMm9tMnZwZGk3ajNxNW9xIn0.dAZr3O5vFdiAf-BWZx9etg"
        />
        <LocationMarker />
        {events.map(({ location, name, id }) => {
          return (
            <Marker key={id} position={location}>
              <Popup>
                This is an event <br />
                name: {name}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default App;
