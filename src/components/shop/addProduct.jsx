import React, { Component } from "react";
import { Layout, Button, Checkbox, Select, Breadcrumb, InputNumber, Form, Modal, message } from 'antd';
import './shop.css';
import { NavLink } from 'react-router-dom';
import DashboardLayout from "../../pages/dashboardLayout";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../../customComponents/loader';
import history from "../../util/history";
import {
    addProductAction,
    onChangeProductDetails,
    getTypesOfProductAction,
    addNewTypeAction,
    deleteProductVariantAction,
    getProductDetailsByIdAction,
    clearProductReducer,
} from "../../store/actions/shopAction/productAction"
import InputWithHead from "../../customComponents/InputWithHead";
import { isArrayNotEmpty, isNotNullOrEmptyString, captializedString, isImageFormatValid } from "../../util/helpers";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import SortableImage from '../../customComponents/sortableImageComponent';
import ValidationConstants from '../../themes/validationConstant';
import { checkOrganisationLevel } from "../../util/permissions";
import { getOrganisationData } from "../../util/sessionStorage"
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            value: "",
            fileNames: [],
            isDrag: false,
            files: [],
            urls: [],
            isDragging: false,
            newProductType: "",
            visible: false,
            loading: false,
            getLoad: false,
            orgLevel: AppConstants.state,
            allDisabled: false
        }
        props.clearProductReducer("productDetailData");
        this.formRef = React.createRef();
    }


    componentDidMount() {
        window.scrollTo(0, 0)
        this.apiCalls();
        this.setDetailsFieldValue();
        this.setEditorFieldValue();
        checkOrganisationLevel().then((value) => (
            this.setState({ orgLevel: value })
        ))
    }

    apiCalls = () => {
        this.props.getTypesOfProductAction()
        let productId = null
        productId = this.props.location.state ? this.props.location.state.id : null
        if (productId) {
            this.props.getProductDetailsByIdAction(productId)
            this.setState({ getLoad: true })
        }
    }

    componentDidUpdate(nextProps) {
        let shopProductState = this.props.shopProductState;
        if (shopProductState.onLoad === false && this.state.loading === true) {
            this.setState({ loading: false });
            if (!shopProductState.error) {
                history.push('/listProducts');
            }
        }
        if (shopProductState.getDetailsLoad === false && this.state.getLoad === true) {
            let imageUrls = shopProductState.imageUrls
            let creatorId = shopProductState.productDetailData.organisationUniqueKey;
            let orgData = getOrganisationData();
            let organisationUniqueKey = orgData ? orgData.organisationUniqueKey : 0;
            let allDisabled = creatorId == organisationUniqueKey ? false : true;

            this.setDetailsFieldValue();
            this.setEditorFieldValue();
            this.setState({ getLoad: false, urls: imageUrls, files: imageUrls, allDisabled });
        }
    }

    //////post the product details
    addProductPostAPI = (values) => {
        let { productDetailData } = JSON.parse(JSON.stringify(this.props.shopProductState));
        let description = JSON.parse(JSON.stringify(productDetailData.description))
        let orgData = getOrganisationData();
        let organisationUniqueKey = orgData ? orgData.organisationUniqueKey : 0;
        productDetailData.organisationUniqueKey = organisationUniqueKey
        // let descriptionText = ""
        // if (isArrayNotEmpty(description)) {
        //     let descriptionStringArr = []
        //     for (let i in description) {
        //         descriptionStringArr.push(description[i].text)
        //     }
        //     descriptionText = descriptionStringArr.join(`<br/>`)
        // } else {
        //     descriptionText = description
        // }
        let descriptionText = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
        productDetailData.description = descriptionText
        let { urls, files } = this.state
        let imagesFiles = []
        for (let i in urls) {
            for (let j in files) {
                if (urls[i].id == files[j].id) {
                    if (files[j].fileObject) {
                        imagesFiles.push(files[j].fileObject)
                    } else {
                        imagesFiles.push(files[j].image)
                    }
                }
            }
        }
        if (productDetailData.variantsChecked === false) {
            productDetailData.variants = []
        }
        productDetailData.images = urls

        let formData = new FormData();
        formData.append('params', JSON.stringify(productDetailData));
        if (isArrayNotEmpty(imagesFiles)) {
            for (let i in imagesFiles)
                formData.append("productPhotos", imagesFiles[i])
        }
        let affiliates = productDetailData.affiliates
        let affiliatesNotSelected = Object.keys(affiliates).every(k => affiliates[k] === 0);
        if (affiliatesNotSelected) {
            message.error(ValidationConstants.pleaseSelectAffiliate);
        } else {
            this.props.addProductAction(formData);
            this.setState({ loading: true });
        }
    }

    setDetailsFieldValue() {
        let { productDetailData } = this.props.shopProductState;
        this.formRef.current.setFieldsValue({
            productName: productDetailData.productName,
        });
        if (productDetailData.deliveryType === "shipping") {
            this.formRef.current.setFieldsValue({
                width: productDetailData.width,
                length: productDetailData.length,
                height: productDetailData.height,
                weight: productDetailData.weight,
            });
        }
        if (productDetailData.inventoryTracking === true) {
            this.formRef.current.setFieldsValue({
                quantity: productDetailData.quantity,
            });
        }
        let variants = productDetailData.variants
        if (productDetailData.variantsChecked === true) {
            variants.length > 0 && variants.map((item, index) => {
                let variantName = `variants${index}name`;
                this.formRef.current.setFieldsValue({
                    [variantName]: item.name
                });
            })
        }
    }


    setEditorFieldValue() {
        let { productDetailData } = this.props.shopProductState;
        // let body = isNotNullOrEmptyString(productDetailData.description) ?
        //  EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(productDetailData.description))) : ""
        let finalBody = isNotNullOrEmptyString(productDetailData.description) ? productDetailData.description : ""
        const html = finalBody;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({
                editorState
            })
        }
    }


    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    handleOk = e => {
        if (this.state.newProductType.length > 0) {
            this.props.addNewTypeAction(this.state.newProductType)
        }
        this.setState({
            visible: false,
            newProductType: "",
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
            newProductType: ""
        });
    };

    ///add another product type
    addAnotherProductType = () => {
        this.setState({ visible: true })
    }

    ////affiliateOnChange checkbox
    affiliateOnChange = (value, name) => {
        let { productDetailData } = this.props.shopProductState
        let affiliatePostObject = productDetailData.affiliates
        let assignedValue = value ? 1 : 0
        switch (name) {
            case AppConstants.direct:
                affiliatePostObject.direct = assignedValue
                break;
            case AppConstants.firstLevelAffiliatesAssociationLeague:
                affiliatePostObject.firstLevel = assignedValue
                break;
            case AppConstants.secondLevelAffiliatesClubSchool:
                affiliatePostObject.secondLevel = assignedValue
                break;
            default:
                break;
        }
        this.props.onChangeProductDetails(affiliatePostObject, 'affiliates')
    }

    /////for displaying checked or not checked in affiliate
    checkedAffiliates = (name) => {
        let { productDetailData } = this.props.shopProductState
        let affiliate = productDetailData.affiliates
        switch (name) {
            case AppConstants.direct:
                return affiliate.direct
            case AppConstants.firstLevelAffiliatesAssociationLeague:
                return affiliate.firstLevel
            case AppConstants.secondLevelAffiliatesClubSchool:
                return affiliate.secondLevel
            default:
                break;
        }
    }

    checkAffiliateDisable = (item) => {
        if (this.state.orgLevel == AppConstants.association && item.id == 2) {
            return true;
        }
        else if (this.state.orgLevel == AppConstants.club && item.id == 2) {
            return true;
        }
        else if (this.state.orgLevel == AppConstants.club && item.id == 3) {
            return true;
        }
        else {
            return this.state.allDisabled;
        }
    }

    handleDrags = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            ...this.state,
            isDragging: true
        });
    }

    handleDragEnter = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.handleDrags(e);
    }

    handleDragOver = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.handleDrags(e);
    }

    handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            ...this.state,
            isDragging: false
        });
    }

    onChange = (e) => {
        e.preventDefault()
        let files = e.target.files;
        [].forEach.call(files, this.handleFiles);
    }

    handleDrop = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const data = e.dataTransfer;
        const files = data.files;
        [].forEach.call(files, this.handleFiles);
        this.setState({
            ...this.state,
            isDragging: false
        });
    }

    handleFiles = (file) => {
        if (file) {
            let extension = file.name.split('.').pop().toLowerCase();
            let isSuccess = isImageFormatValid(extension);
            if (isSuccess) {
                let reader = new FileReader();
                reader.onloadend = () => {
                    let imageUrl = window.URL.createObjectURL(file);
                    let id = Math.random()
                    if (imageUrl) {
                        this.setState({
                            files: [...this.state.files, { fileObject: file, id }],
                            urls: [...this.state.urls, { image: imageUrl, id }]
                        });
                    }
                }
                reader.readAsDataURL(file);
            }
        }
    }

    getImage = () => (
        <>
            <input type="file"
                id="getImage"
                style={{ display: 'none' }}
                onChange={(e) => this.onChange(e)}
                accept="image/*"
            />
            <Button
                onClick={(e) => { document.getElementById('getImage').click(); e.stopPropagation() }}
                className="primary-add-product mt-2"
                type="primary">
                {AppConstants.uploadImage}
            </Button>
        </>
    )

    ///////on change varients name
    onVariantNameChange = (value) => {
        let varientNameIndex = 0
        this.props.onChangeProductDetails(value, 'variantName', varientNameIndex)
    }

    onChangeVariantsCheckBox = async (e) => {
        await this.props.onChangeProductDetails(
            e.target.checked,
            'variantsChecked'
        );
        this.setDetailsFieldValue();
    }

    ///////on change varients name
    onVariantOptionOnChange = (value, key, index, subIndex) => {
        let { productDetailData } = this.props.shopProductState
        let varientOptions = productDetailData.variants[index].options
        let varientOptionObject = varientOptions[subIndex]
        switch (key) {
            case "optionName":
                varientOptionObject.optionName = value
                break;
            case "price":
                varientOptionObject.properties.price = value
                break;
            case "cost":
                varientOptionObject.properties.cost = value
                break;
            case "skuCode":
                varientOptionObject.properties.skuCode = value
                break;
            case "barcode":
                varientOptionObject.properties.barcode = value
                break;
            case "quantity":
                varientOptionObject.properties.quantity = value
                break;
            default:
                break;
        }
        varientOptions[subIndex] = varientOptionObject
        this.props.onChangeProductDetails(varientOptions, 'variantOption', index)
    }


    //////delete the product variant
    showDeleteConfirm = (optionId, index, subIndex) => {
        let this_ = this
        confirm({
            title: AppConstants.deleteVariantOption,
            content: AppConstants.deleteVariantOptionDescription,
            okText: 'Confirm',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                if (optionId) {
                    if (optionId > 0) {
                        this_.props.deleteProductVariantAction(optionId, index, subIndex)
                    }
                }
                else {
                    let varientOptions = this_.props.shopProductState.productDetailData.variants[index].options
                    varientOptions.splice(subIndex, 1)
                    this_.props.onChangeProductDetails(varientOptions, 'variantOption', index)
                }
            },
            onCancel() {
            },
        });
    }

    ///////add new varient option
    addVariantOption = (index, subIndex, key, optionId) => {
        let { productDetailData } = this.props.shopProductState
        let varientOptionObject = {
            "optionName": "",
            "properties": {
                "price": productDetailData.price,
                "cost": 0,
                "SKU": "",
                "barcode": "",
                "quantity": 0,
                "id": 0
            }
        }
        let varientOptions = productDetailData.variants[index].options
        if (key === "add") {
            varientOptions.push(varientOptionObject)
        }
        if (key === "remove") {
            this.showDeleteConfirm(optionId, index, subIndex)
            // varientOptions.splice(subIndex, 1)
        }
        this.props.onChangeProductDetails(varientOptions, 'variantOption', index)

    }

    onChangeShippingCheckBox = async (e) => {
        await this.props.onChangeProductDetails(
            e.target.checked ? "shipping" : "",
            'deliveryType'
        );
        this.setDetailsFieldValue();
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header
                    className="form-header-view header-transaparent"
                >
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.productDetails}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    editorView = () => {
        const { editorState, allDisabled } = this.state;
        return (
            <div className="fluid-width mt-3 shop-decription-editor-main-div">
                <div className="livescore-editor-news col-sm"
                    style={allDisabled ? { backgroundColor: "#f5f5f5" } : null}>
                    <Editor
                        editorState={editorState}
                        editorClassName="newsDetailEditor"
                        placeholder={AppConstants.description}
                        onChange={(e) =>
                            this.props.onChangeProductDetails(
                                e.blocks,
                                'description'
                            )
                        }
                        onEditorStateChange={this.onEditorStateChange}
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'remove', 'history'],
                            inline: { inDropdown: true },
                            list: { inDropdown: true },
                            textAlign: { inDropdown: true },
                            link: { inDropdown: true },
                            history: { inDropdown: true },
                        }}
                        readOnly={this.state.allDisabled}
                    />
                </div>
            </div>
        )
    }

    ////////form content view
    contentView = () => {
        let { productDetailData, typesProductList } = this.props.shopProductState
        let affiliateArray = [
            { id: 1, name: AppConstants.direct },
            { id: 2, name: AppConstants.firstLevelAffiliatesAssociationLeague },
            { id: 3, name: AppConstants.secondLevelAffiliatesClubSchool }
        ]
        return (
            <div className="content-view pt-4">
                <Form.Item
                    name="productName"
                    rules={[
                        {
                            required: true,
                            message: ValidationConstants.enterTitleOfTheProduct,
                        },
                    ]}
                >
                    <InputWithHead
                        auto_complete="off"
                        required={"required-field pb-0 pt-3"}
                        heading={AppConstants.title}
                        placeholder={AppConstants.enterTitle}
                        onChange={(e) =>
                            this.props.onChangeProductDetails(
                                captializedString(e.target.value),
                                'productName'
                            )
                        }
                        onBlur={(i) => this.formRef.current.setFieldsValue({
                            productName: captializedString(i.target.value)
                        })}
                        disabled={this.state.allDisabled}
                    />
                </Form.Item>

                <InputWithHead required="pb-0" heading={AppConstants.description}
                />
                {this.editorView()}

                <InputWithHead required="pt-4" heading={AppConstants.type} />
                <Select
                    className="shop-type-select"
                    onChange={(value) =>
                        this.props.onChangeProductDetails(
                            value,
                            'typeOnChange'
                        )
                    }
                    placeholder="Select"
                    value={productDetailData.type ?
                        isNotNullOrEmptyString(productDetailData.type.typeName) ?
                            productDetailData.type.id : [] : []}
                    disabled={this.state.allDisabled}
                >
                    {isArrayNotEmpty(typesProductList) && typesProductList.map(
                        (item, index) => {
                            return (
                                <Option
                                    key={'type' + item.id + index}
                                    value={item.id}
                                >
                                    {item.typeName}
                                </Option>
                            );
                        }
                    )}
                </Select>
                {
                    this.state.orgLevel === "state" &&
                    <span className="input-heading-add-another" onClick={this.addAnotherProductType}>+{AppConstants.addType}</span>
                }
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.addType}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <InputWithHead
                        required="pt-0 mt-0"
                        heading={AppConstants.addType}
                        placeholder={ValidationConstants.pleaseEnterProductType}
                        onChange={(e) => this.setState({ newProductType: e.target.value })}
                        value={this.state.newProductType}
                        disabled={this.state.allDisabled}
                    />

                </Modal>
                <InputWithHead required="required-field pb-0" heading={AppConstants.affiliates} />
                {affiliateArray.map((item, index) => {
                    return (
                        <div key={"affiliateArray" + index}>
                            <Checkbox
                                className="single-checkbox mt-3"
                                checked={this.checkedAffiliates(item.name) === 1}
                                disabled={this.checkAffiliateDisable(item)}
                                onChange={(e) =>
                                    this.affiliateOnChange(e.target.checked, item.name)
                                }
                            >
                                {item.name}
                            </Checkbox>
                        </div>
                    );
                })}
            </div>
        );
    };

    ////////Image content view
    imageView = () => {
        const { urls, files, isDragging, allDisabled } = this.state;
        const dropCss = urls.length > 0 ? "dragDropLeft" : "dragDropCenter";
        const dropClass = isDragging ? `${dropCss} dragging` : dropCss;
        return (
            <div>
                <div className="fees-view pt-5">
                    <div
                        className={dropClass}
                        onDrop={this.handleDrop}
                        onDragOver={this.handleDragOver}
                        onDragEnter={this.handleDragEnter}
                        onDragLeave={this.handleDragLeave}
                        onClick={(e) => { urls.length === 0 && document.getElementById('getImage').click(); e.stopPropagation() }}
                    >
                        <>
                            {
                                urls.length > 0 ?
                                    <SortableImage images={urls} reorderedUrls={(data) => this.setState({ urls: data })} allDisabled={allDisabled} /> :
                                    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 180 }}>
                                        <InputWithHead heading={AppConstants.dragImageToUpload} />
                                        <div className="d-flex justify-content-center" style={{ width: '100%' }}>
                                            {this.getImage()}
                                        </div>
                                    </div>
                            }
                        </>
                    </div>
                    {urls.length > 0 ?
                        < div className="d-flex justify-content-end" style={{ width: '100%' }}>
                            {this.getImage()}
                        </div> : ''
                    }
                </div>
            </div>
        );

    };

    ////////Image content view for non edit
    imageNonEditView = () => {
        const { urls, files, isDragging, allDisabled } = this.state;
        const dropCss = urls.length > 0 ? "dragDropLeft" : "dragDropCenter";
        const dropClass = isDragging ? `${dropCss} dragging` : dropCss;
        return (
            <div>
                <div className="fees-view pt-5">
                    <div
                        className={dropClass}
                        style={{ backgroundColor: "#f5f5f5" }}
                    >
                        <SortableImage images={urls} reorderedUrls={(data) => this.setState({ urls: data })} allDisabled={allDisabled} /> :
                    </div>
                </div>
            </div>
        );

    };

    ////////pricing content view
    pricingView = () => {
        let { productDetailData } = this.props.shopProductState
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.pricing}</span>
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                auto_complete="off"
                                heading={AppConstants.price}
                                required={'pt-3'}
                                placeholder={AppConstants.price}
                                prefix="$"
                                onChange={(e) =>
                                    this.props.onChangeProductDetails(
                                        e.target.value,
                                        'price'
                                    )
                                }
                                value={productDetailData.price}
                                type="number"
                                disabled={this.state.allDisabled}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                auto_complete="off"
                                heading={AppConstants.costPerItem}
                                placeholder={AppConstants.costPerItem}
                                required={'pt-3'}
                                prefix="$"
                                onChange={(e) =>
                                    this.props.onChangeProductDetails(
                                        e.target.value,
                                        'cost'
                                    )
                                }
                                value={productDetailData.cost}
                                type="number"
                                disabled={this.state.allDisabled}
                            />
                        </div>
                    </div>
                    <div className="pt-5">
                        <Checkbox
                            className="single-checkbox mt-0"
                            checked={productDetailData.taxApplicable}
                            onChange={(e) =>
                                this.props.onChangeProductDetails(
                                    e.target.checked,
                                    'taxApplicable'
                                )
                            }
                            disabled={this.state.allDisabled}
                        >
                            {AppConstants.chargeTaxesOnProduct}
                        </Checkbox>
                    </div>
                    {productDetailData.taxApplicable === true &&
                        <InputWithHead
                            heading={AppConstants.tax}
                            placeholder={AppConstants.tax}
                            prefix="$"
                            disabled
                            onChange={(e) =>
                                this.props.onChangeProductDetails(
                                    e.target.value,
                                    'tax'
                                )
                            }
                            value={productDetailData.tax}
                            type="number"
                        />}
                </div>
            </div>
        );
    };


    ////////Inventory content view
    inventoryView = () => {
        let { productDetailData } = this.props.shopProductState
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.inventory}</span>
                <div className="fluid-width">
                    <div className="pt-4 mb-2">
                        <Checkbox
                            className="single-checkbox mt-0"
                            checked={productDetailData.inventoryTracking}
                            onChange={(e) =>
                                this.props.onChangeProductDetails(
                                    e.target.checked,
                                    'inventoryTracking'
                                )
                            }
                            disabled={this.state.allDisabled}
                        >
                            {AppConstants.enableInventoryTracking}
                        </Checkbox>
                    </div>
                    {productDetailData.inventoryTracking && <>
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead
                                    auto_complete="off"
                                    heading={AppConstants.skuHeader}
                                    placeholder={AppConstants.StockKeepingUnit}
                                    onChange={(e) =>
                                        this.props.onChangeProductDetails(
                                            e.target.value,
                                            'skuCode'
                                        )
                                    }
                                    value={productDetailData.skuCode}
                                    disabled={this.state.allDisabled}
                                />
                            </div>
                            <div className="col-sm">
                                <InputWithHead
                                    auto_complete="off"
                                    heading={AppConstants.barcodeHeading}
                                    placeholder={AppConstants.barcode}
                                    onChange={(e) =>
                                        this.props.onChangeProductDetails(
                                            e.target.value,
                                            'barcode'
                                        )
                                    }
                                    value={productDetailData.barcode}
                                    disabled={this.state.allDisabled}
                                />
                            </div>
                        </div>
                        <div>
                            <span className="input-heading required-field">{AppConstants.quantity}</span>
                            <Form.Item
                                name="quantity"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                        ValidationConstants.pleaseEnterQuantity,
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: 90 }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    onChange={(quantity) => this.props.onChangeProductDetails(
                                        quantity,
                                        'quantity'
                                    )}
                                    placeholder={AppConstants.quantity}
                                    min={0}
                                    type="number"
                                    disabled={this.state.allDisabled}
                                />
                            </Form.Item>
                        </div>
                    </>}
                    <div className="pt-5">
                        <Checkbox
                            className="single-checkbox mt-0"
                            checked={productDetailData.availableIfOutOfStock === 1}
                            onChange={(e) =>
                                this.props.onChangeProductDetails(
                                    e.target.checked === true ? 1 : 0,
                                    'availableIfOutOfStock'
                                )
                            }
                            disabled={this.state.allDisabled}
                        >
                            {AppConstants.allowCustomerToPurchase}
                        </Checkbox>
                    </div>

                </div>
            </div>
        );
    };

    ////////Variants content view
    variantsView = () => {
        let { productDetailData } = this.props.shopProductState
        let varientOptionArray = isArrayNotEmpty(productDetailData.variants) ? productDetailData.variants[0].options : []
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.variants}</span>
                <div className="fluid-width">
                    <div className="pt-4">
                        <Checkbox
                            className="single-checkbox mt-0"
                            checked={productDetailData.variantsChecked}
                            onChange={(e) => this.onChangeVariantsCheckBox(e)}
                            disabled={this.state.allDisabled}
                        >
                            {AppConstants.enableVariants}
                        </Checkbox>
                    </div>
                    {productDetailData.variantsChecked === true && <>
                        <div className="row">
                            <div className="col-sm-5">
                                <Form.Item
                                    name={`variants${0}name`}
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                            ValidationConstants.pleaseEnterVariantName,
                                        },
                                    ]}
                                >
                                    <InputWithHead
                                        auto_complete="off"
                                        required="required-field pb-0"
                                        heading={AppConstants.variantName}
                                        placeholder={AppConstants.variant_name}
                                        onChange={(e) => this.onVariantNameChange(e.target.value)}
                                        disabled={this.state.allDisabled}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        {isArrayNotEmpty(varientOptionArray) && varientOptionArray.map((subItem, subIndex) => (
                            <div className="prod-reg-inside-container-view" key={"varientOptionArray" + subIndex}>
                                <div className="row"  >
                                    <div className="col-sm">
                                        <InputWithHead
                                            auto_complete="off"
                                            heading={AppConstants.option}
                                            placeholder={AppConstants.option}
                                            onChange={(e) => this.onVariantOptionOnChange(e.target.value, "optionName", 0, subIndex)}
                                            value={subItem.optionName}
                                            disabled={this.state.allDisabled}
                                        />
                                    </div>
                                    <div className="col-sm">
                                        <InputWithHead
                                            auto_complete="off"
                                            heading={AppConstants.price}
                                            placeholder={AppConstants.price}
                                            prefix="$"
                                            onChange={(e) => this.onVariantOptionOnChange(e.target.value, "price", 0, subIndex)}
                                            value={subItem.properties.price}
                                            type={"number"}
                                            disabled={this.state.allDisabled}
                                        />
                                    </div>
                                    <div className="col-sm">
                                        <InputWithHead
                                            auto_complete="off"
                                            heading={AppConstants.cost}
                                            placeholder={AppConstants.cost}
                                            prefix="$"
                                            onChange={(e) => this.onVariantOptionOnChange(e.target.value, "cost", 0, subIndex)}
                                            value={subItem.properties.cost}
                                            type={"number"}
                                            disabled={this.state.allDisabled}
                                        />
                                    </div>
                                    <div className="col-sm">
                                        <InputWithHead
                                            auto_complete="off"
                                            heading={AppConstants.sku}
                                            placeholder={AppConstants.sku}
                                            onChange={(e) => this.onVariantOptionOnChange(e.target.value, "skuCode", 0, subIndex)}
                                            value={subItem.properties.skuCode}
                                            disabled={this.state.allDisabled}
                                        />
                                    </div>
                                    <div className="col-sm">
                                        <InputWithHead
                                            auto_complete="off"
                                            heading={AppConstants.barcode}
                                            placeholder={AppConstants.barcode}
                                            onChange={(e) => this.onVariantOptionOnChange(e.target.value, "barcode", 0, subIndex)}
                                            value={subItem.properties.barcode}
                                            disabled={this.state.allDisabled}
                                        />
                                    </div>
                                    <div className="col-sm">
                                        <span className="input-heading">{AppConstants.quantity}</span>
                                        <InputNumber
                                            style={{ width: 90 }}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            placeholder={AppConstants.quantity}
                                            min={0}
                                            onChange={(value) => this.onVariantOptionOnChange(value, "quantity", 0, subIndex)}
                                            value={subItem.properties.quantity}
                                            type={"number"}
                                            disabled={this.state.allDisabled}
                                        />
                                    </div>
                                    <div className="col-sm red-remove-cross-img-div">
                                        {/* {subIndex > 0 &&  */}
                                        <div
                                            style={{ cursor: 'pointer' }}>
                                            <img
                                                className="dot-image"
                                                src={AppImages.redCross}
                                                alt=""
                                                width="16"
                                                height="16"
                                                onClick={() => this.state.allDisabled === false ? this.addVariantOption(0, subIndex, "remove", subItem.properties.id) : null}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <span className="input-heading-add-another"
                            onClick={() => this.state.allDisabled === false ? this.addVariantOption(0, -1, "add") : null}>
                            +{AppConstants.addVariantOption}
                        </span>
                    </>}
                </div>
            </div>
        );
    };

    ////////Shipping content view
    shippingView = () => {
        let { productDetailData } = this.props.shopProductState
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.shipping}</span>
                <div className="row pt-1">
                    <div className="col-sm-4">
                        <Checkbox
                            className="single-checkbox mt-3"
                            checked={productDetailData.deliveryType === "shipping"}
                            onChange={(e) => this.onChangeShippingCheckBox(e)}
                            disabled={this.state.allDisabled}
                        >
                            {AppConstants.shipping}
                        </Checkbox>
                    </div>
                    <div className="col-sm-8">
                        <Checkbox
                            className="single-checkbox mt-3"
                            checked={productDetailData.deliveryType === "pickup"}
                            onChange={(e) =>
                                this.props.onChangeProductDetails(
                                    e.target.checked ? "pickup" : "",
                                    'deliveryType'
                                )
                            }
                            disabled={this.state.allDisabled}
                        >
                            {AppConstants.pickup}
                        </Checkbox>
                    </div>
                </div>
                {
                    productDetailData.deliveryType === "shipping" && <>
                        <span className="form-heading mt-5">{AppConstants.productDimensionsWeight}</span>
                        <InputWithHead
                            heading={AppConstants.dimensions}
                            required="pt-3"
                        />
                        <div className="row">
                            <div className="col-sm">
                                <Form.Item
                                    name="length"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                            ValidationConstants.enterLengthOfTheProduct,
                                        },
                                    ]}
                                >
                                    <InputWithHead
                                        auto_complete="off"
                                        required={"required-field "}
                                        placeholder={"Length"}
                                        suffix="cm"
                                        onChange={(e) =>
                                            this.props.onChangeProductDetails(
                                                Number(e.target.value).toFixed(2),
                                                'length'
                                            )
                                        }
                                        type="number"
                                        step="1.00"
                                        disabled={this.state.allDisabled}
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-sm-1 remove-cross-img-div">
                                <img
                                    className="dot-image"
                                    src={AppImages.crossImage}
                                    alt=""
                                    width="16"
                                    height="16"
                                />
                            </div>
                            <div className="col-sm">
                                <Form.Item
                                    name="width"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                            ValidationConstants.enterWidthOfTheProduct,
                                        },
                                    ]}
                                >
                                    <InputWithHead
                                        auto_complete="off"
                                        required="required-field"
                                        placeholder={"Width"}
                                        suffix="cm"
                                        onChange={(e) =>
                                            this.props.onChangeProductDetails(
                                                Number(e.target.value).toFixed(2),
                                                'width'
                                            )
                                        }
                                        type="number"
                                        step="1.00"
                                        disabled={this.state.allDisabled}
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-sm-1 remove-cross-img-div">
                                <img
                                    className="dot-image"
                                    src={AppImages.crossImage}
                                    alt=""
                                    width="16"
                                    height="16"
                                />
                            </div>
                            <div className="col-sm">
                                <Form.Item
                                    name="height"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                            ValidationConstants.enterHeightOfTheProduct,
                                        },
                                    ]}
                                >
                                    <InputWithHead
                                        auto_complete="off"
                                        placeholder={"Height"}
                                        required={"required-field "}
                                        suffix="cm"
                                        onChange={(e) =>
                                            this.props.onChangeProductDetails(
                                                Number(e.target.value).toFixed(2),
                                                'height'
                                            )
                                        }
                                        type="number"
                                        step="1.00"
                                        disabled={this.state.allDisabled}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <Form.Item
                                    name="weight"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                            ValidationConstants.enterWeightOfTheProduct,
                                        },
                                    ]}
                                >
                                    <InputWithHead
                                        auto_complete="off"
                                        heading={AppConstants.dimensions}
                                        required={"required-field "}
                                        placeholder={"Weight"}
                                        suffix="kg"
                                        onChange={(e) =>
                                            this.props.onChangeProductDetails(
                                                Number(e.target.value).toFixed(2),
                                                'weight'
                                            )
                                        }
                                        type="number"
                                        step="1.00"
                                        disabled={this.state.allDisabled}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </>
                }
            </div>
        );
    };



    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="footer-view">
                <div className="row">
                    <div className="col-sm">
                        <div className="reg-add-save-button">
                            <Button
                                className="cancelBtnWidth"
                                type="cancel-button"
                                onClick={() => history.push('/listProducts')}>{AppConstants.cancel}</Button>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">
                            {this.state.allDisabled === false &&
                                <Button className="publish-button" type="primary"
                                    htmlType="submit">
                                    {AppConstants.save}
                                </Button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width">
                <DashboardLayout menuHeading={AppConstants.shop} menuName={AppConstants.shop} />
                <InnerHorizontalMenu menu="shop" shopSelectedKey="2" />
                <Layout>
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.addProductPostAPI}
                        noValidate="noValidate"
                    >
                        <Content >
                            {this.headerView()}
                            <div className="formView">{this.contentView()}</div>
                            <div className="formView">
                                {this.state.allDisabled === true ? this.imageNonEditView() : this.imageView()}
                            </div>
                            <div className="formView">{this.pricingView()}</div>
                            <div className="formView">{this.inventoryView()}</div>
                            <div className="formView">{this.variantsView()}</div>
                            <div className="formView">{this.shippingView()}</div>
                        </Content>
                        <Loader
                            visible={this.props.shopProductState.onLoad} />
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addProductAction,
        onChangeProductDetails,
        getTypesOfProductAction,
        addNewTypeAction,
        deleteProductVariantAction,
        getProductDetailsByIdAction,
        clearProductReducer,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        shopProductState: state.ShopProductState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
