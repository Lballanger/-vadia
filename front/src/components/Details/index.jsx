/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { IoStar, IoStarOutline, IoSchool } from 'react-icons/io5';
import {
  GiHealthNormal,
  GiHealing,
  GiShop,
  GiMoneyStack,
} from 'react-icons/gi';
import toast from 'react-hot-toast';
import Map from '../Map';
import cityStore from '../../store/city';
import userStore from '../../store/user';
import useWindowSize from '../../hooks/useWindowSize';
import API from '../../api';
import Dropdown from './MenuMobile/Dropdown';

import './styles.scss';
import BtnDesktop from './BtnDesktop/BtnDesktop';
import mapStore from '../../store/map';

// eslint-disable-next-line react/prop-types
const Details = () => {
  const { codeInsee } = useParams();
  const history = useHistory();
  const city = cityStore((state) => state.city);
  const setCity = cityStore((state) => state.setCity);
  const addToFavorites = cityStore((state) => state.addToFavorites);
  const removeFromFavorites = cityStore((state) => state.removeFromFavorites);
  const user = userStore((state) => state.user);
  const setMarkers = mapStore((state) => state.setMarkers);
  const setMapCenter = mapStore((state) => state.setMapCenter);
  const setMapZoom = mapStore((state) => state.setMapZoom);
  const [loading, setLoading] = useState(true);

  const showFavorite = () => {
    if (city.is_favorite) {
      return <IoStar className="favorite" color="#dcb525" size="1.5em" />;
    }
    return <IoStarOutline className="favorite" color="#dcb525" size="1.5em" />;
  };

  const toggleFavorite = async () => {
    if (user) {
      const { data } = await API.cityToFavorites(city.code_insee, true);
      if (data.status === 'added') {
        addToFavorites(city, true);
        toast.success(`${city.city_name} a bien été ajouté à vos favoris`);
      } else if (data.status === 'removed') {
        removeFromFavorites(city, true);
        toast.success(`${city.city_name} a été retiré de vos favoris`);
      }
    } else {
      toast.error(
        `Vous devez être connecté pour pouvoir ajouter une ville en favoris`
      );
    }
  };

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    const getCity = async () => {
      try {
        const data = await API.getCityByInsee(codeInsee);
        if (!data.city_name) throw new Error('City not found');
        setCity(data);
        const commerceMarkers =
          data.commerce !== null
            ? [...data.commerce].map((commerce) => {
                const coords = commerce.coordinates
                  .slice(1, -1)
                  .split(',')
                  .map((val) => +val);
                return {
                  type: commerce.type,
                  name: commerce.name,
                  coords,
                };
              })
            : [];
        setMarkers([
          ...commerceMarkers,
          {
            name: data.city_name,
            type: 'city',
            coords: [data.coordinates.x, data.coordinates.y],
          },
        ]);
        setMapCenter(data.coordinates.x, data.coordinates.y);
        setMapZoom(12);
      } catch (error) {
        return history.push('/404');
      } finally {
        setLoading(false);
      }
    };
    getCity();
  }, [codeInsee]);

  if (loading) return 'Loading...'; // TODO: Implementer un loader

  return (
    <div className="details__container">
      <div className="details__new__search" style={{ display: 'flex' }}>
        <Dropdown />
      </div>

      <div className="details__card">
        <div className="details__card__main">
          <BtnDesktop />
          <div className="details__card__titre">
            <p className="details__card__titre__p">{city.city_name}</p>
            <button
              className="details__card__button"
              type="button"
              onClick={toggleFavorite}
            >
              {showFavorite()}
            </button>
          </div>
          <div className="details__card__main__info">
            <ul className="details__card__main__ul">
              <li className="details__card__main__li">
                Code Postal : {city.code_postal[0]}
              </li>
              <li className="details__card__main__li">
                Internet (couverture) :{' '}
                {city.internet
                  ? `${city.internet[0].coverage}%`
                  : 'Non renseigné'}
              </li>
              <li className="details__card__main__li">
                Population: {city.population}
              </li>
            </ul>
          </div>
        </div>
        <div className="details__card__main__display">
          <div
            className={`details__card__main__display__parent ${
              !city.health_institution ? 'disabled' : ''
            }`}
          >
            <div className="details__card__main__display__cadres">
              <GiHealthNormal
                className="details__card__main__display__cadres__icon"
                color="green"
                size="2.6rem"
              />
              <span className="details__card__main__display__cadres__text">
                Etablissement de santé
              </span>
            </div>
          </div>

          <div
            className={`details__card__main__display__parent ${
              !city.health_personal ? 'disabled' : ''
            }`}
          >
            <div className="details__card__main__display__cadres">
              <GiHealing
                className="details__card__main__display__cadres__icon"
                color="green"
                size="2.6rem"
              />
              <span className="details__card__main__display__cadres__text">
                Personnel de santé
              </span>
            </div>
          </div>

          <div
            className={`details__card__main__display__parent ${
              !city.commerce ? 'disabled' : ''
            }`}
          >
            <div className="details__card__main__display__cadres">
              <GiShop
                className="details__card__main__display__cadres__icon"
                color="green"
                size="2.6rem"
              />
              <span className="details__card__main__display__cadres__text">
                Commerces
              </span>
            </div>
          </div>

          <div
            className={`details__card__main__display__parent ${
              !city.taxation ? 'disabled' : ''
            }`}
          >
            <div className="details__card__main__display__cadres">
              <GiMoneyStack
                className="details__card__main__display__cadres__icon"
                color="green"
                size="2.6rem"
              />
              <span className="details__card__main__display__cadres__text">
                Taxation
              </span>
            </div>
          </div>

          <div
            className={`details__card__main__display__parent ${
              !city.schools ? 'disabled' : ''
            }`}
          >
            <div className="details__card__main__display__cadres">
              <IoSchool
                className="details__card__main__display__cadres__icon"
                color="green"
                size="2.6rem"
              />
              <span className="details__card__main__display__cadres__text">
                Ecoles
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Details;
