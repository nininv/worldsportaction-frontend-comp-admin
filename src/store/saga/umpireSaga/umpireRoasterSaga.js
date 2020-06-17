import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import UserAxiosApi from "../../http/userHttp/userAxiosApi";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";
import history from "../../../util/history";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_UMPIRE_FAIL });
    setTimeout(() => {
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_UMPIRE_ERROR,
        error: error,
        status: error.status
    });
    message.error(error.error)
    // message.error('Something went wrong!!')

}

export function* umpireRoasterListSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.umpireRoasterList,
            action.competitionID,
            action.status,
            action.refRoleId,
            action.paginationBody);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_UMPIRE_ROASTER_LIST_SUCCESS,
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

export function* umpireActionPerofomSaga(action) {
    try {
        const result = yield call(action.data.status == 'DELETE' ? LiveScoreAxiosApi.umpireRoasterDeleteAction : LiveScoreAxiosApi.umpireRoasterActionPerform,
            action.data);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_UMPIRE_ROASTER_ACTION_CLICK_SUCCESS,
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