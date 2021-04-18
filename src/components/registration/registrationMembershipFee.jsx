import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentYear } from 'util/permissions';
import {
  Layout,
  Input,
  Select,
  Checkbox,
  DatePicker,
  Button,
  Table,
  Radio,
  Tabs,
  Form,
  Modal,
  message,
  Tooltip,
  InputNumber,
} from 'antd';
import CustomTooltip from 'react-png-tooltip';
import moment from 'moment';

import './product.scss';
import InputWithHead from '../../customComponents/InputWithHead';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
import {
  getAllowTeamRegistrationTypeAction,
  membershipPaymentOptionAction,
} from '../../store/actions/commonAction/commonAction';
import {
  regGetMembershipProductDetailsAction,
  regSaveMembershipProductDetailsAction,
  regGetDefaultMembershipProductTypesAction,
  regSaveMembershipProductFeesAction,
  regSaveMembershipProductDiscountAction,
  membershipFeesTableInputChangeAction,
  membershipProductDiscountTypesAction,
  addNewMembershipTypeAction,
  addRemoveDiscountAction,
  updatedDiscountDataAction,
  membershipFeesApplyRadioAction,
  onChangeAgeCheckBoxAction,
  updatedMembershipTypeDataAction,
  removeCustomMembershipTypeAction,
  regMembershipListDeleteAction,
} from '../../store/actions/registrationAction/registration';
import {
  getOnlyYearListAction,
  getProductValidityListAction,
  getMembershipProductFeesTypeAction,
  getCommonDiscountTypeTypeAction,
} from '../../store/actions/appAction';
import history from '../../util/history';
import ValidationConstants from '../../themes/validationConstant';
import { isArrayNotEmpty, isNotNullOrEmptyString } from '../../util/helpers';
import Loader from '../../customComponents/loader';
import { routePermissionForOrgLevel } from '../../util/permissions';
import { captializedString } from '../../util/helpers';
import { getGlobalYear, setGlobalYear } from 'util/sessionStorage';

const { Footer, Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;
const { confirm } = Modal;

let this_Obj = null;

const columns = [
  {
    title: AppConstants.type,
    dataIndex: 'membershipProductTypeRefName',
    key: 'membershipProductTypeRefName',
  },
  {
    title: AppConstants.membershipProduct,
    dataIndex: 'membershipProductName',
    key: 'membershipProductName',
  },
  {
    title: AppConstants.casualFeeExclGst,
    dataIndex: 'casualFee',
    key: 'casualFee',
    filterDropdown: true,
    filterIcon: () => {
      return (
        <CustomTooltip placement="top">
          <span>{AppConstants.membershipCasualFeeMsg}</span>
        </CustomTooltip>
      );
    },
    render: (casualFee, record) => (
      <Input
        type="number"
        prefix="$"
        className="input-inside-table-fees"
        value={casualFee}
        onChange={e =>
          this_Obj.props.membershipFeesTableInputChangeAction(e.target.value, record, 'casualFee')
        }
        //disabled={this_Obj.state.membershipIsUsed}
      />
    ),
  },
  {
    title: AppConstants.gst,
    dataIndex: 'casualGst',
    key: 'casualGst',
    render: (casualFeeGst, record) => (
      <Input
        type="number"
        prefix="$"
        className="input-inside-table-fees"
        value={casualFeeGst}
        onChange={e =>
          this_Obj.props.membershipFeesTableInputChangeAction(e.target.value, record, 'casualGst')
        }
        //disabled={this_Obj.state.membershipIsUsed}
      />
    ),
  },
  {
    title: AppConstants.seasonalFee + ' (excl. GST)',
    dataIndex: 'seasonalFee',
    key: 'seasonalFee',
    filterDropdown: true,
    filterIcon: () => {
      return (
        <CustomTooltip placement="top">
          <span>{AppConstants.membershipSeasonalFeeMsg}</span>
        </CustomTooltip>
      );
    },
    render: (seasonalFee, record) => (
      <Input
        type="number"
        prefix="$"
        className="input-inside-table-fees"
        value={seasonalFee}
        onChange={e =>
          this_Obj.props.membershipFeesTableInputChangeAction(e.target.value, record, 'seasonalFee')
        }
        //disabled={this_Obj.state.membershipIsUsed}
      />
    ),
  },
  {
    title: AppConstants.gst,
    dataIndex: 'seasonalGst',
    key: 'seasonalGst',
    render: (seasonalFeeGst, record) => (
      <Input
        type="number"
        prefix="$"
        className="input-inside-table-fees"
        value={seasonalFeeGst}
        onChange={e =>
          this_Obj.props.membershipFeesTableInputChangeAction(e.target.value, record, 'seasonalGst')
        }
        //disabled={this_Obj.state.membershipIsUsed}
      />
    ),
  },
];

class RegistrationMembershipFee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yearRefId: null,
      onYearLoad: false,
      value: 1,
      discountType: 0,
      membershipTabKey: '1',
      membershipProductSelected: [],
      discountMembershipType: 'Select',
      selectedMemberShipType: [],
      discountMembershipTypeData: [],
      visible: false,
      newNameMembershipType: '',
      statusRefId: 1,
      loading: false,
      buttonPressed: 'next',
      membershipIsUsed: false,
      confirmRePayFeesModalVisible: false,
      isPublished: false,
      tooltipVisibleDraft: false,
      isActivatedDiscountService: false,
      addNew: this.props.location.state
        ? this.props.location.state.addNew
          ? this.props.location.state.addNew
          : null
        : null,
    };
    this_Obj = this;
    this.formRef = React.createRef();
  }

  componentDidMount() {
    routePermissionForOrgLevel(AppConstants.national, AppConstants.state);
    let productId = null;
    productId = this.props.location.state ? this.props.location.state.id : null;
    this.apiCalls(productId);
    this.setFieldDecoratorValues();
  }

  componentDidUpdate(prevState) {
    let registrationState = this.props.registrationState;
    let allData = registrationState.getMembershipProductDetails;
    if (
      registrationState.getMembershipProductDetails !==
      prevState.registrationState.getMembershipProductDetails
    ) {
      let discountMembershipTypeData =
        allData.membershipproduct.membershipProductTypes !== undefined
          ? allData.membershipproduct.membershipProductTypes
          : [];
      let membershipIsUsed = allData.membershipproduct.isUsed;
      let isPublished = allData.membershipproduct.statusRefId == 2 ? true : false;
      this.setFieldDecoratorValues();
      this.setState({
        discountMembershipTypeData,
        membershipIsUsed,
        isPublished,
      });
    }
    if (registrationState.onLoad === false && this.state.loading === true) {
      this.setState({ loading: false });
      if (!registrationState.error) {
        this.setState({
          // loading: false,
          //membershipTabKey: this.state.buttonPressed === "next" && JSON.stringify(JSON.parse(this.state.membershipTabKey) + 1)
          membershipTabKey: JSON.stringify(JSON.parse(this.state.membershipTabKey) + 1),
        });
        setTimeout(() => {
          if (this.state.isActivatedDiscountService == true) {
            if (
              this.state.buttonPressed === 'save' ||
              this.state.buttonPressed === 'publish' ||
              this.state.buttonPressed === 'delete'
            ) {
              history.push('/registrationMembershipList');
            }
          } else {
            if (this.state.membershipTabKey == '3') {
              this.saveMembershipProductDetails();
            } else if (this.state.membershipTabKey == '2' && this.state.addNew) {
              let data = registrationState.membershipProductFeesTableData;
              let feesData = data
                ? data.membershipFees.length > 0
                  ? data.membershipFees
                  : []
                : [];
              for (let index in feesData) {
                this.membershipFeeApplyRadio(365, index, 'validityDays');
              }
            }
          }
        }, 300);
      }
    }
    if (this.state.onYearLoad == true && this.props.appState.onLoad == false) {
      if (this.props.appState.yearList.length > 0) {
        // let mainYearRefId = getCurrentYear(this.props.appState.yearList)
        this.setState({
          onYearLoad: false,
        });
        this.setFieldDecoratorValues();
      }
    }
  }

  apiCalls = productId => {
    this.props.getOnlyYearListAction(this.props.appState.yearList);
    this.setState({ onYearLoad: true });
    this.props.getProductValidityListAction();
    if (productId == null) {
      this.props.regGetDefaultMembershipProductTypesAction();
    }
    if (productId !== null) {
      this.props.regGetMembershipProductDetailsAction(productId); /////get the membership product details
    }
    this.props.getMembershipProductFeesTypeAction();
    this.props.getCommonDiscountTypeTypeAction();
    this.props.membershipProductDiscountTypesAction();
    this.props.getAllowTeamRegistrationTypeAction();
    this.props.membershipPaymentOptionAction();
  };

  saveMembershipProductDetails = values => {
    let productId = this.props.registrationState.membershipProductId;

    if (this.state.membershipTabKey == '1') {
      const { yearRefId, membershipProductName, validityRefId } = values;
      let membershipTypesData = JSON.parse(
        JSON.stringify(this.props.registrationState.getDefaultMembershipProductTypes),
      );
      let finalMembershipTypes = [];
      membershipTypesData.map(item => {
        if (item.isMemebershipType) {
          if (item.membershipProductTypeRefId > 0) {
            delete item['membershipProductTypeRefName'];
          }
          finalMembershipTypes.push(item);
        }
        return item;
      });
      let productBody = {
        membershipProductId: productId,
        yearRefId: yearRefId,
        statusRefId: this.state.statusRefId,
        validityRefId: validityRefId,
        membershipProductName: membershipProductName,
        membershipProductTypes: finalMembershipTypes,
      };
      if (productBody.membershipProductTypes.length > 0) {
        this.props.regSaveMembershipProductDetailsAction(productBody);
        this.setState({ loading: true });
      } else {
        message.error(ValidationConstants.pleaseSelectMembershipTypes);
      }
    } else if (this.state.membershipTabKey == '2') {
      let finalMembershipFeesData = JSON.parse(
        JSON.stringify(this.props.registrationState.membershipProductFeesTableData),
      );
      if (finalMembershipFeesData.isAlreadyRegistered == 1 && this.state.membershipIsUsed == true) {
        this.setState({ confirmRePayFeesModalVisible: true });
      } else {
        finalMembershipFeesData.membershipFees.map(item => {
          delete item['membershipProductName'];
          delete item['membershipProductTypeRefName'];
          return item;
        });
        this.props.regSaveMembershipProductFeesAction(finalMembershipFeesData);
        this.setState({ loading: true });
      }
    } else if (this.state.membershipTabKey == '3') {
      let errMsg = null;
      let discountData = JSON.parse(
        JSON.stringify(
          this.props.registrationState.membershipProductDiscountData.membershipProductDiscounts[0]
            .discounts,
        ),
      );

      let disMap = new Map();
      let discountDuplicateError = false;
      for (let item of discountData) {
        let key = null;
        if (item.membershipPrdTypeDiscountTypeRefId == 2) {
          key =
            item.membershipProductTypeMappingId +
            '#' +
            item.membershipPrdTypeDiscountTypeRefId +
            '#' +
            item.discountCode;
        } else if (item.membershipPrdTypeDiscountTypeRefId == 3) {
          key =
            item.membershipProductTypeMappingId +
            '#' +
            item.membershipPrdTypeDiscountTypeRefId +
            '#' +
            item.discountCode;
        }
        if (disMap.get(key) == undefined) {
          disMap.set(key, 1);
        } else {
          if (item.membershipPrdTypeDiscountTypeRefId == 3) {
            errMsg = ValidationConstants.membershipDuplicateFamilyDiscountError;
          } else {
            errMsg = ValidationConstants.duplicateDiscountError;
          }
          discountDuplicateError = true;
          break;
        }
        if (item.childDiscounts) {
          if (item.childDiscounts.length === 0) {
            item.childDiscounts = null;
          }
          if (item.membershipPrdTypeDiscountTypeRefId !== 3) {
            item.childDiscounts = null;
          }
        }
        item.applyDiscount = parseInt(item.applyDiscount);
        if (item.amount !== null) {
          if (item.amount.length > 0) {
            item.amount = parseInt(item.amount);
          } else {
            item['amount'] = null;
          }
        } else {
          item['amount'] = null;
        }
        // return item
      }
      let discountBody = {
        membershipProductId: productId,
        statusRefId: this.state.statusRefId,
        membershipProductDiscounts: [
          {
            discounts: discountData,
          },
        ],
      };
      if (discountDuplicateError) {
        message.config({ duration: 0.9, maxCount: 1 });
        message.error(errMsg);
      } else {
        this.props.regSaveMembershipProductDiscountAction(discountBody);
        this.setState({ loading: true, isActivatedDiscountService: true });
      }
    }
  };

  setFieldDecoratorValues = () => {
    let allData = this.props.registrationState.getMembershipProductDetails;
    let membershipProductData = allData !== null ? allData.membershipproduct : [];
    let yearRefId = membershipProductData.yearRefId
      ? membershipProductData.yearRefId
      : this.props.appState.yearList.length > 0
      ? getGlobalYear()
        ? JSON.parse(getGlobalYear())
        : getCurrentYear(this.props.appState.yearList)
      : 1;
    this.formRef.current.setFieldsValue({
      yearRefId: yearRefId,
      membershipProductName: membershipProductData.membershipProductName,
      validityRefId: membershipProductData.ValidityRefId ? membershipProductData.ValidityRefId : 2,
    });
    setGlobalYear(yearRefId);
    let typesData = membershipProductData.membershipProductTypes
      ? membershipProductData.membershipProductTypes
      : [];
    if (typesData.length > 0) {
      typesData.forEach((item, index) => {
        let dobFrom = `dobFrom${index}`;
        let dobTo = `dobTo${index}`;
        let allowTeamRegistrationTypeRefId = `allowTeamRegistrationTypeRefId${index}`;
        if (isNotNullOrEmptyString(item.dobFrom)) {
          this.formRef.current.setFieldsValue({
            [dobFrom]: moment(item.dobFrom),
            [dobTo]: moment(item.dobTo),
          });
        }
        this.formRef.current.setFieldsValue({
          [allowTeamRegistrationTypeRefId]: item.allowTeamRegistrationTypeRefId,
        });
      });
    }
    let data = this.props.registrationState.membershipProductDiscountData;
    let discountData =
      data && data.membershipProductDiscounts !== null
        ? data.membershipProductDiscounts[0].discounts
        : [];
    discountData.forEach((item, index) => {
      let membershipProductTypeMappingId = `membershipProductTypeMappingId${index}`;
      let membershipPrdTypeDiscountTypeRefId = `membershipPrdTypeDiscountTypeRefId${index}`;
      this.formRef.current.setFieldsValue({
        [membershipProductTypeMappingId]: item.membershipProductTypeMappingId,
        [membershipPrdTypeDiscountTypeRefId]: item.membershipPrdTypeDiscountTypeRefId,
      });
      let childDiscounts =
        item.childDiscounts !== null && item.childDiscounts.length > 0 ? item.childDiscounts : [];
      childDiscounts.forEach((childItem, childindex) => {
        let childDiscountPercentageValue = `percentageValue${index} + ${childindex}`;
        this.formRef.current.setFieldsValue({
          [childDiscountPercentageValue]: childItem.percentageValue,
        });
      });
    });

    let membershipProductFeesTableData = this.props.registrationState
      .membershipProductFeesTableData;
    let feesData = membershipProductFeesTableData
      ? membershipProductFeesTableData.membershipFees.length > 0
        ? membershipProductFeesTableData.membershipFees
        : []
      : [];
    for (let i in feesData) {
      if (feesData[i].membershipProductFeesTypeRefId == 1) {
        if (feesData[i].extendEndDate) {
          this.membershipFeeApplyRadio(true, i, 'isNeedExtendedDate');
        }
        this.formRef.current.setFieldsValue({
          // [`validityDays${i}`]: feesData[i].validityDays ? feesData[i].validityDays : null,
          [`extendEndDate${i}`]: feesData[i].extendEndDate
            ? moment(feesData[i].extendEndDate, 'YYYY-MM-DD')
            : null,
        });
      }
    }
  };

  //////delete the membership product
  showDeleteConfirm = () => {
    let membershipProductId = this.props.registrationState.membershipProductId;
    let this_ = this;
    confirm({
      titie: AppConstants.productDeleteConfirmMsg,
      // content: 'Some descriptions',
      okText: AppConstants.yes,
      okType: AppConstants.primary,
      cancelText: AppConstants.no,
      onOk() {
        if (membershipProductId.length > 0) {
          this_.deleteProduct(membershipProductId);
        }
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };

  deleteProduct = membershipProductId => {
    this.setState({ loading: true, buttonPressed: 'delete' });
    this.props.regMembershipListDeleteAction(membershipProductId);
  };

  /////selection of membership fees type
  membershipTypesAndAgeSelected(checkedValue, index, keyword) {
    this.props.onChangeAgeCheckBoxAction(index, checkedValue, keyword);
  }

  dropdownView = () => {
    return (
      <div className="comp-venue-courts-dropdown-view mt-5">
        <div className="fluid-width">
          <div className="row">
            <div className="col-sm">
              <div className="w-ft d-flex flex-row align-items-center">
                <span className="year-select-heading required-field">{AppConstants.year}:</span>
                <Form.Item
                  name="yearRefId"
                  rules={[{ required: true, message: ValidationConstants.pleaseSelectYear }]}
                >
                  <Select className="year-select reg-filter-select1 ml-2" style={{ maxWidth: 80 }}>
                    {this.props.appState.yearList.map(item => (
                      <Option key={'year_' + item.id} value={item.id}>
                        {item.description}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  handleOk = e => {
    let newObj = {
      dobTo: null,
      dobFrom: null,
      membershipProductTypeRefId: 0,
      membershipProductTypeRefName: this.state.newNameMembershipType,
      membershipProductTypeMappingId: 0,
      isDefault: 0,
      isPlaying: 0,
      allowTeamRegistrationTypeRefId: null,
    };
    this.props.addNewMembershipTypeAction(newObj);
    this.setState({
      visible: false,
      newNameMembershipType: '',
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  ///add another membershipType
  addAnothermembershipType = () => {
    this.setState({ visible: true });
  };

  ///setting the mandate age restriction from date
  dateOnChangeFrom = (date, index) => {
    let dateFrom = moment(date).format('YYYY-MM-DD');
    let membershipTypeData = this.props.registrationState.getDefaultMembershipProductTypes;
    membershipTypeData[index].dobFrom = dateFrom;
    this.props.updatedMembershipTypeDataAction(membershipTypeData);
  };

  ////setting the mandate age restriction to date
  dateOnChangeTo = (date, index) => {
    let dobTo = moment(date).format('YYYY-MM-DD');
    let membershipTypeData = this.props.registrationState.getDefaultMembershipProductTypes;
    membershipTypeData[index].dobTo = dobTo;
    this.props.updatedMembershipTypeDataAction(membershipTypeData);
  };

  allowTeamRegistrationPlayer = (checkedValue, index, keyword) => {
    let allowTeamRegistration = checkedValue;
    let membershipTypeData = this.props.registrationState.getDefaultMembershipProductTypes;
    membershipTypeData[index][keyword] = allowTeamRegistration;
    this.props.updatedMembershipTypeDataAction(membershipTypeData);
  };

  //////dynamic membership type view
  membershipTypesView = () => {
    try {
      let registrationState = this.props.registrationState;
      const defaultTypes =
        registrationState.getDefaultMembershipProductTypes !== null
          ? registrationState.getDefaultMembershipProductTypes
          : [];
      // let allData = this.props.registrationState.getMembershipProductDetails
      let { allowTeamRegistration } = this.props.commonReducerState;
      return (
        <div>
          <span className="applicable-to-heading">{AppConstants.membershipTypes}</span>

          {defaultTypes.map((item, index) => {
            return (
              <div key={index} className="prod-reg-inside-container-view">
                <div className="row">
                  <div className="col-sm">
                    <Checkbox
                      className="single-checkbox pt-3"
                      checked={item.isMemebershipType}
                      onChange={e =>
                        this.membershipTypesAndAgeSelected(
                          e.target.checked,
                          index,
                          'isMemebershipType',
                        )
                      }
                      key={index}
                      disabled={this.state.membershipIsUsed}
                    >
                      {item.membershipProductTypeRefName}
                    </Checkbox>
                  </div>
                  {(item.membershipProductTypeRefId > 4 ||
                    item.membershipProductTypeRefId == 0) && (
                    <div
                      className="col-sm transfer-image-view pt-4"
                      onClick={() =>
                        !this.state.membershipIsUsed
                          ? this.props.removeCustomMembershipTypeAction(index)
                          : null
                      }
                    >
                      <div className="removeAction">
                        <span className="user-remove-btn">
                          <i className="fa fa-trash-o" aria-hidden="true" />
                        </span>
                        <span className="user-remove-text mr-0">{AppConstants.remove}</span>
                      </div>
                    </div>
                  )}
                </div>
                {item.isMemebershipType && (
                  <div className="reg-membership-fee-mandate-check-view">
                    <div className="colsm-">
                      {item.isDefault == 0 && (
                        <Checkbox
                          className="single-checkbox"
                          checked={item.isPlaying}
                          onChange={e =>
                            this.membershipTypesAndAgeSelected(e.target.checked, index, 'isPlaying')
                          }
                          disabled={this.state.membershipIsUsed}
                        >
                          {AppConstants.playerConst}
                        </Checkbox>
                      )}
                    </div>
                    <Checkbox
                      className="single-checkbox w-100"
                      checked={item.isMandate}
                      onChange={e =>
                        this.membershipTypesAndAgeSelected(e.target.checked, index, 'isMandate')
                      }
                      disabled={this.state.membershipIsUsed}
                    >
                      {`Mandate ${item.membershipProductTypeRefName} Age Restrictions`}
                    </Checkbox>

                    {item.isMandate && (
                      <div className="fluid-width">
                        <div className="row">
                          <div className="col-sm">
                            <InputWithHead heading={AppConstants.dobFrom} />
                            <Form.Item
                              name={`dobFrom${index}`}
                              rules={[
                                {
                                  required: true,
                                  message: ValidationConstants.pleaseSelectDOBFrom,
                                },
                              ]}
                            >
                              <DatePicker
                                // size="large"
                                className="w-100"
                                onChange={date => this.dateOnChangeFrom(date, index)}
                                format="DD-MM-YYYY"
                                placeholder="dd-mm-yyyy"
                                showTime={false}
                                // defaultValue={item.dobFrom !== null ? moment(item.dobFrom) : null}
                                disabled={this.state.membershipIsUsed}
                                disabledDate={d => d.isSameOrAfter(item.dobTo)}
                              />
                            </Form.Item>
                          </div>
                          <div className="col-sm">
                            <InputWithHead heading={AppConstants.dobTo} />
                            <Form.Item
                              name={`dobTo${index}`}
                              rules={[
                                {
                                  required: true,
                                  message: ValidationConstants.PleaseSelectDOBTo,
                                },
                              ]}
                            >
                              <DatePicker
                                // size="large"
                                className="w-100"
                                onChange={date => this.dateOnChangeTo(date, index)}
                                format="DD-MM-YYYY"
                                placeholder="dd-mm-yyyy"
                                showTime={false}
                                // defaultValue={item.dobTo !== null ? moment(item.dobTo) : null}
                                disabled={this.state.membershipIsUsed}
                                // disabledDate={d => d.isSameOrBefore(item.dobFrom)}
                                disabledDate={d => moment(item.dobFrom).isSameOrAfter(d, 'day')}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    )}
                    {item.membershipProductTypeRefName != 'Player - NetSetGo' && (
                      <div className="fluid-width">
                        <Checkbox
                          className="single-checkbox ml-0"
                          checked={item.isAllow}
                          onChange={e =>
                            this.membershipTypesAndAgeSelected(e.target.checked, index, 'isAllow')
                          }
                          disabled={this.state.membershipIsUsed}
                        >
                          {AppConstants.allowTeamRegistration}
                        </Checkbox>
                      </div>
                    )}
                    {item.isPlaying != 1 && (
                      <Checkbox
                        className="single-checkbox ml-0"
                        checked={item.isChildrenCheckNumber}
                        onChange={e =>
                          this.membershipTypesAndAgeSelected(
                            e.target.checked,
                            index,
                            'isChildrenCheckNumber',
                          )
                        }
                        disabled={this.state.membershipIsUsed}
                      >
                        {AppConstants.childrenCheckNumber}
                      </Checkbox>
                    )}
                    {item.isAllow && item.isPlaying == 1 && (
                      <div className="fluid-width mt-10">
                        <div className="row">
                          <div className="col-sm" style={{ marginLeft: 25 }}>
                            <Form.Item
                              name={`allowTeamRegistrationTypeRefId${index}`}
                              rules={[
                                { required: true, message: ValidationConstants.playerTypeRequired },
                              ]}
                            >
                              <Radio.Group
                                className="reg-competition-radio"
                                onChange={e =>
                                  this.allowTeamRegistrationPlayer(
                                    e.target.value,
                                    index,
                                    'allowTeamRegistrationTypeRefId',
                                  )
                                }
                                value={item.allowTeamRegistrationTypeRefId}
                                disabled={this.state.membershipIsUsed}
                              >
                                {(allowTeamRegistration || []).map(fix => (
                                  <Radio key={'allowTeamRegistrationType_' + fix.id} value={fix.id}>
                                    {fix.description}
                                  </Radio>
                                ))}
                              </Radio.Group>
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <span
            className="input-heading-add-another"
            onClick={!this.state.membershipIsUsed ? this.addAnothermembershipType : null}
          >
            + {AppConstants.addMembershipType}
          </span>
          <Modal
            className="add-membership-type-modal"
            title={AppConstants.addMembershipType}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <InputWithHead
              auto_complete="new-membershipTypeName"
              required="pt-0 mt-0"
              heading={AppConstants.membershipTypeName}
              placeholder={AppConstants.pleaseEnterMembershipTypeName}
              onChange={e => this.setState({ newNameMembershipType: e.target.value })}
              value={this.state.newNameMembershipType}
            />
          </Modal>
        </div>
      );
    } catch (ex) {
      console.log('Error in membershipTypesView::' + ex);
    }
  };

  contentView = () => {
    // let appState = this.props.appState
    // let allData = this.props.registrationState.getMembershipProductDetails
    // let membershipProductData = allData !== null ? allData.membershipproduct : []
    return (
      <div className="content-view pt-5">
        <span className="form-heading">{AppConstants.membershipProduct}</span>

        <InputWithHead required="required-field pb-2" heading={AppConstants.year} />

        <Form.Item
          name="yearRefId"
          rules={[{ required: true, message: ValidationConstants.pleaseSelectYear }]}
        >
          <Select
            className="year-select reg-filter-select1"
            style={{ maxWidth: 80 }}
            onChange={e => setGlobalYear(e)}
            disabled={this.state.membershipIsUsed}
          >
            {this.props.appState.yearList.map(item => (
              <Option key={'year_' + item.id} value={item.id}>
                {item.description}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="membershipProductName"
          rules={[{ required: true, message: ValidationConstants.membershipProductIsRequired }]}
        >
          <InputWithHead
            auto_complete="new-membershipProductName"
            required="required-field pb-2"
            heading={AppConstants.membershipProductName}
            placeholder={AppConstants.membershipProductName}
            disabled={this.state.membershipIsUsed}
            conceptulHelp
            conceptulHelpMsg={AppConstants.membershipProductNameMsg}
            marginTop={5}
            onBlur={i =>
              this.formRef.current.setFieldsValue({
                membershipProductName: captializedString(i.target.value),
              })
            }
          />
        </Form.Item>

        {/* <div className="contextualHelp-RowDirection">
                    <span className="applicable-to-heading required-field">
                        {AppConstants.validity}
                    </span>
                    <div style={{ marginTop: 15 }}>
                        <Tooltip placement="top">
                            <span>{AppConstants.validityMsg}</span>
                        </Tooltip>
                    </div>
                </div> */}

        {/* <Form.Item name='validityRefId' rules={[{ required: true, message: ValidationConstants.pleaseSelectValidity }]}>
                    <Radio.Group
                        className="reg-competition-radio"
                        disabled={this.state.membershipIsUsed}
                    >
                        {appState.productValidityList.map(item => (
                            <div key={'productValidity_' + item.id}>
                                {item.id == "2" && (
                                    <Radio key={'validity_' + item.id} value={item.id}>{item.description}</Radio>
                                )}
                            </div>
                        ))}
                    </Radio.Group>
                </Form.Item> */}
        {this.membershipTypesView()}
      </div>
    );
  };

  ///membershipFees apply radio onchange
  membershipFeeApplyRadio = (radioApplyId, feesIndex, key) => {
    this.props.membershipFeesApplyRadioAction(radioApplyId, feesIndex, key);
  };

  dateConversion = (f, key, index) => {
    try {
      let date = moment(f, 'DD-MM-YYYY').format('MM-DD-YYYY');
      this.membershipFeeApplyRadio(date, index, key);
    } catch (ex) {
      console.log('Error in dateConversion::' + ex);
    }
  };

  ////fees view inside the content
  feesView = () => {
    let data = this.props.registrationState.membershipProductFeesTableData;
    let feesData = data ? (data.membershipFees.length > 0 ? data.membershipFees : []) : [];
    return (
      <div>
        <div className="tab-formView fees-view pt-5">
          <span className="form-heading">{AppConstants.membershipFees}</span>
          {feesData.map((item, index) => (
            <div className="inside-container-view" key={'feesData' + index}>
              <div className="table-responsive">
                <Table
                  className="fees-table"
                  columns={columns}
                  dataSource={[item]}
                  pagination={false}
                  Divider="false"
                />
              </div>
              <span className="applicable-to-heading">{AppConstants.applyMembershipFee}</span>
              <Radio.Group
                className="reg-competition-radio"
                onChange={e => this.membershipFeeApplyRadio(e.target.value, index)}
                defaultValue={item.membershipProductFeesTypeRefId}
                //disabled={this.state.membershipIsUsed}
              >
                {this.props.appState.membershipProductFeesTypes.map(feeTypeItem => (
                  <div>
                    <div className="row" key={'membershipProductFeesType_' + feeTypeItem.id}>
                      <Radio key={'membershipFee_' + feeTypeItem.id} value={feeTypeItem.id}>
                        {' '}
                        {feeTypeItem.description}
                      </Radio>

                      <div style={{ marginLeft: -18 }}>
                        <CustomTooltip>
                          <span>{feeTypeItem.helpMsg}</span>
                        </CustomTooltip>
                      </div>
                    </div>
                    {item.membershipProductFeesTypeRefId == 1 && feeTypeItem.id == 1 && (
                      <div className="validity-period-bg">
                        <span className="applicable-to-heading" style={{ paddingTop: 0 }}>
                          {AppConstants.minNoDays}
                        </span>
                        <div className="row" style={{ marginTop: 10, alignItems: 'center' }}>
                          <div className="col-md-6">
                            {/* <Form.Item
                                                            name={`validityDays${index}`}
                                                            rules={[{ required: true, message: ValidationConstants.daysRequired }]}
                                                        > */}
                            <InputWithHead
                              value={item.validityDays}
                              placeholder={AppConstants._days}
                              onChange={e =>
                                this.membershipFeeApplyRadio(
                                  e.target.value > -1 ? e.target.value : null,
                                  index,
                                  'validityDays',
                                )
                              }
                              // onBlur={(e) => {
                              //     this.formRef.current.setFieldsValue({
                              //         [`validityDays${index}`]: e.target.value >= 0 ? e.target.value : ""
                              //     })
                              // }}
                              type={'number'}
                              min={0}
                            />
                            {/* </Form.Item> */}
                          </div>
                          <div className="col-md-6 applicable-to-heading" style={{ paddingTop: 0 }}>
                            {AppConstants._days}
                          </div>
                        </div>
                        <Checkbox
                          onChange={e =>
                            this.membershipFeeApplyRadio(
                              e.target.checked,
                              index,
                              'isNeedExtendedDate',
                            )
                          }
                          checked={item.isNeedExtendedDate ? true : false}
                          style={{ marginTop: 10 }}
                          className="single-checkbox pt-3"
                        >
                          {AppConstants.extendEndDate}
                        </Checkbox>
                        {item.isNeedExtendedDate && (
                          <div style={{ marginLeft: 35, marginTop: 12 }}>
                            <Form.Item
                              name={`extendEndDate${index}`}
                              rules={[
                                {
                                  required: true,
                                  message: ValidationConstants.extendEndDateRequired,
                                },
                              ]}
                            >
                              <DatePicker
                                setFieldsValue={
                                  item.extendEndDate
                                    ? moment(item.extendEndDate, 'MM-DD-YYYY')
                                    : null
                                }
                                size="large"
                                placeholder={'dd-mm-yyyy'}
                                style={{ width: '100%' }}
                                onChange={(e, f) => this.dateConversion(f, 'extendEndDate', index)}
                                format={'DD-MM-YYYY'}
                                showTime={false}
                              />
                            </Form.Item>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </Radio.Group>
            </div>
          ))}
        </div>

        <div className="tab-formView fees-view pt-5">
          <span className="form-heading">{AppConstants.membershipFeesPaymentOptions}</span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: '500',
              fontFamily: 'inter-medium, sans-serif',
            }}
          >
            {AppConstants.whenPaymentsRequired}
          </span>
          <Radio.Group
            className="reg-competition-radio"
            //onChange={e => this.membershipFeeApplyRadio(e.target.value)}
            defaultValue={data?.paymentOptionRefId}
            //disabled={this.state.membershipIsUsed}
          >
            {this.props.commonReducerState.membershipPaymentOptions.map(item => (
              <div className="row pl-2" key={'membershipPaymentOption_' + item.id}>
                <Radio key={'paymentOption_' + item.id} value={item.id}>
                  {item.description}
                </Radio>
              </div>
            ))}
          </Radio.Group>
        </div>
      </div>
    );
  };

  discountViewChange = (item, index) => {
    let childDiscounts =
      item.childDiscounts !== null && item.childDiscounts.length > 0 ? item.childDiscounts : [];
    switch (item.membershipPrdTypeDiscountTypeRefId) {
      case 1:
        return (
          <div>
            <InputWithHead heading="Discount Type" />
            <Select
              className="w-100"
              style={{ paddingRight: 1, minWidth: 182 }}
              onChange={discountType => this.onChangeDiscountRefId(discountType, index)}
              placeholder="Select"
              value={item.discountTypeRefId}
              disabled={this.state.membershipIsUsed}
            >
              {this.props.appState.commonDiscountTypes.map(item => (
                <Option key={'discountType_' + item.id} value={item.id}>
                  {item.description}
                </Option>
              ))}
            </Select>
            <div className="row">
              <div className="col-sm">
                <InputWithHead heading={AppConstants.percentageOff_FixedAmount} />
                <InputNumber
                  auto_complete="new-number"
                  value={item.amount}
                  placeholder={AppConstants.percentageOff_FixedAmount}
                  min={0}
                  max={100}
                  formatter={value => `% ${value}`}
                  parser={value => value.replace('% ', '')}
                  onChange={value => this.onChangePercentageOff(value, index)}
                  disabled={this.state.membershipIsUsed}
                />
              </div>
              <div className="col-sm">
                <InputWithHead
                  auto_complete="new-gernalDiscount"
                  heading={AppConstants.description}
                  placeholder={AppConstants.generalDiscount}
                  onChange={e => this.onChangeDescription(e.target.value, index)}
                  value={item.description}
                  disabled={this.state.membershipIsUsed}
                />
              </div>
            </div>
            <div className="fluid-width">
              <div className="row">
                <div className="col-sm">
                  <InputWithHead heading={AppConstants.availableFrom} />
                  <DatePicker
                    // size="large"
                    className="w-100"
                    onChange={date => this.onChangeDiscountAvailableFrom(date, index)}
                    format="DD-MM-YYYY"
                    placeholder="dd-mm-yyyy"
                    showTime={false}
                    value={item.availableFrom !== null && moment(item.availableFrom)}
                    disabled={this.state.membershipIsUsed}
                  />
                </div>
                <div className="col-sm">
                  <InputWithHead heading={AppConstants.availableTo} />
                  <DatePicker
                    // size="large"
                    className="w-100"
                    disabledDate={this.disabledDate}
                    disabledTime={this.disabledTime}
                    onChange={date => this.onChangeDiscountAvailableTo(date, index)}
                    format="DD-MM-YYYY"
                    placeholder="dd-mm-yyyy"
                    showTime={false}
                    value={item.availableTo !== null && moment(item.availableTo)}
                    disabled={this.state.membershipIsUsed}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <InputWithHead heading="Discount Type" />
            <Select
              className="w-100"
              style={{ paddingRight: 1, minWidth: 182 }}
              onChange={discountType => this.onChangeDiscountRefId(discountType, index)}
              placeholder="Select"
              value={item.discountTypeRefId}
              disabled={this.state.membershipIsUsed}
            >
              {this.props.appState.commonDiscountTypes.map(item => (
                <Option key={'discountType_' + item.id} value={item.id}>
                  {item.description}
                </Option>
              ))}
            </Select>
            <InputWithHead
              auto_complete="new-code"
              heading={AppConstants.code}
              placeholder={AppConstants.code}
              onChange={e => this.onChangeDiscountCode(e.target.value, index)}
              value={item.discountCode}
              disabled={this.state.membershipIsUsed}
            />
            <div className="row">
              <div className="col-sm">
                <InputWithHead heading={AppConstants.percentageOff_FixedAmount} />
                <InputNumber
                  auto_complete="new-number"
                  value={item.amount}
                  placeholder={AppConstants.percentageOff_FixedAmount}
                  min={0}
                  max={100}
                  formatter={value => `% ${value}`}
                  parser={value => value.replace('% ', '')}
                  onChange={value => this.onChangePercentageOff(value, index)}
                  disabled={this.state.membershipIsUsed}
                />
              </div>
              <div className="col-sm">
                <InputWithHead
                  auto_complete="new-gernalDiscount"
                  heading={AppConstants.description}
                  placeholder={AppConstants.generalDiscount}
                  onChange={e => this.onChangeDescription(e.target.value, index)}
                  value={item.description}
                  disabled={this.state.membershipIsUsed}
                />
              </div>
            </div>
            <div className="fluid-width">
              <div className="row">
                <div className="col-sm">
                  <InputWithHead heading={AppConstants.availableFrom} />
                  <DatePicker
                    // size="large"
                    className="w-100"
                    onChange={date => this.onChangeDiscountAvailableFrom(date, index)}
                    format="DD-MM-YYYY"
                    placeholder="dd-mm-yyyy"
                    showTime={false}
                    value={item.availableFrom !== null && moment(item.availableFrom)}
                    disabled={this.state.membershipIsUsed}
                  />
                </div>
                <div className="col-sm">
                  <InputWithHead heading={AppConstants.availableTo} />
                  <DatePicker
                    // size="large"
                    className="w-100"
                    disabledDate={this.disabledDate}
                    disabledTime={this.disabledTime}
                    onChange={date => this.onChangeDiscountAvailableTo(date, index)}
                    format="DD-MM-YYYY"
                    placeholder="dd-mm-yyyy"
                    showTime={false}
                    value={item.availableTo !== null && moment(item.availableTo)}
                    disabled={this.state.membershipIsUsed}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <InputWithHead heading="Discount Type" />
            <Select
              className="w-100"
              style={{ paddingRight: 1, minWidth: 182 }}
              onChange={discountType => this.onChangeDiscountRefId(discountType, index)}
              placeholder="Select"
              value={item.discountTypeRefId}
              disabled={this.state.membershipIsUsed}
            >
              {this.props.appState.commonDiscountTypes.map(item => (
                <Option key={'discountType_' + item.id} value={item.id}>
                  {item.description}
                </Option>
              ))}
            </Select>
            {childDiscounts.map((childItem, childindex) => (
              <div className="row">
                <div className="col-sm-10">
                  <Form.Item
                    name={`percentageValue${index} + ${childindex}`}
                    rules={[
                      {
                        required: true,
                        message: ValidationConstants.pleaseEnterChildDiscountPercentage,
                      },
                    ]}
                  >
                    <InputWithHead
                      heading={`Family Participant ${childindex + 1} discount`}
                      placeholder={`Family Participant ${childindex + 1} discount`}
                      onChange={e =>
                        this.onChangeChildPercent(e.target.value, index, childindex, childItem)
                      }
                      // value={childItem.percentageValue}
                      disabled={this.state.membershipIsUsed}
                    />
                  </Form.Item>
                </div>
                {childindex > 0 && (
                  <div
                    className="col-sm-2 delete-image-view pb-4"
                    onClick={() =>
                      !this.state.membershipIsUsed
                        ? this.addRemoveChildDiscount(index, 'delete', childindex)
                        : null
                    }
                  >
                    <span className="user-remove-btn">
                      <i className="fa fa-trash-o" aria-hidden="true" />
                    </span>
                    <span className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                  </div>
                )}
              </div>
            ))}
            <span
              className="input-heading-add-another"
              onClick={() =>
                !this.state.membershipIsUsed ? this.addRemoveChildDiscount(index, 'add', -1) : null
              }
            >
              + {AppConstants.addChild}
            </span>
          </div>
        );

      case 4:
        return (
          <div>
            <InputWithHead heading="Discount Type" />
            <Select
              className="w-100"
              style={{ paddingRight: 1, minWidth: 182 }}
              onChange={discountType => this.onChangeDiscountRefId(discountType, index)}
              placeholder="Select"
              value={item.discountTypeRefId}
              disabled={this.state.membershipIsUsed}
            >
              {this.props.appState.commonDiscountTypes.map(item => (
                <Option key={'discountType_' + item.id} value={item.id}>
                  {item.description}
                </Option>
              ))}
            </Select>
            <div className="row">
              <div className="col-sm">
                <InputWithHead heading={AppConstants.percentageOff_FixedAmount} />
                <InputNumber
                  auto_complete="new-number"
                  value={item.amount}
                  placeholder={AppConstants.percentageOff_FixedAmount}
                  min={0}
                  max={100}
                  formatter={value => `% ${value}`}
                  parser={value => value.replace('% ', '')}
                  onChange={value => this.onChangePercentageOff(value, index)}
                  disabled={this.state.membershipIsUsed}
                />
              </div>
              <div className="col-sm">
                <InputWithHead
                  auto_complete="new-gernalDiscount"
                  heading={AppConstants.description}
                  placeholder={AppConstants.generalDiscount}
                  onChange={e => this.onChangeDescription(e.target.value, index)}
                  value={item.description}
                  disabled={this.state.membershipIsUsed}
                />
              </div>
            </div>

            <div className="fluid-width">
              <div className="row">
                <div className="col-sm">
                  <InputWithHead heading={AppConstants.availableFrom} />
                  <DatePicker
                    // size="large"
                    className="w-100"
                    onChange={date => this.onChangeDiscountAvailableFrom(date, index)}
                    format="DD-MM-YYYY"
                    placeholder="dd-mm-yyyy"
                    showTime={false}
                    value={item.availableFrom !== null && moment(item.availableFrom)}
                    disabled={this.state.membershipIsUsed}
                  />
                </div>
                <div className="col-sm">
                  <InputWithHead heading={AppConstants.availableTo} />
                  <DatePicker
                    // size="large"
                    className="w-100"
                    placeholder="dd-mm-yyyy"
                    disabledDate={this.disabledDate}
                    disabledTime={this.disabledTime}
                    onChange={date => this.onChangeDiscountAvailableTo(date, index)}
                    format="DD-MM-YYYY"
                    showTime={false}
                    value={item.availableTo !== null && moment(item.availableTo)}
                    disabled={this.state.membershipIsUsed}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <InputWithHead
              auto_complete="new-description"
              heading={AppConstants.description}
              placeholder={AppConstants.description}
              onChange={e => this.onChangeDescription(e.target.value, index)}
              value={item.description}
              disabled={this.state.membershipIsUsed}
            />
            <InputWithHead
              auto_complete="new-question"
              heading={AppConstants.question}
              placeholder={AppConstants.question}
              onChange={e => this.onChangeQuestion(e.target.value, index)}
              value={item.question}
              disabled={this.state.membershipIsUsed}
            />
            <InputWithHead heading={'Apply Discount if Answer is Yes'} />
            <Radio.Group
              className="reg-competition-radio"
              onChange={e => this.applyDiscountQuestionCheck(e.target.value, index)}
              value={JSON.stringify(JSON.parse(item.applyDiscount))}
              disabled={this.state.membershipIsUsed}
            >
              <Radio value="1">{AppConstants.yes}</Radio>
              <Radio value="0">{AppConstants.no}</Radio>
            </Radio.Group>
          </div>
        );

      default:
        return <div />;
    }
  };

  addRemoveChildDiscount = (index, keyWord, childindex) => {
    let discountData = this.props.registrationState.membershipProductDiscountData
      .membershipProductDiscounts[0].discounts;
    let childDisObject = {
      membershipFeesChildDiscountId: 0,
      percentageValue: '',
    };
    if (keyWord === 'add') {
      if (isArrayNotEmpty(discountData[index].childDiscounts)) {
        discountData[index].childDiscounts.push(childDisObject);
      } else {
        discountData[index].childDiscounts = [];
        discountData[index].childDiscounts.push(childDisObject);
      }
    } else if (keyWord === 'delete') {
      if (isArrayNotEmpty(discountData[index].childDiscounts)) {
        discountData[index].childDiscounts.splice(childindex, 1);
      }
    }
    this.props.updatedDiscountDataAction(discountData);
    if (keyWord === 'delete') {
      this.setFieldDecoratorValues();
    }
  };

  ////////onchange apply discount question radio button
  applyDiscountQuestionCheck = (applyDiscount, index) => {
    let discountData = this.props.registrationState.membershipProductDiscountData
      .membershipProductDiscounts[0].discounts;
    discountData[index].applyDiscount = applyDiscount;
    this.props.updatedDiscountDataAction(discountData);
  };

  ///////child  onchange in discount section
  onChangeChildPercent = (childPercent, index, childindex, childItem) => {
    let discountData = this.props.registrationState.membershipProductDiscountData
      .membershipProductDiscounts[0].discounts;
    discountData[index].childDiscounts[childindex].percentageValue = childPercent;
    discountData[index].childDiscounts[childindex].membershipFeesChildDiscountId =
      childItem.membershipFeesChildDiscountId;
    this.props.updatedDiscountDataAction(discountData);
  };

  ///onchange question in case of custom discount
  onChangeQuestion = (question, index) => {
    let discountData = this.props.registrationState.membershipProductDiscountData
      .membershipProductDiscounts[0].discounts;
    discountData[index].question = question;
    this.props.updatedDiscountDataAction(discountData);
  };

  ////add  or remove  discount in discount section
  addRemoveDiscount = (keyAction, index) => {
    this.props.addRemoveDiscountAction(keyAction, index);
    if (keyAction == 'remove') {
      setTimeout(() => {
        this.setFieldDecoratorValues();
      }, 300);
    }
  };

  //On change membership product discount type
  onChangeMembershipProductDisType = (discountType, index) => {
    let discountData = this.props.registrationState.membershipProductDiscountData
      .membershipProductDiscounts[0].discounts;
    discountData[index].membershipPrdTypeDiscountTypeRefId = discountType;
    this.props.updatedDiscountDataAction(discountData);
    if (discountType == 3) {
      if (isArrayNotEmpty(discountData[index].childDiscounts) == false) {
        this.addRemoveChildDiscount(index, 'add', -1);
      }
    }
  };

  //onChange membership type  discount
  onChangeMembershipTypeDiscount = (discountMembershipType, index) => {
    let discountData = this.props.registrationState.membershipProductDiscountData
      .membershipProductDiscounts[0].discounts;
    discountData[index].membershipProductTypeMappingId = discountMembershipType;
    this.props.updatedDiscountDataAction(discountData);
  };

  /////onChange discount refId
  onChangeDiscountRefId = (discountType, index) => {
    let discountData = this.props.registrationState.membershipProductDiscountData
      .membershipProductDiscounts[0].discounts;
    discountData[index].discountTypeRefId = discountType;
    this.props.updatedDiscountDataAction(discountData);
  };

  //////onchange discount code
  onChangeDiscountCode = (discountCode, index) => {
    let discountData = this.props.registrationState.membershipProductDiscountData
      .membershipProductDiscounts[0].discounts;
    discountData[index].discountCode = discountCode;
    this.props.updatedDiscountDataAction(discountData);
  };

  ///onchange on text field percentage off
  onChangePercentageOff = (amount, index) => {
    let discountData = this.props.registrationState.membershipProductDiscountData
      .membershipProductDiscounts[0].discounts;
    discountData[index].amount = amount;
    this.props.updatedDiscountDataAction(discountData);
  };

  /////onChange discount description
  onChangeDescription = (description, index) => {
    let discountData = this.props.registrationState.membershipProductDiscountData
      .membershipProductDiscounts[0].discounts;
    discountData[index].description = description;
    this.props.updatedDiscountDataAction(discountData);
  };

  ////discount available from on change
  onChangeDiscountAvailableFrom = (date, index) => {
    let fromDate = moment(date).format('YYYY-MM-DD');
    let discountData = this.props.registrationState.membershipProductDiscountData
      .membershipProductDiscounts[0].discounts;
    discountData[index].availableFrom = fromDate;
    this.props.updatedDiscountDataAction(discountData);
  };

  ////discount available to on change
  onChangeDiscountAvailableTo = (date, index) => {
    let toDate = moment(date).format('YYYY-MM-DD');
    let discountData = this.props.registrationState.membershipProductDiscountData
      .membershipProductDiscounts[0].discounts;
    discountData[index].availableTo = toDate;
    this.props.updatedDiscountDataAction(discountData);
  };

  ////discount view inside the content
  discountView = () => {
    let data = this.props.registrationState.membershipProductDiscountData;
    let discountData =
      data && data.membershipProductDiscounts !== null
        ? data.membershipProductDiscounts[0].discounts
        : [];
    return (
      <div className="discount-view pt-5">
        <div className="row">
          <span className="form-heading">{AppConstants.discounts}</span>
          <CustomTooltip>
            <span>{AppConstants.membershipDiscountMsg}</span>
          </CustomTooltip>
        </div>

        {discountData.map((item, index) => (
          <div className="prod-reg-inside-container-view">
            <div
              className="transfer-image-view pt-2"
              onClick={() =>
                !this.state.membershipIsUsed ? this.addRemoveDiscount('remove', index) : null
              }
            >
              <span className="user-remove-btn">
                <i className="fa fa-trash-o" aria-hidden="true" />
              </span>
              <span className="user-remove-text mr-0">{AppConstants.remove}</span>
            </div>
            <div className="row">
              <div className="col-sm">
                <InputWithHead required="pt-0" heading="Discount Type" />
                <Form.Item
                  name={`membershipPrdTypeDiscountTypeRefId${index}`}
                  rules={[
                    { required: true, message: ValidationConstants.pleaseSelectDiscountType },
                  ]}
                >
                  <Select
                    className="w-100"
                    style={{ paddingRight: 1, minWidth: 182 }}
                    onChange={discountType =>
                      this.onChangeMembershipProductDisType(discountType, index)
                    }
                    placeholder="Select"
                    // value={item.membershipPrdTypeDiscountTypeRefId !== 0 && item.membershipPrdTypeDiscountTypeRefId}
                    disabled={this.state.membershipIsUsed}
                  >
                    {this.props.registrationState.membershipProductDiscountType.map(item => (
                      <Option key={'discountType_' + item.id} value={item.id}>
                        {item.description}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-sm">
                <InputWithHead required="pt-0" heading={AppConstants.membershipTypes} />
                <Form.Item
                  name={`membershipProductTypeMappingId${index}`}
                  rules={[
                    { required: true, message: ValidationConstants.pleaseSelectMembershipTypes },
                  ]}
                >
                  <Select
                    className="w-100"
                    style={{ paddingRight: 1, minWidth: 182 }}
                    onChange={discountMembershipType =>
                      this.onChangeMembershipTypeDiscount(discountMembershipType, index)
                    }
                    // defaultValue={item.membershipProductTypeMappingId}
                    placeholder="Select"
                    // value={item.membershipProductTypeMappingId}
                    disabled={this.state.membershipIsUsed}
                  >
                    {this.state.discountMembershipTypeData.map(item => (
                      <Option
                        key={'discountMembershipType_' + item.membershipProductTypeMappingId}
                        value={item.membershipProductTypeMappingId}
                      >
                        {item.membershipProductTypeRefName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            {this.discountViewChange(item, index)}
          </div>
        ))}
        <span
          className="input-heading-add-another"
          onClick={() => (!this.state.membershipIsUsed ? this.addRemoveDiscount('add', -1) : null)}
        >
          + {AppConstants.addDiscount}
        </span>
      </div>
    );
  };

  //////footer view containing all the buttons like submit and cancel
  footerView = () => {
    let tabKey = this.state.membershipTabKey;
    let membershipProductId = this.props.registrationState.membershipProductId;
    return (
      <div className="fluid-width">
        {/* {!this.state.membershipIsUsed && ( */}
        <div className="footer-view">
          <div className="row">
            <div className="col-sm">
              <div className="reg-add-save-button">
                {membershipProductId.length > 0 && (
                  <Button type="cancel-button" onClick={() => this.showDeleteConfirm()}>
                    {AppConstants.delete}
                  </Button>
                )}
              </div>
            </div>
            <div className="col-sm">
              <div className="comp-buttons-view">
                <Tooltip
                  className="h-100"
                  onMouseEnter={() =>
                    this.setState({
                      tooltipVisibleDraft: this.state.isPublished,
                    })
                  }
                  onMouseLeave={() => this.setState({ tooltipVisibleDraft: false })}
                  visible={this.state.tooltipVisibleDraft}
                  title={ValidationConstants.membershipIsPublished}
                >
                  <Button
                    className="save-draft-text"
                    type="save-draft-text"
                    htmlType="submit"
                    disabled={this.state.isPublished}
                    onClick={() => this.setState({ statusRefId: 1, buttonPressed: 'save' })}
                  >
                    {AppConstants.saveAsDraft}
                  </Button>
                </Tooltip>
                <Button
                  className="publish-button"
                  type="primary"
                  htmlType="submit"
                  onClick={() =>
                    this.setState({
                      // statusRefId: tabKey === "3" ? 2 : 1,
                      // buttonPressed: tabKey === "3" ? "publish" : "next"
                      statusRefId: tabKey === '2' ? 2 : 1,
                      buttonPressed: tabKey === '2' ? 'publish' : 'next',
                    })
                  }
                >
                  {/* {tabKey === "3" ? this.state.isPublished ? AppConstants.save : AppConstants.publish : AppConstants.next} */}
                  {tabKey === '2'
                    ? this.state.isPublished
                      ? AppConstants.save
                      : AppConstants.publish
                    : AppConstants.next}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* )} */}
      </div>
    );
  };

  tabCallBack = key => {
    // let productId = this.props.registrationState.membershipProductId
    // if (productId !== null && productId.length > 0) {
    this.setState({ membershipTabKey: key });
    let data = this.props.registrationState.membershipProductFeesTableData;
    let feesData = data ? (data.membershipFees.length > 0 ? data.membershipFees : []) : [];
    if (key == '2') {
      for (let i in feesData) {
        this.membershipFeeApplyRadio(
          feesData[i].validityDays == 0 ? null : feesData[i].validityDays,
          i,
          'validityDays',
        );
      }
    }
    // }
    this.setFieldDecoratorValues();
  };

  handleConfirmRepayFeesModal = key => {
    if (key == 'ok') {
      let finalMembershipFeesData = JSON.parse(
        JSON.stringify(this.props.registrationState.membershipProductFeesTableData),
      );
      finalMembershipFeesData.membershipFees.map(item => {
        delete item['membershipProductName'];
        delete item['membershipProductTypeRefName'];
        return item;
      });
      this.props.regSaveMembershipProductFeesAction(finalMembershipFeesData);
      this.setState({ loading: true });
      this.setState({ confirmRePayFeesModalVisible: false });
    } else {
      this.setState({ confirmRePayFeesModalVisible: false });
    }
  };

  repayFeesModal = () => {
    try {
      return (
        <Modal
          className="add-membership-type-modal"
          title="Confirm"
          visible={this.state.confirmRePayFeesModalVisible}
          okText={AppConstants.proceedText}
          onOk={() => this.handleConfirmRepayFeesModal('ok')}
          onCancel={() => this.handleConfirmRepayFeesModal('cancel')}
        >
          <InputWithHead heading={AppConstants.membershipFeesRepayConfirmMsg} required="pt-0" />
        </Modal>
      );
    } catch (ex) {
      console.log('Error in repayFeesModal::' + ex);
    }
  };

  render() {
    return (
      <div className="fluid-width default-bg">
        <DashboardLayout
          menuHeading={AppConstants.registration}
          menuName={AppConstants.registration}
        />
        <InnerHorizontalMenu menu="registration" regSelectedKey="4" />
        <Layout>
          <Form
            ref={this.formRef}
            autoComplete="off"
            onFinish={this.saveMembershipProductDetails}
            noValidate="noValidate"
            initialValues={{ yearRefId: 1, validityRefId: 1 }}
          >
            {/* {this.dropdownView()} */}
            <Content>
              <div className="tab-view">
                <Tabs
                  activeKey={
                    this.state.membershipTabKey != '3' && this.state.membershipTabKey != '4'
                      ? this.state.membershipTabKey
                      : '2'
                  }
                  onChange={this.tabCallBack}
                >
                  <TabPane tab={AppConstants.membershipProduct} key="1">
                    <div className="tab-formView mt-5">{this.contentView()}</div>
                  </TabPane>
                  <TabPane tab={AppConstants.fees} key="2">
                    <div>{this.feesView()}</div>
                  </TabPane>
                  {/* <TabPane tab={AppConstants.discount} key="3">
                                        <div className="tab-formView">{this.discountView()}</div>
                                    </TabPane> */}
                </Tabs>
              </div>
              <Loader visible={this.props.registrationState.onLoad} />
            </Content>
            <Footer>{this.footerView()}</Footer>
          </Form>
          {this.repayFeesModal()}
        </Layout>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      regGetMembershipProductDetailsAction,
      regSaveMembershipProductDetailsAction,
      getOnlyYearListAction,
      getProductValidityListAction,
      regGetDefaultMembershipProductTypesAction,
      regSaveMembershipProductFeesAction,
      regSaveMembershipProductDiscountAction,
      getMembershipProductFeesTypeAction,
      membershipFeesTableInputChangeAction,
      getCommonDiscountTypeTypeAction,
      membershipProductDiscountTypesAction,
      addNewMembershipTypeAction,
      addRemoveDiscountAction,
      updatedDiscountDataAction,
      membershipFeesApplyRadioAction,
      onChangeAgeCheckBoxAction,
      updatedMembershipTypeDataAction,
      removeCustomMembershipTypeAction,
      regMembershipListDeleteAction,
      getAllowTeamRegistrationTypeAction,
      membershipPaymentOptionAction,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  return {
    registrationState: state.RegistrationState,
    appState: state.AppState,
    commonReducerState: state.CommonReducerState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationMembershipFee);
