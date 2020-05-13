import React, { Component } from "react";
import { Layout, Button, Table, Breadcrumb, Pagination, Input, Icon } from "antd";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from 'react-router-dom';
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { liveScoreIncidentList } from '../../store/actions/LiveScoreAction/liveScoreIncidentAction'
import { liveScore_formateDate } from '../../themes/dateformate'
import history from "../../util/history";
import { getLiveScoreCompetiton } from '../../util/sessionStorage'

function getIncidentPlayer(incidentPlayers) {
    let playerId = incidentPlayers.length > 0 ? incidentPlayers[0].playerId : ""
    return playerId
}

function getFirstName(incidentPlayers) {
    let firstName = incidentPlayers.length > 0 ? incidentPlayers[0].player.firstName : ""
    return firstName
}

function getLastName(incidentPlayers) {
    let lastName = incidentPlayers.length > 0 ? incidentPlayers[0].player.lastName : ""
    return lastName
}

function checkSorting(a, b, key) {
    if (a[key] && b[key]) {
        return a[key].length - b[key].length
    }
}


const { Content } = Layout;
////columens data
const columns = [

    {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: (a, b) => checkSorting(a, b, 'matchId'),
        render: (date, record) =>
            <NavLink to={{
                pathname: "/liveScoreIncidentView",
                state: { item: record }
            }}>
                <span className="input-heading-add-another pt-0">{liveScore_formateDate(date.startTime)}</span>
            </NavLink>
    },
    {
        title: 'Match ID',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => checkSorting(a, b, 'matchId')
    },
    {
        title: 'Player ID',
        dataIndex: 'incidentPlayers',
        key: 'incidentPlayers',
        //  sorter: (a, b) => sort(a, b, "playerId"),

        render: (incidentPlayers, record) =>
            <NavLink to={{
                pathname: "/liveScoreIncidentView",
                state: { item: record }
            }}>
                <span className="input-heading-add-another pt-0">{getIncidentPlayer(incidentPlayers)}</span>
            </NavLink>
    },
    {
        title: 'First Name',
        dataIndex: 'incidentPlayers',
        key: 'incidentPlayers',
        sorter: (a, b) => a.incidentPlayers.player.firstName.length - b.incidentPlayers.player.firstName.length,
        render: (incidentPlayers, record) =>
            <NavLink to={{
                pathname: "/liveScoreIncidentView",
                state: { item: record }
            }}>
                <span className="input-heading-add-another pt-0">{getFirstName(incidentPlayers)}</span>
            </NavLink>
    },
    {
        title: 'Last Name',
        dataIndex: 'incidentPlayers',
        key: 'incidentPlayers',
        // sorter: (a, b) => a.lastName.length - b.lastName.length,
        render: (incidentPlayers, record) =>
            <NavLink to={{
                pathname: "/liveScoreIncidentView",
                state: { item: record }
            }}>
                <span className="input-heading-add-another pt-0">{getLastName(incidentPlayers)}</span>
            </NavLink>
    },
    {
        title: 'Type',
        dataIndex: 'incidentType',
        key: 'incidentType',
        render: (incidentType, record) =>
            <NavLink to={{
                pathname: "/liveScoreIncidentView",
                state: { item: record }
            }}>
                <span className="input-heading-add-another pt-0">{incidentType.name}</span>
            </NavLink>,
        sorter: (a, b) => checkSorting(a, b, 'incidentType')

    },
];


class LiveScoreIncidentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText:""
        };
    }

    componentDidMount() {

        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            this.props.liveScoreIncidentList(id, this.state.searchText);
        } else {
            history.push('/')
        }
    }

      // on change search text
      onChangeSearchText = (e) => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ searchText: e.target.value })
        if (e.target.value == null || e.target.value == "") {
            this.props.liveScoreIncidentList(id, e.target.value);
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (code === 13) { //13 is the enter keycode
            this.props.liveScoreIncidentList(id, e.target.value);
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (this.state.searchText == null || this.state.searchText == "") {
        }
        else {
            this.props.liveScoreIncidentList(id, this.state.searchText);
        }
    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }}  >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.incidents}</Breadcrumb.Item>
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
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <NavLink to="/liveScoreAddIncident">
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addIncident}
                                        </Button>
                                    </NavLink>
                                </div>
                            </div>
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
                                    <NavLink to="/liveScoreIncidentImport">
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
                            </div>
                        </div>
                    </div>
                </div>
                {/* search box */}
                <div className="col-sm pt-4 ml-3 " style={{ display: "flex", justifyContent: 'flex-end', }} >
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

            </div>
        )
    }

    ////////tableView view for Umpire list
    tableView = () => {
        const { liveScoreIncidentState } = this.props;
        const DATA = liveScoreIncidentState.liveScoreIncidentResult;

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreIncidentState.onLoad == true ? true : false} className="home-dashboard-table"
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={DATA}
                        pagination={false}
                    />
                </div>
                <div className="comp-dashboard-botton-view-mobile">
                    <div
                        className="comp-dashboard-botton-view-mobile"
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end"
                        }} >
                    </div>
                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination"
                            defaultCurrent={1}
                            total={8}
                        // onChange={this.handleTableChange}
                        />
                    </div>
                </div>
            </div>
        );
    };

    ////main render method
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"17"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.tableView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ liveScoreIncidentList }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreIncidentState: state.LiveScoreIncidentState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((LiveScoreIncidentList));
