import ApiConstants from "../../../themes/apiConstants";

///// get Venue by competition

function getCompetitionVenue(competitionId) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_VENUES_MULTI_LOAD,
        competitionId: competitionId
    }
    return action
}


/////get competition draws
function getCompetitionDrawsAction(yearRefId, competitionId, venueId, roundId, orgId, startDate, endDate, dateRangeCheck) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_MULTI_DRAWS_LOAD,
        yearRefId, competitionId, venueId, roundId,
        orgId, startDate, endDate, dateRangeCheck
    };
    return action;
}


///get rounds in the competition draws
function getDrawsRoundsAction(yearRefId, competitionId, key, dateRangeCheck, startDate, endDate) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_MULTI_DRAWS_ROUNDS_LOAD,
        yearRefId, competitionId, key, dateRangeCheck, startDate, endDate
    };
    return action;
}

////update competition drwas
function updateCompetitionDraws(data, source, target, actionType, drawData) {
    const action = {
        type: ApiConstants.API_UPDATE_COMPETITION_MULTI_DRAWS_LOAD,
        data: data,
        sourceArray: source,
        targetArray: target,
        actionType: actionType,
        drawData: drawData
    }
    return action
}

/// Save Draws
function saveDraws(yearId, competitionId, drawsMasterId) {
    const action = {
        type: ApiConstants.API_UPDATE_COMPETITION_SAVE_MULTI_DRAWS_LOAD,
        yearId: yearId,
        competitionId: competitionId,
        drawsMasterId: drawsMasterId
    }
    return action
}

/////update draws court timing where N/A is there
function updateCourtTimingsDrawsAction(data, source, target, actionType, drawData, apiData) {
    const action = {
        type: ApiConstants.API_UPDATE_COMPETITION_MULTI_DRAWS_COURT_TIMINGS_LOAD,
        data: data,
        sourceArray: source,
        targetArray: target,
        actionType: actionType,
        drawData: drawData,
        apiData: apiData
    }
    return action
}

function dateSelectionRounds(data) {
    const action = {
        type: ApiConstants.UPDATE_ROUNDS_TIME,
        data
    }
    return action

}
function clearDraws(key) {
    const action = {
        type: ApiConstants.cleardrawsData,
        key
    }
    return action
}

function clearFixtureData(key) {
    const action = {
        type: ApiConstants.clearFixtureData,
        key
    }
    return action
}

////draws division grade names list
function getDivisionGradeNameLisAction(competitionId) {
    const action = {
        type: ApiConstants.API_MULTI_DRAWS_DIVISION_GRADE_NAME_LIST_LOAD,
        competitionId: competitionId
    }
    return action
}

function publishDraws(competitionId, key, payload) {
    const action = {
        type: ApiConstants.API_MULTI_DRAW_PUBLISH_LOAD,
        competitionId: competitionId,
        key: key,
        payload: payload
    }
    return action
}

function matchesListDrawsAction(competitionId) {
    const action = {
        type: ApiConstants.API_MULTI_DRAW_MATCHES_LIST_LOAD,
        competitionId: competitionId
    }
    return action
}

///// get Division by competition
function getDivisionAction(competitionId) {
    const action = {
        type: ApiConstants.API_GET_DIVISION_MULTI_LOAD,
        competitionId: competitionId
    }
    return action
}

//unlockDrawsAction
function unlockDrawsAction(drawsId, roundId, venueCourtId, key) {
    const action = {
        type: ApiConstants.API_UPDATE_MULTI_DRAWS_LOCK_LOAD,
        drawsId,
        roundId, venueCourtId,
        key
    }
    return action
}

///get active rounds in the competition
function getActiveRoundsAction(yearRefId, competitionId) {
    const action = {
        type: ApiConstants.API_GET_MULTI_DRAWS_ACTIVE_ROUNDS_LOAD,
        yearRefId, competitionId
    };
    return action;
}

//change range of date
function changeDrawsDateRangeAction(yearRefId, competitionId, startDate, endDate) {
    return {
        type: ApiConstants.API_MULTI_CHANGE_DATE_RANGE_GET_VENUE_DIVISIONS_LOAD,
        yearRefId, competitionId, startDate, endDate
    }

}
export {
    getCompetitionDrawsAction,
    getDrawsRoundsAction,
    updateCompetitionDraws,
    saveDraws,
    getCompetitionVenue,
    updateCourtTimingsDrawsAction,
    dateSelectionRounds,
    clearDraws,
    getDivisionGradeNameLisAction,
    publishDraws,
    matchesListDrawsAction,
    getDivisionAction,
    clearFixtureData,
    unlockDrawsAction,
    getActiveRoundsAction,
    changeDrawsDateRangeAction
}