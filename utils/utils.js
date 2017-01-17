var getClosestMonday = function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};

var getRepoCompositeId = function getRepoCompositeId(trendingRepo) {
    var monday = getClosestMonday(trendingRepo.scrapeTime);
    var date = monday.getDate() + '/' + monday.getMonth();
    var result = trendingRepo.owner + trendingRepo.name + trendingRepo.type + date;
    return result;
}


module.exports.getClosestMonday = getClosestMonday;
module.exports.getRepoCompositeId = getRepoCompositeId;