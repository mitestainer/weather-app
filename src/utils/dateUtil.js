const setRoundDate = date => {
    const newRoundDate = new Date(date)
    if (date) newRoundDate.setDate(newRoundDate.getDate() + 1)
    newRoundDate.setHours(0, 0, 0, 0)
    return newRoundDate
}

const getLocalTime = (timezone, timestamp) => {
    const date = timestamp ? new Date(timestamp * 1000) : new Date()
    const localTime = date.getTime()
    const localOffset = date.getTimezoneOffset() * 60000
    const utc = localTime + localOffset
    const fetchedCity = utc + (timezone * 1000)
    return new Date(fetchedCity)
}

class LocalTime {
    constructor(object) {
        this.timezone = object.timezone_offset
        this.sunrise = object.current.sunrise
        this.sunset = object.current.sunset
    }
    getTime() {
        return getLocalTime(this.timezone)
    }
    getSunrise() {
        return getLocalTime(this.timezone, this.sunrise)
    }
    getSunset() {
        return getLocalTime(this.timezone, this.sunset)
    }
}

export { setRoundDate, getLocalTime, LocalTime }