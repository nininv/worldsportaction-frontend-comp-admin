import React, { Component } from "react";
import { Layout, Button, Breadcrumb, Input, Icon, Select, Modal, Pagination } from 'antd';
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
import ShopSingleProductComponent from "../../customComponents/shopSingleProductComponent";
import { getProductListingAction, deleteProductAction } from "../../store/actions/shopAction/productAction"

const { Footer, Content } = Layout;
const { confirm } = Modal;

class ListProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sorterBy: "productName",
            order: "",
            offset: 0,
            searchText: "",
            limit: 8,
        }

    }


    componentDidMount() {
        const widthWindow = window.innerWidth;
        let windowLimit = Math.round(widthWindow / 270) * 2
        let limit = windowLimit < 6 ? 6 : windowLimit
        this.setState({ limit })
        let { sorterBy, order, offset, searchText } = this.state
        this.props.getProductListingAction(sorterBy, order, offset, searchText, limit)
    }


    //////delete the product
    showDeleteConfirm = (id) => {
        let this_ = this
        confirm({
            title: AppConstants.deleteProduct,
            content: AppConstants.deleteProductDescription,
            okText: 'Confirm',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                if (id) {
                    this_.props.deleteProductAction(id)
                }
            },
            onCancel() {
            },
        });
    }

    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value })
        if (e.target.value === null || e.target.value === "") {
            let { sorterBy, order, limit } = this.state
            this.setState({ offset: 0 })
            this.props.getProductListingAction(sorterBy, order, 0, e.target.value, limit)
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            let { sorterBy, order, searchText, limit } = this.state
            this.setState({ offset: 0 })
            this.props.getProductListingAction(sorterBy, order, 0, searchText, limit)
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
        if (this.state.searchText === null || this.state.searchText === "") {
        }
        else {
            let { sorterBy, order, searchText, limit } = this.state
            this.setState({ offset: 0 })
            this.props.getProductListingAction(sorterBy, order, 0, searchText, limit)
        }
    }

    ///////view for screen heading
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div
                        className="col-sm d-flex align-items-center"
                    >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">
                                {AppConstants.products}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="col-sm d-flex align-items-center justify-content-end mr-5"  >
                        <div className="comp-product-search-inp-width" >
                            <Input className="product-reg-search-input"
                                onChange={(e) => this.onChangeSearchText(e)}
                                placeholder="Search..."
                                onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                prefix={<Icon type="search" className="search-prefix-icon-style"
                                    onClick={() => this.onClickSearchIcon()}
                                />}
                                allowClear
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    ///dropdown view containing the search view and button
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row" >
                        <div className="col-sm">
                            <div className="com-year-select-heading-view">
                            </div>
                        </div>
                        <div className="col-sm d-flex align-items-center justify-content-end shop-add-product-btn-div"
                        // onClick={() => this.props.clearCompReducerDataAction("all")}>
                        >
                            <NavLink
                                to={{ pathname: `/addProduct` }}
                                className="text-decoration-none"
                            >
                                <Button className="primary-add-product" type="primary">
                                    + {AppConstants.addAProduct}
                                </Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    handlePagination = (page) => {
        let offset = page ? (this.state.limit) * (page - 1) : 0;
        this.setState({ offset })
        let { sorterBy, order, searchText, limit } = this.state
        this.props.getProductListingAction(sorterBy, order, offset, searchText, limit)
    };

    ////////content view of the screen
    contentView = () => {
        let { productListingData, productListingTotalCount } = this.props.shopProductState
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="shop-product-content-div">
                    {productListingData.length > 0 && productListingData.map((item, index) => {
                        return (
                            <div key={"productListingData" + index}>
                                <ShopSingleProductComponent
                                    productItem={item}
                                    deleteOnclick={() => this.showDeleteConfirm(item.id)}
                                />
                            </div>
                        )
                    })}
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        total={productListingTotalCount}
                        onChange={(page) => this.handlePagination(page)}
                        pageSize={this.state.limit}
                    />
                </div>
            </div>
        );
    };

    render() {
        console.log("shopProductState", this.props.shopProductState)
        return (
            <div className="fluid-width" >
                <DashboardLayout menuHeading={AppConstants.shop} menuName={AppConstants.shop} />
                <InnerHorizontalMenu menu={"shop"} shopSelectedKey={"2"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                    <Loader
                        visible={
                            this.props.shopProductState.onLoad
                        }
                    />
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getProductListingAction,
        deleteProductAction,
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        shopProductState: state.ShopProductState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((ListProducts));
