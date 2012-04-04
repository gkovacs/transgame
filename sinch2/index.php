<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" 
 "http://www.w3.org/TR/html4/frameset.dtd">
<html>
<head>
<title>Sinch Tasks</title>
<script type="text/javascript" src="http://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js"></script> 
<script type="text/javascript" src="turkit-lib.js"></script>
<script type="text/javascript" src="XPath.js"></script>
<script type="text/javascript" src="sinch.js"></script>

<link href="sinch.css" rel="stylesheet" type="text/css">
</head>
<body style="margin:0px;">
<div id="proxy_form">
  <div id="query_input">
    <h1> <span id="task_header">Query <span id="task_num"></span></span>  </h1>
    
    Please listen to the spoken query and provide an answer.

    <!--<h3><span id="query" name="query"></span></h3>-->

    <form id="myform" action="." method="POST">
 
      <div class="label">
      <span id="query_audio"></span><br/>
        
        You must use the browser below to search for the answer. <br />        
        Please copy and paste the information you find from the browser.
        
      </div>
      
      <div class="text-input"><textarea id="answer" name="answer" rows="6" cols="60"></textarea></div>

      <input type="hidden" id="assignmentId" name="assignmentId"/>

      <input type="submit" name="submitter" id="submitter" value="Submit Your Answer"/>

    </form>
  </div>
  <div id="address_input">
    <form>
      <label for="address">Address:</label> <input id="address" type="text" size="80" name="address" value="http://www.google.com/" />
      <input type="submit" id="go" name="go" value="Go" />
    </form>
  </div>
</div>
<iframe src="proxy.php?proxyurl=aHR0cDovL3d3dy5nb29nbGUuY29tLw==" id="browser_frame" name="browser_frame" />
</body>
</html>
