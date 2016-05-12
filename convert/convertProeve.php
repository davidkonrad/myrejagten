<?

include('Db.php');

class ConvertProeve extends Db {
	private $file = '';
	private $dataset = '';
	
	public function __construct($file, $dataset) {
		parent::__construct();

		$this->file = $file;
		$this->dataset = $dataset;

		mysql_set_charset('utf8');
  }

	private function fixDate($date) {
		$d = explode('/', $date);
		if (count($d)==3) {
			return $d[2].'-'.$d[0].'-'.$d[1];
		} else {
			return false;
		}
	}

	public function run() {
		if (($handle = fopen($this->file, "r")) !== false) {
			$this->fieldNames = fgetcsv($handle, 1000, ';');

			echo '<pre>';
			print_r($this->fieldNames);
			echo '</pre>';

			$total=0;
			$count=0;
			
			while (($record = fgetcsv($handle, 1000, ';')) !== false) {
				$array = array();
				$index = 0;

				foreach ($this->fieldNames as $fieldName) {
					$array[$fieldName] = $record[$index];
					$index++;
				}

				echo '<pre>';
				print_r($array);
				echo '</pre>';

				//insert lokalitet
				$SQL='insert into lokalitet (presentationString, X_GPS, Y_GPS, latitude, longitude) values('.
					$this->q($array['Lokalitet']) .					
					$this->q($array['X_GPS']) .
					$this->q($array['Y_GPS']) .
					$this->q($array['Latitude']) .
					$this->q($array['Longitude'], false) .
				')';
				$lokalitet_id = $this->insertQuery($SQL);

				//insert proeve			
				$SQL='insert into proeve (proeve_nr, lokalitet_id, indsamlingsdato, Analyseret, Indsamler, Mailadresse, '.
											'ProeverModtaget, DatoForEkst, ElueretI, ngUl, AntalKuverter, SNM_Adresse, kommentar, dataset) values('.
					$this->q($array['Proevenummer']) .
					$this->q($lokalitet_id) .
					//$this->q($this->fixDate($array['DatoForIndsamling'])) .
					$this->q($array['DatoForIndsamling']) .
					
					//$this->q($this->fixDate($array['Analyseret'])) .
					$this->q('') .
		
					$this->q($array['Indsamler']) .
					$this->q($array['Email']) .
					//$this->q($this->fixDate($array['ProeverModtaget'])) .
					$this->q($array['ProeverModtaget']) .
					//$this->q($this->fixDate($array['DatoForEkst'])) .
					$this->q($array['DatoForEkst']) .
					$this->q($array['ElueretI']) .
					$this->q($array['ngUl']) .

					//$this->q($array['AntalKuverter']) .
					$this->q('') .

					//$this->q($array['SNM_Adresse']) .
					$this->q('') .

					$this->q($array['Note']) .
					$this->q($array['Dataset'], false) .
				')';

				echo $SQL.'<br>';

				$this->exec($SQL);
			}
		}
	}

	private function resetTable($table) {
		$SQL='delete from '.$table;
		$this->exec($SQL);
		$SQL='alter table '.$table.' AUTO_INCREMENT = 1';
		$this->exec($SQL);
	}

	public function emptyTables() {
		$this->resetTable('proeve');
		$this->resetTable('lokalitet');
	}

				
}
/*
$convert = new ConvertProeve('../projectdata/snm2014.csv', 'SNM2014');
$convert->emptyTables();
$convert->run();

$convert = new ConvertProeve('../projectdata/snm2015.csv', 'SNM2015');
$convert->run();
*/

$convert = new ConvertProeve('../projectdata/DNA&liv_Prøveliste02.csv', '');
$convert->emptyTables();
$convert->run();

?>
