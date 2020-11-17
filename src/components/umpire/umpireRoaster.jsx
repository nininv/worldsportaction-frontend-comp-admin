import React, { Component } from "react";
import { Layout, Button, Table, Select, Menu, Pagination, message } from 'antd';
import './umpire.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isArrayNotEmpty } from "../../util/helpers";
import { umpireRoasterListAction, umpireRoasterOnActionClick } from "../../store/actions/umpireAction/umpirRoasterAction"
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { refRoleTypes } from '../../util/refRoles'
import { getUmpireCompetiton, setUmpireCompition, setUmpireCompitionData } from '../../util/sessionStorage'
import moment from "moment";
import ValidationConstants from "../../themes/validationConstant";
import history from "../../util/history";
import { exportFilesAction } from "../../store/actions/appAction"
import { getOrganisationAction } from "store/actions/userAction/userAction";
import { regCompetitionFeeListDeleteSaga } from "store/saga/registrationSaga/competitionFeeSaga";

const { Content } = Layout;
const { Option } = Select;

let this_obj = null;

function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_obj.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }
    const body = {
        paging: {
            limit: 10,
            offset: this_obj.state.offsetData
        }
    }
    this_obj.setState({ sortBy, sortOrder });
    let rolIds = Array.isArray(this_obj.state.umpireRole) ? JSON.stringify(this_obj.state.umpireRole) : JSON.stringify([this_obj.state.umpireRole])
    this_obj.props.umpireRoasterListAction(this_obj.state.selectedComp, this_obj.state.status, rolIds, body, sortBy, sortOrder)
}
/////function to sort table column
// function tableSort(a, b, key) {
//     let stringA = JSON.stringify(a[key])
//     let stringB = JSON.stringify(b[key])
//     return stringA.localeCompare(stringB)
// }

// listeners for sorting
const listeners = (key) => ({
    onClick: () => tableSort(key),
});

const columns = [

    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'First Name',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (firstName, record) =>
            <span className="input-heading-add-another pt-0" onClick={() => this_obj.checkUserId(record)}>{record.user.firstName}</span>
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'Last Name',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (lastName, record) =>

            <span className="input-heading-add-another pt-0" onClick={() => this_obj.checkUserId(record)}>{record.user.lastName}</span>
    },
    {
        title: 'Organisation',
        dataIndex: 'organisation',
        key: 'Organisation',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (user, record) => {
            let organisationArray = record.user.userRoleEntities.length > 0 && this_obj.getOrganisationArray(record.user.userRoleEntities, record.roleId)
            return (
                <div>
                    {organisationArray.map((item, index) => (
                        <span key={`organisationName` + index} className='multi-column-text-aligned'>
                            {item.competitionOrganisation && item.competitionOrganisation.name}
                        </span>
                    ))}
                </div>
            )
        },
    },
    {
        title: 'Match ID',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (matchId) => {
            return (
                <NavLink to={{
                    pathname: '/liveScoreMatchDetails',
                    state: { matchId: matchId, umpireKey: 'umpire', screenName: "umpireRoster" }
                }}>
                    <span className="input-heading-add-another pt-0">{matchId}</span>
                </NavLink>
            )
        }
    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'Start Time',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (startTime, record) =>
            <span >{moment(record.match.startTime).format("DD/MM/YYYY HH:mm")}</span>
    },
    {
        title: 'Role',
        dataIndex: 'roleId',
        key: 'roleId',
        sorter: false,
        render: (roleId, record) =>
            <span >{this_obj.getUmpireRole(roleId)}</span>
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: "Action",
        dataIndex: 'action',
        key: 'action',
        render: (data, record) => <Menu
            className="action-triple-dot-submenu"
            theme="light"
            mode="horizontal"
            style={{ lineHeight: '25px' }}
        >
            <Menu.SubMenu
                key="sub1"
                style={{ borderBottomStyle: "solid", borderBottom: 0 }}
                title={
                    <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                }
            >
                <Menu.Item key="1" onClick={() => this_obj.onActionPerform(record, 'YES')}>
                    <span  >Accept</span>
                </Menu.Item>
                <Menu.Item key="2" onClick={() => this_obj.onActionPerform(record, 'NO')}>

                    <span >Decline</span>

                </Menu.Item>
                <Menu.Item key="3" onClick={() => this_obj.onActionPerform(record, 'DELETE')}>
                    <span >Unassign</span>
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    }


];

class UmpireRoaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionid: null,
            searchText: "",
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null,
            status: 'All',
            roasterLoad: false,
            compArray: [],
            offsetData: 0,
            umpireRole: 15,
            sortBy: null,
            sortOrder: null

        }
        this_obj = this
    }

    async componentDidMount() {
        const { umpireRosterListActionObject } = this.props.umpireRoasterdState
        let sortBy = this.state.sortBy
        let sortOrder = this.state.sortOrder
        if (umpireRosterListActionObject) {
            let offsetData = umpireRosterListActionObject.paginationBody.paging.offset
            sortBy = umpireRosterListActionObject.sortBy
            sortOrder = umpireRosterListActionObject.sortOrder
            let status = umpireRosterListActionObject.status
            let umpireRole = JSON.parse(umpireRosterListActionObject.refRoleId)
            await this.setState({ sortBy, sortOrder, offsetData, status, umpireRole })
        }

        let { organisationId, } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')
    }

    componentDidUpdate(nextProps) {
        let { sortBy, sortOrder } = this.state
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading === true && this.props.umpireCompetitionState.onLoad === false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id
                let compData = compList.length > 0 && compList[0]

                if (getUmpireCompetiton()) {
                    let compId = JSON.parse(getUmpireCompetiton())
                    let index = compList.findIndex(x => x.id === compId)
                    if (index > -1) {
                        firstComp = compList[index].id
                        compData = compList[index]
                    } else {
                        setUmpireCompition(firstComp)
                        setUmpireCompitionData(JSON.stringify(compData))
                    }
                } else {
                    // setUmpireCompId(firstComp)
                    setUmpireCompition(firstComp)
                    setUmpireCompitionData(JSON.stringify(compData))

                }

                let compKey = compList.length > 0 && compList[0].competitionUniqueKey

                let sortBy = this.state.sortBy
                let sortOrder = this.state.sortOrder
                if (firstComp !== false) {
                    const body =
                    {
                        paging: {
                            limit: 10,
                            offset: this.state.offsetData
                        }
                    }

                    let roleIds = Array.isArray(this.state.umpireRole) ? JSON.stringify(this.state.umpireRole) : JSON.stringify([this.state.umpireRole])

                    this.props.umpireRoasterListAction(firstComp, this.state.status, roleIds, body, sortBy, sortOrder)
                    this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey, compArray: compList })
                } else {
                    this.setState({ loading: false })
                }
            }
        }

        if (nextProps.umpireRoasterdState !== this.props.umpireRoasterdState) {
            if (this.props.umpireRoasterdState.roasterLoading !== this.state.roasterLoad) {

                const body =
                {
                    paging: {
                        limit: 10,
                        offset: this.state.offsetData
                    }
                }
                let roleIds = Array.isArray(this.state.umpireRole) ? JSON.stringify(this.state.umpireRole) : JSON.stringify([this.state.umpireRole])
                this.props.umpireRoasterListAction(this.state.selectedComp, this.state.status, roleIds, body, sortBy, sortOrder)
                this.setState({ roasterLoad: false })
            }
        }

    }

    onActionPerform(record, status) {
        let category = this.getUmpireCategory(record.roleId)
        this.props.umpireRoasterOnActionClick({ roasterId: record.id, status: status, category: category })
        this.setState({ roasterLoad: true })
    }

    checkUserId(record) {
        if (record.userId === null) {
            message.config({ duration: 1.5, maxCount: 1 })
            message.warn(ValidationConstants.umpireMessage)
        }
        else {
            history.push("/userPersonal", { userId: record.userId, screenKey: "umpireRoaster", screen: "/umpireRoster" })
        }
    }

    getOrganisationArray(data, roleId) {
        let orgArray = []
        if (data.length > 0) {
            for (let i in data) {
                if (data[i].roleId == roleId == 19 ? 15 : roleId) {
                    orgArray.push(data[i])
                    return orgArray
                }
            }
        }
        return orgArray

    }

    //getUmpireCategory
    getUmpireCategory(roleId) {
        if (roleId == 15) {
            return "Umpiring"
        }
        else if (roleId == 19) {
            return "UmpireReserve"
        }
        else if (roleId == 20) {
            return "UmpireCoach"
        }
    }

    //getUmpireRole
    getUmpireRole(roleId) {
        if (roleId == 15) {
            return "Umpire"
        }
        else if (roleId == 19) {
            return "Umpire Reserve"
        }
        else if (roleId == 20) {
            return "Umpire Coach"
        }
    }

    /// Handle Page change
    handlePageChnage(page) {
        let { sortBy, sortOrder } = this.state
        let offset = page ? 10 * (page - 1) : 0;
        this.setState({
            offsetData: offset
        })
        const body = {
            paging: {
                limit: 10,
                offset: offset
            },
        }
        let roleIds = Array.isArray(this.state.umpireRole) ? JSON.stringify(this.state.umpireRole) : JSON.stringify([this.state.umpireRole])
        this.props.umpireRoasterListAction(this.state.selectedComp, roleIds, body, sortBy, sortOrder)
    }

    contentView = () => {
        const { umpireRoasterList, umpireTotalCount } = this.props.umpireRoasterdState
        let umpireListResult = isArrayNotEmpty(umpireRoasterList) ? umpireRoasterList : []
        return (
            <div className="comp-dash-table-view mt-0">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.umpireRoasterdState.onLoad}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={umpireListResult}
                        pagination={false}
                        rowKey={(record, index) => "umpireListResult" + record.id + index} />
                </div>
                <div className="comp-dashboard-botton-view-mobile">
                    <div
                        className="comp-dashboard-botton-view-mobile"
                        style={{
                            width: '100%',
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end"
                        }}>
                    </div>
                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination"
                            total={umpireTotalCount}
                            onChange={(page) => this.handlePageChnage(page)}
                        />
                    </div>
                </div>
            </div>
        )
    }



    onChangeComp(compID) {
        let { sortBy, sortOrder } = this.state
        let selectedComp = compID.comp
        let compObj = null
        for (let i in this.state.compArray) {
            if (compID.comp === this.state.compArray[i].id) {
                compObj = this.state.compArray[i]
                break;
            }
        }
        setUmpireCompition(selectedComp)
        setUmpireCompitionData(JSON.stringify(compObj))



        let compKey = compID.competitionUniqueKey

        const body = {
            paging: {
                limit: 10,
                offset: 0
            },
        }
        let roleIds = Array.isArray(this.state.umpireRole) ? JSON.stringify(this.state.umpireRole) : JSON.stringify([this.state.umpireRole])
        this.props.umpireRoasterListAction(selectedComp, this.state.status, roleIds, body, sortBy, sortOrder)
        this.setState({ selectedComp, competitionUniqueKey: compKey })

    }

    onChangeStatus(status) {
        let { sortBy, sortOrder } = this.state
        const body = {
            paging: {
                limit: 10,
                offset: 0
            },
        }

        if (this.state.selectedComp) {
            let roleIds = Array.isArray(this.state.umpireRole) ? JSON.stringify(this.state.umpireRole) : JSON.stringify([this.state.umpireRole])
            this.props.umpireRoasterListAction(this.state.selectedComp, status, roleIds, body, sortBy, sortOrder)

        }
        this.setState({ status })
    }

    onChangeRole(umpireRole) {
        let { sortBy, sortOrder } = this.state
        const body = {
            paging: {
                limit: 10,
                offset: 0
            },
        }

        if (this.state.selectedComp) {
            let roleIds = Array.isArray(this.state.umpireRole) ? JSON.stringify(this.state.umpireRole) : JSON.stringify([this.state.umpireRole])
            this.props.umpireRoasterListAction(this.state.selectedComp, this.state.status, roleIds, body, sortBy, sortOrder)
        }
        this.setState({ umpireRole })
    }


    // on Export
    onExport() {
        let url = AppConstants.rosterExport + `competitionId=${this.state.selectedComp}&roleId=${15}`
        this.props.exportFilesAction(url)
    }


    ///////view for breadcrumb
    headerView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm pt-1" style={{ display: "flex", alignContent: "center" }}>
                            <span className="form-heading">
                                {AppConstants.umpireRoster}
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
                                        <Button onClick={() => this.onExport()} className="primary-add-comp-form" type="primary">
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
                                {/* <div className="col-sm pt-1">
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
                                        <NavLink to={{
                                            pathname: `/umpireImport`,
                                            state: { screenName: 'umpireRoaster' }
                                        }} className="text-decoration-none">
                                            <Button className="primary-add-comp-form" type="primary">
                                                <div className="row">
                                                    <div className="col-sm">
                                                        <img
                                                            src={AppImages.import}
                                                            alt=""
                                                            className="export-image"
                                                        />
                                                        {AppConstants.import}
                                                    </div>
                                                </div>
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    {/* <div className="mt-5" style={{ display: "flex", width: 'fit-content' }}>
                        <div style={{
                            width: '100%',
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            marginRight: 50,
                        }}>
                            <span className="year-select-heading">{AppConstants.competition}:</span>
                            <Select
                                className="year-select reg-filter-select1 ml-2"
                                style={{ minWidth: 200 }}
                                onChange={(comp) => this.onChangeComp({ comp })}
                                value={this.state.selectedComp}
                            >
                                {competition.map((item) => (
                                    <Option key={'competition_' + item.id} value={item.id}>{item.longName}</Option>
                                ))}
                            </Select>
                        </div>

                        <div style={{
                            width: '100%',
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            marginRight: 50,
                        }}>
                            <span className="year-select-heading">{AppConstants.status}:</span>
                            <Select
                                className="year-select reg-filter-select1 ml-2"
                                style={{ minWidth: 160 }}
                                onChange={(status) => this.onChangeStatus(status)}
                                value={this.state.status}
                            >
                                <Option value="All">All</Option>
                                <Option value="YES">Accepted</Option>
                                <Option value="NO">Declined</Option>
                                <Option value="NONE">No Response</Option>
                            </Select>
                        </div>

                    </div> */}
                </div>
            </div>
        );
    };

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []

        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row reg-filter-row">
                        {/* Comp List */}
                        <div className="reg-col">
                            <div className="reg-filter-col-cont" style={{ width: "90%" }}>
                                <span className="year-select-heading" style={{ width: '175px' }}>{AppConstants.competition}:</span>
                                <Select
                                    className="year-select reg-filter-select1"
                                    style={{ minWidth: 200 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.selectedComp}
                                >
                                    {competition.map((item) => (
                                        <Option key={'competition_' + item.id} value={item.id}>{item.longName}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {/* Venue List */}
                        <div className="reg-col1 ml-0">
                            <div className="reg-filter-col-cont ml-0" style={{ width: "90%" }}>
                                <span className="year-select-heading" style={{ width: '127px' }}>{AppConstants.status}:</span>
                                <Select
                                    className="year-select reg-filter-select1"
                                    style={{ minWidth: 160 }}
                                    onChange={(status) => this.onChangeStatus(status)}
                                    value={this.state.status}
                                >
                                    <Option value="All">All</Option>
                                    <Option value="YES">Accepted</Option>
                                    <Option value="NO">Declined</Option>
                                    <Option value="NONE">No Response</Option>
                                </Select>
                            </div>
                        </div>
                        {/* umpire role */}
                        <div className="reg-col1 ml-0">
                            <div className="reg-filter-col-cont ml-4" style={{ width: "90%" }}>
                                <span className="year-select-heading" style={{ width: "102px" }}>{AppConstants.role}:</span>
                                <Select
                                    className="year-select reg-filter-select1"
                                    style={{ minWidth: 160 }}
                                    onChange={(umpireRole) => this.onChangeRole(umpireRole)}
                                    value={this.state.umpireRole}
                                >
                                    <Option value={15}>Umpire</Option>
                                    <Option value={19}>Umpire Reserve</Option>
                                    <Option value={20}>Umpire Coach</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="3" />
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
        umpireCompetitionListAction,
        umpireRoasterListAction,
        umpireRoasterOnActionClick,
        exportFilesAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        umpireRoasterdState: state.UmpireRoasterState,
        umpireCompetitionState: state.UmpireCompetitionState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((UmpireRoaster));

