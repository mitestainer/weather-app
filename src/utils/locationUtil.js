class Location {
    constructor(place) {
        this.id = place.place_id
        this.lat = place.lat
        this.lon = place.lon
        this.country = place.address.country
        this.country_code = place.address.country_code.toUpperCase()
        this.state = place.address.state
        this.city = place.address.name || place.address.city_district
    }
    getLocation() {
        return ({
            id: this.id,
            lat: this.lat,
            lon: this.lon,
            country: this.country,
            country_code: this.country_code,
            state: this.state,
            city: this.city
        })
    }
}

const filterLocaltions = data => {
    let arr = []
    data.forEach(place => {
        let isItemAlreadyOn = arr.some(item => item.address.name === place.address.name && item.address.state === place.address.state && item.address.country === place.address.country)
        if (!isItemAlreadyOn) arr.push(place)
    })
    return arr
}

export default Location
export { filterLocaltions }