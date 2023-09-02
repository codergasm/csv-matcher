import React, {useEffect, useState} from 'react';
import {authUser, getUserData, getUserTeamPlan} from "../api/users";
import Homepage from "../pages/Homepage";
import CorrelationPage from "../pages/CorrelationPage";
import LoggedUserHeader from "./LoggedUserHeader";
import ChangePassword from "../pages/ChangePassword";
import TeamPage from "../pages/TeamPage";
import LoadingPage from "../pages/LoadingPage";
import FilesPage from "../pages/FilesPage";
import SchemasPage from "../pages/SchemasPage";
import redirectToHomepage from "../helpers/redirectToHomepage";
import FileViewPage from "../pages/FileViewPage";
import getUrlParam from "../helpers/getUrlParam";
import {apiAuthorization, getApiRequestById} from "../api/api";
import convertRelationTypeStringToNumber from "../helpers/convertRelationTypeStringToNumber";
import PlansPage from "../pages/PlansPage";
import SubscriptionPage from "../pages/SubscriptionPage";
import {getAllSubscriptionPlans} from "../api/subscriptions";

const SubscriptionContext = React.createContext({});
const ApiContext = React.createContext({});

const LoggedUserWrapper = ({page}) => {
    const [api, setApi] = useState(false);
    const [apiUserId, setApiUserId] = useState(-1);
    const [apiTeamId, setApiTeamId] = useState(-1);
    const [apiRequestId, setApiRequestId] = useState(0);
    const [apiRequestCreateDateTime, setApiRequestCreateDateTime] = useState(null);
    const [apiToken, setApiToken] = useState('');
    const [apiOutputEndpoint, setApiOutputEndpoint] = useState('');
    const [apiUserRedirectionWebsite, setApiUserRedirectionWebsite] = useState('');
    const [apiRelationType, setApiRelationType] = useState(-1);
    const [planId, setPlanId] = useState(0);
    const [isUserTeamOwner, setIsUserTeamOwner] = useState(false);
    const [planDeadline, setPlanDeadline] = useState('');
    const [plans, setPlans] = useState([]);
    const [render, setRender] = useState(null);
    const [user, setUser] = useState({});
    const [currentPlan, setCurrentPlan] = useState({});

    useEffect(() => {
        getAllSubscriptionPlans()
            .then((res) => {
                if(res?.data) {
                    setPlans(res.data);
                }
            });
    }, []);

    useEffect(() => {
        if(plans?.length && planId) {
            setCurrentPlan(plans.find((item) => (item.id === planId)));
        }
    }, [plans, planId]);

    useEffect(() => {
        const apiRequestId = getUrlParam('id');
        const apiRequestToken = getUrlParam('token');

        if(apiRequestId && apiRequestToken) {
            authApiUser(apiRequestId, apiRequestToken);
        }
        else {
            authNormalUser();
        }
    }, [page]);

    const authApiUser = (id, token) => {
        apiAuthorization(id, token)
            .then((res) => {
                if(res?.data) {
                    setApi(true);
                    setApiRequestId(parseInt(id));
                    setApiToken(token);

                    localStorage.setItem('apiRequestId', id);
                    localStorage.setItem('apiToken', token);

                    getApiRequestById(id, token)
                        .then((res) => {
                            if(res?.data) {
                                const data = res.data;

                                setApiTeamId(data.team_id);
                                setApiUserId(data.user_id);
                                setApiRequestCreateDateTime(data.create_datetime);
                                setApiOutputEndpoint(data.output_endpoint);
                                setApiUserRedirectionWebsite(data.user_redirection_website);
                                setApiRelationType(convertRelationTypeStringToNumber(data.relation_type));

                                if(page === 3 || page === 4) {
                                    selectPage(page);
                                }
                                else {
                                    redirectToHomepage();
                                }
                            }
                            else {
                                authNormalUser();
                            }
                        })
                        .catch(() => {
                            authNormalUser();
                        })
                }
                else {
                    authNormalUser();
                }
            })
            .catch(() => {
                authNormalUser();
            })
    }

    const authNormalUser = () => {
        if(page) {
            authUser()
                .then((res) => {
                    if(res?.status === 201) {
                        getUserTeamPlan()
                            .then((res) => {
                                if(res?.status === 200) {
                                    setPlanId(res?.data?.plan);
                                    setPlanDeadline(res?.data?.deadline ? new Date(res.data.deadline) : '');
                                    setIsUserTeamOwner(res?.data?.isTeamOwner);
                                }
                                else {
                                    redirectToHomepage();
                                }
                            })
                            .catch(() => {
                                redirectToHomepage();
                            });

                        getUserData()
                            .then((res) => {
                                if(res?.status === 200) {
                                    let userTmp = {};

                                    if(res?.data) {
                                        let data = res.data;
                                        userTmp = {
                                            id: data.id,
                                            teamId: data.team_id,
                                            email: data.email,
                                            canEditTeamFiles: data.can_edit_team_files,
                                            canDeleteTeamFiles: data.can_delete_team_files,
                                            canEditTeamMatchSchemas: data.can_edit_team_match_schemas,
                                            canDeleteTeamMatchSchemas: data.can_delete_team_match_schemas
                                        }
                                    }

                                    setUser(userTmp);
                                    selectPage(userTmp);
                                }
                                else {
                                    redirectToHomepage();
                                }
                            })
                            .catch(() => {
                                redirectToHomepage();
                            });
                    }
                    else {
                        redirectToHomepage();
                    }
                })
                .catch(() => {
                    redirectToHomepage();
                });
        }
    }

    const selectPage = (userTmp) => {
        switch(page) {
            case 1:
                setRender(<Homepage />);
                break;
            case 2:
                setRender(<FilesPage user={userTmp} />);
                break;
            case 3:
                setRender(<SchemasPage user={userTmp} />);
                break;
            case 4:
                setRender(<CorrelationPage user={userTmp} />);
                break;
            case 5:
                setRender(<TeamPage user={userTmp} />);
                break;
            case 6:
                setRender(<ChangePassword />);
                break;
            case 7:
                setRender(<FileViewPage />);
                break;
            case 8:
                setRender(<PlansPage user={userTmp} />);
                break;
            case 9:
                setRender(<SubscriptionPage />);
                break;
            default:
                redirectToHomepage();
        }
    }

    return render ? <ApiContext.Provider value={{
        api, setApi,
        apiRequestId,
        apiToken, apiRelationType, apiUserId, apiTeamId,
        apiRequestCreateDateTime,
        apiOutputEndpoint, apiUserRedirectionWebsite
    }}>
        <SubscriptionContext.Provider value={{
            planId, setPlanId, currentPlan,
            planDeadline, setPlanDeadline,
            isUserTeamOwner,
            teamId: user.teamId
        }}>
            <LoggedUserHeader user={user}
                              planId={planId}
                              planDeadline={planDeadline} />
            {render}
        </SubscriptionContext.Provider>
    </ApiContext.Provider> : <LoadingPage />
}

export default LoggedUserWrapper;
export { ApiContext, SubscriptionContext };
