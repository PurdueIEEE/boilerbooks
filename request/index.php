<?php
$title = 'Boiler Books';
$requestactive = "active";
include '../menu.php';
?>

<form class="form-horizontal" action="/api/request/" method="post">
  <fieldset>
    <legend></legend>

    <div class="form-group">
      <label class="col-md-4 control-label" for="Committee">Committee</label>
      <div class="col-md-4">
        <select id="committee" name="committee" class="form-control" required="">
          <option value=""></option>
          <option value="General IEEE">General IEEE</option>
          <option value="Aerial Robotics">Aerial Robotics</option>
          <option value="Computer Society">Computer Society</option>
          <option value="EMBS">EMBS</option>
          <option value="Learning">Learning</option>
          <option value="Racing">Racing</option>
          <option value="ROV">ROV</option>
          <option value="Rocket">Rocket</option>
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


<?php include '../smallfooter.php';?>
