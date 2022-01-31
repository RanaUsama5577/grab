var exportData;
var storage;
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
    storage = exportData.storage;
    //realtime
    realdb = exportData.realdb;
    ref = exportData.ref;
    get = exportData.get;
    child = exportData.child;
    onValue = exportData.onValue;
    runTransaction = exportData.runTransaction;
    updateNode = exportData.updateNode;
    setNode = exportData.setNode;
    removeNode = exportData.removeNode;
    createTable();
})
function createTable() {
    const faqs = ref(realdb, 'price_setting');
    try {
        onValue(faqs, (snapshot) => {
            if(snapshot){
                var value = snapshot.val();
                $('#service_charges').html(value.delivery_charge);
                $('#delivery_charge').html(value.service_fee);
                $('#service_fee').val(value.service_fee);
                $('#delivery_fee').val(value.delivery_charge);
            }
        })
        
    }
    catch(ex){
        console.log(ex);
    }
}
function EditInfo() {
    $('#infoModal').modal("show");
}
function UpdateInfo() {
    $('#add_btn').addClass('btn-progress');
    var service_fees = $('#service_fee').val();
    var delivery_fee = $('#delivery_fee').val();
    const faqs = ref(realdb, 'price_setting/');
    // Set the "capital" field of the city 'DC'
    updateNode(faqs, {
        delivery_charge: delivery_fee,
        service_fee: service_fees,
    })
        .then(function () {
            $('#add_btn').removeClass('btn-progress');
            $('#update_terms').removeClass('btn-progress');
            $('#infoModal').modal("hide");
        })
        .catch(function (error) {
            console.log("Error", error);
        });
}