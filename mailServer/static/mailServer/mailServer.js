/**
 * Created by usman on 8/15/17.
 */


/* Java script code to create account */
app.controller('createEmailAccount', function($scope,$http) {

    $scope.emailDetails = true;
    $scope.emailLoading = true;
    $scope.canNotCreate = true;
    $scope.successfullyCreated = true;
    $scope.couldNotConnect = true;

    $scope.showEmailDetails = function(){

        $scope.emailDetails = false;
        $scope.emailLoading = true;
        $scope.canNotCreate = true;
        $scope.successfullyCreated = true;
        $scope.couldNotConnect = true;


        $scope.selectedDomain = $scope.emailDomain;


    };



    $scope.createEmailAccount = function(){

                $scope.emailDetails = false;
                $scope.emailLoading = false;
                $scope.canNotCreate = true;
                $scope.successfullyCreated = true;
                $scope.couldNotConnect = true;



                var url = "/email/submitEmailCreation";

                var domain = $scope.emailDomain;
                var username = $scope.emailUsername;
                var password = $scope.emailPassword;


                var data = {
                    domain:domain,
                    username:username,
                    password:password,
                };

                var config = {
                    headers : {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                };

                $http.post(url, data,config).then(ListInitialDatas, cantLoadInitialDatas);


                function ListInitialDatas(response) {


                    if(response.data.createEmailStatus === 1){

                        $scope.emailDetails = false;
                        $scope.emailLoading = true;
                        $scope.canNotCreate = true;
                        $scope.successfullyCreated = false;
                        $scope.couldNotConnect = true;

                        $scope.createdID = username + "@" + domain;


                    }

                    else
                    {
                        $scope.emailDetails = false;
                        $scope.emailLoading = true;
                        $scope.canNotCreate = false;
                        $scope.successfullyCreated = true;
                        $scope.couldNotConnect = true;

                        $scope.errorMessage = response.data.error_message;


                    }



                }
                function cantLoadInitialDatas(response) {

                    $scope.emailDetails = false;
                    $scope.emailLoading = true;
                    $scope.canNotCreate = true;
                    $scope.successfullyCreated = true;
                    $scope.couldNotConnect = false;



                }





    };

    $scope.hideFewDetails = function(){

        $scope.successfullyCreated = true;


    };

});
/* Java script code to create account ends here */



/* Java script code to create account */
app.controller('deleteEmailAccount', function($scope,$http) {

    $scope.emailDetails = true;
    $scope.emailLoading = true;
    $scope.canNotDelete = true;
    $scope.successfullyDeleted = true;
    $scope.couldNotConnect = true;
    $scope.emailDetailsFinal = true;
    $scope.noEmails = true;

    $scope.showEmailDetails = function(){

        $scope.emailDetails = true;
        $scope.emailLoading = false;
        $scope.canNotDelete = true;
        $scope.successfullyDeleted = true;
        $scope.couldNotConnect = true;
        $scope.emailDetailsFinal = true;
        $scope.noEmails = true;


        var url = "/email/getEmailsForDomain";

        var domain = $scope.emailDomain;



                var data = {
                    domain:domain,
                };

                var config = {
                    headers : {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                };

                $http.post(url, data,config).then(ListInitialDatas, cantLoadInitialDatas);


                function ListInitialDatas(response) {


                    if(response.data.fetchStatus == 1){

                        $scope.emails = JSON.parse(response.data.data);


                        $scope.emailDetails = false;
                        $scope.emailLoading = true;
                        $scope.canNotDelete = true;
                        $scope.successfullyDeleted = true;
                        $scope.couldNotConnect = true;
                        $scope.emailDetailsFinal = true;
                        $scope.noEmails = true;





                    }

                    else
                    {
                         $scope.emailDetails = true;
                         $scope.emailLoading = true;
                         $scope.canNotDelete = true;
                         $scope.successfullyDeleted = true;
                         $scope.couldNotConnect = true;
                         $scope.emailDetailsFinal = true;
                         $scope.noEmails = false;

                    }



                }
                function cantLoadInitialDatas(response) {

                    $scope.emailDetails = true;
                         $scope.emailLoading = true;
                         $scope.canNotDelete = true;
                         $scope.successfullyDeleted = true;
                         $scope.couldNotConnect = false;
                         $scope.emailDetailsFinal = true;
                         $scope.noEmails = true;



                }






    };


    $scope.deleteEmailAccountFinal = function(){

        $scope.emailLoading = false;


        var url = "/email/submitEmailDeletion";

        var email = $scope.selectedEmail;



                var data = {
                    email:email,
                };

                var config = {
                    headers : {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                };

                $http.post(url, data,config).then(ListInitialDatas, cantLoadInitialDatas);


                function ListInitialDatas(response) {


                    if(response.data.deleteEmailStatus === 1){


                        $scope.emailDetails = true;
                        $scope.emailLoading = true;
                        $scope.canNotDelete = true;
                        $scope.successfullyDeleted = false;
                        $scope.couldNotConnect = true;
                        $scope.emailDetailsFinal = true;
                        $scope.noEmails = true;

                         $scope.deletedID = email;

                    }

                    else
                    {
                            $scope.emailDetails = true;
                            $scope.emailLoading = true;
                            $scope.canNotDelete = false;
                            $scope.successfullyDeleted = true;
                            $scope.couldNotConnect = true;
                            $scope.emailDetailsFinal = true;
                            $scope.noEmails = true;

                            $scope.errorMessage = response.data.error_message;

                    }



                }
                function cantLoadInitialDatas(response) {

                            $scope.emailDetails = true;
                            $scope.emailLoading = true;
                            $scope.canNotDelete = true;
                            $scope.successfullyDeleted = true;
                            $scope.couldNotConnect = false;
                            $scope.emailDetailsFinal = true;
                            $scope.noEmails = true;



                }






    };



    $scope.deleteEmailAccount = function(){

        var domain = $scope.selectedEmail;

        if(domain.length>0) {
            $scope.emailDetailsFinal = false;
        }

    };

});
/* Java script code to create account ends here */



/* Java script code to create account */
app.controller('changeEmailPassword', function($scope,$http) {

    $scope.emailLoading = true;
    $scope.emailDetails = true;
    $scope.canNotChangePassword = true;
    $scope.passwordChanged = true;
    $scope.couldNotConnect = true;
    $scope.noEmails = true;

    $scope.showEmailDetails = function(){

        $scope.emailLoading = false;
        $scope.emailDetails = true;
        $scope.canNotChangePassword = true;
        $scope.passwordChanged = true;
        $scope.couldNotConnect = true;
        $scope.noEmails = true;


        var url = "/email/getEmailsForDomain";

        var domain = $scope.emailDomain;



                var data = {
                    domain:domain,
                };

                var config = {
                    headers : {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                };

                $http.post(url, data,config).then(ListInitialDatas, cantLoadInitialDatas);


                function ListInitialDatas(response) {


                    if(response.data.fetchStatus == 1){

                        $scope.emails = JSON.parse(response.data.data);


                        $scope.emailLoading = true;
                        $scope.emailDetails = false;
                        $scope.canNotChangePassword = true;
                        $scope.passwordChanged = true;
                        $scope.couldNotConnect = true;
                        $scope.noEmails = true;





                    }

                    else
                    {
                         $scope.emailLoading = true;
                        $scope.emailDetails = true;
                        $scope.canNotChangePassword = true;
                        $scope.passwordChanged = true;
                        $scope.couldNotConnect = true;
                        $scope.noEmails = false;

                    }



                }
                function cantLoadInitialDatas(response) {

                    $scope.emailLoading = true;
                    $scope.emailDetails = true;
                    $scope.canNotChangePassword = true;
                    $scope.passwordChanged = true;
                    $scope.couldNotConnect = false;
                    $scope.noEmails = true;



                }

    };


    $scope.changePassword = function(){

        $scope.emailLoading = false;


        var url = "/email/submitPasswordChange";

        var email = $scope.selectedEmail;
        var password = $scope.emailPassword;
        var domain = $scope.emailDomain;



                var data = {
                    domain:domain,
                    email:email,
                    password:password,
                };

                var config = {
                    headers : {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                };

                $http.post(url, data,config).then(ListInitialDatas, cantLoadInitialDatas);


                function ListInitialDatas(response) {


                    if(response.data.passChangeStatus == 1){


                        $scope.emailLoading = true;
                        $scope.emailDetails = true;
                        $scope.canNotChangePassword = true;
                        $scope.passwordChanged = false;
                        $scope.couldNotConnect = true;
                        $scope.noEmails = true;

                        $scope.passEmail = email;

                    }

                    else
                    {
                        $scope.emailLoading = true;
                        $scope.emailDetails = false;
                        $scope.canNotChangePassword = false;
                        $scope.passwordChanged = true;
                        $scope.couldNotConnect = true;
                        $scope.noEmails = true;


                        $scope.errorMessage = response.data.error_message;

                    }



                }
                function cantLoadInitialDatas(response) {

                    $scope.emailLoading = true;
                    $scope.emailDetails = false;
                    $scope.canNotChangePassword = true;
                    $scope.passwordChanged = true;
                    $scope.couldNotConnect = false;
                    $scope.noEmails = true;





                }






    };



    $scope.deleteEmailAccount = function(){

        var domain = $scope.selectedEmail;

        if(domain.length>0) {
            $scope.emailDetailsFinal = false;
        }

    };

});
/* Java script code to create account ends here */



/* Java script code for DKIM Manager */

app.controller('dkimManager', function($scope, $http, $timeout, $window) {


           $scope.manageDKIMLoading = true;
           $scope.dkimError = true;
           $scope.dkimSuccess = true;
           $scope.couldNotConnect = true;
           $scope.domainRecords = true;
           $scope.noKeysAvailable = true;



           $scope.fetchKeys = function(){

               $scope.manageDKIMLoading = false;
               $scope.dkimError = true;
               $scope.dkimSuccess = true;
               $scope.couldNotConnect = true;
               $scope.domainRecords = true;
               $scope.noKeysAvailable = true;


               url = "/email/fetchDKIMKeys";

                        var data = {
                            domainName: $scope.domainName
                        };

                        var config = {
                            headers : {
                                'X-CSRFToken': getCookie('csrftoken')
                                }
                            };



                $http.post(url, data,config).then(ListInitialDatas, cantLoadInitialDatas);


                function ListInitialDatas(response) {

                    if(response.data.fetchStatus === 1){

                        if(response.data.keysAvailable === 1){

                            $scope.manageDKIMLoading = true;
                            $scope.dkimError = true;
                            $scope.dkimSuccess = false;
                            $scope.couldNotConnect = true;
                            $scope.domainRecords = false;
                            $scope.noKeysAvailable = true;

                            $scope.privateKey = response.data.privateKey;
                            $scope.publicKey = response.data.publicKey;
                            $scope.dkimSuccessMessage = response.data.dkimSuccessMessage;



                        }else{
                            $scope.manageDKIMLoading = true;
                            $scope.dkimError = true;
                            $scope.dkimSuccess = true;
                            $scope.couldNotConnect = true;
                            $scope.domainRecords = true;
                            $scope.noKeysAvailable = false;
                        }



                    }
                    else{
                        $scope.errorMessage = response.data.error_message;

                        $scope.manageDKIMLoading = true;
                        $scope.dkimError = false;
                        $scope.dkimSuccess = true;
                        $scope.couldNotConnect = true;
                        $scope.domainRecords = true;
                        $scope.noKeysAvailable = true;
                    }

                }
                function cantLoadInitialDatas(response) {

                    $scope.manageDKIMLoading = true;
                    $scope.dkimError = true;
                    $scope.dkimSuccess = true;
                    $scope.couldNotConnect = false;
                    $scope.domainRecords = true;
                    $scope.noKeysAvailable = true;

                        
                }

           };

           $scope.createDomainDKIMKeys = function () {

               $scope.manageDKIMLoading = false;
               $scope.dkimError = true;
               $scope.dkimSuccess = true;
               $scope.couldNotConnect = true;
               $scope.domainRecords = true;
               $scope.noKeysAvailable = false;

               url = "/email/generateDKIMKeys";

                        var data = {
                            domainName: $scope.domainName
                        };

                        var config = {
                            headers : {
                                'X-CSRFToken': getCookie('csrftoken')
                                }
                            };


               $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


                function ListInitialDatas(response) {

                    if(response.data.generateStatus === 1){

                        $scope.manageDKIMLoading = true;
                        $scope.dkimError = true;
                        $scope.dkimSuccess = true;
                        $scope.couldNotConnect = true;
                        $scope.domainRecords = true;
                        $scope.noKeysAvailable = true;

                        $scope.fetchKeys();


                    }
                    else{
                        $scope.errorMessage = response.data.error_message;

                        $scope.manageDKIMLoading = true;
                        $scope.dkimError = false;
                        $scope.dkimSuccess = true;
                        $scope.couldNotConnect = true;
                        $scope.domainRecords = true;
                        $scope.noKeysAvailable = false;
                    }

                }
                function cantLoadInitialDatas(response) {

                    $scope.manageDKIMLoading = true;
                    $scope.dkimError = true;
                    $scope.dkimSuccess = true;
                    $scope.couldNotConnect = false;
                    $scope.domainRecords = true;
                    $scope.noKeysAvailable = true;


                }



           };

           // Installation


           $scope.openDKIMNotifyBox = true;
           $scope.openDKIMError = true;
           $scope.couldNotConnect = true;
           $scope.openDKIMSuccessfullyInstalled = true;
           $scope.openDKIMInstallBox = true;
           $scope.manageDKIMLoading = true;


           $scope.installOpenDKIM = function(){

               $scope.openDKIMNotifyBox = true;
               $scope.openDKIMError = true;
               $scope.couldNotConnect = true;
               $scope.openDKIMSuccessfullyInstalled = true;
               $scope.openDKIMInstallBox = true;
               $scope.manageDKIMLoading = false;

               url = "/email/installOpenDKIM";

                        var data = {};

                        var config = {
                            headers : {
                                'X-CSRFToken': getCookie('csrftoken')
                                }
                            };



                $http.post(url, data,config).then(ListInitialDatas, cantLoadInitialDatas);


                function ListInitialDatas(response) {


                    if(response.data.installOpenDKIM === 1){

                        $scope.openDKIMNotifyBox = true;
                        $scope.openDKIMError = true;
                        $scope.couldNotConnect = true;
                        $scope.openDKIMSuccessfullyInstalled = true;
                        $scope.openDKIMInstallBox = false;
                        $scope.manageDKIMLoading = true;

                        getRequestStatus();

                    }
                    else{
                        $scope.errorMessage = response.data.error_message;

                        $scope.openDKIMNotifyBox = false;
                        $scope.openDKIMError = false;
                        $scope.couldNotConnect = true;
                        $scope.openDKIMSuccessfullyInstalled = true;
                        $scope.openDKIMInstallBox = true;
                        $scope.manageDKIMLoading = true;
                    }

                }
                function cantLoadInitialDatas(response) {

                        $scope.openDKIMNotifyBox = false;
                        $scope.openDKIMError = true;
                        $scope.couldNotConnect = false;
                        $scope.openDKIMSuccessfullyInstalled = true;
                        $scope.openDKIMInstallBox = true;
                        $scope.manageDKIMLoading = false;
                }

           };


           function getRequestStatus(){

                        $scope.openDKIMNotifyBox = true;
                        $scope.openDKIMError = true;
                        $scope.couldNotConnect = true;
                        $scope.openDKIMSuccessfullyInstalled = true;
                        $scope.openDKIMInstallBox = false;
                        $scope.manageDKIMLoading = false;



                        url = "/email/installStatusOpenDKIM";

                        var data = {};

                        var config = {
                            headers : {
                                'X-CSRFToken': getCookie('csrftoken')
                                }
                            };



                $http.post(url, data,config).then(ListInitialDatas, cantLoadInitialDatas);


                function ListInitialDatas(response) {


                    if(response.data.abort === 0){
                        $scope.requestData = response.data.requestStatus;
                        $timeout(getRequestStatus,1000);
                    }
                    else{
                        // Notifications
                        $timeout.cancel();

                        $scope.openDKIMNotifyBox = false;
                        $scope.openDKIMError = true;
                        $scope.couldNotConnect = true;
                        $scope.openDKIMSuccessfullyInstalled = true;
                        $scope.openDKIMInstallBox = true;
                        $scope.manageDKIMLoading = true;

                        $scope.requestData = response.data.requestStatus;

                        if(response.data.installed === 0) {
                            $scope.openDKIMError = false;
                            $scope.errorMessage = response.data.error_message;
                        }else{
                            $scope.openDKIMSuccessfullyInstalled = false;
                            $timeout(function() {  $window.location.reload(); }, 3000);
                        }

                    }

                }
                function cantLoadInitialDatas(response) {

                        $scope.modSecNotifyBox  = false;
                        $scope.modeSecInstallBox = false;
                        $scope.modsecLoading = true;
                        $scope.failedToStartInallation = true;
                        $scope.couldNotConnect = false;
                        $scope.modSecSuccessfullyInstalled = true;
                        $scope.installationFailed = true;


                }

           }



});

/* Java script code for email forwarding */
app.controller('emailForwarding', function($scope,$http) {

    $scope.creationBox = true;
    $scope.emailDetails = true;
    $scope.forwardLoading = true;
    $scope.forwardError = true;
    $scope.forwardSuccess = true;
    $scope.couldNotConnect = true;
    $scope.notifyBox = true;


    $scope.showEmailDetails = function(){

        $scope.creationBox = true;
        $scope.emailDetails = true;
        $scope.forwardLoading = false;
        $scope.forwardError = true;
        $scope.forwardSuccess = true;
        $scope.couldNotConnect = true;
        $scope.notifyBox = true;

        var url = "/email/getEmailsForDomain";


                var data = {
                    domain:$scope.emailDomain
                };

                var config = {
                    headers : {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                };

                $http.post(url, data,config).then(ListInitialDatas, cantLoadInitialDatas);


                function ListInitialDatas(response) {


                    if(response.data.fetchStatus === 1){

                        $scope.emails = JSON.parse(response.data.data);

                        $scope.creationBox = true;
                        $scope.emailDetails = false;
                        $scope.forwardLoading = true;
                        $scope.forwardError = true;
                        $scope.forwardSuccess = true;
                        $scope.couldNotConnect = true;
                        $scope.notifyBox = false;

                    }

                    else
                    {
                        $scope.creationBox = true;
                        $scope.emailDetails = true;
                        $scope.forwardLoading = true;
                        $scope.forwardError = false;
                        $scope.forwardSuccess = true;
                        $scope.couldNotConnect = true;
                        $scope.notifyBox = false;

                        $scope.errorMessage = response.data.error_message;

                    }



                }
                function cantLoadInitialDatas(response) {

                    $scope.creationBox = true;
                    $scope.emailDetails = true;
                    $scope.forwardLoading = true;
                    $scope.forwardError = true;
                    $scope.forwardSuccess = true;
                    $scope.couldNotConnect = false;
                    $scope.notifyBox = false;


                }






    };

    $scope.selectForwardingEmail = function () {

        $scope.creationBox = true;
        $scope.emailDetails = false;
        $scope.forwardLoading = false;
        $scope.forwardError = true;
        $scope.forwardSuccess = true;
        $scope.couldNotConnect = true;
        $scope.notifyBox = true;
        $scope.fetchCurrentForwardings();
    };

    $scope.fetchCurrentForwardings = function(){

        $scope.creationBox = false;
        $scope.emailDetails = false;
        $scope.forwardLoading = false;
        $scope.forwardError = true;
        $scope.forwardSuccess = true;
        $scope.couldNotConnect = true;
        $scope.notifyBox = true;

        var url = "/email/fetchCurrentForwardings";


                var data = {
                    emailAddress:$scope.selectedEmail
                };

                var config = {
                    headers : {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                };

                $http.post(url, data,config).then(ListInitialDatas, cantLoadInitialDatas);


                function ListInitialDatas(response) {


                    if(response.data.fetchStatus === 1){

                        $scope.records = JSON.parse(response.data.data);

                        $scope.creationBox = false;
                        $scope.emailDetails = false;
                        $scope.forwardLoading = true;
                        $scope.forwardError = true;
                        $scope.forwardSuccess = true;
                        $scope.couldNotConnect = true;
                        $scope.notifyBox = true;

                    }

                    else
                    {
                        $scope.creationBox = true;
                        $scope.emailDetails = true;
                        $scope.forwardLoading = true;
                        $scope.forwardError = false;
                        $scope.forwardSuccess = true;
                        $scope.couldNotConnect = true;
                        $scope.notifyBox = false;

                        $scope.errorMessage = response.data.error_message;

                    }



                }
                function cantLoadInitialDatas(response) {

                    $scope.creationBox = true;
                    $scope.emailDetails = true;
                    $scope.forwardLoading = true;
                    $scope.forwardError = true;
                    $scope.forwardSuccess = true;
                    $scope.couldNotConnect = false;
                    $scope.notifyBox = false;


                }






    };

    $scope.deleteForwarding = function(source, destination){

        $scope.creationBox = true;
        $scope.emailDetails = true;
        $scope.forwardLoading = false;
        $scope.forwardError = true;
        $scope.forwardSuccess = true;
        $scope.couldNotConnect = true;
        $scope.notifyBox = true;

        var url = "/email/submitForwardDeletion";


                var data = {
                    destination:destination,
                    source: source
                };

                var config = {
                    headers : {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                };

                $http.post(url, data,config).then(ListInitialDatas, cantLoadInitialDatas);


                function ListInitialDatas(response) {


                    if(response.data.deleteForwardingStatus === 1){

                        $scope.creationBox = false;
                        $scope.emailDetails = false;
                        $scope.forwardLoading = true;
                        $scope.forwardError = true;
                        $scope.forwardSuccess = true;
                        $scope.couldNotConnect = true;
                        $scope.notifyBox = true;

                        $scope.fetchCurrentForwardings();

                    }

                    else
                    {
                        $scope.creationBox = false;
                        $scope.emailDetails = false;
                        $scope.forwardLoading = true;
                        $scope.forwardError = false;
                        $scope.forwardSuccess = true;
                        $scope.couldNotConnect = true;
                        $scope.notifyBox = false;

                        $scope.errorMessage = response.data.error_message;

                    }



                }
                function cantLoadInitialDatas(response) {

                    $scope.creationBox = true;
                    $scope.emailDetails = true;
                    $scope.forwardLoading = true;
                    $scope.forwardError = true;
                    $scope.forwardSuccess = true;
                    $scope.couldNotConnect = false;
                    $scope.notifyBox = false;


                }






    };

    $scope.forwardEmail = function(){

        $scope.creationBox = false;
        $scope.emailDetails = false;
        $scope.forwardLoading = false;
        $scope.forwardError = true;
        $scope.forwardSuccess = true;
        $scope.couldNotConnect = true;
        $scope.notifyBox = true;

        var url = "/email/submitEmailForwardingCreation";


                var data = {
                    source: $scope.selectedEmail,
                    destination:$scope.destinationEmail
                };

                var config = {
                    headers : {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                };

                $http.post(url, data,config).then(ListInitialDatas, cantLoadInitialDatas);


                function ListInitialDatas(response) {


                    if(response.data.createStatus === 1){

                        $scope.creationBox = false;
                        $scope.emailDetails = false;
                        $scope.forwardLoading = true;
                        $scope.forwardError = true;
                        $scope.forwardSuccess = true;
                        $scope.couldNotConnect = true;
                        $scope.notifyBox = true;

                        $scope.fetchCurrentForwardings();

                    }

                    else
                    {
                        $scope.creationBox = false;
                        $scope.emailDetails = false;
                        $scope.forwardLoading = true;
                        $scope.forwardError = false;
                        $scope.forwardSuccess = true;
                        $scope.couldNotConnect = true;
                        $scope.notifyBox = false;

                        $scope.errorMessage = response.data.error_message;

                    }



                }
                function cantLoadInitialDatas(response) {

                    $scope.creationBox = true;
                    $scope.emailDetails = true;
                    $scope.forwardLoading = true;
                    $scope.forwardError = true;
                    $scope.forwardSuccess = true;
                    $scope.couldNotConnect = false;
                    $scope.notifyBox = false;


                }






    };


});
/* Java script for email forwarding */