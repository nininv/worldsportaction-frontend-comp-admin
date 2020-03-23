import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Pagination } from 'antd';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { liveScoreTeamAttendanceListAction } from '../../store/actions/LiveScoreAction/liveScoreTeamAttendanceAction'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage'
import { liveScore_formateDateTime } from '../../themes/dateformate'
import history from "../../util/history";

function handleSorting(a, b, key) {
    if (a[key] && b[key]) {
        return a[key].length - b[key].length
    }
}

const { Content } = Layout;
const { Option } = Select;
const columns = [

    {
        title: 'Match id',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => handleSorting(a, b, "matchId"),
        render: (matchId) =>
            <span className="input-heading-add-another pt-0">{matchId}</span>

    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => handleSorting(a, b, 'startTime'),
        render: (teamName) =>
            <span >{liveScore_formateDateTime(teamName)}</span>
    },
    {
        title: 'Team',
        dataIndex: 'teamName',
        key: 'teamName',
        sorter: (a, b) => handleSorting(a, b, 'teamName'),
        render: (teamName) =>

            <span className="input-heading-add-another pt-0">{teamName}</span>


    },
    {
        title: 'Player Id',
        dataIndex: 'playerId',
        key: 'playerId',
        sorter: (a, b) => handleSorting(a, b, 'playerId'),
    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => handleSorting(a, b, 'firstName'),
        render: (firstName) =>
            <span className="input-heading-add-another pt-0">{firstName}</span>

    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => handleSorting(a, b, 'lastName'),
        render: (lastName) =>

            <span className="input-heading-add-another pt-0">{lastName}</span>

    },
    {
        title: 'Division',
        dataIndex: 'divisionName',
        key: 'divisionName',
        sorter: (a, b) => handleSorting(a, b, 'divisionName'),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => handleSorting(a, b, 'status'),
    },
    {
        title: 'Position',
        dataIndex: 'positionName',
        key: 'positionName',
        sorter: (a, b) => handleSorting(a, b, 'positionName'),
    },
];


class LiveScoreTeamAttendance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2020",
            teamSelection: "WSA 1",
            selectStatus: "Select Status"
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
        if (id !== null) {
            this.props.liveScoreTeamAttendanceListAction(id, paginationBody)
            // this.handleTablePagination(page, competitionId,paginationBody)
        } else {
            history.pushState('/')
        }
    }


    handleTablePagination(page) {
        let offset = page ? 10 * (page - 1) : 0;
        console.log(page)
        const paginationBody = {
            "paging": {
                "limit": 10,
                "offset": offset
            },
        }
        let { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            this.props.liveScoreTeamAttendanceListAction(id, paginationBody)
        } else {
            history.pushState('/')
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
                                onChange={(selectStatus) => this.setState({ selectStatus })}
                                value={this.state.selectStatus} >
                                <Option value={"11A"}>{'Borrowed Player'}</Option>
                                <Option value={"11B"}>{'Did Not Play'}</Option>
                                <Option value={"11C"}>{'Played'}</Option>
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
                                    <Button className="primary-add-comp-form" type="primary">
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
            </div >

        )
    }
    ////////form content view
    contentView = () => {
        const { teamAttendanceResult, teamAttendancePage, teamAttendanceTotalCount } = this.props.liveScoreTeamAttendanceState
        let dataSource = teamAttendanceResult ? teamAttendanceResult.stats : ''
        // console.log(dataSource, "dataSource")
        let total = teamAttendanceTotalCount ? teamAttendanceTotalCount : ''
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
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
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
    }, dispatch)
}
function mapStateToProps(state) {
    return {
        liveScoreTeamAttendanceState: state.LiveScoreTeamAttendanceState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreTeamAttendance);



