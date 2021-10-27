function committee_boxes_to_string(group_id) {
    let committee = $(`#${group_id} .committees-checkbox`).map(function() {
        return this.checked ? this.value : "";
    }).get().filter(s => s.length > 0).join(",");
    if(committee == "") {
        committee = "None";
    }
    return committee;
}


function validate_member(name, email, id, committee) {
    let namePattern  = /^([a-zA-Z0-9-_'.]+\s*){2,}$/g;
    let emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    let idPattern = /00[0-9]{8}/;

    let error = "";

    if(!namePattern.test(name)) {
        error = "Please make sure the name only contains a-z, 0-9, ., ', -, or _. <BR>";
    }

    if(!emailPattern.test(email)) {
        error += "Please make sure the email is valid. <BR>";
    }

    let id_match = id.match(idPattern);

    let id_post = '';
    if(id_match != null) {
        id_post = id[0];
    }

    if(error.length > 0) {
        console.log(error);
        // $(".alert-danger").html(error);
        // $("#error-box").show();
        return [false, {}]
    } else {
        return [true, {
            name: name,
            email: email,
            id: id_post,
            committee: committee,
        }];
    }
}

function post_success(data, textStatus, response) {
    if(response.status == 200) {
        alert("Success! Refresh to see new results.");
    } else {
        alert("Your request was not completed.");
    }
    console.log(response);
}

function post_fail(response, textStatus, errorThrown) {
    if(response.status == 200) {
        alert("Success! Refresh to see new results.");
    } else {
        alert("Your request was not completed." + response.responseText);
    }
    console.log(response);
}

function submit_me() {
    let name = $("#txt-my-name-input").val();
    let email = $("#txt-my-email-input").val();
    let id = $("#nud-my-id-input").val();

    let committee = committee_boxes_to_string("ckgroup-committees-add-me");

    let [valid, post_data] = validate_member(name, email, id, committee);

    if(valid) {
        let posting = $.post("add_me.php", post_data, function(data) {console.log(data);}, 'json');
        post_post_alert(posting);
    }
}


function submit_comte() {
    let name = $("#txt-comte-name-input").val();
    let email = $("#txt-comte-email-input").val();
    let id = $("#nud-comte-id-input").val();

    let committee = committee_boxes_to_string("ckgroup-committees-committee-new");

    let [valid, post_data] = validate_member(name, email, id, committee);

    if(valid) {
        $.post("add_new.php", post_data)
            .done(post_success)
            .fail(post_fail);
    }
}

function submit_comte_exist(duesid) {
    let committee = committee_boxes_to_string("ckgroup-committees-add-comte-exist");

    $.post("add_exist.php", {
        committee: committee,
        duesid: duesid
    }).done(post_success)
        .fail(post_fail);
}


function submit_mark_paid(duesid) {
    let amount = $("#nud-mark-paid-amount").val();
    $.post("set_payment.php", {
        duesid: duesid,
        amount: amount
    }).done(post_success)
        .fail(post_fail);
}

$(document).ready(function() {
    $('#form-add-me').submit(function(event) {
        event.preventDefault();
        submit_me();
    });
    $('#form-add-comte').submit(function(event) {
        event.preventDefault();
        submit_comte();
    });

    $('#tblPersonDues').DataTable( {
        "order": [[ 0, "desc" ]]
    });

    $('#tblCommitteeDues').DataTable({
        "order": [[ 3, "desc" ]],
        stateSave: true,
        orderCellsTop: true,
        fixedHeader: true,
        initComplete: function() {
            make_filterable(this.api(), "tblCommitteeDues");
        }
    });

    $('#tblCommitteeSummary').DataTable({
        "order": [[1, "desc" ], [0, "asc"]]
    });

    $('#tblDuesYearlySummary').DataTable( {
        "order": [[ 0, "desc" ]]
    });

    $('#tblDuesDeposits').DataTable( {
        "order": [[ 0, "desc" ]]
    });
});
