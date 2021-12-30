<?php
    $title = 'Boiler Books';
    $g_active_page = "dues";
    include '../menu.php';

?>

<?php
include '../dbinfo.php';

function accordion_top($id_insert, $name) {
    return "
    <div class='panel panel-default'>
        <div class='panel-heading'>
            <h4 class='panel-title'>
                <a data-toggle='collapse' href='#ca-$id_insert-body'>$name</a>
            </h4>
        </div>
        <div id='ca-$id_insert-body' class='panel-collapse collapse'>
            <div class='panel-body'>
    ";
}

function accordion_bottom() {
    return "</div></div></div>";
}

function committee_checkboxes($id_insert, $select_committees) {
    echo "<div class='form-group text-dark' id='ckgroup-committees-$id_insert'>
            <div class='col-sm-3'><h5>Committees: </h5></div>
            <div class='col-sm-5' style='padding-left: 35px;'>";

    $committees_ = array('Aerial Robotics', 'Computer Society', 'EMBS', 'MTT-S',
                        'Racing', 'ROV', 'Software Saturdays', 'Growth and Engagement',
                        'Industrial Relations', 'Learning', 'Social');
    foreach($committees_ as $comm) {
        $checked = in_array($comm, $select_committees, true) ? "checked" : "";
        echo "<label class='checkbox'>
            <input type='checkbox' class='committees-checkbox' value='$comm' $checked>$comm</input>
        </label>";
    }

    echo "</div></div>";
}

$my_dues_items = '';
$user_paid_current_year = false;
$committee_dues_items = '';
$committee_member_summary = '';
$deposits_items = '';
$dues_paid_by_year_items = '';
$usr = $_SESSION['user'];
$user_email = $_SESSION['user_email'];

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT D.Name, D.Email, D.Committee, D.Fiscal_Year, D.Amount
        FROM Dues D
        WHERE D.email = '$user_email'";


    // Find the entries for when the current user has paid dues
    $my_last_committee = '';
    foreach($conn->query($sql) as $row) {
        $my_last_committee = $row['Committee'];
        $fiscal_year_i = $row['Fiscal_Year'];
        $my_dues_items .= "<tr>";
        $my_dues_items .= "<td>{$row['Name']}</td>";
        $my_dues_items .= "<td>{$row['Email']}</td>";
        $my_dues_items .= "<td>$my_last_committee</td>";
        $my_dues_items .= "<td>$fiscal_year_i</td>";
        $my_dues_items .= "<td>{$row['Amount']}</td>";
        $my_dues_items .= '</tr>';
        $user_paid_current_year = $user_paid_current_year || ($fiscal_year_i == $current_fiscal_year);
    }
    if($my_last_committee === "None") {
        $my_last_committee = "";
    }
    $my_last_committee = explode(',', $my_last_committee);


    // If the user is a treasurer or president or has committee viewing powers, find those entries
    // Maybe change this to have more access control in the future
    if($_SESSION['viewCommitteeExpenses'] >= 1 || $_SESSION['viewTreasurer'] >= 1) {
        $sql = "SELECT D.Name, D.Email, D.Committee, D.Fiscal_Year, D.Amount, D.duesid FROM Dues D";

        $dues_paid_by_year = array();
        $committee_members_by_year = array();
        $committee_members_by_year_paid = array();
        foreach($conn->query($sql) as $row) {
            $amount = $row['Amount'];
            $fiscal_year_i = $row['Fiscal_Year'];
            $committee_i = $row['Committee'];
            $email = $row['Email'];

            $committee_dues_items .= "<tr>";
            $committee_dues_items .= "<td>{$row['duesid']}</td>";
            $committee_dues_items .= "<td>{$row['Name']}</td>";
            $committee_dues_items .= "<td>$email</td>";
            $committee_dues_items .= "<td>$committee_i</td>";
            $committee_dues_items .= "<td>$fiscal_year_i</td>";
            $committee_dues_items .= "<td>$amount</td>";
            $committee_dues_items .= "<td><a onclick=\"submit_comte_exist('$email')\">Add</a></td>";
            if($_SESSION['viewTreasurer'] >= 1) {
                if($fiscal_year_i == $g_current_fiscal_year) {
                    $committee_dues_items .= "<td><a onclick=\"submit_mark_paid('{$row['duesid']}')\">Mark Paid</a></td>";
                } else {
                    $committee_dues_items .= "<td></td>";
                }
            }
            $committee_dues_items .= '</tr>';

            if(!array_key_exists($fiscal_year_i, $dues_paid_by_year)) {
                $dues_paid_by_year[$fiscal_year_i] = 0;
            }
            $dues_paid_by_year[$fiscal_year_i] += $amount;

            foreach(explode(',', $committee_i) as $committee_name_raw) {
                $committee_name = trim($committee_name_raw);
                if(!array_key_exists($committee_name, $committee_members_by_year)) {
                    $committee_members_by_year[$committee_name] = array();
                    $committee_members_by_year_paid[$committee_name] = array();
                }
                if(!array_key_exists($fiscal_year_i, $committee_members_by_year[$committee_name])) {
                    $committee_members_by_year[$committee_name][$fiscal_year_i] = 0;
                    $committee_members_by_year_paid[$committee_name][$fiscal_year_i] = 0;
                }
                $committee_members_by_year[$committee_name][$fiscal_year_i] += 1;
                $committee_members_by_year_paid[$committee_name][$fiscal_year_i] += ($amount > 0);
            }
        }

        if($_SESSION["viewCommitteeDues"] >= 1) {
            foreach($committee_members_by_year as $committee_name => $committee_one_year) {
                foreach($committee_one_year as $fiscal_year_i => $committee_members) {
                    $nPaid = $committee_members_by_year_paid[$committee_name][$fiscal_year_i];
                    // $percentPaid = round($nPaid / $committee_members * 100);
                    $committee_member_summary .= "<tr>";
                    $committee_member_summary .= "<td>$committee_name</td>";
                    $committee_member_summary .= "<td>$fiscal_year_i</td>";
                    $committee_member_summary .= "<td>$nPaid</td>";
                    $committee_member_summary .= "<td>$committee_members</td>";
                    // $committee_member_summary .= "<td>$percentPaid %</td>";
                    $committee_member_summary .= "</tr>";
                }
            }
        }

        // If it's the treasurer or president, find the dues that have been deposited
        if($_SESSION['viewTreasurer'] >= 1) {
            $sql = "SELECT *, (SELECT CONCAT(U.first, ' ', U.last) FROM Users U WHERE U.username = I.addedby) addedbyname
                FROM Income I
                WHERE LOWER(source) LIKE '%dues%'";

            $dues_totals_by_year = array();
            foreach ($conn->query($sql) as $row) {
                $fiscal_year_i = $row['fiscalyear'];
                $amount = $row['amount'];

                $deposits_items .= "<tr>";
                $deposits_items .= "<td>{$row['incomeid']}</td>";
                $deposits_items .= "<td>{$row['source']}</td>";
                $deposits_items .= "<td>{$row['type']}</td>";
                $deposits_items .= "<td>$amount</td>";
                $deposits_items .= "<td>{$row['status']}</td>";
                $deposits_items .= "<td>{$row['comments']}</td>";
                $deposits_items .= "<td>{$row['committee']}</td>";
                $deposits_items .= "<td>{$row['addedbyname']}</td>";
                $deposits_items .= "<td>$fiscal_year_i</td>";
                $deposits_items .= "<td>{$row['refnumber']}</td>";
                $deposits_items .= "</tr>";

                if(!array_key_exists($fiscal_year_i, $dues_totals_by_year)) {
                    $dues_totals_by_year[$fiscal_year_i] = 0;
                }
                $dues_totals_by_year[$fiscal_year_i] += $amount;
            }

            foreach($dues_paid_by_year as $fiscal_year_i => $year_total) {
                $dues_paid_by_year_items .= "<tr>";
                $dues_paid_by_year_items .= "<td>$fiscal_year_i</td>";
                $dues_paid_by_year_items .= "<td>$year_total</td>";
                if(array_key_exists($fiscal_year_i, $dues_totals_by_year)) {
                    $dues_paid_by_year_items .= "<td>{$dues_totals_by_year[$fiscal_year_i]}</td>";
                } else {
                    $dues_paid_by_year_items .= "<td>0</td>";
                }
                $dues_paid_by_year_items .= "</tr>";
            }
        }
    }
} catch(PDOException $e) {
    error_log($e);
    echo $sql . "<br>" . $e->getMessage();
}

$conn = null;
?>

<script src="https://code.jquery.com/jquery-3.5.1.js"></script>
<script src="https://cdn.datatables.net/1.11.3/js/jquery.dataTables.min.js"></script>

<script type="text/javascript" src="/assets/filter_table.js"></script>
<script type="text/javascript" src="script.js"></script>


<div class="panel-group container" id="dues-collapse-group">
    <?php echo accordion_top("my-dues", "My Dues"); ?>
        <table id="tblPersonDues" class="display">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Committee(s)</th>
                    <th>Year</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <?php echo $my_dues_items; ?>
            </tbody>
        </table>
    <?php echo accordion_bottom(); ?>

    <?php if($user_paid_current_year === false) {
        echo accordion_top("my-add", "Add Myself"); ?>
        <form class="form-horizontal" id="form-add-me" action>
            <div class="form-group text-dark">
                <label for="name-input" class="control-label col-sm-3">Name:</label>
                <div class="col-sm-5">
                    <input class="form-control" id="txt-my-name-input" type="text" required maxlength="100" value="<?php echo $_SESSION['user_full_name']; ?>" disabled>
                </div>
            </div>

            <div class="form-group text-dark">
                <label for="email-input" class="control-label col-sm-3">Email:</label>
                <div class="col-sm-5">
                    <input class="form-control" id="txt-my-email-input" type="email" required maxlength="100" value="<?php echo $user_email ?>" disabled>
                </div>
            </div>

            <div class="form-group text-dark">
            <label for="id-input" class="control-label col-sm-3">Purdue ID:</label>
                <div class="col-sm-5">
                    <?php if($my_dues_items !== '') { ?>
                        <input class="form-control" id="nud-my-id-input" type="number" disabled max="0099999999">
                        <span class="help-block">A hash of your ID is already stored securely in the database.</span>
                    <?php } else { ?>
                        <input class="form-control" id="nud-my-id-input" type="number" required max="0099999999">
                        <span class="help-block">Don't worry: your ID is hashed and stored securely.</span>
                    <?php } ?>
                </div>
            </div>

            <?php echo committee_checkboxes("add-me", $my_last_committee); ?>

            <div class="col-sm-3"></div>
            <input type="submit" class="btn btn-primary" id="btn-add-me-submit">

        </form>
    <?php
        echo accordion_bottom();
    }
    ?>

    <?php
        if($_SESSION['viewCommitteeExpenses'] >= 1 || $_SESSION['viewTreasurer'] >= 1) {
            echo accordion_top("committee-dues", "Committee Dues");
    ?>
        <div class="col-sm-6">
            <h5>Committee Selection for Adding</h5>
            <form class='form'>
            <?php
                echo committee_checkboxes("add-comte-exist", $my_last_committee);
            echo "</form></div>";

            if($_SESSION['viewTreasurer'] >= 1) {
                echo "<div class='col-sm-6'>
                    <h5>Treasurer Payment Amount</h5>
                    <form class='form-horizontal'>
                        <div class='form-group'>
                            <label for='nud-mark-paid-amount' class='control-label col-sm-3'>Amount Paid</label>
                            <div class='col-sm-2'>
                                <input type='number' id='nud-mark-paid-amount' class='form-control' min='0' max='100' value='15'>
                            </div>
                        </div>
                    </form>
                </div>";
            }
            ?>
        <table id="tblCommitteeDues" class="display">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Committee(s)</th>
                    <th>Year</th>
                    <th>Amount</th>
                    <th>Add to chosen Committees</th>
                    <?php if($_SESSION['viewTreasurer'] >= 1) { echo "<th>Mark as paid</th>"; } ?>
                </tr>
            </thead>
            <tbody>
                <?php echo $committee_dues_items; ?>
            </tbody>
        </table>

        <?php
            if($_SESSION["viewCommitteeDues"] >= 1) {
        ?>
            <h4>Committee Summary</h4>
            <p>Note: Not all members of committees may have been added to the database and are listed. Consult committee chairs for internal rosters.</p>
            <table id="tblCommitteeSummary" class="display">
                <thead>
                    <tr>
                        <th>Committee</th>
                        <th>Year</th>
                        <th>Paying Members</th>
                        <th>Total Reported Members</th>
                        <!-- <th>Percent</th> -->
                    </tr>
                </thead>
                <tbody>
                    <?php echo $committee_member_summary; ?>
                </tbody>
            </table>
        <?php
            }
        ?>
    <?php echo accordion_bottom(); ?>

    <?php echo accordion_top("committee-add", "Add to Committee (New Member)"); ?>

        <form class="form-horizontal" id="form-add-comte">
            <div class="form-group text-dark">
                <label for="txt-comte-name-input" class="control-label col-sm-3">Name:</label>
                <div class="col-sm-5">
                    <input class="form-control" id="txt-comte-name-input" type="text" required maxlength="100" placeholder="Scott Block">
                </div>
            </div>

            <div class="form-group text-dark">
                <label for="txt-comte-email-input" class="control-label col-sm-3">Email:</label>
                <div class="col-sm-5">
                    <input class="form-control" id="txt-comte-email-input" type="email" required maxlength="100" placeholder="purduepete@purdue.edu">
                </div>
            </div>

            <div class="form-group text-dark">
                <label for="nud-comte-id-input" class="control-label col-sm-3">Purdue ID:</label>
                <div class="col-sm-5">
                    <input class="form-control" id="nud-comte-id-input" type="number" max="0099999999" placeholder="0012346578">
                </div>
                <span class="help-block">Your id is hashed and stored securely.</span>
            </div>

            <?php echo committee_checkboxes("committee-new", $my_last_committee); ?>

            <div class="col-sm-3"></div>
            <input type="submit" class="btn btn-primary">
        </form>

    <?php echo accordion_bottom(); ?>

    <?php
        if ($_SESSION['viewTreasurer'] >= 1) {
            echo accordion_top("dues-treas", "Treasurer/President Totals");
    ?>

        <table id="tblDuesYearlySummary" class="display">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>Amount Collected</th>
                    <th>Amount Deposited</th>
                </tr>
            </thead>
            <tbody>
                <?php echo $dues_paid_by_year_items ?>
            </tbody>
        </table>

        <table id="tblDuesDeposits" class="display">
            <thead>
                <tr>
                    <th>Income ID</th>
                    <th>Source</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Comments</th>
                    <th>Committee</th>
                    <th>Added by</th>
                    <th>Year</th>
                    <th>Ref Number</th>
                </tr>
            </thead>
            <tbody>
                <?php echo $deposits_items ?>
            </tbody>
        </table>

    <?php
        echo accordion_bottom();
        }  // viewTreasurer

        }  // view committee or treasurer
    ?>


</div>



<?php
    include '../smallfooter.php';
?>
