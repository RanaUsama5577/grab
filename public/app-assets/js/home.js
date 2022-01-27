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
    getDetails();
})
async function getDetails() {
    var users = ref(realdb, 'UserData/');
    var apps = ref(realdb, 'AppointmentData/');
    try {
        onValue(users, (snapshot) => {
            var count2  = 0;
            snapshot.forEach(function (doc) {
                count2 ++;
            })
            $('#UsersCount').html(count2);
        });
        onValue(apps, (snapshot) => {
            var count  = 0;
            var s = snapshot.val();
            var result = Object.keys(s).map((key) => [key, s[key]]);
            result.forEach(function(item){
                var q = item[1];
                var result2 = Object.keys(q).map((key) => [key, q[key]]);
                count += result2.length;
            })
            console.log("count ", count);
            $('#AppsCount').html(count);
        });
    }
    catch (ex) {
        console.log(ex);
    }
}

