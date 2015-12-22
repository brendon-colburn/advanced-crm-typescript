/// <reference path="_all.ts" />
var ngEntityName;
(function (ngEntityName) {
    //jdFactory -- change the context to your generated context, see jdentityname.d.ts
    function jdFactory() {
        return new Microsoft.Crm.Sdk.Data.Services.CMSDevContext({
            name: 'oData',
            oDataServiceHost: parent.Xrm.Page.context.getClientUrl() + '/XRMServices/2011/OrganizationData.svc',
            maxDataServiceVersion: '2.0'
        });
    }
    ngEntityName.jdFactory = jdFactory;
    //Methods
    function initController(c, $scope) {
    }
    ngEntityName.initController = initController;
    //Controllers
    var myCtrl = (function () {
        function myCtrl($scope, factory) {
            this.$scope = $scope;
            this.factory = factory;
            $scope.vm = this;
            factory.onReady(function (c) {
                initController(c, $scope);
            });
        }
        myCtrl.prototype.addAndInit = function () {
            var _this = this;
            this.factory.add(new Microsoft.Crm.Sdk.Data.Services.myentity({
                lookup: new Microsoft.Crm.Sdk.Data.Services.EntityReference({
                    Id: parent.Xrm.Page.data.entity.getId().replace(/[{}]/g, "").toLowerCase(),
                    Name: parent.Xrm.Page.getAttribute("cims_name").getValue(),
                    LogicalName: "cims_taskorder"
                }),
            }));
            this.factory.saveChanges({
                success: function () {
                    initController(_this.factory, _this.$scope);
                }
            });
        };
        myCtrl.prototype.delete = function (e, $index, vm) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: parent.Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/myEntityNameSet(guid'" + e.Id + "')",
                beforeSend: function (XMLHttpRequest) {
                    //Specifying this header ensures that the results will be returned as JSON.                 
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    //Specify the HTTP method DELETE to perform a delete operation.                 
                    XMLHttpRequest.setRequestHeader("X-HTTP-Method", "DELETE");
                },
                success: function (data, textStatus, xhr) {
                    vm.$scope.myresults.splice($index, 1);
                    vm.$scope.$apply();
                }
            });
        };
        myCtrl.prototype.update = function (updateEntity) {
            var trackedEntity = new Microsoft.Crm.Sdk.Data.Services.myentity({ myid: $data.parseGuid(updateEntity.myid) });
            this.factory.myentityset.attach(trackedEntity);
            trackedEntity.changedvalue = updateEntity.changedvalue;
            this.factory.saveChanges();
        };
        myCtrl.$inject = [
            '$scope',
            'factory'
        ];
        return myCtrl;
    })();
    ngEntityName.myCtrl = myCtrl;
    angular.module('ngEntityName', ['ui.bootstrap'])
        .factory("JayDataFactory", jdFactory)
        .controller("myCtrl", ['$scope', 'JayDataFactory', myCtrl]);
    ;
})(ngEntityName || (ngEntityName = {}));
//# sourceMappingURL=ngentityname.js.map