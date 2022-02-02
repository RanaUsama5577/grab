var exportData;
var db;
var collection;
var doc;
var getDoc;
var getDocs;
var auth;
var query;
var where;
var orderBy;
var updateDoc;
var deleteDoc;
var setDoc;
var onSnapshot;
var realdb;
var ref;
var get;
var child;
var onValue;
var runTransaction;
var equalTo;
var orderByChild;
var queryReal;
var p = "#836AF9",
b = "#28dac6",
C = "#ffe802",
u = "#2c9aff",
h = "#84D0FF",
y = "#EDF1F4",
g = "rgba(0, 0, 0, 0.25)",
w = "#666ee8",
f = "#ff4961",
x = "#6e6b7b",
k = "rgba(200, 200, 200, 0.2)";
$(async function () {
    await import('/app-assets/js/firebase.js').then(function (exports) {
        exportData = exports;
    });
    db = exportData.db;
    doc = exportData.doc;
    collection = exportData.collection;
    getDoc = exportData.getDoc;
    getDocs = exportData.getDocs;
    query = exportData.query;
    where = exportData.where;
    orderBy = exportData.orderBy;
    auth = exportData.auth;
    updateDoc = exportData.updateDoc;
    setDoc = exportData.setDoc;
    deleteDoc = exportData.deleteDoc;
    onSnapshot = exportData.onSnapshot;
    //realtime
    realdb = exportData.realdb;
    ref = exportData.ref;
    get = exportData.get;
    child = exportData.child;
    onValue = exportData.onValue;
    runTransaction = exportData.runTransaction;
    
    equalTo = exportData.equalTo;
    orderByChild = exportData.orderByChild;
    queryReal = exportData.queryReal;
    getDetails();
    AppendChart();
})
async function getDetails() {
    var users = ref(realdb, 'Users/');
    var towns = ref(realdb, 'Towns/');
    var parentcategories = ref(realdb, 'ParentCategories/');
    var products = ref(realdb, 'Products/');
    try {
        onValue(users, (snapshot) => {
            var count2  = 0;
            snapshot.forEach(function (doc) {
                count2 ++;
            })
            $('#UsersCount').html(count2);
        });
        onValue(towns, (snapshot) => {
            var count2  = 0;
            snapshot.forEach(function (doc) {
                count2 ++;
            })
            $('#TownsCount').html(count2);
        });
        onValue(parentcategories, (snapshot) => {
            var count2  = 0;
            snapshot.forEach(function (doc) {
                count2 ++;
            })
            $('#CategoriesCount').html(count2);
        });
        onValue(products, (snapshot) => {
            var count2  = 0;
            snapshot.forEach(function (doc) {
                count2 ++;
            })
            $('#ProductsCount').html(count2);
        });
    }
    catch (ex) {
        console.log(ex);
    }
}


function AppendChart(){

    var lastMonth = new Date(); var onePastlastMonth = new Date(); var twoPastlastMonth = new Date(); var threePastlastMonth = new Date();
    var fourPastlastMonth = new Date(); var fivePastlastMonth = new Date(); var sixPastlastMonth = new Date(); var sevenPastlastMonth = new Date();
    var eightPastlastMonth = new Date(); var ninePastlastMonth = new Date(); var tenPastlastMonth = new Date(); var elevenPastlastMonth = new Date();
    onePastlastMonth.setMonth(new Date().getMonth() - 1); twoPastlastMonth.setMonth(new Date().getMonth() - 2);
    threePastlastMonth.setMonth(new Date().getMonth() - 3); fourPastlastMonth.setMonth(new Date().getMonth() - 4); fivePastlastMonth.setMonth(new Date().getMonth() - 5);
    sixPastlastMonth.setMonth(new Date().getMonth() - 6); sevenPastlastMonth.setMonth(new Date().getMonth() - 7); eightPastlastMonth.setMonth(new Date().getMonth() - 8);
    ninePastlastMonth.setMonth(new Date().getMonth() - 9); tenPastlastMonth.setMonth(new Date().getMonth() - 10); elevenPastlastMonth.setMonth(new Date().getMonth() - 11);
    lastMonth.setDate(1); onePastlastMonth.setDate(1); twoPastlastMonth.setDate(1); elevenPastlastMonth.setDate(1); threePastlastMonth.setDate(1); fourPastlastMonth.setDate(1);
    fivePastlastMonth.setDate(1); sixPastlastMonth.setDate(1); sevenPastlastMonth.setDate(1); eightPastlastMonth.setDate(1); ninePastlastMonth.setDate(1); tenPastlastMonth.setDate(1);

    var jant = 0; var febt = 0; var mart = 0; var aprt = 0; var mayt = 0; var junet = 0; var julyt = 0; var augt = 0; var septt = 0;
    var octt = 0; var novt = 0; var dect = 0;

    var janc = 0; var febc = 0; var marc = 0; var aprc = 0; var mayc = 0; var junec = 0; var julyc = 0; var augc = 0; var septc = 0;
    var octc = 0; var novc = 0; var decc = 0;

    var jand = 0; var febd = 0; var mard = 0; var aprd = 0; var mayd = 0; var juned = 0; var julyd = 0; var augd = 0; var septd = 0;
    var octd = 0; var novd = 0; var decd = 0;

    var janv = 0; var febv = 0; var marv = 0; var aprv = 0; var mayv = 0; var junev = 0; var julyv = 0; var augv = 0; var septv = 0;
    var octv = 0; var novv = 0; var decv = 0;

    const entities = queryReal(ref(realdb, '/Orders'), orderByChild('orderstatus'), equalTo("Delivered"));
    onValue(entities, (snapshot) => {
        if (snapshot) {
            snapshot.forEach(function (doc) {
                var data = doc.val();
                var ordertime = data.ordertime;
                var timestamp = new Date(ordertime);
                    switch (timestamp.getMonth()) {
                        case lastMonth.getMonth():
                            jant = jant + parseFloat(data.overTotal);
                            janv++;
                            break;
                        case onePastlastMonth.getMonth():
                            febt = febt + parseFloat(data.overTotal);
                            febv++;
                            break;
                        case twoPastlastMonth.getMonth():
                            mart = mart + parseFloat(data.overTotal);
                            marv++;
                            break;
                        case threePastlastMonth.getMonth():
                            aprt = aprt + parseFloat(data.overTotal);
                            aprv++;
                            break;
                        case fourPastlastMonth.getMonth():
                            mayt = mayt + parseFloat(data.overTotal);
                            mayv++;
                            break;
                        case fivePastlastMonth.getMonth():
                            junet = junet + parseFloat(data.overTotal);
                            junev++;
                            break;
                        case sixPastlastMonth.getMonth():
                            julyt = julyt + parseFloat(data.overTotal);
                            julyv++;
                            break;
                        case sevenPastlastMonth.getMonth():
                            augt = augt + parseFloat(data.overTotal);
                            augv++;
                            break;
                        case eightPastlastMonth.getMonth():
                            septt = septt + parseFloat(data.overTotal);
                            septv++;
                            break;
                        case ninePastlastMonth.getMonth():
                            octt = octt + parseFloat(data.overTotal);
                            octv++;
                            break;
                        case tenPastlastMonth.getMonth():
                            novt = novt + parseFloat(data.overTotal);
                            novv++;
                            break;
                        case elevenPastlastMonth.getMonth():
                            dect = dect + parseFloat(data.overTotal);
                            decv++;
                            break;
                    }
            })
            RevenueChart(jant, febt, mart, aprt, mayt, junet, julyt, augt, septt, octt, novt, dect);
        }
    })
        


    
}
function RevenueChart(jant, febt, mart, aprt, mayt, junet, julyt, augt, septt, octt, novt, dect) {
    var lastMonth = new Date(); var onePastlastMonth = new Date(); var twoPastlastMonth = new Date(); var threePastlastMonth = new Date();
    var fourPastlastMonth = new Date(); var fivePastlastMonth = new Date(); var sixPastlastMonth = new Date(); var sevenPastlastMonth = new Date();
    var eightPastlastMonth = new Date(); var ninePastlastMonth = new Date(); var tenPastlastMonth = new Date(); var elevenPastlastMonth = new Date();
    onePastlastMonth.setMonth(new Date().getMonth() - 1); twoPastlastMonth.setMonth(new Date().getMonth() - 2);
    threePastlastMonth.setMonth(new Date().getMonth() - 3); fourPastlastMonth.setMonth(new Date().getMonth() - 4); fivePastlastMonth.setMonth(new Date().getMonth() - 5);
    sixPastlastMonth.setMonth(new Date().getMonth() - 6); sevenPastlastMonth.setMonth(new Date().getMonth() - 7); eightPastlastMonth.setMonth(new Date().getMonth() - 8);
    ninePastlastMonth.setMonth(new Date().getMonth() - 9); tenPastlastMonth.setMonth(new Date().getMonth() - 10); elevenPastlastMonth.setMonth(new Date().getMonth() - 11);
    lastMonth.setDate(1); onePastlastMonth.setDate(1); twoPastlastMonth.setDate(1); elevenPastlastMonth.setDate(1); threePastlastMonth.setDate(1); fourPastlastMonth.setDate(1);
    fivePastlastMonth.setDate(1); sixPastlastMonth.setDate(1); sevenPastlastMonth.setDate(1); eightPastlastMonth.setDate(1); ninePastlastMonth.setDate(1); tenPastlastMonth.setDate(1);
    
    if ($('.bar-chart-ex').length)
    new Chart($('.bar-chart-ex'), {
        type: "bar",
        options: {
            elements: { rectangle: { borderWidth: 2, borderSkipped: "bottom" } },
            responsive: !0,
            maintainAspectRatio: !1,
            responsiveAnimationDuration: 500,
            legend: { display: !1 },
            tooltips: { shadowOffsetX: 1, shadowOffsetY: 1, shadowBlur: 8, shadowColor: g, backgroundColor: window.colors.solid.white, titleFontColor: window.colors.solid.black, bodyFontColor: window.colors.solid.black },
            scales: {
                xAxes: [{ display: !0, gridLines: { display: !0, color: k, zeroLineColor: k }, scaleLabel: { display: !1 }, ticks: { fontColor: x } }],
                yAxes: [{ display: !0, gridLines: { color: k, zeroLineColor: k }, ticks: { stepSize: 100, min: 0, max: 400, fontColor: x } }],
            },
        },
        data: {
            labels: [getMonth(elevenPastlastMonth.getMonth()), getMonth(tenPastlastMonth.getMonth()), getMonth(ninePastlastMonth.getMonth()), getMonth(eightPastlastMonth.getMonth()), getMonth(sevenPastlastMonth.getMonth()), getMonth(sixPastlastMonth.getMonth()), getMonth(fivePastlastMonth.getMonth()), getMonth(fourPastlastMonth.getMonth()), getMonth(threePastlastMonth.getMonth()), getMonth(twoPastlastMonth.getMonth()), getMonth(onePastlastMonth.getMonth()), getMonth(lastMonth.getMonth())],
            datasets: [
                { 
                    data: [dect, novt, octt, septt, augt, julyt, junet, mayt, aprt, mart, febt, jant], 
                    barThickness: 15, 
                    backgroundColor: b, 
                    borderColor: "transparent" 
                }],
        },
    });
}

function getMonth(num) {
    if (num == 0) {
        return "Jan";
    }
    if (num == 1) {
        return "Feb";
    }
    if (num == 2) {
        return "Mar";
    }
    if (num == 3) {
        return "Apr";
    }
    if (num == 4) {
        return "May";
    }
    if (num == 5) {
        return "June";
    }
    if (num == 6) {
        return "July";
    }
    if (num == 7) {
        return "Aug";
    }
    if (num == 8) {
        return "Sept";
    }
    if (num == 9) {
        return "Oct";
    }
    if (num == 10) {
        return "Nov";
    }
    if (num == 11) {
        return "Dec";
    }
}