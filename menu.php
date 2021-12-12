<?php
	session_start();
	if (!isset($_SESSION['user']))
	{
		$headerinfo = "Location: /index.php?returnto=" . $_SERVER['REQUEST_URI'];
		header($headerinfo);

		die();
	}

	include 'header.php';

	function echoActive($name) {
		if($name == @$g_active_page) {
			echo "active";
		}
	}

	function active($name) {
		return $name == @$g_active_page ? "active" : "";
	}
?>

<!-- The menu that is displayed on (nearly) every page -->
<!-- it also contains code to test if one is logged in and if not does not allow page access -->
<!-- It should be included on every page (or other suitable login checking code) -->


<div class="container">
	<div class = "containter">
		<h1 class = "text-center"><a href="/loggedin.php">Boiler Books</a></h1>
	</div>
	<h4 class = "text-center">The ultimate expense and income tracking system for student organizations</h4>

	<ul class="nav nav-tabs">
		<li class = <?php echoActive("request"); ?>><a href="/request/">Request Purchase</a></li>

		<?php
		if ($_SESSION['viewApprovePurchase'] >= 1) {
			echo '<li class = ' . active("approve") . '><a href="/approve/">Approve Purchase</a></li>';
		}
		?>

		<li class = <?php echoActive("complete"); ?>><a href="/complete/">Complete Purchase</a></li>

		<li class = <?php echoActive("viewmy"); ?>><a href="/mypurchases/">View Purchases</a></li>

		<?php

		if ($_SESSION['viewCommitteeExpenses'] >= 1) {
			echo '<li class = ' . active("committee") . '><a href="/committee/">Committee Expenses</a></li>';
		}

		if ($_SESSION['viewReceiveDonation'] >= 1) {
			echo '<li class = ' . active("donation") . '><a href="/donation/">Receive Donation</a></li>';
		}

		if ($_SESSION['viewTreasurer'] >= 1) {
			echo '<li class = ' . active("treasurer") . '><a href="/treasurer/">Treasurer</a></li>';
		}

		if ($_SESSION['viewIncome'] >= 1) {
			echo '<li class = ' . active("income") . '><a href="/income/">Income</a></li>';
		}
		?>

		<li class = <?php echoActive("dues"); ?>><a href="/dues/">Dues</a></li>

	</ul>
</div>
