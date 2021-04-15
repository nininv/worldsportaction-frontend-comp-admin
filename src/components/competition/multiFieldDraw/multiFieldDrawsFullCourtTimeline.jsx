import {
    DatePicker, Layout,
    Menu,
    message,
    Modal, Select
} from "antd";
import moment from 'moment';
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import AppConstants from "themes/appConstants";
import {
    getDraws_round, getGlobalYear,

    getOwn_competition
} from "util/sessionStorage";
import DrawConstant from 'themes/drawConstant';
import { getDate, getNextEventForSwap, sortSlot,getDiffBetweenStartAndEnd } from "util/drawUtil";
import Swappable from "customComponents/SwappableComponentTimeline";
import AppImages from "themes/appImages";
const { SubMenu } = Menu;
const { confirm } = Modal;

const ONE_MIN_WIDTH = 2;
const ONE_HOUR_IN_MIN = 60;



class MultiFieldDrawsFullCourtTimeline extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }

    componentDidUpdate(nextProps) {

    }

    componentDidMount() {

    }
    checkCurrentSwapObjects=(source, target, drawData)=> {
        const sourceIndexArray = source.split(':');
        const targetIndexArray = target.split(':');
        const sourceXIndex = sourceIndexArray[0];
        const sourceYIndex = sourceIndexArray[1];
        const targetXIndex = targetIndexArray[0];
        const targetYIndex = targetIndexArray[1];

        const sourceObejct = drawData[sourceXIndex].slotsArray[sourceYIndex];
        const targetObject = drawData[targetXIndex].slotsArray[targetYIndex];

        const sourceDraws = drawData[sourceXIndex];
        const targetDraws = drawData[targetXIndex];

        // for end time calculations
        const sourceObejctDate = getDate(sourceObejct.matchDate);
        const diffTimeSource = getDiffBetweenStartAndEnd(sourceObejct);

        const targetObjectDate = getDate(targetObject.matchDate);
        const diffTimeTarget = getDiffBetweenStartAndEnd(targetObject);

        // define next slots with data for the swappable objects days
        const nextSource = getNextEventForSwap(drawData[sourceXIndex].slotsArray, sourceObejctDate, sourceYIndex);
        const nextTarget = getNextEventForSwap(drawData[targetXIndex].slotsArray, targetObjectDate, targetYIndex);

        // define if the swappable event finishes before next event or end of the working day
        const targetObjectRestrictionEnd = this.props.getDayTimeRestrictions(targetDraws, targetObjectDate).endTime;
        const sourceObjectRestrictionEnd = this.props.getDayTimeRestrictions(sourceDraws, sourceObejctDate).endTime;

        const sourceEndNew = moment(targetObject.matchDate).add(diffTimeSource, 'minutes');
        const startTimeNextTarget = nextTarget ? moment(nextTarget.matchDate) : targetObjectRestrictionEnd;
        const isStartNextSourceLater = startTimeNextTarget.isSameOrAfter(sourceEndNew);

        const targetEndNew = moment(sourceObejct.matchDate).add(diffTimeTarget, 'minutes');
        const startTimeNextSource = nextSource ? moment(nextSource.matchDate) : sourceObjectRestrictionEnd;
        const isStartNextTargetLater = startTimeNextSource.isSameOrAfter(targetEndNew);

        // for case when next events starts before end of swappable ones
        if (!isStartNextTargetLater || !isStartNextSourceLater) {
            return false;
        }
        return true;
    }

    onSwap(source, target, drawData, round_Id) {
        this.props.setDraggingState({
            isDragging: false,
            tooltipSwappableTime: null
        });
        const sourceIndexArray = source.split(':');
        const targetIndexArray = target.split(':');
        const sourceXIndex = sourceIndexArray[0];
        const sourceYIndex = sourceIndexArray[1];
        const targetXIndex = targetIndexArray[0];
        const targetYIndex = targetIndexArray[1];
        if (sourceXIndex === targetXIndex && sourceYIndex === targetYIndex) {
            return;
        }

        const sourceObejct = drawData[sourceXIndex].slotsArray[sourceYIndex];
        const targetObject = drawData[targetXIndex].slotsArray[targetYIndex];

        // events end time calculations
        const diffTimeSource = getDiffBetweenStartAndEnd(sourceObejct);
        const newEndTimeSource = moment(targetObject.matchDate).add(diffTimeSource, 'minutes').format('HH:mm');

        const diffTimeTarget = getDiffBetweenStartAndEnd(targetObject);
        const newEndTimeTarget = moment(sourceObejct.matchDate).add(diffTimeTarget, 'minutes').format('HH:mm');

        if (sourceObejct.drawsId !== null && targetObject.drawsId !== null) {
            this.updateCompetitionDraws(
                sourceObejct,
                targetObject,
                sourceIndexArray,
                targetIndexArray,
                drawData,
                round_Id,
                newEndTimeSource,
                newEndTimeTarget
            );
        }
    }
    ///////update the competition draws on  swapping and hitting update Apis if both has value
    updateCompetitionDraws = (
        sourceObejct,
        targetObject,
        sourceIndexArray,
        targetIndexArray,
        drawData,
        round_Id,
        newEndTimeSource,
        newEndTimeTarget
    ) => {
        const key = this.props.firstTimeCompId === "-1" || this.props.filterDates ? "all" : "add";
        const customSourceObject = {
            drawsId: targetObject.drawsId,
            homeTeamId: sourceObejct.homeTeamId,
            awayTeamId: sourceObejct.awayTeamId,
            matchDate: moment(targetObject.matchDate).format('YYYY-MM-DD HH:mm'),
            startTime: targetObject.startTime,
            endTime: newEndTimeSource,
            venueCourtId: targetObject.venueCourtId,
            competitionDivisionGradeId: sourceObejct.competitionDivisionGradeId,
            isLocked: 1,
        };
        const customTargetObject = {
            drawsId: sourceObejct.drawsId,
            homeTeamId: targetObject.homeTeamId,
            awayTeamId: targetObject.awayTeamId,
            matchDate: moment(sourceObejct.matchDate).format('YYYY-MM-DD HH:mm'),
            startTime: sourceObejct.startTime,
            endTime: newEndTimeTarget,
            venueCourtId: sourceObejct.venueCourtId,
            competitionDivisionGradeId: targetObject.competitionDivisionGradeId,
            isLocked: 1,
        };


        this.updateEditDrawArray(customSourceObject);
        this.updateEditDrawArray(customTargetObject);

        const sourceXIndex = sourceIndexArray[0];
        const sourceYIndex = sourceIndexArray[1];
        const targetXIndex = targetIndexArray[0];
        const targetYIndex = targetIndexArray[1];
             
        let newSourceObj={...sourceObejct, ...customTargetObject};
        Object.keys(DrawConstant.switchDrawNameFields).forEach(key => newSourceObj[key] = targetObject[key]);         
        
        let newTargetObj={...targetObject, ...customSourceObject};
        Object.keys(DrawConstant.switchDrawNameFields).forEach(key => newTargetObj[key] = sourceObejct[key]); 

        drawData[sourceXIndex].slotsArray[sourceYIndex]=newSourceObj;
        drawData[targetXIndex].slotsArray[targetYIndex]=newTargetObj;
        this.props.updateCourtTimingsDrawsDragSuccessAction();
       
    };
    updateEditDrawArray(draw) {
        const editdraw = this.props.editedDraw;
        const drawExistsIndex = editdraw.draws.findIndex(d => d.drawsId == draw.drawsId);
        if (drawExistsIndex > -1) {
            editdraw.draws[drawExistsIndex] = { ...editdraw.draws[drawExistsIndex], ...draw };
        } else {
            editdraw.draws.push(draw);
        }
    }

   
    render() {
        let dateItem = this.props.dateItem;
        let disabledStatus = this.props.competitionStatus == 1;
        let dayMargin = 25;
        
        let topMargin = 2;
        const date = [];

        const { isFilterSchedule, isAxisInverted } = this.props;

        const { dateNewArray } = dateItem;

        dateNewArray.forEach(item => {
            const dateNew = getDate(item.date);

            if (dateNew !== date[date.length - 1]) {
                date.push(dateNew);
            }
        });

        const dayBgAvailable = this.props.defineDayBg();

        return (
            <>
                <div
                    className="scroll-bar"
                    style={{
                        width: 'fit-content',
                    }}
                >
                    {/* Horizontal head */}
                    {isAxisInverted ?
                        this.props.courtHorizontalHeadView(dateItem)
                        :
                        <div className="table-head-wrap">
                            {this.props.dayHeadView(date, dateNewArray, dayMargin)}
                        </div>
                    }

                </div>
                <div
                    className={`main-canvas Draws ${isAxisInverted ? 'd-flex' : ''}`}
                    id="draws-field"
                    onDragOver={e => {
                        if (!disabledStatus) this.props.drawsFieldMove(e)
                    }}
                    onMouseMove={e => this.props.drawsFieldMove(e)}
                    onDragLeave={this.props.addDisplayNoneTooltip}
                    onMouseLeave={this.props.addDisplayNoneTooltip}
                    onMouseUp={this.props.drawsFieldUp}
                    onTouchEnd={this.props.drawsFieldUp}
                >

                    {isAxisInverted && this.props.dayHeadView(date, dateNewArray, dayMargin)}

                    <div
                        id="draggableTooltip"
                        className="unavailable-draws"
                        // don't change this inline style, tooltip won't work !!
                        style={{
                            display: 'none'
                        }}
                    />
                    {dateItem.draws && dateItem.draws.map((courtData, index) => {
                        if (index !== 0) {
                            topMargin += 70;
                        }

                        let prevDaysWidth = 0;
                        let diffDayScheduleTime = 0;

                        return (
                            <div
                                key={"court" + index}
                                style={{
                                    display: 'flex',
                                    flexShrink: 0,
                                    alignItems: 'center',
                                    ...(isAxisInverted ? {
                                        position: 'relative',
                                        left: 15,
                                        width: 70,
                                    } : {
                                        height: 70
                                    })
                                }}
                            >
                                {!isAxisInverted &&
                                <div
                                    className="venueCourt-tex-div text-center ml-n20 d-flex justify-content-center align-items-center"
                                    style={{
                                        width: 95,
                                        height: 48,
                                    }}
                                >
                                        <span className="venueCourt-text">
                                            {courtData.venueShortName + '-' + courtData.venueCourtNumber}
                                        </span>
                                </div>
                                }

                                {date.map((fieldItemDate, fieldItemDateIndex) => {
                                    // for check the schedule of the day
                                    const { startDayTime, endDayTime } = this.props.getStartAndEndDayTime(fieldItemDate, dateNewArray);

                                    const startDayDate = moment(fieldItemDate + startDayTime);
                                    const endDayDate = moment(fieldItemDate + endDayTime);

                                    const dateNow = moment();
                                    const isDayInPast = dateNow.isAfter(endDayDate);

                                    if (fieldItemDateIndex !== 0) {
                                        prevDaysWidth += diffDayScheduleTime;
                                    }
                                    if (fieldItemDateIndex === 0) {
                                        prevDaysWidth = 0;
                                    }

                                    if (fieldItemDateIndex === date.length - 1) {
                                        // for the last day in schedule width and right dashed line in the end of the day
                                        diffDayScheduleTime = endDayDate.diff(startDayDate, 'minutes') * ONE_MIN_WIDTH + 1;
                                    } else if (fieldItemDateIndex === date.length - 1 && isFilterSchedule) {
                                        diffDayScheduleTime = (endDayDate.diff(startDayDate, 'minutes') - ONE_HOUR_IN_MIN) * ONE_MIN_WIDTH;
                                    } else {
                                        diffDayScheduleTime = endDayDate.diff(startDayDate, 'minutes') * ONE_MIN_WIDTH;
                                    }

                                    const timeRestrictionsSchedule = this.props.getDayTimeRestrictions(courtData, fieldItemDate);

                                    const unavailableWidth = this.props.checkUnavailableTimeWidth(timeRestrictionsSchedule, startDayDate, endDayDate);

                                    // render for the whole unavailable day for court based on venue schedule
                                    if (!timeRestrictionsSchedule) {
                                        return this.props.unavailableDayView(courtData, fieldItemDateIndex, diffDayScheduleTime, prevDaysWidth,48);
                                    }

                                    const dayBg = timeRestrictionsSchedule.isUnavailable ? {
                                        background: `repeating-linear-gradient( -45deg, #ebf0f3, #ebf0f3 ${ONE_HOUR_IN_MIN / 5}px, #d9d9d9 ${ONE_HOUR_IN_MIN / 5}px, #d9d9d9 ${ONE_HOUR_IN_MIN / 5 * ONE_MIN_WIDTH}px )`,
                                    } : dayBgAvailable;

                                    return (
                                        <div
                                            key={"slot" + fieldItemDateIndex}
                                            className={isAxisInverted ? 'position-absolute' : 'position-relative'}
                                            style={{
                                                width: `calc(100%) - ${prevDaysWidth}`,
                                                height: '100%',
                                                left: isAxisInverted ? '50%' : 75,
                                            }}
                                        >
                                            <div
                                                id={courtData.venueCourtId + ':' + fieldItemDateIndex}
                                                className={`box-draws white-bg-timeline day-box ${isAxisInverted ? 'position-absolute' : ''}`}
                                                style={{
                                                    minWidth: 'unset',
                                                    overflow: 'visible',
                                                    whiteSpace: 'nowrap',
                                                    cursor: disabledStatus && "no-drop",
                                                    borderRadius: '0px',
                                                    left: 0,
                                                    ...dayBg,
                                                    ...(isAxisInverted ?
                                                        {
                                                            top: prevDaysWidth,
                                                            width: 48,
                                                            height: diffDayScheduleTime,
                                                            transform: 'translateX(-50%)',
                                                        } : {
                                                            top: '50%',
                                                            width: diffDayScheduleTime,
                                                            height: 48,
                                                            transform: 'translateY(-50%)',
                                                        })
                                                }}
                                                onDragOver={e => {
                                                    if (!timeRestrictionsSchedule.isUnavailable && !isDayInPast && !disabledStatus) {
                                                        this.props.dayLineDragMove(e, startDayDate, courtData.slotsArray, timeRestrictionsSchedule)
                                                    }
                                                }}
                                                onDragEnd={e => {
                                                    if (!timeRestrictionsSchedule.isUnavailable && !isDayInPast && !disabledStatus)
                                                        this.props.handleDragEnd(e)
                                                }}
                                                onTouchMove={e => {
                                                    if (!timeRestrictionsSchedule.isUnavailable && !isDayInPast && !disabledStatus) {
                                                        this.props.dayLineDragMove(e, startDayDate, courtData.slotsArray, timeRestrictionsSchedule)
                                                    }
                                                }}
                                                onTouchEnd={e => {
                                                    if (!timeRestrictionsSchedule.isUnavailable && !isDayInPast && !disabledStatus)
                                                        this.props.handleDragEnd(e)
                                                }}
                                            >
                                                {timeRestrictionsSchedule.isUnavailable && this.props.unavailableTextView()}

                                                {unavailableWidth.map((width, widthIndex) => {
                                                    if (width) {
                                                        return (
                                                            <div key={"unavailable" + widthIndex}
                                                                className="box-draws unavailable-draws position-absolute align-items-center"
                                                                style={{
                                                                    background: `repeating-linear-gradient( -45deg, #ebf0f3, #ebf0f3 ${ONE_HOUR_IN_MIN / 5}px, #d9d9d9 ${ONE_HOUR_IN_MIN / 5}px, #d9d9d9 ${ONE_HOUR_IN_MIN / 5 * ONE_MIN_WIDTH}px )`,
                                                                    cursor: 'not-allowed',
                                                                    ...(isAxisInverted ?
                                                                        {
                                                                            bottom: widthIndex ? 0 : 'auto',
                                                                            top: widthIndex ? 'auto' : 0,
                                                                            left: 0,
                                                                            height: width,
                                                                            minHeight: width,
                                                                            width: '100%',
                                                                        } : {
                                                                            right: widthIndex ? 0 : 'auto',
                                                                            left: widthIndex ? 'auto' : 0,
                                                                            top: 0,
                                                                            width,
                                                                            minWidth: width,
                                                                            height: '100%',
                                                                        })
                                                                }}
                                                            >
                                                                {this.props.unavailableTextView()}
                                                            </div>
                                                        )
                                                    }
                                                })}
                                                {courtData.slotsArray.map((slotObject, slotIndex) => {
                                                    if (getDate(slotObject.matchDate) === fieldItemDate && slotObject.drawsId) {
                                                        // for left margin the event start inside the day
                                                        const startWorkingDayTime = moment(fieldItemDate + startDayTime);
                                                        const startTimeEvent = moment(slotObject.matchDate);

                                                        const diffTimeStartEvent = startTimeEvent.diff(startWorkingDayTime, 'minutes') * ONE_MIN_WIDTH;
                                                        // for width of the event
                                                        const endTimeEvent = moment(fieldItemDate + slotObject.endTime);
                                                        const diffTimeEventDuration = endTimeEvent.diff(startTimeEvent, 'minutes') * ONE_MIN_WIDTH;
                                                        return (
                                                            <div
                                                                key={"slot" + slotIndex}
                                                                style={{
                                                                    position: 'absolute',
                                                                    ...(isAxisInverted ? {
                                                                        left: 0,
                                                                        top: diffTimeStartEvent,
                                                                    } : {
                                                                        left: diffTimeStartEvent,
                                                                        top: 0,
                                                                    })
                                                                }}
                                                            >
                                                                <div
                                                                    id={slotObject.drawsId}
                                                                    onMouseDown={this.props.slotObjectMouseDown}
                                                                    onTouchStart={this.props.slotObjectMouseDown}
                                                                    onDragOver={() => this.props.slotObjectDragOver(slotObject)}
                                                                    onTouchMove={() => this.props.slotObjectDragOver(slotObject)}
                                                                    onDragLeave={() => {
                                                                        this.props.setDraggingState({ tooltipSwappableTime: null })
                                                                    }}
                                                                    onMouseEnter={e => this.props.slotObjectMouseEnter(e, slotObject)}
                                                                    onMouseLeave={this.props.slotObjectMouseLeave}
                                                                    className={'box-draws purple-bg'}
                                                                    style={{
                                                                        backgroundColor: this.props.checkColor(slotObject),
                                                                        overflow: 'hidden',
                                                                        whiteSpace: 'nowrap',
                                                                        cursor: timeRestrictionsSchedule.isUnavailable || isDayInPast ? 'not-allowed' : disabledStatus && "no-drop",
                                                                        opacity: isDayInPast ? 0.7 : 1,
                                                                        ...(isAxisInverted ? {
                                                                            width: 48,
                                                                            minWidth: 48,
                                                                            height: diffTimeEventDuration,
                                                                        } : {
                                                                            width: diffTimeEventDuration,
                                                                            minWidth: diffTimeEventDuration,
                                                                            height: 48,
                                                                        })
                                                                    }}
                                                                >
                                                                    {this.props.firstTimeCompId == "-1" || this.props.filterDates ? (
                                                                        <Swappable
                                                                            id={
                                                                                index.toString() +
                                                                                ':' +
                                                                                slotIndex.toString()
                                                                                +
                                                                                ':' +
                                                                                "1"
                                                                            }
                                                                            content={1}
                                                                            swappable={timeRestrictionsSchedule.isUnavailable || isDayInPast || disabledStatus
                                                                                ? false
                                                                                : this.props.checkSwap(slotObject)
                                                                            }
                                                                            onSwap={(source, target) =>
                                                                                this.onSwap(
                                                                                    source,
                                                                                    target,
                                                                                    dateItem.draws,
                                                                                    dateItem.roundId,
                                                                                )
                                                                            }
                                                                            isCurrentSwappable={(source, target) =>
                                                                                isDayInPast || disabledStatus
                                                                                    ? false
                                                                                    : this.checkCurrentSwapObjects(
                                                                                    source,
                                                                                    target,
                                                                                    dateItem.draws,
                                                                                    )
                                                                            }
                                                                        >
                                                                            {this.props.isDivisionNameShow ? (
                                                                                <span className="text-overflow">
                                                                                    {slotObject.divisionName + "-" + slotObject.gradeName}
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-overflow">
                                                                                        {slotObject.homeTeamName} <br />
                                                                                    {slotObject.awayTeamName}
                                                                                    </span>
                                                                            )
                                                                            }
                                                                        </Swappable>
                                                                    ) : (
                                                                        <Swappable
                                                                            id={
                                                                                index.toString() +
                                                                                ':' +
                                                                                slotIndex.toString()
                                                                                +
                                                                                ':' +
                                                                                dateItem.roundId.toString()
                                                                            }
                                                                            content={1}
                                                                            swappable={timeRestrictionsSchedule.isUnavailable || isDayInPast || disabledStatus
                                                                                ? false
                                                                                : this.props.checkSwap(slotObject)
                                                                            }
                                                                            onSwap={(source, target) =>
                                                                                this.onSwap(
                                                                                    source,
                                                                                    target,
                                                                                    dateItem.draws,
                                                                                    dateItem.roundId,
                                                                                )
                                                                            }
                                                                            isCurrentSwappable={(source, target) =>
                                                                                isDayInPast || disabledStatus
                                                                                    ? false
                                                                                    : this.checkCurrentSwapObjects(
                                                                                    source,
                                                                                    target,
                                                                                    dateItem.draws,
                                                                                    )
                                                                            }
                                                                        >
                                                                            {this.props.isDivisionNameShow ? (
                                                                                <span className="text-overflow">
                                                                                        {slotObject.divisionName + "-" + slotObject.gradeName}
                                                                                    </span>
                                                                            ) : (
                                                                                <span className="text-overflow">
                                                                                            {slotObject.homeTeamName} <br />
                                                                                    {slotObject.awayTeamName}
                                                                                        </span>
                                                                            )
                                                                            }
                                                                        </Swappable>
                                                                    )}
                                                                </div>

                                                                {slotObject.drawsId !== null && (
                                                                    <div
                                                                        // className="box-exception"
                                                                        className="position-absolute"
                                                                        style={{
                                                                            overflow: 'hidden',
                                                                            whiteSpace: 'nowrap',
                                                                            minWidth: 16,
                                                                            ...(isAxisInverted ? {
                                                                                top: '50%',
                                                                                left: 48,
                                                                                transform: 'translateY(-50%)',
                                                                            } : {
                                                                                top: 48,
                                                                                left: '50%',
                                                                                transform: 'translateX(-50%)',
                                                                            })
                                                                        }}
                                                                    >
                                                                        {!timeRestrictionsSchedule.isUnavailable && !isDayInPast && <Menu
                                                                            className="action-triple-dot-draws"
                                                                            theme="light"
                                                                            mode="horizontal"
                                                                            style={{
                                                                                lineHeight: '16px',
                                                                                borderBottom: 0,
                                                                                cursor: disabledStatus && "no-drop",
                                                                            }}
                                                                        >
                                                                            <SubMenu
                                                                                disabled={disabledStatus}
                                                                                className="m-0 d-flex justify-content-center"
                                                                                key="sub1"
                                                                                title={
                                                                                    (
                                                                                        <div>
                                                                                            {slotObject.isLocked == 1 ? (
                                                                                                <img
                                                                                                    className="dot-image"
                                                                                                    src={AppImages.drawsLock}
                                                                                                    alt=""
                                                                                                    width="16"
                                                                                                    height="10"
                                                                                                />

                                                                                            ) : (
                                                                                                <img
                                                                                                    className="dot-image"
                                                                                                    src={AppImages.moreTripleDot}
                                                                                                    alt=""
                                                                                                    width="16"
                                                                                                    height="10"
                                                                                                    style={{
                                                                                                        transform: isAxisInverted ? 'rotate(-90deg)' : 'none'
                                                                                                    }}
                                                                                                />
                                                                                            )}
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            >
                                                                                {slotObject.isLocked == 1 && (
                                                                                    <Menu.Item
                                                                                        key="1"
                                                                                        onClick={() => this.props.firstTimeCompId == "-1" || this.props.filterDates
                                                                                            ? this.props.unlockDraws(
                                                                                                slotObject.drawsId,
                                                                                                "1",
                                                                                                courtData.venueCourtId
                                                                                            )
                                                                                            : this.props.unlockDraws(
                                                                                                slotObject.drawsId,
                                                                                                dateItem.roundId,
                                                                                                courtData.venueCourtId
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <div className="d-flex">
                                                                                            <span>Unlock</span>
                                                                                        </div>
                                                                                    </Menu.Item>
                                                                                )}
                                                                                <Menu.Item key="2">
                                                                                    <NavLink
                                                                                        to={{
                                                                                            pathname: `/competitionException`,
                                                                                            state: {
                                                                                                drawsObj: slotObject,
                                                                                                yearRefId: this.props.yearRefId,
                                                                                                competitionId: this.props.firstTimeCompId,
                                                                                                organisationId: this.props.organisationId,
                                                                                            },
                                                                                        }}
                                                                                    >
                                                                                        <span>Exception</span>
                                                                                    </NavLink>
                                                                                </Menu.Item>
                                                                            </SubMenu>
                                                                        </Menu>
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
       
    }

}


export default MultiFieldDrawsFullCourtTimeline;
