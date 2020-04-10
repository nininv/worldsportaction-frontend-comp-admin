import ApiConstants from "../../../themes/apiConstants";

function ladderSettingGetMatchResultAction() {
    const action = {
        type: ApiConstants.API_LADDER_SETTING_MATCH_RESULT_LOAD
    };
    return action;
}

function ladderSettingGetDATA(competitionId) {
    const action = {
        type: ApiConstants.API_LADDER_SETTING_GET_DATA_LOAD,
        competitionId
    };
    return action;
}

function updateLadderSetting(data, tableRecord, index) {
    const action = {
        type: ApiConstants.UPDATE_LADDER_SETTING,
        data,
        tableRecord,
        index
    };
    return action;
}

function ladderSettingPostDATA(postData) {
    const action = {
        type: ApiConstants.API_LADDER_SETTING_POST_DATA_LOAD,
        postData
    };
    return action;
}

export {
    ladderSettingGetMatchResultAction,
    ladderSettingGetDATA,
    updateLadderSetting,
    ladderSettingPostDATA
}