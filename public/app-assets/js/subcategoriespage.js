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
    DataAppend();
})
async function createTable() {
    const cats = ref(realdb, 'Categories/');
    try {
        onValue(cats, (snapshot) => {
            $("#table-1").DataTable().destroy();
            $("#dataTable").html('');
            if (snapshot) {
                var count = 0;
                var catIds = [];
                snapshot.forEach(function (doc) {
                    count++;
                    var data = doc.val();
                    var categoryname = data.categoryname;
                    var parent_category_id = data.parent_category_id;
                    var input =  `<input type="hidden" value="${categoryname}" id="n-${doc.key}" />`;
                    
                    var action = '<a data-toggle="tooltip" title="Edit Subcategory" style="color: #fff;cursor:pointer;margin-left:2px;" onclick="showEditModal(\'' + doc.key + '\')" class="btn btn-secondary badge-shadow"><i class="fas fa-edit"></i></a><a data-toggle="tooltip" title="Delete Subcategory" style="color: #fff;cursor:pointer;margin-left:2px;" onclick="showDeleteModal(\'' + doc.key + '\')" class="btn btn-danger badge-shadow"><i class="fas fa-trash"></i></a>' + input;
                    
                    var row = `<tr>
                            <td class="">${count}</td>
                            <td>
                                <h6 class="mb-0 font-13 pdt10">
                                    ${categoryname}
                                </h6>
                            </td>
                            <td data-catid="${parent_category_id}"></td>
                            <td class="">${action}</td>
                            </tr>`;
                    if (!catIds.includes(parent_category_id)) {
                        catIds.push(parent_category_id);
                    }
                    $('#dataTable').append(row);

                })
            }
            else {
                MixinSweet('No data!', 'There is no data to show', "info", 2000);
            }
            GetCats(catIds);
        });
    }
    catch (ex) {
        console.log(ex);
    }
}
function GetCats(array) {
    const cats = ref(realdb, 'ParentCategories/');
    onValue(cats, (snapshot) => {
        if (snapshot) {
            snapshot.forEach(function (doc) {
                var data = doc.val();
                if(array.includes(doc.key)){
                    $('[data-catid="'+doc.key+'"]').html(data.talentname);
                    array.splice(array.indexOf(doc.key),1);
                }
            })
            $('#table-1').DataTable();
        }
    })
}

function DataAppend() {
    const towns = ref(realdb, 'Towns/');
    onValue(towns, (snapshot) => {
        if (snapshot) {
            $('#town_id').html("");
            $('#town_id').html(`<option value="">---Select Town--</option>`);
            snapshot.forEach(function (doc) {
                var data = doc.val();
                $('#town_id').append(`<option value="${doc.key}">${data.townname}</option>`);
            })
        }
    })
    const parents = ref(realdb, 'ParentCategories/');
    onValue(parents, (snapshot) => {
        if (snapshot) {
            $('#selectCategoryDefault').html("");
            snapshot.forEach(function (doc) {
                var data = doc.val();
                $('#selectCategoryDefault').append(`
                <option label="${data.townid}" value="${doc.key}">${data.talentname}</option>`);
            })
        }
    })
}

function GetCatAppend(element){
    $('#cat_id').select2('destroy');
    var town_id = $(element).val();
    var clone = $('#selectCategoryDefault').find('[label="'+town_id+'"]').clone();
    $('#cat_id').html(clone);
    $('#cat_id').select2();
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
    var usersRef = ref(realdb, `Categories/${Id}`);
    removeNode(usersRef)
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
    $('#form_type').val("1");
    $('#selectTownDiv').show();
    $('#selectCategoryDiv').show();
    $('#myModalLabel').html("Add Category");
    $('#town_id').select2();
}

function showEditModal(Id){
    $("#Form")[0].reset();
    $('#form_type').val("2");
    $('#doc_id').val(Id);
    $('#myModalLabel').html("Edit Subcategory");
    $('#selectTownDiv').hide();
    $('#selectCategoryDiv').hide();
    var name = $(`#n-${Id}`).val();
    $('#catName').val(name);
    $('#addModal').modal("show");
}

$('#Form').submit(function(e){
e.preventDefault();
})
function AddCategory() {
    var town_id = $('#town_id').val();
    var cat_id = $('#cat_id').val();
    var catName = $('#catName').val();
    var parentCatName = $('#cat_id').find('[value="'+cat_id+'"]').html();
    var bool = true;
    var GetAllValues = [];
    var form_type = $('#form_type').val();

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
    else {
        $('#add_btn').addClass('btn-progress');
        if (form_type == '1') {
            var cat_reference = GetTimeStamp();
            var catref = ref(realdb, `Categories/${cat_reference}`);
            setNode(catref,{
                categoryid: cat_reference,
                categoryname: catName,
                parentcategoryname: parentCatName,
                parent_category_id: cat_id,
                townid: town_id,
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
        else {
            var Id = $('#doc_id').val();
            var catref = ref(realdb, `Categories/${Id}`);
            updateNode(catref,{
                categoryname: catName,
            })
                .then(function(){
                    $('#add_btn').removeClass('btn-progress');
                    MixinSweet("Updated Successfully","","success",2000);
                    $("#Form")[0].reset();
                    $('#addModal').modal("hide");
                })
                .catch(function(error){
                    console.log(error);
                })
        }
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