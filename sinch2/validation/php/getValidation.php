<?php
// get all the variables from POST
$prev_answers = $_POST['prev_answers']; // ids of queries previously used in the batch

if ($prev_answers == null) {
   $prev_answers_list = array();
} else {
  $prev_answers_list = json_decode(stripslashes($prev_answers));
}

// start the database connection
$dbhost='mysql.csail.mit.edu';
$dbuser='Sinch';
$dbpass='searchintelligently';

$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql');

$dbname = 'Sinch_v2';
mysql_select_db($dbname) or die ('Error, could not access database ' . $dbname);

//get least validated answer from answers
$queryGetLeastValidated = "SELECT * FROM answers ORDER BY val_cnt ASC, qid DESC";
$resultsGetLeastValidated = mysql_query($queryGetLeastValidated) or die('Error, select query failed: ' .
			 $queryGetLeastAnswered . "\n" . mysql_error());

while ($answer = mysql_fetch_object($resultsGetLeastValidated)) {
  // if we get an answer that wasn't used before, then choose to use it
  if (!in_array($answer->id, $prev_answers_list)) {
    break;
  }
}

//retrieving the last URL visited to achieve the answer
$queryGetURL = "SELECT id, url FROM urls WHERE aid = " . $answer->id . " ORDER BY url_index DESC LIMIT 1";
$resultsGetURL = mysql_query($queryGetURL) or die('Error, getting URL failed: ' .
			 $queryGetURL . "\n" . mysql_error());
$url = mysql_fetch_object($resultsGetURL);

//retrieving the audio for the query
$queryGetAudio = "SELECT audio FROM audios WHERE query_id = " . $answer->qid;
$resultsGetAudio = mysql_query($queryGetAudio) or die('Error, getting query failed: ' .
			 $queryGetAudio . "\n" . mysql_error());
$audio = mysql_fetch_object($resultsGetAudio);

//retrieving the query so we can sort on mturk
$queryGetQuery = "SELECT * FROM queries WHERE id = " . $answer->qid;
$resultsGetQuery = mysql_query($queryGetQuery) or die('Error, getting query failed: ' .
			 $queryGetQuery . "\n" . mysql_error());
$query = mysql_fetch_object($resultsGetQuery);

$results = array($answer, $url, $audio, $query);

// echo the results
echo "(" . json_encode($results) . ")";
?>
