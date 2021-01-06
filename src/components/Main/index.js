import React, { useEffect, useState } from 'react'
import './styles.scss'
import { TiTimes } from 'react-icons/ti'
import { FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import axios from 'axios'
import Popover from '../Popover'

// import magnifyingGlass from '../../images/searchbar_icon.svg'

import capitalize from '../../utils/capitalize'

export default () => {
    // const [term, setTerm] = useState('')
    // const [results, setResults] = useState([])

    // const [currentCity, setCurrentCity] = useState(0)



    const [currentTime, setCurrentTime] = useState('')
    const [isPopoverOn, togglePopover] = useState(false)

    useEffect(() => {
        setInterval(() => {
            let time = (new Date()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            setCurrentTime(time)
        }, 1000);
    }, [])


    // const [isResultsOpen, setResultsOpen] = useState(false)
    const [weather, setWeather] = useState({})
    const [currentPlace, setCurrentPlace] = useState({})
    // const [backgroundClassName, setBackgoundClassName] = useState('')
    const [hour, setHour] = useState(0)

    const getWeekday = (date, { lang, abbreviated }) => new Intl.DateTimeFormat(lang, { weekday: abbreviated ? 'short' : 'long' }).format(date)

    const getWeather = async place => {
        const language = 'en-US'
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${place.lat}&lon=${place.lon}&exclude=minutely&units=metric&appid=${process.env.REACT_APP_API_ID}`)
        // console.log(res.data)
        const currentDate = new Date()
        currentDate.setMinutes(0, 0, 0)
        const tomorrowDate = new Date(currentDate)
        tomorrowDate.setDate(tomorrowDate.getDate() + 1)
        tomorrowDate.setHours(0, 0, 0, 0)
        const obje = {
            today: {
                day: currentDate.toLocaleDateString(language, { timeZone: res.data.timezone, weekday: 'long' }),
                dateString: currentDate.toLocaleDateString(language, { timeZone: res.data.timezone }),
                temperature: Math.floor(res.data.current.temp),
                humidity: res.data.current.humidity,
                weather: {
                    code: res.data.current.weather[0].id,
                    desc: capitalize(res.data.current.weather[0].description)
                },
                hourly: res.data.hourly.filter(item => {
                    let itemDate = new Date(item.dt * 1000)
                    if (/*itemDate > currentDate && */itemDate < tomorrowDate) return item
                }).map(item => {
                    const obj = {}
                    obj.hour = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                    obj.weather = item.weather[0].id
                    obj.temperature = Math.floor(item.temp)
                    return obj
                })
            },
            daily: res.data.daily.filter((item, i) => i > 0 && i < 6).map(item => {
                const date = new Date(item.dt * 1000)
                return {
                    day: getWeekday(date, { lang: language }),
                    weather: item.weather[0].id,
                    temperature: Math.floor(item.temp.day)
                }
            })
        }
        setWeather(obje)
        console.log(obje)
        setCurrentPlace({ city: place.city, country: place.country })
        setHour(Number(currentDate.toLocaleString('en-US', { timeZone: res.data.timeZone, hour: 'numeric', hour12: false })))
        // setResultsOpen(false)
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
        // <main className={backgroundClassName}>
        //     <div id="city_search">
        //         <div id="search_bar">
        //             <img src={magnifyingGlass} alt="Search icon" />
        //             <input type="text" onChange={e => setTerm(e.target.value)} placeholder="Search any city" />
        //         </div>
        //         {isResultsOpen && <div id="search_results">
        //             <ul>
        //                 {results.map((item, i) => <li key={`result_${i}`} onClick={() => getWeather(i)}><strong>{item.city}</strong>, {item.state}, {item.country}</li>)}
        //             </ul>
        //         </div>}
        //     </div>
        //     {weather.today && <div id="result">
        //         <div id="date_wrapper" className="card">
        //             <div id="upper">
        //                 <p>{city}</p>
        //                 <div>
        //                     <span className="max_min"><i className="wi wi-direction-down"></i>{weather.today.min}°</span>
        //                     <span className="max_min"><i className="wi wi-direction-up"></i>{weather.today.max}°</span>
        //                 </div>
        //             </div>
        //             <div id="under">
        //                 <div id="left_info">        
        //                     <span>{weather.today.day}</span>
        //                     <span>{weather.today.dateString}</span>
        //                     <span>Wind {weather.today.wind}km/h</span>
        //                     <span><i className="wi wi-humidity"></i> {weather.today.humidity}%</span>
        //                 </div>
        //                 <div id="middle_icon">
        //                     <i className={`wi wi-owm-${weather.today.weather.code}`}></i>
        //                     <p>{weather.today.weather.desc}</p>
        //                 </div>
        //                 <span id="temperature">{weather.today.temperature}°</span>
        //             </div>
        //         </div>
        //         <div id="daily_results" className="card">
        //             {weather.daily.map((item, i) => {
        //                 return (
        //                     <div key={`day_${i}`}>
        //                         <p>{item.day}</p>
        //                         <i className={`wi wi-owm-${item.weather}`}></i>
        //                         <p>{item.temperature}°</p>
        //                     </div>
        //                 )
        //             })}
        //         </div>
        //     </div>}
        //     <footer>
        //         APIs by <a href="https://locationiq.com/">LocationIQ.com</a>, <a href="https://openweathermap.org/">OpenWeatherMap</a>
        //     </footer>
        // </main>
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
                        <i className={`wi wi-owm-day-${weather.today.weather.code}`}></i>
                        <div>
                            <span>{weather.today.temperature} °C</span>
                            <span>{weather.today.weather.desc}</span>
                        </div>
                    </div>
                    <div id="forecast-selector">
                        <div id="buttons">
                            <button className="active">Today</button>
                            <button>Tomorrow</button>
                        </div>
                        <div id="carousel">
                            <button>
                                <FiChevronLeft />
                            </button>
                            <div id="reel">
                                {weather.today.hourly.map((item, i) => (
                                    <div key={`today_item_${i + 1}`} className="reel-item">
                                        <span>{item.hour}</span>
                                        <i className={`wi wi-owm-day-${item.weather}`}></i>
                                        <span>{item.temperature} °C</span>
                                    </div>
                                ))}
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
                                <i className={`wi wi-owm-day-${day.weather}`}></i>
                                <span>{day.temperature} °C</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>}
        </main>
    )
}