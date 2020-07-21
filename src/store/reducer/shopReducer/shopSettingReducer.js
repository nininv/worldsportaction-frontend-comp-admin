import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty } from "../../../util/helpers";

// dummy object of setting screen
const defaultObject = {
    address: "",
    id: "",
    postcode: "",
    state: "",
    suburb: "",
    organisationId: 0,
    types: [],
}

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    settingDetailsData: defaultObject,
    getDetailsLoad: false,
};

////modify the setting data for the screen
function modifySettingData(data) {
    let singleAddress = isArrayNotEmpty(data.address) ? data.address[0] : null
    let newObject = {
        address: singleAddress ? singleAddress.address : "",
        id: singleAddress ? singleAddress.id : 0,
        postcode: singleAddress ? singleAddress.postcode : "",
        state: singleAddress ? singleAddress.state : "",
        suburb: singleAddress ? singleAddress.suburb : "",
        organisationId: singleAddress ? singleAddress.organisationId : "",
        types: isArrayNotEmpty(data.types) ? data.types : [],
    }
    return newObject
}

function shopSettingState(state = initialState, action) {
    switch (action.type) {

        case ApiConstants.API_SHOP_SETTINGS_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_SHOP_SETTINGS_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };


        ///////shop setting get API
        case ApiConstants.API_GET_SHOP_SETTING_LOAD:
            return { ...state, onLoad: true, error: null, getDetailsLoad: true };

        case ApiConstants.API_GET_SHOP_SETTING_SUCCESS:
            let settingData = modifySettingData(action.result)
            state.settingDetailsData = settingData
            state.getDetailsLoad = false
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        ///////shop setting create address API
        case ApiConstants.API_CREATE_SHOP_SETTING_ADDRESS_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_CREATE_SHOP_SETTING_ADDRESS_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        //////onchange Add/Edit settings data
        case ApiConstants.SHOP_SETTINGS_DETAILS_ONCHANGE:
            if (action.key === "typeName") {
                state.settingDetailsData["types"][action.index]["typeName"] = action.data
            }
            else {
                state.settingDetailsData[action.key] = action.data
            }
            return {
                ...state,
            };

        default:
            return state;
    }
}

export default shopSettingState;
