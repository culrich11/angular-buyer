angular.module('orderCloud')
    .component('ocProductCard', {
        templateUrl: 'common/directives/oc-product-card/oc-product-card.html',
        controller: ocProductCard,
        controllerAs: 'productCard',
        bindings: {
            product: '<',
            currentOrder: '=',
            currentUser: '<'
        }
    });

function ocProductCard($rootScope, $scope, $exceptionHandler, toastr, OrderCloud, buyerid){
    var vm = this;

    $scope.$watch(function(){
        return vm.product.Quantity;
    }, function(newVal){
        vm.findPrice(newVal);
    });

    vm.addToCart = function(OCProductForm) {
        var li = {
            ProductID: vm.product.ID,
            Quantity: vm.product.Quantity
        };

        return OrderCloud.LineItems.Create(vm.currentOrder.ID, li)
            .then(function(lineItem) {
                $rootScope.$broadcast('OC:UpdateOrder', vm.currentOrder.ID, 'Updating Order');
                vm.product.Quantity = 1;
                toastr.success('Product added to cart', 'Success');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            })

    };

    vm.findPrice = function(qty){
        if(qty){
            var finalPriceBreak;
            angular.forEach(vm.product.StandardPriceSchedule.PriceBreaks, function(priceBreak) {
                if (priceBreak.Quantity <= qty)
                    finalPriceBreak = angular.copy(priceBreak);
            });
            vm.calculatedPrice = finalPriceBreak.Price * qty;
        }
    };
}