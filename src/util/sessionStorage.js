// set competition id
const setCompetitionID = competitionId => {
  localStorage.setItem('competitionId', competitionId);
};

// get competition id
const getCompetitonId = () => {
  return localStorage.competitionId;
};

const getLiveScoreCompetiton = () => {
  return localStorage.LiveScoreCompetition;
};

// Set Auth Token
const setAuthToken = token => {
  localStorage.setItem('token', token);
};

// get Auth Token
const getAuthToken = () => {
  return localStorage.token;
};

// Set Sign Date
const setSignDate = signDate => {
  localStorage.setItem('signDate', signDate);
};

// get Auth Token
const getSignDate = () => {
  return localStorage.signDate ?? false;
};

// Set Sign Date
const removeSignDate = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('signDate');
};

// Set Sign Date
const setRoleId = role_id => {
  localStorage.setItem('role_id', role_id);
};

// get Auth Token
const getRoleId = () => {
  return localStorage.role_id ?? false;
};

// Set Sign Date
const removeRoleId = () => {
  localStorage.removeItem('role_id');
};

// Set User Id
const setUserId = userId => {
  localStorage.setItem('userId', userId);
};

// get User Id
const getUserId = () => {
  return localStorage.userId;
};

// Set Own  Year
const setOwnCompetitionYear = own_year => {
  localStorage.setItem('own_year', own_year);
};

// get Own  Year
const getOwnCompetitionYear = () => {
  return localStorage.own_year;
};

// Set  own competition
const setOwn_competition = own_competition => {
  localStorage.setItem('own_competition', own_competition);
};

// get own competition
const getOwn_competition = () => {
  return localStorage.own_competition;
};
// Set  own competition  Status
const setOwn_competitionStatus = own_competitionStatus => {
  localStorage.setItem('own_competitionStatus', own_competitionStatus);
};

// get own competition status
const getOwn_competitionStatus = () => {
  return localStorage.own_competitionStatus;
};

const setOrganisationData = organisationData => {
  let data = JSON.stringify(organisationData);
  localStorage.setItem('setOrganisationData', data);
};

const getOrganisationData = () => {
  return localStorage.setOrganisationData ? JSON.parse(localStorage.setOrganisationData) : null;
};

// set Participating Year
const setParticipatingYear = Participate_year => {
  localStorage.setItem('Participate_year', Participate_year);
};

// get Participating Year
const getParticipatingYear = () => {
  return localStorage.Participate_year;
};

// Set  Participating competition
const setParticipating_competition = Participating_competition => {
  localStorage.setItem('Participating_competition', Participating_competition);
};

// get Participating competition
const getParticipating_competition = () => {
  return localStorage.Participating_competition;
};
// Set  Participating competition  status
const setParticipating_competitionStatus = Participating_competitionStaus => {
  localStorage.setItem('Participating_competitionStaus', Participating_competitionStaus);
};

// get Participating competition status
const getParticipating_competitionStatus = () => {
  return localStorage.Participating_competitionStaus;
};

const setDraws_venue = draws_venue => {
  localStorage.setItem('draws_venue', draws_venue);
};

const getDraws_venue = () => {
  return localStorage.draws_venue;
};

const setDraws_round = draws_round => {
  localStorage.setItem('draws_round', draws_round);
};

const getDraws_round = () => {
  return localStorage.draws_round;
};

const setDraws_roundTime = draws_roundTime => {
  localStorage.setItem('draws_roundTime', draws_roundTime);
};

const getDraws_roundTime = () => {
  return localStorage.draws_roundTime;
};

const setDraws_division_grade = draws_division_grade => {
  localStorage.setItem('draws_division_grade', draws_division_grade);
};

const getDraws_division_grade = () => {
  return localStorage.draws_division_grade;
};

const getUmpireCompetitionId = () => {
  return localStorage.umpireCompetitionId
    ? Number.parseInt(localStorage.umpireCompetitionId)
    : null;
};

const setUmpireCompetitionId = umpireCompetitionId => {
  localStorage.setItem('umpireCompetitionId', umpireCompetitionId);
};

const getUmpireCompetitionData = () => {
  return localStorage.umpireCompetitionData;
};

const setUmpireCompetitionData = umpireCompetitionData => {
  localStorage.setItem('umpireCompetitionData', umpireCompetitionData);
};

const clearUmpireStorage = () => {
  let keysToRemove = [
    'umpireCompetitionData',
    'umpireCompetitionId',
    'own_competition',
    'Participating_competition',
    'Participate_year',
    'own_year',
    'own_FinalRefId',
    'global_year',
  ];
  for (let key of keysToRemove) {
    localStorage.removeItem(key);
  }
};

const clearCompetitionLocalStorage = () => {
  let competitionStorage = [
    'own_competition',
    'Participating_competition',
    'own_FinalRefId',
    'Participating_competitionStatus',
    'own_competitionStatus',
    'Participating_competitionStaus',
  ];
  for (let key of competitionStorage) {
    localStorage.removeItem(key);
  }
};

const getLiveScoreUmpireCompitionData = () => {
  return localStorage.liveScoreUmpireCompetitionData;
};

const setLiveScoreUmpireCompitionData = liveScoreUmpireCompetitionData => {
  localStorage.setItem('liveScoreUmpireCompetitionData', liveScoreUmpireCompetitionData);
};

const setLiveScoreUmpireCompition = liveScoreUmpireCompetitionId => {
  localStorage.setItem('liveScoreUmpireCompetitionId', liveScoreUmpireCompetitionId);
};

const getLiveScoreUmpireCompition = () => {
  return localStorage.liveScoreUmpireCompetitionId;
};

const setKeyForStateWideMessage = stateWideMessage => {
  localStorage.setItem('stateWideMessage', stateWideMessage);
};

const getKeyForStateWideMessage = () => {
  return localStorage.stateWideMessage;
};

const setPrevUrl = url => {
  let data = JSON.stringify(url);
  localStorage.setItem('prevUrl', data);
};

const getPrevUrl = () => {
  return localStorage.prevUrl ? JSON.parse(localStorage.prevUrl) : null;
};

const getOwn_CompetitionFinalRefId = () => {
  return localStorage.own_FinalRefId;
};
const setOwn_CompetitionFinalRefId = own_FinalRefId => {
  localStorage.setItem('own_FinalRefId', own_FinalRefId);
};

const clearCompetitionStorage = () => {
  let keysToRemove = [
    'own_competition',
    'Participating_competition',
    'Participate_year',
    'own_year',
    'own_FinalRefId',
    'Participating_competitionStatus',
    'own_competitionStatus',
    'global_year',
  ];
  for (let key of keysToRemove) {
    localStorage.removeItem(key);
  }
};

const setImpersonation = Impersonation => {
  localStorage.setItem('Impersonation', Impersonation);
};

const getImpersonation = () => {
  return localStorage.Impersonation;
};

// Set global Year
const setGlobalYear = global_year => {
  localStorage.setItem('global_year', global_year);
};

// get global Year
const getGlobalYear = () => {
  return localStorage.global_year;
};

export {
  getOwn_CompetitionFinalRefId,
  setOwn_CompetitionFinalRefId,
  setCompetitionID,
  getCompetitonId,
  setAuthToken,
  getAuthToken,
  setSignDate,
  getSignDate,
  removeSignDate,
  setRoleId,
  getRoleId,
  removeRoleId,
  setUserId,
  getUserId,
  setOwnCompetitionYear,
  getOwnCompetitionYear,
  setOwn_competition,
  getOwn_competition,
  setOrganisationData,
  getOrganisationData,
  setParticipatingYear,
  getParticipatingYear,
  setParticipating_competition,
  getParticipating_competition,
  getLiveScoreCompetiton,
  setDraws_venue,
  getDraws_venue,
  setDraws_round,
  getDraws_round,
  setDraws_roundTime,
  getDraws_roundTime,
  setDraws_division_grade,
  getDraws_division_grade,
  getUmpireCompetitionId,
  setUmpireCompetitionId,
  setUmpireCompetitionData,
  getUmpireCompetitionData,
  clearUmpireStorage,
  getLiveScoreUmpireCompitionData,
  setLiveScoreUmpireCompitionData,
  setLiveScoreUmpireCompition,
  getLiveScoreUmpireCompition,
  setKeyForStateWideMessage,
  getKeyForStateWideMessage,
  setOwn_competitionStatus,
  getOwn_competitionStatus,
  getParticipating_competitionStatus,
  setParticipating_competitionStatus,
  setPrevUrl,
  getPrevUrl,
  clearCompetitionStorage,
  setImpersonation,
  getImpersonation,
  setGlobalYear,
  getGlobalYear,
  clearCompetitionLocalStorage,
};
