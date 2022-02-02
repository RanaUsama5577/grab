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
    const towns = ref(realdb, 'Towns/');
    try {
        onValue(towns, (snapshot) => {
            $("#table-1").DataTable().destroy();
            $("#dataTable").html('');
            if (snapshot) {
                var count = 0;
                snapshot.forEach(function (doc) {
                    count++;
                    var data = doc.val();
                    var townLatitude = data.townLatitude;
                    var townlogitude = data.townlogitude;
                    var townname = data.townname;
                    var address = data.address;
                    var inputs = `
                    <input type="hidden" id="lat-${doc.key}" value="${townLatitude}" />
                    <input type="hidden" id="lng-${doc.key}" value="${townlogitude}" />
                    <input type="hidden" id="a-${doc.key}" value="${address}" />
                    <input type="hidden" id="n-${doc.key}" value="${townname}" />
                    `;
                    //Location
                    var location = '<a data-bs-toggle="modal" data-bs-target="#mapModal" data-lat="'+townLatitude+'" data-lng="'+townlogitude+'" data-toggle="tooltip" title="Show Location" style="color: #fff;cursor:pointer;margin-left:2px;" class="btn btn-primary badge-shadow"><i class="fas fa-map-pin"></i></a>';
                    var time_slots = '<a data-toggle="tooltip" title="Show Time Slots" style="color: #fff;cursor:pointer;margin-left:2px;" onclick="showTimeSlotModal(\'' + doc.key + '\')" class="btn btn-primary badge-shadow"><i class="fas fa-eye"></i></a>';
                    //Edit And Delete Town
                    var edit = '<a data-toggle="tooltip" title="Edit Town" style="color: #fff;cursor:pointer;" onclick="showEditModal(\'' + doc.key + '\')" class="btn btn-secondary badge-shadow"><i class="fas fa-edit"></i></a>' + inputs;
                    var action = '<a data-toggle="tooltip" title="Delete Town" style="color: #fff;cursor:pointer;margin-left:2px;" onclick="showDeleteModal(\'' + doc.key + '\')" class="btn btn-danger badge-shadow"><i class="fas fa-trash"></i></a>';
                    
                    var row = `<tr>
                            <td>
                                <h6 class="mb-0 font-13 pdt10">
                                    ${count}
                                </h6>
                            </td>
                            <td class="">${townname}</td>
                            <td class="">${location}</td>
                            <td class="">${time_slots}</td>
                            <td class="">${edit + action}</td>
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
    var nodeRef = ref(realdb, `Towns/${Id}`);
    removeNode(nodeRef)
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
    $('#myModalLabel').html("Add Town");
}
function showEditModal(Id){
    $("#Form")[0].reset();
    $('#form_type').val("2");
    $('#doc_id').val(Id);
    $('#myModalLabel').html("Edit Town");
    var town_name = $(`#n-${Id}`).val();
    var town_lat = $(`#lat-${Id}`).val();
    var town_lng = $(`#lng-${Id}`).val();
    var town_address = $(`#a-${Id}`).val();

    $('#townName').val(town_name);
    $('#lat').val(town_lat);
    $('#lng').val(town_lng);
    $('#autocomplete_search').val(town_address);
    initMap(town_lat, town_lng);
    $('#addModal').modal("show");
}
$('#Form').submit(function(e){
e.preventDefault();
})
function AddTown() {

    var town_name = $('#townName').val();
    var lat = $('#lat').val();
    var lng = $('#lng').val();
    var address = $('#autocomplete_search').val();
    var bool = true;
    var GetAllValues = [];
    var form_type = $('#form_type').val();
    $('#Form').find(('.form-control,.custom-file-container__custom-file__custom-file-input')).each(function (i, obj) {
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
            var town_reference = GetTimeStamp();
            var townref = ref(realdb, `Towns/${town_reference}`);
            setNode(townref,{
                townLatitude:lat,
                townid:town_reference,
                townlogitude:lng,
                townname:town_name,
                address:address,
            })
                .then(function(){
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
            var townref = ref(realdb, `Towns/${Id}`);
            updateNode(townref,{
                townLatitude:lat,
                townlogitude:lng,
                townname:town_name,
                address:address,
            })
                .then(function(){
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
function showTimeSlotModal(Id){
    $('#doc_id').val(Id);
    const towns = ref(realdb, 'Towns/' + Id);
    onValue(towns, (snapshot) => {
        if (snapshot) {
            var data = snapshot.val();
            var timeSlots = data.time_slots??[];
            $('#TimeSlotDesc').html("");
            $('#AppendSlot').html("");
            timeSlots.forEach(function(item){
                $('#TimeSlotDesc').append(`<p>${item}</p>`);
                var slot = `
                <div class="row mt-2">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Time Slot<label>
                            <input type="text" class="form-control timeSlots" value="${item}"/>
                        </div>
                    </div>
                    <div class="col-md-6" style="margin-top: 21px;">
                        <button class="btn btn-primary" onclick="RemoveThis(this)" type="button">
                            Remove
                        </button>
                    </div>
                </div>
                `;
                $('#AppendSlot').append(slot);
            })
            $('#editTimeSlot').hide();
            $('#editButtonDiv').show();
            $('#timeSlotModal').modal('show');
        }
    })
}

function hideEditSection(){
    $('#editTimeSlot').hide();
    $('#editButtonDiv').show();
}
function EditTimeSlots(){
    $('#editTimeSlot').show();
    $('#editButtonDiv').hide();
}
function AddNewSlot(){
    var slot = `
    <div class="row mt-2">
        <div class="col-md-6">
            <div class="form-group">
                <label>Time Slot<label>
                <input type="text" class="form-control timeSlots"/>
            </div>
        </div>
        <div class="col-md-6" style="margin-top: 21px;">
            <button class="btn btn-primary" onclick="RemoveThis(this)" type="button">
                Remove
            </button>
        </div>
    </div>
    `;
    $('#AppendSlot').append(slot);
}
function RemoveThis(element){
    $(element).parent().closest('.row').remove();
}
function UpdateTimeSlots(){
    var doc_id = $('#doc_id').val();
    var Ids = [];
    $('.timeSlots').each(function(index,obj){
        var s = $(obj).val();
        Ids.push(s);
    });
    var townref = ref(realdb, `Towns/${doc_id}`);
    $('#update_time_slots').addClass('btn-progress');
    updateNode(townref,{
        time_slots: Ids,
    })
        .then(function(){
            $('#update_time_slots').removeClass('btn-progress');
            MixinSweet("Updated Successfully","","success",2000);
            $('#editTimeSlot').hide();
            $('#editButtonDiv').show();
        })
        .catch(function(error){
            console.log(error);
        })
}