define(['plugins/router', 'durandal/app'], function (router, app) {

    
    var selectedSubMenu = ko.observable('');
    var selectedMainMenu = ko.observable('main');
    var version = app.version;
    
    return {
        selectedSubMenu: selectedSubMenu,
        selectedMainMenu: selectedMainMenu,
        version: version,
        router: router,
        activate: function () {
            router.map([
                { route: 'Dashboard', title: 'Dashboard', moduleId: 'viewmodels/dashboard', nav: true },
                { route: '', title: 'Sections', moduleId: 'viewmodels/sections', nav: true }
            ]).buildNavigationModel();

            return router.activate();
        },
        compositionComplete: function () {
            
        }
    };
});