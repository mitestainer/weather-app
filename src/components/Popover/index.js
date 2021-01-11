import React, { useState, useEffect } from 'react'
import './styles.scss'
import { HiSearch } from 'react-icons/hi'
import Location, { filterLocaltions } from '../../utils/locationUtil'

import axios from 'axios'

const Popover = ({ getWeatherHandler, popoverHandler }) => {
    const [term, setTerm] = useState('')
    const [results, setResults] = useState([])
    const [isResultsOpen, setResultsOpen] = useState(false)
    const [isAutoLocationEnabled, setAutoLocation] = useState(false)
    const [recentlyViewed, setRecentlyViewed] = useState([])

    const fetch = async term => {
        if (term.length >= 3) {
            const res = await axios.get(`https://api.locationiq.com/v1/autocomplete.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${term}&tag=place%3Acity%2Cplace%3Atown%2Cplace%3Avillage%2Cplace%3Amunicipality`)
            let filtered = filterLocaltions(res.data)
            let arr = filtered.map(item => (new Location(item).getLocation()))
            setResults(arr)
            setResultsOpen(true)
        } else {
            setResults([])
            setResultsOpen(false)
        }
    }

    useEffect(() => {
        let array = JSON.parse(localStorage.getItem('viewedRecently') || "[]")
        setRecentlyViewed(array)
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetch(term)
        }, 250)
        return () => clearTimeout(timer)
    }, [term])

    const sendPlaceAndCloseResults = async place => {
        await getWeatherHandler(place)
        setResultsOpen(false)
        popoverHandler(false)
    }

    const enableAutoLocation = () => {
        const handleError = err => {
            console.error(err)
            setAutoLocation(false)
        }
        const handleFetch = async position => {
            const { latitude, longitude } = position.coords
            const res = await axios.get(`https://api.locationiq.com/v1/reverse.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&lat=${latitude}&lon=${longitude}&format=json&accept-language=en`)
            const place = (new Location(res.data)).getLocation()
            sendPlaceAndCloseResults(place)
        }
        if (navigator.geolocation) {
            setAutoLocation(true)
            navigator.geolocation.getCurrentPosition(position => handleFetch(position), err => handleError(err))
        }
    }

    return (
        <div id="popover-area">
            <div id="popover">
                <div id="arrow"></div>
                <div id="city-search">
                    <div id="search-bar">
                        <HiSearch color="#C2C2C1" />
                        <input type="text" onChange={e => setTerm(e.target.value)} placeholder="Search any city" />
                    </div>
                    {isResultsOpen && <div id="search-results">
                        <ul>
                            {results.map(item => <li key={item.id} onClick={() => sendPlaceAndCloseResults(item)}>{item.city}, {item.state}, {item.country_code}</li>)}
                        </ul>
                    </div>}
                </div>
                <div id="auto-location">
                    <span className="popover-text">Automatic location</span>
                    <div id="auto-location-selector" onClick={enableAutoLocation}>
                        <div id="ball" className={isAutoLocationEnabled ? 'autolocation-on' : 'autolocation-off'}></div>
                    </div>
                </div>
                <div id="viewed">
                    <p className="popover-text">Viewed recently</p>
                    <ul>
                        {!recentlyViewed.length ? <li>You haven't viewed any place yet.</li> : recentlyViewed.map(item => (
                            <li key={item.id} onClick={() => sendPlaceAndCloseResults(item)}>
                                <div>
                                    <span>{item.city}</span>
                                    <div>
                                        <span>{item.temperature} °C</span>
                                        <span className="temp-icon">
                                            <i className={`wi wi-owm-${item.code}`}></i>
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Popover