<?php
	$title = 'Boiler Books';
	include 'menu.php';
?>


<div class = "container">
<h2>Welcome to Boiler Books!</h2>
<p>Welcome to IEEE's new expense and income tracking system. This will be used to keep track of all purchases for IEEE.
You should have access to the the tools that you need. If you think you should have access to something else send us an email!</p>
</div>


<div class="container">
	<div class = "row">
		<div class="col-md-1">
			<a class="btn btn-info" href = "user/changepassword.php" roll = "button">Change Password</a>
		</div>
		<div class="col-md-10">
			<p>.</p>
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