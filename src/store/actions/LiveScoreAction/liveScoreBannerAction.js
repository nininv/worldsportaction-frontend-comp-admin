import ApiConstants from 'themes/apiConstants';

// Banners action
function getLiveScoreBanners(competitionID, organisationID = null) {
  return {
    type: ApiConstants.API_LIVE_SCORE_BANNERS_LOAD,
    competitionID,
    organisationID,
  };
}

// Banners Add
function liveScoreAddBanner(
  organisationID,
  competitionID,
  bannerImage,
  // showOnHome,
  // showOnDraws,
  // showOnLadder,
  // showOnNews,
  // showOnChat,
  format,
  bannerLink,
  bannerId,
) {
  return {
    type: ApiConstants.API_LIVE_SCORE_ADD_BANNER_LOAD,
    organisationID,
    competitionID,
    bannerImage,
    // showOnHome,
    // showOnDraws,
    // showOnLadder,
    // showOnNews,
    // showOnChat,
    format,
    bannerLink,
    bannerId,
  };
}

function liveScoreAddCommunicationBanner(
  organisationID,
  sponsorName,
  horizontalBannerImage,
  horizontalBannerLink,
  squareBannerImage,
  squareBannerLink,
  bannerId,
) {
  return {
    type: ApiConstants.API_LIVE_SCORE_ADD_COMMUNICATION_BANNER_LOAD,
    organisationID,
    sponsorName,
    horizontalBannerImage,
    horizontalBannerLink,
    squareBannerImage,
    squareBannerLink,
    bannerId,
  };
}

function liveScoreRemoveBannerImage(bannerId, ratioType) {
  return {
    type: ApiConstants.API_LIVE_SCORE_REMOVE_BANNER_IMAGE_LOAD,
    bannerId,
    ratioType,
  };
}

// Banners Add
function liveScoreRemoveBanner(bannerId, organisationId) {
  return {
    type: ApiConstants.API_LIVE_SCORE_REMOVE_BANNER_LOAD,
    bannerId,
    organisationId,
  };
}

function liveScoreAddBannerUpdate(data, key) {
  return {
    type: ApiConstants.API_LIVE_SCORE_ADD_BANNER_UPDATE,
    data,
    key,
  };
}

function liveScoreAddCommunicationBannerUpdate(data, key) {
  return {
    type: ApiConstants.API_LIVE_SCORE_ADD_COMMUNICATION_BANNER_UPDATE,
    data,
    key,
  };
}

function clearEditBannerAction() {
  return {
    type: ApiConstants.API_LIVE_SCORE_CLEAR_BANNER_REDUCER,
  };
}

export {
  getLiveScoreBanners,
  liveScoreAddBanner,
  liveScoreRemoveBanner,
  liveScoreAddBannerUpdate,
  clearEditBannerAction,
  liveScoreRemoveBannerImage,
  liveScoreAddCommunicationBanner,
  liveScoreAddCommunicationBannerUpdate,
};
