import React, {useEffect, useState} from 'react';
import PlansTable from "../components/PlansTable";
import {getAllSubscriptionPlans} from "../api/subscriptions";
import {authUser, getUserData} from "../api/users";
import redirectToHomepage from "../helpers/redirectToHomepage";
import LoggedUserHeader from "../components/LoggedUserHeader";
import PageHeader from "../components/PageHeader";

const PlansPage = () => {
    const [plans, setPlans] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        authUser()
            .then((res) => {
                if(res?.status === 201) {
                    getUserData()
                        .then((res) => {
                            if (res?.status === 200) {
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

                                    setUser(userTmp);
                                }
                            }
                        })
                }
                else {
                    redirectToHomepage();
                }
            });

        getAllSubscriptionPlans()
            .then((res) => {
                if(res?.data) {
                    setPlans(res.data);
                }
            });
    }, []);

    return <>
        {user ? <LoggedUserHeader user={user} /> : ''}

        <div className="container container--plans">
            <div className="homepage w">
                <PageHeader>
                    Plany i płatności
                </PageHeader>

                <PlansTable plans={plans} />
            </div>
        </div>
    </>
};

export default PlansPage;
