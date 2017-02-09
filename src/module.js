;(function(module) {
  "use strict";
  // source: https://gist.github.com/kuitos/89e8aa538f0a507bd682
  module.controller('RangeSliderController', ['$scope', function($scope){
    if(!$scope.step){
      $scope.step = 1;
    }


    $scope.$watchGroup(['min','max'],minMaxWatcher);
    $scope.$watch('lowerValue',lowerValueWatcher);
    $scope.$watch('value',lowerValueWatcher);


    function minMaxWatcher() {
      // $scope.lowerMax = $scope.max - $scope.step;
      // $scope.upperMin = $scope.lowerValue + $scope.step;

      if(!$scope.lowerValue || $scope.lowerValue < $scope.min || $scope.lowerValue > $scope.max){
        $scope.lowerValue = $scope.default;
        $scope.changed = false;
      }else{
        $scope.lowerValue*=1;
      }
      // if(!$scope.upperValue || $scope.upperValue > $scope.max){
      //   $scope.upperValue = $scope.max;
      // }else{
      //   $scope.upperValue*=1;
      // }
      updateWidth();
    }

    function lowerValueWatcher() {
      updateWidth();
    }

    function updateWidth() {
      // $scope.upperWidth = ((($scope.max-($scope.lowerValue + $scope.step))/($scope.max-$scope.min)) * 100) + "%";
      // if($scope.lowerValue > ($scope.upperValue - $scope.minGap) && $scope.upperValue < $scope.max) {
      //   $scope.upperValue = $scope.lowerValue + $scope.minGap;
      // }
      if(!$scope.changed && $scope.lowerValue != $scope.default){
        $scope.changed = true;
      }
      $scope.value = $scope.lowerValue;

    }
  }]);

  module.directive('rangeSlider', function ($log) {
    return {
      restrict: 'AE',
      require: ['ngModel'],
      // transclude: true,
      permissions: "@",
      scope      : {
        max:'=?',
        min:'=?',
        // minGap: '=',
        // step:'=',
        lowerValue: "=?",
        upperValue: "=upperValue",
        default: '=?',
        changed: '=?',
        value: '=?',
        ngModel: '=',

        leftLabel: '@',
        centerLabel: '@',
        rightLabel: '@',
      },

      link: function(scope, element, attrs, ngModel) {
        scope.$watch('value',
          function(newValue, oldValue){
            $log.info('in *childDirective* model value changed...', newValue, oldValue);

            ngModel[0].$setViewValue(newValue);
          });
        scope.$watch(
          function(){
            return ngModel.$modelValue;
          }, function(newValue, oldValue){
            ngModel[0].$modelValue = ngModel.$modelValue;

            $log.info('in *childDirective* model value in ?? changed...', newValue, oldValue);
          }, true);
      },
        template: [
          '<div class="range-slider-left">',
            // '<p>Left</p>',
          '<div class="labels" layout="row" layout-align="space-between center">',
          '<div class="left">{{leftLabel}}</div>',
          '<div class="center">{{centerLabel}}</div>',
          '<div class="right">{{rightLabel}}</div>',
          '</div>',
            '<md-slider changed="{{changed}}" aria-label="lowerValue" step="{{step}}" ng-model="lowerValue" min="{{min}}" max="{{max}}" ></md-slider>',
          '</div>',
          // '<div class="range-slider-right" ng-style="{width: upperWidth}">',
          //   '<md-slider aria-label="upperValue" step="{{step}}" ng-model="upperValue" min="{{upperMin}}" max="{{max}}"></md-slider>',
          // '</div>',
      ].join(''),

      controller: 'RangeSliderController',
      controllerAs: 'ctrl'
    };

  });

}(angular.module("mdRangeSlider",['ngMaterial'])));
