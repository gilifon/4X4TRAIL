<? 
  //MySQL DATA
  $DBHost = "localhost";
  $DBUser = "iarcorg";
  $DBPassword = "Rw6Ach!@";
  $DBName = "iarcorg_4x4trail";
  $Link = mysql_connect($DBHost,$DBUser,$DBPassword) or die('Error: ' . mysql_error());
  mysql_select_db($DBName,$Link);
  mysql_query("SET SESSION time_zone = 'Asia/Jerusalem'", $Link);

  //mysql_set_charset('hebrew',$Link);

  mysql_set_charset('utf8',$Link);
  mysql_query("SET NAMES 'utf8'");
?>