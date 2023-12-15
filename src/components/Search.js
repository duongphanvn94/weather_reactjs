import React, {useState} from "react";

import {AsyncPaginate} from 'react-select-async-paginate';
import {searchCities} from "../api/OpenWeatherService";

import SearchCustom from "./Search/SearchCustom";

const Search = ({ onSearchChange }) => {
    const [values, setValues] = useState([])

    const loadOptions = async (innputValue) => {
        let citiesList = await searchCities(innputValue)

        return {
            options: citiesList.data.map((city) => {
                return {
                    value: `${city.latitude} ${city.longitude}`,
                    id: city.id,
                    label: city.name + ', ' + city.country,
                    params: {name : city.name, country: city.country, population: city.population},
                };
            }),
        };
    }

    const handleCitySelect = (cityParams) => {
        console.log('Selected city:', cityParams);
        if (!cityParams) {
            return false;
        }
        onSearchChange(cityParams)
    };

    console.log(values)

    return (<SearchCustom callAPI={loadOptions} setValues={setValues} onCitySelect={handleCitySelect} />)
}

export default Search