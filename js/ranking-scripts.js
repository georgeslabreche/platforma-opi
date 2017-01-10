var API_REQUEST_URL_GENERAL_RESULT = '../results.json';
// 'http://csis.appdec.com/api/report/general'

var lang = 'AL';
var satisfactionJson = null;
var institutions = [];
var services = [];

var currentRankingList = null;

function sortByHappy(a, b){
    return b.happy - a.happy;
}

function sortByMeh(a, b){
    return b.meh - a.meh;
}

function sortByUnhappy(a, b){
    return b.unhappy - a.unhappy;
}

function progressBar(percent, $element) {
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({ width: progressBarWidth }, 3000).html(percent + "%&nbsp;");
}

function displayInstitutionRanking(){
    $('#container-first-selection .navbar-brand').html('Institucione');
    currentRankingList = institutions;
    displayHappyRanking();
}

function displayServiceRanking(){
    $('#container-first-selection .navbar-brand').html('Shërbime');
    currentRankingList = services;
    displayHappyRanking();
}

function displayHappyRanking(){
    $('#container-second-selection .navbar-brand').html('Të kënaqur');
    currentRankingList.sort(sortByHappy);
    resetRanking('happy', currentRankingList);
}

function displayMehRanking(){
    $('#container-second-selection .navbar-brand').html('Të pakënaqur');
    currentRankingList.sort(sortByMeh);
    resetRanking('meh', currentRankingList);
}

function displayUnhappyRanking(){
    currentRankingList.sort(sortByUnhappy);
    $('#container-second-selection .navbar-brand').html('Mesatarisht të kënaqur');
    resetRanking('unhappy', currentRankingList);
}

function resetRanking(rowType, currentRankingList){
    // Clear ranking
    $('.container-ranking').empty();

    $.each(currentRankingList, function( key, val ) {

        var institutionName = val["name_" + lang];
        var answerCount = val[rowType + "Count"];

        $('.container-ranking').append(
            '<div class="row row-ranking row-' + rowType + '">' +
                '<div class="col-md-6 institution-name">' +
                    (key + 1) + '. ' + institutionName +
                    '<br>' +
                    '<span class="vote-count">' + answerCount + '</span> <span class="vote-count-label">përgjigje</span>' +
                '</div>' +
                '<div class="col-md-6">' +
                    '<div id="progress-bar-' + key + '" class="progress-bar progress-bar-skin"><div></div></div>' +
                '</div>' +
            '</div><hr>');

        progressBar(val[rowType], $('#progress-bar-' + key));
    });
}

$(function() {

    /** get the citizen satisfaction result json **/
    $.getJSON(API_REQUEST_URL_GENERAL_RESULT, function( data ) {

        // Store result in a global variable for future use.
        satisfactionJson = data;

        $.each( data, function(key, val) {
            institutions.push({
                name_AL: val['InstitutionName_AL'],
                name_EN: val['InstitutionName_EN'],
                name_SR: val['InstitutionName_SR'],
                happy: parseFloat(val['result_Good_Percentage'].replace('%', '')),
                meh: parseFloat(val['result_Middle_Percentage'].replace('%', '')),
                unhappy: parseFloat(val['result_Bad_Percentage'].replace('%', '')),
                happyCount: val['result_Good'],
                mehCount: val['result_Middle'],
                unhappyCount: val['result_Bad']
            });
        });

        // By default, display institution ranking
        displayInstitutionRanking();

        // Do similar thing with services...
        $.each( data, function( ministryIndex) {
            $(satisfactionJson[ministryIndex]['ServiceGroups']).each(function() {
                $(this['Services']).each(function(key, val) {
                    services.push({
                        name_AL: val['ServiceName_AL'],
                        name_EN: val['ServiceName_EN'],
                        name_SR: val['ServiceName_SR'],
                        happy: parseFloat(val['result_Good_Percentage'].replace('%', '')),
                        meh: parseFloat(val['result_Middle_Percentage'].replace('%', '')),
                        unhappy: parseFloat(val['result_Bad_Percentage'].replace('%', '')),
                        happyCount: val['result_Good'],
                        mehCount: val['result_Middle'],
                        unhappyCount: val['result_Bad']
                    });
                });
            });
        });
    });
});
