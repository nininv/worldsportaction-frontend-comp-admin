import { getAuthToken } from "../../../util/sessionStorage";
import { Method } from "./communicationMethod";

const token = getAuthToken();

const communicationBaseUrl = '/api/communication';

const communicationAxiosApi = {
    addCommunication(data) {
        try {
            const form = new FormData();

            form.append('id', data.id ? data.id : 0);
            form.append('title', data.title);
            form.append('body', data.body);
            form.append('author', data.author ? data.author : 'World sport action');
            form.append('expiryDate', data.expiryDate);
            form.append('organisationId', data.organisationId);
            form.append('toOrganisationIds', data.toOrganisationIds);
            form.append('toUserRoleIds', data.toUserRoleIds);
            form.append('toUserIds', data.toUserIds);
            form.append('yearId', data.yearId);

            if (data.imageUrl) {
                form.append('imageUrl', data.imageUrl);
            }

            if (data.videoUrl) {
                form.append('videoUrl', data.videoUrl);
            }

            if (data.mediaArray !== []) {
                for (let i = 0; i < data.mediaArray.length; i++) {
                    form.append('communicationMedia', data.mediaArray[i]);
                }
            }

            return Method.dataPost(communicationBaseUrl, token, form);
        } catch (e) {
            console.error(e);
        }
    },
    communicationList({ userId, organisationId }) {
        try {
            let url = `${communicationBaseUrl}/admin`;
            if (userId) {
                url = `${communicationBaseUrl}/admin?userId=${userId}`;
            }
            if (organisationId) {
                url = `${communicationBaseUrl}/admin?organisationId=${organisationId}`;
            }
            if (userId && organisationId) {
                url = `${communicationBaseUrl}/admin?userId=${userId}&organisationId=${organisationId}`;
            }
            return Method.dataGet(url, token);
        } catch (e) {
            console.error(e);
        }
    },
    publishCommunication({ id, silent, isApp, organisationUniqueKey }) {
        try {
            const url = `${communicationBaseUrl}/publish?id=${id}&silent=${!!silent}&isApp=${!!isApp}&organisationUniqueKey=${organisationUniqueKey}`;
            return Method.dataGet(url, token);
        } catch (e) {
            console.error(e);
        }
    },
    deleteCommunication(id) {
        try {
            const url = `${communicationBaseUrl}/id/${id}`;
            return Method.dataDelete(url, token);
        } catch (e) {
            console.error(e);
        }
    },
};

export default communicationAxiosApi;
