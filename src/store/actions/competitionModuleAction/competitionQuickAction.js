import ApiConstants from "../../../themes/apiConstants";
// competition dashboard
function updateQuickCompetitionData(item) {
    const action = {
        type: ApiConstants.Update_QuickCompetition_Data,
        item
    };
    return action;
}

function updateTimeSlot(key, index, timeindex, value) {
    const action = {
        type: ApiConstants.API_UPDATE_QUICKCOMPETITION_TIMESLOT,
        key,
        index,
        timeindex,
        value
    }
    return action
}

function updateDivision(key, index, gradeIndex, value) {
    const action = {
        type: ApiConstants.API_UPDATE_QUICKCOMPETITION_Division,
        key,
        index,
        gradeIndex,
        value
    }
    return action
}


function updateCompetition(value, key) {
    const action = {
        type: ApiConstants.API_UPDATE_QUICKCOMPETITION_COMPETITION,
        value, key
    }
    return action
}

function createQuickCompetitionAction(year, comptitionName, competitionDate) {
    const action = {
        type: ApiConstants.API_CREATE_QUICK_COMPETITION_LOAD,
        year,
        comptitionName,
        competitionDate
    }
    console.log(action)
    return action
}

////post/save quick competition division
function saveQuickCompDivisionAction(competitionUniqueKey, divisions) {
    const action = {
        type: ApiConstants.API_SAVE_QUICK_COMPETITION_DIVISION_LOAD,
        competitionUniqueKey, divisions
    }
    return action
}

function getYearAndQuickCompetitionAction(yearData, yearId) {
    const action = {
        type: ApiConstants.API_YEAR_AND_QUICK_COMPETITION_LOAD,
        yearData,
        yearId
    }
    return action
}

function getQuickCompetitionAction(competitionUniqueKey) {
    const action = {
        type: ApiConstants.API_GET_QUICK_COMPETITION_LOAD,
        competitionUniqueKey
    }
    return action

}

// post time slot Data 
function quickCompetitionTimeSlotData(payload) {
    const action = {
        type: ApiConstants.API_QUICK_COMPETITION_TIMESLOT_POST_LOAD,
        payload: payload
    }
    return action
}
////update quick competition
function updateQuickCompetitionAction(payload) {
    const action = {
        type: ApiConstants.API_UPDATE_QUICK_COMPETITION_LOAD,
        payload
    }
    return action
}

export {
    updateQuickCompetitionData,
    updateTimeSlot,
    updateDivision,
    updateCompetition,
    createQuickCompetitionAction,
    saveQuickCompDivisionAction,
    getYearAndQuickCompetitionAction,
    getQuickCompetitionAction,
    quickCompetitionTimeSlotData,
    updateQuickCompetitionAction
}
