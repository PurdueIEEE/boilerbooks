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
    if ($committee == "General IEEE") {
      $general = "selected";
    }
    else if ($committee == "Aerial Robotics") {
      $aerial = "selected";
    }
    else if ($committee == "Computer Society") {
      $computer = "selected";
    }
    else if ($committee == "EMBS") {
      $embs = "selected";
    }
    else if ($committee == "MTT-S") {
      $mtts = "selected";
    }
    else if ($committee == "Professional") {
      $professional = "selected";
    }
    else if ($committee == "Learning") {
      $learning = "selected";
    }
    else if ($committee == "Racing") {
      $racing = "selected";
    }
    else if ($committee == "ROV") {
      $rov = "selected";
    }
    else if ($committee == "Social") {
      $social = "selected";
    }
}

?>

<form class="form-horizontal" action="/api/request/" method="post">
  <fieldset>
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
        <input id="item" name="item" type="text" placeholder="Resistors, screws, etc." class="form-control input-md" required="">
      </div>
    </div>

    <div class="form-group">
      <label class="col-md-4 control-label" for="reason">Reason Being Purchased</label>
      <div class="col-md-4">
        <input id="reason" name="reason" type="text" placeholder="For testing, building claw, etc." class="form-control input-md" required="">
      </div>
    </div>

    <div class="form-group">
      <label class="col-md-4 control-label" for="vendor">Vendor</label>
      <div class="col-md-4">
        <input id="vendor" name="vendor" type="text" placeholder="McMaster, Digikey, etc." class="form-control input-md" required="">
      </div>
    </div>

    <div class="form-group">
      <label class="col-md-4 control-label" for="cost">Cost</label>
      <div class="col-md-4">
        <input id="cost" name="cost" type="number" step = "0.01" placeholder="$156.56" class="form-control input-md" required="">
      </div>
    </div>

    <div class="form-group">
      <label class="col-md-4 control-label" for="comments">Comments</label>
      <div class="col-md-4">
        <textarea class="form-control" id="comments" name="comments"></textarea>
      </div>
    </div>

    <div class="form-group">
      <label class="col-md-4 control-label" for="category">Category</label>
      <div class="col-md-4">
        <input id="category" name="category" type="text" placeholder="Electrical, Mechanical, Software, etc." class="form-control input-md" required="">

      </div>
    </div>

    <div class="form-group">
      <label class="col-md-4 control-label" for="submit"></label>
      <div class="col-md-4">
        <button id="submit" name="submit" class="btn btn-primary">Submit</button>
      </div>
    </div>

  </fieldset>
</form>

<script>
  function categories() {
    var com = document.getElementById('committee').value;
    var title = "index.php?committee=";
    var full = title.concat(com);
    window.location = full;
  }
</script>

<?php include '../smallfooter.php';?>
