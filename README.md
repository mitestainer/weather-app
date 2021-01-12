# Weather App

Simple weather app built with React as a practice to API Consuming.

🌠☁️⛅⛈️🌤️🌥️🌦️🌧️🌨️🌩️🌪️☀️🍃

The previous version of this project featured different, simpler design and the search was made only by typing the location on the input box. Now I redesigned the whole app based on GNOME's weather app (see pictures below) and added position-based search using the [geolocation API](https://developer.mozilla.org/pt-BR/docs/Web/API/Geolocation) and a feature to save the previously visited locations using the browser's `localStorage`.

I grabbed the current style from this:
![](https://raw.githubusercontent.com/GNOME/gnome-weather/master/misc/screenshots/city-view.png)

## What this app do? 👓

This app consumes [LocationIQ.com](https://locationiq.com/) and [OpenWeatherMap](https://openweathermap.org/) APIs to provide location and weather infos.

The location API gives locations suggestions based on the user's input and provides the coordinates the wetaher API needs to fetch the climate info. As the weather changes, so does the background.

## Known bugs 🐛

- Slider doesn't work good on mobile.

Please let me know if you find any other bugs.
