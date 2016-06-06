define(['viewmodels/shell'], function (shell) {

    //properties
    this.workedSections = ko.observableArray();
    this.callsign = ko.observable('');
    this.didNotWork = ko.observable(false);

    this.linkList = ko.observableArray();
    this.modeData = ko.observableArray();
    this.bandData = ko.observableArray();
    this.refData = ko.observableArray();

    this.totalQSO = ko.observable(0);
    this.uniqueCall = ko.observable(0);
    this.totalRefs = ko.observable(0);

    var that = this;

    this.loadData = function () {

        $.ajax({
            type: "POST",
            url: "./Server/GetAllLog.php",
        }).done(function (data) {
            linkList(data);
            drawChart();


        }).error(function (xhr, ajaxOptions, thrownError) {
            //alert(jQuery.parseJSON(xhr.responseText).error);
            linkList([]);
        });


    }
    this.drawChart = function () {
        modeData([]);
        bandData([]);
        refData([]);

        var whereClause = function (x) { return true };

        totalQSO(Enumerable.From(linkList()).Where(whereClause).Count());
        uniqueCall(Enumerable.From(linkList()).Where(whereClause).Select("$.call").Distinct().Count());
        totalRefs(Enumerable.From(linkList()).Where(function (x) { return x.section != null }).Select("$.section").Distinct().Count());


        //*************************** mode ***************************/
        Enumerable.From(linkList()).Where(whereClause).Select("$.mode").Distinct().OrderByDescending().ForEach(function (s, index) {
            modeData.push({ "c": [{ "v": s, "f": null }, { "v": Enumerable.From(linkList()).Where(function (x) { return x.mode == s }).Where(whereClause).ToArray().length, "f": null }] });
        })
        var modeDataTable = {
            "cols": [
                  { "id": "", "label": "Mode", "pattern": "", "type": "string" },
                  { "id": "", "label": "QSOs", "pattern": "", "type": "number" }
            ],
            "rows": modeData()
        }
        var modeOptions = {
            width: '100%',
            height: 300,
            colors: ['#ff2222', '#22ff22', '#2222ff', '#ffff22', '#22ffff', '#ff22ff']
        };
        //*************************** band ***************************/
        Enumerable.From(linkList()).Where(whereClause).Select("$.band").Distinct().OrderBy().ForEach(function (s, index) {
            bandData.push({ "c": [{ "v": s, "f": null }, { "v": Enumerable.From(linkList()).Where(function (x) { return x.band == s }).Where(whereClause).ToArray().length, "f": null }] });
        })
        var bandDataTable = {
            "cols": [
                  { "id": "", "label": "Band", "pattern": "", "type": "string" },
                  { "id": "", "label": "QSOs", "pattern": "", "type": "number" }
            ],
            "rows": bandData()
        }
        var bandOptions = {
            width: '100%',
            height: 300,
            colors: ['#cc66cc', '#66cccc', '#cccc66', '#1111cc', '#66cc66', '#cc6666', '#fc6c6c']
        };
        //*************************** ref ***************************/

        refData.push(['Referene', 'QSOs']);
        Enumerable.From(linkList()).Where(whereClause).Select("$.section").OrderBy().Distinct().ForEach(function (s, index) {
            var count = Enumerable.From(linkList()).Where(function (x) { return x.section == s }).Where(whereClause).ToArray().length;
            if (s == null) s = "Non 4X4TRAIL"
            refData.push([s, count]);
        })

        var refDataTable = google.visualization.arrayToDataTable(refData());
        var refView = new google.visualization.DataView(refDataTable);
        refView.setColumns([0, 1,
                         {
                             calc: "stringify",
                             sourceColumn: 1,
                             type: "string",
                             role: "annotation"
                         }]);

        var refOptions = {
            title: "QSOs per Reference",
            //width: "100%",
            height: 500,
            bar: { groupWidth: "95%" },
            legend: { position: "none" },
        };
        var refChart = new google.visualization.ColumnChart(document.getElementById("ref_chart"));
        refChart.draw(refView, refOptions);



        // Instantiate and draw our chart, passing in some options.
        var modeChart = new google.visualization.PieChart(document.getElementById('mode_chart'));
        modeChart.draw(new google.visualization.DataTable(modeDataTable), modeOptions);

        // Instantiate and draw our chart, passing in some options.
        var bandChart = new google.visualization.PieChart(document.getElementById('band_chart'));
        bandChart.draw(new google.visualization.DataTable(bandDataTable), bandOptions);

        //var refChart = new google.charts.Bar(document.getElementById('ref_chart'));
        //refChart.draw(refView, refOptions);
        return true;
    }
    this.GetWokedSections = function () {
        if (callsign() == "") {
            workedSections([]);
            didNotWork(true);
            return;
        }
        $.ajax({
            type: "POST",
            url: "./Server/GetWokedSections.php",
            data: { 'info': { 'call': callsign() } }
        }).done(function (data) {
            workedSections(data);
            didNotWork(false);
        }).error(function (xhr, ajaxOptions, thrownError) {
            //alert(jQuery.parseJSON(xhr.responseText).error);
            workedSections([]);
            didNotWork(true);
        });
    }
    this.IsSectionExist = function(section)
    {
        var queryResult = Enumerable.From(workedSections).Where(function (x) { return x.section == section }).ToArray();
        return queryResult.length;
    }
    
    var vm = {
        activate: function () {
            //shell.selectedSubMenu('ham');
            shell.selectedMainMenu('sections');

            // Load charts package
            google.charts.load('current', { 'packages': ['corechart', 'bar'] });
            // Set a callback to run when the Google Visualization API is loaded.
            google.charts.setOnLoadCallback(loadData);
        },
        compositionComplete: function () {
            
        },
        workedSections: workedSections,
        callsign: callsign,
        didNotWork:didNotWork,
        shell: shell
    };

    //Note: This module exports a function. That means that you, the developer, can create multiple instances.
    //This pattern is also recognized by Durandal so that it can create instances on demand.
    //If you wish to create a singleton, you should export an object instead of a function.
    //See the "flickr" module for an example of object export.

    return vm;
});