import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select } from 'antd';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getliveScoreDivisions } from '../../store/actions/LiveScoreAction/liveScoreActions'
import { liveScoreLaddersListAction, updateLadderSetting } from '../../store/actions/LiveScoreAction/liveScoreLadderAction'
import history from "../../util/history";
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage'
import { isArrayNotEmpty } from '../../util/helpers'
import { getLiveScoreDivisionList, liveScoreDeleteDivision } from '../../store/actions/LiveScoreAction/liveScoreDivisionAction'
import { NavLink } from 'react-router-dom';

const { Content } = Layout;
const { Option } = Select;

/////function to sort table column
function tableSort(a, b, key) {
    //if (a[key] && b[key]) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
    //}

}


////Table columns
const columns = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
        sorter: (a, b) => tableSort(a, b, "rank"),
    },
    {
        title: 'Team',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => tableSort(a, b, "name"),
        render: (data, record) => (
            record.hasAdjustments ? 
            <span className="required-field">{data}</span>
            :  <span>{data}</span>
        )
    },

    {
        title: 'P',
        dataIndex: 'P',
        key: 'P',
        sorter: (a, b) => tableSort(a, b, "P"),

    },
    {
        title: 'W',
        dataIndex: 'W',
        key: 'W',
        sorter: (a, b) => tableSort(a, b, "W"),


    },
    {
        title: 'L',
        dataIndex: 'L',
        key: 'L',
        sorter: (a, b) => tableSort(a, b, "L"),
    },
    {
        title: 'D',
        dataIndex: 'D',
        key: 'D',
        sorter: (a, b) => tableSort(a, b, "D"),


    },
    {
        title: 'FW',
        dataIndex: 'FW',
        key: 'FW',
        sorter: (a, b) => tableSort(a, b, "FW"),

    },
    {
        title: 'FL',
        dataIndex: 'FL',
        key: 'FL',
        sorter: (a, b) => tableSort(a, b, "FL"),

    },
    {
        title: 'F',
        dataIndex: 'F',
        key: 'F',
        sorter: (a, b) => tableSort(a, b, "F"),
    },
    {
        title: 'A',
        dataIndex: 'A',
        key: 'A',
        sorter: (a, b) => tableSort(a, b, "A"),


    },
    {
        title: 'PTS',
        dataIndex: 'PTS',
        key: 'PTS',
        sorter: (a, b) => tableSort(a, b, "PTS"),
    },
    {
        title: '%',
        dataIndex: 'SMR',
        key: 'SMR',
        sorter: (a, b) => tableSort(a, b, "SMR"),
        render: (SMR) => <span>{(JSON.parse(SMR) * 100).toFixed(2) + "%"}</span>
    },
];


class LiveScoreLadderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            division: "11A",
            loadding: false,
            divisionId: null
        }
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                < div className="row" >
                    <div className="col-sm" >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.competitionladders}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="col-sm" style={{

                        display: "flex",
                        flexDirection: 'row',
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}>
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
                                    }}>
                                    <NavLink to={{
                                        pathname: '/liveScoreLadderAdjustment',
                                        state: { divisionId: this.state.divisionId }
                                    }}>
                                        <Button className="primary-add-comp-form" type="primary">
                                            {AppConstants.edit}
                                        </Button>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>

                </div >
            </div >
        )
    }

    componentDidMount() {
        // let competitionID = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())

        if (id !== null) {
            // this.props.getliveScoreDivisions(competitionID);
            // this.props.getliveScoreDivisions(id);
            this.setState({ loadding: true })
            this.props.getLiveScoreDivisionList(id)

        } else {
            history.push('/')
        }
    }

    componentDidUpdate(nextProps) {
        if (nextProps.liveScoreLadderState.liveScoreLadderDivisionData !== this.props.liveScoreLadderState.liveScoreLadderDivisionData) {
            if (this.state.loadding == true && this.props.liveScoreLadderState.onLoad == false) {
                const { id, uniqueKey } = JSON.parse(getLiveScoreCompetiton())
                let divisionArray = this.props.liveScoreLadderState.liveScoreLadderDivisionData
                let divisionId = isArrayNotEmpty(divisionArray) ? divisionArray[0].id : null
                this.props.liveScoreLaddersListAction(id, divisionId, uniqueKey)
                this.props.updateLadderSetting({ data: divisionId, key: 'divisionId' })
                this.setState({ loadding: false, divisionId })
            }
        }
    }



    divisionChange = (value) => {

        // let competitionID = getCompetitonId()
        const { id, uniqueKey } = JSON.parse(getLiveScoreCompetiton())
        this.props.updateLadderSetting({ data: value.division, key: 'divisionId' })
        this.props.liveScoreLaddersListAction(id, value.division, uniqueKey)
        this.setState({ divisionId: value.division })
    }
    ///dropdown view containing dropdown
    dropdownView = () => {
        const { liveScoreLadderState } = this.props;
        // let grade = liveScoreLadderState.liveScoreLadderDivisionData !== [] ? liveScoreLadderState.liveScoreLadderDivisionData : []
        let grade = isArrayNotEmpty(liveScoreLadderState.liveScoreLadderDivisionData) ? liveScoreLadderState.liveScoreLadderDivisionData : []

        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="reg-filter-col-cont"  >
                    {/* <span className='year-select-heading'>{AppConstants.filterByDivision}:</span> */}
                    {/* {grade.length > 0 && <Select
                        className="year-select reg-filter-select1 ml-2"
                        style={{ minWidth: 200 }}
                        onChange={(division) => this.divisionChange({ division })}
                        nowrap
                        defaultValue={grade[0].name}
                    >
                        {grade.map((item) => (
                            <Option key={'selectDivision' + item.id} value={item.id}>
                                {item.name}
                            </Option>
                        ))}

                    </Select>} */}

                    <div
                        style={{
                            width: "fit-content",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <span className="year-select-heading">
                            {AppConstants.filterByDivision}:
                </span>
                        {grade.length > 0 && <Select
                            className="year-select reg-filter-select1 ml-2"
                            style={{ minWidth: 140 }}
                            onChange={(division) => this.divisionChange({ division })}
                            nowrap
                            defaultValue={grade[0].name}
                        >
                            {grade.map((item) => (
                                <Option key={'selectDivision' + item.id} value={item.id}>
                                    {item.name}
                                </Option>
                            ))}

                        </Select>}
                    </div>

                </div>
            </div>
        )
    }

    ////////form content view
    contentView = () => {
        const { liveScoreLadderState } = this.props;

        let DATA = liveScoreLadderState.liveScoreLadderListData;
        let adjData = liveScoreLadderState.liveScoreLadderAdjData;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreLadderState.onLoad == true ? true : false}
                        className="home-dashboard-table"
                        columns={columns} dataSource={DATA}
                        pagination={false}
                    // rowKey={(record, index) => record.id + index}
                    />
                </div>
                {/* <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        defaultCurrent={1}
                        total={8}
                    // onChange={this.handleTableChange}
                    />
                </div> */}
                <div  className="comp-dash-table-view mt-4 ml-1">
                    <div className="ladder-list-adjustment">
                        {
                            (adjData || []).map((x,index) =>(
                                <div key ={index} style={{marginBottom: '10px'}}>
                                    <li className="required-field">{x.teamName + ' deducted ' + x.points + ' points for ' + x.adjustmentReason   }</li>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"11"} />
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
function mapDispatchtoprops(dispatch) {
    return bindActionCreators({
        getliveScoreDivisions,
        liveScoreLaddersListAction,
        getLiveScoreDivisionList,
        updateLadderSetting
    }, dispatch)

}

function mapStatetoProps(state) {
    return {
        liveScoreLadderState: state.LiveScoreLadderState
    }
}
export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScoreLadderList));
