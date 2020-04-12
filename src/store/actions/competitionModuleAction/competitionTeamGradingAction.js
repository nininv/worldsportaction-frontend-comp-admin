import ApiConstants from "../../../themes/apiConstants";

//competition own final team grading get api
function getCompOwnProposedTeamGradingAction(yearRefId, competitionId, divisionId, gradeRefId) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_OWN_PROPOSED_TEAM_GRADING_LIST_LOAD,
        yearRefId: yearRefId,
        competitionId: competitionId,
        divisionId: divisionId,
        gradeRefId: gradeRefId
    }
    return action;
}

//////competition own final team grading data on Change table 
function onchangeCompOwnFinalTeamGradingData(value, index, key) {
    const action = {
        type: ApiConstants.ONCHANGE_COMPETITION_OWN_PROPOSED_TEAM_GRADING_DATA,
        value: value,
        index: index,
        key: key
    }
    return action;
}

///////competition save own final team grading table data
function saveOwnFinalTeamGradingDataAction(payload) {
    const action = {
        type: ApiConstants.API_SAVE_COMPETITION_OWN_FINAL_TEAM_GRADING_LOAD,
        payload: payload
    }
    return action;
}

//////clear  team grading reducer data
function clearTeamGradingReducerDataAction(key) {
    const action = {
        type: ApiConstants.OWN_COMP_TEAM_GRADING_CLEARING_PARTICULAR_REDUCER_DATA,
        key: key
    }
    return action;
}

/////get the partcipate in proposed team grading list
function getCompPartProposedTeamGradingAction(yearRefId, competitionId, divisionId) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_PART_PROPOSED_TEAM_GRADING_LIST_LOAD,
        yearRefId: yearRefId,
        competitionId: competitionId,
        divisionId: divisionId,
    }
    return action;
}

//////competition partcipate in proposed team grading on Change table 
function onchangeCompPartProposedTeamGradingData(value, index, key) {
    const action = {
        type: ApiConstants.ONCHANGE_COMPETITION_PART_PROPOSED_TEAM_GRADING_DATA,
        value: value,
        index: index,
        key: key
    }
    return action;
}

///////competition save partcipate in proposed team grading table data
function savePartProposedTeamGradingDataAction(payload) {
    const action = {
        type: ApiConstants.API_SAVE_COMPETITION_PART_PROPOSED_TEAM_GRADING_LOAD,
        payload: payload
    }
    return action;
}

///////get the own team grading summary listing data
function getTeamGradingSummaryAction(yearRefId, competitionId) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_OWN_TEAM_GRADING_SUMMARY_LIST_LOAD,
        yearRefId: yearRefId,
        competitionId: competitionId,
    }
    return action;
}

///////save the changed grade name in own competition team grading summary data
function saveUpdatedGradeTeamSummaryAction(payload) {
    const action = {
        type: ApiConstants.API_SAVE_UPDATED_GRADE_NAME_TEAM_GRADING_SUMMARY_LOAD,
        payload
    }
    return action;
}


///////team grading summmary publish
function publishGradeTeamSummaryAction(yearRefId, competitionId) {
    const action = {
        type: ApiConstants.API_PUBLISH_TEAM_GRADING_SUMMARY_LOAD,
        yearRefId, competitionId
    }
    return action;
}

//////team grading summmary on Change table data
function onchangeTeamGradingSummaryData(value, index, key) {
    const action = {
        type: ApiConstants.ONCHANGE_COMPETITION_TEAM_GRADING_SUMMARY_DATA,
        value: value,
        index: index,
        key: key
    }
    return action;
}


/////get the competition final grades on the basis of competition and division
function getCompFinalGradesListAction(yearRefId, competitionId, divisionId) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_FINAL_GRADES_LIST_LOAD,
        yearRefId: yearRefId,
        competitionId: competitionId,
        divisionId: divisionId,
    }
    return action;
}

function teamGradingCommentAction(year, competitionId, divisionId, gradeRefId, teamId, comment) {
    const action = {
        type: ApiConstants.API_TEAM_GRADING_COMMENT_LOAD,
        year,
        competitionId,
        divisionId,
        gradeRefId,
        teamId,
        comment
    }
    return action
}

function partProposedSummaryComment(competitionId, divisionId, teamId, comment) {
    const action = {
        type: ApiConstants.API_PART_TEAM_GRADING_COMMENT_LOAD,
        competitionId,
        divisionId,
        teamId,
        comment
    }
    return action
}


function changeHistoryHover(data, tableIndex, historyIndex, key) {
    const action = {
        type: ApiConstants.changeHoverProposedTeamGrading,
        data,
        tableIndex,
        historyIndex, key
    }
    return action
}

export {
    getCompOwnProposedTeamGradingAction,
    onchangeCompOwnFinalTeamGradingData,
    saveOwnFinalTeamGradingDataAction,
    clearTeamGradingReducerDataAction,
    getCompPartProposedTeamGradingAction,
    onchangeCompPartProposedTeamGradingData,
    savePartProposedTeamGradingDataAction,
    getTeamGradingSummaryAction,
    saveUpdatedGradeTeamSummaryAction,
    publishGradeTeamSummaryAction,
    onchangeTeamGradingSummaryData,
    getCompFinalGradesListAction,
    teamGradingCommentAction,
    partProposedSummaryComment,
    changeHistoryHover
}                   
