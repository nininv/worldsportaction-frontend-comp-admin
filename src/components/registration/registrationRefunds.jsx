import React, { Component } from "react";
import { Layout, Breadcrumb, Select, DatePicker, Button, Table, Menu, Pagination } from 'antd';
import './product.scss';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import InputWithHead from "../../customComponents/InputWithHead";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getStripePayoutListAction, exportPaymentApi
} from "../../store/actions/stripeAction/stripeAction";
import { getOrganisationData } from "../../util/sessionStorage";
import { currencyFormat } from "../../util/currencyFormat";
import Loader from '../../customComponents/loader';
import { liveScore_formateDate } from "../../themes/dateformate";
import moment from 'moment'
import { NavLink } from 'react-router-dom';

const { Header, Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;
/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [
    {
        title: "Transaction Id",
        dataIndex: 'balance_transaction',
        key: 'balance_transaction',
        sorter: false,
        render: (balance_transaction, record) => (
            <NavLink to={{ pathname: `/registrationPayoutTransaction`, state: { id: record.id } }}>
                <span style={{ color: "#ff8237" }}>{balance_transaction}</span>
            </NavLink>
        )
    },
    {
        title: "Description",
        dataIndex: 'description',
        key: 'description',
        sorter: false,
        render: description => (
            <span >{description ? description : "N/A"}</span>
        )
    },
    {
        title: "Date",
        dataIndex: 'created',
        key: 'created',
        sorter: false,
        render: created => {
            var date = new Date(created * 1000);
            let finalDate = liveScore_formateDate(date)
            return (
                <span>{finalDate}</span>
            )
        },
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        sorter: false,
        render: amount => (
            <span>{currencyFormat(amount)}</span>
        ),

    },
    {
        title: "Status",
        dataIndex: 'status',
        key: 'status',
        sorter: false,
    },
    // {
    //     title: 'Action',
    //     dataIndex: 'refund',
    //     key: 'refund',
    //     render: (refund, record) =>
    //         <Menu
    //             className="action-triple-dot-submenu"
    //             theme="light"
    //             mode="horizontal"
    //             style={{ lineHeight: '25px' }}
    //         >
    //             <SubMenu
    //                 key="sub1"
    //                 title={
    //                     <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
    //                 }
    //             >
    //                 <Menu.Item key="1">
    //                     <span>Full Refund</span>
    //                 </Menu.Item>
    //                 <Menu.Item key="2">
    //                     <span>Partial Refund</span>
    //                 </Menu.Item>
    //             </SubMenu>
    //         </Menu>
    // },

];

class RegistrationRefunds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2020",
            competition: "all",
            paymentFor: "all",
        }
    }

    componentDidMount() {
        if (this.stripeConnected()) {
            this.props.getStripePayoutListAction(1, null, null)
        }
    }

    stripeConnected = () => {
        let orgData = getOrganisationData()
        let stripeAccountID = orgData ? orgData.stripeAccountID : null
        return stripeAccountID
    }

    //on export button click
    onExport() {
        this.props.exportPaymentApi("payout")
    }

    headerView = () => {
        return (
            // <div className="comp-player-grades-header-view-design">
            //     <div className="row">
            //         <div className="col-sm d-flex align-content-center">
            //             <Breadcrumb separator=" > ">
            //                 <Breadcrumb.Item className="breadcrumb-add">{AppConstants.payouts}</Breadcrumb.Item>
            //             </Breadcrumb>
            //         </div>
            //     </div>
            // </div>
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm d-flex align-content-center">
                            <span className="form-heading">
                                {AppConstants.payouts}
                            </span>
                        </div>
                        <div className="col-sm-8 d-flex flex-row align-items-center justify-content-end w-100">
                            <div className="row">
                                <div className="col-sm pt-1">
                                    <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                        <Button
                                            onClick={() => this.onExport()}
                                            className="primary-add-comp-form"
                                            type="primary"
                                        >
                                            <div className="row">
                                                <div className="col-sm">
                                                    <img
                                                        src={AppImages.export}
                                                        alt=""
                                                        className="export-image"
                                                    />
                                                    {AppConstants.export}
                                                </div>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    handleStripePayoutList = (key) => {
        let page = this.props.stripeState.stripePayoutListPage
        let stripePayoutList = this.props.stripeState.stripePayoutList
        let starting_after = null
        let ending_before = null
        if (key === "next") {
            ///move forward
            page = parseInt(page) + 1
            let id = (stripePayoutList[stripePayoutList.length - 1]['id']);
            starting_after = id
            ending_before = null
        }
        if (key === "Previous") {
            //////move backward
            page = parseInt(page) - 1
            let id = (stripePayoutList[0]['id']);
            starting_after = null
            ending_before = id
        }
        this.props.getStripePayoutListAction(page, starting_after, ending_before)
    }

    ////checking for enabling click on next button or not
    checkNextEnabled = () => {
        let currentPage = this.props.stripeState.stripePayoutListPage
        let totalCount = this.props.stripeState.stripePayoutListTotalCount ? this.props.stripeState.stripePayoutListTotalCount : 1
        let lastPage = Math.ceil(parseInt(totalCount) / 10)
        if (lastPage == currentPage) {
            return false
        } else {
            return true
        }
    }

    payoutListView = () => {
        let stripePayoutList = this.props.stripeState.stripePayoutList
        let previousEnabled = this.props.stripeState.stripePayoutListPage == 1 ? false : true
        let nextEnabled = this.checkNextEnabled()
        let currentPage = this.props.stripeState.stripePayoutListPage
        let totalCount = this.props.stripeState.stripePayoutListTotalCount ? this.props.stripeState.stripePayoutListTotalCount : 1
        let totalPageCount = Math.ceil(parseInt(totalCount) / 10)
        return (
            <div>
                <div className="table-responsive home-dash-table-view mt-5 mb-5">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={stripePayoutList}
                        pagination={false}
                        loading={this.props.stripeState.onLoad && true}
                    />
                </div>
                <div className="reg-payment-pages-div mb-5">
                    <span className="reg-payment-paid-reg-text">{AppConstants.currentPage + " - " + currentPage}</span>
                    <span className="reg-payment-paid-reg-text pt-2">{AppConstants.totalPages + " - " + totalPageCount}</span>
                </div>
                <div className="d-flex justify-content-end " style={{ paddingBottom: 100 }}>
                    <div className="pagination-button-div" onClick={() => previousEnabled && this.handleStripePayoutList("Previous")}>
                        <span style={!previousEnabled ? { color: "#9b9bad" } : null}
                            className="pagination-button-text">{AppConstants.previous}</span>
                    </div>
                    <div className="pagination-button-div" onClick={() => nextEnabled && this.handleStripePayoutList("next")}>
                        <span style={!nextEnabled ? { color: "#9b9bad" } : null}
                            className="pagination-button-text">{AppConstants.next}</span>
                    </div>
                </div>
            </div>
        )
    }

    dropdownView = () => {
        return (
            <div className="row">
                <div className="col-sm">
                    <InputWithHead required="pt-0" heading={AppConstants.year} />
                    <Select
                        className="reg-payment-select w-100"
                        style={{ paddingRight: 1, minWidth: 160, maxHeight: 60, minHeight: 44 }}
                        onChange={(year) => this.setState({ year })}
                        value={this.state.year}
                    >
                        <Option value="2020">{AppConstants.year2020}</Option>
                        <Option value="2019">{AppConstants.year2019}</Option>
                        <Option value="2018">{AppConstants.year2018}</Option>
                        <Option value="2017">{AppConstants.year2017}</Option>
                        <Option value="2016">{AppConstants.year2016}</Option>
                    </Select>
                </div>
                <div className="col-sm">
                    <InputWithHead required="pt-0" heading={AppConstants.competition} />

                    <Select
                        className="reg-payment-select w-100"
                        style={{ paddingRight: 1, minWidth: 160 }}
                        onChange={(competition) => this.setState({ competition })}
                        value={this.state.competition}
                    >
                        <Option value="all">{AppConstants.all}</Option>
                        <Option value="2020">{AppConstants.year2020}</Option>
                        <Option value="2019">{AppConstants.year2019}</Option>
                        <Option value="2018">{AppConstants.year2018}</Option>
                        <Option value="2017">{AppConstants.year2017}</Option>
                        <Option value="2016">{AppConstants.year2016}</Option>
                    </Select>
                </div>
                <div className="col-sm">
                    <InputWithHead required="pt-0" heading={AppConstants.paymentFor} />
                    <Select
                        className="reg-payment-select w-100"
                        style={{ paddingRight: 1, minWidth: 160 }}
                        onChange={(paymentFor) => this.setState({ paymentFor })}
                        value={this.state.paymentFor}
                    >
                        <Option value="all">{AppConstants.all}</Option>
                        <Option value="2020">{AppConstants.year2020}</Option>
                        <Option value="2019">{AppConstants.year2019}</Option>
                        <Option value="2018">{AppConstants.year2018}</Option>
                        <Option value="2017">{AppConstants.year2017}</Option>
                        <Option value="2016">{AppConstants.year2016}</Option>
                    </Select>
                </div>
                <div className="col-sm">
                    <InputWithHead required="pt-0" heading={AppConstants.dateFrom} />
                    <DatePicker
                        className="reg-payment-datepicker w-100"
                        // size="large"
                        style={{ minWidth: 160 }}
                        onChange={date => this.dateOnChangeFrom(date)}
                        format="DD-MM-YYYY"
                        showTime={false}
                        placeholder="dd-mm-yyyy"
                    />
                </div>
                <div className="col-sm">
                    <InputWithHead required="pt-0" heading={AppConstants.dateTo} />
                    <DatePicker
                        className="reg-payment-datepicker w-100"
                        // size="large"
                        style={{ minWidth: 160 }}
                        onChange={date => this.dateOnChangeTo(date)}
                        format="DD-MM-YYYY"
                        showTime={false}
                        placeholder="dd-mm-yyyy"
                    />
                </div>
            </div>
        )
    }

    contentView = () => {
        return (
            <div className="comp-dash-table-view mt-2">
                {this.dropdownView()}
                {this.payoutListView()}
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.finance} menuName={AppConstants.finance} />
                <InnerHorizontalMenu menu="finance" finSelectedKey="3" />
                <Layout >
                    {this.headerView()}
                    <Content>
                        {this.contentView()}
                        {/* <Loader visible={this.props.stripeState.onLoad} /> */}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getStripePayoutListAction,
        exportPaymentApi
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        stripeState: state.StripeState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationRefunds);
