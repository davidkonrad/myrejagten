<!doctype html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body>
<?

class Convert  {
	private $CSVFile;

	public function __construct($CSV) {
		$this->CSVFile = $CSV;
		$this->run();
	}

	private function debug($s) {
		echo '<pre>';
		print_r($s);
		echo '</pre>';
	}

	private function run() {
		if (($handle = fopen($this->CSVFile, "r")) !== false) {
			$this->fieldNames = fgetcsv($handle, 1000, ";");
			$json = [];
			while (($record = fgetcsv($handle, 1000, ";")) !== false) {
				$array = array();
				$index = 0;
				foreach ($this->fieldNames as $fieldName) {
					$array[$fieldName] = $record[$index];
				}
				$json[] = $array;
			}
			echo json_encode($json);
		}
	}
}

$c = new Convert('Myrenavne.csv');

?>
