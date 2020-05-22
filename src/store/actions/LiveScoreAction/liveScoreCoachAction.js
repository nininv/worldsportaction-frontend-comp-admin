import ApiConstants from "../../../themes/apiConstants";

function liveScoreCoachListAction(roleId, entityTypeId, entityId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_COACH_LIST_LOAD,
        roleId: roleId,
        entityTypeId: entityTypeId,
        entityId: entityId
    };
    console.log('action', action)

    return action;
}

function liveScoreUpdateCoach(data, key) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_COACH,
        data: data,
        key: key
    };
    return action;
}

function liveScoreAddEditCoach(data, teamId, exsitingManagerId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_COACH_LOAD,
        data,
        teamId,
        exsitingManagerId
    };
    return action;
}

function liveScoreCoachSearch(data, competition_Id) {
    const action = {
        type: ApiConstants.API_LIVESCORE_COACH_SEARCH_LOAD,
        data,
        competition_Id
    }
    console.log(action, '@#$#@')
    return action
}

function liveScoreClear() {
    const action = {
        type: ApiConstants.CLEAR_LIVESCORE_MANAGER
    }
    return action
}



export {
    liveScoreUpdateCoach,
    liveScoreCoachListAction,
    liveScoreAddEditCoach,
    liveScoreCoachSearch,
    liveScoreClear
};
