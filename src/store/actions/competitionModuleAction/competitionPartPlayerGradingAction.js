

import ApiConstants from "../../../themes/apiConstants"

//competition part player grade calculate player grading summary get API
function getCompPartPlayerGradingSummaryAction(yearRefId, competitionId) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_PART_PLAYER_GRADE_CALCULATE_SUMMARY_LIST_LOAD,
        yearRefId,
        competitionId,
    }
    return action;
}

//////competition part player grade calculate player grading summary data on Change table input
function onchangeCompPartPlayerGradingSummaryData(value, index, key) {
    const action = {
        type: ApiConstants.ONCHANGE_COMPETITION_PART_PLAYER_GRADE_CALCULATE_SUMMARY_DATA,
        value,
        index,
        key
    }
    return action;
}

/////save the competition part player grade calculate player grading summary or say proposed player grading toggle
function saveCompPartPlayerGradingSummaryAction(payload) {
    const action = {
        type: ApiConstants.API_SAVE_COMPETITION_PART_PLAYER_GRADE_CALCULATE_SUMMARY_LIST_LOAD,
        payload,
    }
    return action;
}

//competition part player grading get API
function getCompPartPlayerGradingAction(yearRefId, competitionId, divisionId) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_PART_PLAYER_GRADING_LIST_LOAD,
        yearRefId,
        competitionId,
        divisionId
    }
    return action;
}



//competition part player grading clear reducer
function clearReducerCompPartPlayerGradingAction(key) {
    const action = {
        type: ApiConstants.CLEARING_COMPETITION_PART_PLAYER_GRADING_REDUCER_DATA,
        key
    }
    return action;
}

// competition part player grading add team
function addNewTeamAction(competitionId, divisionId, teamName) {
    const action = {
        type: ApiConstants.API_ADD_NEW_TEAM_LOAD,
        competitionId,
        divisionId,
        teamName,
    }
    return action
}
// competition part player grading Drag source to destination
function onDragPlayerAction(competitionId, teamId, player, source, destination) {
    const action = {
        type: ApiConstants.API_DRAG_NEW_TEAM_LOAD,
        competitionId,
        teamId,
        player,
        source, destination
    }
    return action
}
//drag player in same Team
function onSameTeamDragAction(source, destination) {
    const action = {
        type: ApiConstants.DRAG_PLAYER_IN_SAME_TEAM,
        source, destination
    }
    return action

}

//player grading comment
function playerGradingComment(competitionId, divisionId, comment, playerId, teamId) {
    const action = {
        type: ApiConstants.API_PLAYER_GRADING_COMMENT_LOAD,
        competitionId,
        divisionId,
        comment,
        playerId,
        teamId,
    }
    return action
}

function playerSummaryCommentAction(year, competitionId, divisionId, gradingOrgId, comment) {
    const action = {
        type: ApiConstants.API_PLAYER_GRADING_SUMMARY_COMMENT_LOAD,
        year,
        competitionId,
        divisionId,
        gradingOrgId,
        comment,
    }
    return action
}


function competitionPlayerImportAction(data) {
    return {
        type: ApiConstants.API_COMPETITION_PLAYER_IMPORT_LOAD,
        payload: data
    }
}

function competitionTeamsImportAction(data) {
    return {
        type: ApiConstants.API_COMPETITION_TEAMS_IMPORT_LOAD,
        payload: data
    }
}

function competitionImportDataCleanUpAction(data) {
    return {
        type: ApiConstants.API_COMPETITION_IMPORT_DATA_CLEANUP,
        key: data
    }
}

function deleteTeamAction(data) {
    return {
        type: ApiConstants.API_COMPETITION_TEAM_DELETE_LOAD,
        payload: data
    }
}

function changeDivisionPlayerAction(payload) {
    const action = {
        type: ApiConstants.API_CHANGE_COMPETITION_DIVISION_PLAYER_LOAD,
        payload
    }
    return action;
}

function addOrRemovePlayerForChangeDivisionAction(data, key) {
    const action = {
        type: ApiConstants.UPDATE_PLAYER_GRADING_DATA,
        data,
        key
    }
    return action;
}

function commentListingAction(competitionId, entityId, commentType) {
    const action = {
        type: ApiConstants.API_GET_COMMENT_LIST_LOAD,
        competitionId,
        entityId,
        commentType
    }
    return action
}

function exportPlayerGrades(divisionId,competitionId){
    const action = {
        type: ApiConstants.API_EXPORT_PLAYER_GRADES_LOAD,
        divisionId,
        competitionId,
    }
    return action
}


export {
    getCompPartPlayerGradingSummaryAction,
    onchangeCompPartPlayerGradingSummaryData,
    saveCompPartPlayerGradingSummaryAction,
    getCompPartPlayerGradingAction,
    clearReducerCompPartPlayerGradingAction,
    addNewTeamAction,
    onDragPlayerAction,
    onSameTeamDragAction,
    playerGradingComment,
    playerSummaryCommentAction,
    competitionPlayerImportAction,
    deleteTeamAction,
    competitionTeamsImportAction,
    competitionImportDataCleanUpAction,
    changeDivisionPlayerAction,
    addOrRemovePlayerForChangeDivisionAction,
    commentListingAction,
    exportPlayerGrades
}
