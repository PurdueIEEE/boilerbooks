<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="">
  <meta name="author" content="">

  <title><?php echo $title;?></title>

  <!-- Bootstrap Core CSS -->
    <link href="/css/bootstrap.css" rel="stylesheet">

  <!-- Custom CSS -->
    <link href="/css/landing-page.css" rel="stylesheet">

  <!-- Custom Fonts -->
    <link href="/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="/text/css">
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic,700italic" rel="stylesheet" type="/text/css">

  <!--favicon link-->
    <link rel="SHORTCUT ICON" href="/favicon.ico">
    <link rel="apple-touch-icon" href="https://www.ieee.org/ucm/groups/webassets/@ieee/@web/@org/documents/images/ieee_apple_touch_icon.png">


  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
  <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
  <![endif]-->

  <!-- Jquery used for various things such as datatables and date entry -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>

  <!-- Stuff for datatables -->
    <link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.11/css/jquery.dataTables.css">
    <script type="text/javascript" charset="utf8" src="//cdn.datatables.net/1.10.11/js/jquery.dataTables.js"></script>
  
  <!-- Used for date entry -->
    <script type="text/javascript" src="//cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script type="text/javascript" src="//cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.js"></script>
    <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.css" />



  <style>
  legend {
    display: block;
    padding-left: 2px;
    padding-right: 2px;
    padding-top: 48px;
    border: none;
  }
  body {
    padding-top: 0px;
  }
  .disabledTab{
    pointer-events: none;
  }
  </style>
</head>

<body>
  <!-- Navigation -->
  <nav class="navbar navbar-default" role="navigation">
    <div class="container">
    <div class="navbar-header">
      <a class="navbar-brand" href="http://purdueieee.org">IEEE</a>
    </div>
    <ul class="nav navbar-nav">
      <li><a href="/user/updateuser.php"><?php echo $_SESSION['user'] ?></a></li>
      <li><a href="/user/signout.php"><?php if ($_SESSION['user'] != '') {echo "Sign-out";}?></li>
    </ul>
  </div>

    <!-- /.container -->
  </nav>
