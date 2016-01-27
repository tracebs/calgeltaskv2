<html>
<head>
</head>
<body>
<?php
	$now = time();
	$yesterday = $now - 86400;
	echo "Start - ".date("D, d M Y H:i:s",$yesterday)."<br>";
	$stryesterday = date("D, d M Y H:i:s",$yesterday);
	@include_once 'amoCRM_include.php';
	
	$echostr = "";
	$strhookmanager = "";
	$strcontactid = "27773516";
	$strtasktypeid = "184758";
	
	if ( function_exists('fncAmocrmRemoveTasks') ){
		$var = fncAmocrmRemoveTasks($strAmocrmCookieFile,$stryesterday,$strcontactid,$strtasktypeid);				
		echo "<br>Answer:".$var."<br>";
	}
	
		
	echo "Finish - ".date("h:i:s")."<br>";	
	//mail("rsdim@rambler.ru","Subj hook started","json:"."!".$var);
?>
</body>
</html>