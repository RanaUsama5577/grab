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
    TownsAppend();
})
async function createTable() {
    const entities = ref(realdb, 'Discounts/');
    try {
        onValue(entities, (snapshot) => {
            $("#table-1").DataTable().destroy();
            $("#dataTable").html('');
            if (snapshot) {
                var count = 0;
                var townIds = [];
                snapshot.forEach(function (doc) {
                    count++;
                    var data = doc.val();
                    var coupon = data.coupon_code;
                    var off = data.percentage_off;
                    var start_date = data.start_date;
                    var end_date = data.end_date;
                    var action = '<a data-toggle="tooltip" title="Delete Discount" style="color: #fff;cursor:pointer;margin-left:2px;" onclick="showDeleteModal(\'' + doc.key + '\')" class="btn btn-danger badge-shadow"><i class="fas fa-trash"></i></a>';
                    
                    var row = `<tr>
                            <td class="">${count}</td>
                            <td>
                                <h6 class="mb-0 font-13 pdt10">
                                    ${coupon}
                                </h6>
                            </td>
                            <td class="">${off} %</td>
                            <td>${start_date}</td>
                            <td>${end_date}</td>
                            <td class="">${action}</td>
                            </tr>`;
                    $('#dataTable').append(row);
                })
                $('#table-1').DataTable();
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
    var entiesRef = ref(realdb, `Discounts/${Id}`);
    removeNode(entiesRef)
    .then(function(){
        MixinSweet("Deleted Successfully","","success",2000);
    })
    .catch(function(error){
        console.log(error);
    })
}
function addNewModal() {
    $("#Form")[0].reset();
    $('#addModal').modal("show");
    $('#myModalLabel').html("Add Category");
}
$('#Form').submit(function(e){
    e.preventDefault();
})
function AddDiscount() {
    var discountCoupon = $('#discountCoupon').val();
    var percentage_off = $('#percentage_off').val();
    var start_date = $('#start_date').val();
    var end_date = $('#end_date').val();
    var bool = true;
    var GetAllValues = [];
    $('#Form').find(('.form-control')).each(function (i, obj) {
        var values = getDataFromSimpleField($(obj));
        GetAllValues.push(values);
        if (GetAllValues.includes(false)) {
            bool = false;
        }
    })
    if (bool == false) {
        MixinSweet("Please fill all the required fields", "", "error", 2000);
    }
    else if(new Date(start_date) > new Date(end_date)){
        sweetMessage("Error!","Start date cannot be greater than end date","error");
        return false;
    }
    else if(new Date(start_date) < new Date()){
        sweetMessage("Error!","Start date cannot be smaller than Today date","error");
        return false;
    }
    else {
        $('#add_btn').addClass('btn-progress');
        var new_reference = GetTimeStamp();
        var catref = ref(realdb, `Discounts/${new_reference}`);
        setNode(catref,{
            discount_id: new_reference,
            percentage_off: percentage_off,
            start_date: start_date,
            end_date: end_date,
            coupon_code:discountCoupon,
            created_at:new_reference,
        })
            .then(function(){
                $('#add_btn').removeClass('btn-progress');
                MixinSweet("Added Successfully","","success",2000);
                $("#Form")[0].reset();
                $('#addModal').modal("hide");
            })
            .catch(function(error){
                console.log(error);
            })
    }
}
function getDataFromSimpleField(element) {
    var s = false;
    var value = $(element).val();
    
    if (value == "" || value == null || value == undefined) {
        s = false;
        $(element).addClass('is-invalid');
        $(element).removeClass('is-valid');
        if ($(element).hasClass('custom-file-container__custom-file__custom-file-input')) {
            $(element).siblings('span').addClass('red_border');
            $(element).siblings('span').removeClass('none_border');
        }
    }
    else if (!value.replace(/\s/g, '')[0].length) {
        s = false;
        $(element).addClass('is-invalid');
        $(element).removeClass('is-valid');
        if ($(element).hasClass('custom-file-container__custom-file__custom-file-input')) {
            $(element).siblings('span').addClass('red_border');
            $(element).siblings('span').removeClass('none_border');
        }
    }
    else {
        s = true;
        $(element).addClass('is-valid');
        $(element).removeClass('is-invalid');
        if ($(element).hasClass('custom-file-container__custom-file__custom-file-input')) {
            $(element).siblings('span').removeClass('red_border');
            $(element).siblings('span').addClass('none_border');
        }
    }
    if (s == false) {
        return false;
    }
    return true;
}