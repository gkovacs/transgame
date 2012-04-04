<?php
// get all the variables from GET
$phoneId = $_REQUEST['phoneId']; // id of the requesting phone
$lastAnswerId = $_REQUEST['lastAnswerId']; // id of the last answer received on that phone

// start the database connection
$dbhost='mysql.csail.mit.edu';
$dbuser='Sinch';
$dbpass='searchintelligently';

$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql');

$dbname = 'Sinch_v2';
mysql_select_db($dbname) or die ('Error, could not access database ' . $dbname);

$queryGetAnswers = "SELECT answers.id, answers.answer, answers.qid " .
                 "FROM queries, answers " .
                 "WHERE queries.phone_id='$phoneId' " .
                 "AND queries.id=answers.qid " .
                 "AND answers.id>'$lastAnswerId'";

$resultsGetAnswers = mysql_query($queryGetAnswers) or die('Error, select query failed: ' .
                   $queryGetAnswers . "\n" . mysql_error());

// create array of answer objects
$answers = array();
while ($answer = mysql_fetch_object($resultsGetAnswers)) {
  // get all urls corresponding to the current answer
  $queryGetUrls = "SELECT * FROM urls WHERE aid='$answer->id'";

  $resultsGetUrls = mysql_query($queryGetUrls) or die('Error, select query failed: ' .
                  $queryGetUrls . "\n" . mysql_error());

  // create array of url objects
  $urls = array();
  while ($url = mysql_fetch_object($resultsGetUrls)) {
    // get all selections corresponding to the current url
    $queryGetSelections = "SELECT * FROM selections WHERE uid='$url->id'";

    $resultsGetSelections = mysql_query($queryGetSelections) or die('Error, select query failed: ' .
                          $queryGetSelections . "\n" . mysql_error());

    // create array of selection objects
    $selections = array();
    while ($selection = mysql_fetch_object($resultsGetSelections)) {
      // populate fields of selection object
      $selectionObj["selectedText"] = $selection->selected_text;
      $selectionObj["startContainer"] = $selection->start_container;
      $selectionObj["startOffset"] = $selection->start_offset;
      $selectionObj["endContainer"] = $selection->end_container;
      $selectionObj["endOffset"] = $selection->end_offset;
      $selectionObj["commonAncestor"] = $selection->common_ancestor;

      $selections[] = $selectionObj;
    }

    // populate fields of url object
    $urlObj["url"] = $url->url;
    $urlObj["title"] = $url->title;
    $urlObj["url_index"] = $url->url_index;
    $urlObj["selections"] = $selections;

    $urls[] = $urlObj;
  }

  // populate fields of answer object
  $answerObj["id"] = $answer->id;
  $answerObj["answer"] = $answer->answer;
  $answerObj["queryId"] = $answer->qid;
  $answerObj["urls"] = $urls;

  $answers[] = $answerObj;
}

$results["answers"] = $answers;

echo json_encode($results);
?>
