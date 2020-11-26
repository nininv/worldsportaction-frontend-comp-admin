import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import PrivateRoute from 'util/protectedRoute';
import { getUserRoleId } from 'util/permissions';

import lazyLoad from 'components/lazyLoad';

import Dashboard from 'components/dashboard';
import HomeDashboard from 'components/home/homeDashboard';

import CompetitionCourtAndTimesAssign from 'components/competition/competitionCourtAndTimesAssign';
import CompetitionDashboard from 'components/competition/competitionDashboard';
import CompetitionDraws from 'components/competition/competitionDraws';
import CompetitionDrawEdit from 'components/competition/competitionDrawEditNew';
import CompetitionException from 'components/competition/comeptitionException';
import CompetitionFinals from 'components/competition/competitionFinals';
import CompetitionFixtures from 'components/competition/competitionFixtures';
import CompetitionFormat from 'components/competition/competitionFormat';
import CompetitionLadder from 'components/competition/competitionLadder';
import CompetitionOpenRegForm from 'components/competition/competitionOpenRegForm';
import CompetitionPartPlayerGradeCalculate from 'components/competition/competitionPartPlayerGradeCalculate';
import CompetitionPartPlayerGrades from 'components/competition/competitionPartPlayerGrades';
import CompetitionPartProposedTeamGrading from 'components/competition/competitionPartProposedTeamGrading';
import CompetitionPartTeamGradeCalculate from 'components/competition/competitionPartTeamGradeCalculate';
import CompetitionPlayerGradeCalculate from 'components/competition/competitionPlayerGradeCalculate';
import CompetitionPlayerGrades from 'components/competition/competitionPlayerGrades';
import CompetitionPlayerImport from 'components/competition/competitionPlayerImport';
import CompetitionProposedTeamGrading from 'components/competition/competitionProposedTeamGrading';
import CompetitionQuickCompetition from 'components/competition/competitionQuickCompetition';
import CompetitionQuickCompetitionInvitations from 'components/competition/competitionQuickCompetitionInvitations';
import CompetitionQuickCompetitionMatchFormat from 'components/competition/competitionQuickCompetitionMatchFormat';
import CompetitionReGrading from 'components/competition/competitionReGrading';
import CompetitionReGradingStep2 from 'components/competition/competitionReGradingStep2';
import CompetitionReplicate from 'components/competition/competitionReplicate';
import CompetitionTeamImport from 'components/competition/competitionTeamImport';
import CompetitionVenueAndCourts from 'components/competition/competitionVenueAndCourts';
import CompetitionVenueAndTimesAdd from 'components/competition/competitionVenueAndTimesAdd';
import CompetitionVenueAndTimesEdit from 'components/competition/competitionVenueAndTimesEdit';
import CompetitionVenueTimesPrioritisation from 'components/competition/competitionVenueTimesPrioritisation';
import MultiFieldDraws from 'components/competition/multiFieldDraws';
import MultiFieldDrawsNew from 'components/competition/multiFieldDrawsNew';
import MultiFieldDrawsNewTimeline from 'components/competition/multiFieldDrawsNewTimeline';
import RegistrationCompetitionForm from 'components/competition/registrationCompetitionForm';

import AppRegistrationForm from 'components/registration/appRegistrationForm';
import deRegistration from 'components/registration/deRegistration';
import PaymentDashboard from 'components/registration/paymentDashboard';
import ProductAdd from 'components/registration/productAdd';
import ProductAddRegistration from 'components/registration/productAddRegistration';
import ProductRegistrationClub from 'components/registration/productRegistrationClub';
import Registration from 'components/registration/registration';
import RegistrationChange from 'components/registration/registrationChange';
import RegistrationChangeReview from 'components/registration/registrationChangeReview';
import RegistrationCompetitionFee from 'components/registration/registrationCompetitionFee';
import RegistrationCompetitionList from 'components/registration/registrationCompetitionList';
import RegistrationForm from 'components/registration/registrationForm';
import RegistrationFormList from 'components/registration/registrationFormList';
import RegistrationInvoice from 'components/registration/registrationInvoice';
import RegistrationList from 'components/registration/registrationList';
import RegistrationMainDashboard from 'components/registration/registrationMainDashboard';
import RegistrationMembershipFee from 'components/registration/registrationMembershipFee';
import RegistrationMembershipList from 'components/registration/registrationMembershipList';
import RegistrationPayments from 'components/registration/registrationPayments';
import RegistrationPayoutTransaction from 'components/registration/registrationPayoutTransactions';
import RegistrationSettlements from 'components/registration/registrationSettlements';
import TeamRegistrations from 'components/registration/teamRegistrations';

import AddUmpire from 'components/umpire/addUmpire';
import AssignUmpire from 'components/umpire/assignUmpire';
import Umpire from 'components/umpire/umpire';
import UmpireAllocation from 'components/umpire/umpireAllocation';
import UmpireDashboard from 'components/umpire/umpireDashboard';
import UmpireDivisions from 'components/umpire/umpireDivisions';
import UmpireImport from 'components/umpire/umpireImport';
import UmpirePayment from 'components/umpire/umpirePayments';
import UmpirePaymentSetting from 'components/umpire/umpirePaymentSettings';
import UmpirePayout from 'components/umpire/umpirePayout';
import UmpirePoolAllocation from 'components/umpire/umpirePoolAllocation';
import UmpireRoaster from 'components/umpire/umpireRoaster';
import UmpireSetting from 'components/umpire/umpireSetting';

import AffiliateDirectory from 'components/user/affiliateDirectory';
import PlayWithFriend from 'components/user/playWithFriend';
import ReferFriend from 'components/user/referFriend';
import UserAddAffiliates from 'components/user/userAddAffiliates';
import UserAffiliateApproveRejectForm from 'components/user/userAffiliateApproveRejectForm';
import UserAffiliatesList from 'components/user/userAffiliatesList';
import UserDashboard from 'components/user/userDashboard';
import UserEditAffiliates from 'components/user/userEditAffiliates';
import userModuleMedical from 'components/user/userModuleMedical';
import UserModulePersonalDetail from 'components/user/userModulePersonalDetail';
import UserOurOrganization from 'components/user/userOurOragnization';
import UserProfileEdit from 'components/user/userProfileEdit';
import UserTextualDashboard from 'components/user/userTextualDashboard';
import VenuesList from 'components/user/venuesList';

import CommunicationBanner from 'components/communication/CommunicationBanner';
import CommunicationEditBanners from 'components/communication/CommunicationEditBanners';

import LiveScoreAddDivision from 'components/liveScore/liveScoreAddDivision';
import LiveScoreAddEditCoach from 'components/liveScore/liveScoreAddEditCoach';
import LiveScoreAddIncident from 'components/liveScore/liveScoreAddInicident';
import LiveScoreAddManager from 'components/liveScore/liveScoreAddManagers';
import LiveScoreAddMatch from 'components/liveScore/liveScoreAddMatch';
import LiveScoreAddNews from 'components/liveScore/liveScoreAddNews';
import LiveScoreAddPlayer from 'components/liveScore/liveScoreAddPlayer';
import LiveScoreAddScorer from 'components/liveScore/liveScoreAddScorer';
import LiveScoreAddTeam from 'components/liveScore/liveScoreAddTeam';
import LiveScoreAssignMatch from 'components/liveScore/liveScoreAssignMatches';
import LiveScoreBanners from 'components/liveScore/liveScoreBanners';
import LiveScoreBulkChange from 'components/liveScore/liveScoreBulkChange';
import LiveScoreCoaches from 'components/liveScore/liveScoreCoaches';
import LiveScoreCompetitions from 'components/liveScore/liveScoreCompetitions';
import LiveScoreDashboard from 'components/liveScore/liveScoreDashboard';
import LiveScoreDivisionImport from 'components/liveScore/liveScoreDivisionImport';
import LiveScoreDivisionList from 'components/liveScore/liveScoreDivisionList';
import LiveScoreEditBanners from 'components/liveScore/liveScoreEditBanners';
import LiveScoreGameTimeList from 'components/liveScore/liveScoreGameTimeList';
import LiveScoreGoalsList from 'components/liveScore/liveScoreGoalsList';
import LiveScoreIncidentImport from 'components/liveScore/liveScoreIncidentImport';
import LiveScoreIncidentList from 'components/liveScore/liveScoreIncidentList';
import LiveScoreIncidentView from 'components/liveScore/liveScoreIncidentView';
import LiveScoreLadderAdjustment from 'components/liveScore/liveScoreLadderAdjustment';
import LiveScoreLadderList from 'components/liveScore/liveScoreLadderList';
import LiveScoreLadderSettings from 'components/liveScore/liveScoreLadderSettings';
import LiveScoreManagerImport from 'components/liveScore/liveScoreManagerImport';
import LiveScoreManagerList from 'components/liveScore/liveScoreManagers';
import LiveScoreManagerView from 'components/liveScore/liveScoreManagerView';
import LiveScoreMatchDetails from 'components/liveScore/liveScoreMatchDetails';
import LiveScoreMatches from 'components/liveScore/liveScoreMatches';
import LiveScoreMatchImport from 'components/liveScore/liveScoreMatchImport';
import LiveScoreMatchSheet from 'components/liveScore/liveScoreMatchSheet';
import LiveScoreNewsList from 'components/liveScore/liveScoreNewsList';
import LiveScoreNewsView from 'components/liveScore/liveScoreNewsView';
import LiveScorerPlayerImport from 'components/liveScore/liveScorePlayerImport';
import LiveScorePlayerList from 'components/liveScore/liveScorePlayerList';
import LiveScorePlayerProfile from 'components/liveScore/liveScorePlayerProfile';
import LiveScorePlayerView from 'components/liveScore/liveScorePlayerView';
import LiveScorePositionTrackReport from 'components/liveScore/liveScorePositionTrackReport';
import LiveScorePublicLadder from 'components/liveScore/liveScorePublicLadder';
import LiveScorerCoachImport from 'components/liveScore/liveScoreCoachImport';
import LiveScorerList from 'components/liveScore/liveScorerList';
import LiveScorerView from 'components/liveScore/liveScorerView';
import LiveScoreSeasonFixture from 'components/liveScore/liveScoreSeasonFixture';
import LiveScoreSettingsView from 'components/liveScore/liveScoreSettingsView';
import LiveScoreSocialSheet from 'components/liveScore/liveScoreSocialSheet';
import LiveScoreTeam from 'components/liveScore/liveScoreTeams';
import LiveScoreTeamAttendance from 'components/liveScore/liveScoreTeamAttendance';
import LiveScoreTeamImport from 'components/liveScore/liveScoreTeamImport';
import LiveScoreTeamView from 'components/liveScore/liveScoreTeamView';
import LiveScoreUmpireImport from 'components/liveScore/liveScoreUmpireImport';
import LiveScoreUmpireList from 'components/liveScore/liveScoreUmpireList';
import LiveScoreVenueChange from 'components/liveScore/liveScoreVenueChange';

import Stripe from 'components/stripe/stripe';

import AddProduct from 'components/shop/addProduct';
import ListProducts from 'components/shop/listProducts';
import OrderDetails from 'components/shop/orderDetails';
import OrderSummary from 'components/shop/orderSummary';
import ShopDashboard from 'components/shop/shopDashboard';
import ShopOrderStatus from 'components/shop/shopOrderStatus';
import ShopSettings from 'components/shop/shopSettings';

import Account from 'pages/Account';
import HelpAndSupport from 'pages/Support';

import { routeAdminRole, routeUmpireRole, routeFinanceRole } from './routeAccess';
import NotFound from './404';

import CommunicationList from 'components/communication/communicationList';
import AddCommunication from 'components/communication/addCommunication';
import CommunicationView from 'components/communication/communictionView';

class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userRoleId: getUserRoleId(),
        };
    }

    haveAccess = (role, screen) => {
        if (role == 2) {
            return routeAdminRole.includes(screen);
        } if (role == 11) {
            return routeUmpireRole.includes(screen);
        } if (role == 13) {
            return routeFinanceRole.includes(screen);
        }
    }

    render() {
        const { userRoleId } = this.state;
        return (
            <Switch>
                <Route exact path="/" render={() => <Redirect to="/homeDashboard" />} />

                <PrivateRoute
                    path="/dashboard"
                    component={this.haveAccess(userRoleId, '/dashboard') ? lazyLoad(Dashboard) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/homeDashboard"
                    component={this.haveAccess(userRoleId, '/homeDashboard') ? lazyLoad(HomeDashboard) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationCompetitionForm"
                    component={this.haveAccess(userRoleId, '/registrationCompetitionForm')
                        ? lazyLoad(RegistrationCompetitionForm)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionOpenRegForm"
                    component={this.haveAccess(userRoleId, '/competitionOpenRegForm')
                        ? lazyLoad(CompetitionOpenRegForm)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionFormat"
                    component={this.haveAccess(userRoleId, '/competitionFormat')
                        ? lazyLoad(CompetitionFormat)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionFinals"
                    component={this.haveAccess(userRoleId, '/competitionFinals')
                        ? lazyLoad(CompetitionFinals)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionLadder"
                    component={this.haveAccess(userRoleId, '/competitionLadder')
                        ? lazyLoad(CompetitionLadder)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionCourtAndTimesAssign"
                    component={this.haveAccess(userRoleId, '/competitionCourtAndTimesAssign')
                        ? lazyLoad(CompetitionCourtAndTimesAssign)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionVenueAndCourts"
                    component={this.haveAccess(userRoleId, '/competitionVenueAndCourts')
                        ? lazyLoad(CompetitionVenueAndCourts)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionReplicate"
                    component={this.haveAccess(userRoleId, '/competitionReplicate')
                        ? lazyLoad(CompetitionReplicate)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionVenueAndTimesAdd"
                    component={this.haveAccess(userRoleId, '/competitionVenueAndTimesAdd')
                        ? lazyLoad(CompetitionVenueAndTimesAdd)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionVenueAndTimesEdit"
                    component={this.haveAccess(userRoleId, '/competitionVenueAndTimesEdit')
                        ? lazyLoad(CompetitionVenueAndTimesEdit)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionVenueTimesPrioritisation"
                    component={this.haveAccess(userRoleId, '/competitionVenueTimesPrioritisation')
                        ? lazyLoad(CompetitionVenueTimesPrioritisation)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionReGrading"
                    component={this.haveAccess(userRoleId, '/competitionReGrading') ? lazyLoad(CompetitionReGrading) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionReGradingStep2"
                    component={this.haveAccess(userRoleId, '/competitionReGradingStep2') ? lazyLoad(CompetitionReGradingStep2) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionDashboard"
                    component={this.haveAccess(userRoleId, '/competitionDashboard') ? lazyLoad(CompetitionDashboard) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionPlayerGrades"
                    component={this.haveAccess(userRoleId, '/competitionPlayerGrades') ? lazyLoad(CompetitionPlayerGrades) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionProposedTeamGrading"
                    component={this.haveAccess(userRoleId, '/competitionProposedTeamGrading')
                        ? lazyLoad(CompetitionProposedTeamGrading)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionPlayerGradeCalculate"
                    component={this.haveAccess(userRoleId, '/competitionPlayerGradeCalculate')
                        ? lazyLoad(CompetitionPlayerGradeCalculate)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionPartPlayerGrades"
                    component={this.haveAccess(userRoleId, '/competitionPartPlayerGrades')
                        ? lazyLoad(CompetitionPartPlayerGrades)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionPartPlayerGradeCalculate"
                    component={this.haveAccess(userRoleId, '/competitionPartPlayerGradeCalculate')
                        ? lazyLoad(CompetitionPartPlayerGradeCalculate)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionPartProposedTeamGrading"
                    component={this.haveAccess(userRoleId, '/competitionPartProposedTeamGrading')
                        ? lazyLoad(CompetitionPartProposedTeamGrading)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/quickCompetitionInvitations"
                    component={this.haveAccess(userRoleId, '/quickCompetitionInvitations')
                        ? lazyLoad(CompetitionQuickCompetitionInvitations)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/quickCompetitionMatchFormat"
                    component={this.haveAccess(userRoleId, '/quickCompetitionMatchFormat')
                        ? lazyLoad(CompetitionQuickCompetitionMatchFormat)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionPartTeamGradeCalculate"
                    component={this.haveAccess(userRoleId, '/competitionPartTeamGradeCalculate')
                        ? lazyLoad(CompetitionPartTeamGradeCalculate)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionDrawsOld"
                    component={this.haveAccess(userRoleId, '/competitionDraws') ? lazyLoad(MultiFieldDrawsNew) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionDraws"
                    component={this.haveAccess(userRoleId, '/competitionDraws') ? lazyLoad(MultiFieldDrawsNewTimeline) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionDrawEdit"
                    component={this.haveAccess(userRoleId, '/competitionDrawEdit') ? lazyLoad(CompetitionDrawEdit) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionFixtures"
                    component={this.haveAccess(userRoleId, '/competitionFixtures') ? lazyLoad(CompetitionFixtures) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/quickCompetition"
                    component={this.haveAccess(userRoleId, '/quickCompetition') ? lazyLoad(CompetitionQuickCompetition) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/competitionPlayerImport"
                    component={this.haveAccess(userRoleId, '/competitionPlayerImport') ? lazyLoad(CompetitionPlayerImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/competitionTeamsImport"
                    component={this.haveAccess(userRoleId, '/competitionTeamsImport') ? lazyLoad(CompetitionTeamImport) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/competitionException"
                    component={this.haveAccess(userRoleId, '/competitionException') ? lazyLoad(CompetitionException) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/multifieldDraws"
                    component={this.haveAccess(userRoleId, '/multifieldDraws') ? lazyLoad(MultiFieldDraws) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/multiDraws"
                    component={this.haveAccess(userRoleId, '/multiDraws') ? lazyLoad(CompetitionDraws) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/productAdd"
                    component={this.haveAccess(userRoleId, '/productAdd') ? lazyLoad(ProductAdd) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registration"
                    component={this.haveAccess(userRoleId, '/registration') ? lazyLoad(Registration) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/productAddRegistration"
                    component={this.haveAccess(userRoleId, '/productAddRegistration')
                        ? lazyLoad(ProductAddRegistration)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/productRegistrationClub"
                    component={this.haveAccess(userRoleId, '/productRegistrationClub')
                        ? lazyLoad(ProductRegistrationClub)
                        : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/userGraphicalDashboard"
                    component={this.haveAccess(userRoleId, '/userGraphicalDashboard')
                        ? lazyLoad(UserDashboard)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userTextualDashboard"
                    component={this.haveAccess(userRoleId, '/userTextualDashboard')
                        ? lazyLoad(UserTextualDashboard)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userPersonal"
                    component={this.haveAccess(userRoleId, '/userPersonal')
                        ? lazyLoad(UserModulePersonalDetail)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userMedical"
                    component={this.haveAccess(userRoleId, '/userMedical') ? lazyLoad(userModuleMedical) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/liveScoreMatchSheet"
                    component={this.haveAccess(userRoleId, '/liveScoreMatchSheet')
                        ? lazyLoad(LiveScoreMatchSheet)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registrationList"
                    component={this.haveAccess(userRoleId, '/registrationList') ? lazyLoad(RegistrationList) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/liveScorePlayerProfile"
                    component={this.haveAccess(userRoleId, '/liveScorePlayerProfile') ? lazyLoad(LiveScorePlayerProfile) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registrationPayments"
                    component={this.haveAccess(userRoleId, '/registrationPayments') ? lazyLoad(RegistrationPayments) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/umpireAllocation"
                    component={this.haveAccess(userRoleId, '/umpireAllocation') ? lazyLoad(UmpireAllocation) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registrationForm"
                    component={this.haveAccess(userRoleId, '/registrationForm') ? lazyLoad(RegistrationForm) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registrationMembershipFee"
                    component={this.haveAccess(userRoleId, '/registrationMembershipFee') ? lazyLoad(RegistrationMembershipFee) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registrationCompetitionFee"
                    component={this.haveAccess(userRoleId, '/registrationCompetitionFee') ? lazyLoad(RegistrationCompetitionFee) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userAffiliatesList"
                    component={this.haveAccess(userRoleId, '/userAffiliatesList') ? lazyLoad(UserAffiliatesList) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/affiliateDirectory"
                    component={this.haveAccess(userRoleId, '/affiliateDirectory') ? lazyLoad(AffiliateDirectory) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userAffiliateApproveRejectForm"
                    component={this.haveAccess(userRoleId, '/userAffiliateApproveRejectForm')
                        ? lazyLoad(UserAffiliateApproveRejectForm)
                        : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userAddAffiliates"
                    component={this.haveAccess(userRoleId, '/userAddAffiliates') ? lazyLoad(UserAddAffiliates) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userEditAffiliates"
                    component={this.haveAccess(userRoleId, '/userEditAffiliates') ? lazyLoad(UserEditAffiliates) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/userOurOrganisation"
                    component={this.haveAccess(userRoleId, '/userOurOrganisation') ? lazyLoad(UserOurOrganization) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/venuesList"
                    component={this.haveAccess(userRoleId, '/venuesList') ? lazyLoad(VenuesList) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/appRegistrationForm"
                    component={this.haveAccess(userRoleId, '/appRegistrationForm') ? lazyLoad(AppRegistrationForm) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registrationMembershipList"
                    component={this.haveAccess(userRoleId, '/registrationMembershipList') ? lazyLoad(RegistrationMembershipList) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/registrationCompetitionList"
                    component={this.haveAccess(userRoleId, '/registrationCompetitionList')
                        ? lazyLoad(RegistrationCompetitionList)
                        : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreDashboard"
                    component={this.haveAccess(userRoleId, '/liveScoreDashboard') ? lazyLoad(LiveScoreDashboard) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreMatches"
                    component={this.haveAccess(userRoleId, '/liveScoreMatches') ? lazyLoad(LiveScoreMatches) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreMatchDetails"
                    component={this.haveAccess(userRoleId, '/liveScoreMatchDetails') ? lazyLoad(LiveScoreMatchDetails) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreAddMatch"
                    component={this.haveAccess(userRoleId, '/liveScoreAddMatch') ? lazyLoad(LiveScoreAddMatch) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScorerList"
                    component={this.haveAccess(userRoleId, '/liveScorerList') ? lazyLoad(LiveScorerList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreAddScorer"
                    component={this.haveAccess(userRoleId, '/liveScoreAddScorer') ? lazyLoad(LiveScoreAddScorer) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreTeam"
                    component={this.haveAccess(userRoleId, '/liveScoreTeam') ? lazyLoad(LiveScoreTeam) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreAddTeam"
                    component={this.haveAccess(userRoleId, '/liveScoreAddTeam') ? lazyLoad(LiveScoreAddTeam) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreManagerList"
                    component={this.haveAccess(userRoleId, '/liveScoreManagerList') ? lazyLoad(LiveScoreManagerList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreAddManagers"
                    component={this.haveAccess(userRoleId, '/liveScoreAddManagers') ? lazyLoad(LiveScoreAddManager) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreManagerImport"
                    component={this.haveAccess(userRoleId, '/liveScoreManagerImport') ? lazyLoad(LiveScoreManagerImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreManagerView"
                    component={this.haveAccess(userRoleId, '/liveScoreManagerView') ? lazyLoad(LiveScoreManagerView) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreTeamView"
                    component={this.haveAccess(userRoleId, '/liveScoreTeamView') ? lazyLoad(LiveScoreTeamView) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScorerView"
                    component={this.haveAccess(userRoleId, '/liveScorerView') ? lazyLoad(LiveScorerView) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreMatchImport"
                    component={this.haveAccess(userRoleId, '/liveScoreMatchImport') ? lazyLoad(LiveScoreMatchImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreTeamImport"
                    component={this.haveAccess(userRoleId, '/liveScoreTeamImport') ? lazyLoad(LiveScoreTeamImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreUmpireList"
                    component={this.haveAccess(userRoleId, '/liveScoreUmpireList') ? lazyLoad(LiveScoreUmpireList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreLadderList"
                    component={this.haveAccess(userRoleId, '/liveScoreLadderList') ? lazyLoad(LiveScoreLadderList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScorePlayerList"
                    component={this.haveAccess(userRoleId, '/liveScorePlayerList') ? lazyLoad(LiveScorePlayerList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScorerPlayerImport"
                    component={this.haveAccess(userRoleId, '/liveScorerPlayerImport') ? lazyLoad(LiveScorerPlayerImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreAddPlayer"
                    component={this.haveAccess(userRoleId, '/liveScoreAddPlayer') ? lazyLoad(LiveScoreAddPlayer) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScorePlayerView"
                    component={this.haveAccess(userRoleId, '/liveScorePlayerView') ? lazyLoad(LiveScorePlayerView) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreIncidentView"
                    component={this.haveAccess(userRoleId, '/liveScoreIncidentView') ? lazyLoad(LiveScoreIncidentView) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreIncidentList"
                    component={this.haveAccess(userRoleId, '/liveScoreIncidentList') ? lazyLoad(LiveScoreIncidentList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreNewsList"
                    component={this.haveAccess(userRoleId, '/liveScoreNewsList') ? lazyLoad(LiveScoreNewsList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreAddNews"
                    component={this.haveAccess(userRoleId, '/liveScoreAddNews') ? lazyLoad(LiveScoreAddNews) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreNewsView"
                    component={this.haveAccess(userRoleId, '/liveScoreNewsView') ? lazyLoad(LiveScoreNewsView) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreSettingsView"
                    component={this.haveAccess(userRoleId, '/liveScoreSettingsView') ? lazyLoad(LiveScoreSettingsView) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreBanners"
                    component={this.haveAccess(userRoleId, '/liveScoreBanners') ? lazyLoad(LiveScoreBanners) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreTeamAttendance"
                    component={this.haveAccess(userRoleId, '/liveScoreTeamAttendance') ? lazyLoad(LiveScoreTeamAttendance) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreGameTimeList"
                    component={this.haveAccess(userRoleId, '/liveScoreGameTimeList') ? lazyLoad(LiveScoreGameTimeList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreGoalsList"
                    component={this.haveAccess(userRoleId, '/liveScoreGoalsList') ? lazyLoad(LiveScoreGoalsList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreCompetitions"
                    component={this.haveAccess(userRoleId, '/liveScoreCompetitions') ? lazyLoad(LiveScoreCompetitions) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreBulkChange"
                    component={this.haveAccess(userRoleId, '/liveScoreBulkChange') ? lazyLoad(LiveScoreBulkChange) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreEditBanners"
                    component={this.haveAccess(userRoleId, '/liveScoreEditBanners') ? lazyLoad(LiveScoreEditBanners) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreDivisionList"
                    component={this.haveAccess(userRoleId, '/liveScoreDivisionList') ? lazyLoad(LiveScoreDivisionList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreAddDivision"
                    component={this.haveAccess(userRoleId, '/liveScoreAddDivision') ? lazyLoad(LiveScoreAddDivision) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreAddIncident"
                    component={this.haveAccess(userRoleId, '/liveScoreAddIncident') ? lazyLoad(LiveScoreAddIncident) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreLadderSettings"
                    component={this.haveAccess(userRoleId, '/liveScoreLadderSettings') ? lazyLoad(LiveScoreLadderSettings) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreDivisionImport"
                    component={this.haveAccess(userRoleId, '/liveScoreDivisionImport') ? lazyLoad(LiveScoreDivisionImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreAssignMatch"
                    component={this.haveAccess(userRoleId, '/liveScoreAssignMatch') ? lazyLoad(LiveScoreAssignMatch) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreVenueChange"
                    component={this.haveAccess(userRoleId, '/liveScoreVenueChange') ? lazyLoad(LiveScoreVenueChange) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationFormList"
                    component={this.haveAccess(userRoleId, '/registrationFormList') ? lazyLoad(RegistrationFormList) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreIncidentImport"
                    component={this.haveAccess(userRoleId, '/liveScoreIncidentImport') ? lazyLoad(LiveScoreIncidentImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScorePublicLadder"
                    component={this.haveAccess(userRoleId, '/liveScorePublicLadder') ? lazyLoad(LiveScorePublicLadder) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreSeasonFixture"
                    component={this.haveAccess(userRoleId, '/liveScoreSeasonFixture') ? lazyLoad(LiveScoreSeasonFixture) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/playWithFriend"
                    component={this.haveAccess(userRoleId, '/playWithFriend') ? lazyLoad(PlayWithFriend) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/referFriend"
                    component={this.haveAccess(userRoleId, '/referFriend') ? lazyLoad(ReferFriend) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/invoice"
                    component={this.haveAccess(userRoleId, '/invoice') ? lazyLoad(RegistrationInvoice) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/checkoutPayment"
                    component={this.haveAccess(userRoleId, '/checkoutPayment') ? lazyLoad(Stripe) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationSettlements"
                    component={this.haveAccess(userRoleId, '/registrationSettlements') ? lazyLoad(RegistrationSettlements) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationPayoutTransaction"
                    component={this.haveAccess(userRoleId, '/registrationPayoutTransaction')
                        ? lazyLoad(RegistrationPayoutTransaction)
                        : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreCoaches"
                    component={this.haveAccess(userRoleId, '/liveScoreCoaches') ? lazyLoad(LiveScoreCoaches) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreAddEditCoach"
                    component={this.haveAccess(userRoleId, '/liveScoreAddEditCoach') ? lazyLoad(LiveScoreAddEditCoach) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreCoachImport"
                    component={this.haveAccess(userRoleId, '/liveScoreCoachImport') ? lazyLoad(LiveScorerCoachImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreSocialSheet"
                    component={this.haveAccess(userRoleId, '/liveScoreSocialSheet') ? lazyLoad(LiveScoreSocialSheet) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpireDashboard"
                    component={this.haveAccess(userRoleId, '/umpireDashboard') ? lazyLoad(UmpireDashboard) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/addUmpire"
                    component={this.haveAccess(userRoleId, '/addUmpire') ? lazyLoad(AddUmpire) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/shopDashboard"
                    component={this.haveAccess(userRoleId, '/shopDashboard') ? lazyLoad(ShopDashboard) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpireRoster"
                    component={this.haveAccess(userRoleId, '/umpireRoster') ? lazyLoad(UmpireRoaster) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpireImport"
                    component={this.haveAccess(userRoleId, '/umpireImport') ? lazyLoad(UmpireImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpire"
                    component={this.haveAccess(userRoleId, '/umpire') ? lazyLoad(Umpire) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/listProducts"
                    component={this.haveAccess(userRoleId, '/listProducts') ? lazyLoad(ListProducts) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/addProduct"
                    component={this.haveAccess(userRoleId, '/addProduct') ? lazyLoad(AddProduct) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/paymentDashboard"
                    component={this.haveAccess(userRoleId, '/paymentDashboard') ? lazyLoad(PaymentDashboard) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/orderSummary"
                    component={this.haveAccess(userRoleId, '/orderSummary') ? lazyLoad(OrderSummary) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/orderStatus"
                    component={this.haveAccess(userRoleId, '/orderStatus') ? lazyLoad(ShopOrderStatus) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/shopSettings"
                    component={this.haveAccess(userRoleId, '/shopSettings') ? lazyLoad(ShopSettings) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/userProfileEdit"
                    component={this.haveAccess(userRoleId, '/userProfileEdit') ? lazyLoad(UserProfileEdit) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/assignUmpire"
                    component={this.haveAccess(userRoleId, '/assignUmpire') ? lazyLoad(AssignUmpire) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpireSetting"
                    component={this.haveAccess(userRoleId, '/umpireSetting') ? lazyLoad(UmpireSetting) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpireDivisions"
                    component={this.haveAccess(userRoleId, '/umpireDivisions') ? lazyLoad(UmpireDivisions) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpirePoolAllocation"
                    component={this.haveAccess(userRoleId, '/umpirePoolAllocation') ? lazyLoad(UmpirePoolAllocation) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreUmpireImport"
                    component={this.haveAccess(userRoleId, '/liveScoreUmpireImport') ? lazyLoad(LiveScoreUmpireImport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationDashboard"
                    component={this.haveAccess(userRoleId, '/registrationDashboard') ? lazyLoad(RegistrationMainDashboard) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScoreLadderAdjustment"
                    component={this.haveAccess(userRoleId, '/liveScoreLadderAdjustment') ? lazyLoad(LiveScoreLadderAdjustment) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/liveScorePositionTrackReport"
                    component={this.haveAccess(userRoleId, '/liveScorePositionTrackReport')
                        ? lazyLoad(LiveScorePositionTrackReport)
                        : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationChange"
                    component={this.haveAccess(userRoleId, '/registrationChange') ? lazyLoad(RegistrationChange) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/account"
                    component={this.haveAccess(userRoleId, '/account') ? lazyLoad(Account) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/support"
                    component={this.haveAccess(userRoleId, '/support') ? lazyLoad(HelpAndSupport) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/registrationChangeReview"
                    component={this.haveAccess(userRoleId, '/registrationChangeReview') ? lazyLoad(RegistrationChangeReview) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/teamRegistrations"
                    component={this.haveAccess(userRoleId, '/teamRegistrations') ? lazyLoad(TeamRegistrations) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpirePayment"
                    component={this.haveAccess(userRoleId, '/umpirePayment') ? lazyLoad(UmpirePayment) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpirePaymentSetting"
                    component={this.haveAccess(userRoleId, '/umpirePaymentSetting') ? lazyLoad(UmpirePaymentSetting) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/umpirePayout"
                    component={this.haveAccess(userRoleId, '/umpirePayout') ? lazyLoad(UmpirePayout) : lazyLoad(NotFound)}
                />

                <PrivateRoute
                    path="/orderDetails"
                    component={this.haveAccess(userRoleId, '/orderDetails') ? lazyLoad(OrderDetails) : lazyLoad(NotFound)}
                />
                <PrivateRoute
                    path="/deregistration"
                    component={this.haveAccess(userRoleId, '/multifieldDraws') ? lazyLoad(deRegistration) : lazyLoad(NotFound)}
                />

                <PrivateRoute path="/communication" component={lazyLoad(CommunicationBanner)} />

                <PrivateRoute
                    path="/communicationEditBanners"
                    component={lazyLoad(CommunicationEditBanners)}
                />

                <PrivateRoute path="/communicationList" component={lazyLoad(CommunicationList)} />

                <PrivateRoute path="/addCommunication" component={lazyLoad(AddCommunication)} />

                <PrivateRoute path="/communicationView" component={lazyLoad(CommunicationView)} />

                <Route path="/" component={lazyLoad(NotFound)} />

                <Redirect from="*" to="/404" />
            </Switch>
        );
    }
}

export default Routes;
