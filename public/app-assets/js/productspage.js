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
    const cats = ref(realdb, 'Products/');
    try {
        onValue(cats, (snapshot) => {
            $("#table-1").DataTable().destroy();
            $("#dataTable").html('');
            if (snapshot) {
                var count = 0;
                var parentcatIds = [];
                var catIds = [];
                var towns = [];
                snapshot.forEach(function (doc) {
                    count++;
                    var data = doc.val();
                    
                    var category = data.category;
                    var desc = data.desc;
                    var image = data.image;
                    var name = data.name;
                    var townname = data.townname;
                    var townid = data.townid;
                    var parentcategory = data.parentcategory;
                    var checkerspayprice = data.checkerspayprice;
                    var picknpayprice = data.picknpayprice;
                    var sparsprice = data.sparsprice;

                    var input =  `<input type="hidden" value="${category}" id="c-${doc.key}" />
                    <input type="hidden" value="${desc}" id="d-${doc.key}" />
                    <input type="hidden" value="${image}" id="i-${doc.key}" />
                    <input type="hidden" value="${name}" id="n-${doc.key}" />
                    <input type="hidden" value="${parentcategory}" id="p-${doc.key}" />
                    <input type="hidden" value="${checkerspayprice}" id="t-${doc.key}" />
                    <input type="hidden" value="${picknpayprice}" id="t-${doc.key}" />
                    <input type="hidden" value="${sparsprice}" id="t-${doc.key}" />
                    <input type="hidden" value="${sparsprice}" id="t-${doc.key}" />
                    <input type="hidden" value="${sparsprice}" id="t-${doc.key}" />
                    <input type="hidden" value="${sparsprice}" id="t-${doc.key}" />
                    <input type="hidden" value="${townname}" id="t-${doc.key}" />
                    <input type="hidden" value="${townid}" id="t-${doc.key}" />
                    `;
                    var product = `<div class="d-flex justify-content-left align-items-center">
                        <div class="avatar  me-1"><img src="${image}" class="avatar-content">
                        </div>
                        <div class="d-flex flex-column">
                            <span class="emp_name text-truncate fw-bold">
                            ${name}
                            </span>
                        </div>
                    </div>`
                    var desc = '<a data-toggle="tooltip" title="Show Description" style="color: #fff;cursor:pointer;" onclick="showDescModal(\'' + doc.key + '\')" class="btn btn-primary badge-shadow"><i class="fas fa-eye"></i></a>' + input;
                    var info = '<a data-toggle="tooltip" title="Show Info" style="color: #fff;cursor:pointer;" onclick="ShowInfo(\'' + doc.key + '\')" class="btn btn-primary badge-shadow"><i class="fas fa-eye"></i></a>' + input;
                    var action = '<a data-toggle="tooltip" title="Edit Product" style="color: #fff;cursor:pointer;margin-left:2px;" onclick="showEditModal(\'' + doc.key + '\')" class="btn btn-secondary badge-shadow"><i class="fas fa-edit"></i></a><a data-toggle="tooltip" title="Delete Subcategory" style="color: #fff;cursor:pointer;margin-left:2px;" onclick="showDeleteModal(\'' + doc.key + '\')" class="btn btn-danger badge-shadow"><i class="fas fa-trash"></i></a>' + input;
                    
                    var row = `<tr>
                            <td class="">${count}</td>
                            <td>
                                <h6 class="mb-0 font-13 pdt10">
                                    ${product}
                                </h6>
                            </td>
                            <td class="">${desc}</td>
                            <td data-town="${townid}"></td>
                            <td data-parent="${parentcategory}"></td>
                            <td data-cat="${category}"></td>
                            <td class="">${info}</td>
                            <td class="">${action}</td>
                            </tr>`;
                    if (!parentcatIds.includes(parentcategory)) {
                        parentcatIds.push(parentcategory);
                    }
                    if (!catIds.includes(category)) {
                        catIds.push(category);
                    }
                    if (!towns.includes(townid)) {
                        towns.push(townid);
                    }
                    $('#dataTable').append(row);
                })
            }
            else {
                MixinSweet('No data!', 'There is no data to show', "info", 2000);
            }
            GetCats(catIds,parentcatIds,towns);
        });
    }
    catch (ex) {
        console.log(ex);
    }
}
async function GetCats(array,array2,array3) {
    const cats = ref(realdb, 'ParentCategories/');
    await onValue(cats, (snapshot) => {
        if (snapshot) {
            snapshot.forEach(function (doc) {
                var data = doc.val();
                if(array2.includes(data.talentname)){
                    $('[data-parent="'+data.talentname+'"]').html(data.talentname);
                    array2.splice(array2.indexOf(data.talentname),1);
                }
            })
        }
    })
    const cats2 = ref(realdb, 'Categories/');
    await onValue(cats2, (snapshot) => {
        if (snapshot) {
            snapshot.forEach(function (doc) {
                var data = doc.val();
                if(array.includes(data.categoryname)){
                    $('[data-cat="'+data.categoryname+'"]').html(data.categoryname);
                    array.splice(array.indexOf(data.categoryname),1);
                }
            })
        }
    })
    const towns = ref(realdb, 'Towns/');
    await onValue(towns, (snapshot) => {
        if (snapshot) {
            snapshot.forEach(function (doc) {
                var data = doc.val();
                if(array3.includes(data.id)){
                    $('[data-town="'+data.id+'"]').html(data.townname);
                    array3.splice(array3.indexOf(data.townname),1);
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

function showDescModal(Id){
    var Description = $(`#d-${Id}`).val();
    $('#DescBody').html(Description);
    $('#descModal').modal("show");
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