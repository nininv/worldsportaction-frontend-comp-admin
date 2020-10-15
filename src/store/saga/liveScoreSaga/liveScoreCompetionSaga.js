import { call, put } from 'redux-saga/effects';
import { message } from "antd";
import ApiConstants from "../../../themes/apiConstants";
import AppConstants from "../../../themes/appConstants";
import LiveScoreAxiosApi from '../../http/liveScoreHttp/liveScoreAxiosApi';

export function* liveScoreCompetitionSaga({ payload, year, orgKey, recordUmpires, sortBy, sortOrder }) {
    // yield console.log('%%%%', action)
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreCompetition, payload, year, orgKey, recordUmpires, sortBy, sortOrder)
        if (result.status === 1) {
            yield put({ type: ApiConstants.API_LIVESCORE_COMPETITION_SUCCESS, payload: result.result.data })
        } else {
            let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong
            message.config({
                duration: 1.5,
                maxCount: 1,
            });
            message.error(msg);
        }
    } catch (error) {
        yield put({ type: ApiConstants.API_LIVESCORE_COMPETITION_ERROR, payload: error })
        message.config({
            duration: 1.5,
            maxCount: 1,
        });
        message.error(AppConstants.somethingWentWrong);
    }


}

export function* liveScoreCompetitionDelete({ payload, key }) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreCompetitionDelete, payload)


        if (result.status == 1) {

            yield put({ type: ApiConstants.API_LIVESCORE_COMPETION_DELETE_SUCCESS, payload: { id: payload }, key })
            message.success('Deleted Sucessfully')
        } else {

            setTimeout(() => {
                message.error(result.result.message || "Something Went Wrong ")
            }, 800);
            yield put({ type: ApiConstants.API_LIVESCORE_COMPETION_DELETE_ERROR, })
        }

    } catch (e) {

        yield put({ type: ApiConstants.API_LIVESCORE_COMPETION_DELETE_ERROR, payload: e })
        setTimeout(() => {
            message.error("Something Went Wrong")
        }, 800);
    }



}

/////livescore own part competition listing
export function* liveScoreOwnPartCompetitionListSaga({ payload, orgKey, sortBy, sortOrder, key, yearRefId }) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreOwnPartCompetitionList, payload, orgKey, sortBy, sortOrder, yearRefId)
        if (result.status === 1) {
            yield put({ type: ApiConstants.API_LIVESCORE_OWN_PART_COMPETITION_LIST_SUCCESS, payload: result.result.data, key })
        } else {
            let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong
            message.config({
                duration: 1.5,
                maxCount: 1,
            });
            message.error(msg);
        }
    } catch (error) {
        yield put({ type: ApiConstants.API_LIVESCORE_OWN_PART_COMPETITION_LIST_ERROR, payload: error })
        message.config({
            duration: 1.5,
            maxCount: 1,
        });
        message.error(AppConstants.somethingWentWrong);
    }


}
