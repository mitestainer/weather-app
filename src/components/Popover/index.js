import React, { useState, useEffect } from 'react'
import './styles.scss'
import { HiSearch } from 'react-icons/hi'

import axios from 'axios'

const Popover = ({ getWeatherHandler, popoverHandler }) => {
    const [term, setTerm] = useState('')
    const [results, setResults] = useState([])
    const [isResultsOpen, setResultsOpen] = useState(false)

    const fetch = async term => {
        if (term.length >= 3) {
            const res = await axios.get(`https://api.locationiq.com/v1/autocomplete.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${term}&tag=place%3Acity%2Cplace%3Atown%2Cplace%3Avillage`)
            const arr = res.data.map(item => ({
                lat: item.lat,
                lon: item.lon,
                country: item.address.country,
                country_code: item.address.country_code.toUpperCase(),
                state: item.address.state,
                city: item.address.name
            }))
            setResults(arr)
            setResultsOpen(true)
        } else {
            setResults([])
            setResultsOpen(false)
        }
    }

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
                            {results.map((item, i) => <li key={`result_${i}`} onClick={() => sendPlaceAndCloseResults(item)}>{item.city}, {item.state}, {item.country_code}</li>)}
                        </ul>
                    </div>}
                </div>
                <div id="auto-location">
                    <span className="popover-text">Automatic location</span>
                    <div id="auto-location-selector">
                        <div id="ball"></div>
                    </div>
                </div>
                <div id="viewed">
                    <p className="popover-text">Viewed recently</p>
                    <ul>
                        <li>
                            <div>
                                <span>Paris</span>
                                <div>
                                    <span>39 °F</span>
                                    <i className={`wi wi-owm-day-804`}></i>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>Paris</span>
                                <div>
                                    <span>39 °F</span>
                                    <i className={`wi wi-owm-day-804`}></i>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>Paris</span>
                                <div>
                                    <span>39 °F</span>
                                    <i className={`wi wi-owm-day-804`}></i>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span>Paris</span>
                                <div>
                                    <span>39 °F</span>
                                    <i className={`wi wi-owm-day-804`}></i>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Popover