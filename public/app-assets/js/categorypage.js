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
    updateNode = exportData.updateNode;
    setNode = exportData.setNode;
    removeNode = exportData.removeNode;
    createTable();
})
async function createTable() {
    const users = ref(realdb, 'ParentCategories/');
    try {
        onValue(users, (snapshot) => {
            $("#table-1").DataTable().destroy();
            $("#dataTable").html('');
            if (snapshot) {
                snapshot.forEach(function (doc) {
                    var data = doc.val();
                    var image = data.image;
                    var email = data.email;
                    var name = data.name;
                    var contact = data.contact;
                    var address = data.address;
                    var status = data.status??"undefined";
                    var input =  `<input type="hidden" value="${address}" id="a-${doc.key}" />`
                    var address = '<a data-toggle="tooltip" title="Show Description" style="color: #fff;cursor:pointer;" onclick="showAddressModal(\'' + doc.key + '\')" class="btn btn-primary badge-shadow"><i class="fas fa-eye"></i></a>' + input;
                    
                    if(status == "undefined" || status == 1){
                        var label = '<div class="custombadge-outline col-green custombadge-shadow">Active</div>';
                        var action = '<a data-toggle="tooltip" title="Block User" style="color: #fff;cursor:pointer;" onclick="showBlockModal(\'' + doc.key + '\')" class="btn btn-danger badge-shadow"><i class="fas fa-ban"></i></a><a data-toggle="tooltip" title="Delete User" style="color: #fff;cursor:pointer;margin-left:2px;" onclick="showDeleteModal(\'' + doc.key + '\')" class="btn btn-danger badge-shadow"><i class="fas fa-trash"></i></a>';
                        var rowId = "1";
                    }
                    else{
                        var label = '<div class="custombadge-outline col-red custombadge-shadow">Blocked</div>';
                        var action = '<a data-toggle="tooltip" title="Unblock User" style="color: #fff;cursor:pointer;" onclick="showUnBlockModal(\'' + doc.key + '\')" class="btn btn-success badge-shadow"><i class="fas fa-check-circle"></i></a><a data-toggle="tooltip" title="Delete User" style="color: #fff;cursor:pointer;margin-left:2px;" onclick="showDeleteModal(\'' + doc.key + '\')" class="btn btn-danger badge-shadow"><i class="fas fa-trash"></i></a>';
                        var rowId = "2";
                    }

                    if(data.image != "no"){
                        var imagePop = `<div class="image-link">
                                            <a class="image-popup-vertical-fit" href="${image}">
                                                <img class="img-responsive thumbnail" src="${image}" width="35" height="30">
                                            </a>
                                        </div>`;
                    }
                    else{
                        var imagePop = "-";
                    }
                    var row = `<tr data-row="${rowId}">
                            <td>
                                <h6 class="mb-0 font-13 pdt10">
                                    ${email}
                                </h6>
                            </td>
                            <td class="">${name}</td>
                            <td class="">${imagePop}</td>
                            <td class="">${contact}</td>
                            <td class="">${address}</td>
                            <td class="">${label}</td>
                            <td class="">${action}</td>
                            </tr>`;
                    $('#dataTable').append(row);
                })
            }
            else {
                MixinSweet('No data!', 'There is no data to show', "info", 2000);
            }
            $('[data-toggle="tooltip"]').tooltip();
            $('#table-1').DataTable();
        });
    }
    catch (ex) {
        console.log(ex);
    }
}

$("#all").click(function () {
    $('#active_tab').removeClass('active');
    $('#all').addClass('active');
    $('#block_tab').removeClass('active');
    var table = $('#table-1').DataTable();
    $.fn.dataTable.ext.search.pop();
    table.draw();
});

$("#active_tab").click(function () {
    $('#active_tab').addClass('active');
    $('#all').removeClass('active');
    $('#block_tab').removeClass('active');
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

$("#block_tab").click(function () {
    $('#active_tab').removeClass('active');
    $('#all').removeClass('active');
    $('#block_tab').addClass('active');
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


function showDeleteModal(Id) {
    Swal.fire({
        title: 'Are you sure you want to delete?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        showLoaderOnConfirm:true,
        preConfirm:(login)=>{
            return new Promise(async function (resolve, reject) {
                DeleteEntity(Id);
            })
        },
        confirmButtonText: 'Confirm!'
    }).then((result) => {
        if (result.isConfirmed) {
            
        }
    })
}

function DeleteEntity(Id){
    var usersRef = ref(realdb, `Users/${Id}`);
    removeNode(usersRef)
    .then(function(){
        MixinSweet("Deleted Successfully","","success",2000);
    })
    .catch(function(error){
        console.log(error);
    })
}

function showBlockModal(Id) {
    Swal.fire({
        title: 'Are you sure you want to suspend?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        showLoaderOnConfirm:true,
        preConfirm:(login)=>{
            return new Promise(async function (resolve, reject) {
                BlockEntity(Id);
            })
        },
        confirmButtonText: 'Confirm!'
    }).then((result) => {
        if (result.isConfirmed) {
            
        }
    })
}

function BlockEntity(Id){
    var usersRef = ref(realdb, `Users/${Id}`);
    updateNode(usersRef,{
        status:0
    })
        .then(function(){
            MixinSweet("Suspend Successfully","","success",2000);
        })
        .catch(function(error){
            console.log(error);
        })
}

function showUnBlockModal(Id) {
    Swal.fire({
        title: 'Are you sure you want to activate frame?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        showLoaderOnConfirm:true,
        preConfirm:(login)=>{
            return new Promise(async function (resolve, reject) {
                UnBlockEntity(Id);
            })
        },
        confirmButtonText: 'Confirm!'
    }).then((result) => {
        if (result.isConfirmed) {
            
        }
    })
}

function UnBlockEntity(Id){
    var usersRef = ref(realdb, `Users/${Id}`);
    updateNode(usersRef,{
        status:1
    })
        .then(function(){
            MixinSweet("Unsuspended Successfully","","success",2000);
        })
        .catch(function(error){
            console.log(error);
        })
}

function showAddressModal(Id){
    var address = $(`#a-${Id}`).val();
    $('#Address').html(address);
    $('#addressModal').modal("show");
}