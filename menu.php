<?php
session_start();
if (!isset($_SESSION['user']))
{
	header("Location: /index.php");
	die();
}
?>
<?php
include 'header.php';
?>

<div class="container">


	<div class = "containter">
	<h1 class = "text-center"><a href="/loggedin.php">Boiler Books</a></h1>
	</div>



	<h4 class = "text-center">The ultimate expense and income tracking system for student organizations</h4>
	<ul class="nav nav-tabs">
		<li class = <?php echo $requestactive?>><a href="/request/">Request Purchase</a></li>
		<li class = <?php echo $approveactive?>><a href="/approve/">Approve Purchase</a></li>
		<li class = <?php echo $completeactive?>><a href="/complete/">Complete Purchase</a></li>
		<li class = <?php echo $mypurchasesactive?>><a href="/mypurchases/">View My Purchases</a></li>
		<li class = <?php echo $committeeactive?>><a href="/committee/">View Committee Expenses</a></li>
		<li class = <?php echo $donationactive?>><a href="/donation/">Receive Donation</a></li>
		<li class = <?php echo $treasuereactive?>><a href="/treasurer/">Treasurer</a></li>
	</ul>
</div>
