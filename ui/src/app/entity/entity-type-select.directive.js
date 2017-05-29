/*
 * Copyright © 2016-2017 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import './entity-type-select.scss';

/* eslint-disable import/no-unresolved, import/default */

import entityTypeSelectTemplate from './entity-type-select.tpl.html';

/* eslint-enable import/no-unresolved, import/default */

/*@ngInject*/
export default function EntityTypeSelect($compile, $templateCache, utils, userService, types) {

    var linker = function (scope, element, attrs, ngModelCtrl) {
        var template = $templateCache.get(entityTypeSelectTemplate);
        element.html(template);

        if (angular.isDefined(attrs.hideLabel)) {
            scope.showLabel = false;
        } else {
            scope.showLabel = true;
        }

        scope.ngModelCtrl = ngModelCtrl;

        var authority = userService.getAuthority();
        scope.entityTypes = {};
        switch(authority) {
            case 'SYS_ADMIN':
                scope.entityTypes.tenant = types.entityType.tenant;
                scope.entityTypes.rule = types.entityType.rule;
                scope.entityTypes.plugin = types.entityType.plugin;
                break;
            case 'TENANT_ADMIN':
                scope.entityTypes.device = types.entityType.device;
                scope.entityTypes.asset = types.entityType.asset;
                scope.entityTypes.customer = types.entityType.customer;
                scope.entityTypes.rule = types.entityType.rule;
                scope.entityTypes.plugin = types.entityType.plugin;
                scope.entityTypes.dashboard = types.entityType.dashboard;
                break;
            case 'CUSTOMER_USER':
                scope.entityTypes.device = types.entityType.device;
                scope.entityTypes.asset = types.entityType.asset;
                scope.entityTypes.dashboard = types.entityType.dashboard;
                break;
        }

        if (scope.allowedEntityTypes) {
            for (var entityType in scope.entityTypes) {
                if (scope.allowedEntityTypes.indexOf(scope.entityTypes[entityType]) === -1) {
                    delete scope.entityTypes[entityType];
                }
            }
        }

        scope.typeName = function(type) {
            return utils.entityTypeName(type);
        }

        scope.updateValidity = function () {
            var value = ngModelCtrl.$viewValue;
            var valid = angular.isDefined(value) && value != null;
            ngModelCtrl.$setValidity('entityType', valid);
        };

        scope.$watch('entityType', function (newValue, prevValue) {
            if (!angular.equals(newValue, prevValue)) {
                scope.updateView();
            }
        });

        scope.updateView = function () {
            ngModelCtrl.$setViewValue(scope.entityType);
            scope.updateValidity();
        };

        ngModelCtrl.$render = function () {
            if (ngModelCtrl.$viewValue) {
                scope.entityType = ngModelCtrl.$viewValue;
            }
        };

        $compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        require: "^ngModel",
        link: linker,
        scope: {
            allowedEntityTypes: "=?"
        }
    };
}