import ApiConstants from "../../../themes/apiConstants";

const settingsChecked = {
    coachChecked: true,
    reserveChecked: true,
}
var compOrgDivObj = [{ id: 1, name: 'OpenA', disabled: false }, { id: 2, name: 'OpenB', disabled: false }, { id: 3, name: 'OpenC', disabled: false }]
const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    defaultChecked: settingsChecked,
    allocateViaPool: false,
    manuallyAllocate: false,
    compOrganiser: true,
    affiliateOrg: false,
    compOrgDiv: compOrgDivObj,
    selectAllDiv: true,
    compOrgDivisionSelected: [],
};
function umpireSettingState(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_UMPIRE_SETTINGS_DATA_UPDATE:

            let data = action.data.data
            let key = action.data.key

            if (key === 'allocateViaPool' || key === 'manuallyAllocate') {

                if (key === 'allocateViaPool') {
                    state[key] = data
                    state['manuallyAllocate'] = false

                } else if (key === 'manuallyAllocate') {
                    state[key] = data
                    state['allocateViaPool'] = false
                }
            }
            else if (key === 'compOrganiser') {
                state[key] = data
                state['affiliateOrg'] = false

            } else if (key === 'affiliateOrg') {
                state[key] = data
                state['compOrganiser'] = false
            }
            else if (key === 'selectAllDiv') {
                state[key] = data
            }
            else if (key === 'compOrgDivisionSelected') {
                state[key] = data
            }
            else {
                state.defaultChecked[key] = data
            }
            return {
                ...state,
                onLoad: false,
            };

        default:
            return state;
    }
}

export default umpireSettingState;