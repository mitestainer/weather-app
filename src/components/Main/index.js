import React, { useEffect, useState } from 'react'
import './styles.scss'
import { TiTimes } from 'react-icons/ti'
import { FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import axios from 'axios'
import Popover from '../Popover'

// import magnifyingGlass from '../../images/searchbar_icon.svg'

import capitalize from '../../utils/capitalize'
import { setRoundDate } from '../../utils/dateUtil'

export default () => {
    // const [term, setTerm] = useState('')
    // const [results, setResults] = useState([])

    // const [currentCity, setCurrentCity] = useState(0)



    const [currentTime, setCurrentTime] = useState('')
    const [isPopoverOn, togglePopover] = useState(false)

    const [weather, setWeather] = useState({})

    const setClock = timezone => {
        const date = new Date()
        const localTime = date.getTime()
        const localOffset = date.getTimezoneOffset() * 60000
        const utc = localTime + localOffset
        let fetchedCity = utc + (timezone * 1000)
        let time = (new Date(fetchedCity)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
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

    const getWeekday = (date, { lang, abbreviated }) => new Intl.DateTimeFormat(lang, { weekday: abbreviated ? 'short' : 'long' }).format(date)

    const getWeather = async place => {
        const language = 'en-US'
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${place.lat}&lon=${place.lon}&exclude=minutely&units=metric&appid=${process.env.REACT_APP_API_ID}`)
        console.log(res.data)
        const currentDate = new Date()
        currentDate.setMinutes(0, 0, 0)
        const tomorrowDate = setRoundDate(currentDate)
        const nextDayDate = setRoundDate(tomorrowDate)
        const sunrise = new Date(res.data.current.sunrise * 1000)
        const sunset = new Date(res.data.current.sunset * 1000)
        const weatherObject = {
            timezoneOffset: res.data.timezone_offset,
            today: {
                day: currentDate.toLocaleDateString(language, { timeZone: res.data.timezone, weekday: 'long' }),
                dateString: currentDate.toLocaleDateString(language, { timeZone: res.data.timezone }),
                temperature: Math.floor(res.data.current.temp),
                weather: {
                    code: `${(new Date()) >= sunrise && (new Date()) <= sunset ? 'day' : 'night'}-${res.data.current.weather[0].id}`,
                    desc: capitalize(res.data.current.weather[0].description)
                },
                hourly: res.data.hourly.filter(item => {
                    let itemDate = new Date(item.dt * 1000)
                    if (itemDate > currentDate && itemDate < tomorrowDate) return item
                }).map(item => {
                    let itemHour = new Date(item.dt * 1000)
                    const obj = {}
                    obj.hour = itemHour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                    obj.weather = `${itemHour >= sunrise && itemHour <= sunset ? 'day' : 'night'}-${item.weather[0].id}`
                    obj.temperature = Math.floor(item.temp)
                    return obj
                })
            },
            tomorrow: res.data.hourly.filter(item => {
                let itemDate = new Date(item.dt * 1000)
                if (itemDate >= tomorrowDate && itemDate < nextDayDate) return item
            }).map(item => {
                let tomorrowSunrise = new Date(sunrise)
                tomorrowSunrise.setDate(tomorrowSunrise.getDate() + 1)
                let tomorrowSunset = new Date(sunset)
                tomorrowSunset.setDate(tomorrowSunset.getDate() + 1)
                let itemHour = new Date(item.dt * 1000)
                const obj = {}
                obj.hour = itemHour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                obj.weather = `${itemHour >= tomorrowSunrise && itemHour <= tomorrowSunset ? 'day' : 'night'}-${item.weather[0].id}`
                obj.temperature = Math.floor(item.temp)
                return obj
            }),
            daily: res.data.daily.filter((item, i) => i > 0 && i < 6).map(item => {
                const date = new Date(item.dt * 1000)
                return {
                    day: getWeekday(date, { lang: language }),
                    weather: `${(new Date()) >= sunrise && (new Date()) <= sunset ? 'day' : 'night'}-${item.weather[0].id}`,
                    temperature: Math.floor(item.temp.day)
                }
            })
        }
        setWeather(weatherObject)
        setClock(weatherObject.timezoneOffset)
        // console.log(weatherObject)
        setReel({ ...reel, mode: 'today', items: [...weatherObject.today.hourly] })
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