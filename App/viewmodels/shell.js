define(['plugins/router', 'durandal/app'], function (router, app) {

    
    var selectedSubMenu = ko.observable('');
    var selectedMainMenu = ko.observable('main');
    var version = app.version;
    var lang = ko.observable('en');

    this.toggleLanguage = function()
    {
        if (lang() == 'en') {
            lang('he');
        }
        else if (lang() == 'he') {
            lang('en');
        }
    }
    
    return {
        selectedSubMenu: selectedSubMenu,
        selectedMainMenu: selectedMainMenu,
        version: version,
        router: router,
        lang:lang,
        activate: function () {
            router.map([
                { route: 'Statistics', title: 'Statistics', moduleId: 'viewmodels/kdstatistics', nav: true },
                { route: 'Audit', title: 'Audit', moduleId: 'viewmodels/audit', nav: true },
                { route: '', title: 'Sections', moduleId: 'viewmodels/sections', nav: true }
            ]).buildNavigationModel();

            return router.activate();
        },
        compositionComplete: function () {
            
        }
    };
});