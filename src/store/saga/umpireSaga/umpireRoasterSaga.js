import { put, call } from "redux-saga/effects"
import ApiConstants from "../../../themes/apiConstants";
import UserAxiosApi from "../../http/userHttp/userAxiosApi";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
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
    message.config({
        duration: 1.5,
        maxCount: 1,
    });
    message.error(AppConstants.somethingWentWrong);
}

export function* umpireRoasterListSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.umpireRoasterList,
            action.competitionID,
            action.status,
            action.refRoleId,
            action.paginationBody, action.sortBy,
            action.sortOrder);

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
        const result = yield call(action.data.status === 'DELETE' ? LiveScoreAxiosApi.umpireRoasterDeleteAction : LiveScoreAxiosApi.umpireRoasterActionPerform,
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
