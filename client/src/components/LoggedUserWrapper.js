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
import {getPlanById} from "../api/subscriptions";
import PlansPage from "../pages/PlansPage";
import SubscriptionPage from "../pages/SubscriptionPage";
import TransactionsPage from "../pages/TransactionsPage";
import {getTeamById} from "../api/teams";

const UserContext = React.createContext({});

const LoggedUserWrapper = ({page}) => {
    const [render, setRender] = useState(null);
    const [user, setUser] = useState({});
    const [plan, setPlan] = useState(1);
    const [deadline, setDeadline] = useState(new Date());

    useEffect(() => {
        if(page) {
            userAuth();
        }
    }, [page]);

    const userAuth = async () => {
        try {
            const authResult = await authUser();

            if(authResult.status === 201) {
                await userDataFetch();
            }
            else {
                redirectToHomepage();
            }
        }
        catch(e) {
            redirectToHomepage();
        }
    }

    const userDataFetch = async () => {
        try {
            const userDataResult = await getUserData();

            if(userDataResult.status === 200) {
                let data = userDataResult.data;
                let isTeamOwner = false;

                if(data.team_id) {
                    const userTeamDataResult = await getTeamById(data.team_id);

                    if(userTeamDataResult) {
                        isTeamOwner = userTeamDataResult.data.owner_id === data.id;
                    }
                }

                setUser({
                    id: data.id,
                    teamId: data.team_id,
                    email: data.email,
                    canEditTeamFiles: data.can_edit_team_files,
                    canDeleteTeamFiles: data.can_delete_team_files,
                    canEditTeamMatchSchemas: data.can_edit_team_match_schemas,
                    canDeleteTeamMatchSchemas: data.can_delete_team_match_schemas,
                    isTeamOwner: isTeamOwner
                });

                userGetPlan();
            }
            else {
                redirectToHomepage();
            }
        }
        catch(e) {
            redirectToHomepage();
        }
    }

    const userGetPlan = async () => {
        try {
            const getPlanResult = await getUserTeamPlan();

            if(getPlanResult.status === 200) {
                const getPlanDetailsResult = await getPlanById(getPlanResult.data.plan);

                if(getPlanDetailsResult) {
                    setPlan(getPlanDetailsResult.data);
                }

                setDeadline(new Date(getPlanResult.data.deadline));
            }

            selectPage();
        }
        catch(e) {
            selectPage();
        }
    }

    const selectPage = () => {
        switch(page) {
            case 1:
                setRender(<Homepage />);
                break;
            case 2:
                setRender(<FilesPage />);
                break;
            case 3:
                setRender(<SchemasPage />);
                break;
            case 4:
                setRender(<CorrelationPage />);
                break;
            case 5:
                setRender(<TeamPage />);
                break;
            case 6:
                setRender(<ChangePassword />);
                break;
            case 7:
                setRender(<FileViewPage />);
                break;
            case 8:
                setRender(<PlansPage />);
                break;
            case 9:
                setRender(<SubscriptionPage />);
                break;
            case 10:
                setRender(<TransactionsPage />);
                break;
            default:
                redirectToHomepage();
        }
    }

    return render ? <UserContext.Provider value={{
        user,
        plan,
        deadline
    }}>
        <LoggedUserHeader />
        {render}
    </UserContext.Provider> : <LoadingPage />
};

export default LoggedUserWrapper;
export { UserContext }
