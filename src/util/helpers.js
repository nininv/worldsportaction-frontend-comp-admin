const isArrayNotEmpty = array => {
    if (array !== null && Array.isArray(array) && array.length > 0) {
        return true
    } else {
        return false
    }
}

const isNullOrEmptyString = word => {
    if (word !== null && word !== undefined && word.length > 0) {
        return true
    } else {
        return false
    }
}

const getAge = (birthDate) => {
    return (Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10))
}

const deepCopyFunction = inObject => {
    let outObject, value, key

    if (typeof inObject !== "object" || inObject === null) {
        return inObject // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {}

    for (key in inObject) {
        value = inObject[key]

        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = (typeof value === "object" && value !== null) ? deepCopyFunction(value) : value
    }

    return outObject
}

const stringTONumber = (value) => {
    if (value) {
        return (typeof value === "string") ? parseInt(value) : value;
    } else {
        return 0;
    }
}

module.exports = { isArrayNotEmpty, isNullOrEmptyString, getAge, deepCopyFunction, stringTONumber }
