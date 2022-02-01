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
async function createTable() {
    const entities = ref(realdb, 'Orders/');
    try {
        onValue(entities, (snapshot) => {
            $("#table-1").DataTable().destroy();
            $("#dataTable").html('');
            if (snapshot) {
                var count = 0;
                var towns = [];
                snapshot.forEach(function (doc) {
                    count++;
                    var data = doc.val();
                    
                    var customercontact = data.customercontact;
                    var customeraddress = data.customeraddress;
                    var customername = data.customername;
                    var date = data.date;
                    var deliverycharges = data.deliverycharges;
                    var orderstatus = data.orderstatus;
                    var ordertime = data.ordertime;
                    var overTotal = data.overTotal;
                    var productnotavailcase = data.productnotavailcase;
                    var servicefee = data.servicefee;
                    var time = data.time;
                    var townid = data.townid;

                    if(orderstatus == "Registered"){
                        var label = '<div class="custombadge-outline col-blue custombadge-shadow">'+orderstatus+'</div>';
                        var action = '<a style="color: #fff;cursor:pointer;" onclick="showUpdateModal(\'' + doc.key + '\',\'Preparing order\')" class="btn btn-primary badge-shadow">Mark it as prepare</a>';
                        var rowId = "1";
                    }
                    else if(orderstatus == "Preparing order"){
                        var label = '<div class="custombadge-outline col-green custombadge-shadow">'+orderstatus+'</div>';
                        var action = '<a style="color: #fff;cursor:pointer;" onclick="showUpdateModal(\'' + doc.key + '\',\'Order Dispatched\')" class="btn btn-primary badge-shadow">Mark it as dispatched</a>';
                        var rowId = "2";
                    }
                    else if(orderstatus == "Order Dispatched"){
                        var label = '<div class="custombadge-outline col-green custombadge-shadow">'+orderstatus+'</div>';
                        var action = '<a style="color: #fff;cursor:pointer;" onclick="showUpdateModal(\'' + doc.key + '\',\'On the way\'))" class="btn btn-primary badge-shadow">Mark it as on the way</a>';
                        var rowId = "3";
                    }
                    else if(orderstatus == "On the way"){
                        var label = '<div class="custombadge-outline col-green custombadge-shadow">'+orderstatus+'</div>';
                        var action = '<a style="color: #fff;cursor:pointer;" onclick="showUpdateModal(\'' + doc.key + '\',\'Delivered\'))" class="btn btn-primary badge-shadow">Mark it as delivered</a>';
                        var rowId = "4";
                    }
                    else if(orderstatus == "Delivered"){
                        var label = '<div class="custombadge-outline col-green custombadge-shadow">'+orderstatus+'</div>';
                        var action = '';
                        var rowId = "5";
                    }
                    var products = '<a data-toggle="tooltip" title="Show Products" style="color: #fff;cursor:pointer;" onclick="showProducts(\'' + doc.key + '\')" class="btn btn-primary badge-shadow"><i class="fas fa-eye"></i></a>';
                    
                    var row = `<tr data-row="${rowId}">
                            <td>${customercontact}</td>
                            <td class="">${customername}</td>
                            <td class="">${date}</td>
                            <td class="">${products}</td>
                            <td class="">${deliverycharges}</td>
                            <td class="">${overTotal}</td>
                            <td class="">${productnotavailcase}</td>
                            <td class="">${servicefee}</td>
                            <td class="">${ordertime}</td>
                            <td class="">${time}</td>
                            <td data-town="${townid}"></td>
                            <td class="">${label}</td>
                            <td class="">${action}</td>
                            </tr>`;
                    if (!towns.includes(townid)) {
                        towns.push(townid);
                    }
                    $('#dataTable').append(row);
                })
            }
            else {
                MixinSweet('No data!', 'There is no data to show', "info", 2000);
            }
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
        }
    })
}


$("#all").click(function () {
    $('.btn-check').removeClass('active');
    $('#all').addClass('active');
    var table = $('#table-1').DataTable();
    $.fn.dataTable.ext.search.pop();
    table.draw();
});
$("#registered").click(function () {
    $('.btn-check').removeClass('active');
    $('#registered').addClass('active');
    var table = $('#table-1').DataTable();
    $.fn.dataTable.ext.search.pop();
    table.draw();
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            return $(table.row(dataIndex).node()).attr('data-row') == "1";
        }
    );
    table.draw();
});
$("#preparing").click(function () {
    $('.btn-check').removeClass('active');
    $('#preparing').addClass('active');
    var table = $('#table-1').DataTable();
    $.fn.dataTable.ext.search.pop();
    table.draw();
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            return $(table.row(dataIndex).node()).attr('data-row') == "2";
        }
    );
    table.draw();
});
$("#dispatched").click(function () {
    $('.btn-check').removeClass('active');
    $('#dispatched').addClass('active');
    var table = $('#table-1').DataTable();
    $.fn.dataTable.ext.search.pop();
    table.draw();
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            return $(table.row(dataIndex).node()).attr('data-row') == "3";
        }
    );
    table.draw();
});
$("#ontheway").click(function () {
    $('.btn-check').removeClass('active');
    $('#ontheway').addClass('active');
    var table = $('#table-1').DataTable();
    $.fn.dataTable.ext.search.pop();
    table.draw();
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            return $(table.row(dataIndex).node()).attr('data-row') == "4";
        }
    );
    table.draw();
});
$("#completed").click(function () {
    $('.btn-check').removeClass('active');
    $('#completed').addClass('active');
    var table = $('#table-1').DataTable();
    $.fn.dataTable.ext.search.pop();
    table.draw();
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            return $(table.row(dataIndex).node()).attr('data-row') == "4";
        }
    );
    table.draw();
});


function showUpdateModal(Id,status) {
    Swal.fire({
        title: 'Are you sure',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        showLoaderOnConfirm:true,
        preConfirm:(login)=>{
            return new Promise(async function (resolve, reject) {
                UpdateEntity(Id,status);
            })
        },
        confirmButtonText: 'Confirm!'
    }).then((result) => {
        if (result.isConfirmed) {
            
        }
    })
}
function UpdateEntity(Id,status){
    var ordersRef = ref(realdb, `Orders/${Id}`);
    updateDoc(ordersRef,{
        orderstatus:status,
    })
    .then(function(){
        MixinSweet("updated Successfully","","success",2000);
    })
    .catch(function(error){
        console.log(error);
    })
}