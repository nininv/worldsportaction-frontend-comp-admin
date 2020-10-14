import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Layout,
    Breadcrumb,
    Select,
    Button,
    Form,
    TimePicker,
    Checkbox
} from "antd";
import moment from "moment";

import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { isArrayNotEmpty } from "../../util/helpers";
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { getUmpireCompId, setUmpireCompId } from '../../util/sessionStorage'
import { umpirePaymentSettingUpdate } from '../../store/actions/umpireAction/umpirePaymentSettingAction'

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class UmpirePaymentSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null
        };
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')
        this.props.umpirePaymentSettingUpdate({ value: null, key: 'refreshPage' })
    }

    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading == true && this.props.umpireCompetitionState.onLoad == false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id

                if (getUmpireCompId()) {
                    let compId = JSON.parse(getUmpireCompId())
                    firstComp = compId
                } else {
                    setUmpireCompId(firstComp)
                }

                let compKey = compList.length > 0 && compList[0].competitionUniqueKey
                this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey })
            }
        }
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
                            {AppConstants.umpirePaymentSetting}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    onChangeComp(compID) {
        let selectedComp = compID.comp
        setUmpireCompId(selectedComp)
        let compKey = compID.competitionUniqueKey
        this.setState({ selectedComp, competitionUniqueKey: compKey })
    }

    dropdownView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
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
                                <span className="year-select-heading">
                                    {AppConstants.competition}:
                                </span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 200 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.selectedComp}
                                >
                                    {
                                        competition.map((item, index) => {
                                            return <Option key={`longName${index}` + item.id}
                                                           value={item.id}>{item.longName}</Option>
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

    //////footer view containing all the buttons like save and cancel
    footerView = (isSubmitting) => {
        const { paidByCompOrgDivision } = this.props.umpirePaymentSettingState
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="reg-add-save-button">
                                {/* <NavLink to='/umpire'> */}
                                <Button className="cancelBtnWidth" type="cancel-button">{AppConstants.cancel}</Button>
                                {/* </NavLink> */}
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="publish-button save-draft-text" type="primary" htmlType="submit">
                                    {/* {AppConstants.generateRoster} */}
                                    {AppConstants.save}
                                </Button>
                                {/* <NavLink to={paidByCompOrgDivision.length > 0 ? '/umpireSetting' : '/umpirePayment'}> */}
                                <Button className="publish-button save-draft-text" type="primary" htmlType="submit">
                                    {AppConstants.next}
                                </Button>
                                {/* </NavLink> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    contentView = () => {
        const { paidByCompOrg, paidByAffiliate } = this.props.umpirePaymentSettingState
        return (
            <div className='pt-4' style={{ padding: '3%', minWidth: 240 }}>
                <span className='text-heading-large pt-2'>{AppConstants.whoPayUmpire}</span>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Checkbox
                        className="single-checkbox"
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'paidByComp'
                        })}
                        checked={paidByCompOrg}
                    >
                        {'Paid by Competition Organiser'}
                    </Checkbox>
                    {paidByCompOrg &&
                        <div className="inside-container-view">
                            {this.paidByCompOrgView()}
                            {this.feesView()}
                        </div>
                    }

                    <Checkbox
                        className="single-checkbox ml-0"
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'paidByAffilate'
                        })}
                        checked={paidByAffiliate}
                    >
                        {'Paid by Affiliate'}
                    </Checkbox>

                    {paidByAffiliate &&
                        <div className="inside-container-view">
                            {this.paidByAffiliateView()}
                            {this.paidByAffiliateFeesView()}
                        </div>
                    }
                </div>
            </div>
        )
    }

    paidByCompOrgView = () => {
        const { paidByCompOrgDivision, selectAllDiv, compOrgDiv } = this.props.umpirePaymentSettingState
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Checkbox
                    onChange={(e) => this.props.umpirePaymentSettingUpdate({
                        value: e.target.checked,
                        key: 'selectAllDiv'
                    })}
                    checked={selectAllDiv}
                >
                    {AppConstants.allDivisions}
                </Checkbox>
                {selectAllDiv === false && (
                    <Select
                        mode='multiple'
                        placeholder="Select"
                        style={{ width: "100%", paddingRight: 1, minWidth: 182, marginTop: 20 }}
                        onChange={(divisionId) => this.props.umpirePaymentSettingUpdate({
                            value: divisionId,
                            key: 'paidByCompOrgDivision'
                        })}
                        value={paidByCompOrgDivision}
                    >
                        {compOrgDiv.map((item) => (
                            <Option key={"compOrgDiv" + item.id} disabled={item.disabled}
                                    value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                )}
            </div>
        )
    }

    paidByAffiliateView = () => {
        const { paidByAffiliateDivision, selectAllDiv, affiliateDiv } = this.props.umpirePaymentSettingState
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Checkbox
                    onChange={(e) => this.props.umpirePaymentSettingUpdate({
                        value: e.target.checked,
                        key: 'selectAllDiv'
                    })}
                    checked={selectAllDiv}
                >
                    {AppConstants.allDivisions}
                </Checkbox>
                {
                    selectAllDiv === false &&
                    <Select
                        mode='multiple'
                        placeholder="Select"
                        style={{ width: "100%", paddingRight: 1, minWidth: 182, marginTop: 20 }}
                        onChange={(divisionId) => this.props.umpirePaymentSettingUpdate({
                            value: divisionId,
                            key: 'paidByAffiliateDivision'
                        })}
                        value={paidByAffiliateDivision}
                    >
                        {affiliateDiv.map((item, index) => (
                            <Option key={"affiliateDiv" + index} disabled={item.disabled}
                                    value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                }
            </div>
        )
    }

    feesView = () => {
        const { byBadgeBtn, byPoolBtn, inputFieldForByPool } = this.props.umpirePaymentSettingState
        return (
            <div>
                <span className='text-heading-large pt-3'>{AppConstants.fees}</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Checkbox
                        className="single-checkbox"
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'byBadge'
                        })}
                        checked={byBadgeBtn}>
                        {'By Badge'}
                    </Checkbox>
                    {byBadgeBtn &&
                    <div>
                        {this.byBadgeView()}
                    </div>
                    }

                    <Checkbox
                        className="single-checkbox ml-0"
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'byPool'
                        })}
                        checked={byPoolBtn}>
                        {'By Pool'}
                    </Checkbox>
                    {byPoolBtn &&
                    <div>
                        {/* {this.byPoolView()} */}
                        {
                            inputFieldForByPool.length > 0 && inputFieldForByPool.map((item, index) => {
                                return (
                                    <div key={"inputFieldForByPool" + index}>
                                        {this.inputFieldsForByPool(item, index)}
                                    </div>
                                )
                            })}
                        {/* <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'addAnotherGroupForByPool' })} className={'input-heading-add-another pointer pt-0 mt-3'}>+ {AppConstants.addAnotherGroup}</span> */}
                    </div>
                    }
                </div>
            </div>
        )
    }

    inputFieldsForByPool = (item, index) => {
        const { inputFieldForByPool } = this.props.umpirePaymentSettingState
        return (
            <div>
                <div className="row pt-3">
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='new-password'
                            heading={AppConstants.name}
                            placeholder={"Name"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'name',
                                subkey: "byPoolInputFeilds"
                            })}
                            value={inputFieldForByPool[index].name}
                        />
                    </div>
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='off'
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireRate}
                            placeholder={"Umpire Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'umpireRate',
                                subkey: "byPoolInputFeilds"
                            })}
                            value={inputFieldForByPool[index].umpireRate}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='off'
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireResRate}
                            placeholder={"Umpire Reserve Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'umpReserveRate',
                                subkey: "byPoolInputFeilds"
                            })}
                            value={inputFieldForByPool[index].umpReserveRate}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='off'
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireCoachrate}
                            placeholder={"Umpire Coach Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'umpCoachRate',
                                subkey: "byPoolInputFeilds"
                            })}
                            value={inputFieldForByPool[index].umpCoachRate}
                        />
                    </div>

                    {/* <div className="col-sm-1 umpire-delete-image-view">
                        <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'removePoolItem', index: index })} className="user-remove-btn mt-3"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                    </div> */}
                </div>
            </div>
        )
    }

    paidByAffiliateFeesView() {
        const { byBadgeBtnAffiliate, byPoolBtnAffiliate, inputFieldsAffiliateOrgByPool } = this.props.umpirePaymentSettingState
        return (
            <div>
                <span className='text-heading-large pt-3'>{AppConstants.fees}</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Checkbox
                        className="single-checkbox"
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'byBadgeBtnAffiliate'
                        })}
                        checked={byBadgeBtnAffiliate}
                    >
                        {'By Badge'}
                    </Checkbox>

                    {byBadgeBtnAffiliate && (
                        <div>
                            {this.byBadgeViewAffiliate()}
                        </div>
                    )}
                    <Checkbox
                        className="single-checkbox ml-0"
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'byPoolBtnAffiliate'
                        })}
                        checked={byPoolBtnAffiliate}
                    >
                        {'By Pool'}
                    </Checkbox>
                    {byPoolBtnAffiliate &&
                    // <div>
                    //     {this.byPoolViewAffiliate()}
                    // </div>

                    <div>
                        {/* {this.byPoolView()} */}
                        {
                            inputFieldsAffiliateOrgByPool.length > 0 && inputFieldsAffiliateOrgByPool.map((item, index) => {
                                return (
                                    <div key={"inputFieldsAffiliateOrgByPool" + index}>
                                        {this.inputFieldsForAffiliateByPool(item, index)}
                                    </div>
                                )
                            })}

                        {/* <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'addAnotherInputFieldsAffiliateOrgByPool' })} className={'input-heading-add-another pointer pt-0 mt-3'}>+ {AppConstants.addAnotherGroup}</span> */}
                    </div>
                    }
                </div>
            </div>
        )
    }

    inputFieldsForAffiliateByPool = (item, index) => {
        const { inputFieldsAffiliateOrgByPool } = this.props.umpirePaymentSettingState
        return (
            <div>
                <div className="row pt-3">
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='new-password'
                            heading={AppConstants.name}
                            placeholder={"Name"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'name',
                                subkey: "inputFieldsAffiliateOrgByPool"
                            })}
                            value={inputFieldsAffiliateOrgByPool[index].name}
                        />
                    </div>
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='off'
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireRate}
                            placeholder={"Umpire Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'umpireRate',
                                subkey: "inputFieldsAffiliateOrgByPool"
                            })}
                            value={inputFieldsAffiliateOrgByPool[index].umpireRate}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='off'
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireResRate}
                            placeholder={"Umpire Reserve Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'umpReserveRate',
                                subkey: "inputFieldsAffiliateOrgByPool"
                            })}
                            value={inputFieldsAffiliateOrgByPool[index].umpReserveRate}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='off'
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireCoachrate}
                            placeholder={"Umpire Coach Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'umpCoachRate',
                                subkey: "inputFieldsAffiliateOrgByPool"
                            })}
                            value={inputFieldsAffiliateOrgByPool[index].umpCoachRate}
                        />
                    </div>

                    {/* <div className="col-sm-1 umpire-delete-image-view">
                        <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'removeinputFieldsAffiliateOrgByPool', index: index })} className="user-remove-btn mt-3"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                    </div> */}
                </div>
            </div>
        )
    }

    byBadgeView = () => {
        const { inputFieldArray, byBadgeDivision, allDivisionBadge, compOrgDiv } = this.props.umpirePaymentSettingState
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
                    <Checkbox checked={allDivisionBadge} onChange={(e) => this.props.umpirePaymentSettingUpdate({
                        value: e.target.checked,
                        key: 'allDivisionBadge'
                    })}>
                        {AppConstants.allDivisions}
                    </Checkbox>
                    {allDivisionBadge == false && (
                        <Select
                            mode='multiple'
                            placeholder="Select"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182, marginTop: 20 }}
                            onChange={(divisionId) => this.props.umpirePaymentSettingUpdate({
                                value: divisionId,
                                key: 'byBadgeDivision'
                            })}
                            value={byBadgeDivision}
                        >
                            {compOrgDiv.map((item) => (
                                <Option key={"compOrgDiv" + item.id} disabled={item.disabled} value={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    )}
                </div>
                {/* <div> */}
                {inputFieldArray.length > 0 && inputFieldArray.map((item, index) => (
                    <div key={"inputFieldArray" + index}>
                        {this.inputFields(item, index)}
                    </div>
                ))}
                {/* <div style={{ marginTop: inputFieldArray.length === 0 ? null : -35 }}> */}
                {/* <div>
                    <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'addAnotherGroup' })} className={'input-heading-add-another pointer pt-0 mt-3'}>+ {AppConstants.addAnotherGroup}</span>
                </div> */}
                {/* </div> */}
            </div>
        )
    }

    byBadgeViewAffiliate = () => {
        const { inputFieldArrayAffiliate, byBadgeDivisionAffiliate, allDivisionBadgeAffiliate, affiliateDiv } = this.props.umpirePaymentSettingState
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
                    <Checkbox
                        checked={allDivisionBadgeAffiliate}
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({
                            value: e.target.checked,
                            key: 'allDivisionBadgeAffiliate'
                        })}
                    >
                        {AppConstants.allDivisions}
                    </Checkbox>
                    {allDivisionBadgeAffiliate == false && (
                        <Select
                            mode='multiple'
                            placeholder="Select"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182, marginTop: 20 }}
                            onChange={(divisionId) => this.props.umpirePaymentSettingUpdate({
                                value: divisionId,
                                key: 'byBadgeDivisionAffiliate'
                            })}
                            value={byBadgeDivisionAffiliate}
                        >
                            {affiliateDiv.map((item, index) => (
                                <Option key={"affiliateDiv" + index} disabled={item.disabled} value={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    )}
                </div>
                {/* <div> */}
                {inputFieldArrayAffiliate.length > 0 && inputFieldArrayAffiliate.map((item, index) => (
                    <div key={"inputFieldArrayAffiliate" + index}>
                        {this.inputFieldsAffiliate(item, index)}
                    </div>
                ))}
                {/* <div style={{ marginTop: inputFieldArray.length === 0 ? null : -35 }}> */}
                {/* <div>
                    <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'addAnotherGroupAffiliate' })} className={'input-heading-add-another pointer pt-0 mt-3'}>+ {AppConstants.addAnotherGroup}</span>
                </div> */}
                {/* </div> */}
            </div>
        )
    }

    byPoolView = () => {
        const { poolViewArray } = this.props.umpirePaymentSettingState
        return (
            <div>
                {poolViewArray.length > 0 && poolViewArray.map((item, index) => (
                    <div className='row'>
                        <div className='col-sm-2 pt-5'>
                            <InputWithHead heading={"Pool Name"} />
                        </div>
                        <div className='col-sm-4 pt-5'>
                            <InputWithHead
                                auto_complete='off'
                                type='number'
                                onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                    value: e.target.value,
                                    index: index,
                                    key: 'fee',
                                    subkey: "feeField"
                                })}
                                prefix="$"
                                value={item.fee}
                                placeholder={"Fee"}
                            />
                        </div>
                        {/* <div className="col-sm-1 umpire-delete-image-view">
                            <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'removeItemPool', index: index })} className="user-remove-btn mt-3"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                        </div> */}
                    </div>
                ))}
                <div>
                    <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'addPoolFee' })}
                          className={'input-heading-add-another pointer pt-0 mt-3'}>+ {AppConstants.addAnotherPool}</span>
                </div>
            </div>
        )
    }

    byPoolViewAffiliate = () => {
        const { poolViewArrayAffiliate } = this.props.umpirePaymentSettingState
        return (
            <div>
                {poolViewArrayAffiliate.length > 0 && poolViewArrayAffiliate.map((item, index) => (
                    <div className='row'>
                        <div className='col-sm-2 pt-5'>
                            <InputWithHead heading={"Pool Name"} />
                        </div>
                        <div className='col-sm-4 pt-5'>
                            <InputWithHead
                                auto_complete='off'
                                type='number'
                                onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                    value: e.target.value,
                                    index: index,
                                    key: 'fee',
                                    subkey: "feeFieldAffiliae"
                                })}
                                prefix="$"
                                value={item.fee}
                                placeholder={"Fee"}
                            />
                        </div>
                        {/* <div className="col-sm-1 umpire-delete-image-view">
                            <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'removeItemPoolAffiliate', index: index })} className="user-remove-btn mt-3"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                        </div> */}
                    </div>
                ))}

                <div>
                    <span onClick={() => this.props.umpirePaymentSettingUpdate({
                        value: null,
                        key: 'addPoolFeeAffiliate'
                    })} className={'input-heading-add-another pointer pt-0 mt-3'}>+ {AppConstants.addAnotherPool}</span>
                </div>
            </div>
        )
    }

    inputFields = (item, index) => {
        const { inputFieldArray } = this.props.umpirePaymentSettingState
        return (
            <div>
                <div className="row pt-3">
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='new-password'
                            heading={AppConstants.name}
                            placeholder={"Name"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'name'
                            })}
                            value={inputFieldArray[index].name}
                        />
                    </div>
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='off'
                            prefix="$"
                            type="number"
                            step=".01"
                            heading={AppConstants.umpireRate}
                            placeholder={"Umpire Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'umpireRate'
                            })}
                            value={inputFieldArray[index].umpireRate}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='off'
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireResRate}
                            placeholder={"Umpire Reserve Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'umpReserveRate'
                            })}
                            value={inputFieldArray[index].umpReserveRate}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='off'
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireCoachrate}
                            placeholder={"Umpire Coach Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'umpCoachRate'
                            })}
                            value={inputFieldArray[index].umpCoachRate}
                        />
                    </div>

                    {/* <div className="col-sm-1 umpire-delete-image-view">
                        <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'removeItem', index: index })} className="user-remove-btn mt-3"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                    </div> */}
                </div>
            </div>
        )
    }

    inputFieldsAffiliate = (item, index) => {
        const { inputFieldArrayAffiliate } = this.props.umpirePaymentSettingState
        return (
            <div>
                <div className="row pt-3">
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='new-password'
                            heading={AppConstants.name}
                            placeholder={"Name"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'name',
                                subkey: "inputFieldAffiliate"
                            })}
                            value={inputFieldArrayAffiliate[index].name}
                        />
                    </div>
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='off'
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireRate}
                            placeholder={"Umpire Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'umpireRate',
                                subkey: "inputFieldAffiliate"
                            })}
                            value={inputFieldArrayAffiliate[index].umpireRate}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='off'
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireResRate}
                            placeholder={"Umpire Reserve Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'umpReserveRate',
                                subkey: "inputFieldAffiliate"
                            })}
                            value={inputFieldArrayAffiliate[index].umpReserveRate}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_complete='off'
                            prefix="$"
                            type="number"
                            heading={AppConstants.umpireCoachrate}
                            placeholder={"Umpire Coach Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({
                                value: e.target.value,
                                index: index,
                                key: 'umpCoachRate',
                                subkey: "inputFieldAffiliate"
                            })}
                            value={inputFieldArrayAffiliate[index].umpCoachRate}
                        />
                    </div>

                    {/* <div className="col-sm-1 umpire-delete-image-view">
                        <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'removeItemAffiliate', index: index })} className="user-remove-btn mt-3"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                    </div> */}
                </div>
            </div>
        )
    }

    ////////form content view
    contentView_1 = () => {
        let defaultChecked = this.props.umpireSettingState.defaultChecked
        return (
            <div className="content-view pt-4">
                {this.umpireAllocationRadioView()}
                <span className='text-heading-large pt-5'>{AppConstants.umpirePreferences}</span>
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead required="pt-0" heading={AppConstants.noOfMatches + 'Umpire/day'} />
                        <Select
                            placeholder="Select"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        >
                            <Option value={"11111"}>{'1'}</Option>
                            <Option value={"22222"}>{'2'}</Option>
                            <Option value={"33333"}>{'3'}</Option>
                        </Select>
                    </div>
                    <div className="col-sm">
                        <InputWithHead required="pt-0" heading={AppConstants.timeBetweenUmpireMatch} />
                        <TimePicker
                            className="comp-venue-time-timepicker"
                            style={{ width: "100%" }}
                            defaultOpenValue={moment("00:00", "HH:mm")}
                            defaultValue={moment()}
                            format={"HH:mm"}
                        />
                    </div>
                </div>
                <span className='text-heading-large pt-5'>{AppConstants.umpireReservePref}</span>
                <Checkbox
                    className="single-checkbox pt-2"
                    checked={defaultChecked.reserveChecked}
                    onChange={(e) => this.props.updateUmpireDataAction(e.target.checked, "reserveChecked")}
                >
                    {AppConstants.activeUmpireReserves}
                </Checkbox>
                {defaultChecked.reserveChecked === true && (
                    <div className='row'>
                        <div className="col-sm">
                            <InputWithHead required={"pt-5"} heading={AppConstants.noOfMatches + 'Reserve/day'} />
                            <Select
                                placeholder="Select"
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            >
                                <Option value="11">{'1'}</Option>
                                <Option value={"22"}>{'2'}</Option>
                                <Option value={"33"}>{'3'}</Option>
                            </Select>
                        </div>

                        <div className="col-sm">
                            <InputWithHead required={"pt-5"} heading={AppConstants.reserveAllocationTiming} />
                            <Select
                                placeholder="Select"
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            >
                                <Option value={"before"}>{'Before'}</Option>
                                <Option value={"inBetween"}>{'In-between'}</Option>
                                <Option value={"after"}>{'After'}</Option>
                            </Select>
                        </div>
                    </div>
                )}

                <span className='text-heading-large pt-5'>{AppConstants.umpireCoach}</span>
                <Checkbox
                    className="single-checkbox pt-2"
                    checked={defaultChecked.coachChecked}
                    onChange={(e) => this.props.updateUmpireDataAction(e.target.checked, "coachChecked")}
                >
                    {AppConstants.activeUmpireCoach}
                </Checkbox>
                {defaultChecked.coachChecked === true && (
                    <div className='row'>
                        <div className="col-sm">
                            <InputWithHead required={"pt-5"} heading={AppConstants.noOfMatches + 'Coach/day'} />
                            <Select
                                placeholder="Select"
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead required={"pt-5"} heading={'Number of Matches an Umpire coach can perform in a row'} />
                            <Select
                                placeholder="Select"
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            >
                                <Option value={"111"}>{'1'}</Option>
                                <Option value={"222"}>{'2'}</Option>
                                <Option value={"333"}>{'3'}</Option>
                            </Select>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
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
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction,
        umpirePaymentSettingUpdate
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpirePaymentSettingState: state.UmpirePaymentSettingState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpirePaymentSetting);
