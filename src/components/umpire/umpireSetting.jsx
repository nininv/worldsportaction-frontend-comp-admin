import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Layout,
    Breadcrumb,
    Select,
    Button,
    Radio,
    Form,
    Checkbox,
    Modal,
    InputNumber
} from "antd";

import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import Loader from '../../customComponents/loader';
import DashboardLayout from "../../pages/dashboardLayout";

import AppConstants from "../../themes/appConstants";
import { isArrayNotEmpty } from "../../util/helpers";
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction";
import { getUmpireCompId, setUmpireCompId } from "../../util/sessionStorage";
import { 
    updateUmpireDataAction, 
    getUmpireAllocationSettings,
    saveUmpireAllocationSettings,
} from "../../store/actions/umpireAction/umpireSettingAction";
import { liveScoreGetDivision } from "../../store/actions/LiveScoreAction/liveScoreTeamAction";
import history from "util/history";

const { Header, Footer, Content } = Layout;
const { Option } = Select;

const initialUmpireAllocationGetData = {
    allDivisions: false,
    umpireAllocationTypeRefId: 242,
    activateReserves: false,
    activateCoaches: false,
    timeBetweenMatches: null,
    maxNumberOfMatches: null,
    divisions: [],
    hasUmpires: true,
};

const initialNoUmpireAllocationGetData = {
    allDivisions: false,
    divisions: [],
    hasUmpires: false,
};

class UmpireSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null,
            deleteModalVisible: false,
            allocationSettingsData: null,
            tempAllocationSettingsData: null,
            allDivisionVisible: false,
            sectionDataSelected: null,
            sectionDataToDeleteIndex: null,
            selectedDivisions: null,
            tempSelectedDivisions: null,
        };
    }

    componentDidMount() {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        this.setState({ loading: true });
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS');
        // this.props.umpireCompetitionListAction(null, null, null, 'USERS');
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading && !this.props.umpireCompetitionState.onLoad) {
                const compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : [];
                let firstComp = compList.length > 0 && compList[0].id;

                if (getUmpireCompId()) {
                    const compId = JSON.parse(getUmpireCompId());
                    firstComp = compId;
                } else {
                    setUmpireCompId(firstComp);
                }

                if (!!compList.length) {
                    this.props.liveScoreGetDivision(firstComp);
                }

                const compKey = compList.length > 0 && compList[0].competitionUniqueKey;
                this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey });
            }
        }

        if (!!this.state.selectedComp && prevState.selectedComp !== this.state.selectedComp) {
            this.props.getUmpireAllocationSettings(this.state.selectedComp);
        }

        if (this.props.umpireSettingState !== prevProps.umpireSettingState && !!this.props.umpireSettingState.allocationSettingsData
            && !this.props.umpireSettingState.onLoad) {
            const { umpireAllocationSettings, noUmpiresUmpireAllocationSetting } = this.props.umpireSettingState.allocationSettingsData;

            umpireAllocationSettings.forEach(item => {
                item.hasUmpires = true;
            });

            if (!!noUmpiresUmpireAllocationSetting) {
                noUmpiresUmpireAllocationSetting.hasUmpires = false;
            }

            const allocationSettingsData = !!noUmpiresUmpireAllocationSetting 
                ? [ ...umpireAllocationSettings, noUmpiresUmpireAllocationSetting]
                : [ ...umpireAllocationSettings ];

            const selectedDivisions = [];
    
            allocationSettingsData.forEach(item => {
                selectedDivisions.push(...item.divisions);
            });

            this.setState({ allocationSettingsData, selectedDivisions });
        }

        // if (this.state.allocationSettingsData !== prevProps.allocationSettingsData) {
        //     const { allocationSettingsData } = this.props.umpireSettingState;
        //     this.setState({ allocationSettingsData });
        // }
    }

    handleChangeWhoAssignsUmpires = (e, umpireAllocatorTypeRefId) => {
        const { allocationSettingsData } = this.state;
        const newSelectedDivisions = [];
        let newAllocationSettingsData;
        
        if (umpireAllocatorTypeRefId) {
            const filteredAllocationSettingsData = allocationSettingsData.filter(item => item.umpireAllocatorTypeRefId !== umpireAllocatorTypeRefId)
            const initialUmpireBoxData = JSON.parse(JSON.stringify(initialUmpireAllocationGetData));
            initialUmpireBoxData.umpireAllocatorTypeRefId = umpireAllocatorTypeRefId;

            if (e.target.checked) {
                newAllocationSettingsData = [ ...filteredAllocationSettingsData, initialUmpireBoxData ];
            } else {
                newAllocationSettingsData = [ ...filteredAllocationSettingsData ];
            }  
        } else {
            if (e.target.checked) {
                newAllocationSettingsData = [ ...this.state.allocationSettingsData, initialNoUmpireAllocationGetData ];
            } else {
                newAllocationSettingsData = [ ...this.state.allocationSettingsData.filter(item => !!item.umpireAllocatorTypeRefId) ];
            }  
        }

        newAllocationSettingsData.forEach(item => {
            newSelectedDivisions.push(...item.divisions);
        });

        this.setState({ allocationSettingsData: newAllocationSettingsData, selectedDivisions: newSelectedDivisions });
    }

    handleAddBox = umpireAllocatorTypeRefId => {
        const { allocationSettingsData } = this.state;
        
        const initialUmpireBoxData = JSON.parse(JSON.stringify(initialUmpireAllocationGetData));
        initialUmpireBoxData.umpireAllocatorTypeRefId = umpireAllocatorTypeRefId;

        this.setState({ allocationSettingsData: 
            [ ...allocationSettingsData, initialUmpireBoxData ]
        });
    }

    handleChangeSettingsState = (sectionDataIndex, key, value, sectionData) => {
        const { divisionList } = this.props.liveScoreTeamState;
        const { allocationSettingsData, selectedDivisions } = this.state;
        const allocationSettingsDataCopy = JSON.parse(JSON.stringify(allocationSettingsData));

        let newAllocationSettingsData;
        const newSelectedDivisions = [];

        const targetBoxData = allocationSettingsDataCopy
            .filter(item => item.umpireAllocatorTypeRefId === sectionData[0].umpireAllocatorTypeRefId);

        const otherBoxData = allocationSettingsDataCopy
            .filter(item => item.umpireAllocatorTypeRefId !== sectionData[0].umpireAllocatorTypeRefId);

        if (key === 'umpireAllocationTypeRefId' && (value !== 243 ||  value !== 245)) {
            targetBoxData[sectionDataIndex].timeBetweenMatches = null;
            targetBoxData[sectionDataIndex].maxNumberOfMatches = null;
        }

        if (key !== 'allDivisions') {
            if (key === 'divisions') {
                targetBoxData[sectionDataIndex].divisions = value.map(item =>
                    divisionList.find(divisionListItem => divisionListItem.id === item)
                );
            } else {
                targetBoxData[sectionDataIndex][key] = value;
            }

            newAllocationSettingsData = [...otherBoxData, ...targetBoxData ];
        } else {
            allocationSettingsDataCopy.forEach(item => {
                item.divisions = [];
                item.allDivisions = false;
            });

            if (!!value) {
                newSelectedDivisions.push( ...divisionList);
            }
    
            targetBoxData[sectionDataIndex].divisions = !!value ? divisionList : [];
            targetBoxData[sectionDataIndex].allDivisions = value;
    
            newAllocationSettingsData = [ targetBoxData[sectionDataIndex] ];
        } 

        
        if (key === 'divisions') {
            newAllocationSettingsData.forEach(item => {
                newSelectedDivisions.push(...item.divisions);
            });
        }

        if (key === 'allDivisions' && !value) {
            newAllocationSettingsData.forEach(item => {
                item.allDivisions = newSelectedDivisions.length === divisionList.length;
                item.divisions = [];
            });
        }

        if (key === 'allDivisions') {
            this.setState({ 
                allDivisionVisible: !!value,
                tempAllocationSettingsData: !!value ? newAllocationSettingsData : null,
                allocationSettingsData: !value ? newAllocationSettingsData : allocationSettingsData,
                tempSelectedDivisions: !!value ? newSelectedDivisions : [],
            });
        } else {
            const updatedSelectedDivisions = !!newSelectedDivisions.length ? newSelectedDivisions : [];

            if (key === 'divisions' && updatedSelectedDivisions.length < divisionList.length) {
                newAllocationSettingsData.forEach(item => {
                    item.allDivisions = false;
                });
            }

            if (key === 'divisions' && updatedSelectedDivisions.length === divisionList.length && value.length === divisionList.length) {
                newAllocationSettingsData
                    .filter(item => item.umpireAllocatorTypeRefId === sectionData[0].umpireAllocatorTypeRefId)[sectionDataIndex]
                    .allDivisions = true;
            }

            // console.log('newAllocationSettingsData', newAllocationSettingsData);
            // console.log('updatedSelectedDivisions', updatedSelectedDivisions);

            this.setState({ 
                allocationSettingsData: newAllocationSettingsData, 
                selectedDivisions: updatedSelectedDivisions
            });
        }
    }

    handleClickDeleteModal = (sectionDataIndex, sectionDataSelected) => {
        this.setState({ 
            deleteModalVisible: true, 
            sectionDataSelected,
            sectionDataToDeleteIndex: sectionDataIndex 
        });
    }

    handleDeleteModal = key => {
        if (key === "ok") {
            const { allocationSettingsData, sectionDataSelected, sectionDataToDeleteIndex } = this.state;
            const allocationSettingsDataCopy = [ ...allocationSettingsData ];;
            const sectionDataSelectedCopy = [ ...sectionDataSelected ];

            const { umpireAllocatorTypeRefId = null } = sectionDataSelected[0];

            const otherUmpireData = allocationSettingsDataCopy.filter(item => item.umpireAllocatorTypeRefId !== umpireAllocatorTypeRefId);
            sectionDataSelectedCopy.splice(sectionDataToDeleteIndex, 1);

            const newAllocationSettingsData = [...otherUmpireData, ...sectionDataSelectedCopy ];

            const newSelectedDivisions = [];

            newAllocationSettingsData.forEach(item => {
                newSelectedDivisions.push(...item.divisions);
            });

            this.setState({ allocationSettingsData: newAllocationSettingsData, selectedDivisions: newSelectedDivisions });
        }

        this.setState({ deleteModalVisible: false, sectionDataSelected: null, sectionDataToDeleteIndex: null });
    }

    handleAllDivisionModal = key => {
        if (key === "ok") {
            this.setState({ 
                allocationSettingsData: this.state.tempAllocationSettingsData,
                selectedDivisions: this.state.tempSelectedDivisions,
            });
        }

        this.setState({ 
            allDivisionVisible: false, 
            tempAllocationSettingsData: null,
            tempSelectedDivisions: null,
        });
    }

    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view d-flex bg-transparent align-items-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.umpireAllocationSettings}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    onChangeComp = (compID) => {
        this.props.liveScoreGetDivision(compID);
        setUmpireCompId(compID);

        this.setState({ selectedComp: compID });
    }

    dropdownView = () => {
        const competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="w-ft d-flex flex-row align-items-center">
                                <span className="year-select-heading">
                                    {AppConstants.competition}:
                                </span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 200 }}
                                    onChange={this.onChangeComp}
                                    value={this.state.selectedComp}
                                >
                                    {competition.map((item) => (
                                        <Option key={'competition_' + item.id} value={item.id}>{item.longName}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    boxSettingsView = (boxData, sectionDataIndex, sectionData) => {
        return (
            <div className="pt-0 mt-4">
                {this.boxSettingsRadioView(boxData, sectionDataIndex, sectionData)}

                {(boxData.umpireAllocationTypeRefId === 243 || boxData.umpireAllocationTypeRefId === 245) && 
                    <>
                        <span className='text-heading-large pt-5'>{AppConstants.timeBetweenMatches}</span>
                        <div className="d-flex align-items-center">
                            <InputNumber
                                value={+boxData.timeBetweenMatches}
                                onChange={(e) => this.handleChangeSettingsState(sectionDataIndex, 'timeBetweenMatches', e, sectionData)}
                                min={0}
                                precision={0}
                                style={{ width: 100 }}
                            />
                            <span className="ml-4">{AppConstants.minutes}</span>
                        </div>

                        <span className='text-heading-large pt-5'>{AppConstants.maxNumberOfMatches}</span>
                        <InputNumber 
                            value={+boxData.maxNumberOfMatches}
                            onChange={(e) => this.handleChangeSettingsState(sectionDataIndex, 'maxNumberOfMatches', e, sectionData)}
                            min={0}
                            precision={0}
                            style={{ width: 100 }}
                        />
                            
                    </>
                }

                <span className='text-heading-large pt-5'>{AppConstants.umpireReservePref}</span>
                <Checkbox
                    checked={boxData.activateReserves}
                    onChange={(e) => this.handleChangeSettingsState(sectionDataIndex, 'activateReserves', e.target.checked, sectionData)}
                >
                    {AppConstants.activeUmpireReserves}
                </Checkbox>

                <span className='text-heading-large pt-5'>{AppConstants.umpireCoach}</span>
                <Checkbox
                    checked={boxData.activateCoaches}
                    onChange={(e) => this.handleChangeSettingsState(sectionDataIndex, 'activateCoaches', e.target.checked, sectionData)}
                >
                    {AppConstants.activeUmpireCoach}
                </Checkbox>
            </div>
        );
    };

    boxSettingsRadioView = (boxData, sectionDataIndex, sectionData) => {
        return (
            <div>
                <span className='text-heading-large pt-4'>{AppConstants.howUmpiresAllocated}</span>
                <div className="d-flex flex-column">
                    <Radio
                        onChange={() => this.handleChangeSettingsState(sectionDataIndex, 'umpireAllocationTypeRefId', 242, sectionData)}
                        checked={boxData.umpireAllocationTypeRefId === 242}
                    >
                        {AppConstants.manuallyAllocate}
                    </Radio>

                    <Radio
                        onChange={() => this.handleChangeSettingsState(sectionDataIndex, 'umpireAllocationTypeRefId', 243, sectionData)}
                        checked={boxData.umpireAllocationTypeRefId === 243}
                    >
                        {AppConstants.allocateViaPools}
                    </Radio>
                    <Radio
                        onChange={() => this.handleChangeSettingsState(sectionDataIndex, 'umpireAllocationTypeRefId', 244, sectionData)}
                        checked={boxData.umpireAllocationTypeRefId === 244}
                    >
                        {AppConstants.umpireYourOwnTeam}
                    </Radio>
                    {boxData.umpireAllocatorTypeRefId === 247 && 
                        <Radio
                            onChange={() => this.handleChangeSettingsState(sectionDataIndex, 'umpireAllocationTypeRefId', 245, sectionData)}
                            checked={boxData.umpireAllocationTypeRefId === 245}
                        >
                            {AppConstants.umpireYourOwnOrganisation}
                        </Radio>
                    }
                </div>
            </div>
        )
    }

    deleteConfirmModalView = () => {
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.divisionSettings}
                    visible={this.state.deleteModalVisible}
                    onOk={() => this.handleDeleteModal("ok")}
                    onCancel={() => this.handleDeleteModal("cancel")}
                >
                    <p>{AppConstants.divisionRemoveMsg}</p>
                </Modal>
            </div>
        );
    }

    allDivisionModalView = () => {
        return (
            <div>
                <Modal
                    className="add-membership-type-modal add-membership-type-modalLadder"
                    title={AppConstants.divisionSettings}
                    visible={this.state.allDivisionVisible}
                    onOk={() => this.handleAllDivisionModal("ok")}
                    onCancel={() => this.handleAllDivisionModal("cancel")}
                >
                    <p>{AppConstants.divisionAllDivisionMsg}</p>
                </Modal>
            </div>
        );
    }

    ////////top or say first view
    topView = () => {
        return (
            <div className="content-view pt-4 mt-5">
                <span className='text-heading-large pt-2 pb-2'>{AppConstants.whoAssignsUmpires}</span>
                <div className="d-flex flex-column">
                    {this.umpireSettingsSectionView(AppConstants.competitionOrganiser, 246)}
                    {this.umpireSettingsSectionView(AppConstants.affiliateOrganisations, 247)}
                    {this.umpireSettingsSectionView(AppConstants.noUmpires)}
                </div>

                {this.deleteConfirmModalView()}
                {this.allDivisionModalView()}
            </div>
        );
    };

    umpireSettingsSectionView = (sectionTitle, umpireAllocatorTypeRefId) => {
        const { divisionList } = this.props.liveScoreTeamState;
        const { allocationSettingsData, selectedDivisions } = this.state;

        const sectionData = allocationSettingsData && umpireAllocatorTypeRefId ?
            allocationSettingsData.filter(item => item.umpireAllocatorTypeRefId === umpireAllocatorTypeRefId)
            : allocationSettingsData ? allocationSettingsData.filter(item => !item.hasUmpires)
            : null;

        return (
            <>
                <Checkbox
                    onChange={(e) => this.handleChangeWhoAssignsUmpires(e, umpireAllocatorTypeRefId)}
                    checked={!!sectionData?.length}
                    className="mx-0 mb-2"
                >
                    {sectionTitle}
                </Checkbox>
                {sectionData && !!sectionData.length && (
                    <div className="position-relative" style={{ paddingBottom: 35 }}>
                        {sectionData.map((boxData, sectionDataIndex) => (
                        <div key={'settingsBox_' + sectionDataIndex} className="inside-container-view mb-2 mt-4">
                            {sectionData.length > 1 && (
                                <div className="d-flex float-right">
                                    <div
                                        className="transfer-image-view pt-0 pointer ml-auto"
                                            onClick={() => this.handleClickDeleteModal(sectionDataIndex, sectionData)}
                                    >
                                        <span className="user-remove-btn"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                                        <span className="user-remove-text">{AppConstants.remove}</span>
                                    </div>
                                </div>
                            )}
                            <Checkbox
                                onChange={(e) => this.handleChangeSettingsState(sectionDataIndex, 'allDivisions', e.target.checked, sectionData)}
                                checked={boxData.allDivisions}
                            >
                                {AppConstants.allDivisions}
                            </Checkbox>
                            
                            <Select
                                mode="multiple"
                                placeholder="Select"
                                style={{ width: '100%', paddingRight: 1, minWidth: 182, marginTop: 20 }}
                                onChange={divisions => this.handleChangeSettingsState(sectionDataIndex, 'divisions', divisions, sectionData)}
                                value={(boxData.allDivisions ? divisionList : boxData.divisions).map(division => division.id)}
                            >
                                {(divisionList || []).map((item) => (
                                    <Option
                                        key={'compOrgDivision_' + item.id}
                                        disabled={
                                            (selectedDivisions.some(selectedDivision => selectedDivision.id === item.id 
                                            && !boxData.divisions.find(division => division.id === item.id)))
                                        }
                                        value={item.id}
                                    >
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                            {umpireAllocatorTypeRefId && this.boxSettingsView(boxData, sectionDataIndex, sectionData)}
                        </div>
                        ))}
                        {this.state.selectedDivisions.length !==  this.props.liveScoreTeamState.divisionList.length
                            && umpireAllocatorTypeRefId 
                            && (
                                <div className="row mb-5 position-absolute">
                                    <div 
                                        className="col-sm"
                                        onClick={() => this.handleAddBox(umpireAllocatorTypeRefId)}
                                    >
                                        <span className="input-heading-add-another pointer pt-0">+ {AppConstants.addDivision}</span>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )}
            </>
        )
    }

    // checkScreenNavigation = (key) => {
    //     const { allocateViaPool, manuallyAllocate, affiliateOrg } = this.props.umpireSettingState
    //     if (affiliateOrg === true && key === "next") {
    //         history.push("/umpirePayment");
    //     } else if (allocateViaPool === true && key === "next") {
    //         history.push("/umpirePoolAllocation");
    //     } else if (manuallyAllocate === true) {
    //         history.push("/umpireDashboard");
    //     }
    // }

    handleSave = () => {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        const { selectedComp, allocationSettingsData } = this.state;

        const noUmpiresSettingArray = allocationSettingsData
            .filter(item => !item.hasUmpires && !!item.divisions.length)
            .map(item => ({
                allDivisions: item.allDivisions,
                divisions: item.allDivisions ? [] : item.divisions.map(division => division.id),
            }));
        
        const umpireAllocationSettingsArray = allocationSettingsData
            .filter(item => !!item.hasUmpires && !!item.divisions.length)
            .map(item => ({
                activateCoaches: item.activateCoaches,
                activateReserves: item.activateReserves,
                allDivisions: item.allDivisions,
                divisions: item.allDivisions ? [] : item.divisions.map(division => division.id),
                maxNumberOfMatches: item.maxNumberOfMatches,
                timeBetweenMatches: item.timeBetweenMatches,
                umpireAllocationTypeRefId: item.umpireAllocationTypeRefId,
                umpireAllocatorTypeRefId: item.umpireAllocatorTypeRefId,
            }));

        const noUmpiresSetting = !!noUmpiresSettingArray[0]?.divisions.length || !!noUmpiresSettingArray[0]?.allDivisions ? noUmpiresSettingArray[0] : null;
        const umpireAllocationSettings = !!umpireAllocationSettingsArray.length ? umpireAllocationSettingsArray : [];

        const bodyData = { noUmpiresSetting, umpireAllocationSettings }

        const saveData = {
            organisationId,
            competitionId: selectedComp,
            body: bodyData
        };

        this.props.saveUmpireAllocationSettings(saveData);
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            {/* <div className="reg-add-save-button">
                                <Button className="cancelBtnWidth" type="cancel-button">{AppConstants.back}</Button>
                            </div> */}
                        </div>
                        <div className="col-sm">
                            {/* <div className="comp-buttons-view">
                                <Button
                                    className="publish-button save-draft-text"
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => this.checkScreenNavigation("save")}
                                >
                                    {AppConstants.save}
                                </Button>
                                <Button
                                    className="publish-button save-draft-text"
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => this.checkScreenNavigation("next")}
                                >
                                    {AppConstants.next}
                                </Button>
                            </div> */}

                            <div className="comp-buttons-view">
                                <Button
                                    className="publish-button save-draft-text"
                                    type="primary"
                                    htmlType="submit"
                                    onClick={this.handleSave}
                                >
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="6" />
                <Layout>
                    <Form
                        onFinish={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        {this.headerView()}
                        {this.dropdownView()}
                        <Content>
                            <div className="formView">{this.topView()}</div>
                        </Content>
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                    <Loader visible={this.props.umpireCompetitionState.onLoad
                            || this.props.liveScoreTeamState.onLoad || this.props.umpireSettingState.onLoad} 
                    />
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction,
        updateUmpireDataAction,
        getUmpireAllocationSettings,
        saveUmpireAllocationSettings,
        liveScoreGetDivision,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpireSettingState: state.UmpireSettingState,
        liveScoreTeamState: state.LiveScoreTeamState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpireSetting);
