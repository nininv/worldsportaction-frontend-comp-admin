import React, { Component } from "react";
import { Layout, Breadcrumb, Select, Button, Form } from 'antd';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { NavLink } from 'react-router-dom';
import loadjs from 'loadjs';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import CompetitionSwappable from '../../customComponents/quickCompetitionComponent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getVenuesTypeAction,
    searchVenueList,
    clearFilter,
    getYearAndCompetitionOwnAction
} from "../../store/actions/appAction";
import InputWithHead from "../../customComponents/InputWithHead";
import ValidationConstants from "../../themes/validationConstant";
import {
    updateQuickCompetitionData
} from "../../store/actions/competitionModuleAction/competitionQuickAction"


const { Header, Footer, Content } = Layout;
const { Option } = Select;

class CompetitionQuickCompetition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019",
            competition: "2019winter",
            venue: "abbott",
            firstTimeCompId: ''
        }
        this.props.getVenuesTypeAction()
        this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, 1, 'own_competition')
    }


    componentDidMount() {
        loadjs('assets/js/custom.js');
    }

    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };
    onCompetitionChange(competitionId) {
        this.setState({ firstTimeCompId: competitionId });
    }

    ///////view for breadcrumb
    headerView = () => {
        return (<div className="fluid-width">
            <Header className="comp-draws-header-view mt-5" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">
                                {AppConstants.quickCompetition1}
                                {/* <span className="breadcrumb-add"> (1/3)</span> */}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                </div>
            </Header >
            <div className="row" >
                <div className="col-sm-2 pt-0">
                    <span className="input-heading-add-another pt-0">+{AppConstants.addNew}</span>

                </div>
            </div>
            <div className="row" >
                <div className="col-sm-3">
                    <div
                        style={{
                            width: "fit-content",
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 50
                        }}
                    >
                        <span className="year-select-heading">{AppConstants.competition}:</span>
                        <Select
                            name={'competition'}
                            style={{ minWidth: 160 }}
                            className="year-select"
                            onChange={competitionId =>
                                this.onCompetitionChange(competitionId)
                            }
                            value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
                        >
                            {this.props.appState.own_CompetitionArr.map(item => {
                                return (
                                    <Option
                                        key={'competition' + item.competitionId}
                                        value={item.competitionId}
                                    >
                                        {item.competitionName}
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                </div>
            </div>
        </div>
        )
    }
    //On selection of venue
    onSelectValues(item, detailsData) {
        this.props.updateQuickCompetitionData(item, "venues")
        this.props.clearFilter()
    }

    // for search venue
    handleSearch = (value, data) => {
        const filteredData = data.filter(memo => {
            return memo.name.toLowerCase().indexOf(value.toLowerCase()) > -1
        })
        this.props.searchVenueList(filteredData)
    };

    ////////form content view
    contentView = (getFieldDecorator) => {
        let appState = this.props.appState
        let quickCompetitionState = this.props.quickCompetitionState

        return (
            <div className="comp-draw-content-view mt-0 ">
                <div className="row comp-draw-list-top-head">
                    <div className="col-sm-3">
                        <span className='form-heading'>{AppConstants.winter2019}</span>
                        <div className="row"  >
                            <div className="col-sm" style={{ marginTop: 15 }} >
                                <InputWithHead required={"required-field pb-0 "} heading={AppConstants.venue} />
                                {/* <Form.Item  >
                                    {getFieldDecorator('selectedVenues', { rules: [{ required: true, message: ValidationConstants.pleaseSelectvenue }] })( */}
                                <Select
                                    mode="multiple"
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    onChange={venueSelection => {
                                        this.onSelectValues(venueSelection, quickCompetitionState.selectedVenues)

                                    }}

                                    value={quickCompetitionState.selectedVenues}
                                    placeholder={AppConstants.selectVenue}
                                    filterOption={false}
                                    onSearch={(value) => { this.handleSearch(value, appState.mainVenueList) }}
                                >
                                    {appState.venueList.length > 0 && appState.venueList.map((item) => {
                                        return (
                                            <Option
                                                key={item.id}
                                                value={item.id}>
                                                {item.name}</Option>
                                        )
                                    })}
                                </Select>
                                {/* )} */}
                                {/* </Form.Item> */}
                            </div>

                            {/* <div className="col-sm" >
                                <div style={{
                                    width: "100%", display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center", marginRight: 50,
                                }} >
                                    <span className='year-select-heading'>{AppConstants.round}:</span>
                                    <Select
                                        className="year-select"
                                        style={{ minWidth: 100, maxWidth: 130 }}
                                        onChange={(round) => this.setState({ round })}
                                        value={this.state.round}
                                    >
                                        {this.state.roundsArray.map(item => {
                                            return (
                                                <Option key={item.id} value={item.id}>{item.value}</Option>
                                            );
                                        })}
                                    </Select>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div className="col-sm-9 comp-draw-edit-btn-view" >
                        <div className="row">
                            <div className="col-sm mt-1">
                                <NavLink to="/competitionCourtAndTimesAssign">

                                    <Button className="open-reg-button" type="primary">+ {AppConstants.add_TimeSlot}</Button>
                                </NavLink>
                                {/* <div className="col-sm mt-1"> */}

                                {/* </div> */}

                            </div>
                            <div className="col-sm mt-1">
                                <Button className="open-reg-button" type="primary">+ {AppConstants.addDivisionsAndGrades}</Button>
                            </div>

                        </div>

                    </div>
                </div>

                {this.dragableView()}
            </div>
        )
    }


    dragableView = () => {
        var dateMargin = 25;
        var dayMargin = 25;
        let topMargin = 0;
        let getStaticDrawsData = [{
            venueCourtNumber: 1, venueCourtName: "1", venueShortName: "Lots", slotsArray: [{
                drawsId: 12,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "3B",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#25ab85',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: 13,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: "11A",
                awayTeamId: null,
                homeTeamName: "11A",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: 'pink',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: 25,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "15A",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: 'blue',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: 14,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "16A",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: 'orange',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }]
        }, {
            venueCourtNumber: 1, venueCourtName: "1", venueShortName: "Lots", slotsArray: [{
                drawsId: 12,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "17A",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#282828',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: 26,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "26L",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#875241',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: 27,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "25T",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#279792',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }]
        }, {
            venueCourtNumber: 1, venueCourtName: "1", venueShortName: "Lots", slotsArray: [{
                drawsId: 17,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "17D",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: 'red',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: 59,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "25A",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#859642',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: 84,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "66A",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#628549',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: 65,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "62F",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#279792',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }]
        }, {
            venueCourtNumber: 1, venueCourtName: "1", venueShortName: "Lots", slotsArray: [{
                drawsId: 20,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "25S",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: 'green',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: 168,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: "A",
                awayTeamId: null,
                homeTeamName: "PG8",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: 'red',
                teamArray: [
                    {
                        teamName: "A",
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }]
        },
        ]
        let dateArray = [{ time: "09:00" }, { time: "10:00" }, { time: "11:00" }, { time: "12:00" }]
        return (
            <div className="draggable-wrap draw-data-table">
                <div className="scroll-bar pb-4">
                    <div className="table-head-wrap">
                        {/* Times list */}
                        <div className="tablehead-row-fixture ">
                            <div className="sr-no empty-bx"></div>
                            {dateArray.map((date, index) => {
                                if (index !== 0) {
                                    dayMargin += 75;
                                }
                                // if (index == 0) {
                                //     dayMargin = 30;
                                // }
                                return (
                                    <span style={{ left: dayMargin }}>{date.time}</span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="main-canvas Draws">
                    {getStaticDrawsData.map((courtData, index) => {
                        let leftMargin = 25;
                        if (index !== 0) {
                            topMargin += 50;
                        }
                        return (
                            <div>
                                <div className="fixture-sr-no"> {index + 1}</div>
                                {courtData.slotsArray.map((slotObject, slotIndex) => {
                                    if (slotIndex !== 0) {
                                        leftMargin += 75;
                                    }
                                    // if (slotIndex == 0) {
                                    //     leftMargin = 40;
                                    // }
                                    console.log(slotObject)
                                    return (
                                        <div>
                                            <span
                                                style={{ left: leftMargin, top: topMargin }}
                                                className={
                                                    'fixtureBorder'
                                                }
                                            ></span>
                                            <div
                                                className={
                                                    'fixtureBox'
                                                }
                                                style={{
                                                    backgroundColor: slotObject.colorCode,
                                                    left: leftMargin, top: topMargin, overflow: "hidden",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                <CompetitionSwappable
                                                    id={index.toString() + ':' + slotIndex.toString()}
                                                    content={1}
                                                    swappable={true}
                                                    onSwap={(source, target) =>
                                                        console.log(source, target)
                                                    }
                                                >
                                                    {slotObject.drawsId != null ? (
                                                        <span>
                                                            {slotObject.homeTeamName}
                                                        </span>
                                                    ) : (
                                                            <span>N/A</span>
                                                        )}
                                                </CompetitionSwappable>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

            </div >
        );
    };
    footerView = () => {
        return (
            <div className="fluid-width" >
                {/* <div className="footer-view"> */}
                <div className="row" >
                    <div className="col-sm-3">
                        <div className="reg-add-save-button">
                            <Button type="cancel-button">{AppConstants.back}</Button>
                        </div>
                    </div>
                    <div className="col-sm" >
                        <div className="comp-buttons-view">
                            <Button className="save-draft-text" type="save-draft-text">{AppConstants.saveAsDraft}</Button>
                            <NavLink to="/quickCompetitionInvitations">
                                <Button className="open-reg-button" type="primary">{AppConstants.addTeams}</Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>
        )
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"2"} />
                <Layout className="comp-dash-table-view">
                    <Form
                        onSubmit={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        {/* <div className="comp-draw-head-content-view"> */}
                        {this.headerView()}
                        <Content>
                            {this.contentView(getFieldDecorator)}
                        </Content>
                        {/* </div> */}
                        <Footer>
                            {this.footerView()}
                        </Footer>
                    </Form>
                </Layout>

            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getVenuesTypeAction,
        searchVenueList,
        clearFilter,
        updateQuickCompetitionData,
        getYearAndCompetitionOwnAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        appState: state.AppState,
        quickCompetitionState: state.QuickCompetitionState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(CompetitionQuickCompetition));
