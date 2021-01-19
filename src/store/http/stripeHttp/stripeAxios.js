// import { DataManager } from './../../Components';
import http from "./stripeHttp";
import { getUserId, getAuthToken, getOrganisationData } from "../../../util/sessionStorage"
import history from "../../../util/history";
import { message } from "antd";
import ValidationConstants from "../../../themes/validationConstant";
import competitionHttp from "../competitionHttp/competitionHttp";

async function logout() {
    await localStorage.clear();
    history.push("/");
}

let token = getAuthToken();
let AxiosApi = {

    //////////stripe payment account balance API
    async accountBalance() {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `/api/payments/balance?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataGet(url, token);
    },

    //////For stripe charging payment API
    async chargingPayment(competitionId, stripeToken) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            token: {
                id: "tok_1GdsZHEdRNU9eN5LgFNvH727"
            }
        };
        var url = `/api/payments/calculateFee?competitionUniqueKey=${competitionId}&organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataPost(url, token, body);
    },

    /////////save stripe account
    async saveStripeAccount(code) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            code: code,
            organisationUniqueKey: organisationUniqueKey
        };
        var url = `/api/payments/save`;
        return Method.dataPost(url, token, body);
    },

    /////////////stripe login link
    async getStripeLoginLink() {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        var url = `api/payments/login?organisationUniqueKey=${organisationUniqueKey}`;
        return Method.dataGet(url, token);
    },

    /////////////stripe payments transfer list
    async getStripeTransferList(page, startingAfter, endingBefore, params) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            type: "transfer",
            organisationUniqueKey: organisationUniqueKey,
            paging: {
                starting_after: startingAfter,
                ending_before: endingBefore,
                limit: 10
            }
        }
        var url = `api/payments/list`;

        if (params) {
            if (params.year)
                url += '?year=' + params.year
            else if (params.startDate || params.endDate) {
                if (params.startDate && params.endDate)
                    url += `?startDate=${params.startDate}&endDate=${params.endDate}`
                else if (params.startDate)
                    url += `?startDate=${params.startDate}`
                else
                    url += `?endDate=${params.endDate}`
            }

        }

        return Method.dataPost(url, token, body);
    },

    //////////stripe payout list
    async getStripePayoutList(page, startingAfter, endingBefore, params) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            type: "payout",
            organisationUniqueKey: organisationUniqueKey,
            paging: {
                starting_after: startingAfter,
                ending_before: endingBefore,
                limit: 10
            }
        }
        var url = `api/payments/list`;
        if (params) {
            if (params.year)
                url += '?year=' + params.year
            else if (params.startDate || params.endDate) {
                if (params.startDate && params.endDate)
                    url += `?startDate=${params.startDate}&endDate=${params.endDate}`
                else if (params.startDate)
                    url += `?startDate=${params.startDate}`
                else
                    url += `?endDate=${params.endDate}`
            }

        }
        return Method.dataPost(url, token, body);
    },


    //////////stripe single payout transaction list
    async getTransactionPayoutList(page, startingAfter, endingBefore, payoutId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            type: "payoutTransfer",
            organisationUniqueKey: organisationUniqueKey,
            payoutId: payoutId,
            paging: {
                starting_after: startingAfter,
                ending_before: endingBefore,
                limit: 10
            }
        }
        var url = `api/payments/payoutTransferList`;
        return Method.dataPost(url, token, body);
    },

    ///get invoice
    getInvoice(registrationId, userRegId, invoiceId, teamMemberRegId) {
        let body = {
            registrationId: registrationId,
            userRegId: userRegId,
            invoiceId: invoiceId,
            teamMemberRegId: teamMemberRegId
        }
        let url = `/api/invoice`
        return Method.dataPost(url, token, body)
    },

    //get payment list
    async getPaymentList(offset,
        sortBy,
        sortOrder,
        userId,
        registrationId,
        yearId,
        competitionKey,
        paymentFor,
        dateFrom,
        dateTo,
        searchValue,
        feeType,
        paymentOption,
        paymentMethod,
        membershipType,
        paymentStatus
    ) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            organisationUniqueKey: organisationUniqueKey,
            userId: parseInt(userId),
            registrationId: registrationId,
            paging: {
                offset: offset,
                limit: 10
            },
            yearId: parseInt(yearId),
            competitionKey: competitionKey,
            paymentFor: paymentFor,
            dateFrom: dateFrom,
            dateTo: dateTo,
            feeType,
            paymentOption,
            paymentMethod,
            membershipType,
            paymentStatus
        }
        var url = `/api/payments/transactions?search=${searchValue}`;
        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }

        return Method.dataPost(url, token, body);
    },

    async exportPayoutTransaction(payoutId) {
        console.log("call export exportPayoutTransaction");
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = { payoutId, organisationUniqueKey };
        const url = '/api/payments/transactions/export';

        return Method.dataPostDownload(url, token, 'payout-transaction', body);
    },

    async exportPaymentApi(key, year, dateFrom, dateTo) {
        const orgItem = await getOrganisationData();
        const organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        const body = { year, dateFrom, dateTo };
        let url;
        if (key === "paymentDashboard") {
            url = `/api/payments/dashboard/export?organisationUniqueKey=${organisationUniqueKey}`;
        } else if (key === "payout") {
            url = `/api/payments/gateway/export?organisationUniqueKey=${organisationUniqueKey}&type=payout`;
        } else if (key === "transfer") {
            url = `/api/payments/gateway/export?organisationUniqueKey=${organisationUniqueKey}&type=transfer`;
        }

        return Method.dataPostDownload(url, token, key, body);
    },

    async exportPaymentDashboardApi(offset,
        sortBy,
        sortOrder,
        userId,
        registrationId,
        yearId,
        competitionKey,
        paymentFor,
        dateFrom,
        dateTo,
        searchValue,
        feeType,
        paymentOption,
        paymentMethod,
        membershipType,
        paymentStatus) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            organisationUniqueKey: organisationUniqueKey,
            userId: parseInt(userId),
            registrationId: registrationId,
            paging: {
                offset: offset,
                limit: 10
            },
            yearId: parseInt(yearId),
            competitionKey: competitionKey,
            paymentFor: paymentFor,
            dateFrom: dateFrom,
            dateTo: dateTo,
            feeType,
            paymentOption,
            paymentMethod,
            membershipType,
            paymentStatus
        }
        var url = `/api/payments/dashboard/export?organisationUniqueKey=${organisationUniqueKey}&search=${searchValue}`;
        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }
        return Method.dataPostDownload(url, token, "dashboard", body);
    },

    async getStripeRefundList(page, startingAfter, endingBefore) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            type: "refunds",
            organisationUniqueKey: organisationUniqueKey,
            paging: {
                starting_after: startingAfter,
                ending_before: endingBefore,
                limit: 10
            }
        }
        var url = `api/payments/list`;
        return Method.dataPost(url, token, body);
    },

    getInvoiceStatus(registrationId, userRegId, invoiceId, teamMemberRegId) {
        let body = {
            registrationId: registrationId,
            userRegId: userRegId,
            invoiceId: invoiceId,
            teamMemberRegId: teamMemberRegId
        }
        let url = `/api/payments/getInvoiceStatus`
        return Method.dataPost(url, token, body)
    },

};

const Method = {
    async dataPost(newurl, authorization, body) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            http
                .post(url, body, {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: "BWSA " + authorization,
                        "SourceSystem": "WebAdmin"
                    }
                })

                .then(result => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result: result
                        });
                    }
                    else if (result.status == 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    }
                    else {
                        if (result) {
                            return reject({
                                status: 3,
                                error: result.data.message,
                            });
                        } else {
                            return reject({
                                status: 4,
                                error: "Something went wrong."
                            });
                        }
                    }
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status == 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus == 401) {
                                    logout()
                                    message.error(ValidationConstants.messageStatus401)
                                }
                            }
                            else {
                                return reject({
                                    status: 5,
                                    error: err
                                })

                            }
                        }
                    }
                    else {
                        return reject({
                            status: 5,
                            error: err
                        });

                    }
                });
        });
    },

    // Method to GET response
    async dataGet(newurl, authorization) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            http
                .get(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "BWSA " + authorization,
                        "Access-Control-Allow-Origin": "*",
                        "SourceSystem": "WebAdmin"
                    }
                })

                .then(result => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result: result
                        });
                    }
                    else if (result.status == 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    }
                    else {
                        if (result) {
                            return reject({
                                status: 3,
                                error: result.data.message,
                            });
                        } else {
                            return reject({
                                status: 4,
                                error: "Something went wrong."
                            });
                        }
                    }
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status == 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus == 401) {
                                    logout()
                                    message.error(ValidationConstants.messageStatus401)
                                }
                            }
                            else {
                                return reject({
                                    status: 5,
                                    error: err
                                })

                            }
                        }
                    }
                    else {
                        return reject({
                            status: 5,
                            error: err
                        });

                    }
                });
        });
    },

    async dataDelete(newurl, authorization) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            http
                .delete(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "BWSA " + authorization,
                        "Access-Control-Allow-Origin": "*",
                        "SourceSystem": "WebAdmin"
                    }
                })

                .then(result => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result: result
                        });
                    }
                    else if (result.status == 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    }
                    else {
                        if (result) {
                            return reject({
                                status: 3,
                                error: result.data.message,
                            });
                        } else {
                            return reject({
                                status: 4,
                                error: "Something went wrong."
                            });
                        }
                    }
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status == 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus == 401) {
                                    logout()
                                    message.error(ValidationConstants.messageStatus401)
                                }
                            }
                            else {
                                return reject({
                                    status: 5,
                                    error: err
                                })

                            }
                        }
                    }
                    else {
                        return reject({
                            status: 5,
                            error: err
                        });

                    }
                });
        });
    },
    async dataGetDownload(newurl, authorization, fileName) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            http
                .get(url, {
                    responseType: 'arraybuffer',
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/csv",
                        Authorization: "BWSA " + authorization,
                        "Access-Control-Allow-Origin": "*",
                        "SourceSystem": "WebAdmin"
                    }
                })

                .then(result => {
                    if (result.status === 200) {
                        const url = window.URL.createObjectURL(new Blob([result.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', fileName + '.csv'); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                        return resolve({
                            status: 1,
                            result: result
                        });
                    }
                    else if (result.status == 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    }
                    else {
                        if (result) {
                            return reject({
                                status: 3,
                                error: result.data.message,
                            });
                        } else {
                            return reject({
                                status: 4,
                                error: "Something went wrong."
                            });
                        }
                    }
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status == 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus == 401) {
                                    logout()
                                    message.error(ValidationConstants.messageStatus401)
                                }
                            }
                            else {
                                return reject({
                                    status: 5,
                                    error: err
                                })

                            }
                        }
                    }
                    else {
                        return reject({
                            status: 5,
                            error: err
                        });

                    }
                });
        });
    },

    async dataPostDownload(newurl, authorization, fileName, body) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            http
                .post(url, body, {
                    responseType: 'arraybuffer',
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: "BWSA " + authorization,
                        "SourceSystem": "WebAdmin"
                    }
                })

                .then(result => {
                    if (result.status === 200) {
                        const url = window.URL.createObjectURL(new Blob([result.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', fileName + '.csv'); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                        return resolve({
                            status: 1,
                            result: result
                        });
                    }
                    else if (result.status == 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    }
                    else {
                        if (result) {
                            return reject({
                                status: 3,
                                error: result.data.message,
                            });
                        } else {
                            return reject({
                                status: 4,
                                error: "Something went wrong."
                            });
                        }
                    }
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status == 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus == 401) {
                                    logout()
                                    message.error(ValidationConstants.messageStatus401)
                                }
                            }
                            else {
                                return reject({
                                    status: 5,
                                    error: err
                                })

                            }
                        }
                    }
                    else {
                        return reject({
                            status: 5,
                            error: err
                        });

                    }
                });
        });
    },
};


export default AxiosApi;
