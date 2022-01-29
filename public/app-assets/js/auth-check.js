var exportData;
var db;
var collection;
var doc;
var getDoc;
var auth;
$(async function () {
    await import('/app-assets/js/firebase.js').then(function (exports) {
        exportData = exports;
    });
    db = exportData.db;
    doc = exportData.doc;
    collection = exportData.collection;
    getDoc = exportData.getDoc;
    auth = exportData.auth;
    var getaUth = auth.getAuth();
    var notifyIds = [];
    auth.onAuthStateChanged(getaUth, async function (user) {
        if (user) {
            const docRef = doc(db, "admin", user.email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                var data = docSnap.data();
                $('#uid').val(docSnap.id);
                $('#email').val(docSnap.id);
                if (data.role == 0) {
                    notifyIds = [1, 2, 3, 4];
                    $('.user-role').html("Admin");
                    $(".imageUrl").attr('src', data.image_url);
                    $(".userImage").attr('src', data.image_url);
                    $('#username').val(data.name);
                    $('#username2').val(data.name);
                    if (data.name.length > 16) {
                        var substr = data.name.substr(0, 14)
                        $('#nav-user-name').html(substr + "..");
                    }
                    else {
                        $('#nav-user-name').html(data.name);
                    }
                    $('.userName').html(data.name);
                    $('.user-name').html(data.name);
                }
                else {
                    firebase
                        .auth()
                        .signOut()
                        .then(function () {
                            window.location = 'login';
                        })
                        .catch(function (error) {
                        });
                }
            }
            $(".loader").fadeOut("slow");
        }
        else {
            console.log(user);
            window.location.href = "login";
        }
    });
})


