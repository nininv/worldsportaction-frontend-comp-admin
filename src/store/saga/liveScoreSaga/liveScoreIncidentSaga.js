import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from '../../../themes/apiConstants'
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";
import history from "../../../util/history";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_FAIL,
        error: result,
        status: result.status
    });
    setTimeout(() => {
        message.error(result.result.data.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        message.error("Something went wrong.");
    }, 800);
}


export function* liveScoreIncidentListSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreIncidentList, action.competitionId, action.search);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_SUCCESS,
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

export function* liveScoreAddEditIncidentSaga(action) {
    try {
        if (action.data.key === 'media') {

            const result = yield call(LiveScoreAxiosApi.liveScoreAddEditIncident, action.data);
            if (result.status === 1) {
                const mediaResult = yield call(LiveScoreAxiosApi.liveScoreAddEditIncidentMedia, action.data, result.result.data.incidentId);
                if (mediaResult.status === 1) {
                    yield put({
                        type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_INCIDENT_SUCCESS,
                        result: mediaResult.result.data,
                        status: mediaResult.status,
                    });
                    history.push('/liveScoreIncidentList')
                    message.success('Add Incident - Added Successfully')
                }
                else {
                    yield call(failSaga, result)
                }
            } else {
                yield call(failSaga, result)
            }

        } else {
            const result = yield call(LiveScoreAxiosApi.liveScoreAddEditIncident, action.data);
            if (result.status === 1) {
                yield put({
                    type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_INCIDENT_SUCCESS,
                    result: result.result.data,
                    status: result.status,
                });
                history.push('/liveScoreIncidentList')
                message.success('Add Incident - Added Successfully')
            } else {
                yield call(failSaga, result)
            }
        }

    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* liveScoreIncidentTypeSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreIncidentType);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_INCIDENT_TYPE_SUCCESS,
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