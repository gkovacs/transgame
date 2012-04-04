<?php
// get all the variables from GET
$queryId = $_REQUEST['phoneId']; // unique id of phone
$audioPath = 

// start the database connection
$dbhost='mysql.csail.mit.edu';
$dbuser='Sinch';
$dbpass='searchintelligently';

$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql');

$dbname = 'Sinch_v2';
mysql_select_db($dbname) or die ('Error, could not access database ' . $dbname);

// insert the query data into the db
$queryAddQuery = "INSERT INTO queries (query, cnt, phone_id) VALUES ('$query', 0, '$phoneId')";

$resultsAddQuery = mysql_query($queryAddQuery) or die('Error, insert query failed: ' .
		 $queryAddQuery . "\n" . mysql_error());

// add the query id to the results array
$results['queryId'] = mysql_insert_id();

// return the results as a json object
echo json_encode($results);
?>
