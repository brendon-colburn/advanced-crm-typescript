/// <reference path="_all.ts" />
module ngEntityName {
    //Interfaces
    export interface IMyScope extends ng.IScope {
        vm: myCtrl,
        myresults: IEntityResult[]
    }
    
    export interface IEntityResult extends Microsoft.Crm.Sdk.Data.Services.myentity {
        __metadata: String,
        childEntityCollection1: Microsoft.Crm.Sdk.Data.Services.childEntity[],
        selected: any,
        active: any,
        newItemShow: boolean,
        newItem: string,
        existingItemFlag: boolean,
        noTextFlag: boolean
    }

    // Gives typescript recognition of parent window objects
    export interface IWindow extends Window {
        Xrm: typeof Xrm;
        $: JQueryStatic;
    }
    
    //jdFactory -- change the context to your generated context, see jdentityname.d.ts
    export function jdFactory() {
        return new Microsoft.Crm.Sdk.Data.Services.CMSDevContext({
            name: 'oData',
            oDataServiceHost: (<IWindow>parent).Xrm.Page.context.getClientUrl() + '/XRMServices/2011/OrganizationData.svc',
            maxDataServiceVersion: '2.0'
        });
    }

    //Methods
    export function initController(c: Microsoft.Crm.Sdk.Data.Services.CMSDevContext, $scope: IMyScope) {
        
    }

    //Controllers
    export class myCtrl {
        public static $inject = [
            '$scope',
            'factory'
        ];

        constructor(
            private $scope: IMyScope,
            private factory: Microsoft.Crm.Sdk.Data.Services.CMSDevContext
        ) {
            $scope.vm = this;

            factory.onReady(c => {
                initController(c, $scope);
            });
        }

        addAndInit() {
            this.factory.add(new Microsoft.Crm.Sdk.Data.Services.myentity({
                lookup: new Microsoft.Crm.Sdk.Data.Services.EntityReference({
                    Id: (<IWindow>parent).Xrm.Page.data.entity.getId().replace(/[{}]/g, "").toLowerCase(),
                    Name: (<IWindow>parent).Xrm.Page.getAttribute<Xrm.Page.StringAttribute>("cims_name").getValue(),
                    LogicalName: "cims_taskorder"
                }),
            }));
            this.factory.saveChanges({
                success: () => {
                    initController(this.factory, this.$scope);
                }
            });
        }

        delete(e: IEntityResult, $index: number, vm: myCtrl) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: (<IWindow>parent).Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/myEntityNameSet(guid'" + e.Id + "')",
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
        }

        update(updateEntity: Microsoft.Crm.Sdk.Data.Services.myentity) {
            var trackedEntity = new Microsoft.Crm.Sdk.Data.Services.myentity({ myid: (<any>$data).parseGuid(updateEntity.myid) });
            this.factory.myentityset.attach(trackedEntity);
            trackedEntity.changedvalue = updateEntity.changedvalue;
            this.factory.saveChanges();
        }
    }

    angular.module('ngEntityName', ['ui.bootstrap'])
        .factory("JayDataFactory", jdFactory)
        .controller("myCtrl", ['$scope', 'JayDataFactory', myCtrl]);;
}