import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select } from 'antd';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getliveScoreDivisions } from '../../store/actions/LiveScoreAction/liveScoreActions'
import { liveScoreLaddersListAction } from '../../store/actions/LiveScoreAction/liveScoreLadderAction'
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
            loadding: false
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
                                    <NavLink to="/liveScoreLadderAdjustment">
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.edit}
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
                this.setState({ loadding: false })
            }
        }
    }



    divisionChange = (value) => {

        // let competitionID = getCompetitonId()
        const { id, uniqueKey } = JSON.parse(getLiveScoreCompetiton())
        // this.props.liveScoreLaddersListAction(competitionID, value.division)
        this.props.liveScoreLaddersListAction(id, value.division, uniqueKey)
    }
    ///dropdown view containing dropdown
    dropdownView = () => {
        const { liveScoreLadderState } = this.props;
        console.log(liveScoreLadderState)
        // let grade = liveScoreLadderState.liveScoreLadderDivisionData !== [] ? liveScoreLadderState.liveScoreLadderDivisionData : []
        let grade = isArrayNotEmpty(liveScoreLadderState.liveScoreLadderDivisionData) ? liveScoreLadderState.liveScoreLadderDivisionData : []

        return (
            <div className="comp-player-grades-header-drop-down-view">
                <span className='year-select-heading'>{AppConstants.filterByDivision}:</span>
                {grade.length > 0 && <Select
                    className="year-select"
                    onChange={(division) => this.divisionChange({ division })}
                    defaultValue={grade[0].name}
                >
                    {grade.map((item) => (
                        <Option key={'selectDivision' + item.id} value={item.id}>
                            {item.name}
                        </Option>
                    ))}

                </Select>}
            </div>
        )
    }

    ////////form content view
    contentView = () => {
        const { liveScoreLadderState } = this.props;

        let DATA = liveScoreLadderState.liveScoreLadderListData
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table loading={this.props.liveScoreLadderState.onLoad == true ? true : false} className="home-dashboard-table" columns={columns} dataSource={DATA} pagination={false}
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
    return bindActionCreators({ getliveScoreDivisions, liveScoreLaddersListAction, getLiveScoreDivisionList }, dispatch)

}

function mapStatetoProps(state) {
    return {
        liveScoreLadderState: state.LiveScoreLadderState
    }
}
export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScoreLadderList));
