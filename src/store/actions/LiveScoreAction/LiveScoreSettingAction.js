import ApiConstants from "../../../themes/apiConstants";

export const getLiveScoreSettingInitiate = (data) => {
    return {
        type: ApiConstants.LiveScore_SETTING_VIEW_INITITAE,
        payload: data
    }
}
export const getLiveScoreSettingSuccess = (data) => {
    return {
        type: ApiConstants.LiveScore_SETTING_VIEW_SUCCESS,
        payload: data
    }
}
export const getLiveScoreSettingError = (data) => {
    return {
        type: ApiConstants.LiveScore_SETTING_VIEW_ERROR,
        payload: data
    }
}
export const onChangeSettingForm = (data) => {
    return {
        type: ApiConstants.LiveScore_SETTING_CHANGE_FORM,
        payload: data
    }
}

export const settingDataPostInititae = (data) => {
    return {
        type: ApiConstants.LiveScore_SETTING_DATA_POST_INITATE,
        payload: data
    }
}
export const settingDataPostSuccess = (data) => {
    return {
        type: ApiConstants.LiveScore_SETTING_DATA_POST_SUCCESS,
        payload: data
    }
}
export const settingDataPostError = (data) => {
    return {
        type: ApiConstants.LiveScore_SETTING_DATA_POST_ERROR,
        payload: data
    }
}
export const clearLiveScoreSetting = () => {
    return {
        type: ApiConstants.LiveScore_CLEAR_SETTING,

    }
}