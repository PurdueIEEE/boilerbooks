<?php 
	session_start();
	if (!isset($_SESSION['user']))
	{
		header("Location: ../index.php");
		die();
	}
?>

<?php 
	$title = 'Kyle Rakos';
	include '../header.php';
?>

<body>
<div class="container">
  <h1 class = "text-center"><a href="../loggedin.php">Boiler Books</a></h1>
  <h4 class = "text-center">The ultimate expense and income tracking system for student organizations</h4>
  <ul class="nav nav-tabs">
    <li><a href="../newpurchase.php">Request Purchase</a></li>
    <li><a href="../completepurchase.php">Complete Purchase</a></li>
    <li><a href="../approvepurchase.php">Approve Purchase</a></li>
    <li><a href="../viewmypurchases.php">View My Purchases</a></li>
	<li><a href="../committeeexpenses.php">View Committee Expenses</a></li>
	<li><a href="../donation.php">Receive Donation</a></li>
  </ul>
</div>
   
    <!-- Page Content -->

	<form class="form-horizontal" action="changepasswordprocessing.php" method="post">
<fieldset>

<!-- Form Name -->
<legend></legend>

<!-- Select Basic -->

<!-- Text input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="cost">Old Password</label>  
  <div class="col-md-4">
  <input id="oldpassword" name="oldpassword" type="password" placeholder="*****" class="form-control input-md" required="">
    
  </div>
</div>

<div class="form-group">
  <label class="col-md-4 control-label" for="cost">New Password</label>  
  <div class="col-md-4">
  <input id="password1" name="password1" type="password" placeholder="*****" class="form-control input-md" required="">
    
  </div>
</div>

<div class="form-group">
  <label class="col-md-4 control-label" for="cost">Reenter New Password</label>  
  <div class="col-md-4">
  <input id="password2" name="password2" type="password" placeholder="*****" class="form-control input-md" required="">
    
  </div>
</div>

<!-- Button -->
<div class="form-group">
  <label class="col-md-4 control-label" for="submit"></label>
  <div class="col-md-4">
    <button id="submit" name="submit" class="btn btn-primary">Submit</button>
  </div>
</div>

</fieldset>
</form>


		

	

<?php include '../smallfooter.php';?>
