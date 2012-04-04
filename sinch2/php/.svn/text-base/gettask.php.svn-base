<?php
// get all the variables from POST
$prev_queries = $_POST['prev_queries']; // ids of queries previously used in the batch
if ($prev_queries == null) {
   $prev_queries_list = array();
} else {
  $prev_queries_list = json_decode(stripslashes($prev_queries));
}

// start the database connection
$dbhost='mysql.csail.mit.edu';
$dbuser='Sinch';
$dbpass='searchintelligently';

$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql');

$dbname = 'Sinch_v2';
mysql_select_db($dbname) or die ('Error, could not access database ' . $dbname);

$queryGetLeastAnswered = "SELECT * FROM queries ORDER BY cnt ASC";

$resultsGetLeastAnswered = mysql_query($queryGetLeastAnswered) or die('Error, select query failed: ' .
			 $queryGetLeastAnswered . "\n" . mysql_error());

while ($query = mysql_fetch_object($resultsGetLeastAnswered)) {
  // if we get a query that wasn't used before, then choose to use it
  if (!in_array($query->id, $prev_queries_list)) {
    break;
  }
}

//retrieving the audio for the query
$queryGetAudio = "SELECT audio FROM audios WHERE query_id = " . $query->id;
$resultsGetAudio = mysql_query($queryGetAudio) or die('Error, getting query failed: ' .
			 $queryGetAudio . "\n" . mysql_error());
$audio = mysql_fetch_object($resultsGetAudio);

$results = array($query, $audio);

// echo the results
echo "(" . json_encode($results) . ")";
?>
