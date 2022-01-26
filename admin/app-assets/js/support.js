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
var addDoc;
var setDoc;
$(async function () {
    await import('/assets/Firebase/Firebase.js').then(function (exports) {
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
    addDoc = exportData.addDoc;
    setDoc = exportData.setDoc;
    createTable();
})
async function createTable() {
    $("#table-1").DataTable().destroy();
    $("#dataTable").html('');
    const usersRef = collection(db, "support");
    const q = query(usersRef, orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);
    try {
        if (querySnapshot.size > 0) {
            var count = 0;
            var users = [];
            querySnapshot.forEach(function (doc) {
                count++;
                console.log(count);
                var data = doc.data();
                if (data.status == 1) {
                    var label = '<div class="custombadge-outline col-green custombadge-shadow">Resolved</div>';
                    var action = '';
                }
                else if (data.status == 0) {
                    var label = '<div class="custombadge-outline col-indigo custombadge-shadow">Pending</div>';
                    var action = '<a style="color: #fff;cursor:pointer;margin-right:4px;" onclick="showResolveModal(\'' + doc.id + '\',\'' + data.subject + '\',\'' + data.user_id + '\')" class="btn btn-success badge-shadow"><i class="fas fa-check-circle"></i></a>';
                }
                var created_at = data.created_at.toDate();
                created_at = $.format.date(created_at, 'd-MMM-yyyy');
                var subject = data.subject;
                var user_id = data.user_id;
                var message = data.message;
                var user_email = data.user_email;

                //Address Node
                var nodeId = "m-" + doc.id;
                var values = '<input type="hidden" id="m-' + doc.id + '" value="' + message + '" />';
                var addressAction = '<a style="color: #fff;cursor:pointer;" onclick="showAddressModal(\'' + nodeId + '\')" class="btn btn-primary badge-shadow"><i class="fas fa-eye"></i></a>';
                //values
                if (data.status == 0) {
                    var row = '<tr data-row="1"><td>'+count+'</td><td><p class="mb-0 font-13 pdt10 text-center" data-user="' + user_id + '"></p></td><td><p class="mb-0 font-13 pdt10 text-center">' + subject + '</p></td><td>' + addressAction + '</td><td>' + created_at + '</td><td> ' + label + '</td><td>' + action + values + '</td></tr>';
                }
                else if (data.status == 1) {
                    var row = '<tr data-row="2"><td>'+count+'</td><td><p class="mb-0 font-13 pdt10 text-center" data-user="' + user_id + '"></p></td><td><p class="mb-0 font-13 pdt10 text-center">' + subject + '</p></td><td>' + addressAction + '</td><td>' + created_at + '</td><td> ' + label + '</td><td>' + action + values + '</td></tr>';
                }
                if (!users.includes(user_id)) {
                    users.push(user_id);
                }
                $('#dataTable').append(row);
            })
        }
        else {
            MixinSweet("No data to show", "", "info", 2000);
        }
        getAllUsers(users);
        
    }
    catch (ex) {
        console.log(ex);
    }
}

function getAllUsers(users) {
    var length = users.length;
    users.forEach(function (item) {
        var docRef = doc(db, "users", item);
        getDoc(docRef)
            .then((querySnapshot) => {
                if (querySnapshot.exists) {
                    var data = querySnapshot.data();
                    if (data.image && data.image != "") {
                        var image_url = data.image;
                    }
                    else {
                        var image_url = "/assets/app-assets/App icon.png";
                    }
                    var user = '<p class="text-center utitle"><div class="image-link text-center"><img style="width:30px;height:30px;" src="' + image_url + '"></p><h6 class="mb-0 font-13 pdt10 text-center">' + data.name + '</h6>';
                    $("#dataTable").find("[data-user='" + item + "']").html(user);
                }
                else {
                    console.log("not", item);
                }
            })
            .then(function (ref) {
                if (users.indexOf(item) == (length - 1)) {
                    var table = $('#table-1').DataTable();
                    $.fn.dataTable.ext.search.pop();
                    table.draw();
                    $('#approve_tab').removeClass('active');
                    $('#all').addClass('active');
                    $('#pending_tab').removeClass('active');
                }
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

    });
}


$("#all_tab").click(function () {
    $('#Page').html("All Queries");
    $('#all_tab').addClass('active');
    $('#approve_tab').removeClass('active');
    $('#pending_tab').removeClass('active');
    var table = $('#table-1').DataTable();
    $.fn.dataTable.ext.search.pop();
    table.draw();
});
$("#pending_tab").click(function () {
    $('#Page').html("Pending Queries");
    $('#all_tab').removeClass('active');
    $('#approve_tab').removeClass('active');
    $('#pending_tab').addClass('active');
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
$("#approve_tab").click(function () {
    $('#Page').html("Resolved Queries");
    $('#all_tab').removeClass('active');
    $('#approve_tab').addClass('active');
    $('#pending_tab').removeClass('active');
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

function showResolveModal(doc_id, userId,title) {
    $('#docId').val(doc_id);
    Swal.fire({
        title: 'Are you sure you want to approve?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm!'
    }).then((result) => {
        if (result.isConfirmed) {
            resolveEntity(userId, title);
        }
    })
}
function resolveEntity(title,userId ) {
    var doc_id = $('#docId').val();
    var docRef = doc(db, "support", doc_id);
    updateDoc(docRef, {
        status: 1,
    }).then(async function (ref) {
        var docref = doc(db, "users", userId);
        getDoc(docref)
            .then(function (docSnap) {
                if (docSnap.exists) {
                    var data = docSnap.data();
                    var notifyDocRef = doc(db, "notifications", new Date().getTime().toString());
                    setDoc(notifyDocRef, {
                        created_at: new Date(),
                        is_seen: false,
                        message: "Your query against " + title + " has been resolved.",
                        notification_type: 9,
                        key: new Date().getTime().toString(),
                        notify_by: "admin@elitewash.com",
                        notify_to: userId,
                        title: "Query Approved!"
                    })
                        .then(async function (ref) {
                            var formdata = {
                                "notification": {
                                    "title": "Query Approved!",
                                    "body": "Your query against " + title + " has been resolved.",
                                    "android_channel_id": "channel_name",
                                    "channel_id": "channel_name",
                                    "sound": "default",
                                    "priority": "high"
                                },
                                "apns": {
                                    "payload": {
                                        "aps": {
                                            "sound": "default"
                                        }
                                    }
                                },
                                "priority": "high",
                                "data": {
                                    "click_action": "FLUTTER_NOTIFICATION_CLICK",
                                    "type": 9
                                },
                                "to": data.fcm_id,
                            };
                            const rawResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
                                method: 'POST',
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                    "Authorization": "key=AAAAo7CnV3k:APA91bGozZikCGaULOrr94mMOYfa4q1_ygqju1tKs33DRFa2KFNGk0WLhsoR3qnQRwwXaQ4QE-vIuqRI2vZc_AOBxsoNnYbrK7Jv6H-iEXPpYGiYUb0oHSJeFyzLnhYjqSYel7JkKDKv"
                                },
                                body: JSON.stringify(formdata)
                            });

                            const content = await rawResponse.json();
                            console.log(content);
                            TimerSweet("Query Approved!", 'Query is successfully resolved', "success", 2000);
                            console.log("Document successfully updayted!");
                            createTable();
                        })
                        .catch(function (error) {
                            sweetMessage('Warning!', error.message, 'error');
                            console.log(error);
                        });
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    })
        .catch(function (error) {
            sweetMessage("Warning!", error.message, "error");
            console.log("Error getting documents: ", error);
        });
}
function showAddressModal(nodeId) {
    var addressBody = $('#' + nodeId).val();
    $('#addressBody').html(addressBody);
    $('#addressModal').modal('show');
}
