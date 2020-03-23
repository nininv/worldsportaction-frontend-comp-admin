import { put, call } from '../../../../node_modules/redux-saga/effects';
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_UMPIRES_FAIL });
    setTimeout(() => {
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_UMPIRES_ERROR,
        error: error,
        status: error.status
    });
    message.error("Something went Wrong.")
}

export function* liveScoreUmpiresSaga(action) {
    console.log(action.competitionId, action.offset, "headers")
    try {
        const result = yield call(LiveScoreAxiosApi.umpiresList, action.competitionId, action.offset)

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_UMPIRES_LIST_SUCCESS,
                result: result.result.data,
                status: result.status,
                // navigation: action.navigation
            })
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

