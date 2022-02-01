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
    const products = ref(realdb, 'Products/');
    try {
        onValue(products, (snapshot) => {
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
                    var sub_cat_id = data.sub_cat_id;
                    var desc = data.desc;
                    var image = data.image;
                    var name = data.name;
                    var townname = data.townname;
                    var townid = data.townid;
                    var parentcategory = data.parentcategory;
                    var cat_id = data.cat_id;
                    var checkerspayprice = data.checkerspayprice;
                    var picknpayprice = data.picknpayprice;
                    var sparsprice = data.sparsprice;

                    var isCheckersshow = data.isCheckersshow;
                    var isPicknpayshow = data.isPicknpayshow;
                    var issparsshow = data.issparsshow;

                    var input =  `<input type="hidden" value="${category}" id="c-${doc.key}" />
                    <input type="hidden" value="${desc}" id="d-${doc.key}" />
                    <input type="hidden" value="${image}" id="i-${doc.key}" />
                    <input type="hidden" value="${name}" id="n-${doc.key}" />
                    <input type="hidden" value="${parentcategory}" id="p-${doc.key}" />
                    <input type="hidden" value="${checkerspayprice}" id="cp-${doc.key}" />
                    <input type="hidden" value="${picknpayprice}" id="pp-${doc.key}" />
                    <input type="hidden" value="${isCheckersshow}" id="ic-${doc.key}" />
                    <input type="hidden" value="${isPicknpayshow}" id="ip-${doc.key}" />
                    <input type="hidden" value="${issparsshow}" id="is-${doc.key}" />
                    <input type="hidden" value="${sparsprice}" id="sp-${doc.key}" />
                    <input type="hidden" value="${townname}" id="t-${doc.key}" />
                    <input type="hidden" value="${townid}" id="t-${doc.key}" />
                    `;
                    var product = `<div class="d-flex justify-content-left align-items-center">
                        <div class="avatar image-link me-1"><a class="image-popup-vertical-fit" href="${image}">
                        <img src="${image}" class="avatar-content"></a>
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
                            <td data-parent="${cat_id}"></td>
                            <td data-cat="${sub_cat_id}"></td>
                            <td class="">${info}</td>
                            <td class="">${action}</td>
                            </tr>`;
                    if (!parentcatIds.includes(cat_id)) {
                        parentcatIds.push(cat_id);
                    }
                    if (!catIds.includes(sub_cat_id)) {
                        catIds.push(sub_cat_id);
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
                if(array2.includes(data.talentid)){
                    $('[data-parent="'+data.talentid+'"]').html(data.talentname);
                    array2.splice(array2.indexOf(data.talentid),1);
                }
            })
        }
    })
    const cats2 = ref(realdb, 'Categories/');
    await onValue(cats2, (snapshot) => {
        if (snapshot) {
            snapshot.forEach(function (doc) {
                var data = doc.val();
                if(array.includes(data.categoryid)){
                    $('[data-cat="'+data.categoryid+'"]').html(data.categoryname);
                    array.splice(array.indexOf(data.categoryid),1);
                }
            })
        }
    })
    const towns = ref(realdb, 'Towns/');
    await onValue(towns, (snapshot) => {
        if (snapshot) {
            snapshot.forEach(function (doc) {
                var data = doc.val();
                if(array3.includes(data.townid)){
                    $('[data-town="'+data.townid+'"]').html(data.townname);
                    array3.splice(array3.indexOf(data.townid),1);
                }
            })
            $('#table-1').DataTable();
            $('.image-link').lightGallery({
                thumbnail: true,
                selector: 'a'
            });
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
    const childs = ref(realdb, 'Categories/');
    onValue(childs, (snapshot) => {
        if (snapshot) {
            $('#selectSubCategoryDefault').html("");
            snapshot.forEach(function (doc) {
                var data = doc.val();
                $('#selectSubCategoryDefault').append(`
                <option label="${data.parent_category_id}" value="${doc.key}">${data.categoryname}</option>`);
            })
        }
    })

}

function selectingTown(element){
    $('#cat_id').select2('destroy');
    $('#sub_cat_id').select2('destroy');
    $('#sub_cat_id').html(`<option value="">---Select Subcategory--</option>`);
    var town_id = $(element).val();
    $('#cat_id').html(`<option value="">---Select Category--</option>`);
    var clone = $('#selectCategoryDefault').find('[label="'+town_id+'"]').clone();
    $('#cat_id').append(clone);
    $('#cat_id').select2();
}

function selectingCategory(element){
    var cat_id = $(element).val();
    $('#sub_cat_id').html(`<option value="">---Select Subcategory--</option>`);
    var clone = $('#selectSubCategoryDefault').find('[label="'+cat_id+'"]').clone();
    $('#sub_cat_id').append(clone);
    $('#sub_cat_id').select2();
}

function ShowInfo(Id){
    var checkerspayprice = $(`#cp-${Id}`).val();
    var picknpayprice = $(`#pp-${Id}`).val();
    var sparsprice = $(`#sp-${Id}`).val();
    var isCheckersshow = $(`#ic-${Id}`).val();
    var isPicknpayshow = $(`#ip-${Id}`).val();
    var issparsshow = $(`#is-${Id}`).val();

    $('#DescBody').html("");
    $('#DescBody').append(`<p>Checkers Pay : ${checkerspayprice}</p>`);
    $('#DescBody').append(`<p>Pick And Pay : ${picknpayprice}</p>`);
    $('#DescBody').append(`<p>S Pars Pay : ${sparsprice}</p>`);
    $('#DescBody').append(`<p>Is Checkers : ${isCheckersshow}</p>`);
    $('#DescBody').append(`<p>Is Pick And Pay : ${isPicknpayshow}</p>`);
    $('#DescBody').append(`<p>Is Pars Pay : ${issparsshow}</p>`);
    $('#descModal').modal("show");
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
    $('.selectionDivs').show();
    $('#myModalLabel').html("Add Product");
    var first = new FileUploadWithPreview('myFirstImage');
    $('#town_id').select2();
}

function showEditModal(Id){
    $("#Form")[0].reset();
    $('#form_type').val("2");
    $('#doc_id').val(Id);
    $('#myModalLabel').html("Edit Product");
    var first = new FileUploadWithPreview('myFirstImage');
    
    $('.selectionDivs').hide();
    var name = $(`#n-${Id}`).val();
    var desc = $(`#d-${Id}`).val();
    var image = $(`#i-${Id}`).val();
    var checkerspayprice = $(`#cp-${Id}`).val();
    var picknpayprice = $(`#pp-${Id}`).val();
    var sparsprice = $(`#sp-${Id}`).val();
    var isCheckersshow = $(`#ic-${Id}`).val();
    var isPicknpayshow = $(`#ip-${Id}`).val();
    var issparsshow = $(`#is-${Id}`).val();
    $('.custom-file-container__image-preview').attr('style', "background-image:url('" + image + "')");
    $('#productName').val(name);
    $('#productDesc').val(desc);
    $('#checkerpayprice').val(checkerspayprice);
    $('#pickpayprice').val(picknpayprice);
    $('#sparsprice').val(sparsprice);
    isCheckersshow == "yes"?$('#is_checkers').prop('checked',true):$('#is_checkers').prop('checked',false);
    isPicknpayshow == "yes"?$('#is_pick_and_pay').prop('checked',true):$('#is_pick_and_pay').prop('checked',false);
    issparsshow == "yes"?$('#is_pars').prop('checked',true):$('#is_pars').prop('checked',false);

    $('#addModal').modal("show");
}

$('#Form').submit(function(e){
    e.preventDefault();
})
function AddProduct() {
    var bool = true;
    var GetAllValues = [];
    var product_image = $('#file').val();
    var form_type = $('#form_type').val();

    if(form_type == 1){
        $('#Form').find(('.form-control,.custom-file-container__custom-file__custom-file-input')).each(function (i, obj) {
            var values = getDataFromSimpleField($(obj));
            GetAllValues.push(values);
            if (GetAllValues.includes(false)) {
                bool = false;
            }
        })
    }
    else{
        $('#Form').find(('.form-control')).each(function (i, obj) {
            var values = getDataFromSimpleField($(obj));
            GetAllValues.push(values);
            if (GetAllValues.includes(false)) {
                bool = false;
            }
        })
    }
    
    if (bool == false) {
        MixinSweet("Please fill all the required fields", "", "error", 2000);
    }
    else {
        $('#add_btn').addClass('btn-progress');
        if (product_image != "") {
            $("#progess_section").show();
            var file = $("#file").get(0).files[0];
            var name = (+new Date()) + '-' + file.name;
            var metadata = { contentType: file.type };
            var fileName = name;
            var storageRef = storage;
            var timestamp = new Date().getTime().toString();
            var ref = storageRef.ref(storageRef.getStorage(), 'images/' + timestamp+'/');
            var uploadTask = storageRef.uploadBytesResumable(ref, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    var fixval = progress.toFixed(0);
                    $("#bar").html(fixval + "%");
                    $("#bar").css('width', progress + '%').attr('aria-valuenow', progress);
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    sweetMessage("Warning", error.message, "error");
                },
                () => {
                    storageRef.getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        UpdateData(downloadURL);
                        $("#progess_section").hide();
                        console.log('File available at', downloadURL);
                    });
                }
            );
        }
        else {
            var doc_id = $('#doc_id').val();
            var image = $('#i-' + doc_id).val();
            UpdateData(image);
        }
    }
}
function UpdateData(image){
    var name = $('#productName').val();
    var desc = $('#productDesc').val();
    var checkerspayprice = $('#checkerpayprice').val();
    var picknpayprice = $('#pickpayprice').val();
    var sparsprice = $('#sparsprice').val();
    var isCheckersshow = "yes";
    var isPicknpayshow = "yes";
    var issparsshow = "yes";
    var form_type = $('#form_type').val();
    isCheckersshow = $('#is_checkers').is( ":checked" )?"yes":"no";
    isPicknpayshow = $('#is_pick_and_pay').is( ":checked" )?"yes":"no";
    issparsshow = $('#is_pars').is( ":checked" )?"yes":"no";


    if (form_type == '1') {
        var town_id = $('#town_id').val();
        var cat_id = $('#cat_id').val();
        var sub_cat_id = $('#sub_cat_id').val();
        var town_name = $('#town_id').find('[value="'+town_id+'"]').html();
        var cat_name = $('#cat_id').find('[value="'+cat_id+'"]').html();
        var sub_cat_name = $('#sub_cat_id').find('[value="'+sub_cat_id+'"]').html();


        var product_reference = GetTimeStamp();
        var productref = ref(realdb, `Products/${product_reference}`);
        setNode(productref,{
            productid: product_reference,
            name: name,
            cat_id: cat_id,
            category:sub_cat_name,
            sub_cat_id: sub_cat_id,
            townid: town_id,
            townname:town_name,
            desc:desc,
            image:image,
            isCheckersshow:isCheckersshow,
            isPicknpayshow:isPicknpayshow,
            issparsshow:issparsshow,
            parentcategory:cat_name,
            checkerspayprice:checkerspayprice,
            picknpayprice:picknpayprice,
            sparsprice:sparsprice,
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
        var productref = ref(realdb, `Products/${Id}`);
        updateNode(productref,{
            name: name,
            desc:desc,
            image:image,
            isCheckersshow:isCheckersshow,
            isPicknpayshow:isPicknpayshow,
            issparsshow:issparsshow,
            checkerspayprice:checkerspayprice,
            picknpayprice:picknpayprice,
            sparsprice:sparsprice,
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
function showDetails(items, id) {
    var result;
    items.some(function (item) {
        if (item.townname === id) {
            result = item;
            return true;
        }
    });
    return result;
}