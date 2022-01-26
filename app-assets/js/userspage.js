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
    createTable();
})
async function createTable() {
    const users = ref(realdb, 'UserData/');
    try {
        onValue(users, (snapshot) => {
            $("#table-1").DataTable().destroy();
            $("#dataTable").html('');
            if (snapshot) {
                snapshot.forEach(function (doc) {
                    var data = doc.val();
                    var row = '<tr><td><h6 class="mb-0 font-13 pdt10"><a style="cursor:pointer;text-decoration:underline;font-weight:700; cursor:pointer;" onclick="showAppointmentDetails(\'' + doc.key + '\',\'' + data.email + '\')">' + data.email + '</a></h6></td><td class="">' + data.firstName + '</td><td class="">' + data.lastName + '</td><td class="">' + data.age + '</td><td class="">' + data.bType + '</td><td class="">' + data.birthDate + '</td></tr>';
                    $('#dataTable').append(row);
                })
            }
            else {
                MixinSweet('No data!', 'There is no data to show', "info", 2000);
            }
            $('#table-1').DataTable();
        });
    }
    catch (ex) {
        console.log(ex);
    }
}

async function showAppointmentDetails(key,email) {
    try {
        var dbRef = ref(realdb);
        get(child(dbRef, `AppointmentData/${key}`)).then((snapshot) => {
            $("#table-2").DataTable().destroy();
            $("#dataTable2").html('');
            if (snapshot.exists()) {
                $("#dataTable2").html('');
                var s = snapshot.val();
                for(var i in s){
                    var doc = s[i];
                    var data = doc;
                    var row = '<tr> <td>' + data.appointment + '</td><td>' + data.area + '</td><td>' + data.date + '</td><td>' + data.time + '</td></tr>';
                    $('#dataTable2').append(row);
                }
            }
            else {
                MixinSweet('No data!', 'There is no data to show', "info", 2000);
            }
            $("#table-2").dataTable();
            $("#AllUsers").hide();
            $("#AppDetails").show();
            $("#BackButton").show();
            $('.PageHeading').html(email + " Appointments");
        },
            function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
    }
    catch (ex) {
        console.log(ex);
    }
    
}
function BackFunction() {
    $("#AllUsers").show();
    $("#AppDetails").hide();
    $("#BackButton").hide();
    $('.PageHeading').html("Users");
}