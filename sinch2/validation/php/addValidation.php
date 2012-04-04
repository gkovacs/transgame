<?php
// get all variables from POST
$aid = $_POST['answerId'];
$uid = $_POST['urlId'];
$text = $_POST['copiedText'];
$validate = $_POST['validateBool'];

// start the database connection
$dbhost='mysql.csail.mit.edu';
$dbuser='Sinch';
$dbpass='searchintelligently';

$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql');

$dbname = 'Sinch_v2';
mysql_select_db($dbname) or die ('Error, could not access database ' . $dbname);

//insert into validation table
$queryAddValidation = "INSERT INTO validation (aid, uid, text, validate) VALUES ('$aid', '$uid', '$text', '$validate')";
$resultsAddValidation = mysql_query($queryAddValidation) or die('Error, insert query failed: ' .
		  $queryAddAnswer . "\n" . mysql_error());


// increment the answer count for the query
$answerIncrementCnt = "UPDATE answers SET val_cnt=val_cnt+1 WHERE id='$aid'";

$resultsIncrementCnt = mysql_query($answerIncrementCnt) or die('Error, update query failed: ' .
		     $queryIncrementCnt . "\n" . mysql_error());

echo "";
?>
