<?php
// Request  HTML form
$title = 'Boiler Books';
$requestactive = "active";
include '../menu.php';
include '../dbinfo.php';
?>

<?php
if (isset($_GET['committee'])) {
    $committee = test_input($_GET['committee']);
}

$item = $reason = $vendor = $cost = $comments = '';
if(isset($_GET["item"])) {
    $item = test_input($_GET["item"]);
}
if(isset($_GET["reason"])) {
    $reason = test_input($_GET["reason"]);
}
if(isset($_GET["vendor"])) {
    $vendor = test_input($_GET["vendor"]);
}
if(isset($_GET["cost"])) {
    $cost = test_input($_GET["cost"]);
}
if(isset($_GET["comments"])) {
    $comments = test_input($_GET["comments"]);
}


$categorylist = '';

//$committee = 'ROV';
if ($committee != "") {
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        //$sql = "SELECT purchaseID, item FROM Purchases WHERE Purchases.status = 'Requested'";
        $sql = "SELECT category FROM `Budget`
        WHERE committee='$committee' AND year='$g_current_fiscal_year'";
        //$stmt->execute();


        foreach ($conn->query($sql) as $row) {
            $categorylist .= '<option value="';
            $categorylist .= $row['category'];
            $categorylist .= '">';
            $categorylist .= $row['category'];
            $categorylist .= '</option>\n';
        }
        //echo $categorylist;

    }
    catch(PDOException $e)
    {
        echo $sql . "<br>" . $e->getMessage();
    }
} else {
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        // set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $usr = $_SESSION['user'];
        $sql = "SELECT p.purchaseid, p.committee
            FROM Purchases p
            WHERE p.username = '$usr'
            ORDER BY p.purchaseid DESC";

        $connQuery = $conn->query($sql);
        if($connQuery->rowCount() > 0) {
            $preferred_committee = '';
            foreach ($connQuery as $row) {
                $preferred_committee = $row["committee"];
                break;
            }
            // header("Location:"); does not work since output is already made by menu.php.
            echo "<script type='text/javascript'> document.location = '/request/index.php?committee=$preferred_committee'; </script>";
            exit;
        }
    } catch(PDOException $e) {
        echo $sql . "<br>" . $e->getMessage();
    }
}

$conn = null;
?>





<form class="form-horizontal" action="/api/request/" method="post"><fieldset>
    <legend></legend>

    <div class="form-group">
        <label class="col-md-4 control-label" for="Committee">Committee</label>
        <div class="col-md-4">
            <select id="committee" name="committee" class="form-control" required="" onchange="categories()">
            <?php include '../committees.php'; ?>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-4 control-label" for="item">Item Being Purchased</label>
        <div class="col-md-4">
            <input id="item" name="item" type="text" placeholder="Resistors, screws, etc." class="form-control input-md" required="" maxlength="100" value="<?php echo $item; ?>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-4 control-label" for="reason">Reason Being Purchased</label>
        <div class="col-md-4">
            <input id="reason" name="reason" type="text" placeholder="For testing, building claw, etc." class="form-control input-md" required="" value="<?php echo $reason; ?>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-4 control-label" for="vendor">Vendor</label>
        <div class="col-md-4">
            <input id="vendor" name="vendor" type="text" placeholder="McMaster, Digikey, etc." class="form-control input-md" required="" value="<?php echo $vendor; ?>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-4 control-label" for="cost">Cost</label>
        <div class="col-md-4">
            <input id="cost" name="cost" type="number" step = "0.01" placeholder="$156.56" class="form-control input-md" required="" value="<?php echo $cost; ?>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-4 control-label" for="comments">Comments</label>
        <div class="col-md-4">
            <textarea class="form-control" id="comments" name="comments"><?php echo $comments; ?></textarea>
        </div>
    </div>


    <div class="form-group">
        <label class="col-md-4 control-label" for="category">Category</label>
        <div class="col-md-4">
            <select id="category" name="category" class="form-control input-md" required="">
                <option value="">Select Item</option>
                <?php echo $categorylist; ?>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-4 control-label" for="submit"></label>
        <div class="col-md-4">
            <button id="submit" name="submit" class="btn btn-primary">Submit</button>
        </div>
    </div>

</fieldset></form>

<script>
    function categories() {
        var com = document.getElementById('committee').value;
        var title = "index.php?committee=";
        let item = document.getElementById("item").value;
        if(item != '') {
            item = "&item=" + item;
        }
        let reason = document.getElementById("reason").value;
        if(reason != '') {
            reason = "&reason=" + reason;
        }
        let vendor = document.getElementById("vendor").value;
        if(vendor != '') {
            vendor = "&vendor=" + vendor;
        }
        let cost = document.getElementById("cost").value;
        if(cost != '') {
            cost = "&cost=" + cost;
        }
        let comments = document.getElementById("comments").value;
        if(comments != '') {
            comments = "&comments=" + comments;
        }
        var full = title.concat(com, item, reason, vendor, cost, comments);
        window.location = full;
     }
</script>

<?php include '../smallfooter.php';?>
