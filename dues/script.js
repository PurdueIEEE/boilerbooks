const namePattern  = /^([a-zA-Z0-9-_'.]+\s*){2,}$/g;
const emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
const idPattern = /00[0-9]{8}/;

function committee_boxes_to_string(group_id) {
    let committee = $(`#${group_id}.committees-checkbox`).map(function() {
        return this.checked ? this.value : "";
    }).get().filter(s => s.length > 0).join(",");
    if(committee == "") {
        committee = "None";
    }
    return committee;
}


function validate_member(name, email, id, committee, amount) {
    let error = "";

    if(!namePattern.test(name)) {
        error = "Please make sure the name only contains a-z, 0-9, ., ', -, or _. <BR>";
    }

    if(!emailPattern.test(email)) {
        error += "Please make sure the email is valid. <BR>";
    }

    id = id.match(idPattern);

    if(id == null) {
        error += "Please enter a valid id (10 numbers). <BR>";
    } else {
        id = id[0];
    }

    if(error.length > 0) {
        $(".alert-danger").html(error);
        $("#error-box").show();
        return [false, {}]
    } else {
        return [true, {
            name: name,
            email: email,
            id: id,
            committee: committee,
            fiscalyear: '<?=$current_fiscal_year?>',
            amount: 0
        }];
    }
}

function submit_me() {
    let name = $("#txt-my-name-input").val();
    let email = $("#txt-my-email-input").val();
    let id = $("#nud-my-id-input").val();

    let committee = committee_boxes_to_string("ckgroup-committees-add-me");

    let [valid, post_data] = validate_member(name, email, id, committee, 0);

    if(valid) {
        $.post("add_exist.php", post_data);
    }
}


function submit_comte() {
    let name = $("#txt-comte-name-input").val();
    let email = $("#txt-comte-email-input").val();
    let id = $("#nud-comte-id-input").val();

    let committee = committee_boxes_to_string("ckgroup-committees-committee-new");

    let [valid, post_data] = validate_member(name, email, id, committee, 0);

    if(valid) {
        // $.post("add_exist.php", post_data);
        console.log(post_data);
    }
}


function submit_mark_paid(name, email, committee, year, amount) {
    _submit_internal(name, email, committee, year, amount)
}

$(document).ready(function() {
    $('#btn-add-me-submit').submit((event) => {
        event.preventDefault();
        submit_me();
    });
    $('#btn-add-comte-submit').submit((event) => {
        event.preventDefault();
        submit_comte();
    });
    $('#btn-add-comte-exist-submit').submit((event) => {
        event.preventDefault();
        submit_comte_exist();
    });

    $('#tblPersonDues').DataTable( {
        "order": [[ 0, "desc" ]]
    });

    $('#tblCommitteeDues').DataTable({
        "order": [[ 3, "desc" ]],
        orderCellsTop: true,
        fixedHeader: true,
        stateSave: true,
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
