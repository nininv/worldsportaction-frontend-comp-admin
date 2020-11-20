import React, { Component } from "react";
import { Layout, Breadcrumb, Select, DatePicker, Button, Table, Menu, Pagination } from 'antd';
import './umpire.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import InputWithHead from "../../customComponents/InputWithHead";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


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
        sorter: (a, b) => tableSort(a, b, "balance_transaction"),
    },
    {
        title: "Description",
        dataIndex: 'description',
        key: 'description',
        sorter: (a, b) => tableSort(a, b, "description"),
    },
    {
        title: "Date",
        dataIndex: 'created',
        key: 'created',
        sorter: (a, b) => tableSort(a, b, "created"),
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',

        sorter: (a, b) => tableSort(a, b, "amount")
    },
    {
        title: "Status",
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => tableSort(a, b, "status")
    },
];

const data = []

class UmpirePayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2020",
            competition: "all",
            paymentFor: "all",
        }
    }



    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row">
                        <div className='col-sm' style={{ display: "flex", alignContent: "center" }}>
                            <span className="form-heading">
                                {AppConstants.payouts}
                            </span>
                        </div>
                        <div className="col-sm-8" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: '100%' }}>
                            <div className="row">
                                <div className="col-sm pt-1">
                                    <div
                                        className="comp-dashboard-botton-view-mobile"
                                        style={{
                                            width: '100%',
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-end"
                                        }}
                                    >
                                        <Button
                                            className="primary-add-comp-form" type="primary">
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


    payoutListView = () => {

        let currentPage = 1

        let previousEnabled = currentPage == 1 ? false : true
        return (
            <div>
                <div className="table-responsive home-dash-table-view mt-5 mb-5">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                    />
                </div>
                <div className="reg-payment-pages-div mb-5">
                    <span className="reg-payment-paid-reg-text">{AppConstants.currentPage + " - " + currentPage}</span>
                    <span className="reg-payment-paid-reg-text pt-2">{AppConstants.totalPages + " - " + currentPage}</span>
                </div>
                <div className="d-flex justify-content-end " style={{ paddingBottom: 100 }}>
                    <div className="pagination-button-div">
                        <span style={!previousEnabled ? { color: "#9b9bad" } : null}
                            className="pagination-button-text">{AppConstants.previous}</span>
                    </div>
                    <div className="pagination-button-div">
                        <span style={!previousEnabled ? { color: "#9b9bad" } : null}
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
                        className="reg-payment-select"
                        style={{ width: '100%', paddingRight: 1, minWidth: 160, maxHeight: 60, minHeight: 44 }}
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
                        className="reg-payment-select"
                        style={{ width: '100%', paddingRight: 1, minWidth: 160 }}
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
                        className="reg-payment-select"
                        style={{ width: '100%', paddingRight: 1, minWidth: 160 }}
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
                        className="reg-payment-datepicker"
                        size="large"
                        style={{ width: '100%', minWidth: 160 }}
                        // onChange={date => this.dateOnChangeFrom(date)}
                        format="DD-MM-YYYY"
                        showTime={false}
                        placeholder="dd-mm-yyyy"
                    />
                </div>
                <div className="col-sm">
                    <InputWithHead required="pt-0" heading={AppConstants.dateTo} />
                    <DatePicker
                        className="reg-payment-datepicker"
                        size="large"
                        style={{ width: '100%', minWidth: 160 }}
                        // onChange={date => this.dateOnChangeTo(date)}
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
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="8" />
                <Layout >
                    {this.headerView()}
                    <Content>
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch)
}

function mapStatetoProps(state) {
    return {
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)((UmpirePayout));
