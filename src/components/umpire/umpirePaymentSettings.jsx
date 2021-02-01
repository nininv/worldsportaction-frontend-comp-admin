import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Layout,
    Breadcrumb,
    Select,
    Button,
    Form,
    Checkbox,
    Radio,
    Modal,
} from "antd";

import InputWithHead from "../../customComponents/InputWithHead";
import InputNumberWithHead from "../../customComponents/InputNumberWithHead";
import Loader from '../../customComponents/loader';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";

import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";

import { isArrayNotEmpty } from "../../util/helpers";
import { getUmpireCompId, setUmpireCompId } from '../../util/sessionStorage';

import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction";
import {
    getUmpirePaymentSettings,
    saveUmpirePaymentSettings,
} from '../../store/actions/umpireAction/umpirePaymentSettingAction';
import { liveScoreGetDivision } from "../../store/actions/LiveScoreAction/liveScoreTeamAction";
import { getUmpirePoolData } from "../../store/actions/umpireAction/umpirePoolAllocationAction";
import { getRefBadgeData } from '../../store/actions/appAction';

const { Header, Footer, Content } = Layout;
const { Option } = Select;

const initialPaymentSettingsData = {
    allDivisions: false,
    divisions: [],
    UmpirePaymentFeeType: 'BY_BADGE',
    byBadge: [],
    byPool: [],
    hasSettings: true,
};

const initialNoSettingsData = {
    allDivisions: false,
    divisions: [],
    hasSettings: false,
};

class UmpirePaymentSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionList: null,
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null,
            paymentSettingsData: null,
            selectedDivisions: null,
            allDivisionVisible: false,
            deleteModalVisible: false,
            sectionDataToDeleteIndex: null,
            tempPaymentSettingsData: null,
            tempSelectedDivisions: null,
            isOrganiserView: false,
            allowedDivisionList: null,
        };
    }

    componentDidMount() {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        this.setState({ loading: true });
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS');
        this.props.getRefBadgeData();
    }

    componentDidUpdate(prevProps, prevState) {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));

        if (prevProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            // if (this.state.loading && this.props.umpireCompetitionState.onLoad == false) {
            if (!this.props.umpireCompetitionState.onLoad) {
                const competitionList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = !!competitionList.length && competitionList[0].id;
                
                if (getUmpireCompId()) {
                    let compId = JSON.parse(getUmpireCompId())
                    firstComp = compId
                } else {
                    setUmpireCompId(firstComp)
                }

                if (!!competitionList.length) {
                    this.props.liveScoreGetDivision(firstComp);
                    // this.props.getUmpirePoolData({ orgId: organisationId, compId: firstComp });
                }

                const compKey = competitionList.length > 0 && competitionList[0].competitionUniqueKey;

                const competitionListCopy = JSON.parse(JSON.stringify(competitionList));

                competitionListCopy.forEach(item => {
                    if (item.organisationId === organisationId) {
                        item.isOrganiser = true;
                    } else {
                        item.isOrganiser = false;
                    }
                });

                const isOrganiser = competitionListCopy.find(competition => competition.id === firstComp)?.isOrganiser;

                this.setState({ 
                    competitionList: competitionListCopy,
                    isOrganiserView: isOrganiser,
                    selectedComp: firstComp,
                    loading: false,
                    competitionUniqueKey: compKey
                });
            }
        }

        if (!!this.state.selectedComp && prevState.selectedComp !== this.state.selectedComp) {
            const { selectedComp } = this.state;

            this.props.getUmpirePoolData({ orgId: organisationId, compId: selectedComp });
        }

        if (this.props.umpirePoolAllocationState.umpirePoolData !== prevProps.umpirePoolAllocationState.umpirePoolData) {
            const reqData = {
                organisationId,
                competitionId: this.state.selectedComp,
            };
    
            this.props.getUmpirePaymentSettings(reqData);
        }

        if (this.props.umpirePaymentSettingState !== prevProps.umpirePaymentSettingState && !!this.props.umpirePaymentSettingState.paymentSettingsData
                && !this.props.umpirePaymentSettingState.onLoad
            ) {
            this.modifyGetSettingsData(); 
        }
    }

    modifyGetSettingsData = () => {
        const { divisionList } = this.props.liveScoreTeamState;
        const { umpirePaymentSettings, allowedDivisionsSetting } = this.props.umpirePaymentSettingState.paymentSettingsData;
        const { isOrganiserView } = this.state;

        const selectedDivisions = [];

        const umpirePaymentSettingsArray = !!umpirePaymentSettings.length ? 
            umpirePaymentSettings.map(settingsItem => ({
                allDivisions: settingsItem.allDivisions,
                divisions: settingsItem.divisions,
                UmpirePaymentFeeType: settingsItem.UmpirePaymentFeeType,
                byBadge: !!settingsItem.byBadge.length ? 
                        settingsItem.byBadge.map(byBadgeSetting => ({
                            accreditationUmpireRefId: byBadgeSetting.accreditationUmpireRefId,
                            rates: byBadgeSetting.rates.map(rate => ({
                                roleId: rate.roleId,
                                rate: rate.rate,
                            }))
                        })) : [],
                byPool: !!settingsItem.byPool.length ? 
                        settingsItem.byPool.map(byPoolSetting => ({
                            umpirePoolId: byPoolSetting.umpirePoolId,
                            rates: byPoolSetting.rates.map(rate => ({
                                roleId: rate.roleId,
                                rate: rate.rate,
                            }))
                        })) : [],
                hasSettings: true,
            })) : [];

        const allowedDivisionsSettingArray = !!allowedDivisionsSetting ? [{ 
            allDivisions: allowedDivisionsSetting.allDivisions,
            divisions: allowedDivisionsSetting.divisions,
            hasSettings: false,
        }] : [];
        
        const affiliateViewSettingsArray = !isOrganiserView && !umpirePaymentSettings.length ?
            [initialPaymentSettingsData] : umpirePaymentSettingsArray;

        const newPaymentSettingsData = isOrganiserView ? [ ...umpirePaymentSettingsArray, ...allowedDivisionsSettingArray ]
            : [ ...affiliateViewSettingsArray ];

        const allowedDivisionList = isOrganiserView ? divisionList : allowedDivisionsSetting?.divisions;

        newPaymentSettingsData.forEach(item => {
            item.allDivisions ? selectedDivisions.push(...allowedDivisionList) : selectedDivisions.push(...item.divisions);
        });

        this.setState({ paymentSettingsData: newPaymentSettingsData, selectedDivisions, allowedDivisionList });
    }

    handleChangeWhoPaysUmpires = (e, isBoxHasSettings) => {
        const { paymentSettingsData, allowedDivisionList } = this.state;

        const newSelectedDivisions = [];
        let newSettingsData;
        
        if (isBoxHasSettings) {
            const initialSettingsBoxData = JSON.parse(JSON.stringify(initialPaymentSettingsData));
            const noSettingsDataState = paymentSettingsData.filter(item => !item.hasSettings);

            if (e.target.checked) {
                newSettingsData = [ ...noSettingsDataState, initialSettingsBoxData ];
            } else {
                newSettingsData = [ ...noSettingsDataState  ];
            }  
        } else {
            if (e.target.checked) {
                newSettingsData = [ ...paymentSettingsData, initialNoSettingsData ];
            } else {
                newSettingsData = [ ...paymentSettingsData.filter(item => !!item.hasSettings) ];
            }  
        }

        newSettingsData.forEach(item => {
            item.allDivisions ? newSelectedDivisions.push(...allowedDivisionList) : newSelectedDivisions.push(...item.divisions);
        });

        this.setState({ paymentSettingsData: newSettingsData, selectedDivisions: newSelectedDivisions });
    }

    handleChangeFeesRadio = (sectionData, sectionDataIndex, key) => {
        const { paymentSettingsData } = this.state;

        const sectionDataCopy = JSON.parse(JSON.stringify(sectionData));
        const boxData = sectionDataCopy[sectionDataIndex];
        let { byBadge, byPool } = boxData;

        if (key === 'byBadge') {
            byPool.length = 0;
            boxData.UmpirePaymentFeeType = 'BY_BADGE';
        } else {
            byBadge.length = 0;
            boxData.UmpirePaymentFeeType = 'BY_POOL';
        }

        const newPaymentSettingsData = [ ...sectionDataCopy, ...paymentSettingsData.filter(item => !item.hasSettings) ]
        
        this.setState({ 
            paymentSettingsData: newPaymentSettingsData,
        });
    }

    handleChangeSettings = (sectionDataIndex, key, value, sectionData) => {
        const { paymentSettingsData } = this.state;
        const paymentSettingsDataCopy = JSON.parse(JSON.stringify(paymentSettingsData));

        const targetSectionData = paymentSettingsDataCopy
            .filter(item => item.hasSettings === sectionData[0].hasSettings);

        const otherSectionData = paymentSettingsDataCopy
            .filter(item => item.hasSettings !== sectionData[0].hasSettings);

        if (key === 'allDivisions') {
            this.handleAllDivisionsChange(targetSectionData, sectionDataIndex, paymentSettingsDataCopy, value);
        } else if (key === 'divisions') {
            this.handleNonAllDivisionsChange(sectionData, targetSectionData, otherSectionData, sectionDataIndex, value);
        }
    }

    handleAllDivisionsChange = (targetSectionData, sectionDataIndex, paymentSettingsDataCopy, value) => {
        const { paymentSettingsData, selectedDivisions, allowedDivisionList } = this.state;

        const newSelectedDivisions = [];

        paymentSettingsDataCopy.forEach(item => {
            item.divisions = [];
            item.allDivisions = false;
        });

        if (!!value) {
            newSelectedDivisions.push( ...allowedDivisionList);
        }

        targetSectionData[sectionDataIndex].divisions = !!value ? allowedDivisionList : [];
        targetSectionData[sectionDataIndex].allDivisions = value;

        const newPaymentSettingsData = [ targetSectionData[sectionDataIndex] ];

        this.setState({ 
            allDivisionVisible: !!value,
            tempPaymentSettingsData: !!value ? newPaymentSettingsData : null,
            paymentSettingsData: !value ? newPaymentSettingsData : paymentSettingsData,
            tempSelectedDivisions: !!value ? newSelectedDivisions : [],
            selectedDivisions: !value ? [] : selectedDivisions,
        });
    }

    handleNonAllDivisionsChange = (sectionData, targetSectionData, otherSectionData, sectionDataIndex, value) => {
        const { allowedDivisionList } = this.state;

        const newSelectedDivisions = [];

        const newSettingsData = [...otherSectionData, ...targetSectionData ];

        targetSectionData[sectionDataIndex].divisions = value.map(item =>
            allowedDivisionList.find(divisionListItem => divisionListItem.id === item)
        );

        newSettingsData.forEach(item => {
            newSelectedDivisions.push(...item.divisions);
        });

        const updatedSelectedDivisions = !!newSelectedDivisions.length ? newSelectedDivisions : [];

        if (updatedSelectedDivisions.length < allowedDivisionList.length) {
            newSettingsData.forEach(item => {
                item.allDivisions = false;
            });
        }

        if (updatedSelectedDivisions.length === allowedDivisionList.length && value.length === allowedDivisionList.length) {
            newSettingsData
                .filter(item => item.hasSettings === sectionData[0].hasSettings)[sectionDataIndex]
                .allDivisions = true;
        }

        this.setState({ 
            paymentSettingsData: newSettingsData, 
            selectedDivisions: updatedSelectedDivisions
        });
    }

    handleChangeRateCell = (e, sectionData, sectionDataIndex, rateListKey, rateRoleId, rateLineDataId) => {
        const { paymentSettingsData } = this.state;
        const sectionDataCopy = JSON.parse(JSON.stringify(sectionData));

        const rateList = sectionDataCopy[sectionDataIndex][rateListKey];

        const cellLineIdKey = rateListKey === 'byPool' ? 'umpirePoolId' : 'accreditationUmpireRefId';

        const rateLineDataForChange = rateList.find(data => data[cellLineIdKey] === rateLineDataId)?.rates;

        const rateLineData = !!rateLineDataForChange ? rateLineDataForChange : [];

        const rateDataForChangeIndex = rateLineData.findIndex(rate => rate.roleId === rateRoleId);

        if (rateDataForChangeIndex >= 0) {
            rateLineData[rateDataForChangeIndex].rate = e;
        } else {
            rateLineData.push({
                rate: e,
                roleId: rateRoleId,
            });
        }

        if (!rateLineDataForChange) {
            rateList.push({
                [cellLineIdKey]: rateLineDataId, 
                rates: rateLineData
            });
        }

        const newPaymentSettingsData = [ ...sectionDataCopy, ...paymentSettingsData.filter(item => !item.hasSettings) ];
        
        this.setState({ 
            paymentSettingsData: newPaymentSettingsData,
        });
    }

    handleClickDeleteModal = sectionDataIndex => {
        this.setState({ 
            deleteModalVisible: true,
            sectionDataToDeleteIndex: sectionDataIndex 
        });
    }

    handleDeleteModal = key => {
        if (key === "ok") {
            const { paymentSettingsData, sectionDataToDeleteIndex } = this.state;
            const umpirePaymentSettingsCopy = JSON.parse(JSON.stringify(paymentSettingsData.filter(item => item.hasSettings)));

            umpirePaymentSettingsCopy.splice(sectionDataToDeleteIndex, 1);

            const newPaymentSettingsData = [ ...umpirePaymentSettingsCopy, ...paymentSettingsData.filter(item => !item.hasSettings) ];

            const newSelectedDivisions = [];

            newPaymentSettingsData.forEach(item => {
                newSelectedDivisions.push(...item.divisions);
            });

            this.setState({ paymentSettingsData: newPaymentSettingsData, selectedDivisions: newSelectedDivisions });
        }

        this.setState({ deleteModalVisible: false, sectionDataToDeleteIndex: null });
    }

    handleAllDivisionModal = key => {
        const { tempPaymentSettingsData, tempSelectedDivisions } = this.state;

        if (key === "ok") {
            this.setState({ 
                paymentSettingsData: tempPaymentSettingsData,
                selectedDivisions: tempSelectedDivisions,
            });
        }

        this.setState({ 
            allDivisionVisible: false, 
            tempPaymentSettingsData: null,
            tempSelectedDivisions: null,
        });
    }

    handleAddBox = () => {
        const { paymentSettingsData } = this.state;
        
        const initialSettingsBoxData = JSON.parse(JSON.stringify(initialPaymentSettingsData));

        const newPaymentSettingsData = [ ...paymentSettingsData, initialSettingsBoxData ];

        this.setState({ paymentSettingsData: newPaymentSettingsData });
    }

    onChangeComp = compID => {
        const { competitionList } = this.state;

        const { isOrganiser } = competitionList.find(competition => competition.id === compID);

        this.props.liveScoreGetDivision(compID);
        setUmpireCompId(compID);

        this.setState({ selectedComp: compID, isOrganiserView: isOrganiser });
    }

    modifyPostArray = arr => {
        arr.forEach(item => {
            item.divisions = item.allDivisions ? [] : item.divisions.map(division => division.id);
            delete item.hasSettings; 
        });

        return arr;
    }

    handleSave = () => {
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
        const { selectedComp, paymentSettingsData, isOrganiserView } = this.state;

        const paymentSettingsDataCopy = JSON.parse(JSON.stringify(paymentSettingsData));

        const affiliateSettingArray = paymentSettingsDataCopy
            .filter(item => !item.hasSettings && !!item.divisions.length);
        
        const umpirePaymentSettingsArray = paymentSettingsDataCopy
            .filter(item => !!item.hasSettings && (!!item.divisions.length || !!item.allDivisions));

        this.modifyPostArray(affiliateSettingArray);
        this.modifyPostArray(umpirePaymentSettingsArray);

        const allowedDivisionsSetting = !!affiliateSettingArray[0]?.divisions.length || !!affiliateSettingArray[0]?.allDivisions 
            ? affiliateSettingArray[0] 
            :  null;

        const umpirePaymentSettings = !!umpirePaymentSettingsArray.length ? umpirePaymentSettingsArray : [];

        const bodyData = isOrganiserView ? {
            umpirePaymentSettings,
            allowedDivisionsSetting,
        } : umpirePaymentSettings;

        const saveData = {
            organisationId,
            competitionId: selectedComp,
            type: isOrganiserView ? 'organiser' : 'affiliate',
            body: bodyData,
        };

        this.props.saveUmpirePaymentSettings(saveData);
    }

    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view d-flex align-items-center bg-transparent">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.umpirePaymentSetting}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    dropdownView = () => {
        const { competitionList } = this.state;

        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div
                                className="d-flex align-items-center"
                                style={{ width: "fit-content" }}
                            >
                                <span className="year-select-heading">
                                    {AppConstants.competition}:
                                </span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 200 }}
                                    onChange={this.onChangeComp}
                                    value={this.state.selectedComp}
                                >
                                    {!!competitionList && competitionList.map((item) => (
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

    contentView = () => {
        const { isOrganiserView } = this.state;

        return (
            <div className="content-view pt-4 mt-5">
                {isOrganiserView ? 
                    <>
                        <span className='text-heading-large pt-2 pb-2'>{AppConstants.whoPayUmpire}</span>
                        <div className="d-flex flex-column">
                            {this.umpireSettingsSectionView(AppConstants.competitionOrganiser, true)}
                            {this.umpireSettingsSectionView(AppConstants.affiliateOrganisations, false)}
                        </div>
                    </>
                :
                    <div className="d-flex flex-column">
                        {this.umpireSettingsSectionView(null, true)}
                    </div>
                }
                
                {this.deleteConfirmModalView()}
                {this.allDivisionModalView()}
            </div>
        );
    };

    umpireSettingsSectionView = (sectionTitle, hasSettings) => {
        const { paymentSettingsData, selectedDivisions, allowedDivisionList } = this.state;

        const sectionData = hasSettings && !!paymentSettingsData 
            ? paymentSettingsData.filter(item => item.hasSettings) 
            : !!paymentSettingsData 
            ? paymentSettingsData.filter(item => !item.hasSettings) 
            : [];

        return (
            <>
                {sectionTitle &&
                    <Checkbox
                        onChange={(e) => this.handleChangeWhoPaysUmpires(e, hasSettings)}
                        checked={!!sectionData?.length}
                        className="mx-0 mb-2"
                    >
                    
                        {sectionTitle}
                    </Checkbox>
                }
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
                                onChange={(e) => this.handleChangeSettings(sectionDataIndex, 'allDivisions', e.target.checked, sectionData)}
                                checked={boxData.allDivisions}
                            >
                                {AppConstants.allDivisions}
                            </Checkbox>
                            
                            <Select
                                mode="multiple"
                                placeholder={AppConstants.select}
                                style={{ width: '100%', paddingRight: 1, minWidth: 182, marginTop: 20 }}
                                onChange={divisions => this.handleChangeSettings(sectionDataIndex, 'divisions', divisions, sectionData)}
                                value={(boxData.allDivisions ? allowedDivisionList : boxData.divisions).map(division => division.id)}
                            >
                                {(allowedDivisionList || []).map((item) => (
                                    <Option
                                        key={'compOrgDivision_' + item.id}
                                        disabled={
                                            (selectedDivisions.some(selectedDivision => selectedDivision.id === item.id 
                                            && !boxData.allDivisions && !boxData.divisions.find(division => division.id === item.id)))
                                        }
                                        value={item.id}
                                    >
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                            {hasSettings && this.feesView(sectionData, sectionDataIndex)}
                        </div>
                        ))}
                        {!!allowedDivisionList && selectedDivisions.length < allowedDivisionList.length
                            && hasSettings 
                            && (
                                <div className="row mb-5 position-absolute">
                                    <div 
                                        className="col-sm"
                                        onClick={() => this.handleAddBox()}
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

    feesView = (sectionData, sectionDataIndex) => {
        const { umpirePoolData } = this.props.umpirePoolAllocationState;

        const { badgeData } = this.props.appState;
        const umpireBadgesData = isArrayNotEmpty(badgeData) ? badgeData : [];

        const { UmpirePaymentFeeType } = sectionData[sectionDataIndex];

        return (
            <div>
                <span className='text-heading-large pt-3'>{AppConstants.fees}</span>
                <div className="d-flex flex-column">
                    <Radio
                        onChange={() => this.handleChangeFeesRadio(sectionData, sectionDataIndex, 'byBadge')}
                        checked={UmpirePaymentFeeType === 'BY_BADGE'}
                        className="p-0"
                    >
                        {AppConstants.byBadge}
                    </Radio>
                    {UmpirePaymentFeeType === 'BY_BADGE' && !!umpireBadgesData.length && (
                        <div>
                            {umpireBadgesData.map((badgeDataItem, i) => (
                                <div key={"badgeDataItem" + i}>
                                    {this.ratesView('byBadge', badgeDataItem, sectionData, sectionDataIndex)}
                                </div>
                            ))}
                        </div>
                    )}

                    <Radio
                        onChange={() => this.handleChangeFeesRadio(sectionData, sectionDataIndex, 'byPool')}
                        checked={UmpirePaymentFeeType === 'BY_POOL'}
                        className="p-0 mt-4"
                    >
                        {AppConstants.byPool}
                    </Radio>
                    {UmpirePaymentFeeType === 'BY_POOL' && (
                        <>
                            {!!umpirePoolData.length ? 
                                <div>
                                    {umpirePoolData.map((poolDataItem, i) => (
                                        <div key={"poolDataItem" + i}>
                                            {this.ratesView('byPool', poolDataItem, sectionData, sectionDataIndex)}
                                        </div>
                                    ))}
                                </div>
                                :
                                <div className="mt-4 error-message-inside">
                                    {AppConstants.noPoolMsg}
                                </div>
                            }
                        </>
                    )}
                </div>
            </div>
        )
    }

    ratesView = (radioListKey, dataItem, sectionData, sectionDataIndex) => {
        const cellLineIdKey = radioListKey === 'byPool' ? 'umpirePoolId' : 'accreditationUmpireRefId';
        const itemRates = sectionData[sectionDataIndex][radioListKey].find(data => data[cellLineIdKey] === dataItem.id)?.rates;

        const { id } = dataItem;

        return (
            <div>
                <div className="row">
                    <div className='col-sm input-width d-flex align-items-end'>
                        <InputWithHead
                            auto_complete='new-password'
                            heading={AppConstants.name}
                            placeholder={"Name"}
                            value={dataItem.description || dataItem.name}
                            disabled
                        />
                    </div>
                        
                    {this.rateCellView(itemRates, 15, AppConstants.umpireRate, sectionData, sectionDataIndex, radioListKey, id )}
                    {this.rateCellView(itemRates, 19, AppConstants.umpireResRate, sectionData, sectionDataIndex, radioListKey, id )}
                    {this.rateCellView(itemRates, 20, AppConstants.umpireCoachRate, sectionData, sectionDataIndex, radioListKey, id )}
                </div>
            </div>
        )
    }

    rateCellView = (poolItemRates, rateRoleId, heading, sectionData, sectionDataIndex, radioListKey, id ) => {
        const value = (poolItemRates || []).find(rate => rate.roleId === rateRoleId)?.rate;
        
        return (
            <div className='col-sm input-width d-flex align-items-end'>
                <InputNumberWithHead
                    prefixValue="$"
                    defaultValue={0}
                    min={0}
                    precision={2}
                    step={0.01}
                    heading={heading}
                    onChange={e => this.handleChangeRateCell(e, sectionData, sectionDataIndex, radioListKey, rateRoleId, id )}
                    value={!!value ? value : 0}
                /> 
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

    footerView = () => {
        const { umpirePoolData } = this.props.umpirePoolAllocationState;
        const { paymentSettingsData } = this.state;

        const someNoPoolSettings = !!paymentSettingsData && paymentSettingsData.some(settingsItem => (
            settingsItem.UmpirePaymentFeeType === 'BY_POOL' && !umpirePoolData.length
        ));

        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm px-0">
                            <div className="comp-buttons-view">
                                <Button 
                                    onClick={this.handleSave}
                                    className="publish-button save-draft-text mr-0" 
                                    type="primary" 
                                    htmlType="submit"
                                    disabled={someNoPoolSettings 
                                        || this.props.umpireCompetitionState.onLoad || this.props.umpirePaymentSettingState.onLoad
                                        || this.props.liveScoreTeamState.onLoad || this.props.umpirePoolAllocationState.onLoad}
                                >
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="9" />
                <Layout>
                    <Form
                        onFinish={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        {this.headerView()}
                        {this.dropdownView()}
                        <Content>
                            <div className="formView umpire-form-view">{this.contentView()}</div>
                        </Content>
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                    <Loader visible={this.props.umpireCompetitionState.onLoad || this.props.umpirePaymentSettingState.onLoad
                            || this.props.liveScoreTeamState.onLoad || this.props.umpirePoolAllocationState.onLoad} 
                    />
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction,
        getRefBadgeData,
        getUmpirePaymentSettings,
        saveUmpirePaymentSettings,
        liveScoreGetDivision,
        getUmpirePoolData,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpirePaymentSettingState: state.UmpirePaymentSettingState,
        umpirePoolAllocationState: state.UmpirePoolAllocationState,
        liveScoreTeamState: state.LiveScoreTeamState,
        appState: state.AppState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpirePaymentSetting);
