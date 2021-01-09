import axios from 'axios'
import { LocalTime, setRoundDate } from '../utils/dateUtil'
import capitalize from '../utils/capitalize'

const getWeekday = (date, { lang, abbreviated }) => new Intl.DateTimeFormat(lang, { weekday: abbreviated ? 'short' : 'long' }).format(date)

const getWeather = async place => {
    const language = 'en-US'
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${place.lat}&lon=${place.lon}&exclude=minutely&units=metric&appid=${process.env.REACT_APP_API_ID}`)
    console.log(res.data)
    const localTime = new LocalTime(res.data)
    const currentDate = new Date(localTime.getTime())
    currentDate.setMinutes(0, 0, 0)
    const tomorrowDate = setRoundDate(currentDate)
    const nextDayDate = setRoundDate(tomorrowDate)
    const sunrise = localTime.getSunrise()
    const sunset = localTime.getSunset()

    const weatherObject = {
        timezoneOffset: res.data.timezone_offset,
        today: {
            day: currentDate.toLocaleDateString(language, { timeZone: res.data.timezone, weekday: 'long' }),
            dateString: currentDate.toLocaleDateString(language, { timeZone: res.data.timezone }),
            temperature: Math.floor(res.data.current.temp),
            weather: {
                code: `${currentDate >= sunrise && currentDate <= sunset ? 'day' : 'night'}-${res.data.current.weather[0].id}`,
                desc: capitalize(res.data.current.weather[0].description)
            },
            hourly: res.data.hourly.filter(item => {
                let itemDate = new Date(item.dt * 1000)
                if (itemDate >= currentDate && itemDate < tomorrowDate) return item
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
                weather: `${currentDate >= sunrise && currentDate <= sunset ? 'day' : 'night'}-${item.weather[0].id}`,
                temperature: Math.floor(item.temp.day)
            }
        })
    }

    return weatherObject
}

export default getWeather