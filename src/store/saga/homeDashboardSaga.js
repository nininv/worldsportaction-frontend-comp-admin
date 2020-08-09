import { put, call, takeEvery } from "redux-saga/effects";
import { message } from "antd";

import AppConstants from "../../themes/appConstants";
import ApiConstants from "../../themes/apiConstants";
import AxiosApi from "../http/registrationHttp/registrationAxios";
import CommonAxiosApi from "../http/commonHttp/commonAxios";

function* failSaga(result) {
  yield put({
    type: ApiConstants.API_USERCOUNT_FAIL,
    error: result,
    status: result.status
  });

  if (result.result.data.message) {
    setTimeout(() => {
      message.config({
        duration: 1.5,
        maxCount: 1
      })
      message.error(result.result.data.message);
    }, 800);
  } else {
    message.error("Something went wrong.");
  }
}

function* errorSaga(error) {
  yield put({
    type: ApiConstants.API_USERCOUNT_ERROR,
    error: error,
    status: error.status
  });

  setTimeout(() => {
    message.config({
      duration: 1.5,
      maxCount: 1
    })
    message.error(AppConstants.somethingWentWrong);
  }, 800);
}

// Get the membership fee list in registration
function* homeDashboardSaga(action) {
  try {
    const result = yield call(AxiosApi.homeDashboardApi, action.year);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USERCOUNT_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the action box list
function* actionBoxListSaga(action) {
  try {
    const result = yield call(CommonAxiosApi.getActionBoxList, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_ACTION_BOX_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Update action box
function* updateActionBoxSaga(action) {
  try {
    const result = yield call(CommonAxiosApi.updateActionBox, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_UPDATE_ACTION_BOX_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

export default function* rootHomeDashboardSaga() {
  yield takeEvery(ApiConstants.API_USERCOUNT_LOAD, homeDashboardSaga);
  yield takeEvery(ApiConstants.API_GET_ACTION_BOX_LOAD, actionBoxListSaga);
  yield takeEvery(ApiConstants.API_UPDATE_ACTION_BOX_LOAD, updateActionBoxSaga);
}
