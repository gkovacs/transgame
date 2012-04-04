<?php
	
	//Upload the audio file to people.csail.mit.edu account as specified in Android
	$queryId = $_FILES['queryid']['name'];
	$filename = $queryId . basename( $_FILES['uploadedfile']['name']);
	$target_path = "../audiofiles/" . $filename;
	$absolute_path = "http://people.csail.mit.edu/ttone/sinch2/audiofiles/" . $filename;
	
	#$target_path  = "../audiofiles/";
	#$target_path = $target_path . $queryId . basename( $_FILES['uploadedfile']['name']);
	#$absolute_path = "http://people.csail.mit.edu/ttone/sinch2/
	
	if(move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)) 
	{
 		echo "The file ".  basename( $_FILES['uploadedfile']['name']). " has been uploaded";
	} 
	else
	{
 		echo "There was an error uploading the file, please try again!";
	}
	
	//Set up database connection
	$dbhost='mysql.csail.mit.edu';
	$dbuser='Sinch';
	$dbpass='searchintelligently';
	
	$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql');
	$dbname = 'Sinch_v2';
	mysql_select_db($dbname) or die ('Error, could not access database ' . $dbname);
	
	//Add URL to audio file to the audio table, link to query via queryId
	$queryAddAudio = "INSERT INTO audios (query_id, audio) VALUES ('$queryId', '$absolute_path')";
	
	$resultsAddAudio = mysql_query($queryAddAudio) or die('Error, insert audio failed: ' .
		 $queryAddAudio . "\n" . mysql_error());
	
	
	//////////////////////////////////////////////////////
	//handle audio transcription of file using cURL	//////
	//////////////////////////////////////////////////////
	$google_url = "http://www.google.com/speech-api/v1/recognize?lang=en-us&client=audiowiz.cs.rochester.edu&lm=builtin:dictation";
	$cURL_path = "@" . $target_path;
	
	$ch = curl_init();
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_VERBOSE, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible;)");
    curl_setopt($ch, CURLOPT_URL, $google_url);
    curl_setopt($ch, CURLOPT_POST, true);
	
	curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Content-Type: audio/amr; rate=8000"));
    // same as <input type="file" name="file_box">
    $post = array(
        "file"=> $cURL_path,
    );
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post); 
    $response = curl_exec($ch);
	curl_close($ch);

	$results_array = json_decode($response, true);
	$hypotheses = $results_array[hypotheses];
	$answer = $hypotheses[0][utterance];
	
	
	$queryTranscribeAudio = 'UPDATE queries SET query=' . '"' . $answer . '"' . 'WHERE id = "' . $queryId . '"';
	mysql_query($queryTranscribeAudio);
	
	mysql_close($conn);
	
?>
