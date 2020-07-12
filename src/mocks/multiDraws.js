const drawsArray = [
    {
        minW: 1,
        maxW: 10,
        minH: 1,
        maxH: 1,
        x: 0,
        y: 0,
        color: "#f13199",
        visible: false,
        normalH: 1,
        normalW: 10,
        whiteArea: [1, 2, 3, 4]
    },
    {
        minW: 1,
        maxW: 12,
        minH: 1,
        maxH: 1,
        x: 10,
        y: 0,
        color: "#7e02ff",
        visible: false,
        normalH: 1,
        normalW: 12,
        whiteArea: [1, 2]
    },
    {
        minW: 1,
        maxW: 12,
        minH: 1,
        maxH: 1,
        x: 22,
        y: 0,
        color: "#7e02ff",
        visible: false,
        normalH: 1,
        normalW: 12,
        whiteArea: [1, 2]
    },
    {
        minW: 1,
        maxW: 10,
        minH: 1,
        maxH: 1,
        x: 0,
        y: 1,
        color: "#f13199",
        visible: false,
        normalH: 1,
        normalW: 10,
        whiteArea: [1, 2]
    },
    {
        minW: 1,
        maxW: 10,
        minH: 1,
        maxH: 1,
        x: 10,
        y: 1,
        color: "#f13199",
        visible: false,
        normalH: 1,
        normalW: 10,
        whiteArea: [1, 2]
    },
    {
        minW: 1,
        maxW: 14,
        minH: 1,
        maxH: 1,
        x: 20,
        y: 1,
        color: "#319901",
        visible: false,
        normalH: 1,
        normalW: 14,
        whiteArea: [1]
    },
    {
        minW: 1,
        maxW: 10,
        minH: 1,
        maxH: 1,
        x: 0,
        y: 2,
        color: "#f13199",
        visible: false,
        normalH: 1,
        normalW: 10,
        whiteArea: [1, 2]
    },
    {
        minW: 1,
        maxW: 10,
        minH: 1,
        maxH: 1,
        x: 10,
        y: 2,
        color: "#f13199",
        visible: false,
        normalH: 1,
        normalW: 10,
        whiteArea: [1, 2]
    },
    {
        minW: 1,
        maxW: 20,
        minH: 1,
        maxH: 2,
        x: 20,
        y: 1,
        color: "#1f0199",
        visible: false,
        normalH: 2,
        normalW: 20,
        whiteArea: [1]
    },
    {
        minW: 1,
        maxW: 10,
        minH: 1,
        maxH: 1,
        x: 0,
        y: 3,
        color: "#f13199",
        visible: false,
        normalH: 1,
        normalW: 10,
        whiteArea: [1, 2]
    },
    {
        minW: 1,
        maxW: 10,
        minH: 1,
        maxH: 1,
        x: 10,
        y: 3,
        color: "#f13199",
        visible: false,
        normalH: 1,
        normalW: 10,
        whiteArea: [1, 2]
    },
    {
        minW: 1,
        maxW: 20,
        minH: 1,
        maxH: 2,
        x: 0,
        y: 4,
        color: "#1f0199",
        visible: false,
        normalH: 2,
        normalW: 20,
        whiteArea: [1]
    },
    {
        minW: 1,
        maxW: 20,
        minH: 1,
        maxH: 2,
        x: 20,
        y: 4,
        color: "#1f0199",
        visible: false,
        normalH: 2,
        normalW: 20,
        whiteArea: [1]
    },
    {
        minW: 1,
        maxW: 10,
        minH: 1,
        maxH: 1,
        x: 0,
        y: 6,
        color: "#cccd02",
        visible: false,
        normalH: 1,
        normalW: 10,
        whiteArea: [1, 2, 3, 4]
    },
    {
        minW: 1,
        maxW: 15,
        minH: 1,
        maxH: 1,
        x: 15,
        y: 6,
        color: "#cc6600",
        visible: false,
        normalH: 1,
        normalW: 15,
        whiteArea: [1]
    },
    {
        minW: 1,
        maxW: 15,
        minH: 1,
        maxH: 1,
        x: 0,
        y: 7,
        color: "#cccd02",
        visible: false,
        normalH: 1,
        normalW: 15,
        whiteArea: [1, 2]
    },
    {
        minW: 1,
        maxW: 15,
        minH: 1,
        maxH: 1,
        x: 15,
        y: 7,
        color: "#cc6600",
        visible: false,
        normalH: 1,
        normalW: 15,
        whiteArea: [1]
    },
    {
        minW: 1,
        maxW: 12,
        minH: 1,
        maxH: 2,
        x: 0,
        y: 8,
        color: "#cd1a00",
        visible: false,
        normalH: 2,
        normalW: 12,
        whiteArea: [1]
    },
    {
        minW: 1,
        maxW: 12,
        minH: 1,
        maxH: 2,
        x: 12,
        y: 8,
        color: "#cd1a00",
        visible: false,
        normalH: 2,
        normalW: 12,
        whiteArea: [1]
    },
]

const timeSlots = [
    {
        time: '7:00',
        day: 'Sat'
    },
    {
        time: '8:00',
        day: 'Sat'
    },
    {
        time: '9:00',
        day: 'Sat'
    },
    {
        time: '10:00',
        day: 'Sat'
    },
    {
        time: '11:00',
        day: 'Sat'
    },
]


const locationArr = [
    {
        name: 'LOC 1',
        color: '#B8B8B8'
    },
    {
        name: 'LOC 1',
        color: '#B8B8B8'
    },
    {
        name: 'LOC 2',
        color: '#DCDCDC'
    },
    {
        name: 'LOC 2',
        color: '#DCDCDC'
    },
    {
        name: 'LOC 3',
        color: '#B8B8B8'
    },
    {
        name: 'LOC 3',
        color: '#B8B8B8'
    },
    {
        name: 'Wav 1',
        color: '#DCDCDC'
    },
    {
        name: 'Wav 1',
        color: '#DCDCDC'
    },
    {
        name: 'Wav 2',
        color: '#B8B8B8'
    },
    {
        name: 'Wav 2',
        color: '#B8B8B8'
    }
]

module.exports = {
    drawsArray,
    locationArr,
    timeSlots
}