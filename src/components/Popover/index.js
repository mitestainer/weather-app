import React from 'react'
import './styles.scss'

import { HiSearch } from 'react-icons/hi'

const Popover = ({ onChange }) => {
    return (
        <div id="popover-area">
            <div id="popover">
                <div id="arrow"></div>
                <div id="search-bar">
                    <HiSearch color="#C2C2C1" />
                    <input type="text" onChange={onChange} placeholder="Search any city" />
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