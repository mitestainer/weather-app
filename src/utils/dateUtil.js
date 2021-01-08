const setRoundDate = date => {
    const newRoundDate = new Date(date)
    if (date) newRoundDate.setDate(newRoundDate.getDate() + 1)
    newRoundDate.setHours(0, 0, 0, 0)
    return newRoundDate
}

export { setRoundDate }