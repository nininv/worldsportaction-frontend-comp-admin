import ApiConstants from "../../../themes/apiConstants";

function communicationListAction() {
    const action = {
        type: ApiConstants.API_COMMUNICATION_LIST_LOAD,
    };
    return action;
}

function addCommunicationAction(data) {
    const action = {
        type: ApiConstants.API_ADD_COMMUNICATION_LOAD,
        data,
    };
    return action;
}

function refreshCommunicationModuleDataAction() {
    const action = {
        type: ApiConstants.API_REFRESH_COMMUNICATION_DATA,
    };
    return action;
}

function updateCommunicationModuleData(data) {
    const action = {
        type: ApiConstants.API_UPDATE_COMMUNICATION_DATA,
        data,
    };
    return action;
}

// Communication publish
function communicationPublishAction(data) {
    const action = {
        type: ApiConstants.API_COMMUNICATION_PUBLISH_LOAD,
        data,
    };
    return action;
}

// delete Communication data
function deleteCommunicationAction(id) {
    const action = {
        type: ApiConstants.API_DELETE_COMMUNICATION_LOAD,
        data: id,
    };
    return action;
}

export {
    communicationListAction,
    addCommunicationAction,
    refreshCommunicationModuleDataAction,
    communicationPublishAction,
    deleteCommunicationAction,
    updateCommunicationModuleData,
};
