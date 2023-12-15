import {ALL_DESCRIPTIONS} from "./DateConstants";

export const dayDataHandle = (
    response,
    current_date,
    current_datetime
) => {
    let all_today_forecasts = [];

    if (!response || Object.keys(response).length === 0 || response.cod === '404')
        return [];
    else
        response?.list.slice().map((item) => {
            if (item.dt_txt.startsWith(current_date.substring(0, 10))) {
                if (item.dt > current_datetime) {
                    all_today_forecasts.push({
                        time: item.dt_txt.split(' ')[1].substring(0, 5),
                        icon: item.weather[0].icon,
                        temperature: Math.round(item.main.temp) + ' °C',
                    });
                }
            }
            return all_today_forecasts;
        });

    if (all_today_forecasts.length < 7) {
        return [...all_today_forecasts];
    } else {
        return all_today_forecasts.slice(-6);
    }
};

export const getWeekForecast = (
    response,
    allDescription
) => {
    let foreacast_data = [];
    let descriptions_data = [];

    if (!response || Object.keys(response).length === 0 || response.cod === '404')
        return [];
    else
        response?.list.slice().map((item, idx) => {
            let date = item.dt_txt.substring(0, 10)
            if (typeof descriptions_data[date] === 'undefined') {
                descriptions_data[date] = []
                foreacast_data[date] = []
            }
            descriptions_data[date].push({
                description: item.weather[0].description,
            });
            foreacast_data[date].push({
                temp: item.main.temp,
                humidity: item.main.humidity,
                wind: item.wind.speed,
                clouds: item.clouds.all,
            });

            return { idx, item };
        });

    const description_keys = Object.keys(descriptions_data);
    let dayAvgsList = [];

    description_keys.forEach((key) => {
        let singleDayDescriptions = descriptions_data[key].map(
            (item) => item.description
        );
        let mostFrequentDescription = getMostFrequentWeather(singleDayDescriptions);
        // dayDescList.push(mostFrequentDescription);

        let dayTempsList = [];
        let dayHumidityList = [];
        let dayWindList = [];
        let dayCloudsList = [];

        for (let i = 0; i < foreacast_data[key].length; i++) {
            dayTempsList.push(foreacast_data[key][i].temp);
            dayHumidityList.push(foreacast_data[key][i].humidity);
            dayWindList.push(foreacast_data[key][i].wind);
            dayCloudsList.push(foreacast_data[key][i].clouds);
        }

        dayAvgsList.push({
            date: key,
            temp: getAverage(dayTempsList),
            humidity: getAverage(dayHumidityList),
            wind: getAverage(dayWindList, false),
            clouds: getAverage(dayCloudsList),
            description: mostFrequentDescription,
            icon: descriptionToIconName(mostFrequentDescription, allDescription),
        });
    });
    return dayAvgsList;
}

export function groupBy(key) {
    return function group(array) {
        return array.reduce((acc, obj) => {
            const property = obj[key];
            const { date, ...rest } = obj;
            acc[property] = acc[property] || [];
            acc[property].push(rest);
            return acc;
        }, {});
    };
}
export function getMostFrequentWeather(arr) {
    const hashmap = arr.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});
    return Object.keys(hashmap).reduce((a, b) =>
        hashmap[a] > hashmap[b] ? a : b
    );
}

export function getAverage(array, isRound = true) {
    let average = 0;
    if (isRound) {
        average = Math.round(array.reduce((a, b) => a + b, 0) / array.length);
        if (average === 0) {
            average = 0;
        }
    } else average = (array.reduce((a, b) => a + b, 0) / array.length).toFixed(2);

    return average;
}
export const descriptionToIconName = (desc, descriptions_list) => {
    let iconName = descriptions_list.find((item) => item.description === desc);
    return iconName.icon || 'unknown';
};