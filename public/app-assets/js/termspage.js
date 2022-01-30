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
    const terms_and_conditions = ref(realdb, 'content_setting/terms_and_conditions');
    try {
        onValue(terms_and_conditions, (snapshot) => {
            if(snapshot){
                var value = snapshot.val();
                $('#TermsBody').html(value);
                $('.editor').html(value);
            }
            var editor = new Quill('.editor', {
                modules: { toolbar: '.quill-toolbar' },
                theme: 'snow'
            });
        })
        
    }
    catch(ex){
        console.log(ex);
    }
}
function EditTerms() {
    $('#descriptionCard').hide();
    $('#editCard').show();
}
function hideEditSection() {
    $('#descriptionCard').show();
    $('#editCard').hide();
}
function UpdateTerms() {
    $('#update_terms').addClass('btn-progress');
    var content = $('.ql-editor').html();
    const terms_and_conditions = ref(realdb, 'content_setting/');
    // Set the "capital" field of the city 'DC'
    updateNode(terms_and_conditions, {
        terms_and_conditions: content,
    })
        .then(function () {
            $('#update_terms').removeClass('btn-progress');
            createTable();
            hideEditSection();
        })
        .catch(function (error) {
            console.log("Error", error);
        });
}