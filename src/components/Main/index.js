import React, { useEffect, useState } from 'react'
import './styles.scss'
import { TiTimes } from 'react-icons/ti'
import { FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi'


import Popover from '../Popover'

import { getLocalTime } from '../../utils/dateUtil'

import fetch from '../../services/api'

export default () => {
    // const [term, setTerm] = useState('')
    // const [results, setResults] = useState([])

    // const [currentCity, setCurrentCity] = useState(0)



    const [currentTime, setCurrentTime] = useState('')
    const [isPopoverOn, togglePopover] = useState(false)

    const [weather, setWeather] = useState({})

    const setClock = timezone => {
        let time = getLocalTime(timezone).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        setCurrentTime(time)
    }

    const [intervalValue, setIntervalValue] = useState('')

    useEffect(() => {
        if (intervalValue) clearInterval(intervalValue)
        let itv = setInterval(() => setClock(weather.timezoneOffset), 1000)
        setIntervalValue(itv)
    }, [weather])


    // const [isResultsOpen, setResultsOpen] = useState(false)
    const [currentPlace, setCurrentPlace] = useState({})
    const [reel, setReel] = useState({
        mode: '',
        items: []
    })
    // const [backgroundClassName, setBackgoundClassName] = useState('')



    const getWeather = async place => {
        const response = await fetch(place)
        setWeather(response)
        setClock(response.timezoneOffset)
        // console.log(response)
        setReel({ ...reel, mode: 'today', items: [...response.today.hourly] })
        setCurrentPlace({ city: place.city, country: place.country })
    }

    const changeReel = day => {
        if (day === 'today') setReel({ ...reel, mode: day, items: weather.today.hourly })
        if (day === 'tomorrow') setReel({ ...reel, mode: day, items: weather.tomorrow })
    }

    // const fetch = async term => {
    //     if (term.length >= 3) {
    //         const res = await axios.get(`https://api.locationiq.com/v1/autocomplete.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${term}&tag=place%3Acity%2Cplace%3Atown%2Cplace%3Avillage`)
    //         const arr = res.data.map(item => ({
    //             lat: item.lat,
    //             lon: item.lon,
    //             country: item.address.country_code.toUpperCase(),
    //             state: item.address.state,
    //             city: item.address.name
    //         }))
    //         setResults(arr)
    //         // setResultsOpen(true)
    //     } else {
    //         setResults([])
    //         // setResultsOpen(false)
    //     }
    // }

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         fetch(term)
    //     }, 250)
    //     return () => clearTimeout(timer)
    // }, [term])

    // useEffect(() => {
    //     const getBackground = id => {
    //         switch (Number(String(id).match(/^\d/g))) {
    //             case 5:
    //                 return 'rain'
    //             case 8:
    //                 if (hour > 5 && hour < 12) return 'clear-morning'
    //                 if (hour < 18) return 'clear-afternoon'
    //                 return 'clear-night'
    //             default:
    //                 return '';
    //         }
    //     }
    //     if (weather.today) {
    //         const { code } = weather.today.weather
    //         setBackgoundClassName(getBackground(code))
    //     }
    // }, [weather, hour])

    return (
        <main>
            <header>
                <button onClick={() => togglePopover(!isPopoverOn)}>Places</button>
                <div id="city-wrapper">
                    <span>{currentPlace.city}</span>
                    <span>{currentPlace.country}</span>
                </div>
                <button><TiTimes color="#fff" size={16} /></button>
                {isPopoverOn && <Popover getWeatherHandler={getWeather} popoverHandler={togglePopover} />}
            </header>
            {weather.today && <section>
                <div id="current">
                    <p id="current-time"><FiClock style={{ marginRight: 10 }} /> {currentTime}</p>
                    <div id="current-forecast">
                        <i className={`wi wi-owm-${weather.today.weather.code}`}></i>
                        <div>
                            <span>{weather.today.temperature} °C</span>
                            <span>{weather.today.weather.desc}</span>
                        </div>
                    </div>
                    <div id="forecast-selector">
                        <div id="buttons">
                            <button className={reel.mode === 'today' ? 'active' : ''} onClick={() => changeReel('today')}>Today</button>
                            <button className={reel.mode === 'tomorrow' ? 'active' : ''} onClick={() => changeReel('tomorrow')}>Tomorrow</button>
                        </div>
                        <div id="carousel">
                            <button>
                                <FiChevronLeft />
                            </button>
                            <div id="reel">
                                <div id="reel-wrapper">
                                    {reel.items.map((item, i) => (
                                        <div key={`today_item_${i + 1}`} className="reel-item">
                                            <span>{item.hour}</span>
                                            <i className={`wi wi-owm-${item.weather}`}></i>
                                            <span>{item.temperature} °C</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button>
                                <FiChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
                <div id="weekly">
                    {weather.daily.map((day, i) => (
                        <div key={`weekly_day_${i + 1}`} className="weekly-forecast">
                            <span>{day.day}</span>
                            <div>
                                <i className={`wi wi-owm-${day.weather}`}></i>
                                <span>{day.temperature} °C</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>}
            {/* <footer>
                APIs by <a href="https://locationiq.com/">LocationIQ.com</a>, <a href="https://openweathermap.org/">OpenWeatherMap</a>
            </footer> */}
        </main>
    )
}