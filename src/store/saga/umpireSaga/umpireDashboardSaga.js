import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import UserAxiosApi from "../../http/userHttp/userAxiosApi";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import CommonAxiosApi from "../../http/commonHttp/commonAxios";
import { message } from "antd";
import history from "../../../util/history";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_UMPIRE_FAIL });
    let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong
    message.config({
        duration: 1.5,
        maxCount: 1,
    });
    message.error(msg);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_UMPIRE_ERROR,
        error: error,
        status: error.status
    });
    if (error.status == 400) {

        message.config({
            duration: 1.5,
            maxCount: 1,
        });
        message.error((error && error.error) ? error.error : AppConstants.somethingWentWrong);
    } else {
        message.config({
            duration: 1.5,
            maxCount: 1,
        });
        message.error(AppConstants.somethingWentWrong);
    }
}

////*********************** */

export function* umpireListDashboardSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.umpireListDashboard, action.data);
        if (result.status === 1) {

            yield put({
                type: ApiConstants.API_GET_UMPIRE_DASHBOARD_LIST_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* umpireVenueListSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getVenueList, action.compId);
        if (result.status === 1) {

            yield put({
                type: ApiConstants.API_GET_UMPIRE_DASHBOARD_VENUE_LIST_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* umpireDivisionListSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreGetDivision, action.competitionID);
        if (result.status === 1) {

            yield put({
                type: ApiConstants.API_GET_UMPIRE_DASHBOARD_DIVISION_LIST_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* umpireImportSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.umpireImport, action.data);
        if (result.status === 1) {

            yield put({
                type: ApiConstants.API_UMPIRE_IMPORT_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
            history.push(action.data.screenName == 'umpireDashboard' ? '/umpireDashboard' : 'umpire')
            message.success(action.data.screenName == 'umpireDashboard' ? 'Umpire Dashboard Imported Successfully.' : 'Umpire Imported Successfully.')
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* umpireRoundListSaga(action) {

    try {
        const result = yield call(LiveScoreAxiosApi.umpireRoundList, action.competitionID, action.divisionId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_UMPIRE_ROUND_LIST_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}