import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Input, Icon, Select, Menu, Pagination, Modal } from "antd";
import "./product.scss";
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { regCompetitionListAction, clearCompReducerDataAction, regCompetitionListDeleteAction } from "../../store/actions/registrationAction/competitionFeeAction";
import AppImages from "../../themes/appImages";
import { getOnlyYearListAction, CLEAR_OWN_COMPETITION_DATA } from "../../store/actions/appAction";
import { checkUserRole } from "../../util/permissions";
import { currencyFormat } from "../../util/currencyFormat";
import { stringTONumber } from "../../util/helpers"
import Tooltip from 'react-png-tooltip'

const { confirm } = Modal;
const { Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;
let this_Obj = null;


/////function to sort table column
function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_Obj.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }
    this_Obj.setState({ sortBy, sortOrder });
    this_Obj.props.regCompetitionListAction(this_Obj.state.offset, this_Obj.state.yearRefId, this_Obj.state.searchText, sortBy, sortOrder);
}

function totalSeasonalFees(seasonalFees1, record) {
    let affiliateFeeStatus = false;
    if (record.childSeasonalFee == null && record.childSeasonalGst == null && record.parentCreator === false) {
        affiliateFeeStatus = true;  ////need to verify to change
    } else {
        affiliateFeeStatus = false;
    }

    let childSeasonalFee = stringTONumber(record.childSeasonalFee);
    let childSeasonalGst = stringTONumber(record.childSeasonalGst);
    let mSeasonalfee = stringTONumber(record.mSeasonalfee);
    let mSeasonalgst = stringTONumber(record.mSeasonalgst);
    let seasonalGST = stringTONumber(record.seasonalGST);
    let seasonalFees = stringTONumber(record.seasonalFees);
    let parentFees = (seasonalFees + seasonalGST + mSeasonalfee + mSeasonalgst);
    let childFees = parentFees + (childSeasonalFee + childSeasonalGst)
    let fee = record.parentCreator ? parentFees : childFees
    return (
        affiliateFeeStatus ?
            <span>{record.feeOrgId == null ? "N/A" : (record.seasonalFees == null && record.seasonalGST == null) ? "N/A" : "Affiliate fee not set!"}</span>
            :
            <span>
                {(record.seasonalFees == null && record.seasonalGST == null) && record.parentCreator === true ? "N/A" : currencyFormat(fee)}
            </span>
        // <span>
        //     {(record.seasonalFees == null && record.seasonalGST == null) && record.parentCreator === true ? "" : currencyFormat(fee)}
        // </span>
    )
}

function totalCasualFees(casualFees1, record) {
    let affiliateFeeStatus = false;
    if (record.childCasualFee == null && record.childCasualGst == null && record.parentCreator === false) {
        affiliateFeeStatus = true;/////need to verify to change
    } else {
        affiliateFeeStatus = false;
    }
    let childCasualFee = stringTONumber(record.childCasualFee);
    let childCasualGst = stringTONumber(record.childCasualGst);
    let mCasualfee = stringTONumber(record.mCasualfee);
    let mCasualgst = stringTONumber(record.mCasualgst);
    let casualGST = stringTONumber(record.casualGST);
    let casualFees = stringTONumber(record.casualFees);

    let parentFees = (casualFees + casualGST + mCasualfee + mCasualgst);
    let childFees = parentFees + (childCasualFee + childCasualGst)

    let fee = record.parentCreator ? parentFees : childFees

    return (
        affiliateFeeStatus ?
            <span>{record.feeOrgId == null ? "N/A" : (record.casualFees == null && record.casualGST == null) ? "N/A" : "Affiliate fee not set!"}</span>
            :
            <span>
                {(record.casualFees == null && record.casualGST == null) && record.parentCreator === true ? "N/A" : currencyFormat(fee)}
            </span>
        // <span>
        //     {(record.casualFees == null && record.casualGST == null) && record.parentCreator === true ? "" : currencyFormat(fee)}
        // </span>
    )
}

const listeners = (key) => ({
    onClick: () => tableSort(key),
});

const columns = [
    {
        title: "Competition Name",
        dataIndex: "competitionName",
        key: "competitionName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: "Organiser",
        dataIndex: "organiser",
        key: "organiser",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: organiser => (
            <span>{organiser === null || organiser === "" ? "N/A" : organiser}</span>
        ),

    },
    {
        title: "Affiliate",
        dataIndex: "affiliateName",
        key: "affiliateName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("affiliate"),
        render: affiliateName => (
            <span>{affiliateName === null || affiliateName === "" ? "N/A" : affiliateName}</span>
        ),

    },
    {
        title: "Membership Product",
        dataIndex: "membershipProductName",
        key: "membershipProductName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("membershipProduct"),
    },
    {
        title: "Membership Type",
        dataIndex: "membershipProductTypeName",
        key: "membershipProductTypeName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("membershipType"),
    },
    {
        title: "Registration Divisions",
        dataIndex: "divisionName",
        key: "divisionName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("registrationDivisions"),
        render: divisionName => (
            <span>{divisionName === null || divisionName === "" ? "N/A" : divisionName}</span>
        ),

    },
    {
        title: "Total Fee - Seasonal (inc GST)",
        dataIndex: "seasonalFees",
        key: "seasonalFees",
        render: (seasonalFees, record) => totalSeasonalFees(seasonalFees, record),
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("totalSeasonalFee"),
    },
    {
        title: "Total Fee - Single Game (inc GST)",
        dataIndex: "casualFees",
        key: "casualFees",
        render: (casualFees, record) => totalCasualFees(casualFees, record),
        sorter: true,
        filterDropdown: true,
        filterIcon: () => {
            return (

                <div style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                    <Tooltip placement="bottom" background='#ff8237'>
                        <span>{AppConstants.totalFeeMsg}</span>
                    </Tooltip>
                </div>


            );
        },
        onHeaderCell: ({ dataIndex }) => listeners("totalCasualFee"),
    },
    {
        title: "Action",
        dataIndex: "isUsed",
        key: "isUsed",
        render: (isUsed, record) => (
            // isUsed == false ? <Menu
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <SubMenu
                    key="sub1"
                    title={
                        <img
                            className="dot-image"
                            src={AppImages.moreTripleDot}
                            alt=""
                            width="16"
                            height="16"
                        />
                    }
                >
                    <Menu.Item key="1">
                        <NavLink to={{ pathname: `/registrationCompetitionFee`, state: { id: record.competitionUniqueKey, affiliateOrgId: record.affiliateOrgId } }} >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2" disabled={record.statusRefId == 2 ? true : false} onClick={() => this_Obj.showDeleteConfirm(record.competitionUniqueKey)}>
                        <span>Delete</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
            //  : null
        )
    }
];

class RegistrationCompetitionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
            deleteLoading: false,
            userRole: "",
            searchText: '',
            offset: 0,
            sortBy: null,
            sortOrder: null

        };
        this_Obj = this;
        this.props.CLEAR_OWN_COMPETITION_DATA()
        this.props.getOnlyYearListAction(this.props.appState.yearList)
    }


    async componentDidMount() {

        const { competitionListAction } = this.props.competitionFeesState

        checkUserRole().then((value) => (
            this.setState({ userRole: value })
        ))
        let page = 1
        let sortBy = this.state.sortBy
        let sortOrder = this.state.sortOrder
        if (competitionListAction) {
            let offset = competitionListAction.offset
            sortBy = competitionListAction.sortBy
            sortOrder = competitionListAction.sortOrder
            let yearRefId = competitionListAction.yearRefId
            let searchText = competitionListAction.searchText

            await this.setState({ offset, sortBy, sortOrder, yearRefId, searchText })
            page = Math.floor(offset / 10) + 1;

            this.handleCompetitionTableList(page, yearRefId, searchText)
        } else {

            this.handleCompetitionTableList(1, this.state.yearRefId, this.state.searchText)
        }
    }

    componentDidUpdate(nextProps) {
        if (this.props.competitionFeesState.onLoad === false && this.state.deleteLoading === true) {
            this.setState({
                deleteLoading: false,
            })
            this.handleCompetitionTableList(1, this.state.yearRefId, this.state.searchText)
        }
    }

    deleteProduct = (competitionId) => {
        this.props.regCompetitionListDeleteAction(competitionId)
        this.setState({ deleteLoading: true })
    }

    showDeleteConfirm = (competitionId) => {
        let this_ = this
        confirm({
            title: 'Are you sure delete this product?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                this_.deleteProduct(competitionId)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div
                        className="col-sm"
                        style={{ display: "flex", alignContent: "center" }}
                    >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">
                                Competition Fees
              </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>
        );
    };

    //////year change onchange
    yearChange = (yearRefId) => {
        this.setState({ yearRefId })
        this.handleCompetitionTableList(1, yearRefId, this.state.searchText)
    }
    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value })
        if (e.target.value == null || e.target.value == "") {
            this.handleCompetitionTableList(1, this.state.yearRefId, e.target.value);
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        console.log(e.keyCode, "******", e.which)
        if (code === 13) { //13 is the enter keycode
            this.handleCompetitionTableList(1, this.state.yearRefId, this.state.searchText);
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        if (this.state.searchText == null || this.state.searchText == "") {
        }
        else {
            this.handleCompetitionTableList(1, this.state.yearRefId, this.state.searchText);
        }
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row" >
                        <div className="col-sm-2">
                            <div className="com-year-select-heading-view pb-3">
                                <span className="year-select-heading" style={{ width: 50 }}>{AppConstants.year}:</span>
                                <Select
                                    style={{ width: 90 }}
                                    className="year-select reg-filter-select-year ml-2"
                                    value={this.state.yearRefId}
                                    onChange={(e) => this.yearChange(e)}
                                >
                                    {this.props.appState.yearList.map(item => {
                                        return (
                                            <Option key={"yearRefId" + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm"></div>
                        <div style={{ marginRight: "25px", display: "flex", alignItems: 'center' }} >
                            <div className="comp-product-search-inp-width pb-3" >
                                <Input className="product-reg-search-input"
                                    onChange={(e) => this.onChangeSearchText(e)}
                                    placeholder="Search..."
                                    onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                    value={this.state.searchText}
                                    prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                        onClick={() => this.onClickSearchIcon()}
                                    />}
                                    allowClear
                                />
                            </div>
                        </div>

                        {/* {this.state.userRole == AppConstants.admin && */}
                        <div style={{ marginRight: '1%', display: "flex", alignItems: 'center' }}>
                            <div className="d-flex flex-row-reverse button-with-search pb-3"
                                // <div className="col-sm d-flex justify-content-end"
                                onClick={() => this.props.clearCompReducerDataAction("all")}>
                                <NavLink
                                    to={{ pathname: `/registrationCompetitionFee`, state: { id: null } }}
                                    className="text-decoration-none"
                                >
                                    <Button className="primary-add-product" type="primary">
                                        + {AppConstants.addCompetition}
                                    </Button>
                                </NavLink>
                            </div>
                        </div>
                        {/* } */}
                    </div>
                </div>
            </div>
        );
    };

    handleCompetitionTableList = (page, yearRefId, searchText) => {
        let { sortBy, sortOrder } = this.state
        let offset = page ? 10 * (page - 1) : 0;
        this.setState({
            offset,
        })
        this.props.regCompetitionListAction(offset, yearRefId, searchText, sortBy, sortOrder);
    };

    ////////form content view
    contentView = () => {
        const { competitionFeesState } = this.props;
        let total = competitionFeesState.regCompetitonFeeListTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view table-competition">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={competitionFeesState.regCompetitionFeeListData}
                        pagination={false}
                        loading={this.props.competitionFeesState.onLoad == true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={competitionFeesState.regCompetitonFeeListPage}
                        total={total}
                        onChange={(page) => this.handleCompetitionTableList(page, this.state.yearRefId, this.state.searchText)}
                    />
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.registration}
                    menuName={AppConstants.registration}
                />
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"7"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        regCompetitionListAction, getOnlyYearListAction,
        clearCompReducerDataAction, regCompetitionListDeleteAction,
        CLEAR_OWN_COMPETITION_DATA
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        competitionFeesState: state.CompetitionFeesState,
        appState: state.AppState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((RegistrationCompetitionList));
