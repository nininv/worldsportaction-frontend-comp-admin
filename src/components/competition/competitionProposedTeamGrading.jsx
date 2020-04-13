import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Button, Table, Select, Tag, Input, message, Tooltip } from 'antd';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import CommentModal from "../../customComponents/commentModal";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from 'react-router-dom';
import history from "../../util/history";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getYearAndCompetitionOwnAction, clearYearCompetitionAction } from "../../store/actions/appAction";
import { getDivisionsListAction, clearReducerDataAction } from "../../store/actions/registrationAction/registration";
import {
    getCompOwnProposedTeamGradingAction,
    onchangeCompOwnFinalTeamGradingData,
    saveOwnFinalTeamGradingDataAction,
    clearTeamGradingReducerDataAction,
    getCompFinalGradesListAction,
    teamGradingCommentAction,
    changeHistoryHover
} from "../../store/actions/competitionModuleAction/competitionTeamGradingAction";
import { gradesReferenceListAction } from "../../store/actions/commonAction/commonAction";
import {
    setOwnCompetitionYear,
    getOwnCompetitionYear,
    setOwn_competition,
    getOwn_competition
} from "../../util/sessionStorage"
import ValidationConstants from "../../themes/validationConstant";
import { Record } from "immutable";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
let this_obj = null;

/////for displying  grade name on the basis of graderefid
function gradeName(proposedGradeRefId) {
    let gradeName = proposedGradeRefId
    let GradeReferenceData = this_obj.props.ownTeamGradingState.getFinalGradesListData
    let gradeNameIndex = GradeReferenceData.findIndex(x => x.gradeRefId == proposedGradeRefId)
    if (gradeNameIndex >= 0 && GradeReferenceData.length > 0) {
        gradeName = GradeReferenceData.length > 0 && GradeReferenceData[gradeNameIndex].Grade
    }
    return gradeName == 0 ? "" : gradeName;
}

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [
    {
        title: 'Team',
        dataIndex: 'sortOrder',
        key: 'sortOrder',
        sorter: (a, b) => tableSort(a, b, "sortOrder"),
        render: (sortOrder, record, index) => (
            record.isDirectRegistration == 0 ? (
                <span >{sortOrder}</span>
            ) : (
                    <Input className="input-inside-team-grades-table" style={{ width: '50px' }}
                        onChange={e => this_obj.props.onchangeCompOwnFinalTeamGradingData(e.target.value, index, "sortOrder")}
                        placeholder={"Team"}
                        value={sortOrder}
                    />
                )
        )

    },
    {
        title: 'Team Name',
        dataIndex: 'teamName',
        key: 'teamName',
        sorter: (a, b) => tableSort(a, b, "teamName"),
        render: (teamName, record, index) => (
            record.isDirectRegistration == 0 ? (
                <span >{teamName}</span>
            ) : (
                    <Input className="input-inside-team-grades-table" style={{ width: '230px' }}
                        onChange={e => this_obj.props.onchangeCompOwnFinalTeamGradingData(e.target.value, index, "teamName")}
                        placeholder={"Team Name"}
                        value={teamName}
                    />
                )
        )
    },
    {
        title: 'History',
        dataIndex: 'playerHistory',
        key: 'playerHistory',
        render: (playerHistory, record, key) => (
            <span>
                {playerHistory.map((item, index) => (
                    // item.teamText ?
                    <Tooltip
                        className="comp-player-table-tag2"
                        style={{ height: "100%" }}
                        onMouseEnter={() => this_obj.changeHover(item, key, index, true)}
                        onMouseLeave={() => this_obj.changeHover(item, key, index, false)}
                        visible={item.hoverVisible}

                        title={item.playerName}>
                        <NavLink to={{ pathname: `/userPersonal`, state: { userId: item.userId } }}
                        >
                            <Tag className="comp-player-table-tag" style={{ cursor: "pointer" }} key={item.historyTeamId}
                            >
                                {item.teamText}
                            </Tag>
                        </NavLink>
                    </Tooltip>
                    // </a>
                    // : null
                ))}
            </span>
        ),
        sorter: (a, b) => tableSort(a, b, "playerHistory")
    },
    {
        title: 'Proposed Grade',
        dataIndex: 'proposedGradeRefId',
        key: 'proposedGradeRefId',
        render: (proposedGradeRefId, record) => (
            record.isDirectRegistration == 0 ?
                <span >{gradeName(proposedGradeRefId)}</span> : ""
        ),
        sorter: (a, b) => tableSort(a, b, "proposedGradeRefId")

    },

    {
        title: 'Final Grade',
        dataIndex: 'finalGradeId',
        key: 'finalGradeId',
        render: (finalGradeId, record, index) =>
            <Select className="select-inside-team-grades-table"
                value={finalGradeId}
                onChange={(finalGradeId) => this_obj.props.onchangeCompOwnFinalTeamGradingData(finalGradeId, index, "finalGradeId")}
            >
                {this_obj.props.ownTeamGradingState.compFinalTeamGradingFinalGradesData.map((item) => {
                    return <Option key={"finalGradeId" + item.gradeRefId} value={item.gradeRefId}>
                        {item.name}
                    </Option>
                })}
            </Select>,
        sorter: (a, b) => tableSort(a, b, "finalGradeId")
    },
    {
        title: 'Comments',
        dataIndex: 'comments',
        key: 'comments',
        width: 110,
        render: (comments, record) =>
            <div style={{ display: "flex", justifyContent: "center", cursor: "pointer" }} onClick={() => this_obj.onClickComment(record)}>
                <img src={comments !== null && comments.length > 0 ? AppImages.commentFilled : AppImages.commentEmpty} alt="" height="25" width="25" />
            </div>,
    },

];



class CompetitionProposedTeamGrading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
            divisionId: null,
            gradeRefId: null,
            firstTimeCompId: null,
            saveLoad: false,
            visible: false,
            comment: null,
            teamId: null,
            tooltipVisibleDraft: false
        }
        this_obj = this
        this.props.clearTeamGradingReducerDataAction("finalTeamGrading")
        this.props.clearYearCompetitionAction()
    }


    onClickComment(record) {
        this.setState({ visible: true, comment: record.comments, teamId: record.teamId })
    }

    changeHover(record, index, historyIndex, key) {
        this.props.changeHistoryHover(record, index, historyIndex, key)

    }

    handleOk = e => {
        this.props.teamGradingCommentAction(this.state.yearRefId, this.state.firstTimeCompId, this.state.divisionId, this.state.gradeRefId, this.state.teamId, this.state.comment)
        this.setState({
            visible: false,
            comment: "",
            teamId: null,

        });
    };
    // model cancel for dissapear a model
    handleCancel = e => {
        this.setState({
            visible: false,
            comment: "",
            teamId: null,
        });
    };

    componentDidMount() {
        let divisionId = this.props.location.state ? this.props.location.state.id : null;
        let gradeRefId = this.props.location.state ? this.props.location.state.gradeRefId : null;
        this.setState({ divisionId: divisionId, gradeRefId: gradeRefId })
        // this.props.gradesReferenceListAction()
        let yearId = getOwnCompetitionYear()
        let storedCompetitionId = getOwn_competition()
        let propsData = this.props.appState.own_YearArr.length > 0 ? this.props.appState.own_YearArr : undefined
        let compData = this.props.appState.own_CompetitionArr.length > 0 ? this.props.appState.own_CompetitionArr : undefined
        if (storedCompetitionId && yearId && propsData && compData) {
            this.setState({
                yearRefId: JSON.parse(yearId),
                firstTimeCompId: storedCompetitionId,
                getDataLoading: true
            })
            this.props.getDivisionsListAction(yearId, storedCompetitionId)
            // this.props.getCompetitionWithTimeSlots(yearId, storedCompetitionId, 1, 6)
        }
        else {
            if (yearId) {
                this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
                this.setState({
                    yearRefId: JSON.parse(yearId)
                })
            }
            else {
                this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, null, 'own_competition')
                setOwnCompetitionYear(1)
            }
        }
    }

    componentDidUpdate(nextProps) {
        let competitionList = this.props.appState.own_CompetitionArr
        let allDivisionsData = this.props.registrationState.allDivisionsData
        let finalGradesListData = this.props.ownTeamGradingState.getFinalGradesListData
        if (nextProps.appState !== this.props.appState) {
            if (nextProps.appState.own_CompetitionArr !== competitionList) {
                if (competitionList.length > 0) {
                    let competitionId = competitionList[0].competitionId
                    // let competitionId = this.state.firstTimeCompId !== null ? this.state.firstTimeCompId : competitionList[0].competitionId
                    setOwn_competition(competitionId)
                    this.props.getDivisionsListAction(this.state.yearRefId, competitionId)
                    this.setState({ firstTimeCompId: competitionId })
                }
            }
        }
        if (nextProps.registrationState.allDivisionsData !== allDivisionsData) {
            if (allDivisionsData.length > 0) {
                let divisionId = this.state.divisionId == null ? allDivisionsData[0].competitionMembershipProductDivisionId : this.state.divisionId
                this.props.getCompFinalGradesListAction(this.state.yearRefId, this.state.firstTimeCompId, divisionId)
                // this.props.getCompOwnProposedTeamGradingAction(this.state.yearRefId, this.state.firstTimeCompId, divisionId, gradeRefId)
                this.setState({ divisionId })
            }
        }

        if (nextProps.ownTeamGradingState.getFinalGradesListData !== finalGradesListData) {
            if (finalGradesListData.length > 0) {
                let gradeRefId = this.state.gradeRefId == null ? finalGradesListData[0].gradeRefId : this.state.gradeRefId
                this.props.getCompOwnProposedTeamGradingAction(this.state.yearRefId, this.state.firstTimeCompId, this.state.divisionId, gradeRefId)
                this.setState({ gradeRefId })
            }
        }

        if (this.props.ownTeamGradingState.onLoad === false && this.state.saveLoad === true) {
            this.setState({ saveLoad: false })
            history.push('/competitionPartTeamGradeCalculate');
        }
    }



    ////save the final team grading data
    submitApiCall = () => {
        let finalTeamGradingData = this.props.ownTeamGradingState.getCompOwnProposedTeamGradingData
        let finalGrades = this.props.ownTeamGradingState.compFinalTeamGradingFinalGradesData;
        let isError = false;

        finalTeamGradingData.map((item) => {
            if (item.finalGradeId == 0 || item.finalGradeId == null || item.finalGradeId == "" ||
                item.finalGradeId == undefined) {
                isError = true
            }
        })

        if (!isError) {
            finalTeamGradingData.map((item) => {
                let obj = finalGrades.find(x => x.gradeRefId == item.finalGradeId);
                item['finalGradeRefId'] = obj.id
                item["gradeRefId"] = obj.gradeRefId
                delete item['finalGradeId']
                return item
            })
            let payload = {
                "yearRefId": this.state.yearRefId,
                "competitionUniqueKey": this.state.firstTimeCompId,
                "divisionId": this.state.divisionId,
                "gradeRefId": this.state.gradeRefId,
                "teams": finalTeamGradingData
            }
            this.props.saveOwnFinalTeamGradingDataAction(payload)
            this.setState({ saveLoad: true })
        }
        else {
            message.error(ValidationConstants.finalGrading[0]);
        }

    }

    cancelCall = () => {
        history.push('/competitionPartTeamGradeCalculate');
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add"> {AppConstants.finalTeamGrading}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div >
        )
    }

    /////year change onchange
    onYearChange = (yearId) => {
        setOwnCompetitionYear(yearId)
        setOwn_competition(undefined)
        this.props.clearTeamGradingReducerDataAction("finalTeamGrading")
        this.props.clearReducerDataAction("allDivisionsData")
        this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
        this.setState({ firstTimeCompId: null, yearRefId: yearId, divisionId: null, gradeRefId: null })

    }

    // on Competition change
    onCompetitionChange = (competitionId) => {
        setOwn_competition(competitionId)
        this.props.clearTeamGradingReducerDataAction("finalTeamGrading")
        this.props.clearReducerDataAction("allDivisionsData")
        this.setState({ firstTimeCompId: competitionId, divisionId: null, gradeRefId: null })
        this.props.getDivisionsListAction(this.state.yearRefId, competitionId)
    }

    /////on division change
    onDivisionChange = (divisionId) => {
        this.props.clearTeamGradingReducerDataAction("finalTeamGrading")
        this.props.getCompFinalGradesListAction(this.state.yearRefId, this.state.firstTimeCompId, divisionId)
        this.setState({ divisionId, gradeRefId: null })
    }


    ////on grade change
    onGradeChange = (gradeRefId) => {
        this.props.clearTeamGradingReducerDataAction("finalTeamGrading")
        this.props.getCompOwnProposedTeamGradingAction(this.state.yearRefId, this.state.firstTimeCompId, this.state.divisionId, gradeRefId)
        this.setState({ gradeRefId })
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm-2" >
                            <div className="com-year-select-heading-view" >
                                <span className='year-select-heading'>{AppConstants.year}:</span>
                                <Select
                                    name={"yearRefId"}
                                    className="year-select"
                                    onChange={yearRefId => this.onYearChange(yearRefId)}
                                    value={this.state.yearRefId}
                                >
                                    {this.props.appState.own_YearArr.map(item => {
                                        return (
                                            <Option key={"yearRefId" + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm-4" >
                            <div style={{
                                width: "100%", display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }} >
                                <span className='year-select-heading'>{AppConstants.competition}:</span>
                                <Select
                                    style={{ minWidth: 160 }}
                                    className="year-select"

                                    onChange={competitionId => this.onCompetitionChange(competitionId)}
                                    value={this.state.firstTimeCompId}
                                >
                                    {this.props.appState.own_CompetitionArr.map(item => {
                                        return (
                                            <Option key={"competition" + item.competitionId} value={item.competitionId}>
                                                {item.competitionName}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm" >
                            <div style={{
                                width: "100%", display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }} >
                                <span className='year-select-heading'>{AppConstants.division}:</span>
                                <Select
                                    style={{ minWidth: 120 }}
                                    className="year-select"
                                    onChange={(divisionId) => this.onDivisionChange(divisionId)}
                                    value={JSON.parse(JSON.stringify(this.state.divisionId))}
                                >
                                    {this.props.registrationState.allDivisionsData.map(item => {
                                        return (
                                            <Option key={"division" + item.competitionMembershipProductDivisionId}
                                                value={item.competitionMembershipProductDivisionId}>
                                                {item.divisionName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm-2" >
                            <div style={{
                                width: "100%", display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }} >
                                <span className='year-select-heading'>{AppConstants.grade}:</span>
                                <Select
                                    className="year-select"
                                    onChange={(gradeRefId) => this.onGradeChange(gradeRefId)}
                                    value={JSON.parse(JSON.stringify(this.state.gradeRefId))}
                                >
                                    {this.props.ownTeamGradingState.getFinalGradesListData.map((item) =>
                                        <Option key={"gradeRefId" + item.gradeRefId} value={item.gradeRefId}>{item.Grade}</Option>
                                    )}

                                </Select>
                            </div>
                        </div>
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }} >
                            <span className='comp-grading-final-text ml-1' >{AppConstants.final}</span>
                        </div>
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }} >
                            <Button className="primary-add-comp-form" type="primary"
                            // onClick={this.addNewGrade}
                            >
                                + {AppConstants.addgrade}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    ////////form content view
    contentView = () => {
        let proposedTeamGradingData = this.props.ownTeamGradingState.getCompOwnProposedTeamGradingData
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={proposedTeamGradingData}
                        pagination={false}
                        loading={this.props.ownTeamGradingState.onLoad == true && true}
                    />
                </div>
                <CommentModal
                    visible={this.state.visible}
                    modalTitle={AppConstants.add_edit_comment}
                    onOK={this.handleOk}
                    onCancel={this.handleCancel}
                    placeholder={AppConstants.addYourComment}
                    onChange={(e) => this.setState({ comment: e.target.value })}
                    value={this.state.comment}
                />
            </div>
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width" >
                <div className="comp-player-grades-footer-view">
                    <div className="row" >
                        <div className="col-sm" >
                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                                {/* <Button className="save-draft-text" type="save-draft-text">{AppConstants.saveDraft}</Button> */}
                                {/* <NavLink to="/competitionPartTeamGradeCalculate" > */}
                                <Button className="open-reg-button" style={{ marginRight: '20px' }}
                                    onClick={() => this.cancelCall()}
                                    type="primary">{AppConstants.cancel}
                                </Button>
                                <Button className="open-reg-button"
                                    onClick={() => this.submitApiCall()}
                                    type="primary">{AppConstants.submit}
                                </Button>

                                {/* </NavLink> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"5"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                    <Footer>
                        {this.footerView()}
                    </Footer>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getYearAndCompetitionOwnAction,
        getCompOwnProposedTeamGradingAction,
        getDivisionsListAction,
        gradesReferenceListAction,
        onchangeCompOwnFinalTeamGradingData,
        saveOwnFinalTeamGradingDataAction,
        clearTeamGradingReducerDataAction,
        clearReducerDataAction,
        clearYearCompetitionAction,
        getCompFinalGradesListAction,
        teamGradingCommentAction,
        changeHistoryHover
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        appState: state.AppState,
        ownTeamGradingState: state.CompetitionOwnTeamGradingState,
        registrationState: state.RegistrationState,
        commonReducerState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(CompetitionProposedTeamGrading));
