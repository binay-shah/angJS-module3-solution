
(function(){
  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective);


  function FoundItemsDirective(){
    var ddo = {
      templateUrl: 'menuListItem.html',
      scope: {
        found: '<',
        onRemove: '&'
      }
    };
    return ddo;
  }

  MenuSearchService.$inject=['$http']
  function MenuSearchService($http){
    var service = this;

    this.getMatchedMenuItems = function(searchTerm){
      return $http({
        method: "GET",
        url: ('https://davids-restaurant.herokuapp.com/menu_items.json')
      });
    }
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var list = this;
    list.searchTerm="";
    list.NarrowItDown = function(){
      list.found = [];
      if(list.searchTerm.trim()==""){
        list.message="Nothing found";
        console.log(list.message);}
        else{
          list.message="";
          var promise = MenuSearchService.getMatchedMenuItems(list.searchTerm);
          promise.then(function(result){
            result = result.data.menu_items;
            //console.log(result)
            var pattern = new RegExp(list.searchTerm);


            var i;
            for(i in result){

              if(pattern.test(result[i].description))
              list.found.push(result[i]);
            }

            if(list.found.length == 0)
            list.message="Nothing found";
          });
        }
      }
      //console.log(list.found);
      list.removeItem = function(itemIndex){
        list.found.splice(itemIndex, 1);
      }
    }
  })();
