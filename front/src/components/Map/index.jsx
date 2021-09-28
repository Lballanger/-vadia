/* eslint-disable no-lone-blocks */
/* eslint-disable react/react-in-jsx-scope */
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from 'react-leaflet';
import React from 'react';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import './styles.scss';

const defaultPosition = [46.82414087601361, 2.6038539530657316];
const Map = ({
  cities,
  center = defaultPosition,
  className = '',
  zoom = 7,
}) => (
  <div className={className}>
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className="map__container"
      zoomControl={false}
      doubleClickZoom
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      {cities.map((city) => (
        <Marker
          key={`${city.city_name} ${city.population}`}
          position={city.coords}
        >
          <Popup>{city.city_name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
);
Map.propTypes = PropTypes.shape({
  cities: PropTypes.arrayOf({
    city_name: PropTypes.string,
    population: PropTypes.string,
    coords: PropTypes.arrayOf(PropTypes.number),
  }),
}).isRequired;
export default Map;
