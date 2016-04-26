define(function () {

    var shell = require('viewmodels/shell');

    //properties
    this.linkList = ko.observableArray();
    this.callsign = ko.observable('');

    this.GetWokedSections = function () {
        $.ajax({
            type: "POST",
            url: "./Server/GetWokedSections.php",
            data: { 'info': { 'call': callsign() } }
        }).done(function (data) {
            linkList(data);
            
        }).error(function (xhr, ajaxOptions, thrownError) {
            //alert(jQuery.parseJSON(xhr.responseText).error);
            linkList([]);
        });
    }

    this.IsSectionExist = function(section)
    {
        var queryResult = Enumerable.From(linkList).Where(function (x) { return x.section == section }).ToArray();
        return queryResult.length;
    }
    
    var vm = {
        activate: function () {
            //shell.selectedSubMenu('ham');
            shell.selectedMainMenu('sections');
        },
        compositionComplete: function () {
            
        },
        linkList: linkList,
        callsign: callsign
    };

    //Note: This module exports a function. That means that you, the developer, can create multiple instances.
    //This pattern is also recognized by Durandal so that it can create instances on demand.
    //If you wish to create a singleton, you should export an object instead of a function.
    //See the "flickr" module for an example of object export.

    return vm;
});