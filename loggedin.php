<?php
	$title = 'Boiler Books';
	include 'menu.php';
?>


<div class = "container">
<h2>Welcome to Boiler Books Beta!</h2>
<p>This is IEEE's new expense and income tracking system. This will initially be used to keep track of ROV purchases.
You should be able to submit expenses for approval and reimbursment. If you have the appropriate level of permissions
you can also approve purchases, process donations, and view committee expenses. If you have any questions please send us an
<a href="mailto:ieee-officers@purdueieee.org">email</a> and also view the guide below.</p>
</div>


<div class="container">
	<div class = "row">
		<div class="col-md-1">
			<a class="btn btn-info" href = "user/updateuser.php" roll = "button">Update Info/Password</a>
		</div>
		<div class="col-md-4">
		</div>
		<div class="col-md-1">
			<a class="btn btn-info" href = "guide.php" roll = "button">Guide</a>
		</div>
		<div class="col-md-5">
		</div>
		<div class="col-md-1">
			<a href = "user/signout.php" class="btn btn-info" roll="button">Sign Out</a>
		</div>
	</div>
</div>
</html>
<?php
	include 'smallfooter.php';
?>
