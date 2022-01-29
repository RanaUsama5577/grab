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
                var count = 0;
                var count2 = 0;
                snapshot.forEach(function (doc) {
                    count++;
                    var data1 = doc.val();
                    var fullname = data1.firstName + " " + data1.lastName;
                    var email = data1.email;
                    var bType = data1.bType;
                    var dbRef = ref(realdb);
                    get(child(dbRef, `AppointmentData/${doc.key}`)).then((snapshot2) => {
                        count2++;
                        if (snapshot2.exists()) {
                            var s = snapshot2.val();
                            for(var i in s){
                                var doc = s[i];
                                var data = doc;
                                var row = '<tr><td>'+email+'</td><td>'+fullname+'</td><td>' + data.appointment + '</td><td class="">' + bType + '</td><td>' + data.area + '</td><td>' + data.date + '</td><td>' + data.time + '</td></tr>';
                                $('#dataTable').append(row);
                            }
                        }
                        else {
                            //MixinSweet('No data!', 'There is no data to show', "info", 2000);
                        }
                        if(count == count2){
                            $('#table-1').DataTable();
                        }
                    },
                        function (errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });
                    
                })
                
            }
            else {
                MixinSweet('No data!', 'There is no data to show', "info", 2000);
            }
            
        });
    }
    catch (ex) {
        console.log(ex);
    }
}