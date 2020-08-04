import React, { Component } from "react";
import { Input, Layout, Breadcrumb, Button, Table, Pagination, Icon, Select } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { liveScorePositionTrackingAction } from '../../store/actions/LiveScoreAction/liveScorePositionTrackingAction'
import { getLiveScoreCompetiton } from "../../util/sessionStorage"
import { isArrayNotEmpty } from "../../util/helpers";

const { Content } = Layout;
const { Option } = Select;

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

var _this = null

const columns_1 = [
    {
        title: 'Match Id',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => tableSort(a, b, "teamName"),
    },
    {
        title: 'Team',
        dataIndex: 'teamName',
        key: 'teamName',
        sorter: (a, b) => tableSort(a, b, "teamName"),
    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => tableSort(a, b, "firstName"),
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => tableSort(a, b, "lastName"),

    },
    {
        title: 'GS',
        dataIndex: 'gs',
        key: 'gs',
        sorter: (a, b) => tableSort(a, b, "gs"),
        render: (gs, records) =>
            <span nowrap className="column-width-style" >{gs} </span>
    },
    {
        title: 'GA',
        dataIndex: 'ga',
        key: 'ga',
        sorter: (a, b) => tableSort(a, b, "ga"),
        render: (ga, records) =>
            <span nowrap className="column-width-style" >{ga} </span>
    },
    {
        title: 'WA',
        dataIndex: 'wa',
        key: 'wa',
        sorter: (a, b) => tableSort(a, b, "wa"),
        render: (wa, records) =>
            <span nowrap className="column-width-style" >{wa} </span>
    },
    {
        title: 'C',
        dataIndex: 'c',
        key: 'c',
        sorter: (a, b) => tableSort(a, b, "c"),
        render: (c, records) =>
            <span nowrap className="column-width-style" >{c} </span>
    },
    {
        title: 'WD',
        dataIndex: 'wd',
        key: 'wd',
        sorter: (a, b) => tableSort(a, b, "wd"),
        render: (wd, records) =>
            <span nowrap className="column-width-style" >{wd} </span>
    },
    {
        title: 'GD',
        dataIndex: 'gd',
        key: 'gd',
        sorter: (a, b) => tableSort(a, b, "gd"),
        render: (gd, records) =>
            <span nowrap className="column-width-style" >{gd} </span>
    },
    {
        title: 'GK',
        dataIndex: 'gk',
        key: 'gk',
        sorter: (a, b) => tableSort(a, b, "gk"),
        render: (gk, records) =>
            <span nowrap className="column-width-style" >{gk} </span>
    },
    {
        title: "Played",
        dataIndex: 'played',
        key: 'played',
        sorter: (a, b) => tableSort(a, b, "played"),
        render(played, record) {
            return {
                props: {
                    style: { background: "rgb(248, 225, 209)" }
                },
                children: <div>{played}</div>
            };
        }
    },
    {
        title: "Bench",
        dataIndex: 'bench',
        key: 'bench',
        sorter: (a, b) => tableSort(a, b, "bench"),
        render(bench, record) {
            return {
                props: {
                    style: { background: "rgb(248, 225, 209)" }
                },
                children: <div>{bench}</div>
            };
        }
    },
    {
        title: "No Play",
        dataIndex: 'noPlay',
        key: 'noPlay',
        sorter: (a, b) => tableSort(a, b, "noPlay"),
        render(noPlay, record) {
            return {
                props: {
                    style: { background: "rgb(248, 225, 209)" }
                },
                children: <div>{noPlay}</div>
            };
        }
    },
];

const columns_2 = [
    {
        title: 'Team',
        dataIndex: 'teamName',
        key: 'teamName',
        sorter: (a, b) => tableSort(a, b, "teamName"),
    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => tableSort(a, b, "firstName"),
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => tableSort(a, b, "lastName"),

    },
    {
        title: 'GS',
        dataIndex: 'gs',
        key: 'gs',
        sorter: (a, b) => tableSort(a, b, "gs"),
        render: (gs, records) =>
            <span nowrap className="column-width-style" >{gs} </span>
    },
    {
        title: 'GA',
        dataIndex: 'ga',
        key: 'ga',
        sorter: (a, b) => tableSort(a, b, "ga"),
        render: (ga, records) =>
            <span nowrap className="column-width-style" >{ga} </span>
    },
    {
        title: 'WA',
        dataIndex: 'wa',
        key: 'wa',
        sorter: (a, b) => tableSort(a, b, "wa"),
        render: (wa, records) =>
            <span nowrap className="column-width-style" >{wa} </span>
    },
    {
        title: 'C',
        dataIndex: 'c',
        key: 'c',
        sorter: (a, b) => tableSort(a, b, "c"),
        render: (c, records) =>
            <span nowrap className="column-width-style" >{c} </span>
    },
    {
        title: 'WD',
        dataIndex: 'wd',
        key: 'wd',
        sorter: (a, b) => tableSort(a, b, "wd"),
        render: (wd, records) =>
            <span nowrap className="column-width-style" >{wd} </span>
    },
    {
        title: 'GD',
        dataIndex: 'gd',
        key: 'gd',
        sorter: (a, b) => tableSort(a, b, "gd"),
        render: (gd, records) =>
            <span nowrap className="column-width-style" >{gd} </span>
    },
    {
        title: 'GK',
        dataIndex: 'gk',
        key: 'gk',
        sorter: (a, b) => tableSort(a, b, "gk"),
        render: (gk, records) =>
            <span nowrap className="column-width-style" >{gk} </span>
    },
    {
        title: "Played",
        dataIndex: 'played',
        key: 'played',
        sorter: (a, b) => tableSort(a, b, "played"),
        render(played, record) {
            return {
                props: {
                    style: { backgroundColor: "rgb(248, 225, 209)" }
                },
                children: <div>{played}</div>
            };
        }
    },
    {
        title: "Bench",
        dataIndex: 'bench',
        key: 'bench',
        sorter: (a, b) => tableSort(a, b, "bench"),
        render(bench, record) {
            return {
                props: {
                    style: { backgroundColor: "rgb(248, 225, 209)", }
                },
                children: <div>{bench}</div>
            };
        }
    },
    {
        title: "No Play",
        dataIndex: 'noPlay',
        key: 'noPlay',
        sorter: (a, b) => tableSort(a, b, "noPlay"),
        render(noPlay, record) {
            return {
                props: {
                    style: { backgroundColor: "rgb(248, 225, 209)" }
                },
                children: <div>{noPlay}</div>
            };
        }
    },
];

class LiveScorePositionTrackReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionId: null,
            searchText: "",
            reporting: 'PERIOD',
            aggregate: 'MATCH'
        }
        _this = this
    }

    componentDidMount() {


        const { id } = JSON.parse(getLiveScoreCompetiton())

        const body =
        {
            "paging": {
                "limit": 10,
                "offset": 0
            }
        }
        this.props.liveScorePositionTrackingAction({ compId: id, aggregate: this.state.aggregate, reporting: this.state.reporting, pagination: body, search: this.state.searchText })

        this.setState({ competitionId: id })
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.positionTrackReport}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="col-sm-8" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                        <div className="row">

                            <div className="col-sm">
                                <div
                                    className="comp-dashboard-botton-view-mobile"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <Button className="primary-add-comp-form" type="primary">

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
        )
    }

    /// Handle Page change
    handlePageChnage(page) {
        let offset = page ? 10 * (page - 1) : 0;
        const body =
        {
            "paging": {
                "limit": 10,
                "offset": offset
            }
        }
        this.props.liveScorePositionTrackingAction({ compId: this.state.competitionId, aggregate: this.state.aggregate, reporting: this.state.reporting, pagination: body, search: this.state.searchText })


    }


    //////// tableView
    tableView = () => {

        const { positionTrackResult, totalCount } = this.props.liveScorePositionTrackState
        let positionTrackData = isArrayNotEmpty(positionTrackResult) ? positionTrackResult : []
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScorePositionTrackState.onLoad}
                        className={"home-dashboard-table"}
                        columns={this.state.aggregate == 'MATCH' ? columns_1 : columns_2}
                        dataSource={positionTrackData}
                        pagination={false}
                        rowKey={(index) => 'positionTrackReport' + index}

                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-5"
                        defaultCurrent={1}
                        total={totalCount}
                        onChange={(page) => this.handlePageChnage(page)}
                    />
                </div>

            </div>
        )
    }

    onChangePeriod(reportId) {
        const body =
        {
            "paging": {
                "limit": 10,
                "offset": 0
            }
        }
        this.props.liveScorePositionTrackingAction({ compId: this.state.competitionId, aggregate: this.state.aggregate, reporting: reportId, pagination: body, search: this.state.searchText })
        this.setState({ reporting: reportId })
    }

    onChangeGame(aggregateId) {

        const body =
        {
            "paging": {
                "limit": 10,
                "offset": 0
            }
        }
        this.props.liveScorePositionTrackingAction({ compId: this.state.competitionId, aggregate: aggregateId, reporting: this.state.reporting, pagination: body, search: this.state.searchText })
        this.setState({ aggregate: aggregateId })


    }

    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value })
        if (e.target.value == null || e.target.value == "") {
            const body =
            {
                "paging": {
                    "limit": 10,
                    "offset": 0
                }
            }
            this.props.liveScorePositionTrackingAction({ compId: this.state.competitionId, aggregate: this.state.aggregate, reporting: this.state.reporting, pagination: body, search: e.target.value })
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            const body =
            {
                "paging": {
                    "limit": 10,
                    "offset": 0
                }
            }
            this.props.liveScorePositionTrackingAction({ compId: this.state.competitionId, aggregate: this.state.aggregate, reporting: this.state.reporting, pagination: body, search: this.state.searchText })
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        if (this.state.searchText == null || this.state.searchText == "") {
        }
        else {
            const body =
            {
                "paging": {
                    "limit": 10,
                    "offset": 0
                }
            }
            this.props.liveScorePositionTrackingAction({ compId: this.state.competitionId, aggregate: this.state.aggregate, reporting: this.state.reporting, pagination: body, search: this.state.searchText })
        }
    }


    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="row">
                    <div className="col-sm"  >
                        <div className="reg-filter-col-cont pb-3"  >
                            <span className='year-select-heading'>{AppConstants.periodFilter}:</span>
                            <Select
                                className="year-select reg-filter-select1 ml-2"
                                style={{ minWidth: 160 }}
                                onChange={(reportId) => this.onChangePeriod(reportId)}
                                value={this.state.reporting}
                            >
                                <Option value={'PERIOD'}>{'Period'}</Option>
                                <Option value={'PERCENT'}>{'%'}</Option>
                                <Option value={'MINUTE'}>{'Minutes'}</Option>

                            </Select>
                        </div>
                    </div>
                    <div className="col-sm" >
                        <div className="reg-filter-col-cont pb-3"  >
                            <span className='year-select-heading'>{AppConstants.byGame}:</span>
                            <Select
                                className="year-select reg-filter-select1 ml-2"
                                style={{ minWidth: 160 }}
                                onChange={(aggregateId) => this.onChangeGame(aggregateId)}
                                value={this.state.aggregate}
                            >
                                <Option value={'MATCH'}>{'By Game'}</Option>
                                <Option value={'ALL'}>{'All Games'}</Option>

                            </Select>
                        </div>
                    </div>

                    <div className="col-sm" style={{ display: "flex", justifyContent: 'flex-end', alignItems: "center" }} >
                        <div className="comp-product-search-inp-width pb-3" >
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

                </div>
            </div>
        )
    }
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />

                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"24"} />
                <Layout>
                    {this.headerView()}
                    {this.dropdownView()}
                    <Content>
                        {this.tableView()}
                    </Content>
                </Layout>
            </div >
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        liveScorePositionTrackingAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScorePositionTrackState: state.LiveScorePositionTrackState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScorePositionTrackReport));

