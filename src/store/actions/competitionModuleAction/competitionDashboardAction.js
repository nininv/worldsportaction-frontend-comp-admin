import ApiConstants from "../../../themes/apiConstants";
// competition dashboard
function competitionDashboardAction(yearId) {
    const action = {
        type: ApiConstants.API_COMPETITION_DASHBOARD_LOAD,
        yearId
    };
    return action;
}

//  Enhanced Round Robin Fixture template
function fixtureTemplateRoundsAction() {
    const action = {
        type: ApiConstants.API_FIXTURE_TEMPLATE_ROUNDS_LOAD,
    };
    return action;
}
function updateCompetitionStatus(payload, yearId) {
    console.log(payload)
    const action = {
        type: ApiConstants.API_COMPETITION_STATUS_UPDATE_LOAD,
        payload,
        yearId
    }
    return action
}

function deleteCompetitionAction(competitionId,targetValue) {
    const action = {
        type: ApiConstants.API_COMPETITION_DASHBOARD_DELETE_LOAD,
        competitionId: competitionId,
        targetValue:targetValue
    };
    return action;
}

function updateReplicateSaveObjAction(data,key,subKey,index){
    const action = {
        type: ApiConstants.UPDATE_REPLICATE_SAVE_OBJ,
        data: data,
        key: key,
        subKey: subKey,
        index: index
    }
    return action;
}

function replicateSaveAction(replicateSave){
    const action = {
        type: ApiConstants.API_REPLICATE_SAVE_LOAD,
        replicateData: replicateSave
    }
    return action;
}

function getOldMembershipProductsByCompIdAction(payload){
    const action = {
        type: ApiConstants.API_OLD_MEMBERSHIP_PRODUCTS_BY_COMP_ID_LOAD,
        payload: payload
    }
    return action;
}

function getNewMembershipProductByYearAction(payload){
    const action = {
        type: ApiConstants.API_NEW_MEMBERSHIP_PRODUCTS_BY_YEAR_LOAD,
        payload: payload
    }
    return action;
}

export {
    competitionDashboardAction,
    fixtureTemplateRoundsAction,
    updateCompetitionStatus,
    deleteCompetitionAction,
    updateReplicateSaveObjAction,
    replicateSaveAction,
    getOldMembershipProductsByCompIdAction,
    getNewMembershipProductByYearAction
}
