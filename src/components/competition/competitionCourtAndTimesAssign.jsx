import React, { Component } from "react";
import { Layout, Breadcrumb, Select, Button, TimePicker, Radio, Form, message, Tooltip } from 'antd';
import { NavLink } from 'react-router-dom';
import './competition.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import moment from 'moment';
import AppConstants from "../../themes/appConstants";
import {
    getYearAndCompetitionOwnAction,
    clearYearCompetitionAction
} from "../../store/actions/appAction";
import {
    getCompetitionWithTimeSlots, addRemoveTimeSlot,
    UpdateTimeSlotsData, UpdateTimeSlotsDataManual,
    addTimeSlotDataPost
} from "../../store/actions/competitionModuleAction/competitionTimeAndSlotsAction"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { timeSlotInit } from "../../store/actions/commonAction/commonAction"
import { isArrayNotEmpty, isNotNullOrEmptyString } from "../../util/helpers";
import InputWithHead from "../../customComponents/InputWithHead";
import { getVenuesTypeAction } from "../../store/actions/appAction";
import ValidationConstants from "../../themes/validationConstant";
import {
    setOwnCompetitionYear,
    getOwnCompetitionYear,
    setOwn_competition,
    getOwn_competition,
    getOwn_competitionStatus,
    setOwn_competitionStatus,
} from "../../util/sessionStorage"
import AppImages from "../../themes/appImages";
import Loader from '../../customComponents/loader'
import CustomTooltip from 'react-png-tooltip'
import AppUniqueId from "../../themes/appUniqueId";



const { Header, Footer, Content } = Layout;
const { Option } = Select;

class CompetitionCourtAndTimesAssign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
            firstTimeCompId: "",
            getDataLoading: false,
            competitionStatus: 0,
            tooltipVisibleDelete: false
        }
        // this.props.timeSlotInit()
        this.props.clearYearCompetitionAction()
        this.props.getVenuesTypeAction()
    }


    // component did mount
    componentDidMount() {
        let yearId = getOwnCompetitionYear()
        let storedCompetitionId = getOwn_competition()
        let storedCompetitionStatus = getOwn_competitionStatus()
        let propsData = this.props.appState.own_YearArr.length > 0 ? this.props.appState.own_YearArr : undefined
        let compData = this.props.appState.own_CompetitionArr.length > 0 ? this.props.appState.own_CompetitionArr : undefined
        if (storedCompetitionId && yearId && propsData && compData) {
            this.setState({
                yearRefId: JSON.parse(yearId),
                firstTimeCompId: storedCompetitionId,
                competitionStatus: storedCompetitionStatus,
                getDataLoading: true
            })
            // if (this.props.competitionTimeSlots.allrefernceData.length > 0) {
            this.props.getCompetitionWithTimeSlots(yearId, storedCompetitionId);
            // }
        }
        else if (yearId) {
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

    // component did update
    componentDidUpdate(nextProps) {
        let competitionTimeSlots = this.props.competitionTimeSlots

        if (nextProps.competitionTimeSlots !== competitionTimeSlots) {
            if (competitionTimeSlots.onGetTimeSlotLoad == false && this.state.getDataLoading == true) {
                this.setState({
                    getDataLoading: false,
                })
                this.setDetailsFieldValue()
            }
        }

        if (nextProps.appState !== this.props.appState) {
            let competitionList = this.props.appState.own_CompetitionArr
            if (nextProps.appState.own_CompetitionArr !== competitionList) {
                if (competitionList.length > 0) {
                    let competitionId = competitionList[0].competitionId
                    let statusRefId = competitionList[0].statusRefId
                    setOwn_competition(competitionId)
                    setOwn_competitionStatus(statusRefId)
                    this.props.getCompetitionWithTimeSlots(this.state.yearRefId, competitionId);
                    this.setState({ getDataLoading: true, firstTimeCompId: competitionId, competitionStatus: statusRefId })

                }
            }
        }
    }


    // for set default values
    setDetailsFieldValue = () => {
        let competitionTimeSlots = this.props.competitionTimeSlots
        this.props.form.setFieldsValue({
            timeslotRotationRefId: competitionTimeSlots.getcompetitionTimeSlotData.timeslotRotationRefId,
            timeslotGenerationRefId: competitionTimeSlots.getcompetitionTimeSlotData.timeslotGenerationRefId,
            applyToVenueRefId: competitionTimeSlots.getcompetitionTimeSlotData.applyToVenueRefId,
            mainTimeRotationID: competitionTimeSlots.getcompetitionTimeSlotData.mainTimeRotationID
        })
        let timeSlotMatchDuration = competitionTimeSlots.getcompetitionTimeSlotData.competitionVenueTimeslotsDayTime ? competitionTimeSlots.getcompetitionTimeSlotData.competitionVenueTimeslotsDayTime : []
        timeSlotMatchDuration.length > 0 && timeSlotMatchDuration.map((item, index) => {
            let dayRefId = `dayRefId${index}`
            this.props.form.setFieldsValue({
                [dayRefId]: item.dayRefId,
            })
        })

        let timeslotmatchEntityCheck = competitionTimeSlots.getcompetitionTimeSlotData.competitionTimeslotsEntity ? competitionTimeSlots.getcompetitionTimeSlotData.competitionTimeslotsEntity : []
        timeslotmatchEntityCheck.length > 0 && timeslotmatchEntityCheck.map((item, index) => {
            let timeSlotEntityManualkeyArr = `timeSlotEntityManualkeyArr${index}`
            let timeSlotEntityGradeKeyArr = `timeSlotEntityGradeKeyArr${index}`

            this.props.form.setFieldsValue({
                [timeSlotEntityManualkeyArr]: item.timeSlotEntityManualkeyArr,
                [timeSlotEntityGradeKeyArr]: item.timeSlotEntityGradeKeyArr
            })
        })

        let timeSlotManualPerVenue = competitionTimeSlots.getcompetitionTimeSlotData.competitionTimeslotManual ? competitionTimeSlots.getcompetitionTimeSlotData.competitionTimeslotManual : []
        timeSlotManualPerVenue.length > 0 && timeSlotManualPerVenue.map((PerVenueItem, perVenueIndex) => {
            PerVenueItem.timeslots.length > 0 && PerVenueItem.timeslots.map((timeSlotItem, timeSlotIndex) => {
                let dayRefIdManual = `dayRefIdManual${timeSlotIndex}`
                this.props.form.setFieldsValue({
                    [dayRefIdManual]: timeSlotItem.dayRefId,

                })

                timeSlotItem.startTime.length > 0 && timeSlotItem.startTime.map((startTimeItem, startTimeIndex) => {
                    let timeSlotEntityManualkey = `timeSlotEntityManualkey${timeSlotIndex}${startTimeIndex}`
                    let timeSlotEntityGradeKey = `timeSlotEntityGradeKey${timeSlotIndex}${startTimeIndex}`
                    this.props.form.setFieldsValue({
                        [timeSlotEntityManualkey]: startTimeItem.timeSlotEntityManualkey,
                        [timeSlotEntityGradeKey]: startTimeItem.timeSlotEntityGradeKey
                    })

                })

            })

        })

        let timeSlotManualAllVenue = competitionTimeSlots.timeSlotManualAllVenue ? competitionTimeSlots.timeSlotManualAllVenue : []
        timeSlotManualAllVenue.length > 0 && timeSlotManualAllVenue.map((venueItemData, venue_Index) => {
            venueItemData.timeslots.length > 0 && venueItemData.timeslots.map((timeSlotsItem, timeSlotsIndex) => {
                let dayRefIdAllVenue = `dayRefIdAllVenue${venue_Index}${timeSlotsIndex}`
                this.props.form.setFieldsValue({
                    [dayRefIdAllVenue]: timeSlotsItem.dayRefId,
                })
                timeSlotsItem.startTime.length > 0 && timeSlotsItem.startTime.map((startItem, startIndex) => {
                    let perDivisionkey = `perDivisionkey${venue_Index}${timeSlotsIndex}${startIndex}`
                    let perGradeKey = `perGradeKey${venue_Index}${timeSlotsIndex}${startIndex}`
                    this.props.form.setFieldsValue({
                        [perDivisionkey]: startItem.timeSlotEntityManualkey,
                        [perGradeKey]: startItem.timeSlotEntityGradeKey
                    })
                })
            })
        })

    }


    // for post api
    saveAPIsActionCall = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let AllVenueData = JSON.parse(JSON.stringify(this.props.competitionTimeSlots.timeSlotManualAllVenue))
                let timeSlotData = JSON.parse(JSON.stringify(this.props.competitionTimeSlots.getcompetitionTimeSlotData))
                timeSlotData["competitionUniqueKey"] = this.state.firstTimeCompId
                timeSlotData["organisationId"] = 1
                ///for fillter  timeslotdata on the basis of generation key 
                if (timeSlotData.timeslotGenerationRefId == 1) {
                    timeSlotData.competitionTimeslotManual = []
                    timeSlotData["applyToVenueRefId"] = 0
                    let timeSlotEntity = timeSlotData.competitionTimeslotsEntity
                    if (timeSlotData.mainTimeRotationID !== 8) {
                        timeSlotEntity = []
                    } else {
                        for (let i in timeSlotEntity) {
                            delete timeSlotEntity[i]["timeSlotEntityManualkeyArr"]
                            delete timeSlotEntity[i]["timeSlotEntityGradeKeyArr"]
                            timeSlotEntity[i].sortOrder = JSON.parse(i)
                        }
                    }
                } else {
                    timeSlotData.competitionTimeslotsEntity = []
                    timeSlotData.competitionVenueTimeslotsDayTime = []
                }
                /******************** */
                //fillter data for if apply time slot for per venue 
                if (timeSlotData.applyToVenueRefId == 2) {
                    let newObj = null
                    let updatedTimeSlotManualArr = []
                    for (let i in AllVenueData) {
                        if (AllVenueData[i].timeslots.length > 0) {
                            delete AllVenueData[i].venueName
                            updatedTimeSlotManualArr.push(AllVenueData[i])
                        }
                    }
                    let getTimeSlot = null
                    let getStartTime = null
                    let manualperVenueObj = null

                    for (let i in updatedTimeSlotManualArr) {
                        let timeSlotManualAllVenueArray = []
                        getTimeSlot = updatedTimeSlotManualArr[i].timeslots
                        for (let j in getTimeSlot) {
                            getStartTime = getTimeSlot[j].startTime
                            for (let k in getStartTime) {
                                let manualcompetitionTimeslotsEntityOBj = getStartTime[k].competitionTimeslotsEntity
                                if (timeSlotData.mainTimeRotationID == 8) {
                                    for (let l in manualcompetitionTimeslotsEntityOBj) {
                                        manualcompetitionTimeslotsEntityOBj[l].competitionVenueTimeslotEntityId = 0
                                        manualperVenueObj =
                                        {
                                            "competitionVenueTimeslotsDayTimeId": 0,
                                            "dayRefId": getTimeSlot[j].dayRefId,
                                            "startTime": getStartTime[k].startTime,
                                            "sortOrder": JSON.parse(k),
                                            "competitionTimeslotsEntity": timeSlotData.mainTimeRotationID == 8 ? manualcompetitionTimeslotsEntityOBj : [],
                                        }
                                    }
                                }
                                else {
                                    manualperVenueObj =
                                    {
                                        "competitionVenueTimeslotsDayTimeId": 0,
                                        "dayRefId": getTimeSlot[j].dayRefId,
                                        "startTime": getStartTime[k].startTime,
                                        "sortOrder": JSON.parse(k),
                                        "competitionTimeslotsEntity": timeSlotData.mainTimeRotationID == 8 ? manualcompetitionTimeslotsEntityOBj : [],
                                    }
                                }

                                timeSlotManualAllVenueArray.push(manualperVenueObj)
                            }
                        }
                        updatedTimeSlotManualArr[i].timeslots = timeSlotManualAllVenueArray
                    }
                    timeSlotData.competitionTimeslotManual = JSON.parse(JSON.stringify(updatedTimeSlotManualArr))
                }

                // for key compitition time slot id param change 
                if (timeSlotData.compititionTimeslotId) {
                    timeSlotData["competitionTimeslotId"] = timeSlotData["compititionTimeslotId"]
                    delete timeSlotData["compititionTimeslotId"]
                }
                else {
                    timeSlotData["competitionTimeslotId"] = 0
                }
                /// filter data on the basis of timeslot rotation id
                if (timeSlotData.applyToVenueRefId == 1) {
                    let manualStartTime = null
                    let manualAllVenueObj = null
                    let checkTimeRotationDataArr = timeSlotData.competitionTimeslotManual
                    for (let i in checkTimeRotationDataArr) {
                        let timeSloltdataArr = checkTimeRotationDataArr[i].timeslots
                        if (timeSloltdataArr.length > 0) {
                            let timeSlotManualperVenueArray = []
                            for (let j in timeSloltdataArr) {
                                delete timeSloltdataArr[j].timeSlotEntityManualkey
                                delete timeSloltdataArr[j]["timeSlotEntityGradeKey"]
                                manualStartTime = timeSloltdataArr[j].startTime
                                for (let k in manualStartTime) {
                                    let competitionTimeslotsEntityObj = manualStartTime[k].competitionTimeslotsEntity
                                    if (timeSlotData.mainTimeRotationID == 8) {
                                        for (let l in competitionTimeslotsEntityObj) {
                                            competitionTimeslotsEntityObj[l].competitionVenueTimeslotEntityId = 0

                                            manualAllVenueObj =
                                            {
                                                "competitionVenueTimeslotsDayTimeId": 0,
                                                "dayRefId": timeSloltdataArr[j].dayRefId,
                                                "startTime": manualStartTime[k].startTime,
                                                "sortOrder": JSON.parse(k),
                                                "competitionTimeslotsEntity": timeSlotData.mainTimeRotationID !== 8 ? [] : competitionTimeslotsEntityObj,
                                            }
                                        }
                                    }
                                    else {
                                        manualAllVenueObj =
                                        {
                                            "competitionVenueTimeslotsDayTimeId": 0,
                                            "dayRefId": timeSloltdataArr[j].dayRefId,
                                            "startTime": manualStartTime[k].startTime,
                                            "sortOrder": JSON.parse(k),
                                            "competitionTimeslotsEntity": timeSlotData.mainTimeRotationID !== 8 ? [] : competitionTimeslotsEntityObj,
                                        }

                                    }
                                    timeSlotManualperVenueArray.push(manualAllVenueObj)
                                }
                            }
                            checkTimeRotationDataArr[i].timeslots = timeSlotManualperVenueArray
                        }
                    }
                    timeSlotData.competitionTimeslotManual = JSON.parse(JSON.stringify(checkTimeRotationDataArr))
                }

                // if (timeSlotData.timeslotRotationRefId == 7) {
                //     timeSlotData.competitionVenueTimeslotsDayTime = []
                //     timeSlotData.competitionTimeslotsEntity = []
                //     //     timeSlotData.competitionTimeslotManual = []
                // }
                delete timeSlotData["divisions"]
                delete timeSlotData["grades"]
                delete timeSlotData["mainTimeRotationID"]
                if (timeSlotData.competitionUniqueKey == null || timeSlotData.competitionUniqueKey == "") {
                    message.error(ValidationConstants.pleaseSelectCompetition)
                }
                else {
                    this.props.addTimeSlotDataPost(timeSlotData)
                }
            }
        })
    }
    // update time rotation
    updatetimeRotation(e) {
        this.props.UpdateTimeSlotsData(e.target.value, "timeslotRotationRefId", null, null, null, null)
        setTimeout(() => {
            this.setDetailsFieldValue()
        }, 1000);
    }
    // / update  main time rotation
    updateMainTimeRotation(e) {
        this.props.UpdateTimeSlotsData(e.target.value, "mainTimeRotationID", null, null, null, null)
        setTimeout(() => {
            this.setDetailsFieldValue()
        }, 800);
    }
    // / update   time slot generation
    changeTimeSlotGeneration(e) {
        this.props.UpdateTimeSlotsData(e.target.value, "timeslotGenerationRefId", null, null, null, null)
        setTimeout(() => {
            this.setDetailsFieldValue()
        }, 800);
    }



    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-venue-courts-header-view" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.timeSlot}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header >
        )
    }
    //////year change onchange
    onYearChange = (yearId) => {
        setOwnCompetitionYear(yearId)
        setOwn_competition(undefined)
        setOwn_competitionStatus(undefined)
        this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
        this.setState({ firstTimeCompId: null, yearRefId: yearId, competitionStatus: 0 })
        this.setDetailsFieldValue()
    }

    // on Competition change
    onCompetitionChange(competitionId, statusRefId) {
        setOwn_competition(competitionId)
        setOwn_competitionStatus(statusRefId)
        this.props.getCompetitionWithTimeSlots(this.state.yearRefId, competitionId);
        this.setState({ getDataLoading: true, firstTimeCompId: competitionId, competitionStatus: statusRefId })
    }

    //add obj on click of time slot allocation based on match duration
    addAnotherTimeSlot = (index, item, keyword) => {
        this.props.addRemoveTimeSlot(index, item, keyword)
    }

    //////add or remove another division inthe divsision tab
    addDataTimeSlot(item, index, getFieldDecorator, data) {
        let daysList = this.props.competitionTimeSlots
        let disabledStatus = this.state.competitionStatus == 1 ? true : false
        return (
            <div className="row">
                <div className="col-sm">
                    <InputWithHead heading={index == 0 ? AppConstants.dayOfTheWeek : " "} />
                    <Form.Item>
                        {getFieldDecorator(
                            `dayRefId${index}`,
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: ValidationConstants.dayField
                                    }
                                ]
                            },
                        )(
                            <Select
                                id={AppUniqueId.timeRotation_matchDuration_Day_of_the_week_drpdn}
                                style={{ width: "80%" }}
                                disabled={disabledStatus}
                                onChange={(dayOfTheWeek) => this.props.UpdateTimeSlotsData(dayOfTheWeek, 'dayRefId', 'competitionVenueTimeslotsDayTime', index, null, null)}
                                placeholder={'Select Week Day'}
                            >
                                {daysList.weekDays.length > 0 && daysList.weekDays.map((item) => (
                                    < Option value={item.id}> {item.description}</Option>
                                ))
                                }
                            </Select>
                        )}
                    </Form.Item>
                </div>
                <div className="col-sm">
                    <InputWithHead heading={index == 0 ? AppConstants.startTime : " "} />
                    <TimePicker
                        id={AppUniqueId.timeRotation_matchDuration_StartTime_drpdn}
                        key={"startTime"}
                        disabled={disabledStatus}
                        className="comp-venue-time-timepicker"
                        style={{ width: "80%" }}
                        onChange={(time) => time != null && this.changeTime(time, "startTime", index)}
                        value={item.startTime != null && moment(item.startTime, "HH:mm")}
                        format={"HH:mm"}
                        defaultValue={moment()}

                    // disabledDate={d => !d || d.isAfter(closeDate)
                    // minuteStep={15}
                    />
                </div>
                <div className="col-sm">
                    <InputWithHead heading={index == 0 ? AppConstants.endTime : " "} />
                    <TimePicker
                        disabled={disabledStatus}
                        id={AppUniqueId.timeRotation_matchDuration_EndTime_drpdn}
                        key={"endTime"}
                        className="comp-venue-time-timepicker"
                        style={{ width: "80%" }}
                        value={item.endTime != null && moment(item.endTime, "HH:mm")}
                        format={"HH:mm"}
                        onChange={(time) => time != null && this.changeTime(time, "endTime", index)}
                    // minuteStep={15}
                    // disabledHours={() => this.getDisabledHours(item.startTime)}
                    />
                </div>
                {data.length > 1 &&
                    < div className="col-sm-2 delete-image-view pb-4" onClick={() => disabledStatus == false && this.addTimeManualPerVenue(index, item, "competitionVenueTimeslotsDayTimedelete")}>
                        <a className="transfer-image-view">
                            <span className="user-remove-btn">
                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                            </span>
                            <span className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                        </a>
                    </div>
                }

            </div >
        )
    }

    // getDisabledHours = (time) => {
    //     let startTime = moment.duration(time)
    //     let hours = []
    //     if (startTime.hours()) {
    //         for (var i = 0; i < startTime.hours(); i++) {
    //             hours.push(i);
    //         }
    //     }
    //     return hours;
    // }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        const { own_YearArr, own_CompetitionArr, } = this.props.appState

        return (
            <div className="comp-venue-courts-dropdown-view mt-0" >
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm-3 pb-3" >
                            <div
                                style={{
                                    width: "fit-content",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                            >
                                <span className="year-select-heading">
                                    {AppConstants.year}:
                                  </span>
                                <Select
                                    id={AppUniqueId.compYear_dpdnTimeslot}
                                    name={"yearRefId"}
                                    className="year-select reg-filter-select-year ml-2"
                                    // style={{ width: 90 }}
                                    onChange={yearRefId => this.onYearChange(yearRefId)}
                                    value={this.state.yearRefId}
                                >
                                    {own_YearArr.length > 0 && own_YearArr.map(item => {
                                        return (
                                            <Option key={"yearRefId" + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm-3 pb-3" >
                            <div style={{
                                width: "fit-content", display: "flex",
                                flexDirection: "row",
                                alignItems: "center", marginRight: 50,
                            }} >
                                <span className='year-select-heading'>{AppConstants.competition}:</span>
                                <Select
                                    id={AppUniqueId.competitionName_dpdnTimeslot}
                                    name={"competition"}
                                    className="year-select reg-filter-select-competition ml-2"
                                    onChange={(competitionId, e) => this.onCompetitionChange(competitionId, e.key)}
                                    value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
                                >
                                    {own_CompetitionArr.length > 0 && own_CompetitionArr.map(item => {
                                        return (
                                            <Option key={item.statusRefId} value={item.competitionId}>
                                                {item.competitionName}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onChangevenueRefId = (value) => {
        this.props.UpdateTimeSlotsData(value, "applyToVenueRefId", null, null, null, null)
        setTimeout(() => {
            this.setDetailsFieldValue()
        }, 300)
    }

    getCourtRotationId(data, key) {


        switch (key) {

            case "timeSlotPref":

                switch (data) {
                    case 7: return AppUniqueId.timeRotationPreferenceRadiobutton

                    case 8: return AppUniqueId.allocateSameTimeslotRadiobutton

                    default: break;

                }
                break;

            case "subPref":

                switch (data) {
                    case 4: return AppUniqueId.allocateSameTimeslotDivision

                    case 5: return AppUniqueId.allocateSameTimeslotGrade

                    default: break;

                }
                break;

            case "timeSlotGenration":

                switch (data) {
                    case 1: return AppUniqueId.timeRotation_matchDuration_RadioBtn

                    case 2: return AppUniqueId.manuallyAddTimeslot

                    default: break;

                }
                break;

            case "manuallySubPref":

                switch (data) {
                    case 1: return AppUniqueId.manuallyAddTimeslot_ApplyAllVenues

                    case 2: return AppUniqueId.manuallyAddTimeslot_ApplySettingsIndividualVenues

                    default: break;

                }
                break;

            default: break

        }

    }


    ////////form content view
    contentView = (getFieldDecorator) => {
        let timeSlotData = this.props.competitionTimeSlots.getcompetitionTimeSlotData
        let commonState = this.props.competitionTimeSlots
        let timeSlotManual = this.props.competitionTimeSlots.getcompetitionTimeSlotData.competitionTimeslotManual;
        let disabledStatus = this.state.competitionStatus == 1 ? true : false
        return (
            <div className="content-view pt-3">
                <span className="applicable-to-heading">
                    {AppConstants.anyTimePreference}
                </span>
                <Form.Item  >
                    {getFieldDecorator('mainTimeRotationID', { rules: [{ required: true, message: "Please select time slot preference" }] })(
                        <Radio.Group
                            className="reg-competition-radio"
                            disabled={disabledStatus}
                            onChange={e => {
                                this.updateMainTimeRotation(e)
                            }}
                            setFieldsValue={timeSlotData.mainTimeRotationID}
                        >
                            {commonState.timeSlotRotation.length > 0 && commonState.timeSlotRotation.map((item, index) => {
                                return (
                                    <div key={"timeSlot" + index}>
                                        <div className='contextualHelp-RowDirection' >
                                            <Radio id={this.getCourtRotationId(item.id, 'timeSlotPref')} key={item.id} value={item.id}> {item.name}</Radio>
                                            <div style={{ marginLeft: -22, marginTop: -5 }}>
                                                <CustomTooltip background='#ff8237'>
                                                    <span>{item.helpMsg}</span>
                                                </CustomTooltip>
                                            </div>
                                        </div>
                                        {isArrayNotEmpty(item.subReferences) && <div>
                                            <Form.Item  >
                                                {getFieldDecorator('timeslotRotationRefId', { rules: [{ required: false, message: "Please select time slot preference" }] })(
                                                    <Radio.Group
                                                        disabled={disabledStatus}
                                                        className="reg-competition-radio pl-5"
                                                        onChange={e => {
                                                            this.updatetimeRotation(e)
                                                        }}
                                                        setFieldsValue={timeSlotData.timeslotRotationRefId}
                                                    >
                                                        {timeSlotData.mainTimeRotationID == item.id && item.subReferences.map((subArr) => {
                                                            return (

                                                                <Radio id={this.getCourtRotationId(item.id, 'subPref')} key={"data" + subArr.id} value={subArr.id}> {subArr.description}</Radio>
                                                            )
                                                        })}
                                                    </Radio.Group>
                                                )}
                                            </Form.Item>
                                        </div>
                                        } </div>)

                            })}
                        </Radio.Group>
                    )}
                </Form.Item>
                <div className="inside-container-view" >
                    <Form.Item  >
                        {getFieldDecorator('timeslotGenerationRefId', { rules: [{ required: true, message: ValidationConstants.timeSlotPreference }] })(
                            <Radio.Group className="reg-competition-radio"
                                disabled={disabledStatus}
                                onChange={(e) => this.changeTimeSlotGeneration(e)}
                            // setFieldsValue={timeSlotData.timeslotGenerationRefId}
                            >
                                {commonState.timeSlotGeneration.length > 0 && commonState.timeSlotGeneration.map((item, index) => {
                                    return (
                                        <div key={"slot" + index}>
                                            <div className='contextualHelp-RowDirection' >
                                                <Radio id={this.getCourtRotationId(item.id, 'timeSlotGenration')} key={item.id} value={item.id}> {item.description}</Radio>
                                                <div style={{ marginLeft: -22, marginTop: -5 }}>
                                                    <CustomTooltip background='#ff8237'>
                                                        <span>{item.helpMsg}</span>
                                                    </CustomTooltip>
                                                </div>
                                            </div>
                                            {timeSlotData.timeslotGenerationRefId === index + 1 && item.id == 1 && (timeSlotData.mainTimeRotationID === 8 || timeSlotData.mainTimeRotationID === 9 || timeSlotData.mainTimeRotationID === 6 || timeSlotData.mainTimeRotationID === 7) &&
                                                <div>
                                                    <div className="fluid-width">
                                                        {timeSlotData.competitionVenueTimeslotsDayTime.map((item, index) => {
                                                            return this.addDataTimeSlot(item, index, getFieldDecorator, timeSlotData.competitionVenueTimeslotsDayTime)
                                                        })}
                                                    </div>
                                                    <span id={AppUniqueId.timeRotation_matchDuration_Add_anotherday_Btn} className='input-heading-add-another' onClick={() => disabledStatus == false && this.addAnotherTimeSlot(null, null, "competitionVenueTimeslotsDayTime")} > + {AppConstants.addAnotherDay}</span>
                                                </div>
                                            }
                                            {timeSlotData.mainTimeRotationID === 8 && item.id == 1 && timeSlotData.timeslotGenerationRefId === index + 1 &&
                                                < div >

                                                    <div className="fluid-width">
                                                        {timeSlotData.timeslotRotationRefId == 4 && <span id={AppUniqueId.timeRotation_matchDuration_AdddivisionTimeslotOrderTextField} className="applicable-to-heading">
                                                            {AppConstants.divisionsTimeSlot}
                                                        </span>
                                                        }
                                                        {timeSlotData.timeslotRotationRefId == 4 && timeSlotData.competitionTimeslotsEntity.map((item, index) => {
                                                            return this.addTimeSlotDivision(item, index, getFieldDecorator, timeSlotData.mainTimeRotationID, timeSlotData.timeslotRotationRefId, timeSlotData.competitionTimeslotsEntity)
                                                        })}
                                                        {timeSlotData.timeslotRotationRefId == 5 && <span className="applicable-to-heading">
                                                            {AppConstants.gradesTimeSlot}
                                                        </span>
                                                        }
                                                        {timeSlotData.timeslotRotationRefId == 5 && timeSlotData.competitionTimeslotsEntity.map((item, index) => {
                                                            return this.addTimeSlotGrades(item, index, getFieldDecorator, timeSlotData.mainTimeRotationID, timeSlotData.timeslotRotationRefId, timeSlotData.competitionTimeslotsEntity)
                                                        })}
                                                    </div>

                                                    <span id={AppUniqueId.timeRotation_matchDuration_AddAnotherTimeslot_Btn} className='input-heading-add-another' onClick={() => disabledStatus == false && this.addDivisionOrGrade(null, null, "competitionTimeslotsEntity")}>+ {AppConstants.addTimeSlot}</span>
                                                </div>
                                            }
                                        </div>
                                    )
                                })}
                                {timeSlotData.timeslotGenerationRefId === 2 &&
                                    <div className="ml-5" >
                                        <Form.Item  >
                                            {getFieldDecorator('applyToVenueRefId', { rules: [{ required: true, message: ValidationConstants.venueField }] })(
                                                <Radio.Group className="reg-competition-radio"
                                                    disabled={disabledStatus}
                                                    onChange={(e) => this.onChangevenueRefId(e.target.value)}
                                                    setFieldsValue={timeSlotData.applyToVenueRefId}
                                                >
                                                    {commonState.applyVenue.length > 0 && commonState.applyVenue.map(item => {
                                                        return (
                                                            <Radio id={this.getCourtRotationId(item.id, 'manuallySubPref')} key={item.id} value={item.id}> {item.description}</Radio>
                                                        )
                                                    }
                                                    )}

                                                </Radio.Group>
                                            )}
                                        </Form.Item>
                                    </div>
                                }
                            </Radio.Group>
                        )}
                    </Form.Item>

                    {timeSlotData.timeslotGenerationRefId === 2 && timeSlotData.applyToVenueRefId == 1 && (timeSlotData.mainTimeRotationID === 8 || timeSlotData.mainTimeRotationID === 9 || timeSlotData.mainTimeRotationID === 6 || timeSlotData.mainTimeRotationID === 7) &&
                        <div>
                            <div className="fluid-width">
                                {timeSlotManual.length > 0 && timeSlotManual[0].timeslots.map((item, index) => {
                                    return (this.addDataTimeSlotManual(item, index, getFieldDecorator, timeSlotData.timeslotRotationRefId, timeSlotData.mainTimeRotationID, timeSlotManual[0].timeslots))
                                })}
                            </div>
                            <span className='input-heading-add-another' onClick={() => disabledStatus == false && this.addTimeManualPerVenue(null, null, "competitionTimeslotManual")} > +{AppConstants.addAnotherDay}</span>
                        </div>
                    }
                    {
                        timeSlotData.timeslotGenerationRefId === 2 && timeSlotData.applyToVenueRefId == 2 && (timeSlotData.mainTimeRotationID === 8 || timeSlotData.mainTimeRotationID === 9 || timeSlotData.mainTimeRotationID === 6 || timeSlotData.mainTimeRotationID === 7) &&
                        <div>
                            <div>
                                <div className="fluid-width">
                                    {(commonState.timeSlotManualAllVenue || []).map((item, venueIndex) => {
                                        return (
                                            <div>
                                                <span className="applicable-to-heading mt-3">{item.venueName}</span>
                                                {
                                                    item.timeslots.map((slotsItem, slotIndex) => {
                                                        return (
                                                            this.addDataTimeSlotManualPerVenues(slotsItem, venueIndex, slotIndex, getFieldDecorator, timeSlotData.timeslotRotationRefId, timeSlotData.mainTimeRotationID, item.timeslots)

                                                        )
                                                    })}
                                                <span id={AppUniqueId.manuallyAddTimeslot_ApplySettingsIndividualVenues_AddAnotherDayBtn} className='input-heading-add-another pointer' onClick={() => disabledStatus == false && this.addTimeManualAllVenue(venueIndex, item, "competitionTimeslotManualAllVenue")} > + {AppConstants.addAnotherDay}</span>
                                            </div>
                                        )
                                    }
                                    )}
                                </div>

                            </div>
                        </div>
                    }
                </div>
            </div >)
    }


    addDataTimeSlotManualPerVenues(item, venueIndex, index, getFieldDecorator, id, mainId, data) {
        let daysList = this.props.competitionTimeSlots
        let division = this.props.competitionTimeSlots.getcompetitionTimeSlotData
        let disabledStatus = this.state.competitionStatus == 1 ? true : false

        return (
            <div>
                <div className="row">
                    <div className="col-sm-3">
                        <InputWithHead heading={index == 0 ? AppConstants.dayOfTheWeek : ' '} />
                        <Form.Item>
                            {getFieldDecorator(
                                `dayRefIdAllVenue${venueIndex}${index}`,
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: ValidationConstants.dayField
                                        }
                                    ]
                                },
                            )(

                                <Select
                                    disabled={disabledStatus}
                                    id={AppUniqueId.manuallyAddTimeslot_ApplySettingsIndividualVenues_Day_of_the_week_drpdn}
                                    style={{ width: mainId == 8 ? "70%" : "70%", minWidth: 100 }}
                                    onChange={(dayOfTheWeek) => this.props.UpdateTimeSlotsDataManual(dayOfTheWeek, 'dayRefId', 'competitionTimeslotManualAllvenue', index, null, null, venueIndex)}
                                    // value={item.dayRefId}
                                    placeholder="Select Week Day"
                                >
                                    {daysList.weekDays.length > 0 && daysList.weekDays.map((item) => (
                                        < Option value={item.id}> {item.description}</Option>
                                    ))
                                    }
                                </Select>
                            )}
                        </Form.Item>

                    </div>
                    <div className="col-sm">
                        {item.startTime.length > 0 && item.startTime.map((timeItem, timeIndex) => {
                            return (

                                <div className="row">
                                    <div className={mainId == 8 ? "col-sm" : "col-sm"} >
                                        <InputWithHead heading={index == 0 && timeIndex == 0 ? AppConstants.startTime : ' '} />
                                        <TimePicker
                                            disabled={disabledStatus}
                                            id={AppUniqueId.manuallyAddTimeslot_ApplySettingsIndividualVenues_startTime}
                                            key={"startTime"}
                                            style={{ minWidth: 100, }}
                                            className="comp-venue-time-timepicker"
                                            onChange={(startTime) => startTime != null && this.props.UpdateTimeSlotsDataManual(startTime.format("HH:mm"), "startTime", "competitionTimeslotManualperVenueTime", timeIndex, null, index, venueIndex)}
                                            value={timeItem.startTime != null && moment(timeItem.startTime, "HH:mm")}
                                            format={"HH:mm"}
                                        // minuteStep={15}
                                        />
                                        {item.startTime.length > 1 &&
                                            <span className='user-remove-btn pl-2'
                                                style={{ cursor: 'pointer' }}>
                                                <img
                                                    className="dot-image"
                                                    src={AppImages.redCross}
                                                    alt=""
                                                    width="16"
                                                    height="16"
                                                    onClick={() => disabledStatus == false && this.addTimeManualPerVenue(timeIndex, venueIndex, "removeTimeSlotManualPerVenue", index)}
                                                />
                                            </span>
                                        }
                                    </div>


                                    {
                                        mainId == 8 &&
                                        <div className="col-sm">
                                            <InputWithHead heading={index == 0 && timeIndex == 0 ? id == 4 ? AppConstants.divisions : AppConstants.grades : ' '} />

                                            {id == 4 &&

                                                < Form.Item >
                                                    {getFieldDecorator(
                                                        `perDivisionkey${venueIndex}${index}${timeIndex}`,
                                                        {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: ValidationConstants.divisionField
                                                                }
                                                            ]
                                                        },
                                                    )(

                                                        < Select
                                                            disabled={disabledStatus}
                                                            id={AppUniqueId.manuallyAddTimeslot_ApplySettingsIndividualVenues_Divisions}
                                                            mode='multiple'
                                                            placeholder="Select"
                                                            style={{ display: 'grid', alignContent: 'center' }}
                                                            onChange={(divisions) => this.props.UpdateTimeSlotsDataManual(divisions, 'venuePreferenceTypeRefId', 'competitionTimeslotManualAllvenue', timeIndex, id, index, venueIndex)}
                                                        >
                                                            {division.divisions && division.divisions.map((item) => (
                                                                < Option value={item.competitionMembershipProductDivision}> {item.divisionName}</Option>
                                                            ))
                                                            }

                                                        </Select >

                                                    )}
                                                </Form.Item>



                                            }
                                            {id == 5 &&
                                                <Form.Item>
                                                    {getFieldDecorator(
                                                        `perGradeKey${venueIndex}${index}${timeIndex}`,
                                                        {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: ValidationConstants.gradeField
                                                                }
                                                            ]
                                                        },
                                                    )(

                                                        < Select
                                                            disabled={disabledStatus}
                                                            mode='multiple'
                                                            placeholder="Select"
                                                            style={{ display: 'grid', alignContent: 'center' }}
                                                            onChange={(divisions) => this.props.UpdateTimeSlotsDataManual(divisions, 'venuePreferenceTypeRefId', 'competitionTimeslotManualAllvenue', timeIndex, id, index, venueIndex)}
                                                        >
                                                            {division.grades && division.grades.map((item) => (
                                                                < Option value={item.competitionDivisionGradeId}> {item.gradeName}</Option>
                                                            ))
                                                            }
                                                        </Select >
                                                    )}
                                                </Form.Item>
                                            }
                                        </div>

                                    }



                                </div>
                            )
                        })}
                        <span id={AppUniqueId.manuallyAddTimeslot_ApplySettingsIndividualVenues_AddTimeSlotBtn} className='input-heading-add-another' onClick={() => disabledStatus == false && this.addTimeManualPerVenue(index, null, "addTimeSlotManualperVenue", venueIndex)} > + {AppConstants.add_TimeSlot}</span>
                    </div>
                    {data.length > 1 &&
                        <div className="col-sm-2 delete-image-timeSlot-view" onClick={() => disabledStatus == false && this.addTimeManualPerVenue(index, venueIndex, "competitionTimeslotManualAllVenuedelete")}>
                            <a className="transfer-image-view">
                                <span className="user-remove-btn">
                                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                                </span>
                                <span className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                            </a>
                        </div>
                    }
                </div>
            </div >
        )

    }

    // add data on click of division
    addTimeSlotDivision(item, index, getFieldDecorator, mainId, id, data) {
        let division = this.props.competitionTimeSlots.getcompetitionTimeSlotData
        let timeSlotEntityKey = this.props.competitionTimeSlots
        let disabledStatus = this.state.competitionStatus == 1 ? true : false
        return (
            <div style={{ display: "flex", flexDirection: "row" }}>
                <Form.Item>
                    {getFieldDecorator(
                        `timeSlotEntityManualkeyArr${index}`,
                        {
                            rules: [
                                {
                                    required: true,
                                    message: ValidationConstants.divisionField
                                }
                            ]
                        },
                    )(
                        < Select
                            mode='multiple'
                            disabled={disabledStatus}
                            // className="pt-3"
                            placeholder="Select"
                            // value={item.timeSlotEntityManualkeyArr}
                            style={{ width: "100%", minWidth: 120, maxWidth: 180 }}
                            onChange={(divisions) => this.props.UpdateTimeSlotsData(divisions, 'venuePreferenceEntityId', 'competitionTimeslotsEntity', index, mainId, id)}
                        >
                            {division.divisions && division.divisions.map((item, divisonIndex) => {
                                return (
                                    < Option value={item.competitionMembershipProductDivision} > {item.divisionName}</Option>
                                )
                            })
                            }
                        </Select >
                    )}
                </Form.Item>
                {data.length > 1 &&
                    <div className="col-sm-2 delete-image-timeSlot-view pt-3" onClick={() => disabledStatus == false && this.addTimeManualPerVenue(index, item, "competitionTimeslotsEntitydelete")}>
                        <a className="transfer-image-view">
                            <span className="user-remove-btn">
                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                            </span>
                            <span className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                        </a>
                    </div>
                }
            </div>
        )
    }

    addTimeManualPerVenue = (index, item, keyword, parentIndex) => {
        this.props.addRemoveTimeSlot(index, item, keyword, parentIndex)
        setTimeout(() => {
            this.setDetailsFieldValue()
        }, 300);
    }
    addTimeManualAllVenue = (index, item, keyword) => {
        this.props.addRemoveTimeSlot(index, item, keyword)
        setTimeout(() => {
            this.setDetailsFieldValue()
        }, 300);
    }

    addDivisionOrGrade = (index, item, keyword) => {
        this.props.addRemoveTimeSlot(index, item, keyword)
    }
    addTimeSlotGrades(item, index, getFieldDecorator, mainId, id, data) {
        let grades = this.props.competitionTimeSlots.getcompetitionTimeSlotData
        let timeSlotEntityKey = this.props.competitionTimeSlots
        let disabledStatus = this.state.competitionStatus == 1 ? true : false

        return (
            <div style={{ display: "flex", flexDirection: "row" }}>
                <Form.Item>
                    {getFieldDecorator(
                        `timeSlotEntityGradeKeyArr${index}`,
                        {
                            rules: [
                                {
                                    required: true,
                                    message: ValidationConstants.gradeField
                                }
                            ]
                        },
                    )(
                        < Select
                            mode='multiple'
                            placeholder="Select"
                            disabled={disabledStatus}
                            style={{ width: "100%", minWidth: 120, maxWidth: 180 }}
                            onChange={(grades) => this.props.UpdateTimeSlotsData(grades, 'venuePreferenceEntityId', 'competitionTimeslotsEntity', index, mainId, id)}
                        >
                            {grades.grades && grades.grades.map((item, gradesIndex) => (
                                < Option value={item.competitionDivisionGradeId}> {item.gradeName}</Option>
                            ))
                            }
                        </Select >
                    )}
                </Form.Item>
                {data.length > 1 &&
                    <div className="col-sm-2 delete-image-timeSlot-view pt-2" onClick={() => disabledStatus == false && this.addTimeManualPerVenue(index, item, "competitionTimeslotsEntitydelete")}>
                        <a className="transfer-image-view">
                            <span className="user-remove-btn">
                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                            </span>
                            <span className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                        </a>
                    </div>
                }
            </div>
        )
    }

    changeTime(time, key, index) {
        let setTime = time.format("HH:mm")
        this.props.UpdateTimeSlotsData(setTime, key, "competitionVenueTimeslotsDayTime", index, null, null)
    }

    //addd time slot data on indvidual Venues
    addDataTimeSlotManual(item, index, getFieldDecorator, id, mainId, data) {
        let daysList = this.props.competitionTimeSlots
        let division = this.props.competitionTimeSlots.getcompetitionTimeSlotData
        let disabledStatus = this.state.competitionStatus == 1 ? true : false

        return (
            <div className="row" key={"addSlot" + index} >
                <div className="col-sm-3" style={{ marginTop: index == 0 ? null : 18 }}>
                    <InputWithHead heading={index == 0 ? AppConstants.dayOfTheWeek : ' '} />
                    <Form.Item>
                        {getFieldDecorator(
                            `dayRefIdManual${index}`,
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: ValidationConstants.dayField
                                    }
                                ]
                            },
                        )(
                            <Select
                                id={AppUniqueId.manuallyAddTimeslot_ApplyAllVenues_Day_of_the_week_drpdn}
                                style={{ width: mainId == 8 ? "70%" : "70%", minWidth: 100, }}
                                onChange={(dayOfTheWeek) => this.props.UpdateTimeSlotsDataManual(dayOfTheWeek, 'dayRefId', 'competitionTimeslotManual', index, null, null)}
                                placeholder="Select Week Day"
                                disabled={disabledStatus}
                            >
                                {daysList.weekDays.length > 0 && daysList.weekDays.map((item, index) => (
                                    < Option key={"days" + index} value={item.id}> {item.description}</Option>
                                ))
                                }
                            </Select>
                        )}
                    </Form.Item>
                </div>
                <div className="col-sm">
                    {item.startTime.length > 0 && item.startTime.map((timeItem, timeIndex) => {
                        return (

                            <div className="row" key={"timeSlotindex" + timeIndex}>
                                {/* <div className="col-sm"> */}
                                {/* <div className={"col-sm"} > */}
                                <div className={mainId == 8 ? "col-sm" : "col-sm"} >
                                    <InputWithHead heading={timeIndex == 0 ? AppConstants.startTime : ' '} />
                                    <TimePicker
                                        key={"startTime"}
                                        disabled={disabledStatus}
                                        style={{ minWidth: 100, }}
                                        className="comp-venue-time-timepicker"
                                        onChange={(startTime) => startTime != null && this.props.UpdateTimeSlotsDataManual(startTime.format("HH:mm"), "startTime", "competitionTimeslotManualTime", timeIndex, null, index)}
                                        value={timeItem.startTime != null && moment(timeItem.startTime, "HH:mm")}
                                        format={"HH:mm"}
                                    // minuteStep={15}
                                    />
                                    {item.startTime.length > 1 &&
                                        <span className='user-remove-btn pl-2'
                                            style={{ cursor: 'pointer' }}>
                                            <img
                                                className="dot-image"
                                                src={AppImages.redCross}
                                                alt=""
                                                width="16"
                                                height="16"
                                                onClick={() => disabledStatus == false && this.addTimeManualPerVenue(timeIndex, null, "removeTimeSlotManual", index)}
                                            />
                                        </span>
                                    }

                                </div>
                                {
                                    mainId == 8 &&
                                    <div className="col-sm">
                                        <InputWithHead heading={timeIndex == 0 ? id == 4 ? AppConstants.divisions : AppConstants.grades : ' '} />
                                        {id == 4 &&
                                            <Form.Item>
                                                {getFieldDecorator(
                                                    `timeSlotEntityManualkey${index}${timeIndex}`,
                                                    {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: ValidationConstants.divisionField
                                                            }
                                                        ]
                                                    },
                                                )(
                                                    < Select
                                                        disabled={disabledStatus}
                                                        mode='multiple'
                                                        placeholder="Select"
                                                        // value={item.timeSlotEntityManualkey}
                                                        style={{ display: 'grid', alignContent: 'center', }}
                                                        onChange={(divisions) => this.props.UpdateTimeSlotsDataManual(divisions, 'venuePreferenceTypeRefId', 'competitionTimeslotManual', timeIndex, mainId, id, index)}
                                                    >
                                                        {id == 4 && division.divisions && division.divisions.map((item) => (
                                                            < Option value={item.competitionMembershipProductDivision}> {item.divisionName}</Option>
                                                        ))

                                                        }
                                                    </Select >

                                                )}
                                            </Form.Item>

                                        }
                                        {id == 5 &&

                                            <Form.Item>
                                                {getFieldDecorator(
                                                    `timeSlotEntityGradeKey${index}${timeIndex}`,
                                                    {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: ValidationConstants.gradeField
                                                            }
                                                        ]
                                                    },
                                                )(
                                                    < Select
                                                        disabled={disabledStatus}
                                                        mode='multiple'
                                                        placeholder="Select"
                                                        style={{ display: 'grid', alignContent: 'center', }}
                                                        onChange={(divisions) => this.props.UpdateTimeSlotsDataManual(divisions, 'venuePreferenceTypeRefId', 'competitionTimeslotManual', timeIndex, mainId, id, index)}
                                                    >

                                                        {division.grades && division.grades.map((item, index) => (
                                                            < Option key={"grades" + index} value={item.competitionDivisionGradeId}> {item.gradeName}</Option>
                                                        ))
                                                        }
                                                    </Select >
                                                )}
                                            </Form.Item>
                                        }
                                    </div>
                                }



                            </div>


                        )

                    }
                    )
                    }
                    <span className='input-heading-add-another' onClick={() => disabledStatus == false && this.addTimeManualPerVenue(index, null, "addTimeSlotManual")} > + {AppConstants.add_TimeSlot}</span>
                </div>
                {data.length > 1 &&
                    <div className="col-sm-2 delete-image-timeSlot-view" onClick={() => disabledStatus == false && this.addTimeManualPerVenue(index, item, "competitionTimeslotManualdelete")}>
                        <a className="transfer-image-view">
                            <span className="user-remove-btn">
                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                            </span>
                            <span className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                        </a>
                    </div>
                }

            </div >
        )

    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        let isPublished = this.state.competitionStatus == 1 ? true : false
        return (
            <div className="footer-view">
                <div className="row">
                    <div className="col-sm">
                        <div className="reg-add-save-button">
                            <NavLink to="/competitionPartTeamGradeCalculate">
                                <Button className="cancelBtnWidth" type="cancel-button"  >{AppConstants.back}</Button>
                            </NavLink>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">

                            <Tooltip
                                style={{ height: '100%' }}
                                onMouseEnter={() =>
                                    this.setState({
                                        tooltipVisibleDelete: isPublished ? true : false,
                                    })
                                }
                                onMouseLeave={() =>
                                    this.setState({ tooltipVisibleDelete: false })
                                }
                                visible={this.state.tooltipVisibleDelete}
                                title={AppConstants.statusPublishHover}
                            >
                                <Button id={AppUniqueId.timeSlotSaveBtn} disabled={isPublished} style={{ height: isPublished && "100%", borderRadius: isPublished && 10, width: isPublished && "inherit" }} className="publish-button save-draft-text" htmlType="submit" type="primary">{AppConstants.save}</Button>
                            </Tooltip>
                            <NavLink to="/competitionVenueTimesPrioritisation">
                                <Button className="publish-button" type="primary">{AppConstants.next}</Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"6"} />
                <Layout>

                    <Form
                        onSubmit={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        {this.headerView()}
                        <Content>
                            {this.dropdownView(getFieldDecorator)}
                            <Loader visible={this.props.competitionTimeSlots.onGetTimeSlotLoad} />
                            <div className="formView">
                                {this.contentView(getFieldDecorator)}
                            </div>
                        </Content>
                        <Footer>
                            {this.footerView(getFieldDecorator)}
                        </Footer>
                    </Form>
                </Layout>

            </div>

        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getYearAndCompetitionOwnAction,
        getCompetitionWithTimeSlots,
        addRemoveTimeSlot,
        UpdateTimeSlotsData,
        timeSlotInit,
        UpdateTimeSlotsDataManual,
        getVenuesTypeAction,
        addTimeSlotDataPost,
        clearYearCompetitionAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        appState: state.AppState,
        competitionTimeSlots: state.CompetitionTimeSlots,
        commonReducerState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(CompetitionCourtAndTimesAssign));
