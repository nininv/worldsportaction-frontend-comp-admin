import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Pagination, Input, Icon } from 'antd';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { liveScoreTeamAttendanceListAction } from '../../store/actions/LiveScoreAction/liveScoreTeamAttendanceAction'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { liveScore_formateDateTime } from '../../themes/dateformate'
import history from "../../util/history";
import { isArrayNotEmpty } from '../../util/helpers'
import { exportFilesAction } from "../../store/actions/appAction"

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const { Content } = Layout;
const { Option } = Select;
const columns = [

    {
        title: 'Match id',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => tableSort(a, b, "matchId"),
        render: (matchId) =>
            <NavLink to={{
                pathname: '/liveScoreMatchDetails',
                state: { matchId: matchId }
            }}>
                <span className="input-heading-add-another pt-0">{matchId}</span>
            </NavLink>

    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => tableSort(a, b, 'startTime'),
        render: (teamName) =>
            <span >{liveScore_formateDateTime(teamName)}</span>
    },
    {
        title: 'Team',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => tableSort(a, b, 'name'),
        render: (name) =>
            <span >{name}</span>

    },
    {
        title: 'Player Id',
        dataIndex: 'playerId',
        key: 'playerId',
        sorter: (a, b) => tableSort(a, b, 'playerId'),
    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => tableSort(a, b, 'firstName'),
        render: (firstName) =>
            <span className="input-heading-add-another pt-0">{firstName}</span>

    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => tableSort(a, b, 'lastName'),
        render: (lastName) =>

            <span className="input-heading-add-another pt-0">{lastName}</span>

    },
    {
        title: 'Division',
        dataIndex: 'divisionName',
        key: 'divisionName',
        sorter: (a, b) => tableSort(a, b, 'divisionName'),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => tableSort(a, b, 'status'),
    },
    {
        title: 'Position',
        dataIndex: 'positionName',
        key: 'positionName',
        sorter: (a, b) => tableSort(a, b, 'positionName'),
    },
];


class LiveScoreTeamAttendance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2020",
            teamSelection: "WSA 1",
            selectStatus: "Borrowed",
            competitionId: null,
            searchText: ""
        }
    }


    // componentDidMount
    componentDidMount() {
        let paginationBody = {
            "paging": {
                "limit": 10,
                "offset": 0
            },
        }
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ competitionId: id })
        if (id !== null) {
            this.props.liveScoreTeamAttendanceListAction(id, paginationBody, this.state.selectStatus)
        } else {
            history.pushState('/')
        }
    }


    handleTablePagination(page) {
        let offset = page ? 10 * (page - 1) : 0;

        const paginationBody = {
            "paging": {
                "limit": 10,
                "offset": offset
            },
        }
        let { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            this.props.liveScoreTeamAttendanceListAction(id, paginationBody, this.state.selectStatus)
        } else {
            history.pushState('/')
        }
    }

    onChnageStatus(status) {
        this.setState({ selectStatus: status })
        const paginationBody = {
            "paging": {
                "limit": 10,
                "offset": 0
            },
        }
        let { id } = JSON.parse(getLiveScoreCompetiton())
        this.props.liveScoreTeamAttendanceListAction(id, paginationBody, status)
    }

    onExport() {
        let url = AppConstants.teamAttendaneExport + this.state.competitionId + `&status=${this.state.selectStatus}`
        this.props.exportFilesAction(url)
    }

    // on change search text
    onChangeSearchText = (e) => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ searchText: e.target.value })
        if (e.target.value == null || e.target.value == "") {
            const body =
            {
                "paging": {
                    "limit": 10,
                    "offset": 0
                },
                "search": e.target.value
            }

            this.props.liveScoreTeamAttendanceListAction(id, body, this.state.selectStatus)
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (code === 13) { //13 is the enter keycode
            const body =
            {
                "paging": {
                    "limit": 10,
                    "offset": 0
                },
                "search": e.target.value
            }
            this.props.liveScoreTeamAttendanceListAction(id, body, this.state.selectStatus)
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (this.state.searchText == null || this.state.searchText == "") {
        }
        else {
            const body =
            {
                "paging": {
                    "limit": 10,
                    "offset": 0
                },
                "search": this.state.searchText
            }
            this.props.liveScoreTeamAttendanceListAction(id, body, this.state.selectStatus)
        }
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                < div className="row" >
                    <div className="col-sm" style={{ alignSelf: 'center' }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.teamAttendane}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>


                    <div className="col-sm" style={{
                        display: "flex",
                        flexDirection: 'row',
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}>
                        <div className="row">



                            <Select
                                className="year-select"
                                style={{ display: "flex", alignItems: "flex-start" }}
                                onChange={(selectStatus) => this.onChnageStatus(selectStatus)}
                                value={this.state.selectStatus} >
                                <Option value={"Borrowed"}>{'Borrowed Player'}</Option>
                                <Option value={"Did Not Play"}>{'Did Not Play'}</Option>
                                <Option value={"Played"}>{'Played'}</Option>
                            </Select>

                            <div className="col-sm"
                                style={{ display: "flex" }}>
                                <div
                                    className="comp-dashboard-botton-view-mobile"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end",
                                        alignSelf: 'center',
                                    }}
                                >
                                    <Button onClick={() => this.onExport()} className="primary-add-comp-form" type="primary">
                                        <div className="row">
                                            <div className="col-sm">
                                                <img
                                                    src={AppImages.export}
                                                    alt=""
                                                    height="12"
                                                    width="12"
                                                    style={{ marginRight: 5 }}
                                                />
                                                {AppConstants.export}
                                            </div>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div >
                {/* search box */}
                <div className="col-sm pt-3 ml-3" style={{ display: "flex", justifyContent: 'flex-end', }} >
                    <div className="comp-product-search-inp-width" >
                        <Input className="product-reg-search-input"
                            onChange={(e) => this.onChangeSearchText(e)}
                            placeholder="Search..."
                            onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                            prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                onClick={() => this.onClickSearchIcon()}
                            />}
                            allowClear
                        />
                    </div>
                </div>
            </div >

        )
    }
    ////////form content view
    contentView = () => {
        const { teamAttendanceResult, teamAttendancePage, teamAttendanceTotalCount } = this.props.liveScoreTeamAttendanceState
        let dataSource = isArrayNotEmpty(teamAttendanceResult) ? teamAttendanceResult : []
        let total = teamAttendanceTotalCount
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreTeamAttendanceState.onLoad == true && true}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={teamAttendancePage}
                        total={total}
                        onChange={(page) => this.handleTablePagination(page)}
                    />
                </div>
            </div>
        )
    }

    /////// render function 
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"14"} />
                <Layout>
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
        liveScoreTeamAttendanceListAction,
        exportFilesAction
    }, dispatch)
}
function mapStateToProps(state) {
    return {
        liveScoreTeamAttendanceState: state.LiveScoreTeamAttendanceState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreTeamAttendance);



