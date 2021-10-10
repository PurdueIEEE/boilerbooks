const namePattern  = /^([a-zA-Z0-9-_'.]+\s*){2,}$/g;
const emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;


function submit_me() {
    let name = $("#txt-my-name-input").val();
    let email = $("#txt-my-email-input").val();
    let id = $("#nud-my-id-input").val();

    let committee = $(".committees-checkbox").map(function() {
        return this.checked ? this.value : "";
    }).get().filter(s => s.length > 0).join(", ");
    if(committee == "") {
        committee = "None";
    }

    _submit_internal(name, email, id, committee, 0);
}


function submit_me() {
    let name = $("#txt-my-name-input").val();
    let email = $("#txt-my-email-input").val();
    let id = $("#nud-my-id-input").val();

    let committee = $(".committees-checkbox").map(function() {
        return this.checked ? this.value : "";
    }).get().filter(s => s.length > 0).join(", ");
    if(committee == "") {
        committee = "None";
    }

    _submit_internal(name, email, id, committee, 0);
}


function _submit_internal(name, email, id, committee, amount) {
    let error = "";

    if (!namePattern.test(name)) {
        error = "Please make sure the name only contains a-z, 0-9, ., ', -, or _. <BR>";
    }

    if (!emailPattern.test(email)) {
        error += "Please make sure the email is valid. <BR>";
    }

    id = id.match(/00[0-9]{8}/);

    if(id == null) {
        error += "Please enter a valid id (10 numbers). <BR>";
    } else {
        id = id[0];
    }

    if (error.length > 0) {
        $(".alert-danger").html(error);
        $("#error-box").show();
    } else {
        $.post("add_me.php", {
            name: name,
            email: email,
            id: id,
            committee: committee,
            fiscalyear: '<?=$current_fiscal_year?>',
            amount: 0
        });
    }
}

function submit_mark_paid(name, email, committee, year, amount) {
    _submit_internal(name, email, committee, year, amount)
}

$(document).ready(() => {
    $('#btn-add-me-submit').submit((event) => {
        event.preventDefault();
        submit_me();
    });
    $('#btn-add-comte-submit').submit((event) => {
        event.preventDefault();
        submit_comte();
    });

    $('#tblPersonDues').DataTable( {
        "order": [[ 0, "desc" ]]
    });

    $('#tblCommitteeDues').DataTable({
        orderCellsTop: true,
        fixedHeader: true,
        initComplete: make_filterable,
    });
});
