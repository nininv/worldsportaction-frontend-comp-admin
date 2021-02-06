import ApiConstants from "../../../themes/apiConstants";

//////stripe payment account balance API
function accountBalanceAction() {
    const action = {
        type: ApiConstants.API_STRIPE_ACCOUNT_BALANCE_API_LOAD,
    };
    return action;
}
//For stripe charging payment API
function chargingPaymentAction(competitionId, stripeToken) {
    const action = {
        type: ApiConstants.API_STRIPE_CHARGING_PAYMENT_API_LOAD,
        competitionId,
        stripeToken
    };
    return action;
}
//save stripe account
function saveStripeAccountAction(code) {
    const action = {
        type: ApiConstants.API_SAVE_STRIPE_ACCOUNT_API_LOAD,
        code
    };
    return action;
}

////stripe login link
function getStripeLoginLinkAction() {
    const action = {
        type: ApiConstants.API_GET_STRIPE_LOGIN_LINK_API_LOAD,
    };
    return action;
}

////stripe payments transfer list
function getStripeTransferListAction(page, starting_after, ending_before, params) {
    const action = {
        type: ApiConstants.API_GET_STRIPE_PAYMENTS_TRANSFER_LIST_API_LOAD,
        page,
        starting_after,
        ending_before,
        params
    };
    return action;
}

////stripe payout list
function getStripePayoutListAction(page, starting_after, ending_before, params) {
    const action = {
        type: ApiConstants.API_GET_STRIPE_PAYOUT_LIST_API_LOAD,
        page,
        starting_after,
        ending_before,
        params
    };
    return action;
}

////stripe payout list
function getStripeRefundsListAction(page, starting_after, ending_before, params) {
    const action = {
        type: ApiConstants.API_GET_STRIPE_REFUND_LIST_API_LOAD,
        page,
        starting_after,
        ending_before,
        params
    };
    return action;
}

////stripe single payout transaction list
function getTransactionPayoutListAction(page, starting_after, ending_before, payoutId) {
    const action = {
        type: ApiConstants.API_GET_STRIPE_TRANSACTION_PAYOUT_LIST_API_LOAD,
        page,
        starting_after,
        ending_before,
        payoutId

    };
    return action;
}

/////get invoice 
function getInvoice(registrationid, userRegId, invoiceId, teamMemberRegId) {
    const action = {
        type: ApiConstants.API_GET_INVOICE_LOAD,
        registrationid,
        userRegId,
        invoiceId,
        teamMemberRegId
    }
    return action
}

/// payment dashboard
function getPaymentList(
    offset,
    limit,
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
    paymentType,
    paymentMethod,
    membershipType,
    paymentStatus,
    discountMethod
) {
    const action = {
        type: ApiConstants.API_PAYMENT_TYPE_LIST_LOAD,
        offset,
        limit,
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
        paymentType,
        paymentMethod,
        membershipType,
        paymentStatus,
        discountMethod
    }
    return action
}

//export payment dashboard data
function exportPaymentApi(key, year, dateFrom, dateTo) {
    const action = {
        type: ApiConstants.API_PAYMENT_DASHBOARD_EXPORT_LOAD,
        key,
        year,
        dateFrom,
        dateTo,
    };
    return action;
}

function getInvoiceStatusAction(registrationid, userRegId, invoiceId, teamMemberRegId) {
    const action = {
        type: ApiConstants.API_GET_INVOICE_STATUS_LOAD,
        registrationid,
        userRegId,
        invoiceId,
        teamMemberRegId
    }
    return action
}

function exportPaymentDashboardApi(offset,
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
    paymentType,
    paymentMethod,
    membershipType,
    paymentStatus,
    discountMethod) {
    return {
        type: ApiConstants.API_EXPORT_PAYMENT_DASHBOARD_LOAD,
        offset,
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
        paymentType,
        paymentMethod,
        membershipType,
        paymentStatus,
        discountMethod
    }
}

function exportPayoutTransaction(payoutId) {
    const action = {
        type: ApiConstants.API_STRIPE_TRANSACTION_PAYOUT_LIST_EXPORT_LOAD,
        payoutId,
    };
    return action;
}

function getPaymentSummary(
    offset,
    limit,
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
    paymentType,
    paymentMethod,
    membershipType,
    paymentStatus
) {
    const action = {
        type: ApiConstants.API_PAYMENT_SUMMARY_LIST_LOAD,
        offset,
        limit,
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
        paymentType,
        paymentMethod,
        membershipType,
        paymentStatus
    }
    return action
}

function exportPaymentSummaryApi(offset,
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
    paymentType,
    paymentMethod,
    membershipType,
    paymentStatus) {
    return {
        type: ApiConstants.API_EXPORT_PAYMENT_SUMMARY_LOAD,
        offset,
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
        paymentType,
        paymentMethod,
        membershipType,
        paymentStatus
    }
}

function setDashboardPageSizeAction(pageSize) {
    const action = {
        type: ApiConstants.SET_PAYMENT_DASHBOARD_LIST_PAGE_SIZE,
        pageSize
    }

    return action;
}

function setDashboardPageNumberAction(pageNum) {
    const action = {
        type: ApiConstants.SET_PAYMENT_DASHBOARD_LIST_PAGE_CURRENT_NUMBER,
        pageNum
    }

    return action;
}

function setSummaryPageSizeAction(pageSize) {
    const action = {
        type: ApiConstants.SET_PAYMENT_SUMMARY_LIST_PAGE_SIZE,
        pageSize
    }

    return action;
}

function setSummaryPageNumberAction(pageNum) {
    const action = {
        type: ApiConstants.SET_PAYMENT_SUMMARY_LIST_PAGE_CURRENT_NUMBER,
        pageNum
    }

    return action;
}

function partialRefundAmountAction(payload) {
    const action = {
        type: ApiConstants.API_PARTIAL_REFUND_AMOUNT_LOAD,
        payload,
    }
    return action
}
export {
    accountBalanceAction,
    chargingPaymentAction,
    saveStripeAccountAction,
    getStripeLoginLinkAction,
    getStripeTransferListAction,
    getStripePayoutListAction,
    getTransactionPayoutListAction,
    getInvoice, getPaymentList,
    exportPaymentApi,
    getStripeRefundsListAction,
    getInvoiceStatusAction,
    exportPaymentDashboardApi,
    exportPayoutTransaction,
    getPaymentSummary,
    exportPaymentSummaryApi,
    setDashboardPageSizeAction,
    setDashboardPageNumberAction,
    setSummaryPageSizeAction,
    setSummaryPageNumberAction,
    partialRefundAmountAction
};
