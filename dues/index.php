<?php
    $title = 'Boiler Books';
    $duesactive = "active";
    include '../menu.php';

?>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script type="text/javascript" src="script.js"></script>

<?php
include '../dbinfo.php';
$my_dues_items = '';
$committee_dues_items = '';
$committee_member_summary = '';
$deposits_items = '';
$dues_paid_by_year_items = '';
$dues_totals_by_year_items = '';
$usr = $_SESSION['user'];
$user_email = $_SESSION['user_email'];

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT D.Name, D.Email, D.Committee, D.Year, D.Amount
        FROM Dues D
        WHERE D.email = $user_email";


    // Find the entries for when the current user has paid dues
    foreach($conn->query($sql) as $row) {
        $my_dues_items .= "<tr>";
        $my_dues_items .= "<td>{$row['Name']}</td>";
        $my_dues_items .= "<td>{$row['Email']}</td>";
        $my_dues_items .= "<td>{$row['Committee']}</td>";
        $my_dues_items .= "<td>{$row['Year']}</td>";
        $my_dues_items .= "<td>{$row['Amount']}</td>";
        $my_dues_items .= '</tr>';
    }

    // If the user is a treasurer or president or has committee viewing powers, find those entries
    // Maybe change this to have more access control in the future
    if($_SESSION['viewCommitteeExpenses'] >= 1 || $_SESSION['viewTreasurer'] >= 1) {
        $sql = "SELECT D.Name, D.Email, D.Committee, D.Year, D.Amount FROM Dues D"

        $dues_paid_by_year = array();
        $committee_members_by_year = array();
        $committee_members_by_year_paid = array();
        foreach($conn->query($sql) as $row) {
            $amount = $row['Amount'];
            $fiscal_year_i = $row['Year'];
            $committee_i = $row['Committee'];

            $committee_dues_items .= "<tr>";
            $committee_dues_items .= "<td>{$row['Name']}</td>";
            $committee_dues_items .= "<td>{$row['Email']}</td>";
            $committee_dues_items .= "<td>$committee_i</td>";
            $committee_dues_items .= "<td>$fiscal_year_i</td>";
            $committee_dues_items .= "<td>$amount</td>";
            if($_SESSION['viewTreasurer'] >= 1) {
                if($fiscal_year_i == $current_fiscal_year) {
                    $committee_dues_items .= "<a onclick=\"submit_mark_paid('{$row['Name']}', '{$row['Email']}', '$committee_i', $fiscal_year_i)\">Mark Paid</a>";
                }
            }
            $committee_dues_items .= '</tr>';

            if(!in_array($fiscal_year_i, $dues_paid_by_year)) {
                $dues_paid_by_year[$fiscal_year_i] = 0;
            }
            $dues_paid_by_year[$fiscal_year_i] += $amount;

            foreach($explode(',', $committee_i) as $committee_name) {
                if(!in_array($committee_name, $committee_members_by_year)) {
                    $committee_members_by_year[$committee_name] = array();
                    $committee_members_by_year_paid[$committee_name] = array();
                }
                if(!in_array($fiscal_year_i, $committee_members_by_year[$committee_name])) {
                    $committee_members_by_year[$committee_name][$fiscal_year_i] = 0;
                    $committee_members_by_year_paid[$committee_name][$fiscal_year_i] = 0;
                }
                $committee_members_by_year[$committee_name][$fiscal_year_i] += 1;
                $committee_members_by_year_paid[$committee_name][$fiscal_year_i] += ($amount > 0);
            }
        }

        foreach($committee_members_by_year as $committee_name => $committe_one_year) {
            foreach($committe_one_year as $fiscal_year_i => $committee_members) {
                $committee_member_summary .= "<tr>";
                $committee_member_summary .= "<td>$committee_name</td>";
                $committee_member_summary .= "<td>$fiscal_year_i</td>";
                $committee_member_summary .= "<td>{$$committee_members_by_year_paid[$committee_name][$fiscal_year_i]}</td>";
                $committee_member_summary .= "<td>$committee_members</td>";
                $committee_member_summary .= "</tr>";
            }
        }

        // If it's the treasurer or president, find the dues that have been deposited
        if($_SESSION['viewTreasurer'] >= 1) {
            $sql = "SELECT *
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
                $deposits_items .= "<td>{$row['item']}</td>";
                $deposits_items .= "<td>{$row['status']}</td>";
                $deposits_items .= "<td>{$row['comments']}</td>";
                $deposits_items .= "<td>{$row['committee']}</td>";
                $deposits_items .= "<td>{$row['addedby']}</td>";
                $deposits_items .= "<td>$fiscal_year_i</td>";
                $deposits_items .= "<td>{$row['refnumber']}</td>";
                $deposits_items .= "</tr>";

                if(!in_array($fiscal_year_i, $dues_totals_by_year)) {
                    $dues_totals_by_year[$fiscal_year_i] = 0;
                }
                $dues_totals_by_year[$fiscal_year_i] += $amount;
            }

            foreach($dues_totals_by_year as $fiscal_year_i => $year_total) {
                $dues_totals_by_year_items .= "<tr>";
                $dues_totals_by_year_items .= "<td>$fiscal_year_i</td>";
                $dues_totals_by_year_items .= "<td>$year_total</td>";
                $dues_totals_by_year_items .= "</tr>";
            }

            foreach($dues_paid_by_year as $fiscal_year_i => $year_total) {
                $dues_paid_by_year_items .= "<tr>";
                $dues_paid_by_year_items .= "<td>$fiscal_year_i</td>";
                $dues_paid_by_year_items .= "<td>$year_total</td>";
                $dues_paid_by_year_items .= "</tr>";
            }
        }
    }
} catch(PDOException $e) {
    echo $sql . "<br>" . $e->getMessage();
}

$conn = null;
?>

<div class="accordion" id="constitution-accordion">
    <div class="accordion-item">
        <h2 class="accordion-header" id="ca-my-dues-head">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#ca-my-dues-body" aria-expanded="true" aria-controls="ca-my-dues-body">
                My Dues
            </button>
        </h2>
        <div id="ca-my-dues-body" class="accordion-collapse collapse show" aria-labelledby="ca-my-dues-head">
            <div class="accordion-body">

                <div class="container">
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
                            <?php echo $my_dues_items ?>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>

    <div class="accordion-item">
        <h2 class="accordion-header" id="ca-my-add-head">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#ca-my-add-body" aria-expanded="true" aria-controls="ca-my-add-body">
                Add Myself
            </button>
        </h2>
        <div id="ca-my-add-body" class="accordion-collapse collapse show" aria-labelledby="ca-my-add-head">
            <div class="accordion-body">

                <div class="container">
                    <div class="form-group text-dark">
                        <label for="name-input" style="font-size: 45px;">Name:</label>
                        <input class="form-control input-lg" id="txt-my-name-input" type="text" required maxlength="100" value="<?php echo $my_name ?>" disabled>
                    </div>

                    <div class="form-group text-dark">
                        <label for="email-input" style="font-size: 45px;">Email:</label>
                        <input class="form-control input-lg" id="txt-my-email-input" type="email" required maxlength="100" value="<?php echo $my_email ?>" disabled>
                    </div>

                    <div class="form-group text-dark">
                        <label for="id-input" style="font-size: 45px;">Purdue ID:</label>
                        <input class="form-control input-lg" id="nud-my-id-input" type="number" max="0099999999">
                        <p>This may be blank if your ID is already in the database. Don't worry: it is hashed and stored securely.</p>
                    </div>

                    <div class="form-group text-dark" id="committees" style="font-size: 20px;">
                        <label for="id-input" style="font-size: 45px;">Committees: </label><br />
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Aerial Robotics">Aerial Robotics</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Computer Society">Computer Society</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="EMBS">EMBS</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="MTT-S">MTT-S</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Racing">Racing</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="ROV">ROV</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Software Saturdays">Software Saturdays</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Growth and Engagement">Growth and Engagement</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Industrial Relations">Industrial Relations</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Learning">Learning</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Social">Social</input>
                        </div>
                    </div>

                    <button type="button" class="btn btn-primary btn-lg" id="btn-add-me-submit">Submit</button>
                </div>

            </div>
        </div>
    </div>

    <?php
        if($_SESSION['viewCommitteeExpenses'] >= 1 || $_SESSION['viewTreasurer'] >= 1) {
    ?>
    <div class="accordion-item">
        <h2 class="accordion-header" id="ca-committee-dues-head">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#ca-committee-dues-body" aria-expanded="true" aria-controls="ca-committee-dues-body">
                Committee Dues
            </button>
        </h2>
        <div id="ca-committee-dues-body" class="accordion-collapse collapse show" aria-labelledby="ca-committee-dues-head">
            <div class="accordion-body">

                <div class="container">
                    <?php
                        if() {
                            echo "<input type='number' id='nud-mark-paid-amount' class='form-control input-lg' min='0' max='100'>";
                        }
                    ?>
                    <table id="tblCommitteeDues" class="display">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Committee(s)</th>
                                <th>Year</th>
                                <th>Amount</th>
                                <?php if($_SESSION['viewTreasurer'] >= 1) { echo "<th>Mark as paid</th>"} ?>
                            </tr>
                        </thead>
                        <tbody>
                            <?php echo $committee_dues_items ?>
                        </tbody>
                    </table>

                    <table id="tblCommitteeSummary" class="display">
                        <thead>
                            <tr>
                                <th>Committee</th>
                                <th>Year</th>
                                <th>Paying Members</th>
                                <th>Total Members</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php echo $committee_member_summary ?>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>

    <div class="accordion-item">
        <h2 class="accordion-header" id="ca-committee-add-head">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#ca-committee-add-body" aria-expanded="true" aria-controls="ca-committee-add-body">
                Add to Committee (New Member)
            </button>
        </h2>
        <div id="ca-committee-add-body" class="accordion-collapse collapse show" aria-labelledby="ca-committee-add-head">
            <div class="accordion-body">

                <div class="container">

                    <div class="form-group text-dark">
                        <label for="txt-comte-name-input" style="font-size: 45px;">Name:</label>
                        <input class="form-control input-lg" id="txt-comte-name-input" type="text" required maxlength="100">
                    </div>

                    <div class="form-group text-dark">
                        <label for="txt-comte-email-input" style="font-size: 45px;">Email:</label>
                        <input class="form-control input-lg" id="txt-comte-email-input" type="email" required maxlength="100">
                    </div>

                    <div class="form-group text-dark">
                        <label for="nud-comte-id-input" style="font-size: 45px;">Purdue ID:</label>
                        <input class="form-control input-lg" id="nud-comte-id-input" type="number" max="0099999999">
                        <p>This may be blank if your ID is already in the database. Don't worry: it is hashed and stored securely.</p>
                    </div>

                    <div class="form-group text-dark" id="committees" style="font-size: 20px;">
                        <label for="id-input" style="font-size: 45px;">Committees: </label><br />
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Aerial Robotics">Aerial Robotics</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Computer Society">Computer Society</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="EMBS">EMBS</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="MTT-S">MTT-S</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Racing">Racing</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="ROV">ROV</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Software Saturdays">Software Saturdays</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Growth and Engagement">Growth and Engagement</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Industrial Relations">Industrial Relations</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Learning">Learning</input>
                        </div>
                        <div class="checkbox">
                            <input type="checkbox" class="committees-checkbox" value="Social">Social</input>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary btn-lg" id="btn-add-comte-submit">Submit</button>

                </div>

            </div>
        </div>
    </div>

    <?php
        if ($_SESSION['viewTreasurer'] >= 1) {
    ?>

    <div class="accordion-item">
        <h2 class="accordion-header" id="ca-dues-treas-head">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#ca-dues-treas-body" aria-expanded="true" aria-controls="ca-dues-treas-body">
                Treasurer/President Totals
            </button>
        </h2>
        <div id="ca-dues-treas-body" class="accordion-collapse collapse show" aria-labelledby="ca-dues-treas-head">
            <div class="accordion-body">

                <div class="container">
                    <table id="tblDuesYearlySummaryPaid" class="display">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Amount Collected</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php echo $dues_paid_by_year_items ?>
                        </tbody>
                    </table>

                    <table id="tblDuesYearlySummaryDeposited" class="display">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php echo $dues_totals_by_year_items ?>
                        </tbody>
                    </table>

                    <table id="tblDuesDeposits" class="display">
                        <thead>
                            <tr>
                                <th>Income ID</th>
                                <th>Source</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Item</th>
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
                </div>

            </div>
        </div>
    </div>

    <?php
        }  // viewTreasurer
    ?>

    <?php
        }  // view
    ?>

    <script src="../filter_table.js"></script>
    <script>
        $(document).ready(function() {
            $('#tblPersonDues').DataTable( {
                "order": [[ 0, "desc" ]]
            });

            $('#tblCommitteeDues').DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                initComplete: make_filterable,
            });
        });
    </script>

</div>



<?php
    include '../smallfooter.php';
?>
