<?php
// get all the variables from POST
$queryId = $_POST['queryId']; // unique id of query
$answer = $_POST['answer']; // answer to the query
$urls = $_POST['urls']; // json encoded list of visited urls

// start the database connection
$dbhost='mysql.csail.mit.edu';
$dbuser='Sinch';
$dbpass='searchintelligently';

$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql');

$dbname = 'Sinch_v2';
mysql_select_db($dbname) or die ('Error, could not access database ' . $dbname);

// insert the answer data into the db
$queryAddAnswer = "INSERT INTO answers (answer, qid) VALUES ('$answer', '$queryId')";

$resultsAddAnswer = mysql_query($queryAddAnswer) or die('Error, insert query failed: ' .
		  $queryAddAnswer . "\n" . mysql_error());

$answerId = mysql_insert_id();

// simplify answer text for string matching later on
$simplifiedAnswer = strtolower(str_replace(" ", "", $answer)); // remove spaces and caps

// insert each url
$url_list = json_decode(stripslashes($urls));
$i = 0;
foreach ($url_list as $url_object) {
  $queryAddUrl = "INSERT INTO urls (url, title, url_index, aid)
               VALUES ('$url_object->url', '$url_object->title', '$i', '$answerId')";

  $resultsAddUrl = mysql_query($queryAddUrl) or die('Error, insert query failed: ' .
                    $queryAddUrl . "\n" . mysql_error());

  $urlId = mysql_insert_id();

  // insert each selection for the url
  foreach ($url_object->selections as $selection_object) {
    $simplifiedSelection = strtolower(str_replace(" ", "", $selection_object->selected_text)); // remove spaces and caps
    if (strpos($simplifiedAnswer, $simplifiedSelection) !== false) {
       $queryAddSelection = "INSERT INTO selections (selected_text, start_container, start_offset,
                          end_container, end_offset, common_ancestor, uid) VALUES ('$selection_object->selected_text',
                          '$selection_object->start_container', '$selection_object->start_offset',
                          '$selection_object->end_container', '$selection_object->end_offset',
                          '$selection_object->common_ancestor', '$urlId')";

       $resultsAddSelection = mysql_query($queryAddSelection) or die('Error, insert query failed: ' .
                            $queryAddSelection . "\n" . mysql_error());
    }
  }

  $i++;
}

// increment the answer count for the query
$queryIncrementCnt = "UPDATE queries SET cnt=cnt+1 WHERE id='$queryId'";

$resultsIncrementCnt = mysql_query($queryIncrementCnt) or die('Error, update query failed: ' .
		     $queryIncrementCnt . "\n" . mysql_error());

echo "";
?>
