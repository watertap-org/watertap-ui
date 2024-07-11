export function round(value, decimal) {
    if (decimal) {
        let factor = 10 ** decimal
        return Math.round( value * factor) / factor
    } else return Math.round(value)
    
}

export function roundList(values, decimal) {
    let result = []
    for (let each of values) {
        result.push(round(each, decimal))
    }
    return result
}