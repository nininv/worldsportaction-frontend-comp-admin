import React, { Component } from "react"
import { Layout, Button, Select, Breadcrumb, Form } from 'antd';
import './liveScore.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateLadderSetting, ladderAdjustmentPostData, ladderAdjustmentGetData } from '../../store/actions/LiveScoreAction/liveScoreLadderAction'
import { isArrayNotEmpty } from "../../util/helpers";
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import { getLiveScoreDivisionList } from '../../store/actions/LiveScoreAction/liveScoreDivisionAction'
import Loader from '../../customComponents/loader'
import ValidationConstants from "../../themes/validationConstant";

const { Header, Footer } = Layout
const { Option } = Select;

class LiveScoreLadderAdjustment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            competitionId: null,
            loadding: true,
            divisionId: props.location ? props.location.state ? props.location.state.divisionId ? props.location.state.divisionId : null : null : null,
            compUniqueKey: null,
            getLoad: false
        }
    }

    componentDidMount() {
        this.props.updateLadderSetting({ key: 'refresh' })

        const { id, uniqueKey } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ competitionId: id, compUniqueKey: uniqueKey })
        if (id !== null) {
            this.props.getLiveScoreDivisionList(id)
            this.setState({ loadding: true, })
        }
    }

    componentDidUpdate(nextProps) {
        if (nextProps.liveScoreLadderState.liveScoreLadderDivisionData !== this.props.liveScoreLadderState.liveScoreLadderDivisionData) {
            if (this.state.loadding === true && this.props.liveScoreLadderState.onLoad === false) {
                const { id, uniqueKey } = JSON.parse(getLiveScoreCompetiton())
                this.props.getliveScoreTeams(id, this.state.divisionId)

                if (this.props.location.state.divisionId) {
                    this.props.ladderAdjustmentGetData({ uniqueKey: uniqueKey, divisionId: this.props.location.state.divisionId })
                }
                // this.setInitalFiledValue()
                this.setState({ loadding: false, getLoad: true })
            }
        }


        if (this.state.getLoad === true && this.props.liveScoreLadderState.onLoading === false) {
            console.log("colled")
            this.setInitalFiledValue()
            this.setState({ getLoad: false })
        }
    }

    setInitalFiledValue() {
        const { ladderData } = this.props.liveScoreLadderState
        let data = isArrayNotEmpty(ladderData) ? ladderData : [];
        data.map((item, index) => {
            let teamId = `teamId${index}`
            let points = `points${index}`
            let adjustmentReason = `adjustmentReason${index}`
            this.props.form.setFieldsValue({
                [teamId]: item.teamId ? item.teamId : undefined,
                [points]: item.points,
                [adjustmentReason]: item.adjustmentReason,
            })
        })
    }

    ///////view for breadcrumb
    headerView = () => {

        return (
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.ladderAdjustment}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    changeDivision(divisionId) {
        this.props.updateLadderSetting({ data: divisionId, key: 'divisionId' })
        this.props.getliveScoreTeams(this.state.competitionId, divisionId)
        this.props.ladderAdjustmentGetData({ uniqueKey: this.state.compUniqueKey, divisionId: divisionId })
        this.setState({ divisionId, getLoad: true })

    }

    dropdownView = () => {
        const { ladderDivisionList } = this.props.liveScoreLadderState
        let divisionListArr = isArrayNotEmpty(ladderDivisionList) ? ladderDivisionList : []
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div
                                style={{
                                    width: "fit-content",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <span className="year-select-heading ">
                                    {AppConstants.division}:
                                   </span>

                                <Select
                                    className="year-select"
                                    style={{ minWidth: 80 }}
                                    onChange={(divisionId) => this.changeDivision(divisionId)}
                                    value={this.state.divisionId}
                                >
                                    {
                                        divisionListArr.map((item, index) => {
                                            return <Option key={"division" + item.id} value={item.id}>{item.name}</Option>
                                        })
                                    }
                                </Select>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    deleteItem(index) {
        this.props.updateLadderSetting({ index: index, key: 'removeItem' })

    }

    ////////form content view
    contentView = (getFieldDecorator) => {

        const { ladderData, teamResult } = this.props.liveScoreLadderState
        let addNewLadder = isArrayNotEmpty(ladderData) ? ladderData : [];
        let teamList = isArrayNotEmpty(teamResult) ? teamResult : []

        return (
            <div className="content-view pt-4">

                {addNewLadder.map((ladder, index) => (
                    <div className="inside-container-view">

                        <div className="transfer-image-view pt-0 pointer" style={{ marginLeft: 'auto' }} onClick={() => this.deleteItem(index)}>
                            <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                            <span className="user-remove-text">
                                {AppConstants.remove}
                            </span>
                        </div>

                        <div className="row pt-3" >
                            <div className='col-sm-3 division-table-field-view'>
                                <InputWithHead
                                    required={"required-field pb-0"}
                                    heading={AppConstants.teamName}
                                />
                            </div>
                            <div className="col-sm" >

                                <Form.Item >
                                    {getFieldDecorator(`teamId${index}`, {
                                        rules: [{ required: true, message: ValidationConstants.teamName }],
                                    })(

                                        <Select

                                            placeholder={AppConstants.selectTeam}
                                            style={{ width: "100%" }}
                                            onChange={(teamId) => this.props.updateLadderSetting({ data: teamId, index: index, key: 'teamId' })}
                                            // value={ladderData[index] ? ladderData[index].teamId : undefined}
                                            showSearch
                                            optionFilterProp="children"

                                        >
                                            {teamList.map((item, index) => (
                                                < Option key={'teamList' + index} value={item.id} > {item.name}</Option>
                                            ))
                                            }
                                        </Select>

                                    )}
                                </Form.Item>

                            </div>
                        </div>

                        <div className="row pt-3" >
                            <div className='col-sm-3 division-table-field-view'>
                                <InputWithHead required={"required-field pb-0"} heading={AppConstants.points} />
                            </div>
                            <div className="col-sm" >
                                <Form.Item >
                                    {getFieldDecorator(`points${index}`, {
                                        rules: [{ required: true, message: ValidationConstants.point }],
                                    })(
                                        <InputWithHead
                                            auto_Complete='new-points'
                                            placeholder={AppConstants.points}
                                            onChange={(e) => this.props.updateLadderSetting({ data: e.target.value, index: index, key: 'points' })}
                                        // value={ladderData[index] && ladderData[index].points}
                                        />

                                    )}
                                </Form.Item>
                            </div>
                        </div>

                        <div className="row pt-3" >
                            <div className='col-sm-3 division-table-field-view'>
                                <InputWithHead required={"required-field pb-0"} heading={AppConstants.reasonForChange} />
                            </div>
                            <div className="col-sm" >
                                <Form.Item >
                                    {getFieldDecorator(`adjustmentReason${index}`, {
                                        rules: [{ required: true, message: ValidationConstants.reasonChange }],
                                    })(
                                        <InputWithHead
                                            auto_Complete='new-reason'
                                            placeholder={AppConstants.reasonForChange}
                                            onChange={(e) => this.props.updateLadderSetting({ data: e.target.value, index: index, key: 'adjustmentReason' })}
                                        // value={ladderData[index] && ladderData[index].reasonforChange}
                                        />

                                    )}
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                ))}



                <div  >
                    <span onClick={() => this.props.updateLadderSetting({ data: null, key: 'addLadderAdjustment' })} className='input-heading-add-another pointer'>+ {AppConstants.addNewAdjustment}</span>
                </div>

            </div>
        )
    };

    //////footer view containing all the buttons like save and cancel
    footerView = (isSubmitting) => {


        return (
            <div className="fluid-width">
                {!this.state.membershipIsUsed &&
                    <div className="footer-view">
                        <div className="row">
                            {/* <div className="col-sm">
                                <div className="reg-add-save-button">
                                    <Button type="cancel-button">{AppConstants.cancel}</Button>

                                </div>
                            </div> */}
                            <div className="col-sm">
                                <div className="comp-buttons-view">
                                    <Button
                                        className="publish-button save-draft-text" type="primary" htmlType="submit" >
                                        {AppConstants.save}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    };

    ////Api call after on save click
    onSaveClick = (e) => {
        const { ladderData } = this.props.liveScoreLadderState
        console.log(ladderData, 'ladderData')
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                let body = {
                    "competitionUniqueKey": this.state.compUniqueKey,
                    "divisionId": this.state.divisionId,
                    "adjustments": ladderData
                }

                this.props.ladderAdjustmentPostData({ body: body })

            }
        });
    }


    render = () => {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"11"} />
                <Loader visible={this.props.liveScoreLadderState.onLoading} />
                <Layout>
                    {this.headerView()}
                    {this.dropdownView()}
                    <Form autoComplete='off' onSubmit={this.onSaveClick} className="login-form">
                        <div className="formView">{this.contentView(getFieldDecorator)}</div>
                        <Footer>
                            {this.footerView()}
                        </Footer>
                    </Form>
                </Layout>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateLadderSetting,
        getliveScoreTeams,
        getLiveScoreDivisionList,
        ladderAdjustmentPostData,
        ladderAdjustmentGetData
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreLadderState: state.LiveScoreLadderState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreLadderAdjustment));