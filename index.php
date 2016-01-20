<?php
$title = 'Boiler Books';
include 'header.php';
?>

<div class="container">
	<h1 class = "text-center"><a href="/loggedin.php">Boiler Books</a></h1>
	<h4 class = "text-center">The ultimate expense and income tracking system for student organizations</h4>
	<ul class="nav nav-tabs">
		<li class="disabled disabledTab"><a href="#">Request Purchase</a></li>
		<li class="disabled disabledTab"><a href="#">Complete Purchase</a></li>
		<li class="disabled disabledTab"><a href="#">Approve Purchase</a></li>
		<li class="disabled disabledTab"><a href="#">View My Purchases</a></li>
		<li class="disabled disabledTab"><a href="#">View Committee Expenses</a></li>
		<li class="disabled disabledTab"><a href="#">Receive Donation</a></li>
	</ul>
</div>

<div class="container">

	<form class="form-signin" action="login.php" method="post">
		<h3 class="form-signin-heading">Please sign in</h3>
		<label for="inputEmail" class="sr-only">Username</label>
		<input type="text" id="usr" name="usr" class="form-control" placeholder="Your Boiler Books user account" required autofocus>
		<label for="inputPassword" class="sr-only">Password</label>
		<input type="password" id="psw" name = "psw" class="form-control" placeholder="Password" required>


		<div class="form-group">
			<button id="submit" name="submit" class="btn btn-primary">Sign in</button>
		</div>


		<a href = "user/newuser.php" class="btn btn-lg btn-block">New User</a></button>

	</form>

</div> <!-- /container -->




<?php
include 'smallfooter.php';
?>
