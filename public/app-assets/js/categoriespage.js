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
    const users = ref(realdb, 'ParentCategories/');
    try {
        onValue(users, (snapshot) => {
            $("#table-1").DataTable().destroy();
            $("#dataTable").html('');
            if (snapshot) {
                var count = 0;
                var townIds = [];
                snapshot.forEach(function (doc) {
                    count++;
                    var data = doc.val();
                    var image = data.image;
                    var talentname = data.talentname;
                    var townid = data.townid;
                    var input =  `<input type="hidden" value="${image}" id="i-${doc.key}" />
                    <input type="hidden" value="${talentname}" id="n-${doc.key}" />`;
                    
                    var action = '<a data-toggle="tooltip" title="Edit Category" style="color: #fff;cursor:pointer;margin-left:2px;" onclick="showEditModal(\'' + doc.key + '\')" class="btn btn-secondary badge-shadow"><i class="fas fa-edit"></i></a><a data-toggle="tooltip" title="Delete Category" style="color: #fff;cursor:pointer;margin-left:2px;" onclick="showDeleteModal(\'' + doc.key + '\')" class="btn btn-danger badge-shadow"><i class="fas fa-trash"></i></a>' + input;

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
                    var row = `<tr>
                            <td class="">${count}</td>
                            <td>
                                <h6 class="mb-0 font-13 pdt10">
                                    ${talentname}
                                </h6>
                            </td>
                            <td class="">${imagePop}</td>
                            <td data-townid="${townid}"></td>
                            <td class="">${action}</td>
                            </tr>`;
                    if (!townIds.includes(townid)) {
                        townIds.push(townid);
                    }
                    $('#dataTable').append(row);
                })
            }
            else {
                MixinSweet('No data!', 'There is no data to show', "info", 2000);
            }
            GetTowns(townIds);
            
        });
    }
    catch (ex) {
        console.log(ex);
    }
}
function GetTowns(array) {
    const towns = ref(realdb, 'Towns/');
    onValue(towns, (snapshot) => {
        if (snapshot) {
            snapshot.forEach(function (doc) {
                var data = doc.val();
                if(array.includes(doc.key)){
                    $('[data-townid="'+doc.key+'"]').html(data.townname);
                    array.splice(array.indexOf(doc.key),1);
                }
            })
            $('.image-link').lightGallery({
                thumbnail: true,
                selector: 'a'
            });
            $('[data-toggle="tooltip"]').tooltip();
            $('#table-1').DataTable();
        }
    })
}

function TownsAppend() {
    const towns = ref(realdb, 'Towns/');
    onValue(towns, (snapshot) => {
        if (snapshot) {
            $('#town_id').html("");
            snapshot.forEach(function (doc) {
                var data = doc.val();
                $('#town_id').append(`<option value="${doc.key}">${data.townname}</option>`);
            })
        }
    })
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
    var usersRef = ref(realdb, `ParentCategories/${Id}`);
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
    $('#selectTown').show();
    var first = new FileUploadWithPreview('myFirstImage');
    $('#myModalLabel').html("Add Category");
}
function showEditModal(Id){
    $("#Form")[0].reset();
    $('#form_type').val("2");
    $('#doc_id').val(Id);
    $('#myModalLabel').html("Edit Category");
    $('#selectTown').hide();
    var name = $(`#n-${Id}`).val();
    var image = $(`#i-${Id}`).val();

    $('#catName').val(name);
    var first = new FileUploadWithPreview('myFirstImage');
    $('.custom-file-container__image-preview').attr('style', "background-image:url('" + image + "')");
    $('#addModal').modal("show");
}
$('#Form').submit(function(e){
e.preventDefault();
})
function AddCategory() {
    var town_id = $('#town_id').val();
    var catName = $('#catName').val();
    var file = $('#file')[0].files[0];
    var bool = true;
    var GetAllValues = [];
    var cat_image = $('#file').val();
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
        if (cat_image != "") {
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
function UpdateData(ImageUrl){
    var town_id = $('#town_id').val();
    var catName = $('#catName').val();
    var form_type = $('#form_type').val();
    $('#add_btn').addClass('btn-progress');
    if (form_type == '1') {
        var cat_reference = GetTimeStamp();
        var catref = ref(realdb, `ParentCategories/${cat_reference}`);
        setNode(catref,{
            image:ImageUrl,
            talentid:cat_reference,
            talentname: catName,
            townid:town_id,
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
        var Id =$('#doc_id').val();
        var catref = ref(realdb, `ParentCategories/${Id}`);
        updateNode(catref,{
            image:ImageUrl,
            talentid:Id,
            talentname: catName,
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