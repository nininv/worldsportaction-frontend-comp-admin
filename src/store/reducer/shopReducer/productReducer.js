import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty } from "../../../util/helpers";

// dummy object of product detail
const defaultAddProductObject = {
    productName: "",
    description: "",
    affiliates: {
        "direct": 1,
        "firstLevel": 0,
        "secondLevel": 0
    },
    price: 0,
    cost: 0,
    tax: 0,
    inventoryTracking: true,
    barcode: "",
    skuCode: "",
    quantity: 0,
    deliveryType: "",
    type: {
        typeName: "",
        id: 0,
    },
    width: 0,
    length: 0,
    height: 0,
    weight: 0,
    variants: [
        {
            name: "",
            options: [
                {
                    optionName: "",
                    properties: {
                        price: 0,
                        cost: 0,
                        skuCode: "",
                        barcode: "",
                        quantity: 0,
                        id: 0,
                    }
                }
            ]
        }
    ],
    images: [],
    availableIfOutOfStock: 0,
    taxApplicable: false,
    variantsChecked: false,
    organisationUniqueKey: 0,
}


const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    productDetailData: defaultAddProductObject,
    productListingData: [],
    productListingTotalCount: 1,
    productListingCurrentPage: 1,
    typesProductList: [], //////reference types in add product screen for the type dropdown
    getDetailsLoad: false,
    getImages: [],
    imageUrls: [],
};

////adding extra parameters in the productDetailData
function makeDetailDataObject(data) {
    let productData = data
    let defaultVariant = [
        {
            name: "",
            options: [
                {
                    optionName: "",
                    properties: {
                        price: 0,
                        cost: 0,
                        skuCode: "",
                        barcode: "",
                        quantity: 0,
                        id: 0,
                    }
                }
            ]
        }
    ]
    productData['variantsChecked'] = isArrayNotEmpty(productData.variants) ? true : false
    productData['taxApplicable'] = productData.tax > 0 ? true : false
    productData["variants"] = isArrayNotEmpty(productData.variants) ? productData.variants : defaultVariant
    return productData
}

////making image urls to display
function getImageUrls(images) {
    let displayImagesUrls = []
    if (isArrayNotEmpty(images)) {
        for (let i in images) {
            let object = {
                "image": images[i].url,
                "id": images[i].id
            }
            displayImagesUrls.push(object)
        }
    }
    return displayImagesUrls
}

function shopProductState(state = initialState, action) {
    switch (action.type) {

        case ApiConstants.API_SHOP_PRODUCT_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_SHOP_PRODUCT_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };


        /////////product listing get API 
        case ApiConstants.API_GET_SHOP_PRODUCT_LISTING_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GET_SHOP_PRODUCT_LISTING_SUCCESS:
            return {
                ...state,
                productListingData: isArrayNotEmpty(action.result.result) ? action.result.result : [],
                productListingTotalCount: action.result.page ? action.result.page.totalCount : 1,
                productListingCurrentPage: action.result.page ? action.result.page.currentPage : 1,
                onLoad: false,
                status: action.status,
                error: null
            };

        //////////Add product 
        case ApiConstants.API_ADD_SHOP_PRODUCT_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_ADD_SHOP_PRODUCT_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        //////onchange Add/Edit product details
        case ApiConstants.SHOP_PRODUCT_DETAILS_ONCHANGE:
            if (action.key === "variantName") {
                state.productDetailData["variants"][action.index]["name"] = action.data
            }
            else if (action.key === "variantOption") {
                state.productDetailData["variants"][action.index]["options"] = action.data
            }
            else if (action.key === "typeOnChange") {
                let typeListArray = JSON.parse(JSON.stringify(state.typesProductList))
                let typeIndex = typeListArray.findIndex(x => x.id == action.data)
                if (typeIndex >= 0) {
                    let typeObject = typeListArray[typeIndex]
                    state.productDetailData["type"] = typeObject
                }
            }
            else if (action.key === "price") {
                state.productDetailData["tax"] = state.productDetailData.taxApplicable === true ? Number(action.data) * 10 / 100 : 0
                state.productDetailData[action.key] = action.data
            }
            else if (action.key === "taxApplicable") {
                state.productDetailData[action.key] = action.data
                state.productDetailData["tax"] = action.data === true ? Number(state.productDetailData.price) * 10 / 100 : 0
            }
            else if (action.key === "inventoryTracking") {
                state.productDetailData.inventoryTracking = action.data
            }
            else if (action.key === "variantsChecked") {
                state.productDetailData.variantsChecked = action.data
                if (action.data == true) {
                    let firstVariantOptionPrice = state.productDetailData.variants[0].options[0].properties.price
                    if (firstVariantOptionPrice == 0) {
                        state.productDetailData.variants[0].options[0].properties.price = state.productDetailData.price
                    }
                }
            }
            else {
                state.productDetailData[action.key] = action.data
            }

            return {
                ...state,
            };

        //////////get reference type in the add product screen
        case ApiConstants.API_GET_TYPES_LIST_IN_ADD_PROUCT_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GET_TYPES_LIST_IN_ADD_PROUCT_SUCCESS:
            return {
                ...state,
                typesProductList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                status: action.status,
                error: null
            };

        //////////////////delete product from the product listing API 
        case ApiConstants.API_DELETE_SHOP_PRODUCT_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_DELETE_SHOP_PRODUCT_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        ///clearing particular reducer data
        case ApiConstants.SHOP_PRODUCT_CLEARING_REDUCER_DATA:
            if (action.dataName === "productDetailData") {
                // dummy object of product detail
                const defaultAddProductObject = {
                    productName: "",
                    description: "",
                    affiliates: {
                        "direct": 1,
                        "firstLevel": 0,
                        "secondLevel": 0
                    },
                    price: 0,
                    cost: 0,
                    tax: 0,
                    inventoryTracking: true,
                    barcode: "",
                    skuCode: "",
                    quantity: 0,
                    deliveryType: "",
                    type: {
                        typeName: "",
                        id: 0,
                    },
                    width: 0,
                    length: 0,
                    height: 0,
                    weight: 0,
                    variants: [
                        {
                            name: "",
                            options: [
                                {
                                    optionName: "",
                                    properties: {
                                        price: 0,
                                        cost: 0,
                                        skuCode: "",
                                        barcode: "",
                                        quantity: 0,
                                        id: 0,
                                    }
                                }
                            ]
                        }
                    ],
                    images: [],
                    availableIfOutOfStock: 0,
                    taxApplicable: false,
                    variantsChecked: false,
                    organisationUniqueKey: 0,
                }
                state.productDetailData = defaultAddProductObject
            }
            return {
                ...state, error: null
            };


        /////////////////////////delete product variant API
        case ApiConstants.API_DELETE_SHOP_PRODUCT_VARIANT_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_DELETE_SHOP_PRODUCT_VARIANT_SUCCESS:
            let varientOptions = state.productDetailData.variants[action.index].options
            varientOptions.splice(action.subIndex, 1)
            state.productDetailData["variants"][action.index]["options"] = varientOptions
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        ////////////add type in the typelist array in from the API
        case ApiConstants.API_SHOP_ADD_TYPE_IN_TYPELIST_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_SHOP_ADD_TYPE_IN_TYPELIST_SUCCESS:
            state.typesProductList.push(action.result)
            state.productDetailData["type"] = action.result
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        //////////////product details on id API
        case ApiConstants.API_SHOP_GET_PRODUCT_DETAILS_BY_ID_LOAD:
            return { ...state, onLoad: true, getDetailsLoad: true, error: null };

        case ApiConstants.API_SHOP_GET_PRODUCT_DETAILS_BY_ID_SUCCESS:
            state.productDetailData = makeDetailDataObject(action.result)
            let images = action.result.images
            state.getImages = images
            let displayUrls = getImageUrls(images)
            state.imageUrls = displayUrls
            state.getDetailsLoad = false
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        default:
            return state;
    }
}

export default shopProductState;
