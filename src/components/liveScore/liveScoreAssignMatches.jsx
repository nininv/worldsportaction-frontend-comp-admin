import React, { Component } from "react";
import { Layout, Button, Table, Breadcrumb, Pagination, Select } from "antd";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from "react-router-dom";
import { liveScore_MatchFormate } from '../../themes/dateformate'
import { assignMatchesAction, changeAssignStatus } from '../../store/actions/LiveScoreAction/liveScoreScorerAction'
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import AppImages from "../../themes/appImages";
import history from "../../util/history";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isArrayNotEmpty } from '../../util/helpers';
import { parseTwoDigitYear } from "moment";

const { Content } = Layout;
const { Option } = Select;

var this_obj = null

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

///columens data
const columns1 = [

    {
        title: 'Match Id',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => tableSort(a, b, "id"),
        render: (id) => <NavLink to={{
            pathname: '/liveScoreMatchDetails',
            state: { matchId: id }
        }} >
            <span class="input-heading-add-another pt-0" >{id}</span>
        </NavLink>
    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => tableSort(a, b, "startTime"),
        render: (startTime) =>
            <span>{startTime ? liveScore_MatchFormate(startTime) : ""}</span>
    },
    {
        title: 'Team 1',
        dataIndex: 'team1',
        key: 'team1',
        sorter: (a, b) => tableSort(a, b, "team1"),
        render: (team1, records, index) => {
            return (
                <div className="row" style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
                    <div className="col-sm-1">
                        <img className="dot-image"
                            src={records.scorer1 ? records.scorer1.rosterStatus? records.scorer1.rosterStatus = "YES" ? AppImages.greenDot : AppImages.redDot :AppImages.yellowDot : AppImages.greyDot}
                            alt="" width="12" height="12" />
                    </div>
                    <div className="col-sm" style={{ display: 'flex', justifyContent: 'flex-start', }}>
                        <span style={{ overflowX: "auto", whiteSpace: "nowrap" }} class="input-heading-add-another pt-0 " >{records.team1.name} ({records.scorer1? records.scorer1.firstName +" "+records.scorer1.lastName  : "Unassign"} )}</span>
                    </div>
                    <div className="col-sm" >
                        <span style={{ textDecoration: "underline" }} onClick={() => this_obj.onChangeStatus(index, records, "scorer1", "team1")} class="input-heading-add-another pt-0" >{records.scorer1 ? "Unassign" : "Assign"}</span>
                    </div>
                </div>
            )
        }
    }
]


const columns2 = [

    {
        title: 'Match Id',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => tableSort(a, b, "id"),
        render: (id) => <NavLink to={{
            pathname: '/liveScoreMatchDetails',
            state: { matchId: id }
        }} >
            <span class="input-heading-add-another pt-0" >{id}</span>
        </NavLink>
    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => tableSort(a, b, "startTime"),
        render: (startTime) =>
            <span>{startTime ? liveScore_MatchFormate(startTime) : ""}</span>
    },
    {
        title: 'Team 1',
        dataIndex: 'team1',
        key: 'team1',
        width:"40%",
        sorter: (a, b) => tableSort(a, b, "team1"),
        render: (team1, records, index) => {
            return (
                <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="col-sm-1">
                        <img className="dot-image"
                            src={records.scorer1 ? records.scorer1.rosterStatus? records.scorer1.rosterStatus = "YES" ? AppImages.greenDot : AppImages.redDot :AppImages.yellowDot : AppImages.greyDot}
                            alt="" width="12" height="12" />
                    </div>
                    <div className="col-sm" style={{ display: 'flex', justifyContent: 'flex-start', }}>
                        <span  class="input-heading-add-another pt-0 " >{records.team1.name} ( {records.scorer1?  records.scorer1.firstName +" "+records.scorer1.lastName  : "Unassign"} )</span>
                    </div>
                    <div className="col-sm" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span style={{ textDecoration: "underline" }} onClick={() => this_obj.onChangeStatus(index, records, "scorer1", "team1")} class="input-heading-add-another pt-0" >{records.scorer1 ? "Unassign" : "Assign"}</span>
                    </div>
                </div>
            )
        }
    },

    {
        title: 'Team 2',
        dataIndex: 'team2',
        key: 'team2',
        width:"40%",
        sorter: (a, b) => tableSort(a, b, "team2"),
        render: (team2, records, index) => {
            return (
                <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="col-sm-1">
                        <img className="dot-image"
                           src={records.scorer2 ? records.scorer2.rosterStatus? records.scorer2.rosterStatus = "YES" ? AppImages.greenDot : AppImages.redDot :AppImages.yellowDot : AppImages.greyDot}
                            alt="" width="12" height="12" />
                    </div>
                    <div className="col-sm" style={{ display: 'flex', justifyContent: 'flex-start', }}>
                        <span  class="input-heading-add-another pt-0" >{records.team2.name} ({records.scorer2?  records.scorer2.firstName +" "+ records.scorer2.lastName  : "Unassign"} )</span>
                    </div>
                    <div className="col-sm"style={{ display: 'flex', justifyContent: 'flex-end' }} >
                        <span style={{ textDecoration: "underline" }} onClick={() => this_obj.onChangeStatus(index, records, "scorer2", "team2")} class="input-heading-add-another pt-0" >{records.scorer2 ? "Unassign" : "Assign"}</span>
                    </div>
                </div>
            )
        }
    },
    // {
    //     title: '',
    //     dataIndex: 'scorer',
    //     key: 'scorer',
    //     render: (team1, records, index) => {
    //         return <span onClick={() => this.onChangeStatus(index, records)} class="input-heading-add-another pt-0" >{records.scorer2 ? "Assign" : "Unassign"}</span>
    //     }
    // }
]



class LiveScoreAssignMatch extends Component {
    constructor(props) {
        super(props);
        const { scoringType } = JSON.parse(getLiveScoreCompetiton())
        this.state = {
            filter: '',
            competitionId: 0,
            teamID: null,
            columns:scoringType == "SINGLE"?columns1:columns2,
            lodding: false

        };
        this_obj = this
    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ lodding: true })
       
        if (id !== null) {
            this.props.getliveScoreTeams(id)
          
        } else {
            history.push('/')
        }
      
    }

    componentDidUpdate(nextProps) {
      if(nextProps.liveScoreScorerState.teamResult !== this.props.liveScoreScorerState.teamResult ){
        if(this.state.lodding == true && this.props.liveScoreScorerState.onLoad == false){
            const { id } = JSON.parse(getLiveScoreCompetiton())
            const body = {
                "paging": {
                    "limit": 10,
                    "offset": 0
                }
                
            }
            let teamId = this.props.liveScoreScorerState.teamResult[0].id
            this.props.assignMatchesAction(id, teamId, body)
            this.setState({loading:false,teamID:teamId })
        }
      }
    }

    /// on status change 
    onChangeStatus(index, data, scorerKey, teamKey) {
        this.props.changeAssignStatus(index, data, 4, this.state.teamID, scorerKey, teamKey)
    }

    /// On change values  
    handlePaggination = (page) => {
        let offset = page ? 10 * (page - 1) : 0;
        this.setState({ lodding: true })
        const body = {
            "paging": {
                "limit": 10,
                "offset": offset
            },
            "searchText": ""
        }
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.props.assignMatchesAction(id, this.state.teamID, body)
    }


    onChangeTeam(filter){
       
        this.setState({teamID :filter.filter})
        const body = {
            "paging": {
                "limit": 10,
                "offset": 0
            },
            "searchText": ""
        }
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.props.assignMatchesAction(id, filter.filter, body)
    }

    ///////view for breadcrumb
    headerView = () => {
        
        let teamData = isArrayNotEmpty(this.props.liveScoreScorerState.teamResult) ? this.props.liveScoreScorerState.teamResult :[]
        console.log(teamData)
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                < div className="row" >
                    <div className="col-sm" style={{ alignSelf: 'center' }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.assignMatches}</Breadcrumb.Item>
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
                                // onChange={(selectStatus) => this.setState({ selectStatus })}
                                    onChange={(filter) => this.onChangeTeam({ filter })}
                                    value={this.state.teamID} >
                                    {
                                        teamData.map((item, index)=>{
                                            return (
                                                <Option key={"teamname" + item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                            )
                                        })
                                    }
                               
                            
                            </Select>


                        </div>
                    </div>
                </div >
            </div >
        )
    }

    ////////tableView view for Game Time list
    tableView = () => {
        let matcheList = this.props.liveScoreScorerState
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={matcheList.onLoad == true && true}
                        className="home-dashboard-table"
                        columns={this.state.columns}
                        dataSource={matcheList.assignMatches}
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
                            current={1}
                            total={matcheList.assignMatchTotalCount}
                            onChange={(page) => this.handlePaggination(page)}
                        // defaultPageSize={10}

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
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"5"} />
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
    return bindActionCreators({ assignMatchesAction, changeAssignStatus, getliveScoreTeams }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreScorerState: state.LiveScoreScorerState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreAssignMatch));

