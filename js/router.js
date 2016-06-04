m.route.mode = "hash";
m.route(document.getElementById("root"), "/",
    {
        "/": login,
        "/project": projectView,
        "/project/:projectId": issueView,
        "/project/:projectId/issue/:issueId":issueDetail
    }
    );
