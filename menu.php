<?php
session_start();
if (!isset($_SESSION['user']))
{
	$headerinfo = "Location: /index.php?returnto=" . $_SERVER['REQUEST_URI'];
	header($headerinfo);

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
		
		<?php
			if ($_SESSION['viewApprovePurchase'] >= 1) {
				echo '<li class = ' . $approveactive . '><a href="/approve/">Approve Purchase</a></li>';
			}
		?>

		<li class = <?php echo $completeactive?>><a href="/complete/">Complete Purchase</a></li>
		
		<li class = <?php echo $mypurchasesactive?>><a href="/mypurchases/">View My Purchases</a></li>
		
		<?php 
			if ($_SESSION['viewCommitteeExpenses'] >= 1) {
				echo '<li class = ' . $committeeactive . '><a href="/committee/">View Committee Expenses</a></li>';
			}
		?>
		
		<?php 
			if ($_SESSION['viewReceiveDonation'] >= 1) {
				echo '<li class = ' . $donationactive . '><a href="/donation/">Receive Donation</a></li>';
			}
		?>

		<?php 
			if ($_SESSION['viewTreasurer'] >= 1) {
				echo '<li class = ' . $treasuereactive . '><a href="/treasurer/">Treasurer</a></li>';
			}
		?>
		
	</ul>
</div>
