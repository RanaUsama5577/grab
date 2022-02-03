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

var equalTo;
var orderByChild;
var queryReal;
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
    equalTo = exportData.equalTo;
    orderByChild = exportData.orderByChild;
    queryReal = exportData.queryReal;
    createTable(1);
})
async function createTable(num) {
    $('#PageHeading').html("All Completed Orders");
    $('#ResetTable').hide();
    if(num == 2){
        var start_date = $('#start_date').val();
        start_date = new Date(start_date);
        var end_date = $('#end_date').val();
        end_date = new Date(end_date);
        var startDateVal = start_date.getDate() + "-" + ""  + start_date.getMonth() + 1 + "-" + start_date.getFullYear();
        var endDateVal = end_date.getDate() + "-" + ""  + end_date.getMonth() + 1 + "-" + end_date.getFullYear();
        $('#PageHeading').html("Order Reports from " + startDateVal + " to " + endDateVal);
        $('#ResetTable').show();
    }
    const entities = queryReal(ref(realdb, '/Orders'), orderByChild('orderstatus'), equalTo("Delivered"));
    try {
        onValue(entities, (snapshot) => {
            $("#table-1").DataTable().destroy();
            $("#dataTable").html('');
            var priceAll = 0;
            if (snapshot) {
                var count = 0;
                var towns = [];
                snapshot.forEach(function (doc) {
                    count++;
                    var data = doc.val();
                    
                    var customercontact = data.customercontact;
                    //var customeraddress = data.customeraddress;
                    var customername = data.customername;
                    
                    var date = data.date;
                    var orderdate = new Date(date);
                    var deliverycharges = data.deliverycharges;
                    var orderstatus = data.orderstatus;
                    var ordertime = data.ordertime;
                    var overTotal = data.overTotal;
                    //var productnotavailcase = data.productnotavailcase;
                    var servicefee = data.servicefee;
                    var time = data.time;
                    var townid = data.townid;
                    var label = '<div class="custombadge-outline col-green custombadge-shadow">'+orderstatus+'</div>';
                    var products = '<a data-toggle="tooltip" title="Show Products" style="color: #fff;cursor:pointer;" onclick="showProducts(\'' + doc.key + '\')" class="btn btn-primary badge-shadow"><i class="fas fa-eye"></i></a>';
                    
                    var row = `<tr>
                            <td>${customercontact}</td>
                            <td class="">${customername}</td>
                            <td class="">${date}</td>
                            <td class="">${products}</td>
                            <td class="">R ${deliverycharges}</td>
                            <td class="">R ${overTotal}</td>
                            <td class="">R ${servicefee}</td>
                            <td class="">${ordertime}</td>
                            <td class="">${time}</td>
                            <td data-town="${townid}"></td>
                            <td class="">${label}</td>
                            </tr>`;
                    if (!towns.includes(townid)) {
                        towns.push(townid);
                    }
                    if(num == 2){
                        if(orderdate >= start_date && orderdate <= end_date){
                            priceAll += parseFloat(overTotal);
                            $('#dataTable').append(row);
                        }
                        else{

                        }
                    }
                    else{
                        priceAll += parseFloat(overTotal);
                        $('#dataTable').append(row);
                    }
                })
            }
            else {
                MixinSweet('No data!', 'There is no data to show', "info", 2000);
            }
            $('#TotalPrice,#TotalPrice2').html("R" + priceAll);
            GetTowns(towns);
        });
    }
    catch (ex) {
        console.log(ex);
    }
}
async function GetTowns(array) {
    const towns = ref(realdb, 'Towns/');
    await onValue(towns, (snapshot) => {
        if (snapshot) {
            snapshot.forEach(function (doc) {
                var data = doc.val();
                if(array.includes(data.townid)){
                    $('[data-town="'+data.townid+'"]').html(data.townname);
                    array.splice(array.indexOf(data.townid),1);
                }
            })
            $('#table-1').DataTable();
            $('#daterangeModal').modal("hide");
        }
    })
}

function showProducts(Id){
    const entities = ref(realdb, 'Ordersdetail/' + Id);
    try {
        onValue(entities, (snapshot) => {
            $("#table-2").DataTable().destroy();
            $("#dataTable2").html('');
            if (snapshot) {
                var count = 0;
                snapshot.forEach(function (doc) {
                    count++;
                    var data = doc.val();
                    var menucategory = data.menucategory;
                    var menuname = data.menuname.split('/')[0];
                    var price = data.price;
                    var productimage = data.productimage;
                    var quantity = data.quantity;
                    var totalprice = data.totalprice;
                    var marketname = data.marketname;
                    
                    var product = `<div class="d-flex justify-content-left align-items-center">
                    <div class="avatar image-link me-1"><a class="image-popup-vertical-fit">
                    <img src="${productimage}" class="avatar-content"></a>
                    </div>
                    <div class="d-flex flex-column">
                        <span class="emp_name text-truncate fw-bold">
                        ${menuname}
                        </span>
                    </div>
                </div>`;                
                    var row = `<tr>
                    <td>${count}</td>
                    <td class="">${product}</td>
                    <td class="">${quantity}</td>
                    <td class="">R ${price}</td>
                    <td class="">R ${totalprice}</td>
                    <td>${marketname}</td>
                    <td class="">${menucategory}</td>
                    </tr>`;
                    $('#dataTable2').append(row);
                })
                $('#table-2').DataTable();
                $('#productModal').modal("show");
            }
        })
    }
    catch(ex){
        console.log(ex);
    }
}
function dateRangeFilter(){
    $('#start_date').val("");
    $('#end_date').val("");
    $('#daterangeModal').modal("show");
}