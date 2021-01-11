import React, { useEffect, useState } from 'react'
import './styles.scss'
import { TiTimes } from 'react-icons/ti'
import { FiClock, FiChevronLeft, FiChevronRight, FiCornerLeftUp } from 'react-icons/fi'

import Popover from '../Popover'

import { getLocalTime } from '../../utils/dateUtil'

import fetch from '../../services/api'

export default () => {
    const [currentTime, setCurrentTime] = useState('')
    const [isPopoverOn, togglePopover] = useState(false)
    const [weather, setWeather] = useState({})
    const [intervalValue, setIntervalValue] = useState('')
    const [currentPlace, setCurrentPlace] = useState({})
    const [reel, setReel] = useState({
        mode: '',
        items: []
    })
    const [backgroundClassName, setBackgoundClassName] = useState('')
    const [reelPosition, setReelPosition] = useState(0)
    const [reelStep, setReelStep] = useState(0)

    const setClock = timezone => {
        let time = getLocalTime(timezone).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        setCurrentTime(time)
    }

    useEffect(() => {
        if (intervalValue) clearInterval(intervalValue)
        let itv = setInterval(() => setClock(weather.timezoneOffset), 1000)
        setIntervalValue(itv)
    }, [weather])

    const setHistory = (place, weather) => {
        let array = JSON.parse(localStorage.getItem('viewedRecently') || "[]")
        let manipulationObject = { ...place, temperature: weather.today.temperature, code: weather.today.weather.code }

        if (array.some(item => item.city === place.city && item.state === place.state && item.country === place.country)) {
            let index = array.findIndex(item => item.city === place.city && item.state === place.state && item.country === place.country)
            let current = array.splice(index, 1)
            current = manipulationObject
            array = [current, ...array]
        } else {
            array.unshift(manipulationObject)
        }

        if (array.length > 5) array.pop()

        localStorage.setItem('viewedRecently', JSON.stringify(array))
    }

    const defineBackgroundCode = code => {
        if (code.includes('800')) return setBackgoundClassName(code)
        const re = /^(\w+-\d{1})\d+$/g
        const [, test] = re.exec(code)
        setBackgoundClassName(`${test}xx`)
    }

    const setReelStepValue = basis => setReelStep((100 / basis) * 6)

    const getWeather = async place => {
        const response = await fetch(place)
        setWeather(response)
        defineBackgroundCode(response.today.weather.code)
        setClock(response.timezoneOffset)
        setReel({ ...reel, mode: 'today', items: [...response.today.hourly] })
        setCurrentPlace({ city: place.city, country: place.country })
        setHistory(place, response)
        setReelStepValue(response.today.hourly.length)
    }

    const changeReel = day => {
        if (day === 'today') {
            setReel({ ...reel, mode: day, items: weather.today.hourly })
            setReelStepValue(weather.today.hourly.length)
        }
        if (day === 'tomorrow') {
            setReel({ ...reel, mode: day, items: weather.tomorrow })
            setReelStepValue(weather.tomorrow.length)
        }
    }
    const clickReelLeft = () => reelPosition < 0 && setReelPosition(reelPosition + reelStep)

    const clickReelRight = () => reelPosition > (-100 + reelStep) && setReelPosition(reelPosition - reelStep)

    const clearWeather = () => {
        setWeather({})
        setCurrentPlace({})
    }

    return (
        <main>
            <header>
                <button onClick={() => togglePopover(!isPopoverOn)}>Places</button>
                <div id="city-wrapper">
                    <span>{currentPlace.city}</span>
                    <span>{currentPlace.country}</span>
                </div>
                {weather.today && <button onClick={() => clearWeather()}><TiTimes color="#fff" size={16} /></button>}
                {isPopoverOn && <Popover getWeatherHandler={getWeather} popoverHandler={togglePopover} />}
            </header>
            {weather.today ? <section className={`background-base ${backgroundClassName}`}>
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
                            <button onClick={clickReelLeft}>
                                <FiChevronLeft />
                            </button>
                            <div id="reel">
                                <div id="reel-wrapper" style={{ transform: `translateX(${reelPosition}%)` }}>
                                    {reel.items.map((item, i) => (
                                        <div key={`today_item_${i + 1}`} className="reel-item">
                                            <span>{item.hour}</span>
                                            <i className={`wi wi-owm-${item.weather}`}></i>
                                            <span>{item.temperature} °C</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button onClick={clickReelRight}>
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
            </section> : <section id="blank">
                    <div>
                        <FiCornerLeftUp />
                        <p>Click here to select a location to search</p>
                    </div>
                </section>}
            <footer>
                APIs by <a href="https://locationiq.com/">LocationIQ.com</a>, <a href="https://openweathermap.org/">OpenWeatherMap</a>
            </footer>
        </main>
    )
}